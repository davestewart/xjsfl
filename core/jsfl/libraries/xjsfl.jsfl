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

		/**
		 * Fake xjsfl instantation for Komodo autocomplete
		 */
		if( ! xjsfl )
		{
			xjsfl = { };
		}

		(function()
		{
			// if pre-CS4, extend FLfile to add platform to uri conversion (needs to be loaded in advance because of various file / path operations during setup)
			   if( ! FLfile['platformPathToURI'] )
			   {
				   var path = 'core/jsfl/libraries/flfile.jsfl';
				   xjsfl.output.trace('loading "xJSFL/' +path+ '"');
				   fl.runScript(xjsfl.uri + path);
			   }

		   // ensure temp folder exists
				var uri = xjsfl.uri + 'core/temp/';
				if( ! FLfile.exists(uri) )
				{
					FLfile.createFolder(uri);
				}
		})()


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██
//  ██            ██
//  ██     █████ █████
//  ██ ███ ██ ██  ██
//  ██  ██ █████  ██
//  ██  ██ ██     ██
//  ██████ █████  ████
//
// ------------------------------------------------------------------------------------------------------------------------
// Get - Utility functions to ensure user has a document open, selection, etc, and alert if not


	/**
	 * A set of functions to return objects or selections in the UI, or issue standard warnings if not available
	 */
	xjsfl.get =
	{
		/**
		 * Get the current Document DOM, or issue a standard warning if not available
		 * @returns		{Document}	A Document object
		 * @returns		{Boolean}	False if not available
		 */
		dom:function(error)
		{
			//TODO Look to see if passing in an error message is good design or not
			var dom = fl.getDocumentDOM();
			if(dom)
			{
				return dom;
			}
			alert(error || 'Open a Flash document (FLA) before running this script');
			return false;
		},

		/**
		 * Get the current Timeline, or issue a standard warning if not available
		 * @returns		{Timeline}	A Timelineobject
		 * @returns		{Boolean}	False if not available
		 */
		timeline:function(error)
		{
			//TODO Look to see if passing in an error message is good design or not
			var dom = fl.getDocumentDOM();
			if(dom)
			{
				return dom.getTimeline();
			}
			alert(error || 'Open a Flash document (FLA) before running this script');
			return false;
		},

		/**
		 * Get the currently selected library items, or issue a standard warning if not selected
		 * @returns		{Array}		An array of library items
		 * @returns		{Boolean}	False if not available
		 */
		items:function()
		{
			if(xjsfl.get.dom())
			{
				var items = fl.getDocumentDOM().library.getSelectedItems();
				if(items.length > 0)
				{
					return items;
				}
				alert('Select some library items before running this script');
				return false;
			}
			return false;
		},

		/**
		 * Get the current selection, or issue a standard warning if nothing is selected
		 * @returns		{Array}		An array of elements
		 * @returns		{Boolean}	False if no selection
		 */
		selection:function()
		{
			var dom = xjsfl.get.dom();
			if(dom)
			{
				var selection = dom.selection;
				if(selection.length > 0)
				{
					return selection;
				}
				alert('Make a selection before running this script');
				return false;
			}
			return false;
		}

	}


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
			xjsfl:		xjsfl.uri,
			core:		xjsfl.uri + 'core/',
			modules:	xjsfl.uri + 'modules/',
			user:		xjsfl.uri + 'user/',
			flash:		fl.configURI,
			swf:		fl.configURI + 'WindowSWF/'
		},

		/**
		 * Search paths
		 * A cache of uris which xJSFL searches in order when loading files
		 * module uris are updated automatically when new modules are added
		 */
		uris:
		{
			// properties
				core:	[ xjsfl.uri + 'core/' ],
				module: [ ],
				user:	[ xjsfl.uri + 'user/' ],

			// methods
				add:function(uri, type)
				{
					// check uri is valid
						if(uri.indexOf('file:///') !== 0)
						{
							uri = FLfile.platformPathToURI(uri);
							//throw new URIError('Error in xjsfl.settings.uris.add(): URI "' +uri+ '" is not a valid URI');
						}

					// check URI exists
						if( ! FLfile.exists(uri))
						{
							throw new URIError('Error in xjsfl.settings.uris.add(): URI "' +uri+ '" does not exist');
						}

					// variables
						type	= type || 'user';
						uri		= uri.replace(/[\/]+$/g, '') + '/';	// ensure a single trailing slash

					// add if not already added
						if(this[type].indexOf(uri) == -1)
						{
							this[type].push(uri);
						}
				},

				get all()
				{
					var uris = xjsfl.settings.uris;
					return uris.core
								.concat(uris.module)
								.concat(uris.user);
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
					function(element, index, elements)
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
		 * @param obj		{Object}	A source Object to be extended
		 * @param props		{Object}	The properties to be added
		 * @returns			{Object}	The modified object
		 *
		 * @param obj		{Array}		A source Array to be extended
		 * @param props		{Array}		The elements to be added
		 * @returns			{Array}		The modified array
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

		clone:function(obj)
		{
			if(obj == null || typeof(obj) != 'object')
			{
				return obj;
			}

			var temp = obj.constructor() || {}; // changed

			for(var key in obj)
			{
				temp[key] = xjsfl.utils.clone(obj[key]);
			}

			return temp;
		},

        /**
         * Adds properties to an object's namesapce by supplying a dot.syntax.path and properties object
         * @param	{Object}	target		The object in which to create the new object
         * @param	{String}	namespace	A string path to that object
         * @param	{Object}	properties	A properties object to create in the new namespace
         * @returns	{Object}			    The xJSFL object
         */
        namespace:function(target, namespace, properties)
        {
            var keys		= namespace.split('.');
            do
            {
                var key = keys.shift();
                if(keys.length > 0)
                {
                    if(typeof target[key] === 'undefined')
                    {
                        target[key] = {};
                    }
                    target = target[key];
                }
                else
                {
					if( target[key] == null)
					{
						target[key] = properties;
					}
					else
					{
						this.extend(target[key], properties);
					}

                }
            }
            while(keys.length);
            return this;
        },

		/**
		 * Trims the whitespace from both sides of a string
		 * @param	string	{String}	The input string to trim
		 * @returns			{String}	The trimmed string
		 */
		trim:function(string)
		{
			return String(string || '').replace(/(^\s*|\s*$)/g, '');
		},

		/**
		 * Pads a value to a certain length with a specific character
		 * @param	value	{Value}		Any value
		 * @param	length	{Number}	An optional length, defaults to 6
		 * @param	chr		{String}	An optional padding character, defaults to 0
		 * @param	right	{Boolean}	An optional flag to pad to the right, rather than the left
		 * @returns			{String}	The padded value
		 */
		pad:function(value, length, chr, right)
		{
			value	= String(value);
			chr		= chr || '0';
			length	= length || 6;
			while(value.length < length)
			{
				right ? value += chr : value = chr + value;
			}
			return value;
		},

		/**
		 * Checks if the object is an array or not
		 *
		 * @param obj	{Object}		Any object that needs to be checked if it's a true Array
		 * @returns		{Boolean}		True or false
		 */
		isArray:function (obj)
		{
			return toString.call(obj) === "[object Array]";
		},

		/**
		 * Turns a single value into an array
		 * It either returns an existing array, splits a string at delimiters, or wraps the single value in an array
		 *
		 * @param	value	{String}	A string
		 * @param	delim	{RegExp}	An optional RegExp with which to split the input string, defaults to any non-word character
		 * @param	delim	{String}	An optional character with which to split the string
		 * @returns			{Array}		A new Array
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

					// variables

					// if RegExp, split
						if(delim instanceof RegExp)
						{
							delim.global = true;
							return value.split(delim);
						}

					// else if String split
						else
						{
							delim		= delim.replace(/([\\\|\*\+])/g, '\\$1')
							var rxTrim	= new RegExp('^[\\s' +delim+ ']+|[\\s' +delim+ ']+$', 'g');
							var rxSplit	= new RegExp('\\s*' +delim+ '+\\s*', 'g');
							return value.replace(rxTrim, '').split(rxSplit);
						}

				}
				else
				{
					throw new TypeError('xjsfl.utils.toArray() expects a string');
				}
				return [value];
		},

		/**
		 * Returns a unique array without any duplicate items
		 *
		 * @param	arr		{Array}		Any array
		 * @returns			{Array}		A unique array
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
		 * Basic numeric Array sort function - JSFL one seems to default to string by default
		 * @param	arr		{Array}		An array to sort
		 * @param	reverse	{Boolean}	An optional flag to sort in reverse (descending) order
		 * @returns
		 */
		sort:function(arr, reverse)
		{
			function asc(a, b)  { return a < b ? -1 : (a > b ? 1 : 0); }
			function desc(a, b) { return a < b ? 1 : (a > b ? -1 : 0); }
			return arr.sort(reverse == true ? desc : asc);
		},

		/**
		 * Optimized Array sortOn method, for sorting Arrays by child property. This function modifies the input Array
		 * @param	arr		{Array}		An Array of Objects
		 * @param	prop	{String}	A property name to sort on; defaults to 'name'
		 * @param	alpha	{Boolean}	An optional flag to sort alphabetically
		 */
		sortOn:function(arr, prop, alpha)
		{

			//TODO Add option to sort alphabetically, including switches in partition

			function swap(arr, a, b)
			{
				var tmp = arr[a];
				arr[a] = arr[b];
				arr[b] = tmp;
			}

			function partition(array, begin, end, pivot)
			{
				var piv = alpha ? String(array[pivot][prop]).toLowerCase() : array[pivot][prop];
				swap(array, pivot, end - 1);
				var store = begin;
				var ix;
				for(ix = begin; ix < end - 1; ++ix)
				{
					if((alpha ? String(array[ix][prop]).toLowerCase() : array[ix][prop]) <= piv)
					{
						swap(array, store, ix);
						++store;
					}
				}
				swap(array, end - 1, store);

				return store;
			}

			function qsort(array, begin, end)
			{
				if(end - 1 > begin)
				{
					var pivot	= begin + Math.floor(Math.random() * (end - begin));
					pivot		= partition(array, begin, end, pivot);
					qsort(array, begin, pivot);
					qsort(array, pivot + 1, end);
				}
			}

			prop = prop || 'name';
			qsort(arr, 0, arr.length);
		},

		/**
		 * Get an Array of values from an Object, or an Array of Arrays/Objects from an Array of Objects
		 *
		 * @param	input	{Array}		An Object or an array of Objects
		 * @param	prop	{String}	The name of a property to collect
		 * @param	prop	{Function}	A callback function of the format function propertyName(element){ return element.property }
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
				if( ! xjsfl.utils.isArray(input))
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
						var propName;
						var props			= prop;
						var functionNames	= [];
						var output			= new Array(input.length);

					// check if any of the property names are actually functions, and if so, grab the function name in advance
						for(var f = 0; f < props.length; f++)
						{
							if(typeof props[f] === 'function')
							{
								functionNames[f] = Source.parseFunction(props[f]).name;
							}
						}

					// return objects
						if(option)
						{
							while(i++ < input.length - 1)
							{
								output[i] = {};
								for(var j = 0; j < props.length; j++)
								{
									propName = functionNames[j] || props[j];
									output[i][propName] = functionNames[j] ? props[j](input[i]) : input[i][propName];
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
									output[i][j] = functionNames[j] ? props[j](input[i]) : input[i][props[j]];
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
							output.push(typeof prop === 'function' ? prop(input[i]) : input[i][prop]);
						}
					}
				}

			// return
				return single ? output[0] : output;
		},

		/**
		 * Gets the value from an object by supplying a dot-syntaxed string
		 * @param	{Object}	obj		Any valid Object
		 * @param	{String}	dotPath	The dot-path to an object property
		 * @returns	{Value}				The value of the property, if it exists
		 */
		getDeepValue:function(obj, dotPath)
		{
			var parts = dotPath.split('.');
			while(parts.length > 1)
			{
				part = parts.shift();
				if(part in obj)
				{
					obj = obj[part];
				}
				else
				{
					return;
				}
			}
			return obj[parts[0]];
		},

		/**
		 * comparison function to get a max or min value within an array of objects
		 * @param	elements		{Array}		An Array of objects with named properties
		 * @param	prop			{String}	The property to test
		 * @param	bias			{Boolean}	An optional flag to get the max (true, default) or the min (false) value
		 * @param	returnElement	{Boolean}	An optional flag to return the element, rather than the value
		 * @returns					{Number}	The number
		 */
		getExtremeValue:function(elements, prop, bias, returnElement)
		{
			// comparison function
				function test(el, index, elements)
				{
					var val	= el[prop];
					value	= value || val;
					if(bias ? val > value : val < value)
					{
						value	= val;
						element	= el;
					}
				}

			// variables
				var value;
				var element;

			// test
				elements.forEach(test);

			// return
				return returnElement ? element : value;
		},


		/**
		 * Get an object's keys, or all the keys from an Array of Objects
		 *
		 * @param	obj	{Object}	Any object with iterable properties
		 * @param	obj	{Array}		An Array of objects with iterable properties
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
			if(name)
			{
				name = String(name).toLowerCase();
				for(var i = 0; i < fl.swfPanels.length; i++)
				{
					if(fl.swfPanels[i].name.toLowerCase() === name)
					{
						return fl.swfPanels[i];
					}
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
							path:(xjsfl.file.makePath(path, shorten)),
							uri:FLfile.platformPathToURI(path)
						};
				}

			// return
				return stack;
		},

		/**
		 * Parse any string into a real datatype. Supports Number, Boolean, hex (0x or #), XML, XMLList, Array notation, Object notation, JSON, Date, undefined, null
		 * @param	value	{String}	An input string
		 * @param	trim	{Boolean}	An optional flag to trim the string, on by default
		 * @returns			{Mixed}		The parsed value of the original value
		 */
		parseValue:function(value, trim)
		{
			// trim
				value = trim !== false ? xjsfl.utils.trim(value) : value;

			// undefined
				if(value === 'undefined')
					return undefined;

			// null - note that empty strings will be returned as null
				if(value === 'null' || value === '')
					return null;

			// Number
				if(/^(\d+|\d+\.\d+|\.\d+)$/.test(value))
					return parseFloat(value);

			// Boolean
				if(/^true|false$/i.test(value))
					return value.toLowerCase() === 'true' ? true : false;

			// Hexadecimal String / Number
				if(/^(#|0x)[0-9A-F]{6}$/i.test(value))
					return parseInt(value[0] === '#' ? value.substr(1) : value, 16);

			// XML
				if(/^<(\w+)\b[\s\S]*(<\/\1>|\/>)$/.test(value))
				{
					try { var xml = new XML(value); } // attempt to create XML
					catch(err)
					{
						try { var xml = new XMLList(value); } // fall back to XMLList
						catch(err) { var xml = value; } // fall back to text
					};
					return xml
				}

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
		 * Randomnly modify a seed value with a secondary modifier component
		 * @param value		{Number}	A value to modify
		 * @param modifier	{Number}	An optional modifier component with which to modify the original value
		 * @param modifier	{String}	An optional modifier component with which to modify the original value, with optional leading +,-,* or a trailing %
		 * @returns			{Number}	The modified value
		 */
		randomizeValue:function(value, modifier)
		{
			// value is a number
				if(typeof value === 'number')
				{
					// if a modifier is supplied,
						if(modifier != undefined)
						{
							// if a string is supplied,
								if(typeof modifier == 'string')
								{
									// value
										var matches = modifier.match(/([+-\/*])?(\d+(.\d+)?)(%)?/);
										if(matches)
										{
											// variables
												var modified;

											// components
												var sign	= matches[1];
												var offset	= parseFloat(matches[2]);
												var percent	= matches[4];

											// offset
												if(percent)
												{
													if(sign === '+' || sign === '-')
													{
														offset	= value * (offset / 100)
													}
													else if(sign === '*' || sign === '/')
													{
														offset	= (offset / 100);
													}
												}

											// modify value
												switch(sign)
												{
													case '+':
														modified = value + offset * Math.random();
													break;

													case '-':
														modified = value - offset * Math.random();
													break;

													case '*':
														modified = value * offset * Math.random();
													break;

													case '/':
														modified = value / offset * Math.random();
													break;

													default: // either side
														modified = value + (offset * Math.random()) - (offset / 2);
														//modified = value + (offset * 2 * Math.random()) - offset;

												}

												return modified;
										}
										else
										{
											return value;
										}

								}

							// otherwise, update according to the number
								else
								{
									return value + modifier * Math.random();
								}
						}

					// if a number is supplied, just randomize it
						else
						{
							return value * Math.random();
						}
				}

			// if value is an array, simply return a value between the two numbers
				else if(value instanceof Array)
				{
					return this.randomValue(value[0], value[1]);
				}

			// return
				return value;
		},

		/**
		 * Get a random value between 2 numbers
		 * @param	a	{Array}		A 2-element array defining the lower and upper limits
		 * @param	a	{Number}	The lower limit of the range
		 * @param	b	{Number}	The lower limit of the range
		 * @returns		{Number}	A number between a and b
		 */
		randomValue:function(a, b)
		{
			if(a instanceof Array)
			{
				b = a[1];
				a = a[0];
			}
			return a + (b - a) * Math.random();
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
		//TODO Convert trace() or log() to use Logger class


		OUTPUT_TYPE_TRACE:	'trace',
		OUTPUT_TYPE_ALERT:	'alert',

		/**
		 * Framework-only output function
		 */
		trace:function(message, newLine)
		{
			if(newLine)
			{
				fl.trace('');
				message = message.toUpperCase();
			}
			fl.trace('> xjsfl: ' + message);
		},

		/**
		 * Logging function
		 * @param	type	{String}	The type of log message
		 * @param	message	{String}	The text of the log message
		 * @returns
		 */
		log:function(type, message)
		{
			//TODO Connect this to user / framework settings, so messages are only logged if the setting allows it
			if(xjsfl.settings.debugLevel > 0)
			{
			}
				this.trace(message);
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
		 * @param	type			{String}	The folder in which to look in to find the files, @see switch statement
		 * @param	name			{String}	A file name (pass no extension to use default), or partial file path
		 * @param	returnType		{Number}	An optional 0, 1 or -1; 0: all files (default), -1: the last file (user), 1:the first file (core)
		 * @returns					{String}	A single file path if found and return type is 1 or -1, or null if not
		 * @returns					{Array}		An Array of file uris if found, and return type is 0, or null if not
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

						// for full config path return the last file found from: core, modules, user (xml)
						case 'config':
							path	= 'config/' + name;
							ext		= '.xml';
							which	= -1;
						break;

						// for templates, return the last file found, from: core, modules, user (txt, or supplied extension)
						case 'template':
							path	= 'assets/templates/' + name;
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
					var paths		= xjsfl.settings.uris.all;

				// check all paths for files
					for(var i = 0; i < paths.length; i++)
					{
						var uri = paths[i] + path;
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
						return uris;
					}
		},

		/**
		 * Attempts to find and run or return files from the cascading file structure.
		 * Parameters and return type vary depending on file type!
		 *
		 * @param path			{String}		The relative or absolute path, or uri to the file
		 *
		 * @param name			{String}		The name or path fragment to a file, with or without the file extension
		 * @param type			{String}		The folder type in which to look (i.e. settings) for the file(s)
		 *
		 * @returns				{Boolean}		A Boolean indicating Whether the file was successfully found and loaded
		 * @returns				{XML}			An XML object of the content of the file, if XML
		 * @returns				{String}		The string content of the file otherwise
		 */
		load:function (path, type)
		{
			/*
				// path types
					if absolute or relative path, attempt to load it
					if type and name, find it, then attempt to load it

				// signatures
					load(path)
					load(name, type)
			*/

			// variables
				var result	= null;

			// --------------------------------------------------------------------------------
			// Load file

				// a URI was passed in
					if(this.isURI(path))
					{
						result		= FLfile.exists(path) ? path : null;
					}

				// a single path was passed in, so it to a uri
					else if(type == undefined || type === true || type === false)
					{
						var uri		= xjsfl.file.makeURI(path);
						result		= FLfile.exists(uri) ? uri : null;
					}

				// name and type supplied, so find the file we need in the cascading file system
					else
					{
						result = xjsfl.file.find(type, path);
					}

			// --------------------------------------------------------------------------------
			// take action on results

				// if result is null, no files were found
					if(result == null)
					{
						path = this.makePath(path);
						if(type == null || type === true || type === false)
						{
							xjsfl.output.trace('Error in xjsfl.file.load(): The file "' +path+ '" could not be found');
						}
						else
						{
							xjsfl.output.trace('Error in xjsfl.file.load(): Could not resolve type "' +type+ '" and path "' +path+ '" to an existing file');
						}
					}

				// otherwise, do something with the uri / uris (plural) if more than 1 was found
					else
					{

						var uris = xjsfl.utils.isArray(result) ? result : [result];

						for (var i = 0; i < uris.length; i++)
						{
							// variables
								var uri		= uris[i];
								var ext		= uri.match(/(\w+)$/)[1];

							// debug
								//TODO Decide whether to display this or not
								var _path	= xjsfl.file.makePath(uri, true);
								xjsfl.output.log('xjsfl.file.load', 'loading "' + _path + '"');
								if(xjsfl['loading'])
								{

								}

							// flag
								xjsfl.file.stack.push(uri);

							// do something depending on extension
								switch(ext)
								{
									case 'jsfl':
										fl.runScript(uri);
										//xjsfl.output.trace('Loaded ' + _path);
										xjsfl.file.stack.pop();
										return uri;
									break;

									case 'xul':
									case 'xml':
										var contents	= FLfile.read(uri);
										contents		= contents.replace(/<\?.+?>/, ''); // remove any doc type declaration
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
				return undefined;
		},


		/**
		 * Create a valid URI from a supplied string
		 * Function has the same internal functionality as makePath()
		 *
		 * @param	str			{String}	An absolute path, relative path, or uri
		 * @param	context		{String}	An optional context (uri or path), from which to start the URI
		 * @param	context		{Boolean}	An alternative optional Boolean indicating to automatically derive the URI from the calling function's file location
		 * @returns				{String}	An absolute URI
		 * @see								xjsfl.file.makePath
		 */
		makeURI:function(str, context)
		{
			// if str is already a URI, no need to convert so return immediately
				str = String(str);
				if(str.indexOf('file:') == 0)
				{
					return str;
				}

			// variables
				var path		= str;

			// if an additional filepath is passed in, the returned URI will be relative to it
				if(typeof context === 'string')
				{
					context 	= context.replace(/[^\/\\]+$/, '');
					path		= xjsfl.file.makePath(context) + path;
				}

			// if context is true, then the returned URI will be relative to the calling script
			// if path is true, the returned URI will be the folder of the calling script
				else if(context === true || path === true)
				{
					var stack	= xjsfl.utils.getStack();
					path		= xjsfl.file.makePath(stack[3].path) + (path === true ? '' : path);
				}

			//TODO IMPORTANT! Throw error / passback false on empty string
			//TODO If an empty string is passed back, the system assumes the URI is the root. This could be dangerous (especialy if files are to be deleted!) so consider throwing an error, or passing back xJSFL core
			// Also, if a recursive operation is to be called, this could freeze flash if too many files

			// error if empty string
				if( ! path )
				{
					throw new Error('Error: Path "' +str+ '" evaluates to "" in xjsfl.file.makeURI()');
				}

			// return the final URI using the system FLfile commands
				return FLfile.platformPathToURI(xjsfl.file.makePath(path));
		},


		/**
		 * Create a valid path from a supplied string
		 *
		 * Function will:
		 *
		 * - convert file:/// to paths
		 * - convert {xjsfl} and {config} tokens
		 * - convert relative paths to absolute from xJSFL folder
		 * - replace multiple / and \ with /
		 * - resolve ../ tokens to correct parent folder
		 *
		 * @param	str			{String}	An absolute path, relative path, or uri
		 * @param	shorten		{Boolean}	An optional boolean to return a path with {xjsfl} or {config} swapped out from the actual path
		 * @returns				{String}	An absolute or shortened path
		 */
		makePath:function(str, shorten)
		{
			// make sure path is a string
				var path = String(str);

			// if a URI is passed in, just convert it
				if(str.indexOf('file:///') === 0)
				{
					path = FLfile.uriToPlatformPath(str);
				}
				else
				{
					path = unescape(str);
				}

			// convert {config} and {xjsfl} tokens
				var matches = path.match(/{(\w+)}/);
				if(matches)
				{
					var uri = xjsfl.settings.folders[matches[1]];
					if(uri)
					{
						path = path.replace(matches[0], FLfile.uriToPlatformPath(uri))
					}
					else
					{
						throw new URIError('URIError in xjsfl.file.makePath(): Unrecognised placeholder in path "' +path+ '"');
					}
				}

			// if a relative path is passed in, convert it to absolute from the xJSFL root
				if( ! xjsfl.file.isAbsolutePath(path))
				{
					path = FLfile.uriToPlatformPath(xjsfl.uri) + path;
				}

				//TODO Add support for "./", and confirm results of "../" and "/"

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
						.replace(FLfile.uriToPlatformPath(xjsfl.settings.folders.flash).replace(/\\+/g, '/'), 'Configuration/')
						.replace(FLfile.uriToPlatformPath(xjsfl.settings.folders.xjsfl).replace(/\\+/g, '/'), 'xJSFL/')
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
			if(xjsfl.settings.app.platform === 'mac')
			{
				return path.substr(0, 1).replace('\\', '/') === '/';
			}
			else
			{
				return /^[A-Z]:/i.test(path);
			}
		},

		isURI:function(str)
		{
			return str.indexOf('file://') === 0;
		}

	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  █████        ██
//  ██  ██       ██
//  ██  ██ █████ █████ ██ ██ █████
//  ██  ██ ██ ██ ██ ██ ██ ██ ██ ██
//  ██  ██ █████ ██ ██ ██ ██ ██ ██
//  ██  ██ ██    ██ ██ ██ ██ ██ ██
//  █████  █████ █████ █████ █████
//                              ██
//                           █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Debug

	xjsfl.debug =
	{
		_error:false,

		_runScript:fl.runScript,

		/*init:function(scope, state)
		{
			// variables
				state = state !== false;
				var fl = scope.flash || flash;

			// set or reset functions
				if(state)
				{
					// delegate loading functionality
						if(fl.runScript !== xjsfl.debug.file)
						{
							xjsfl.output.trace('Turning file debugging: on');
							fl.runScript = xjsfl.debug.file;
						}

					// clear the debug log
						xjsfl.debug.clear();
				}
				else
				{
					if(xjsfl.debug.state)
					{
						xjsfl.output.trace('Turning file debugging: off');
						fl.runScript = xjsfl.debug._runScript;
						delete fl._runScript;
					}
				}

			// debug
				xjsfl.output.trace('File debugging is: ' + (state ? 'on': 'off'));
		},*/

		/**
		 * Debugs script files by loading and eval-ing them
		 * @param		{String}		uriOrPath		The URI or path of the file to load
		 */
		file:function(uriOrPath)
		{
			// make uri
				var uri = xjsfl.file.makeURI(uriOrPath);

			if(FLfile.exists(uri))
			{
				// Turn on file debugging if not yet set
					var state = false;
					if( ! this.state )
					{
						xjsfl.debug._error	= false;
						state				= true;
						this['state'] = true; // brackets used, otherwise Komodo puts state above func in the code outliner
					}

				// debug
					xjsfl.output.trace('Debugging "' + FLfile.uriToPlatformPath(uri) + '"...');

				// test the new file
					var jsfl = FLfile.read(uri).replace(/\r\n/g, '\n');
					try
					{
						// test file
							eval(jsfl);

						// turn off file debugging if this load was the initial load
							if(state)
							{
								this['state'] = false;
							}

						// return
							return true;
					}

				// log errors if there are any
					catch(err)
					{
						//Output.inspect(err)

						// create a new error object the first time an error is trapped
							if( ! xjsfl.debug._error)
							{
								// flag
									xjsfl.debug._error = true;

								// variables
									var evalLine	= 1562;	// this needs to be the actual line number of the eval(jsfl) line above
									var line		= parseInt(err.lineNumber) - (evalLine) + 1;

								// turn off debugging
									this['state'] = false;

								// create a new "fake" error
									var error			= new Error(err.name + ': ' + err.message);
									error.name			= err.name;
									error.lineNumber	= line;
									error.fileName		= uri;

								// log the "fake" error
									xjsfl.debug.log(error);

								// throw the new error so further script execution is halted
									throw(error)
							}

						// re-throw the fake error (this only occurs in higher catches)
							else
							{
								throw(err);
							}
					}
			}
			else
			{
				throw(new URIError('URIError: The uri "' +uri+ '" does not exist'));
			}

		},

		/**
		 * Tests a callback and outputs the error stack if the call fails. Add additional parameters after the callback reference
		 * @param	fn		{Function}	The function to test
		 * @param	params	{Array}		An array or arguments to pass to the function
		 * @param	scope	{Object}	An alternative scope to run the function in
		 * @returns			{Value}		The result of the function if successful
		 */
		func:function(fn, params, scope)
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
					return fn.apply(scope || this, params);
				}
				catch(err)
				{
					this.error(err, true);
				}
				return null;
		},

		/**
		 * Traces a human-readable error stack to the Output Panel
		 *
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
				var uriErrors	= xjsfl.file.makeURI('core/assets/templates/errors/errors.txt');
				var uriError	= xjsfl.file.makeURI('core/assets/templates/errors/error.txt');

			// reload template if not defined (caused by some kind of bug normally)
				if( ! xjsfl.classes.Template)
				{
					xjsfl.classes.load('filesystem');
					xjsfl.classes.load('template');
				}

			// build errors
				var content = '';
				for(var i = 0; i < stack.length; i++)
				{
					stack[i].index = i;
					content += new xjsfl.classes.Template(uriError, stack[i]).render(); // reference Template class directly
				}

			// build output
				var data = { error:error.toString(), content:content };
				fl.trace(new xjsfl.classes.Template(uriErrors, data).render());

			// set loading to false
				xjsfl['loading'] = false;
		},

		/**
		 * Logs the results of an error to the temp directory so Komodo can read in the data
		 *
		 * @param		{String}		uri			The URI of the erroring file
		 * @param		{Number}		line		The line number of the error
		 * @param		{String}		name		The name of the error
		 * @param		{String}		message		The error message
		 */
		log:function(error)
		{
			var data		= [error.fileName, error.lineNumber, error.name, error.message].join('\r\n');
			var state		= FLfile.write(xjsfl.uri + 'core/temp/error.txt', data);
		},

		/**
		 * Clears any existing error logs
		 */
		clear:function()
		{
			var uri = xjsfl.uri + 'core/temp/error.txt';
			if(FLfile.exists(uri))
			{
				FLfile.remove(uri);
			}
		},

		/**
		 * File debugging state
		 */
		set state(state)
		{
			//TODO Think about making this a simple boolean, then updating file.load() to check for debug.state == true

			// set or reset functions
				if(state)
				{
					// delegate loading functionality
						if(fl.runScript !== xjsfl.debug.file)
						{
							xjsfl.output.trace('Turning file debugging: on');
							fl.runScript = xjsfl.debug.file;
							//fl.trace('>>' + fl.runScript)
						}

					// clear the debug log
						xjsfl.debug.clear();
				}
				else
				{
					if(xjsfl.debug.state)
					{
						xjsfl.output.trace('Turning file debugging: off');
						fl.runScript = xjsfl.debug._runScript;
						delete fl._runScript;
					}
				}

			// debug
				xjsfl.output.trace('File debugging is: ' + (state ? 'on': 'off'));

		},

		get state()
		{
			return fl.runScript === xjsfl.debug.file;
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
		paths:{},

		/**
		 * Load a class or array of classes from disk
		 *
		 * @param	filename	{String}	A class filename or path, relative to any jsfl/libraries folder
		 * @param	filename	{Array}		An Array of class filepaths
		 * @param	debugType	{String}	An optional debug type. Pass xjsfl.output.OUTPUT_TYPE constants here
		 * @returns				{xjsfl}		The main xJSFL object
		 */
		load:function(filename, debugType)
		{
			// arrayize paths
				var paths = filename instanceof Array ? filename : [filename];

			//TODO Add a check to see if we are loading, and if so, only load classes that are not yet defined. Can we do that? Do we need to cache load paths in that case?

			// load classes
				for(var i = 0; i < paths.length; i++)
				{
					if(paths[i].indexOf('xjsfl') == -1) // don't reload load xjsfl
					{
						if(debugType != undefined)
						{
							var str = 'Loading class file ' +(i + 1)+ '/' +paths.length+ ': ' + paths[i];
							(debugType == xjsfl.output.OUTPUT_TYPE_TRACE ? xjsfl.output.trace : alert)(str);
						}

						xjsfl.file.load(paths[i], 'library', debugType === 2);
					}
				}

			// return
				return this;
		},

		/**
		 * Load an entire folder of libraries
		 * @param	filename	{String}	A class filename or path, relative to any jsfl/libraries folder
		 * @param	debugType	{String}	An optional debug type. Pass xjsfl.output.OUTPUT_TYPE constants here
		 * @returns				{xjsfl}		The main xJSFL object
		 */
		loadFolder:function(path, debugType)
		{
            //TODO add a list of filenames to prioritize
			//TODO refactor loadFolder to load() by detecting folder path or Folder class

			// grab files
				var uri		= xjsfl.file.makeURI(path);
				var files	= FLfile.listFolder(uri, 'file')
								.filter( function(file){ return /.jsfl$/.test(file); } )
								.map( function(file){ return file.replace('.jsfl', ''); } );

			// load files
				xjsfl.classes.load(files);

			// return
				return this;
		},

		/**
		 * Loads a class only if not already defined
		 * @param	filename	{String}	The class name, such as 'Template', or 'Table'
		 * @returns
		 */
		require:function(filename)
		{
			// load path
				var path = this.paths[name];
				if( ! path )
				{
					this.load(name);
				}

			// return
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
			if( ! /^(paths|load|loadFolder|require|register|restore)$/.test(name) )
			{
				xjsfl.classes[name]    = obj;
				var object             = xjsfl.utils.getStack().pop();
				this.paths[name]       = object.path + object.file;
			}
			return this;
		},

		/**
		 * Internal function that restores a class/function to the supplied namespace
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
	 * Dummy properties for Komodo code inteligence
	 */
	xjsfl.modules =
	{
		/**
		 * Gets the manifest for a particular module namespace
		 * @param	{String}	namespace	The namespace of the manifest to get
		 * @returns	{XML}					The manifest XML
		 */
		getManifest:function(namespace){ },


		/**
		 * Gets the Module instance for a particular module namespace
		 * @param	{String}	namespace	The namespace of the module (should match the AS3 and manifest values)
		 * @returns	{Module}				An xJSFL Module instance
		 */
		getModule:function(namespace){ },


		/**
		 * Finds and stores information about all module manifests in the xJSFL/modules (or supplied) folder.
		 * Called in the main bootstrap, and can be called manually in the user bootstrap to add other folders.
		 * @param	{String}	uri		An optional folder URI to search in, defaults to xJSFL/modules/
		 * @returns	{xjsfl}				The main xJSFL object
		 */
		find:function(uri){ },


		/**
		 * Runs the module bootstrap to load code locally into the host panel
		 * @param	{String}	namespace	The namespace of the module to initialize
		 */
		load:function(namespace){ },


		/**
		 * Factory method to create an xJSFL module instance
		 * @param	{String}	namespace	The namespace of the module (should match the AS3 and manifest values)
		 * @param	{Object}	properties	The properties of the module
		 * @returns	{Module}				An xJSFL Module instance
		 */
		create:function(namespace, properties){ }
	}

	/**
	 * A namespace in which to store module code to prevent pollution of global
	 * scope as well as a couple of methods to add and load module code
	 *
	 * Needs to be created in a closure to keep the modules and manifests private
	 */
	xjsfl.modules =
	(
		/**
		 * The module loading process goes like this...
		 *
		 * 1 - 	All modules reside in their own folder, with a manifest.xml in the root, and a
		 * 		bootstrap.jsfl in jsfl. The manifest stores all information about the module, and
		 * 		the bootstrap contains optional JSFL code that the module needs to run on startup.
		 *
		 * 2 - 	During the main xJSFL bootstrap, xjsfl.modules.find() is called, to search the main
		 *		modules folder for modules' manifest.xml files. Note that find() can also be called
		 *		manually from the user bootstrap to initialize modules external to the xJSFL modules
		 *		folder.
		 *
		 * 3 -	For any modules that are found, xjsfl.modules.init(path) is called and the module's
		 *		manifest information is cached, and any panel SWFs are copied to the WindowSWF folder.
		 *		Note that no modules instances are instantiated yet.
		 *
		 * 4 -	When any panels are opened, xjsfl.modules.load(namespace) is called via MMExecute()
		 * 		from the AbtractModule.initialize() function. This loads the module's bootstrap.jsfl
		 *		file, which should in turn load the module's main JSFL file which contains the module's
		 *		JSFL properties and method. This file then calls...
		 *
		 * 5 -	...xjsfl.modules.create(), which creates and registers the module internally, so it
		 *		can be retrieved if necessary via xjsfl.modules.getModule(namespace)
		 *
		 */

		function()
		{
			/**
			 * A private reference to all found manifests
			 */
			var manifests = {};

			/**
			 * A private reference to all loaded modules
			 */
			var modules = {};

			/**
			 * The property object that will be returned as xjsfl.modules
			 */
			var obj =
			{
				/**
				 * Gets the manifest for a particular module namespace
				 * @param	{String}	namespace	The namespace of the manifest to get
				 * @returns	{XML}					The manifest XML
				 */
				getManifest:function(namespace)
				{
					var manifest = manifests[namespace];
					if(manifest)
					{
						return manifest;
					}
					throw new Error('xjsfl.modules.getManifest(): there is no manifest registered under the namespace "' +namespace+ '"');
				},

				/**
				 * Gets the Module instance for a particular module namespace
				 * @param	{String}	namespace	The namespace of the module (should match the AS3 and manifest values)
				 * @returns	{Module}				An xJSFL Module instance
				 */
				getModule:function(namespace)
				{
					var module = modules[namespace];
					if(module)
					{
						return module;
					}
					throw new Error('xjsfl.modules.getModule(): there is no module registered under the namespace "' +namespace+ '"');
				},

				/**
				 * Finds and stores information about all module manifests in the xJSFL/modules (or supplied) folder.
				 * Called in the main bootstrap, and can be called manually in the user bootstrap to add other folders.
				 * @param	{String}	uri		An optional folder URI to search in, defaults to xJSFL/modules/
				 * @returns	{xjsfl}				The main xJSFL object
				 */
				find:function(uri)
				{
					// callback function to process files and folders
						function processFile(element)
						{
							if(element instanceof Folder)
							{
								// skip folders where manifests shouldn't be
								if(/assets|config|docs|temp|ui/.test(element.name))
								{
									return false;
								}
							}
							// if a manifest is found, initialize it
							else if(element.name === 'manifest.xml')
							{
								xjsfl.modules.init(element.parent.uri);
								return false;
							}
						};

					// find and load modules automatically
						Data.recurseFolder(uri || xjsfl.settings.folders.modules, processFile);

					// return
						return this;
				},

				//TODO Does init() need to be public? Consider making it private

				/**
				 * Initializes, but does not instantiate a module, by caching its manifest files, and copying
				 * any panel resources to the Flash/WindowSWF folder, and commands to the Commands folder
				 *
				 * @param	path	{String}	The module root path, relative to from xJSFL/modules/ i.e. "Snippets", or an absolute URI
				 */
				init:function(path)
				{
					// ensure path has a trailing slash
						path = path.replace(/\/*$/, '/');

					// if path is not a URI, it will probably be a path fragment, so default to the modules folder
						if( ! xjsfl.file.isURI(path))
						{
							var uri			= xjsfl.settings.folders.modules + path;
						}
						else
						{
							var uri			= path;
						}

					// attempt to load the module's manifest
						var manifest		= xjsfl.file.load(uri + 'manifest.xml');
						if( ! manifest)
						{
							return this;
						}

					// update with the actual URI & store
						manifest.jsfl.uri		= uri;
						var namespace			= String(manifest.jsfl.namespace);
						manifests[namespace]	= manifest;

					// debug
						xjsfl.output.trace('registering module "' +String(manifest.info.name)+ '"');

					// copy any panels to the WindowSWF folder
						var folder = new xjsfl.classes.Folder(xjsfl.file.makeURI(path + 'ui/'));
						for each(var src in folder.files)
						{
							if(src.extension === 'swf')
							{
								// grab any existing target panels
									var trg = new File(fl.configURI + 'WindowSWF/' + src.name);

								// check exists and compare dates
									if(! trg.exists || src.modified > trg.modified)
									{
										xjsfl.output.trace('copying "' + xjsfl.file.makePath(src.uri, true) + '" to "Flash/Configuration/WindowSWF/"');
										src.copy(fl.configURI + 'WindowSWF/', true);
									}

								// no need to copy if up to date
									else
									{
										xjsfl.output.trace('panel "' + src.name.replace('.swf', '') + '" is already up to date');
									}
							}
						}

					//TODO Add code to copy commands here as well

					// preload
						if(String(manifest.jsfl.preload) == 'true')
						{
							this.load(manifest.jsfl.namespace);
						}

					// return
						return this;
				},

				/**
				 * Runs the module bootstrap to load code locally into the host panel
				 * @param	{String}	namespace	The namespace of the module to initialize
				 */
				load:function(namespace)
				{
					var manifest = manifests[namespace];
					if(manifest)
					{
						xjsfl.file.load(String(manifest.jsfl.uri) + 'jsfl/bootstrap.jsfl');
					}
					else
					{
						throw new Error('xjsfl.modules.load(): there is no module registered under the namespace "' +namespace+ '"');
					}
				},

				/**
				 * Factory method to create an xJSFL module instance
				 * @param	{String}	namespace	The namespace of the module (should match the AS3 and manifest values)
				 * @param	{Object}	properties	The properties of the module
				 * @returns	{Module}				An xJSFL Module instance
				 */
				create:function(namespace, properties, window)
				{
					// if manifest is not yet loaded (perhaps in development) attempt to initialize the module
						if( ! manifests[namespace])
						{
							this.init(namespace);
						}

					// create module
						try
						{
							var module = new xjsfl.classes.Module(namespace, properties, window);
							if(module)
							{
								modules[namespace] = module;
							}
							return module;
						}
						catch(err)
						{
							xjsfl.debug.error(err);
						}
				}
			}

			return obj;
		}
	)();



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
	 * Global access to XUL UI dialogs
	 */
	xjsfl.ui =
	{
		dialogs:[],

		/**
		 * Show a new XUL dialog, nesting if one is already shown
		 * @param	xul		{XUL}		A valid XUL object
		 * @returns			{Object}	The settings object from the XMLUI
		 */
		show:function(xul)
		{
			// clear dialogs if there's no current XMLUI
				var xulid = fl.xmlui.get('xulid');
				if(xulid == undefined)
				{
					this.dialogs = [];
				}

			// grab new id
				xul.id			= this.dialogs.length;

			// update XML id placeholders with correct id
				 var xml		= xul
									.xml.toXMLString()
									.replace(/{xulid}/g, xul.id)
									.replace(/xjsfl.ui.handleEvent\(0,/g, 'xjsfl.ui.handleEvent(' +xul.id+ ',');

			// save XML to dialog.xml
				var uri			= xul.uri || xjsfl.file.makeURI('core/temp/dialog.xul');
				new File(uri, xml);

			// register XUL
				this.dialogs.push(xul);

			// debug
				//Output.list(this.dialogs, null, 'Dialog opened')

			// show
				var settings = $dom.xmlPanel(uri);

			// unregister
				this.dialogs.pop();

			// debug
				//Output.inspect(settings);

			// return settings
				return settings;
		},

		handleEvent:function(xulid, type, id)
		{
			var dialog = this.dialogs[xulid];
			if(dialog)
			{
				dialog.handleEvent(type, id);
			}
		},

		/**
		 * Lightweight function to return the current UI state
		 * @returns		{Object}
		 */
		getState:function()
		{
			//TODO Add in boolean to also get the selected elements
			var obj = {};
			var dom = fl.getDocumentDOM();
			if(dom)
			{
				//BUG CS5.5 won't allow you to get a timeline sometimes
				var timeline = dom.getTimeline();
				obj =
				{
					document:	dom.pathURI || dom.name,
					timeline:	timeline.name,
					layers:		String(timeline.getSelectedLayers()),
					frames:		String(timeline.getSelectedFrames()),
					numLayers:	timeline.layers.length,
					numFrames:	timeline.frameCount,
					selection:	null
				}
			}
			return obj;
		},

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

	// add events stub. event code will be added in core/jsfl/libraries/events.jsfl
		if( ! xjsfl.events )
		{
			xjsfl.events = {};
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
	 * These properties are assigned using extend, to remain hidden from Komodo's code-intelligence
	 */
	(function()
	{
		var props =
		{
			/**
			 * Shortcut to trace function
			 * @returns
			 */
			trace:function()
			{
				xjsfl.output.trace.apply(this, arguments);
			},

			/**
			 * Reload the framework from disk
			 */
			reload:function(force)
			{
				//TODO Possibly add in an alert box which is controlled by debug level
				if( ! xjsfl['loading'] || force === true)
				{
					//alert('RELOADING!')
					delete xjsfl.uri;
					xjsfl.debug.state = false;
					fl.runScript(fl.configURI + 'Tools/xJSFL Loader.jsfl');
				}
			},

			/**
			 * Stand toString function
			 * @returns
			 */
			toString:function()
			{
				return '[object xJSFL]';
			}

		}

		xjsfl.utils.extend(xjsfl, props)

	})()

	/**
	 * Initialize the environment by extracting variables / objects / functions to global scope
	 * @param	scope		{Object}	The scope into which the framework should be extracted
	 * @param	scopeName	{String}	An optional id, which when supplied, traces a short message to the Output panel
	 * @returns
	 */
	xjsfl.init = function(scope, scopeName)
	{
		// copy core variables and functions into scope
			xjsfl.initVars(scope, scopeName);

		// debug
			if(scopeName)
			{
				xjsfl.output.trace('copying classes to [' +scopeName+ ']');
			}

		// copy registered classes into scope
			xjsfl.classes.restore(scope);

		// flag xJSFL initialized by setting a scope-level variable (xJSFL, not xjsfl)
			scope.xJSFL		= xjsfl;
	}
