// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██               
//  ██            ██               
//  ██     █████ █████ ██ ██ █████ 
//  ██████ ██ ██  ██   ██ ██ ██ ██ 
//      ██ █████  ██   ██ ██ ██ ██ 
//      ██ ██     ██   ██ ██ ██ ██ 
//  ██████ █████  ████ █████ █████ 
//                           ██    
//                           ██    
//
// ------------------------------------------------------------------------------------------------------------------------
// Setup

	// root uri
		//xjsfl.uri = xjsfl.uri = xjsfl.uri; // fl.scriptURI.substring(0, fl.scriptURI.lastIndexOf('/xJSFL/')) + '/xJSFL/';
		
	// temp variables for framework setup
		xjsflPath		= FLfile.uriToPlatformPath(xjsfl.uri).replace(/\\/g, '/');
		
	// temp output object, needed before libraries are loaded
		if(!xjsfl.settings)
		{
			xjsfl.settings	= {debugLevel:(window['debugLevel'] != undefined ? debugLevel : 1)};
			xjsfl.output =
			{
				trace: function(message){ if(xjsfl.settings.debugLevel > 0)fl.trace('> ' + message); },
				error: function(message){ fl.trace('<< ' + message + ' >>'); }
			}
		}

	 // if pre-CS4, extend FLfile to add platform to uri conversion (needs to be loaded in advance because of various file / path operations during setup)
		if( (! FLfile) || (! FLfile['platformPathToURI']) )
		{
			var path = 'core/jsfl/lib/FLfile.jsfl';
			fl.runScript(xjsfl.uri + path);
			xjsfl.output.trace('Loaded "<xJSFL>/' +path+ '"');
		}
		
	// to string function
		xjsfl.toString = function()
		{
			return '[class xJSFL]';
		}


	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                       ██████        ██    ██   ██                   
//  ██                           ██            ██    ██                        
//  ██     █████ ████ █████      ██     █████ █████ █████ ██ █████ █████ █████ 
//  ██     ██ ██ ██   ██ ██      ██████ ██ ██  ██    ██   ██ ██ ██ ██ ██ ██    
//  ██     ██ ██ ██   █████          ██ █████  ██    ██   ██ ██ ██ ██ ██ █████ 
//  ██     ██ ██ ██   ██             ██ ██     ██    ██   ██ ██ ██ ██ ██    ██ 
//  ██████ █████ ██   █████      ██████ █████  ████  ████ ██ ██ ██ █████ █████ 
//                                                                    ██       
//                                                                 █████       
//
// ------------------------------------------------------------------------------------------------------------------------
// Core Settings


	/**
	 * Core settings and cached variables
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
				
			// the integer version of Flash
				version:	parseInt(fl.version.match(/\w+ (\d+)/)[1]),
				
			// the product name of flash, i.e. CS4
				name:		(
								function()
								{
									var version = fl.version.match(/\w+ (\d+)/)[1];
									var name = {'7':'MX2004','8':'8', '9':'CS3','10':'CS4', '11':'CS5', '12':'CS6'};
									return name[version] || 'Unknown';
								}
							)()
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
		 * Can be set by the developer to either trace or alert framework errors and warnings
		 * @type {Number} debug level 0: off, 1:trace, 2:alert
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
						// getter / setter
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
			return String(string).replace(/(^\s*|\s*)/g, '');
		},
		
		/**
		 * Create a valid URI from a supplied string
		 * 
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
						.replace(xjsfl.settings.folders.config, '<config>/')
						.replace(xjsfl.settings.folders.xjsfl, '<xjsfl>/');
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
		 * @param	value	
		 * @returns		
		 */
		toArray:function(value, delim)
		{
			delim = delim || ',';
			if(xjsfl.utils.isArray(value))
			{
				return value;
			}
			else if(typeof value === 'string' && value.indexOf(delim) > -1)
			{
				var rx1	= new RegExp('^[\s' +delim+ ']+|[\s' +delim+ ']+$', 'g'); // trim
				var rx2	= new RegExp('\s*' +delim+ '\s*', 'g'); // split 
				return value.replace(rx1, '').split(rx2);
			}
			return [value];
		},
		
		/**
		 * Returns a unique array without any duplicate items
		 * @param	arrIn	{Array}		Any array
		 * @returns			{Array}		A unique array
		 * @author	Dave Stewart	
		 */
		unique:function(arrIn)
		{
			var arrOut	= [];
			var i		= arrIn.length - 1;
			while(i-- >= 0)
			{
				if(arrOut.indexOf(arrIn[i]) === -1)
				{
					arrOut.push(arrIn[i]);
				}
			}
			return arrOut;
		},		

		/**
		 * Get the class of an object as a string
		 * @param	value	{mixed}		Any value
		 * @returns			{String}	The class name of the value i.e. 'String', 'Date', 'CustomClass'
		 */
		classOf:function(value)
		{
			var className = toString.call(value).match(/\[\w+ (\w+)/)[1];
			if(className === 'Object')
			{
				return object.constructor ? String(value.constructor).match(/function (\w+)/)[1] : className;
			}
			return className;
		},
		
		test:function(fn)
		{
			try
			{
				fn();
			}
			catch(err)
			{
				xjsfl.output.error(err);
			}
		},
		
		/**
		 * Returns an array of the the currently executing files, paths, lines, and code
		 * @param	error		{Error}		An optional Boolean to shorten any core paths with <xjsfl>
		 * @param	shorten		{Boolean}	An optional Boolean to shorten any core paths with <xjsfl>
		 * @returns				{Array}		An array of the executing files, paths, lines and code
		 */
		getStack:function(error, shorten)
		{
			// variables
				var rx			= /^(.*?)@(.+?)([^\/\\]*):(\d*)$/gm;
				error			= error || new Error();
				var matches		= error.stack.match(rx);
				var stack		= [];
				var xjsflPath	= FLfile.uriToPlatformPath(xjsfl.uri);
				var parts, path
				
			// parse stack
				for (var i = 1; i < matches.length; i++)
				{
					rx.lastIndex	= 0;
					parts			= rx.exec(matches[i]);
					path			= (parts[2] || '');
					stack[i - 1] =
					{
						code:parts[1] || '',
						line:parseInt(parts[4]) || '',
						file:parts[3] || '',
						path:(shorten ? path.replace(xjsflPath, '<xjsfl>/') : path).replace(/\\/g, '/')
					};
				}
				
			// return
				return stack;
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
		 * Upgraded trace function that takes multiple arguments
		 * @param args {Object} Multiple arguments
		 */
		trace:function()
		{
			//trace('>>' + xjsfl.settings.debugLevel)
			if(xjsfl.settings.debugLevel > 0)
			{
				fl.trace('> xjsfl: ' + Array.prototype.slice.call(arguments).join(', '));
			}
		},
		
		/**
		 * Issue a warning to the user
		 * @param message		{String} The message to be displayed
		 * @param debugLevel	{Number} 1 traces the message to the output panel, 2 shows the alert dialog
		 */
		warn:function(message)
		{
			xjsfl.output.error(message);
			if(xjsfl.settings.debugLevel >= 1)
			{
				fl.trace('Warning: ' + message);
			}
			if(xjsfl.settings.debugLevel >= 2)
			{
				alert(message);
			}
		},

		/**
		 * Traces a human-readable error to the Output Panel
		 * @param error		{String}	A string defining the main error message
		 * @param error		{Error}		A javaScript Error object
		 * @param data		{Object}	An optional Object contaiing key:value pairs of extra information
		 */
		error:function(error, data)
		{
			// variables
				var stack;
				if(error instanceof Error)
				{
					stack	= xjsfl.utils.getStack(error, true);
				}
				else
				{
					error	= new Error(error);
					stack	= xjsfl.utils.getStack(error, true);
					stack	= stack.slice(1);
				}
				
			// data
				data = xjsfl.utils.extend( { message:error.message, stack:stack }, data || {});
				
			// output
				Output.inspect(data, error.name)
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
		 * @param	symbol			{SymbolItem}	A SymbolItem or SymbolInstance object
		 * @param	layerCallback	{Function}		A callback of the format function(layer, index, layers)
		 * @param	frameCallback	{Function}		A callback of the format function(frame, index, frames)
		 * @param	elementCallback	{Function}		A callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		layers:function(symbol, layerCallback, frameCallback, elementCallback)
		{
			var timeline = symbol instanceof SymbolInstance ? symbol.libraryItem.timeline : symbol.timeline;
			
			if(symbol)
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
					if(elementCallback(layer.frames[i], i, layer.frames))
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
						// for modules, immedioately return the module path or null
						case 'module':
						case 'modules':
							uri	= xjsfl.uri + 'modules/' + name + '/' + 'jsfl/' + name + '.jsfl';
							return FLfile.exists(uri) ? uri : null;
						break;
							
						// for scripts, return the last file found, from: core, mods, user (jsfl)
						case 'script':
						case 'scripts':
						case 'jsfl':
							path	= 'jsfl/' + name;
							ext		= '.jsfl';
							which	= -1;
						break;
						
						// for libraries, return all found files, in order: core, mods, user (jsfl)
						case 'lib':
						case 'libs':
						case 'library':
						case 'libraries':
							path	= 'jsfl/libraries/' + name;
							ext		= '.jsfl';
							which	= 0;
						break;
						
						// for data or settings, return the last file found, from: core, mods, user (xml)
						case 'data':
						case 'settings':
							path	= 'config/' + type + '/' + name;
							ext		= '.xml';
							which	= -1;
						break;
						
						// for templates, return the last file found, from: core, mods, user (txt, or supplied extension)
						case 'template':
							path	= 'config/templates/' + name;
							ext		= '.txt';
							which	= -1;
						break;
					
						// otherwise, return all files found, from: core, mods, user
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
		 *
		 * Parameters and return type vary depending on file type!
		 * 
		 * @param type			{String}		The type of file (i.e., the xjsfl folder) in which to look for files
		 * @param name			{String|Array}	The name of a library without the file extension, or a comma-delimited list of the previous
		 * @param catchErrors	{Boolean}		An optional switch to read and eval contents of jsfl files, which traps errors rather than failing silently
		 *
		 * @param filename		{String}		The relative or absolute path to the file, or a comma-delimited list of the previous
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
					load([paths])
					load(type, name)
					load(type, [names])
			*/
			
			// variables
				var result	= null;
				
			// --------------------------------------------------------------------------------
			// single argument, so type is actually a file, or an array of files,
			// so just convert the path to a uri
			
				if(name == null || name === true || name === false)
				{
					// variables
						var path = type;
						
					// arrayaize path (takes into accounts delimiters)
						var files = xjsfl.utils.toArray(path);
						
					// test for multiple files and recursively load if so, then return
						if(files.length > 1)
						{
							for(var i = 0; i < files.length; i++)
							{
								result = xjsfl.file.load(files[i], name, catchErrors);
							}
							return result;
						}
				
					// get uri
						var uri = xjsfl.utils.makeURI(path);
						result	= FLfile.exists(uri) ? uri : null;
						
				}
			
			// --------------------------------------------------------------------------------
			// type and name supplied, so find the files we need in the cascading file system
			
				else
				{
					// arrayaize path
						var names = xjsfl.utils.toArray(name);
					
					// test for multiple files and recursively load if so, then return
						if(names.length > 1)
						{
							for(var i = 0; i < names.length; i++)
							{
								result = xjsfl.file.load(type, names[i], catchErrors);
							}
							return result;
						}
					
					// find files
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
						
						var uris = xjsfl.utils.classOf(result) == 'Array' ? result : [result];
						
						for (var i = 0; i  < uris.length; i++)
						{
							// variables
								var uri		= uris[i];
								var path	= xjsfl.utils.makePath(uri, true);
								var ext		= uri.match(/(\w+)$/)[1];
	
							// debug
								xjsfl.output.trace('loading "' + path + '"');
								
							// do something depending on extension
								switch(ext)
								{
									case 'jsfl':
										// test script
											if(catchErrors)
											{
												xjsfl.trace('Testing..')
												try
												{
													var str = FLfile.read(uri);
													eval(str);
													//xjsfl.output.trace('Executed: ' +path);
													return true;
												}
												catch(err)
												{
													xjsfl.trace(err);
													
													/*
													xjsfl.trace('Running: ' + path);
													var exec = fl.version.match(/\bMAC\b/i) ? 'exec ' + path : path;
													FLfile.runCommandLine(exec);
													*/
													xjsfl.output.error('The file ' +path+ ' could not be executed');
													return false;
												}
											}
									
										// otherwise, simply run the file
											else
											{
												fl.runScript(uri);
												//xjsfl.output.trace('Loaded ' + path);
											}
											
										// if the type was a module, ensure any panels are copied to the WindowSWF folder
											if(type.match(/modules?/))
											{
												var folder = new Folder(xjsfl.utils.makeURI('modules/' + name + '/ui/'));
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
										return new XML(contents);
									break;
								
									default:
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
		items:{},
		
		/**
		 * Load a class or array of classes
		 * @param	name	{String|Array}		A string name or array of class names
		 */
		load:function(name, test)
		{
			xjsfl.file.load('library', name, test)
		},
		
		/**
		 * Registers an element for later retrieval
		 * @param	name	{String}	The name of the class / function / object to register
		 * @param	obj		{Object}	The actual class / function / object
		 * @returns			{xjsfl}		The main xJSFL object
		 */
		register:function(name, obj)
		{
			if( ! name.match(/items|load|register|restore/) )
			{
				xjsfl.classes.items[name] = obj;
			}
			return this;
		},
		
		/**
		 * Restores a class to the 
		 * @param	name	{string}	The name of the class to restore
		 * @param	scope	{Object}	The scope to which the class should be restored to (defaults to window)
		 * @returns			{xjsfl}		The main xJSFL object
		 */
		restore:function(name, scope)
		{
			// restore all classes
				if(typeof name != 'string')
				{
					scope = name;
					for (name in xjsfl.classes.items)
					{
						xjsfl.classes.restore(name, scope);
					}	
				}
				
			// restore only one class
				else
				{
					scope = scope || window;
					scope[name] = xjsfl.classes.items[name];
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
		 * @param	name	{String|Array}		A module name or array of module names
		 */
		load:function(name)
		{
			xjsfl.file.load('module', name)
		},
		
		/**
		 * Register a loaded module in the xjsfl namespace
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
	 * Extracts key variables / objects / functions to global scope for convenience
	 */
	xjsfl.init = function(scope)
	{
		// debug
			xjsfl.output.trace('setting environment variables');
		
		// variables
			scope.dom			= fl.getDocumentDOM();
			
		// functions
			scope.trace			= function(){fl.outputPanel.trace(Array.slice.call(this, arguments).join(', '))};
			scope.clear			= fl.outputPanel.clear;
			
		// methods
			xjsfl.trace			= xjsfl.output.trace;
			
		// classes
			xjsfl.classes.restore(scope);
	}

	// debug
		//xjsfl.settings.debugLevel = 2;



