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
		 * @returns	{Document}		A Document object
		 * @returns	{Boolean}		False if not available
		 */
		dom:function(error)
		{
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
		 * @returns	{Timeline}		A Timelineobject
		 * @returns	{Boolean}		False if not available
		 */
		timeline:function(error)
		{
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
		 * @returns	{Array}			An array of library items
		 * @returns	{Boolean}		False if not available
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
		 * @returns	{Array}			An array of elements
		 * @returns	{Boolean}		False if no selection
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
			// properties
				xjsfl:		xjsfl.uri,
				core:		xjsfl.uri + 'core/',
				modules:	xjsfl.uri + 'modules/',
				user:		xjsfl.uri + 'user/',
				flash:		fl.configURI,
				swf:		fl.configURI + 'WindowSWF/',

			// methods
				add:function(name, uri)
				{
					if( ! /^(all|add)$/.test(this.name) )
					{
						this[name] = URI.toURI(uri);
					}
				},

				/** @type {Array}	An Array of all registered placeholder URIs in reverse-order (for searching) */
				get all()
				{
					var uris = [];
					for(var name in this)
					{
						if( ! /^(all|add)$/.test(name) )
						{
							uris.push(this[name]);
						}
					}
					return uris.sort().reverse();
				}
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
				add:function(pathOrURI, type)
				{
					// check uri is valid
						var uri = URI.toURI(pathOrURI);

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

				/** @type {Array}	An Array of all search URIs */
				get all()
				{
					var uris = xjsfl.settings.uris;
					return [].concat(uris.core)
								.concat(uris.module)
								.concat(uris.user);
				}
		},

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
		 * @param	{Array}		arr			An array of elements to be passed to the callback
		 * @param	{Function}	func		The function to call
		 * @param	{Array}		params		An opptional array of arguments to be passed
		 * @param	{Number}	argIndex	An optional argument index in which the original array element should be passed
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
						func.apply(this, args);
					}
				)

			// return
				return this;
		},

		/**
		 * Extends an object or array with more properties or elements
		 *
		 * @param	{Object}	obj			A source Object to be extended
		 * @param	{Object}	props		The properties to be added
		 * @returns	{Object}				The modified object
		 *
		 * @param	{Array}		obj			A source Array to be extended
		 * @param	{Array}		props		The elements to be added
		 * @returns	{Array}					The modified array
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
		 * Trims the whitespace from both sides of a string
		 * @param	{String}	string		The input string to trim
		 * @returns	{String}				The trimmed string
		 */
		trim:function(string)
		{
			return String(string || '').replace(/(^\s*|\s*$)/g, '');
		},

		/**
		 * Pads a value to a certain length with a specific character
		 * @param	{Value}		value		Any value
		 * @param	{Number}	length		An optional length, defaults to 6
		 * @param	{String}	chr			An optional padding character, defaults to 0
		 * @param	{Boolean}	right		An optional flag to pad to the right, rather than the left
		 * @returns	{String}				The padded value
		 */
		pad:function(value, length, chr, right)
		{
			value	= String(value || '');
			chr		= chr || '0';
			length	= typeof length === 'undefined' ? 6 : length;
			while(value.length < length)
			{
				right ? value += chr : value = chr + value;
			}
			return value;
		},

		/**
		 * Checks if the object is a true array or not
		 *
		 * @param	{Object}	obj			Any object that needs to be checked if it's a true Array
		 * @returns	{Boolean}				True or false
		 */
		isArray:function (obj)
		{
			return Object.prototype.toString.call(obj) === "[object Array]";
		},

		/**
		 * Turns a single value into an array
		 * It either returns an existing array, splits a string at delimiters, or wraps the single value in an array
		 *
		 * @param	{String}	value		A string
		 * @param	{RegExp}	delim		An optional RegExp with which to split the input string, defaults to any non-word character
		 * @param	{String}	delim		An optional character with which to split the string
		 * @returns	{Array}					A new Array
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
		 * @param	{Array}		arr			Any array
		 * @returns	{Array}					A unique array
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
		 * Basic numeric Array sort function
		 * @param	{Array}		arr			An array to sort
		 * @param	{Boolean}	reverse		An optional flag to sort in reverse (descending) order
		 * @returns	{Array}					The sorted Array
		 */
		sort:function(arr, reverse)
		{
			function asc(a, b)  { return a - b }
			function desc(a, b) { return b - a }
			return arr.sort(reverse == true ? desc : asc);
		},

		/**
		 * Optimized Array sortOn method, for sorting Arrays by child property. This function modifies the input Array
		 * @param	{Array}		arr			An Array of Objects
		 * @param	{String}	prop		A property name to sort on; defaults to 'name'
		 * @param	{Boolean}	alpha		An optional flag to sort alphabetically
		 */
		sortOn:function(arr, prop, alpha)
		{
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
		 * @param	{Array}		input		An Object or an array of Objects
		 * @param	{String}	prop		The name of a property to collect
		 * @param	{Function}	prop		A callback function of the format function propertyName(element){ return element.property }
		 * @param	{Array}		prop		The names of properties to collect
		 * @param	{Boolean}	prop		A Boolean indicates you want to collect ALL properties
		 * @param	{Boolean}	option		If passing and returning a single object, pass true to make it unique. If returning a 2D array, pass true to return Objects
		 * @returns	{Array}					A new 1D or 2D Array
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
		 * Gets properties from an object's namespace via a dot.syntax.path String
		 * @param	{Object}	obj			The root object from which to extract the deep value
		 * @param	{String}	path		The dot-path to an existing object property
		 * @returns	{Value}					The value of the property, if it exists
		 */
		getDeepValue:function(obj, path)
		{
			path = String(path);
			if(path.indexOf('.') == -1)
			{
				return obj[path];
			}
			else
			{
				var keys = path.split('.');
				while(keys.length > 1)
				{
					key = keys.shift();
					if(key in obj)
					{
						obj = obj[key];
					}
					else
					{
						return;
					}
				}
				return obj[keys[0]];
			}
		},

        /**
         * Add nested properties to an object's namespace via a dot.syntax.path String
         * @param	{Object}	obj			The root object on which to create the deep value
         * @param	{String}	path		A dot-syntax path to a new object property
         * @param	{Object}	properties	An object or value to add to the new namespace
         */
        setDeepValue:function(obj, path, properties)
        {
			path		= String(path);
            var keys	= path.split('.');
            do
            {
				// get the next key
					var key = keys.shift();

				// extend
					if(keys.length > 0)
					{
						if( ! (key in obj) )
						{
							obj[key] = {};
						}
						obj = obj[key];
					}

				// assign
					else
					{
						//trace(key)
						//trace(obj)
						if( ! (key in obj) )
						{
							trace('assigning')
							obj[key] = properties;
						}
						else
						{
							trace('extending')
							this.extend(obj[key], properties);
						}

					}
            }
            while(keys.length);
        },

		/**
		 * Comparison function to get a max or min value within an array of objects
		 * @param	{Array}		elements		An Array of objects with named properties
		 * @param	{String}	prop			The property to test
		 * @param	{Boolean}	returnElements	An optional flag to return the element, rather than the value
		 * @returns	{Array}						A 2-element Array containing the min and max values, or min and max elements
		 */
		getExtremeValues:function(elements, prop, returnElement)
		{
			// comparison function
				function test(element, index, elements)
				{
					var value = element[prop];
					if(value > maxValue)
					{
						maxValue	= value;
						maxElement	= element;
					}
					else if(value < minValue)
					{
						minValue	= value;
						minElement	= element;
					}
				}

			// catch empty array
				if( ! elements || ! this.isArray(elements) || elements.length < 1)
				{
					return {min:undefined, max:undefined};
				}

			// variables
				var minElement	= elements[0];
				var maxElement	= elements[0];
				var minValue	= elements[0][prop];
				var maxValue	= elements[0][prop];

			// test
				elements.forEach(test);

			// return
				return returnElement ? [minElement, maxElement] : [minValue, maxValue];
		},


		/**
		 * Get an object's keys, or all the keys from an Array of Objects
		 *
		 * @param	{Object}	obj			Any object with iterable properties
		 * @param	{Array}		obj			An Array of objects with iterable properties
		 * @returns	{Array}					An array of key names
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
		 * @param	{Arguments}	args		An arguments object
		 * @param	{Number}	startIndex	Optional index of the argument from which to start from
		 * @param	{Number}	endIndex	Optional index of the argument at which to end
		 * @returns	{Array}					An Array of parameters
		 */
		getArguments:function(args, startIndex, endIndex)
		{
			return params = Array.slice.apply(this, [args, startIndex || 0, endIndex || args.length]);
		},

		/**
		 * Get the class of an object as a string
		 *
		 * @param	{value}		value		Any value
		 * @returns	{String}				The class name of the value i.e. 'String', 'Date', 'CustomClass'
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
		 * @param	{String}	name		The panel name
		 * @returns	{SWFPanel}				An SWFPanel object
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
		 * @param	{Error}		error		An optional error object
		 * @param	{Boolean}	shorten		An optional Boolean to shorten any core paths with {xjsfl}
		 * @returns	{Array}					An array of the executing files, paths, lines and code
		 */
		getStack:function(error, shorten)
		{
			// variables
				var rxParts		= /^(.*?)@(.*?):(\d+)$/mg;
				var rxFile		= /(.+?)([^\\\/]*)$/;

			// error
				var strStack	= (error instanceof Error ? error : new Error('Stack trace')).stack;

			// parse stack
				var matches		= strStack.match(rxParts);
				if( ! error )
				{
					matches = matches.slice(2); // remove the fake error
				}

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
							line	:parseInt(parts[3]) || '',
							code	:parts[1] || '',
							file	:file,
							path	:window.URI ? URI.asPath(path, shorten) : path,
							uri		:FLfile.platformPathToURI(path + file)
						};
				}

			// return
				return stack;
		},

		/**
		 * Parse any string into a real datatype. Supports Number, Boolean, hex (0x or #), XML, XMLList, Array notation, Object notation, JSON, Date, undefined, null
		 * @param	{String}	value		An input string
		 * @param	{Boolean}	trim		An optional flag to trim the string, on by default
		 * @returns	{Mixed}					The parsed value of the original value
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
		 * @param	{Number}	value		A value to modify
		 * @param	{Number}	modifier	An optional modifier component with which to modify the original value
		 * @param	{String}	modifier	An optional modifier component with which to modify the original value, with optional leading +,-,* or a trailing %
		 * @returns	{Number}				The modified value
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
		 * @param	{Array}		a			A 2-element array defining the lower and upper limits
		 * @param	{Number}	a			The lower limit of the range
		 * @param	{Number}	b			The lower limit of the range
		 * @param	{Number}	round		An optional Boolean to round to the nearest integer value
		 * @returns	{Number}				A number between a and b
		 */
		randomValue:function(a, b, round)
		{
			if(a instanceof Array)
			{
				round = b;
				b = a[1];
				a = a[0];
			}
			var value = a + (b - a) * Math.random();
			return round ? Math.round(value) : value;
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
		 * @param	{String}	type		The folder in which to look in to find the files, @see switch statement
		 * @param	{String}	name		A file name (pass no extension to use default), or partial file path
		 * @param	{Number}	returnType	An optional 0, 1 or -1; 0: all files (default), -1: the last file (user), 1:the first file (core)
		 * @returns	{String}				A single file path if found and return type is 1 or -1, or null if not
		 * @returns	{Array}					An Array of file uris if found, and return type is 0, or null if not
		 */
		find:function(type, name, returnType)
		{
			// --------------------------------------------------------------------------------
			// work out base uri

				// variables
					name = name ? String(name) : '';

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
						case 'settings':
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
		 * @param	{String}		path	The relative or absolute path, or uri to the file
		 *
		 * @param	{String}		name	The name or path fragment to a file, with or without the file extension
		 * @param	{String}		type	The folder type in which to look (i.e. settings) for the file(s)
		 *
		 * @returns	{Boolean}				A Boolean indicating Whether the file was successfully found and loaded
		 * @returns	{XML}					An XML object of the content of the file, if XML
		 * @returns	{String}				The string content of the file otherwise
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

				// also allow load() to take a wildcard URI, i.e. load('path/to/*.jsfl', true);
			*/

			// variables
				var result	= null;

			// --------------------------------------------------------------------------------
			// Resolve URI

				// a URI was passed in
					if(URI.isURI(path))
					{
						result		= FLfile.exists(path) ? path : null;
					}

				// a single path was passed in, so convert it to a uri
					else if(type == undefined || type === true || type === false)
					{
						var uri		= URI.toURI(path, 1);
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
						path = URI.toPath(path);
						if(type == null || type === true || type === false)
						{
							var message = 'Error in xjsfl.file.load(): The file "' +path+ '" could not be found';
						}
						else
						{
							var message = 'Error in xjsfl.file.load(): Could not resolve type "' +type+ '" and path "' +path+ '" to an existing file';
						}
						throw(new URIError(message));
					}

				// otherwise, do something with the uri / uris (plural) if more than 1 was found
					else
					{
						var uris = xjsfl.utils.isArray(result) ? result : [result];

						for each(var uri in uris)
						{
							// variables
								var ext = uri.match(/(\w+)$/)[1];

							// flag
								xjsfl.file.stack.push(uri);

							// log
								xjsfl.output.log('loading "' + URI.asPath(uri, true) + '"');

							// do something depending on extension
								switch(ext)
								{
									case 'jsfl':
										// load JSFL script
											fl.runScript(uri);
											xjsfl.file.stack.pop();

										// detect any JavaScript errors
											var outputURI	= xjsfl.uri + 'core/temp/output-panel.txt';
											fl.outputPanel.save(outputURI);
											var output		= FLfile.read(outputURI);
											FLfile.remove(outputURI);

										// throw a new fake error if the file appeared to load incorrectly
											if(/The following JavaScript error\(s\) occurred:\s*$/.test(output))
											{
												var error		= new Error('<error>', '', 0);
												var stack		= xjsfl.utils.getStack();
												var matches		= stack[0].code.match(/file:[^"]+/);
												if(matches)
												{
													var errorURI	= String(matches).toString();
													var errorPath	= URI.asPath(errorURI);
													error.message	= 'The file "' +errorPath+ '" contains errors';
													error.fileName	= errorURI;
													error.stack		= error.stack.replace('Error("<error>","",0)@:0', '<unknown>@' +errorPath+ ':0')
													xjsfl.loading	= false;
													throw error;
												}
											}

										// otherwise, just return the URI
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
		 * Saves data to file
		 * @param	{String}	pathOrURI	The path or URI to save data to
		 * @param	{String}	contents	The data to save
		 * @returns	{Boolean}				true or false depending on the result
		 */
		save:function(pathOrURI, contents)
		{
			var uri			= URI.toURI(pathOrURI, 1)
			var file		= new File(uri);
			file.contents	= contents;
			return file.exists && file.size > 0;
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
					if(xjsfl.settings.flags.debugging)
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
		 * @param	{String}	uriOrPath	The URI or path of the file to load
		 */
		file:function(uriOrPath)
		{
			// make uri
				var uri = URI.toURI(uriOrPath, 1);

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
									var evalLine	= 1514;	// this needs to be the actual line number of the eval(jsfl) line above
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
		 * @param	{Function}	fn			The function to test
		 * @param	{Array}		params		An array or arguments to pass to the function
		 * @param	{Object}	scope		An alternative scope to run the function in
		 * @returns	{Value}					The result of the function if successful
		 */
		func:function(fn, params, scope)
		{
			// feedback
				xjsfl.output.trace('testing function: "' + Source.parseFunction(fn).signature + '"');

			// test!
				try
				{
					return fn.apply(scope || this, params);
				}
				catch(err)
				{
					this.error(err, true);
				}
		},

		/**
		 * Traces a human-readable error stack to the Output Panel
		 *
		 * @param	{Error}		error		A javaScript Error object
		 * @param	{Boolean}	testing		Internal use only. Removes test() stack items
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
				var uriErrors	= xjsfl.uri + 'core/assets/templates/errors/errors.txt';
				var uriError	= xjsfl.uri + 'core/assets/templates/errors/error.txt';

			// reload template if not defined (caused by some kind of bug normally)
				if( ! xjsfl.classes.Template )
				{
					fl.runScript(xjsfl.uri + 'core/jsfl/libraries/uri.jsfl');
					fl.runScript(xjsfl.uri + 'core/jsfl/libraries/filesystem.jsfl');
					fl.runScript(xjsfl.uri + 'core/jsfl/libraries/template.jsfl');
				}

			// build errors
				var content = '';
				for(var i = 0; i < stack.length; i++)
				{
					stack[i].index = i;
					content += new xjsfl.classes.Template(uriError, stack[i]).render(); // reference Template class directly
				}

			// build output
				var data		= { error:error.toString(), content:content };
				var output		= new xjsfl.classes.Template(uriErrors, data).render();

			// set loading to false
				xjsfl.loading = false;

			// trace and return
				fl.trace(output);
				return output;
		},

		/**
		 * Logs the results of an error to the temp directory so Komodo can read in the data
		 *
		 * @param	{String}	uri			The URI of the erroring file
		 * @param	{Number}	line		The line number of the error
		 * @param	{String}	name		The name of the error
		 * @param	{String}	message		The error message
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

		/** @type {Boolean}	Set the file debugging state */
		set state(state)
		{
			//TODO Think about making this a simple boolean, then updating file.load() to check for debug.state == true

			// set or reset functions
				if(state)
				{
					// delegate loading functionality
						if(fl.runScript !== xjsfl.debug.file)
						{
							xjsfl.output.trace('turning file debugging: on');
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
						xjsfl.output.trace('turning file debugging: off');
						fl.runScript = xjsfl.debug._runScript;
						delete fl._runScript;
					}
				}

			// debug
				xjsfl.output.trace('file debugging is: ' + (state ? 'on': 'off'));

		},

		/** @type {Boolean}	Get the file debugging state */
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
		 * @param	{String}	fileRef		A class filename or path, relative to any jsfl/libraries folder
		 * @param	{String}	fileRef		A wildcard string pointing to a folder, i.e. '//user/jsfl/libraries/*.jsfl'
		 * @param	{Array}		fileRef		An Array of class filepaths
		 * @returns	{xjsfl}					The main xJSFL object
		 */
		load:function(fileRef)
		{
			// detect wildcards
				if(typeof fileRef === 'string' && fileRef.indexOf('*') > -1)
				{
					var uri		= URI.toURI(fileRef, 1);
					var pathURI	= URI.getPath(uri);
					var files	= FLfile.listFolder(uri, 'files');
					var paths	= [];
					for each(var file in files)
					{
						paths.push(pathURI + file);
					}
				}

			// make sure paths are in an array, so we can treat them all the same
				else
				{
					var paths = fileRef instanceof Array ? fileRef : [fileRef];
				}

			//TODO Add a check to see if we are loading, and if so, only load classes that are not yet defined. Can we do that? Do we need to cache load paths in that case?

			// load classes
				for each(var path in paths)
				{
					if(path.indexOf('xjsfl') === -1) // don't reload load xjsfl
					{
						xjsfl.file.load(path, 'library');
					}
				}

			// return
				return this;
		},

		/**
		 * Loads a class only if not already defined
		 * @param	{String}	name		The class name, such as 'Template', or 'Table'
		 * @returns
		 */
		require:function(name)
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
		 * @param	{String}	name		The name of the class / function / object to register
		 * @param	{Object}	obj			The actual class / function / object
		 * @returns	{xjsfl}					The main xJSFL object
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
		 * @param	{string}	name		The name of the class to restore
		 * @param	{Object}	scope		The scope to which the class should be restored to (defaults to window)
		 * @returns	{xjsfl}					The main xJSFL object
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
		 * @param	{String}	uri			An optional folder URI to search in, defaults to xJSFL/modules/
		 * @returns	{xjsfl}					The main xJSFL object
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
				 * @param	{String}	uri			An optional folder URI to search in, defaults to xJSFL/modules/
				 * @returns	{xjsfl}					The main xJSFL object
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
				 * @param	{String}	folderNameOrURI		The module folder name or path, relative to xJSFL/modules/ i.e. "Snippets", or an absolute URI
				 */
				init:function(folderNameOrURI)
				{
					// ensure path has a trailing slash
						folderNameOrURI = folderNameOrURI.replace(/\/*$/, '/');

					// if path is not a URI, it will probably be a path fragment, so default to the modules folder
						if( ! URI.isURI(folderNameOrURI))
						{
							var uri			= xjsfl.settings.folders.modules + folderNameOrURI;
						}
						else
						{
							var uri			= folderNameOrURI;
						}

					// attempt to load the module's manifest
						var manifest		= xjsfl.file.load(uri + 'manifest.xml');
						if( ! manifest)
						{
							return this;
						}

					// debug
						xjsfl.output.trace('registering module "' +String(manifest.info.name)+ '"');

					// update with the actual URI & store
						manifest.jsfl.uri		= uri;
						var namespace			= String(manifest.jsfl.namespace);
						manifests[namespace]	= manifest;

					// add the URI to the xjsfl.settings.uris.modules and xjsfl.settings.folders objects
						xjsfl.settings.uris.add(uri, 'module');
						xjsfl.settings.folders[namespace] = uri;

					// copy any panels to the WindowSWF folder
						var folder = new xjsfl.classes.Folder(uri + 'ui/');
						for each(var src in folder.files)
						{
							if(src.extension === 'swf')
							{
								// grab any existing target panels
									var trg = new File(fl.configURI + 'WindowSWF/' + src.name);

								// check exists and compare dates
									if(! trg.exists || src.modified > trg.modified)
									{
										xjsfl.output.trace('copying "' + URI.asPath(src.uri, true) + '" to "Flash/Configuration/WindowSWF/"');
										src.copy(fl.configURI + 'WindowSWF/', true);
									}

								// no need to copy if up to date
									else
									{
										xjsfl.output.trace('panel "' + src.name.replace('.swf', '') + '" is already up to date');
									}
							}
						}

					// copy any flash assets
						var srcFolder	= uri + 'flash/';
						var assetURIs	= Data.recurseFolder(srcFolder, true);
						if(assetURIs.length)
						{
							assetURIs = assetURIs.filter(URI.isFile);
							xjsfl.output.trace('copying ' + assetURIs.length + ' asset(s) to "Flash/Configuration/"');
							for each(var srcURI in assetURIs)
							{
								var trgURI = fl.configURI + srcURI.substr(srcFolder.length);
								//xjsfl.output.trace('copying "' + URI.asPath(srcURI, true) + '" to "Flash/Configuration/"');
								new File(srcURI).copy(trgURI, true);
							}
						}

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
		 * @param	{XUL}		xul			A valid XUL object
		 * @returns	{Object}				The settings object from the XMLUI
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
				var uri			= xul.uri || xjsfl.uri + 'core/temp/dialog.xul';
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
		 * @returns	{Object}
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
	 * @param	{Object}	scope			The scope into which the framework should be extracted
	 * @param	{String}	scopeName		An optional id, which when supplied, traces a short message to the Output panel
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
