// ------------------------------------------------------------------------------------------------------------------------
//
//           ██ ██████ ██████ ██     
//           ██ ██     ██     ██     
//  ██ ██    ██ ██     ██     ██     
//  ██ ██    ██ ██████ █████  ██     
//   ███     ██     ██ ██     ██     
//  ██ ██    ██     ██ ██     ██     
//  ██ ██ █████ ██████ ██     ██████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// xJSFL - Rapid development framework for extending Adobe Flash

	/**
	 * http://www.xjsfl.com
	 * 
	 * Copyright 2011, Dave Stewart
	 * Licence: http://www.xjsfl.com/license
	 *
	 */

	// --------------------------------------------------------------------------------
	// setup
	
		// temp variables for framework setup
			var xjsflPath = FLfile.uriToPlatformPath(xjsfl.uri).replace(/\\/g, '/');
			
		// temp output object, needed before libraries are loaded
			if( ! xjsfl.settings )
			{
				xjsfl.settings	= {debugLevel:(window['debugLevel'] != undefined ? debugLevel : 1)};
				xjsfl.output =
				{
					trace: function(message){ if(xjsfl.settings.debugLevel > 0){ fl.trace('> xjsfl: ' + message) } },
					error: function(message){ fl.trace('> xjsfl: error "' + message + '"') }
				}
			}
	
		 // if pre-CS4, extend FLfile to add platform to uri conversion (needs to be loaded in advance because of various file / path operations during setup)
			if( ! FLfile['platformPathToURI'] )
			{
				var path = 'core/jsfl/libraries/flfile.jsfl';
				xjsfl.output.trace('Loading "{xJSFL}/' +path+ '"');
				fl.runScript(xjsfl.uri + path);
			}
			
	// --------------------------------------------------------------------------------
	// methods
	
		// toString function
			xjsfl.toString = function()
			{
				return '[class xJSFL]';
			}
	
		// document check function
			xjsfl.__defineGetter__
			(
				'dom',
				function()
				{
					var dom = fl.getDocumentDOM();
					if(dom)
					{
						return dom;
					}
					else
					{
						alert('A document (.fla) needs to be open before running this command.');
						return false;
					}
				}
			);
			
		// currently-running script dir
			xjsfl.__defineGetter__
			(
				'scriptDir',
				function()
				{
					var stack = xjsfl.utils.getStack();
					return xjsfl.utils.makeURI(stack[1].path);
				}
			);

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██    ██   ██                   
//  ██            ██    ██                        
//  ██     █████ █████ █████ ██ █████ █████ █████ 
//  ██████ ██ ██  ██    ██   ██ ██ ██ ██ ██ ██    
//      ██ █████  ██    ██   ██ ██ ██ ██ ██ █████ 
//      ██ ██     ██    ██   ██ ██ ██ ██ ██    ██ 
//  ██████ █████  ████  ████ ██ ██ ██ █████ █████ 
//                                       ██       
//                                    █████       
//
// ------------------------------------------------------------------------------------------------------------------------
// Settings - Core settings and cached variables

	/**
	 * 
	 */
	xjsfl.settings =
	{
		/**
		 * Application data
		 * Information about the Flash version the user is currently running
		 */
		app:
		{
			// Apple: "mac" | Windows: "win"
				platform:	fl.version.substr(0, 3).toLowerCase(),
				
			// the product name of flash, i.e. CS4
				name:		(function(){
								var version = fl.version.match(/\w+ (\d+)/)[1];
								var name = {'9':'CS3', '10':'CS4', '11':'CS5', '12':'CS6'};
								return name[version] || 'Unknown';
							})(),
				
			// the integer version of Flash
				version:	parseInt(fl.version.match(/\w+ (\d+)/)[1]),
				
			// the CS version of Flash
				csVersion:	parseInt(fl.version.match(/\w+ (\d+)/)[1]) - 6
				
		},
	
		/**
		 * Folders
		 * The common folders which developers may wish to reference from within scripts or plugins
		 */
		folders:
		{
			xjsfl:		xjsflPath,
			core:		xjsflPath + 'core/',
			modules:	xjsflPath + 'modules/',
			user:		xjsflPath + 'user/',
			config:		fl.configDirectory.replace(/\\/g, '/'),
			swf:		fl.configDirectory.replace(/\\/g, '/') + 'WindowSWF/'
		},

		/**
		 * Search paths
		 * A cache of paths which xJSFL searches in order when loading files
		 * Path arrays are updated automatically when new modules are added
		 */
		paths:
		{
			// properties
				core:	[ xjsflPath + 'core/' ],
				module: [ ],
				user:	[ xjsflPath + 'user/' ],
				
			// methods
				add:function(path, type)
				{
					// variables
						type == type || 'user';
						path = path.replace(/[\/]+$/g, '') + '/';	// ensure a single trailing slash
						
					// module type
						if(type == 'module')
						{
							path = xjsfl.settings.folders.root + 'modules/' + path
						}
						
					// user type - should be absolute
						else
						{
							// check if absolute
						}
						
					// add
						if(this[type].indexOf(path) == -1)
						{
							this[type].push(path);
						}
				},
				
				get:function()
				{
					var paths = xjsfl.settings.paths;
					return paths.core.concat(paths.module).concat(paths.user);
				}
		},
			
		/**
		 * Debug level
		 * Can be set by the developer to trace, alert, or error on xjsfl.output.warn()
		 * 
		 * @type {Number} debug level 0: off, 1:trace, 2:alert, 3:error, 4+: off
		 */
		debugLevel:(window['debugLevel'] != undefined ? debugLevel : 1),
		
		
		/**
		 * Newline character depending on PC or Mac
		 * @type {String} 
		 */
		newLine:fl.version.substr(0, 3).toLowerCase() === 'win' ? '\r\n' : '\n'
			
	}
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██  ██   ██ ██       
//  ██  ██  ██      ██       
//  ██  ██ █████ ██ ██ █████ 
//  ██  ██  ██   ██ ██ ██    
//  ██  ██  ██   ██ ██ █████ 
//  ██  ██  ██   ██ ██    ██ 
//  ██████  ████ ██ ██ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Utils


	/**
	 * Miscellaneous utility functions
	 */
	xjsfl.utils =
	{
		/**
		 * Run each element of an array through a callback function
		 * Used to call functions in a loop without writing loop code or forEach closure, or checking that original argument is an array
		 * 
		 * @param	arr			{Array}		An array of elements to be passed to the callback
		 * @param	func		{Function}	The function to call
		 * @param	params		{Array}		An opptional array of arguments to be passed
		 * @param	argIndex	{Number}	An optional argument index in which the original array element should be passed
		 */
		applyEach:function(arr, func, params, argIndex)
		{
			// defaults
				params 		= params || [];
				argIndex	= argIndex || 0;
			
			// if only a single element is passed, wrap it in an array
				if( ! xjsfl.utils.isArray(arr))
				{
					arr = [arr];
				}
				
			// for each element, call the function with the parameters
				arr.forEach
				(
					function(element)
					{
						var args = [].concat(params);
						args.splice(argIndex, 0, element);
						func.apply(this, args)
					}
				)
				
			// return
				return this;
		},
		
		/**
		 * Extends an object or array with more properties or elements
		 * 
		 * @param obj {Object|Array} The source object or array to be extended
		 * @param props {Object|Array} The properties or elements to be added
		 * @returns {Object|Array} Returns the modified object or array
		 */
		extend:function(obj, props)
		{
			// variables
				var prop;
				
			// extend array
				if(xjsfl.utils.isArray(obj) && xjsfl.utils.isArray(props))
				{
					for(var i = 0; i < props.length; i++)
					{
						obj.push(props[i]);
					}
				}
			
			// extend object
				else if (typeof props === "object")
				{
					for ( var i in props )
					{
						// getters / setters
							var g = props.__lookupGetter__(i), s = props.__lookupSetter__(i);
							if ( g || s )
							{
								if ( g ) obj.__defineGetter__(i, g);
								if ( s ) obj.__defineSetter__(i, s);
							}
							
						// normal property
							else
							{
								obj[i] = props[i];
							}
					}
				}
				
			// return
				return obj;
		},
		
		trim:function(string)
		{
			return String(string || '').replace(/(^\s*|\s*$)/g, '');
		},
		
		/**
		 * Create a valid URI from a supplied string
		 * Function has the same internal functionality as makePath()
		 * 
		 * @param	str			{String}	An absolute path, relative path, or uri
		 * @param	context		{String}	An optional context (uri or path), from which to start the URI
		 * @param	context		{Boolean}	An alternative optional Boolean indicating to automatically derive the URI from the calling function's file location
		 * @returns				{String}	An absolute URI
		 * @see								xjsfl.utils#makePath
		 */
		makeURI:function(str, context)
		{
			// if str is already a URI, no need to convert so return immediately
				if(str.indexOf('file:') == 0)
				{
					return str;
				}
				
			// if an additional filepath is passed in, the returned URI will be relative to it
				if(typeof context === 'string')
				{
					context = context.replace(/[^\/\\]+$/, '');
					str		= xjsfl.utils.makePath(context) + str;
				}
				
			// if context is true, then the returned URI will be relative to the calling script
			// if str is true, the returned URI will be the folder of the calling script
				else if(context === true || str === true)
				{
					var stack	= xjsfl.utils.getStack();
					var path	= stack[1].path;
					str			= xjsfl.utils.makePath(path) + (str === true ? '' : str);
				}
				
			//TODO If an empty string is passed back, the system assumes the URI is the root. This could be dangerous (especialy if files are to be deleted!) so consider throwing an error, or passing back xJSFL core
				
			// return the final URI using the system FLfile commands
				return str ? FLfile.platformPathToURI(xjsfl.utils.makePath(str)) : '';
		},
		
		
		/**
		 * Create a valid path from a supplied string
		 * 
		 * Function will:
		 * 
		 * - convert file:/// to paths
		 * - convert <xjsfl> and <config> tokens
		 * - convert relative paths to absolute from <xjsfl> folder
		 * - replace multiple / and \ with /
		 * - resolve ../ tokens to correct parent folder
		 * 
		 * @param	str			{String}	An absolute path, relative path, or uri
		 * @param	shorten		{Boolean}	An optional boolean to return a path with <xjsfl> or <config> swapped out from the actual path
		 * @returns				{String}	An absolute or shortened path
		 */
		makePath:function(str, shorten)
		{
			// if a URI is passed in, just convert it
				if(str.match(/^file:\/\/\//))
				{
					path = FLfile.uriToPlatformPath(str);
				}
				else
				{
					path = str;
				}
				
			// convert <config> and <xjsfl> tokens
				path = path
					.replace(/^.*<config>/g, xjsfl.settings.folders.config)
					.replace(/^.*<xjsfl>/g, xjsfl.settings.folders.xjsfl);
				
			// if a relative path is passed in, convert it to absolute from the xJSFL root
				if( ! xjsfl.utils.isAbsolutePath(path))
				{
					path = xjsflPath + path;
				}
				
			// replace backslashes
				path = path.replace(/\\+/g, '/');
				
			// replace double-slashes
				path = path.replace(/\/+/g, '/');
				
			// resolve ../
				while(path.indexOf('../') > -1)
				{
					path = path.replace(/\/[^\/]+\/\.\.\//, "/");
				}
				
			// optionally, shorten path
				if(shorten)
				{
					path = path
						.replace(xjsfl.settings.folders.config, 'Configuration/')
						.replace(xjsfl.settings.folders.xjsfl, 'xJSFL/');
				}
				
			// return
				return path
		},
		
		/**
		 * Checks if a path is absolute or not
		 * 
		 * @param path {String} The path to the file
		 * @returns {Boolean} True (absolute) or False (relative)
		 */
		isAbsolutePath:function(path)
		{
			if(xjsfl.settings.platform == 'mac')
			{
				return path.substr(0, 1).replace('\\', '/') == '/';
			}
			else
			{
				return path.match(/^[A-Z]:/i);
			}
		},
		
		/**
		 * Checks if the object is an array or not
		 * 
		 * @param obj {Object} Any object that needs to be checked if it's a true Array
		 * @returns {Boolean} True or false
		 */
		isArray:function (obj)
		{
			return toString.call(obj) === "[object Array]";
		},
		
		/**
		 * Turns a single value into an array
		 * It either returns an existing array, splits a string at delimiters, or wraps the single value in an array
		 * 
		 * @param	value	{Value}
		 * @param	delim	{String|RegExp}
		 * @returns		
		 */
		toArray:function(value, delim)
		{
			// if delimiter is not supplied, default to any non-word character
				delim = delim || /\W+/;
				
			// if the value is already an array, return
				if(xjsfl.utils.isArray(value))
				{
					return value;
				}
				
			// if the value is a string, start splitting
				else if(typeof value === 'string')
				{
					// trim
						value = xjsfl.utils.trim(value);
						
					// if RegExp, split
						if(delim instanceof RegExp)
						{
							delim.global = true;
							return value.split(rx2);
						}
						
					// if RegExp, split
						else
						{
							var rx1	= new RegExp('^[\s' +delim+ ']+|[\s' +delim+ ']+$', 'g'); // trim
							var rx2	= new RegExp('\s*' +delim+ '\s*', 'g'); // split 
							return value.replace(rx1, '').split(rx2);
						}
					
				}
				return [value];
		},
		
		/**
		 * Returns a unique array without any duplicate items
		 * 
		 * @param	arrIn	{Array}		Any array
		 * @returns			{Array}		A unique array
		 * @author	Dave Stewart	
		 */
		toUniqueArray:function(arr)
		{
			var arrOut	= [];
			var i		= -1;
			while(i++ < arr.length - 1)
			{
				if(arrOut.indexOf(arr[i]) === -1)
				{
					arrOut.push(arr[i]);
				}
			}
			return arrOut;
		},
		
		/**
		 * Get an Array of values from an Object, or an Array of Arrays/Objects from an Array of Objects
		 * 
		 * @param	input	{Array}		An Object or an array of Objects
		 * @param	prop	{String}	The name of a property to collect
		 * @param	prop	{Array}		The names of properties to collect
		 * @param	prop	{Boolean}	A Boolean indicates you want to collect ALL properties
		 * @param	option	{Boolean}	If passing and returning a single object, pass true to make it unique. If returning a 2D array, pass true to return Objects
		 * @returns			{Array}		A new 1D or 2D Array
		 */
		getValues:function(input, prop, option)
		{
			// variables
				var output	= [];
				var i		= -1;
				var single	= false;
				prop		= prop || true;
				
			// convert input to array if just a single object
				if(xjsfl.utils.getClass(input) !== 'Array')
				{
					input	= [input];
					single	= true;
				}
				
			// collect all values?
				if(prop === true)
				{
					prop = xjsfl.utils.getKeys(input[0]);
				}
				
			// double loop for multiple properties
				if(this.isArray(prop))
				{
					// variables
						var props	= prop;
						var output	= new Array(input.length);
						
					// return objects
						if(option)
						{
							while(i++ < input.length - 1)
							{
								output[i] = {};
								for(var j = 0; j < props.length; j++)
								{
									output[i][props[j]] = input[i][props[j]];
								}
							}
						}
						
					// return arrays
						else
						{
							while(i++ < input.length - 1)
							{
								output[i] = new Array(props.length);
								for(var j = 0; j < props.length; j++)
								{
									output[i][j] = input[i][props[j]];
								}
							}
						}
				}
			
			// single loop for collecting only a single property
				else
				{
					while(i++ < input.length - 1)
					{
						if( ! option || (option && output.indexOf(input[i][prop]) === -1) )
						{
							output.push(input[i][prop]);
						}
					}
				}
				
			// return
				return single ? output[0] : output;
		},
		
		/**
		 * Get an object's keys, or all the keys from an Array of Objects
		 * 
		 * @param	obj	{Object}	Any object with iterable properties, or an Array of objects
		 * @returns		{Array}		An array of key names
		 */
		getKeys:function(obj)
		{
			var keys	= [];
			var arr		= obj.constructor === Array ? obj : [obj];
			for(var i = 0; i < arr.length; i++)
			{
				for(var key in arr[i])
				{
					if(keys.indexOf(key) == -1)
					{
						keys.push(key);
					}
				}
			}
			return keys
		},
		
		/**
		 * Get the arguments of a function as an Array
		 * @param	args		{Arguments}		An arguments object
		 * @param	startIndex	{Number}		Optional index of the argument from which to start from
		 * @param	endIndex	{Number}		Optional index of the argument at which to end
		 * @returns				{Array}			An Array of parameters
		 */
		getArguments:function(args, startIndex, endIndex)
		{
			return params = Array.slice.apply(this, [args, startIndex || 0, endIndex || args.length]);
		},

		/**
		 * Get the class of an object as a string
		 * 
		 * @param	value	{value}		Any value
		 * @returns			{String}	The class name of the value i.e. 'String', 'Date', 'CustomClass'
		 */
		getClass:function(obj)
		{
			if (obj != null && obj.constructor && obj.constructor.toSource !== undefined)
			{
				// match constructor function name
					var matches = obj.constructor.toSource().match(/^function\s*(\w+)/);
					if (matches && matches.length == 2)
					{
						// fail if the return value is an anonymous / wrapped Function
							if(matches[1] != 'Function')
							{
								//trace('Constructor')
								return matches[1];
							}
							
						// attempt to grab object toSource() result
							else
							{
								matches = obj.toSource().match(/^function\s*(\w+)/);
								if(matches && matches[1])
								{
									//trace('Source')
									return matches[1];
								}
								
							// attempt to grab object toString() result
								else
								{
									matches = obj.toString().match(/^\[\w+\s*(\w+)/);
									if(matches && matches[1])
									{
										//trace('String')
										return matches[1];
									}
								}
							}
				}
			}
	
			return undefined;
		},
		
		/**
		 * Returns the named SWF panel if it exists
		 * @param	name	{String}	The panel name
		 * @returns			{SWFPanel}	An SWFPanel object
		 */
		getPanel:function(name)
		{
			for(var i = 0; i < fl.swfPanels.length; i++)
			{
				if(fl.swfPanels[i].name == name)
				{
					return fl.swfPanels[i];
				}
			}
			return null;
		},
		
		/**
		 * Returns an array of the the currently executing files, paths, lines, and code
		 * 
		 * @param	error		{Error}		An optional error object
		 * @param	shorten		{Boolean}	An optional Boolean to shorten any core paths with {xjsfl}
		 * @returns				{Array}		An array of the executing files, paths, lines and code
		 */
		getStack:function(error, shorten)
		{
			// variables
				var rxParts		= /^(.*?)@(.*?):(\d+)$/mg;
				var rxFile		= /(.+?)([^\\\/]*)$/;
				
			// error
				error			= error || new Error();
				
			// parse stack
				var matches		= error.stack.match(rxParts);
				
			// parse lines
				var stack		= [];
				var xjsflPath	= FLfile.uriToPlatformPath(xjsfl.uri);
				var parts, fileParts, path, file;
				
				for (var i = 0; i < matches.length; i++)
				{
					// error, file, line number
						rxParts.lastIndex	= 0;
						parts				= rxParts.exec(matches[i]);
						
					// file parts
						fileParts			= (parts[2] || '').match(rxFile);
						path				= fileParts ? fileParts[1] : '';
						file				= fileParts ? fileParts[2] : '';
						
					// stack object
						stack[i] =
						{
							code:parts[1] || '',
							line:parseInt(parts[3]) || '',
							file:file,
							path:(this.makePath(path, shorten))
						};
				}
				
			// return
				return stack;
		},
		
		/**
		 * Parse any string into a real datatype. Supports Number, Boolean, hex (0x or #), XML, Array notation, Object notation, JSON, Date, undefined, null
		 * @param	value	{String}	The input value, usually a string
		 * @param	trim	{Boolean}	An optional flag to trim the string, on by default
		 * @returns		
		 */
		parseValue:function(value, trim)
		{
			// trim
				value = trim !== false ? xjsfl.utils.trim(value) : value;
				
			// undefined
				if(value == 'undefined')
					return undefined;
				
			// null
				if(value == 'null' || value == '')
					return null;
				
			// Number
				if(/^(\d+|\d+\.\d+|\.\d+)$/.test(value))
					return parseFloat(value);
				
			// Boolean
				if(/^true|false$/i.test(value))
					return value === 'true' ? true : false;
				
			// Hexadecimal String / Number
				if(/^(#|0x)[0-9A-F]{6}$/i.test(value))
					return parseInt(value[0] == '#' ? value.substr(1) : value, 16);
				
			// XML
				if(/^<(\w+)\b[\s\S]*(<\/\1>|\/>)$/.test(value))
					return new XML(value);
				
			// Array notation
				if(/^\[.+\]$/.test(value))
					return eval(value);
				
			// Object notation
				if(/^{[a-z]\w*:.+}$/i.test(value))
					return eval('(' + value + ')');
				
			// JSON
				if(/^{"[a-z]\w*":.+}$/i.test(value))
					return JSON.parse(value);
				
			// Date
				if( ! isNaN(Date.parse(value)))
					return new Date(value);
					
			// String
				return value;
		},
		
		/**
		 * Tests a callback and outputs the error stack if the call fails. Add additional parameters after the callback reference
		 * @param	fn	{Function}	The function to test
		 * @returns		
		 */
		test:function(fn)
		{
			// variables
				var source	= fn.toSource();
				source		= source.substring(source.indexOf(' ') + 1, source.indexOf('('));
				//TODO change function name parsing to recognise function() {...}

			// feedback
				xjsfl.output.trace('testing function: "' + source + '"');
				
			// test!
				try
				{
					var params = this.getArguments(arguments, 1);
					fn.apply(this, params);
				}
				catch(err)
				{
					xjsfl.output.error(err, true);
				}
		}
		
	}
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██                ██   
//  ██  ██        ██                ██   
//  ██  ██ ██ ██ █████ █████ ██ ██ █████ 
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██████ █████  ████ █████ █████  ████ 
//                     ██                
//                     ██                
//
// ------------------------------------------------------------------------------------------------------------------------
// Output

	/**
	 * A collection of useful output methods
	 */
	xjsfl.output =
	{
		/**
		 * Framework-only output function
		 */
		trace:function()
		{
			fl.trace('> xjsfl: ' + Array.prototype.slice.call(arguments).join(', '));
		},
		
		/**
		 * Logging function
		 */
		log:function(type, message)
		{
			//TODO Connect this to user / framework settings, so messages are only logged if the setting allows it
			if(xjsfl.settings.debugLevel > 0)
			{
				this.trace(message);
			}
		},
		
		/**
		 * Issue a warning to the user
		 * 
		 * @param message		{String} The message to be displayed
		 * @param debugLevel	{Number} 1 traces the message to the output panel, 2 shows the alert dialog
		 */
		warn:function(message)
		{
			switch(xjsfl.settings.debugLevel)
			{
				case 1:
					this.trace('Warning - ' + message);
				break;
				case 2:
					alert(message);
				break;
				case 3:
					throw new Error('Error: ' + message);
				break;
				default:
					// do nothing
			}
		},

		/**
		 * Traces a human-readable error stack to the Output Panel
		 * 
		 * @param error		{String}	A string defining the main error message
		 * @param error		{Error}		A javaScript Error object
		 * @param testing	{Boolean}	Internal use only. Removes test() stack items
		 */
		error:function(error, testing)
		{
			// variables
				var stack;
				if(error instanceof Error)
				{
					stack	= xjsfl.utils.getStack(error, true);
					if(testing)
					{
						stack.splice(stack.length - 3, 2);
					}
				}
				else
				{
					error	= new Error(error);
					stack	= xjsfl.utils.getStack(error, true);
					stack	= stack.slice(1);
				}
				
			// template uris
				var uriErrors	= xjsfl.utils.makeURI('core/config/templates/errors/errors.txt');
				var uriError	= xjsfl.utils.makeURI('core/config/templates/errors/error.txt');
				
			// build errors
				var content = '';
				for(var i = 0; i < stack.length; i++)
				{
					stack[i].index = i;
					content += new xjsfl.classes.Template(uriError, stack[i]).render();
				}
				
			// build output
				var data = { error:error.toString(), content:content };
				trace(new xjsfl.classes.Template(uriErrors, data).render());
		}
	}

	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██                     ██                    
//  ██  ██                     ██                    
//  ██ █████ █████ ████ █████ █████ █████ ████ █████ 
//  ██  ██   ██ ██ ██      ██  ██   ██ ██ ██   ██    
//  ██  ██   █████ ██   █████  ██   ██ ██ ██   █████ 
//  ██  ██   ██    ██   ██ ██  ██   ██ ██ ██      ██ 
//  ██  ████ █████ ██   █████  ████ █████ ██   █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Iterators

	xjsfl.iterators =
	{
		/**
		 * Iterates through an array of library Items, optionally processing each one with a callback, and optionally processing each of its layers with a callback
		 * 
		 * @param	items			{Array}			An array of Item objects
		 * @param	itemCallback	{Function}		A callback of the format function(item, index, items)
		 * @param	layerCallback	{Function}		A callback of the format function(layer, index, layers)
		 * @param	frameCallback	{Function}		A callback of the format function(frame, index, frames)
		 * @param	elementCallback	{Function}		A callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		items:function(items, itemCallback, layerCallback, frameCallback, elementCallback)
		{
			for(var i = 0; i < items.length; i++)
			{
				// callback
					if(itemCallback && itemCallback(items[i], i, items))
					{
						return true;
					}
					
				// layers
					if(items[i]['timeline'] && (layerCallback || frameCallback || elementCallback))
					{
						this.layers(items[i].timeline, layerCallback, frameCallback, elementCallback)
					}
			}
			return false;			
		},
		
		/**
		 * Iterates through a Symbol's layers, optionally processing each one with a callback, and optionally processing each of its frames with a callback
		 * 
		 * @param	symbol			{SymbolItem}	A SymbolItem or SymbolInstance object
		 * @param	layerCallback	{Function}		A callback of the format function(layer, index, layers)
		 * @param	frameCallback	{Function}		A callback of the format function(frame, index, frames)
		 * @param	elementCallback	{Function}		A callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		layers:function(symbol, layerCallback, frameCallback, elementCallback)
		{
			if(symbol)
			{
				var timeline = symbol instanceof SymbolInstance ? symbol.libraryItem.timeline : symbol.timeline;
			}
			else
			{
				var timeline = fl.getDocumentDOM().getTimeline();
			}
			
			if(timeline)
			{
				for(var i = 0; i < timeline.layers.length; i++)
				{
					// callback
						if(layerCallback && layerCallback(timeline.layers[i], i, timeline.layers))
						{
							return true;
						}
						
					// frames
						if(frameCallback || elementCallback)
						{
							this.frames(timeline.layers[i], frameCallback, elementCallback)
						}
				}
			}
			return false;			
		},
		
		/**
		 * Iterates through a Layer's frames, optionally processing each one with a callback, and optionally processing each of its elements with a callback
		 * 
		 * @param	layer			{Layer}			A Layer, Layer index or Layer name
		 * @param	frameCallback	{Function}		A callback of the format function(frame, index, frames)
		 * @param	elementCallback	{Function}		A callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		frames:function(layer, frameCallback, elementCallback)
		{
			if(typeof layer == 'string')
			{
				var timeline	= fl.getDocumentDOM().getTimeline();
				var index		= timeline.findLayerIndex(layer);
				layer			= timeline.layers[index];
			}
			else if(typeof layer == 'number')
			{
				layer = fl.getDocumentDOM().getTimeline().layers[layer];
			}
			
			if(layer)
			{
				for(var i = 0; i < layer.frames.length; i++)
				{
					if(i == layer.frames[i].startFrame)
					{
						// callback
							if(frameCallback && frameCallback(layer.frames[i], i, layer.frames))
							{
								return true;
							}
						
						// elements
							if(elementCallback)
							{
								this.elements(layer.frames[i], elementCallback)
							}
					}
						
				}
			}
			return false;			
		},
		
		/**
		 * Iterates through a frame's elements, processing each one with a callback
		 * 
		 * @param	elementCallback	{Function}		A callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		elements:function(frame, elementCallback)
		{
			if(frame == null)
			{
				var timeline	= fl.getDocumentDOM().getTimeline();
				var layer		= timeline.layers[timeline.currentLayer];
				frame 			= layer.frames[timeline.currentFrame];
			}
			
			if(frame)
			{
				for(var i = 0; i < frame.elements.length; i++)
				{
					if(elementCallback(frame.elements[i], i, frame.elements))
					{
						return true;
					}
				}
			}
			return false;			
		}
	}
	

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██ ██       
//  ██        ██       
//  ██     ██ ██ █████ 
//  █████  ██ ██ ██ ██ 
//  ██     ██ ██ █████ 
//  ██     ██ ██ ██    
//  ██     ██ ██ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// File
	
	/**
	 * framework-specific file functionality
	 */
	xjsfl.file =
	{
		get loading()
		{
			return xjsfl.file.stack.length > 0;
		},
		
		stack:[],
		
		/**
		 * Finds all files of a particular type within the cascading file system
		 * 
		 * @param	type			{String}			The folder in which to look in to find the files, @see switch statement
		 * @param	name			{String|Array}		A file name (pass no extension to use default), or partial file path
		 * @param	returnType		{Number}			An optional 0, 1 or -1; 0: all files (default), -1: the last file (user), 1:the first file (core)
		 * @returns					{String|Array|null}	A single file or an array of files
		 * @author	Dave Stewart	
		 */
		find:function(type, name, returnType)
		{
			// --------------------------------------------------------------------------------
			// work out base uri
			
				// file-specific variables
					var path, ext, which;
					
				// switch type
					switch(type)
					{
						// for modules, immediately return the module path or null
						case 'module':
						case 'modules':
							uri	= xjsfl.uri + 'modules/' + name + '/' + 'jsfl/' + name + '.jsfl';
							return FLfile.exists(uri) ? uri : null;
						break;
							
						// for scripts, return the last file found, from: core, modules, user (jsfl)
						case 'script':
						case 'scripts':
						case 'jsfl':
							path	= 'jsfl/' + name;
							ext		= '.jsfl';
							which	= -1;
						break;
						
						// for libraries, return all found files, in order: core, modules, user (jsfl)
						case 'lib':
						case 'libs':
						case 'library':
						case 'libraries':
							path	= 'jsfl/libraries/' + name;
							ext		= '.jsfl';
							which	= 0;
						break;
						
						// for data or settings, return the last file found, from: core, modules, user (xml)
						case 'data':
						case 'settings':
							path	= 'config/' + type + '/' + name;
							ext		= '.xml';
							which	= -1;
						break;
						
						// for templates, return the last file found, from: core, modules, user (txt, or supplied extension)
						case 'template':
							path	= 'config/templates/' + name;
							ext		= '.txt';
							which	= -1;
						break;
					
						// otherwise, return all files found, from: core, modules, user
						default:
							path	= type.replace(/\/+$/g, '') + '/' + name;
							ext		= '';
							which	= 0;
					}
					
				// add default extension if not provided;
					path += name.match(/\.\w+$/) ? '' : ext;
					
					
			// --------------------------------------------------------------------------------
			// find files
			
				// variables
					var uris		= [];
					var paths		= xjsfl.settings.paths.get();
					
				// check all paths for files
					for(var i = 0; i < paths.length; i++)
					{
						var uri = xjsfl.utils.makeURI(paths[i] + path);
						if(FLfile.exists(uri))
						{
							uris.push(uri);
						}
					}
					
				// return null if no URIs found
					if(uris.length == 0)
					{
						return null;
					}
					
			// --------------------------------------------------------------------------------
			// return
			
				// variables
					returnType = Number(returnType || which)
				
				// return
					if(returnType > 0)
					{
						return uris.shift();
					}
					else if(returnType < 0)
					{
						return uris.pop();
					}
					else
					{
						return uris.length ? uris : null;
					}
		},
		
		/**
		 * Attempts to find and run or return files from the cascading file structure.
		 * Parameters and return type vary depending on file type!
		 * 
		 * @param type			{String}		The type of file (i.e., the xjsfl folder) in which to look for files
		 * @param name			{String|Array}	The name of a library without the file extension
		 * @param catchErrors	{Boolean}		An optional switch to read and eval contents of jsfl files, which traps errors rather than failing silently
		 *
		 * @param name			{String}		The relative or absolute path to the file
		 * @param catchErrors	{Boolean}		An optional switch to read and eval contents of jsfl files, which traps errors rather than failing silently
		 *
		 * @returns				{Boolean}		A Boolean indicating Whether the file was successfully found and loaded
		 * @returns				{XML}			An XML object of the content of the file, if XML
		 * @returns				{String}		The string content of the file otherwise
		 */
		load:function (type, name, catchErrors)
		{
			/*
				// path types
					if absolute or relative path, attempt to load it
					if type and name, find it, then attempt to load it
					
				// signatures
					load(path)
					load(type, name)
			*/
			
			// variables
				var result	= null;
				
			// --------------------------------------------------------------------------------
			// Load file
			
				// single argument, so type is actually a file, or an array of files,so just convert the path to a uri
					if(name == null || name === true || name === false)
					{
						var path = type;
						var uri = xjsfl.utils.makeURI(path);
						result	= FLfile.exists(uri) ? uri : null;
					}
				
				// type and name supplied, so find the file we need in the cascading file system
					else
					{
						result = xjsfl.file.find(type, name);
					}
							
			// --------------------------------------------------------------------------------
			// take action on results
			
				// debug
					// alert('Loading ' + name);
		
				// if uris.length is 0, no files were found
					if(result == null)
					{
						if(name == null || name === true || name === false)
						{
							xjsfl.output.trace('Error in xjsfl.file.load: The file "' +type+ '" could not be found');
						}
						else
						{
							xjsfl.output.trace('Error in xjsfl.file.load: Could not resolve type "' +type+ '" and name "' +name+ '" to an existing file');
						}
					}
					
				// otherwise, do something with the uris
					else
					{
						
						var uris = xjsfl.utils.getClass(result) == 'Array' ? result : [result];
						
						for (var i = 0; i < uris.length; i++)
						{
							// variables
								var uri		= uris[i];
								var path	= xjsfl.utils.makePath(uri, true);
								var ext		= uri.match(/(\w+)$/)[1];
	
							// debug
								if(xjsfl.loading)
								{
									var state = catchErrors ? 'testing' : 'loading';
									xjsfl.output.log('xjsfl.file.load', state + ' "' + path + '"');
								}
								
							// flag
								xjsfl.file.stack.push(uri);
								
							// do something depending on extension
								switch(ext)
								{
									case 'jsfl':
										
										// test script
											if(catchErrors)
											{
												try
												{
													eval(FLfile.read(uri));
													xjsfl.file.stack.pop();
													return uri;
												}
												catch(err)
												{
													xjsfl.output.trace(err);
													xjsfl.output.error('xjsfl.file.load(): The file "' +path+ '" could not be executed');
													xjsfl.file.stack.pop();
													return false;
												}
											}
									
										// otherwise, simply run the file
											else
											{
												fl.runScript(uri);
												//xjsfl.output.trace('Loaded ' + path);
												xjsfl.file.stack.pop();
												return uri;
											}
											
										// if the type was a module, ensure any panels are copied to the WindowSWF folder
											if(type.match(/modules?/))
											{
												var folder = new xjsfl.classes.Folder(xjsfl.utils.makeURI('modules/' + name + '/ui/'));
												for each(var file in folder.contents)
												{
													if(file.extension == 'swf')
													{
														file.copy(fl.configURI + 'WindowSWF/');
													}
												}
											}

									break;
								
									case 'xml':
										var contents = FLfile.read(uri);
										contents = contents.replace(/<\?.+?>/, ''); // remove any doc type declaration
										xjsfl.file.stack.pop();
										return new XML(contents);
									break;
								
									default:
										xjsfl.file.stack.pop();
										return FLfile.read(uri);
								
								}
							
						}
					}

			// return
				return this;
		}
		
	}
	
	

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                               
//  ██     ██                               
//  ██     ██ █████ █████ █████ █████ █████ 
//  ██     ██    ██ ██    ██    ██ ██ ██    
//  ██     ██ █████ █████ █████ █████ █████ 
//  ██     ██ ██ ██    ██    ██ ██       ██ 
//  ██████ ██ █████ █████ █████ █████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Classes

	/**
	 * Mechanism to store and retrieve libraries into the global (or other)
	 * namespace between external JSFL file executions
	 */
	xjsfl.classes =
	{
		/**
		 * Load a class or array of classes from disk
		 * 
		 * @param	path		{String}	A class filepath, relative to the jsfl/libraries folder
		 * @param	path		{Array}		An Array of class filepaths
		 * @param	debugType	{Number}	An optional debug switch 1:alert, 2:eval
		 */
		load:function(path, debugType)
		{
			// arrayize paths
				var paths = path instanceof Array ? path : [path];
				
			//TODO Add a check to see if we are loading, and if so, only load classes that are not yet defined. Can we do that? Do we need to cache load paths in that case?
				
			// load classes
				for(var i = 0; i < paths.length; i++)
				{
					if(debugType != undefined)
					{
						var str = 'Loading class file ' +(i + 1)+ '/' +paths.length+ ': ' + paths[i];
						(debugType == 1 ? xjsfl.output.trace : alert)(str);
					}
					xjsfl.file.load('library', paths[i], debugType === 2);
				}
				
			// return
				return this;
		},
		
		/**
		 * Loads a class if not already defined in the supplied scope
		 * @param	scope		{Object}	A valid scope to extract the class definition to, normally 'this' (without the quotes)
		 * @param	className	{String}	The class name, such as 'Template', or 'Table'
		 * @param	path		{String}	The class filepath, relative to the jsfl/libraries folder
		 * @returns		
		 */
		require:function(scope, className, path)
		{
			if( ! scope[className])
			{
				this.load(path, 1);
			}
			return this;
		},
		
		/**
		 * Registers a class/function for later retrieval
		 * 
		 * @param	name	{String}	The name of the class / function / object to register
		 * @param	obj		{Object}	The actual class / function / object
		 * @returns			{xjsfl}		The main xJSFL object
		 */
		register:function(name, obj)
		{
			if( ! /^load|require|register|restore$/.test(name) )
			{
				xjsfl.classes[name] = obj;
			}
			return this;
		},
		
		/**
		 * Restores a class/function to the supplied namespace
		 * 
		 * @param	name	{string}	The name of the class to restore
		 * @param	scope	{Object}	The scope to which the class should be restored to (defaults to window)
		 * @returns			{xjsfl}		The main xJSFL object
		 */
		restore:function(name, scope)
		{
			// restore all classes
				if(typeof name !== 'string')
				{
					scope = name;
					for (name in xjsfl.classes)
					{
						xjsfl.classes.restore(name, scope);
					}	
				}
				
			// restore only one class
				else if(typeof name == 'string')
				{
					if( ! /^load|require|register|restore$/.test(name) )
					{
						//trace('Restoring:' + name)
						scope = scope || window;
						scope[name] = xjsfl.classes[name];
					}
				}
				
			// return this for chaining
				return this;
		}
	}
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██   ██          ██       ██             
//  ███ ███          ██       ██             
//  ███████ █████ █████ ██ ██ ██ █████ █████ 
//  ██ █ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██    
//  ██   ██ ██ ██ ██ ██ ██ ██ ██ █████ █████ 
//  ██   ██ ██ ██ ██ ██ ██ ██ ██ ██       ██ 
//  ██   ██ █████ █████ █████ ██ █████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Modules


	/**
	 * A namespace in which to store module code to prevent pollution of global scope
	 * as well as a couple of methods to add and load module code
	 */
	xjsfl.modules =
	{

		/**
		 * Load a module or array of modules
		 * 
		 * @param	name	{String|Array}		A module name or array of module names
		 */
		load:function(name)
		{
			xjsfl.file.load('module', name)
		},
		
		/**
		 * Register a loaded module in the xjsfl namespace
		 * 
		 * @param	name	{String}	The package name of the module
		 * @param	module	{Object}	The actual module object to register
		 * @returns			{xjsfl}		The main xJSFL object
		 */
		register:function(name, module)
		{
			if( ! name.match(/register|load/) )
			{
				xjsfl.paths.add(name, 'module');
				xjsfl.modules[name] = module;
			}
			else
			{
				xjsfl.output.error('Module names cannot clash with named xjsfl.module methods');
			}
		}
		
	}

	// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██ 
//  ██  ██ ██ 
//  ██  ██ ██ 
//  ██  ██ ██ 
//  ██  ██ ██ 
//  ██  ██ ██ 
//  ██████ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// UI


	/**
	 * Global storage for XUL UIs and settings
	 */
	xjsfl.ui =
	{
		stack:[],
		
		get current()
		{
			return this.stack[this.stack.length - 1];
		},
		
		add:function(xul)
		{
			this.stack.push(xul);
		},
		
		remove:function()
		{
			this.stack.pop();
		},
		
		clear:function()
		{
			this.stack = [];
		}
	}
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                    ██         
//  ██                        ██         
//  ██     ██ ██ █████ █████ █████ █████ 
//  █████  ██ ██ ██ ██ ██ ██  ██   ██    
//  ██     ██ ██ █████ ██ ██  ██   █████ 
//  ██      ███  ██    ██ ██  ██      ██ 
//  ██████  ███  █████ ██ ██  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Events

	// Remove any prior event handlers
		
		if(xjsfl.events)
		{
			for(var type in xjsfl.events.objects)
			{
				var callbacks = xjsfl.events.objects[type].callbacks;
				if(callbacks != null)
				{
					var id = xjsfl.events.objects[type].id;
					fl.removeEventListener(type, id);
				}
			}
		}
		
	// event code will be added in core/jsfl/libraries/events.jsfl

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██       ██  ██   ██       ██ ██            
//  ██           ██            ██               
//  ██ █████ ██ █████ ██ █████ ██ ██ ████ █████ 
//  ██ ██ ██ ██  ██   ██    ██ ██ ██   ██ ██ ██ 
//  ██ ██ ██ ██  ██   ██ █████ ██ ██  ██  █████ 
//  ██ ██ ██ ██  ██   ██ ██ ██ ██ ██ ██   ██    
//  ██ ██ ██ ██  ████ ██ █████ ██ ██ ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Initialize
	
	/**
	 * Reload the framework from disk
	 */
	xjsfl.reload = function()
	{
		if( ! xjsfl.loading)
		{
			fl.runScript(fl.configURI + 'Tools/xJSFL Loader.jsfl');
		}
	}

	/**
	 * Initialize the environment by extracting variables / objects / functions to global scope
	 * @param	scope	{Object}	The scope into which the framework should be extracted
	 * @param	force	{Boolean}	An optional Boolean to force extraction of the framework, even if already extracted
	 * @returns		
	 */
	xjsfl.init = function(scope, force)
	{
		// default to window
			scope = scope || window;
			
		// initialize only if xJSFL (xJSFL, not xjsfl) variable is not yet defined, or force is set as true
			if( ! scope.xJSFL || force)
			{
				// debug
					xjsfl.output.trace('setting environment variables...');
				
				// dom getter
					scope.__defineGetter__( 'dom', function(){ return fl.getDocumentDOM(); } );
					
				// functions
					scope.trace		= function(){fl.outputPanel.trace(Array.slice.call(this, arguments).join(', '))};
					scope.clear		= fl.outputPanel.clear;
					
				// methods
					xjsfl.trace		= xjsfl.output.trace;
					
				// classes
					xjsfl.classes.restore(scope);
					
				// flag xJSFL initialized by setting a scope-level variable (xJSFL, not xjsfl)
					scope.xJSFL		= xjsfl;
			}
			
		// debug
			else
			{
				//xjsfl.output.trace('already initialized...');
			}
	}

