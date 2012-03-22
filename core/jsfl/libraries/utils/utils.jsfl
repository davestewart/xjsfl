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
// Utils - static library of utility functions


	// ---------------------------------------------------------------------------------------------------------------
	// class

		/**
		 * Miscellaneous utility functions
		 * @class Utils
		 */
		Utils =
		{
			// ---------------------------------------------------------------------------------------------------------------
			// # Object methods 

				/**
				 * Checks if the object is a true Object or not
				 * @param	{Object}	obj			Any object that needs to be checked if it's a true Array
				 * @returns	{Boolean}				True or false
				 */
				isObject:function(value)
				{
					return Object.prototype.toString.call(value) === '[object Object]';
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
					return keys;
				},

				/**
				 * Clones and object
				 * @param	{Object}	obj		The object reference
				 * @returns	{Object}			The object cloned
				 */
				clone:function(obj)
				{
					if(obj == null || typeof(obj) != 'object')
					{
						return obj;
					}

					var temp = obj.constructor() || {}; // changed

					for(var key in obj)
					{
						temp[key] = Utils.clone(obj[key]);
					}

					return temp;
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
						
					// throw error if obj is null
						if(obj == undefined)
						{
							throw new Error('Error in Utils.extend(): obj is undefined');
						}

					// extend array
						if(Utils.isArray(obj) && Utils.isArray(props))
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

				/**
				 * Combines keys and values to make a new populated Object
				 * @param	{Array}		keys		An array of key names
				 * @param	{String}	keys		A string of key names
				 * @param	{Array}		values		An array of values
				 * @returns	{Object}				An Object containing the values assigned to keys
				 */
				combine:function(keys, values)
				{
					if(typeof keys === 'string')
					{
						keys = Utils.toArray(keys.trim(), /\s*,\s*/g);
					}
					var obj = {};
					for (var i = 0; i < keys.length; i++)
					{
						if(keys[i] !== '')
						{
							obj[keys[i]] = values[i];
						}
					}
					return obj;
				},

				/**
				 * Makes a Hash object from a source value
				 * @param	{String}	obj				An anything delimited string of words
				 * @param	{Array}		obj				An array of words
				 * @param	{Object}	obj				Any iterable object or instance
				 * @param	{Value}		defaultValue	An optional default value for the hash's keys. Defaults to false
				 * @returns	{Object}					An Object of name:true pairs
				 */
				makeHash:function(obj, defaultValue)
				{
					// variables
						var keys;
						var hash		= {};
						defaultValue	= typeof defaultValue === 'undefined' ? false : defaultValue;
						
					// get keys
						if(typeof obj === 'string')
						{
							keys = Utils.toArray(obj);
						}
						else if(obj instanceof Array)
						{
							keys = obj;
						}
						else
						{
							obj = Utils.getKeys(obj);
						}
						
					// make hash
						for each(var key in keys)
						{
							hash[key] = defaultValue;
						}
						return hash;
				},

				/**
				 * Generic function to recurse a data structure, processing nodes and children with callbacks
				 * @param	{Object}	rootElement		The root element to start processing on
				 * @param	{Function}	fnChild			A callback function to call on child elements
				 * @param	{Function}	fnContents		An optional callback function which should return an object which can be processed for its contents, i.e. folder.contents
				 * @param	{Object}	scope			An optional Object on which to appy "this" scope to
				 * @returns	{value}						The result of the passed fnChild function
				 */
				walk:function(rootElement, fnChild, fnContents, scope)
				{
					// processing function
						function process(element, index)
						{
							// process the element with the callback
								var result = fnChild.apply(scope, [element, index, depth]);

							// Now, depending on the result, we do one of three things:
								/*
									- Boolean false		Skip processing of this element
									- Boolean true		Stop processing and return this element
									- no return value	Continue processing child elements
								*/

							// if the result is a Boolean true, consider this element found, and return it
								if(result === true)
								{
									return element;
								}

							// if false was not returned, process the current element
								else if(result !== false)
								{
									// get the custom contents, or just use the object itself if no callback supplied
										var contents = fnContents ? fnContents.apply(scope, [element, index, depth]) : element;

									// process contents
										if( contents && ! ((typeof contents) in simpleTypes) )
										{
											depth ++;
											if(contents instanceof Array)
											{
												for (var i = 0; i < contents.length; i++)
												{
													var result = process(contents[i], i);
													if( result )
													{
														return result;
													}
												}
											}
											else
											{
												for(var name in contents)
												{
													var result = process(contents[name], name);
													if( result )
													{
														return result;
													}
												}
											}
											depth--;
										}

								}

							// return null if everything is normal
								return null;
						}

					// variables
						var simpleTypes =
						{
							'number'	:1,
							'string'	:1,
							'boolean'	:1,
							'xml'		:1,
							'function'	:1,
							'undefined'	:1
						}

					// defaults
						scope = scope || window;
						var depth = 0;

					// process
						return process(rootElement, 0);
				},
				
				
			// ---------------------------------------------------------------------------------------------------------------
			// # Object-Oriened Coding methods 

				/**
				 * A better typeof function
				 * @param	{Object}	obj		Any object or value
				 * @returns	{String}			The type of the object
				 * @see							http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
				 */
				getType:function(obj)
				{
					return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
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
											//matches = Object.prototype.toString.call(obj).match(/^\[\w+\s*(\w+)/);
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
				 * Gets the prototype chain of an object
				 * @param	{Object}	obj				An instantiated object
				 * @param	{Boolean}	includeSource	An optional Boolean to include the original object
				 * @returns	{Array}						An Array of the original instantation object
				 */
				getPrototypeChain:function(obj, includeSource)
				{
					var chain = includeSource ? [obj] : [];
					while(obj.__proto__)
					{
						obj = obj.__proto__;
						chain.push(obj);
					}
					return chain;
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
				 * Get the arguments of a function as an Object
				 * @param	{Function}	fn		A function
				 * @param	{Arguments}	args	The function instance's arguments
				 * @returns	{Object}			An object containing the named function arguments
				 */
				getParams:function(fn, args)
				{
					var source		= Utils.parseFunction(fn);
					var args		= Utils.getArguments(args);
					return Utils.combine(source.params, args);
				},

				/**
				 * Subclasses an class from a parent class (note that $ arguments can be passed in any order)
				 * @param	{Function}	child			The child class
				 * @param	{Function}	$parent			The parent class
				 * @param	{Object}	$properties		Properties to add to the chlid class
				 */
				makeClass:function(child, $parent, $properties)
				{
					// variables
						var parent, properties;

					// grab correct arguments
						for each(var arg in [$parent, $properties])
						{
							if(typeof arg === 'function')
								parent = arg;
							else if(typeof arg === 'child')
								properties = arg;
						}

					// extend child from a parent
						if(parent)
						{
							// set up the inheritance chain
								function Inheritance()
								{
									//this.superConstructor		= parent;
									//this.superClass				= parent.prototype;
								}
								Inheritance.prototype			= parent.prototype;
								child.prototype					= new Inheritance();
								child.prototype.constructor		= child;

							// create references to parent
								child.superConstructor			= parent;
								child.superClass				= parent.prototype;

							// create super methods
								// can this be done?
						}

					// add properties to child
						if(properties)
						{
							for(var name in properties)
							{
								// check for accessors
									var getter = properties.__lookupGetter__(name)
									var setter = properties.__lookupSetter__(name);

								// assign accessors
									if (getter || setter)
									{
										if (getter)
										{
											child.prototype.__defineGetter__(name, getter);
										}
										if (setter)
										{
											child.prototype.__defineSetter__(name, setter);
										}
									}

								// assign vanilla properties
									else
									{
										child.prototype[name] = properties[name];
									}
							}
						}

				},

				/**
				 * Parses a function source into an object
				 * @param	{Function}	fn		A reference to a function
				 * @returns	{Object}			An Object with name and params properties
				 */
				parseFunction:function(fn)
				{
					var matches		= fn.toSource().match(/function\s*((\w*)\s*\(([^\)]*)\))/);
					if(matches)
					{
						var params = matches[3].match(/(\w+)/g);
						return {signature:matches[0].replace(/function (\w+)/, '$1'), name:matches[2], params:params};
					}
					return {name:null, params:[], signature:''};
				},


			// ---------------------------------------------------------------------------------------------------------------
			// # Arry methods 

				/**
				 * Checks if the object is a true Array or not
				 * @param	{Object}	obj			Any object that needs to be checked if it's a true Array
				 * @returns	{Boolean}				True or false
				 */
				isArray:function (obj)
				{
					return Object.prototype.toString.call(obj) === "[object Array]";
				},


				/**
				 * Turns a single string of tokens into an array of trimmed tokens, by splitting at non-word characters, or a supplied delimited
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
						if(Utils.isArray(value))
						{
							return value;
						}

					// if the value is a string, start splitting
						else if(typeof value === 'string')
						{
							// trim
								value = value.trim();

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
							throw new TypeError('Utils.toArray() expects a string');
						}
						return [value];
				},

				/**
				 * Returns a unique array without any duplicate items
				 *
				 * @param	{Array}		arr			Any array
				 * @param	{String}	prop		An optional property (if an Array of Objects is passed) to compare against
				 * @returns	{Array}					A unique array
				 */
				toUniqueArray:function(arr, prop)
				{
					// throw an arror if an array is not passed
						if( ! (arr instanceof Array) )
						{
							throw new TypeError('Utils.toUniqueArray expects an Array as its first parameter');
						}
						
					// variables
						var arrOut	= [];
						var i = -1;
						
					// extract values from Objects
						if(prop)
						{
							var props = [];
							var value;
							while(i++ < arr.length - 1)
							{
								value = arr[i][prop];
								if(props.indexOf(value) === -1)
								{
									props.push(value);
									arrOut.push(arr[i]);
								}
							}
						}
						
					// extract values from Array
						else
						{
							var i = -1;
							while(i++ < arr.length - 1)
							{
								if(arrOut.indexOf(arr[i]) === -1)
								{
									arrOut.push(arr[i]);
								}
							}
						}
						
					// return
						return arrOut;
				},

				/**
				 * Basic numeric Array sort function (native sort() sorts by string)
				 * @param	{Array}		arr					An array to sort
				 * @param	{Boolean}	reverse				An optional flag to sort in reverse (descending) order
				 * @param	{Boolean}	caseInsensitive		An optional flag to sort case insensitively
				 * @returns	{Array}							The sorted Array
				 */
				sort:function(arr, reverse, caseInsensitive)
				{
					function asc(a, b)  { return a - b; }
					function desc(a, b) { return b - a; }
					function asci(a, b)  { return String(a).toLowerCase().localeCompare(String(b).toLowerCase()); }
					function desci(a, b) { return String(b).toLowerCase().localeCompare(String(a).toLowerCase()); }
					return caseInsensitive ? arr.sort(reverse ? desci : asci) : arr.sort(reverse == true ? desc : asc);
				},

				/**
				 * Optimized Array sortOn method, for sorting Arrays by child property. This function modifies the input Array
				 * @param	{Array}		arr			An Array of Objects
				 * @param	{String}	prop		A property name to sort on; defaults to 'name'
				 * @param	{Boolean}	alpha		An optional flag to sort alphabetically
				 * @returns	{Array}					The sorted Array)
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
					return arr;
				},

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
						if( ! Utils.isArray(arr))
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


			// ---------------------------------------------------------------------------------------------------------------
			// # Value methods 

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
						if( ! Utils.isArray(input))
						{
							input	= [input];
							single	= true;
						}

					// collect all values?
						if(prop === true)
						{
							prop = Utils.getKeys(input[0]);
						}

					// double loop for multiple properties
						if(Utils.isArray(prop))
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
										functionNames[f] = Utils.parseFunction(props[f]).name;
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
				 * Comparison function to get a max or min value within an array of objects
				 * @param	{Array}		elements		An Array of objects with named properties
				 * @param	{String}	prop			The property to test
				 * @param	{Boolean}	returnElements	An optional flag to return the element, rather than the value
				 * @returns	{Array}						A 2-element Array containing the min and max values, or min and max elements
				 */
				getExtremeValues:function(elements, prop, returnElement)
				{
					// variables
						var minElement,
							maxElement,
							minValue,
							maxValue;

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
						if( ! elements || ! Utils.isArray(elements) || elements.length < 1)
						{
							return {min:undefined, max:undefined};
						}

					// variables
						minElement		= elements[0];
						maxElement		= elements[0];
						minValue		= elements[0][prop];
						maxValue		= elements[0][prop];

					// test
						elements.forEach(test);

					// return
						return returnElement ? [minElement, maxElement] : [minValue, maxValue];
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
						var key;
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
									//trace('assigning')
									obj[key] = properties;
								}
								else
								{
									//trace('extending')
									Utils.extend(obj[key], properties);
								}

							}
					}
					while(keys.length);
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
							return Utils.randomValue(value[0], value[1]);
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
				},
				
				
			// ---------------------------------------------------------------------------------------------------------------
			// # String methods 

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
				 * Populates a template string with values
				 * @param	{String}	template	A template String containing {placeholder} variables
				 * @param	{Object}	properties	Any Object or instance of Class that with named properties
				 * @param	{Array}		properties	An Array of values, which replace named placeholders in the order they are found
				 * @param	{Mixed}		...rest		Any values, passed in as parameters, which replace named placeholders in the order they are found
				 * @returns	{String}				The populated String
				 */
				populate:function(template, properties)
				{
					/*
						Conditions where we derive the properties:
						- there are more than 2 arguments
						- properties is an Array
						- properties is a primitive datatype, string, number, boolean
					*/
					if( arguments.length > 2 || Utils.isArray(properties) || (typeof properties in {string:1, number:1, boolean:1, date:1}) )
					{
						var keys	= Utils.toUniqueArray(String(template.match(/{\w+}/g)).match(/\w+/g));
						var values	= Utils.isArray(properties) ? properties : Utils.getArguments(arguments, 1);
						properties	= Utils.combine(keys, values);
					}
					return new SimpleTemplate(template, properties).output;
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
						value = trim !== false ? String(value).trim() : String(value);

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


			// ---------------------------------------------------------------------------------------------------------------
			// # RegExp methods 

				/**
				 * Performs a global RegExp match but returns an Array of local match Arrays, or Objects if matchNames are supplied
				 * @param	{String}	str				The string to be matched
				 * @param	{RegExp}	rxGlobal		A global RegExp object or literal
				 * @param	{String}	params			An optional comma-delimited string of local match names
				 * @param	{Array}		params			An optional Array of local match names
				 * @param	{Boolean}	captureIndex	An optional Boolean to store the index of the global matches
				 * @returns	{Array}						An Array of local match Arrays or Objects
				 */
				match:function(str, rxGlobal, matchNames, captureIndex)
				{
					// variables
						var matchesGlobal, matchesLocal, matchNames;
						
					// non-global regexp
						var rxLocal			= new RegExp(rxGlobal.source);
						rxLocal.multiline	= rxGlobal.multiline;
						rxLocal.ignoreCase	= rxGlobal.ignoreCase;
						
					// exec
						var n = 0;
						if(captureIndex)
						{
							// variables
								matchesGlobal		= [];
								matchNames			= matchNames ? 'matchIndex,match,' + matchNames : null;
								
							// exec
								var exec;
								while(exec = rxGlobal.exec(str))
								{
									// stop processing if no matches (otherwise, exec() will loop forever)
										if(exec[0] == '')break;
										
									// set up local matches array, with the match index if an object is being returned
										matchesLocal	= matchNames ? [exec.index] : [];
										
									// add matches
										for (var i = 0; i < exec.length; i++)
										{
											matchesLocal.push(exec[i]);
										}
										
									// finalise matches
										if(matchNames)
										{
											// create an object
											matchesLocal = Utils.combine(matchNames, matchesLocal)
										}
										else
										{
											// add match index to array
											matchesLocal.push(exec.index);
										}
										matchesGlobal.push(matchesLocal);
										
								}
								
							// reset lastIndex (this is important so subsequent matches don't fail!)
								rxGlobal.lastIndex	= 0; 
						}
						
					// match
						else
						{
							// main match
								matchesGlobal 	= str.match(rxGlobal);
								matchNames		= matchNames ? 'match,' + matchNames : null;
					
							// sub matches
								for (var i = 0; i < matchesGlobal.length; i++)
								{
									// variables
										matchesLocal		= matchesGlobal[i].match(rxLocal);
										
									// stop processing if matches were empty
										if(matchesLocal[0] == '')
										{
											matchesGlobal.pop();
											break;
										}
										
									// finalise matches
										matchesGlobal[i]	= matchNames ? Utils.combine(matchNames, matchesLocal) : matchesLocal;
								}
						}
						
					// return
						return matchesGlobal;
				},

				/**
				 * Escapes a string for use in RegExp constructors
				 * @param	{String}	value	The string to be RegExp escaped
				 * @returns	{String}			The escaped string
				 */
				rxEscape:function(value)
				{
				    return String(value).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
				},
				
				/**
				 * Unescapes a string used in RegExp constructors
				 * @param	{String}	value	The string to be RegExp escaped
				 * @returns	{String}			The unescaped string
				 */
				rxUnescape:function(value)
				{
					 return String(value).replace(/\\\//g, '/');
				},

				/**
				 * Converts a wildcard (*) string into a non-greedy RegExp
				 * @param	{String}	value	The wildcard string to convert
				 * @returns	{RegExp}			The new RegExp
				 */
				makeWildcard:function(value)
				{
					var rx = Utils.rxEscape(value).replace(/\\\*/g, '.*?');
					return new RegExp(rx);
				},


			// ---------------------------------------------------------------------------------------------------------------
			// # File and URI methods 

				/**
				 * Returns a list of URIs for a glob string
				 * @see									http://www.codeproject.com/Articles/2809/Recursive-patterned-File-Globbing
				 * @param	{String}	path			The root path to the folder to search
				 * @param	{String}	pattern			The wildcard pattern, * = any character, ** = files recursive, ** / folders recursive
				 * @param	{Boolean}	searchableOnly	An optional Boolean to respect any folders with file manifests that set themselves as non-searchable
				 * @param	{Boolean}	debug			An optional Boolean to print debugging information about the generated RegExp
				 * @returns	{Array}						An Array or URIs
				 */
				glob:function(pathOrURI, pattern, searchableOnly, debug)
				{
					// ----------------------------------------------------------------------------------------------------
					// callback function
					
						function process(folderURI)
						{
							var itemURI, matchURI, isFolder, matches;
							var names		= FLfile.listFolder(folderURI);
							for each(var name in names)
							{
								// create URI
									itemURI		= folderURI + name;
									isFolder	= String(FLfile.getAttributes(itemURI)).indexOf('D') !== -1;
									if(isFolder)
									{
										itemURI += '/';
									}
									matchURI = itemURI.substr(uri.length);
									
								// skip if folder is not searchable
									if(searchableOnly && isFolder)
									{
										if( ! Utils.isSearchable(itemURI) )
										{
											continue;
										}
									}
									
								// do matching
									var matches	= matchURI.match(rxSearch);
									if(matches)
									{
										if(rxMatch.test(matchURI))
										{
											uris.push(itemURI);
										}
										if(recursive && isFolder)
										{
											process(itemURI);
										}
									}
							}
						}
				
					// ----------------------------------------------------------------------------------------------------
					// build glob regexp
					
						// explanation
					
							/*
								How this works, is that the pattern:
							*/
							//		jsfl/**/*.txt
							/*
								Is first chunked into RegExp parts:
								
									1 - jsfl/
									2 - .+/
									3 - .+.txt
									
								Then the parts are built into sequentially inclusive groups,
								in reverse order, which allows the matching to match none, some,
								or all segments of the current URI:
								
									^((jsfl\/.+\/.+.txt$)|(jsfl\/.+\/$)|(jsfl\/$))
									
								This also allows us to exit early from a URI match if the part of
								the pattern before any recursive tokens (**) is not found.
									
								When a match is found, it is then re-matched again against the 
								single, full matching mattern:
								
									^jsfl/.+/.+.txt$
								
								And added the final URI list if it matches.
							*/
								
						// build glob pattern
						
							// variables
								var recursive	= false;
								var current		= '';
								var parts		= [];
								
							// update parameters
								var _pattern		= (pattern || '**')
													.replace(/ /g, '%20')
													.replace(/\./g, '\\.');
								
							// special treatment for leading recursive file (but not folder) wildcards, e.g. **, **file, **file.jsfl
								if(/^\*\*[^\/]+$/.test(_pattern))
								{
									var part = _pattern
										.replace(/\*\*/, '[^/]+')
										.replace(/\*/, '[^/]+')
										+ '$'
									parts.push('.*');
									parts.push(part);
									recursive = true;
								}
								
							// else
								else
								{
									// create reg exp for parsing
										var chunkerPattern	= '(file:///|[^:]+:/|[^/]+/|[^/]+$)'.replace(/\//g, '\\/');
										var chunker			= new RegExp(chunkerPattern, 'g');
										
									// build
										var exec, part;
										while(exec = chunker.exec(_pattern))
										{
											part = exec[0];
											if(part.indexOf('**') !== -1)
											{
												part = part.replace(/\*+/g, '.*');
												recursive = true;
											}
											else if(part.indexOf('*') !== -1)
											{
												part = part.replace(/\*/g, '.*');
											}
											current += part;
											parts.push(current + '$');
										}									
								}
							
							// make regexps
								var strParts	= ('^((' + parts.reverse().join(')|(').replace(/\//g, '\\/') + '))');
								var rxSearch	= new RegExp(strParts);
								var rxMatch		= new RegExp(parts[0]);
							
					// ----------------------------------------------------------------------------------------------------
					// final setup and run
					
						// output debugging information
							if(debug)
							{
								var print;
								if(debug === true)
								{
									print = true;
									debug = {};
								}
								debug.pattern	= pattern;
								debug.match		= Utils.rxUnescape(rxMatch.source);
								debug.search	= Utils.rxUnescape(rxSearch.source);
								debug.parts		= parts;
								
								if(print)
								{
									inspect(debug, 'Pattern breakdown for glob("' + pattern + '")');
								}
							}
							
						// process paths and grab URIs
							var uri			= URI.toURI(pathOrURI);
							var uris		= [];
							process(uri);
						
						// return
							return uris;
				},

				/**
				 * Returns a list of URIs for a given folder reference and optional condition
				 * @param	{String}	ref			An absolute or relative folder path or URI (wildcards allowed)
				 * @param	{Folder}	ref			A valid Folder instance
				 * @param	{Array}		ref			An Array of URIs (each of which are filtered then passed back)
				 * @param	{Number}	$depth		An optional max depth to search to
				 * @param	{Boolean}	$filesOnly	An optional Boolean to get files only
				 * @param	{RegExp}	$filter		A RegExp to match each URI
				 * @param	{Array}		$extensions	An Array of extensions to match
				 * @returns	{Array}					An Array of URIs
				 */
				getURIs:function(ref, $depth, $filesOnly, $filter, $extensions)
				{
					//TODO - check this works for recursive URIs
					//TODO - Pass true to set max depth to infinite

					// folder uri;
						var uri;

					// Array
						if(ref instanceof Array)
						{
							return ref;
						}

					// Folder: new Folder()
						if(ref instanceof Folder)
						{
							uri = ref.uri;
						}

					// path or URI
						else if(URI.isURI(ref))
						{
							if(ref.indexOf('*') > -1)
							{
								return Utils.walkFolder(ref, true);
							}
							else
							{
								return new Folder(ref).uris;
							}
						}

					// otherwise, return Array
						return [ref];

					// folder URI: c:/temp/
					// folder URI: c:/temp/*
					// name: 'template', 'library'
					// Array: ['template', 'filesystem'], 'library'

				},

				/**
				 * Returns the first valid path or URI from an Array of paths and/or URIs
				 * @param	{Array}		pathsOrURIs		An array of paths or URIs
				 * @returns	{String}					A URI-formatted String
				 */
				getFirstValidURI:function(uris)
				{
					var uri;
					while(uris.length)
					{
						uri = URI.toURI(uris.shift());
						if(FLfile.exists(uri))
						{
							return uri;
						}
					}
					return null;
				},

				/**
				 * Returns URIs which are searchable as defined within manifest.xml files in parent folders
				 * @param	{String}	pathOrURI		A valid path or URI
				 * @param	{String}	itemType		An optional String, 'files', 'folders' or 'all', defaults to 'all'
				 * @param	{Boolean}	returnPaths		An optional Boolean to return only the dowstream path segments
				 * @returns	{Array}						A URIList instance of the collected URIs / paths
				 */
				getSearchableURIs:function(pathOrURI, itemType, returnPaths)
				{
					// callbacks
						function processFolder(folderURI)
						{
							// check if folder has a manifest, and if it says to ignore this folder
								if( ! Utils.isSearchable(folderURI) )
								{
									return;
								}

							// update paths
								paths.push(returnPaths ? folderURI.substr(rootURI.length) : folderURI);

							// process contents
								var names = FLfile.listFolder(folderURI, 'directories');
								for each(var name in names)
								{
									processFolder(folderURI + name + '/');
								}
						}

						function processAll(folderURI)
						{
							// check if folder has a manifest, and if it says to ignore this folder
								if( ! Utils.isSearchable(folderURI) )
								{
									return;
								}

							// update paths
								if(itemType !== 'files')
								{
									paths.push(returnPaths ? folderURI.substr(rootURI.length) : folderURI);
								}

							// process contents
								var itemURI;
								var names = FLfile.listFolder(folderURI);
								for each(var name in names)
								{
									itemURI = folderURI + name;
									if(String(FLfile.getAttributes(itemURI)).indexOf('D') !== -1)
									{
										processAll(itemURI + '/');
									}
									else
									{
										paths.push(returnPaths ? itemURI.substr(rootURI.length) : itemURI);
									}
								}
						}

				// parameters
					itemType		= {files:'files', folders:'directories'}[itemType];

				// variables
					var rootURI		= new URI(pathOrURI).folder;

				// build search paths
					if(FLfile.exists(rootURI))
					{
						var paths	= [];
						var fn		= itemType === 'directories' ? processFolder : processAll;
						fn(rootURI);
						return paths;
					}
					else
					{
						throw new URIError('URIError in Utils.getSearchableURIs: The folder "' +pathOrURI+ '" is not a valid folder');
					}

				},
				
				/**
				 * Checks is a folder is searchable, depending on its manifest
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @returns	{Boolean}				true or false depending on the result
				 */
				isSearchable:function(pathOrURI)
				{
					var uri = URI.toURI(pathOrURI) + 'manifest.xml';
					if(FLfile.exists(uri))
					{
						var manifest = new XML(FLfile.read(uri));
						if(manifest.folder.searchable == false)
						{
							return false;
						}
					}
					return true;
				},

				/**
				 * Recursively trawl a folder's contents, optionally calling a callback per element (note that $ arguments may passed in any order)
				 * @param	{String}	folder			The path or uri to a valid folder
				 * @param	{Folder}	folder			A valid Folder object
				 * @param	{Function}	$callback		An optional callback of the format callback(element, index, depth, indent) to call on each element. Return false to skip processing of that element. Return true to cancel all iteration.
				 * @param	{Number}	$maxDepth		An optional max depth to recurse to, defaults to 100
				 * @param	{Boolean}	$returnURIs		An optional Boolean to return all parsed URIs
				 * @returns	{String}					The URI of the current element if the callback returns true
				 * @returns	{Array}						An array of URIs or paths if returnURIs is set as true
				 */
				walkFolder:function(folder, $callback, $maxDepth, $returnURIs)
				{
					// ------------------------------------------------------------
					// functions

						var indent;

						function process(element, index)
						{
							// callback
								var state = callback ? callback(element, index, depth, indent) : null;

							// return immediately if the callback returned true
								if(state === true)
								{
									return element;
								}

							// process if the callback didn't return false (false == skip element)
								if(state !== false)
								{
									// return if callback passed back true (true == stop all processing)
										if(state === true)
										{
											return true;
										}

									// collect uri
										uris.push(element.uri);

									// children
										if(element instanceof Folder && depth < maxDepth)
										{
											// dow down a level
												depth ++;
												indent += '	';

											// iterate
												var contents = element.contents;
												for(var i = 0 ; i < contents.length; i++)
												{
													// catch long URI errors
														if(contents[i].uri.length > 260)
														{
															URI.throwURILengthError(contents[i].uri);
														}

													// process content
														var result = process(contents[i], i)
														if(result)
														{
															return result;
														}
												}

											// go up a level
												indent = indent.substring(1);
												depth--;
										}
								}
						}

					// ------------------------------------------------------------
					// code

						// defaults
							var maxDepth	= 100;
							var callback	= null;
							var returnURIs	= false;

						// parameter shift
							for each(var arg in [$callback, $maxDepth, $returnURIs])
							{
								if(typeof arg === 'number')
									maxDepth = arg;
								else if(typeof arg === 'function')
									callback = arg;
								else if(typeof arg === 'boolean')
									returnURIs = arg;
							}

						// variables
							var uris		= [];
							var indent		= '';
							var depth		= 0;
							var _folder		= typeof folder === 'string' ? new Folder(URI.toURI(folder, 1)) : null;

						// process
							if(_folder instanceof Folder && _folder.exists)
							{
								var result =  process(_folder, 0);
								uris.shift();
								return returnURIs ? uris : result;
							}
							else
							{
								return returnURIs ? [] : null;
							}

				},

				/**
				 * Returns a multiline string, showing the file/folder hierarchy of an input array of paths or URIs
				 * @param	{Array}			paths	An array of paths or URIs
				 * @returns	{String}				The hierarchial representation
				 */
				makeTree:function(paths)
				{
					var segments, name, indent;
					var path, tree = '';
					for each(path in paths)
					{
						path = path.replace('file:///', '').replace(/\/*$/, '');
						if(path == '')
						{
							continue;
						}
						segments	= path.split('/');
						name		= segments.pop();
						indent		= '\t'.repeat(segments.length);
						tree		+= indent + '/' + name + '\n';
					}
					return tree;
				},


			// ---------------------------------------------------------------------------------------------------------------
			// # Framework methods 

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
					// error
						var strStack	= (error instanceof Error ? error : new Error('Stack trace')).stack;

					// parse stack
						var rxParts		= /^(.*)?@(.*?):(\d+)$/mg;
						var matches		= strStack.match(rxParts);

					// remove the fake error
						if( ! error )
						{
							matches = matches.slice(2); 
						}
						
					// parse lines
						var stack		= [];
						var rxFile		= /(.+?)([^\\\/]*)$/;
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
				
			// ---------------------------------------------------------------------------------------------------------------
			// Other

				toString:function()
				{
					return '[class Utils]';
				}
		}

	// ---------------------------------------------------------------------------------------------------------------
	// register

		if(xjsfl && xjsfl.classes)
		{
			xjsfl.classes.register('Utils', Utils);
		}