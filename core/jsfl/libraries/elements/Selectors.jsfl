// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██              ██
//  ██           ██              ██
//  ██     █████ ██ █████ █████ █████ █████ ████ █████
//  ██████ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██   ██
//      ██ █████ ██ █████ ██     ██   ██ ██ ██   █████
//      ██ ██    ██ ██    ██     ██   ██ ██ ██      ██
//  ██████ █████ ██ █████ █████  ████ █████ ██   █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Selectors

	/**
	 * Selectors
	 * @overview	Static repository of tests used by the Selector class
	 * @instance	
	 */

	xjsfl.init(this, ['Context', 'Iterators', 'Selector', 'Utils']);
		
	// ----------------------------------------------------------------------------------------------------
	// # Main Selectors class

		Selectors =
		{
			/**
			 *
			 * @param	expression	{String}		A CSS expression
			 * @param	items		{Array}			An array of items to filter
			 * @param	scope		{Object}		A valid scope reference. Valid types are Library, Document, Timeline, Layer, Frame
			 * @param	debug		{Boolean}		An optional flag to print Selector information to the Output panel
			 * @returns				{Array}			An array of elements, items, etc
			 */
			select:function(expression, items, scope, debug)
			{
				// --------------------------------------------------------------------------------
				// setup
				
					// define selection type from scope
						var matches = String(scope).match(/(Library|Document|Timeline|Layer|Frame)/);
						if(matches)
						{
							var types =
							{
								'Library':		'Item',
								'Document':		'Element',
								'Timeline':		'Layer',
								'Layer':		'Frame'
							}
							var type = types[matches[1]];
						}
						else
						{
							throw new TypeError('TypeError: Invalid scope "' +scope+ '" supplied to Selector.select()');
						}
	
				// --------------------------------------------------------------------------------
				// process expression
	
					// exit early if universal selector is supplied
						if(expression === '*')
						{
							return items;
						}

					// sort items if type is Item and expression contains an oreder-relevent selector type
						if(type === 'Item' && /:(first|last|even|odd|nth)\b/.test(expression))
						{
							items = Utils.sortOn(items, 'name', true);
						}
	
					// break up any comma-delimited expressions into an array of discrete expressions
						var expressions	= Utils.parseExpression(expression);
	
					// get items
						var results		= [];
						for each (var expression in expressions)
						{
							// parse rule into selector array
								var selectors = this.parse(expression, type);
								
							// set up debug
								Selectors.debug = debug;
	
							// get items
								var _results = Selectors.test(selectors, items, scope)
	
							// append to existing results array
								results = results.concat(_results);
						}
	
					// ensure items are unique
						results = Utils.toUniqueArray(results);
	
					// return
						return results;
			},
	
	
			/**
			 * Registers a custom selector
			 * @param	{String}	pattern		The pattern of the selector. Valid values are ":type" or "[attribute]"
			 * @param	{Function}	callback	A pseudo callback of the format function(item){ return state }
			 * @param	{Function}	callback	An attribute callback of the format function(item){ return value }
			 * @param	{String}	type		The type of selector. Valid values are Library|Document|Timeline|Layer|Frame
			 */
			register:function(pattern, callback, type)
			{
				// variables
					pattern			= String(pattern);
					var matches		= pattern.match(/([:\[])(\w+)/);
					var group;
	
				// test for valid selector
					if(matches)
					{
						// error if wrong type
							if( ! /^(item|element)$/.test(type) )
							{
								throw new Error('Error in Selectors.register(): Invalid type "' +type+ '" supplied');
							}
	
						// OK, extract the selector
							var selector	= matches[2];
	
						// :pseudo selector
							if(matches[1] == ':')
							{
								group = 'pseudo';
							}
	
						// [attribute] selector
							else if(matches[1] == '[')
							{
								group = 'custom';
							}
	
						// assign
							Selectors[type][group][selector] = callback;
							
						// return
							return Selectors;
					}
					else
					{
						throw new Error('Error in Selectors.register(): Invalid pattern "' +pattern+ '" supplied');
					}
			},
	
			/**
			 * parse a selector expression into selectors - also called from :not()
			 * @param	expression	{String}	A CSS expression
			 * @param	type		{String}	The type of parse, e.g. Item, Element, etc
			 * @returns
			 */
			parse:function(expression, type)
			{
	
				// --------------------------------------------------------------------------------
				// setup
	
					// chunker
						/*
							#  type             example
							-------------------------------------------------
							1: combo			:not(selector)
							   2: type			:not
							   3: selector		:bitmap
							4: name				this is a name
							5: path				/this is/a path
							6: Class			.Class
							7: package			.com.domain.package.Class
							8: pseudo			:type
							9: attribute		[attribute=value]
							   10: name			attribute
							   11: operand		=
							   12: value		value
						*/

						var chunker = /(:([\-\w]+)\((.+)\))|([A-Za-z0-9_*][^:\[]*)|\/([\-\w\s\/_*{|}]+)|\.([*A-Z][\w*]+)|\.([a-z][\w.*]+)|:([a-z]\w+)|\[(([\w\.]+)([\^$*!=<>]{1,2})?(.+?)?)\]/g;
									//  1 2          3       4                        5                    6                7               8            9 10      11                12
	
					// variables
						var exec,
							selector,
							selectors	= [],
							object		= Selectors[type.toLowerCase()],
							core		= Selectors.core;
							
	
					// debug
						//trace('\n\n\n\n--------------------------------------------------------------------------------\n' + expression + '\n--------------------------------------------------------------------------------')
	
				// --------------------------------------------------------------------------------
				// parse
	
					while(exec = chunker.exec(expression))
					{
						// --------------------------------------------------------------------------------
						// setup
	
							// debug
								//inspect(exec);
								//trace(limit++);
	
							// create
								selector = new Selector(exec[0]);
	
						// --------------------------------------------------------------------------------
						// create selector
						
							// note - selector params[0] is always null, as the Selector will populate it with the relevent values itself
	
							// 1: combo ":not(:bitmap)"
								if(exec[1])
								{
									selector.type	= 'combo';
									selector.name	= exec[2];
									selector.method	= core.combo[selector.name];
									selector.params	= [null, Selector.makeRX(exec[3], selector)];
									selector.params	= [null, exec[3], type];
								}
	
							// 4: name "Item_03"
								else if(exec[4])
								{
									selector.type	= 'filter';
									selector.name	= 'name';
									selector.method	= object.filter.name;
									selector.params	= [null, Selector.makeRX(exec[4], selector), selector.range];
								}
	
							// 5: path "/path/to/item" (can only be Library or Stage)
								else if(exec[5])
								{
									selector.type	= 'filter';
									selector.name	= 'path';
									selector.method	= object.filter.path;
									selector.params	= [null, Selector.makeRX(exec[5].replace(/(^\/+|\/+$)/g, ''), selector), selector.range];
								}
	
							// 6: Class ".Class"
								else if(exec[6])
								{
									selector.type	= 'filter';
									selector.name	= 'Class';
									selector.method	= object.filter.Class;
									selector.params	= [null, Selector.makeRX(exec[6], selector)];
								}
	
							// 7: package ".com.domain.package.Class"
								else if(exec[7])
								{
									selector.type	= 'filter';
									selector.name	= 'Package';
									selector.method	= object.filter.Package;
									selector.params	= [null, Selector.makeRX(exec[7], selector)];
								}
	
							// 8: pseudo ":type"
								else if(exec[8])
								{
									// variables
										var method;
										var name = exec[8];
										
									// type
										if(/instance|symbol|bitmap|sound|embeddedvideo|linkedvideo|video|compiledclip|text|folder|static|dynamic|input|primitive|group|shape|movieclip|graphic|button/.test(name))
										{
											selector.type	= 'type';
											selector.params	= [null, name];
											method			= object.filter.type;
										}
	
									// find
										else if(/selected|children|descendants|parent|first|last|even|odd|random/.test(name))
										{
											selector.type	= 'find';
											selector.params	= [null];
											method			= object.find[name] || core.find[name];
										}
	
									// pseudo, i.e. /exported|empty|animated|keyframed|scripted|audible|filtered|tinted|component/
									// custom, i.e. /any|custom|values|which|need|to|have|been|registered/
										else
										{
											selector.type	= 'pseudo';
											selector.params	= [null, name];
											method			= object.pseudo[name] || core.pseudo[name];
										}
	
									// assign
										selector.name	= name;
										selector.method	= method;
								}
	
							// 9: attribute "[attribute=value]"
								else if(exec[9])
								{
									// selector properties
										selector.type	= 'filter';
										selector.name	= 'attribute';
										selector.method	= core.filter.attribute;
	
									// attribute components
										var attName		= exec[10];
										var attOperand	= exec[11];
										var attValue	= exec[12];
										var val			= parseFloat(attValue);
	
									// parse numeric values
										if( ! isNaN(val) )// /<>/.test(attOperand)
										{
											attValue = val;
										}
										else
										{
											attValue = /[\*{}]/.test(attValue) ? Selector.makeRX(attValue, selector) : attValue;
										}
	
									// assign
										selector.params	= [null, attName, attOperand, attValue, selector.range, object.custom];
								}
								else
								{
									throw new TypeError('TypeError in Selectors.parse(): Unrecognised pattern "' +selector.pattern+ '"');
								}
	
						// --------------------------------------------------------------------------------
						// assign selector, or throw error
	
								//trace('TYPE:' + selector);
	
							// finally, add selector
								if(selector.method)
								{
									selectors.push(selector);
								}
								else
								{
									throw new TypeError('TypeError: Unrecognised selector "' +selector.pattern+ '" in ' +type+ 'Selector function');
								}
	
					}
	
				// debug
					//inspect(selectors, 'SELECTORS');
					if(selectors.length == 0)
					{
						//throw new Error('Error: The selector expression "' +expression+ '" is not valid');
					}
	
				// return
					return selectors;
			},
			
	
			/**
			 * Tests the selectors against the supplied items and returns matches
			 * @param	selectors	{Array}			An array of Selector instances
			 * @param	items		{Array}			An array of items to filter
			 * @param	scope		{Object}		A valid scope reference. Valid types are Library, Document, Timeline, Layer, Frame
			 * @returns				{Array}			An array of elements, items, etc
			 */
			test:function(selectors, items, scope)
			{
				// exit early if no valid selectors
					if(selectors.length === 0)
					{
						return [];
					}
	
				// debug
					if(Selectors.debug)
					{
						inspect(selectors, 'Selectors');
					}

				// loop over all selectors
					for each(var selector in selectors)
					{
						// store temporary items as we find and filter
							var temp	= [];
	
						// if the task is find or combo:  filter items as a group, with any extra processing taking place in the testing function
							if(selector.type === 'find' || selector.type === 'combo')
							{
								temp = selector.filter(items, scope);
							}
	
						// otherwise: filter items by testing each item individually
							else
							{
								var state;
								for each(var item in items)
								{
									state = selector.test(item, scope);
									if(state)
									{
										temp.push(item);
									}
								}
							}
	
						// update items with temp items
							items = temp;
	
						// exit early if 0 items
							if(items.length == 0)
							{
								break;
							}
					}
	
				// return
					return items;
			},
	
			toString:function()
			{
				return '[class Selectors]';
			}
	
		}


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                       ██████              ██         
//  ██                             ██                ██         
//  ██     █████ ████ █████        ██   █████ █████ █████ █████ 
//  ██     ██ ██ ██   ██ ██        ██   ██ ██ ██     ██   ██    
//  ██     ██ ██ ██   █████        ██   █████ █████  ██   █████ 
//  ██     ██ ██ ██   ██           ██   ██       ██  ██      ██ 
//  ██████ █████ ██   █████        ██   █████ █████  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// # Core Tests

	Selectors.core =
	{
		// # Filter
		filter:
		{
			/**
			 * Test an attribute of an object against a value or callback
			 * @param	item		{Object}	The item to test
			 * @param	name		{String}	The name of the attribute
			 * @param	operand		{String}	The operand type. Acceptable string values are =, !=, ^=, $=, *=. Acceptable numeric values are =, !=, >, >=, <, <=
			 * @param	value		{String}	The String value to test against
			 * @param	value		{Number}	The Number value to test against
			 * @param	range		{Object}	A range object with .min and .max values
			 * @param	custom		{Object}	The Selectors.<type>.custom object which contains custom callbacks
			 * @returns				{Boolean}	True if the test passes
			 */
			attribute:function(item, name, operand, value, range, custom)
			{
				//trace('Testing attribute: ' + [item, name, operand, value, range, custom]);
				
				// variables
					var callback, prop;

				// get a deep property if there are periods in the name
					if(name.indexOf('.') !== -1)
					{
						prop = Utils.getDeepValue(item, name);
					}

				// otherwise...
					else
					{
						// get a native property
							if(name in item)
							{
								prop = item[name];
							}

						// grab a custom property using callbacks
							else
							{
								callback = custom[name];
								if( ! callback )
								{
									throw new ReferenceError('A callback for the custom attribute "' +name+ '" has not been registered');
								}
								prop = callback.call(this, item);
							}
					}

				// no operand, just test for property
					if(operand == '')
					{
						return callback ? prop : name in item;
					}

				// numeric operand (>, >=, <, <=)
					if(typeof value === 'number' && range == undefined)
					{
						//trace('NUMERIC')
						switch(operand)
						{
							case '=':		return prop == value;
							case '!=':		return prop != value;
							case '<':		return prop < value;
							case '<=':		return prop <= value;
							case '>':		return prop > value;
							case '>=':		return prop >= value;
						}
					}

				// range comparison (={min|max} converted to range object {min:n, max:m})
				// NOTE: this does not handle mixed values, like 'star1' to 'star5'
					if(range)
					{
						//trace('RANGE');
						return prop >= range.min && prop <= range.max;
					}

				// the last two comparisons are string-based, so cast the property to a String
					prop = String(prop);

				// RegExp comparison (^=, $=, *=)
					if(operand === '^=' || operand === '$=' || operand === '*=')
					{
						//trace('CONTAINS, STARTS OR ENDS WITH')
						var rxStr = operand === '^='
									? '^' + value
									: operand === '$='
										? value + '$'
										: value;
										
						var rx = new RegExp(rxStr)
						return rx.test(prop);
					}

				// test for wildcards
					if(value instanceof RegExp)
					{
						//trace('REGEXP')
						switch(operand)
						{
							case '=':		return value.test(prop);
							case '!=':		return ! value.test(prop);
							default:		return false;
						}
					}

				// finally, string operand (=, !=)
					switch(operand)
					{
						case '=':		return prop === value;
						case '!=':		return prop !== value;
						default:		return false;
					}

			}

		},

		// # Math
		math:
		{

			/**
			 * Returns items within a min and max range value
			 * @param		{String}		str			A numeric value
			 * @param		{Object}		range		A Range object with .min and .max values
			 * @returns		{Boolean}					true or false depending if the value was was within the range
			 */
			range:function(str, range)
			{
				var value = parseFloat(str);
				return value >= range.min && value <= range.max;
				/*
				var matches = String(value).match(/([\d+\.])/);
				if(matches)
				{
					value = parseFloat(matches[1]);
					return value >= range.min && value <= range.max;
				}
				return false;
				*/
			}

		},

		// # Find
		find:
		{
			/**
			 * Returns the first item of the supplied items
			 * @param	{Array}	items		An Array of Items
			 * @returns	{Item}				A single Item
			 */
			first:function(items)
			{
				return [items.shift()];
			},

			/**
			 * Returns the last item of the supplied items
			 * @param	{Array}	items		An Array of Items
			 * @returns	{Item}				A single Item
			 */
			last:function(items)
			{
				return [items.pop()];
			},

			/**
			 * Finds every even index of the supplied items
			 * @param	{Item}		parents		An Array of folder parent items
			 * @returns	{Array}					An Array of items
			 */
			even:function(items)
			{
				return Selectors.core.combo.nth(items, 'even');
			},

			/**
			 * Finds every odd index of the supplied items
			 * @param	{Item}		parents		An Array of folder parent items
			 * @returns	{Array}					An Array of items
			 */
			odd:function(items)
			{
				return Selectors.core.combo.nth(items, 'odd');
			},
			
			/**
			 * Finds a random selection of items from the supplied items
			 * @param	{Item}		parents		An Array of folder parent items
			 * @param	{Number}	amount		An amount from 0-1 which indicates the probability of a match
			 * @returns	{Array}					An Array of items
			 */
			random:function(items, amount)
			{
				amount = amount || 0.5;
				var arr = [];
				for each(var item in items)
				{
					if(Math.random() < amount)
					{
						arr.push(item);
					}
				}
				return arr;
			},
			
		},

		pseudo:
		{

		},

		// # Combo
		combo:
		{
			/**
			 * Returns the opposite value to that of the supplied expression
			 * @param		{Array}		items			An Array of items
			 * @param		{String}	expression		The CSS expression to negate
			 * @param		{String}	type			The type of selection
			 * @returns		{Array}						An Array of items
			 */
			not:function(items, expression, type)
			{
				// create new selector(s) with supplied :not(expr) expression
					var selectors = Selectors.parse(expression, type);
					
				// negate all selectors
					var selector;
					for each(selector in selectors)
					{
						selector.keep = false;
					}
				
				// get the items with the new selecor
					var newItems = Selectors.test(selectors, items, this);

				// compare to items in
					return newItems

			},

			//TODO contains() functionality - should this be custom per type, i.e. items, elements, frames?
			/**
			 *
			 * @param	selector
			 * @returns
			 */
			contains:function(items, expression, type)
			{
				throw new ReferenceError('The :contains() selector is not implemented yet');
				return items;
			},
			
			has:function(items, expression, type)
			{
				throw new ReferenceError('The :has() selector is not implemented yet');
				return items;
			},
			
			/**
			 * Randomly returns items according to a 0.0 - 1.0 theshold
			 * @param		{Array}		items			An Array of items
			 * @param		{String}	expression		An expression of the format 0.0 to 1.0
			 * @param		{String}	type			Description
			 * @returns		{Array}						An Array of items
			 */
			random:function(items, expression, type)
			{
				var amount = parseFloat(expression);
				return Selectors.core.find.random(items, amount);
			},

			/**
			 * Finds every n-th child of the supplied items
			 * @param	{Item}		items		An Array of items
			 * @param	{String}	expression	An expression of the format (event|odd|random), 3, 3n, 3n+3, 3n-3
			 * @returns	{Array}					An Array of items
			 */
			nth:function(items, expression, type)
			{
				// variables
					var fn;
				
				// parse expression
					var matches = String(expression).match(/(odd|even|random)|(\d+)n?([\-+])?(\d+)?/);
					if (matches != null)
					{
						// debug
							//inspect(matches)
						
						// matches
							/*
								0		1		2	3	4
								odd		odd			
								even	even			
								random	random
								3				3		
								3n				3		
								3n+1			3	+	1
								3n-1			3	-	1
							*/
							
						// even / odd / random
							if(matches[1])
							{
								var fns =
								{
									odd:	function(i){ return i % 2 == 0},
									even:	function(i){ return i % 2 == 1},
									random:	function(){ return Math.random() < 0.5 }
								}
								fn = fns[matches[1]];
							}
							
						// nth, nth repeated, nth repeated and offset
							else if(matches[2])
							{
								// variables
									var index		= parseInt(matches[2]);
									var operator	= matches[3] == '-' ? -1 : 1;
									var offset		= matches[4] ? parseInt(matches[4]) * operator : 0;
									
								// a single numeric match only
									if(matches[0].indexOf('n') === -1)
									{
										var item = items[index - 1];
										return [item];
									}
									
								// a multiple match plus modifiers
									else
									{
										fn = function(i){ return (i + 1 - offset) % index === 0; }
									}
							}
					}

				// start matching
					var arr = [];
					for (var i = 0; i < items.length; i++)
					{
						if(fn(i))
						{
							var item = items[i];
							if(item !== undefined)
							{
								arr.push(items[i]);
							}
						}
					}
					
					return arr;
			},

		}

	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                             ██        ██████              ██         
//  ██     ██                             ██          ██                ██         
//  ██     ██ █████ ████████ █████ █████ █████        ██   █████ █████ █████ █████ 
//  █████  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██  ██          ██   ██ ██ ██     ██   ██    
//  ██     ██ █████ ██ ██ ██ █████ ██ ██  ██          ██   █████ █████  ██   █████ 
//  ██     ██ ██    ██ ██ ██ ██    ██ ██  ██          ██   ██       ██  ██      ██ 
//  ██████ ██ █████ ██ ██ ██ █████ ██ ██  ████        ██   █████ █████  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// # Element Tests

	Selectors.element =
	{
		/**
		 * Registers a custom selector with the Selectors.element object
		 * @param	{String}	pattern		The selector expression
		 * @param	{Function}	callback	A custom funtion to test elements with
		 * @returns	{Selectors}				The original Selectors Object
		 */
		register:function(pattern, callback)
		{
			return Selectors.register(pattern, callback, 'element');
		},

		// # Filters
		filter:
		{
			/**
			 *
			 * @param	item	{Element}	An Element
			 * @param	rx		{RegExp}	A regular expression to match against the item name
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			name:function(item, rx, range)
			{
				return Selectors.item.filter.path(item, rx, range);
			},

			/**
			 *
			 * @param	item	{Element}	An Element
			 * @param	rx		{RegExp}	A regular expression to match against the item path
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			path:function(item, rx, range)
			{
				if(item.libraryItem)
				{
					return Selectors.item.filter.path(item.libraryItem, rx, range);
				}
				else
				{
					return false;
				}
			},

			/**
			 *
			 * @param	item	{Element}	An Element
			 * @param	type	{String}	A valid Item itemType
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			type:function(item, type)
			{
				switch(item.elementType)
				{
					// --------------------------------------------------------------------------------
					// instance: symbol, bitmap, embedded video, linked video, video, compiled clip

						//TODO Add video

						case 'instance':

							// symbol: button, movieclip, graphic
								if(item.symbolType)
								{
									if(type === 'symbol')
									{
										return true;
									}
									return type === 'instance' || item.symbolType.replace(/ /g, '') === type;
								}

							// instance
								return type === 'instance' || item.instanceType.replace(/ /g, '') === type;

						break;

					// --------------------------------------------------------------------------------
					// text: text, static, dynamic, input

						case 'text':

							if(type === 'text')
							{
								return true;
							}
							return item.textType.replace(/ /g, '') === type;

						break;

					// --------------------------------------------------------------------------------
					// shape: primitive, group, shape

						case 'shape':
							if(item.isRectangleObject || item.isOvalObject)
							{
								return type === 'primitive';
							}
							if(item.isGroup)
							{
								return type === 'group';
							}
							return type === 'shape';
						break;
				}

				return false;

			},
			
			/**
			 *
			 * @param	item	{Element}	A library Item instance
			 * @param	rx		{RegExp}	A regular expression to match against the item's full linkageClassName
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			Package:function(item, rx)
			{
				return item.libraryItem && Selectors.item.filter.Package(item.libraryItem, rx);
			},

			/**
			 *
			 * @param	item	{Element}	A library Item instance
			 * @param	rx		{RegExp}	A regular expression to match against the Class component of the item'slinkageClassName
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			Class:function(item, rx)
			{
				return item.libraryItem && Selectors.item.filter.Class(item.libraryItem, rx);
			},

		},

		// # Find
		find:
		{
			selected:function(items)
			{
				var selection = this.selection; // this refers to $dom
				return items.filter(function(element) { return selection.indexOf(element) !== -1 } );
			}
		},

		// # Psuedo
		pseudo:
		{
			/**
			 *
			 * @param	item
			 * @returns
			 */
			empty:function(element)
			{
				if(element.symbolType)
				{
					return Selectors.timeline.pseudo.empty(element.libraryItem.timeline);
				}
				return false;
			},

			/**
			 *
			 * @param	element
			 * @returns
			 */
			animated:function(element)
			{
				if(element.symbolType)
				{
					return Selectors.timeline.pseudo.animated(element.libraryItem.timeline);
				}
				return false;
			},

			/**
			 *
			 * @param	element
			 * @returns
			 */
			keyframed:function(element)
			{
				if(element.symbolType)
				{
					return Selectors.timeline.pseudo.keyframed(element.libraryItem.timeline);
				}
				return false;
			},

			/**
			 *
			 * @param	element
			 * @returns
			 */
			scripted:function(element)
			{
				if(element.symbolType)
				{
					return Selectors.timeline.pseudo.scripted(element.libraryItem.timeline);
				}
				return false;
			},

			scriptable:function(element)
			{
				return (
						(element.elementType === 'instance' && ! (element.symbolType === 'graphic' || element.instanceType === 'bitmap'))
						|| (element.elementType === 'text' && /(dynamic|input)/.test(element.textType))
						|| element.elementType === 'tlfText'
					)
			},
			
			/**
			 *
			 * @param	element
			 * @returns
			 */
			audible:function(element)
			{
				if(element.symbolType)
				{
					return Selectors.timeline.pseudo.audible(element.libraryItem.timeline);
				}
				return false;
			},
			
			/**
			 *
			 * @param	element
			 * @returns
			 */
			exported:function(element)
			{
				if(element.libraryItem)
				{
					return Selectors.item.pseudo.exported(element.libraryItem);
				}
				return false;
			},
			
			filtered:function(element)
			{
				return element.filters && element.filters.length > 0;
			},
			
			tinted:function(element)
			{
				return element.colorMode && element.colorMode === 'tint';
			},
			
			transparent:function(element)
			{
				return element.colorMode && element.colorMode === 'alpha';
			},
			
			component:function(element)
			{
				return element.instanceType === 'compiled clip';
			},
		},

		custom:
		{

		}

	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██                       ██████              ██         
//  ██  ██                         ██                ██         
//  ██ █████ █████ ████████        ██   █████ █████ █████ █████ 
//  ██  ██   ██ ██ ██ ██ ██        ██   ██ ██ ██     ██   ██    
//  ██  ██   █████ ██ ██ ██        ██   █████ █████  ██   █████ 
//  ██  ██   ██    ██ ██ ██        ██   ██       ██  ██      ██ 
//  ██  ████ █████ ██ ██ ██        ██   █████ █████  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// # Item Tests

	Selectors.item =
	{
		register:function(pattern, callback)
		{
			Selectors.register(pattern, callback, 'item');
		},

		// # Filters
		filter:
		{
			/**
			 *
			 * @param	item	{Item}		A library Item instance
			 * @param	rx		{RegExp}	A regular expression to match against the item name
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			name:function(item, rx, range)
			{
				var matches	= item.itemName.match(rx);
				if(matches)
				{
					if(range)
					{
						return Selectors.core.math.range(matches[1], range);
					}
					return true;
				}
				return false;
			},

			/**
			 *
			 * @param	item	{Item}		A library Item instance
			 * @param	rx		{RegExp}	A regular expression to match against the item path
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			path:function(item, rx, range)
			{
				var matches	= item.name.match(rx);
				if(matches)
				{
					if(range)
					{
						return Selectors.core.math.range(matches[1], range);
					}
					return true;
				}
				return false;
			},

			/**
			 *
			 * @param	item	{Item}		A library Item instance
			 * @param	rx		{RegExp}	A regular expression to match against the item's full linkageClassName
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			Package:function(item, rx)
			{
				if(item['linkageClassName'])
				{
					return rx.test(item.linkageClassName);
				}
				return false;
			},

			/**
			 *
			 * @param	item	{Item}		A library Item instance
			 * @param	rx		{RegExp}	A regular expression to match against the Class component of the item'slinkageClassName
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			Class:function(item, rxClass)
			{
				if(item['linkageClassName'])
				
				{
					return rxClass.test(item.linkageClassName.split('.').pop());
				}
				return false;
			},

			/**
			 *
			 * @param	item	{Item}		A library Item instance
			 * @param	type	{String}	A valid Item itemType
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			type:function(item, type)
			{
				// remove spaces from item type
					var itemType = item.itemType.replace(/ /g, '');

				// common selector for symbols
					if(type === 'symbol')
					{
						return /movieclip|graphic|button/.test(itemType);
					}

				// special case for videos: video, linked video, embedded video
					if(itemType === 'video' && type.match(/video|linkedvideo|embeddedvideo/))
					{
						return type === 'video' ? true : item.videoType === type;
					}

				// undefined, component, movieclip, graphic, button, folder, font, sound, bitmap, compiledclip, screen
					else
					{
						return itemType === type;
					}
			}

		},

		// # Find
		find:
		{
			/**
			 * Find the parent items of the suppleied items
			 * @param	{Array}	items		An Array of Items
			 * @returns	{Array}				An Array of Items
			 */
			parent:function(items)
			{
				// loop through items and grab all parent paths
					var parent, paths = [];
					for each(var item in items)
					{
						if(item.name.indexOf('/') > -1)
						{
							parent = item.name.replace(/\/[^/]+$/, '')
							paths.push(parent);
						}
					}

				// make array unique
					paths = Utils.toUniqueArray(paths);

					//inspect(paths)

				// grab folders from library
					var index, temp = [];
					for each(var path in paths)
					{
						index = this.findItemIndex(path);
						if(index != '')
						{
							temp.push(this.items[index]);
						}
					}

				// return
					return temp;
			},

			/**
			 * Find the immediate children of supplied items
			 * @param	{Item}	parents		An Array of folder parent items
			 * @returns	{Array}				An Array of items
			 */
			children:function(parents)
			{
				var items = [];
				for each(var parent in parents)
				{
					// skip non-folder items (as they won't have children)
						if(parent.itemType !== 'folder')
						{
							continue;
						}

					// check against all other items in the library
						for each(var item in this.items)
						{
							if(item !== parent && item.name.indexOf(parent.name) == 0)
							{
								var path = item.name.substr(parent.name.length + 1);
								if(path.indexOf('/') === -1)
								{
									items.push(item);
								}
							}
						}

				}
				return items;
			},

			/**
			 * Finds all desendents of the supplied items
			 * @param	{Item}	parents		An Array of folder parent items
			 * @returns	{Array}				An Array of items
			 */
			descendants:function(parents)
			{
				var items = [];
				for each(var parent in parents)
				{
					// skip non- folder items (as they won't have children)
						if(parent.itemType !== 'folder')
						{
							continue;
						}

					// check against all other items in the library
						for each(var item in this.items)
						{
							if(item !== parent && item.name.indexOf(parent.name) == 0)
							{
								items.push(item);
							}
						}

				}
				return items;
			},
			
			/**
			 * Finds all desendents of the supplied items
			 * @param	{Item}	parents		An Array of folder parent items
			 * @returns	{Array}				An Array of items
			 */
			selected:function(items)
			{
				//BUG Why does this return all children? It should only return the folder(s) itself
				var selected	= this.getSelectedItems() || [];
				var common		= Utils.diff(items, selected, 0);
				return common;
			}

		},

		// # Pseudo
		pseudo:
		{
			/**
			 *
			 * @param	item
			 * @returns
			 */
			exported:function(item)
			{
				return item.linkageExportForAS === true;
			},

			timeline:function(item)
			{
				return /^(movie clip|graphic|button)/.test(item.itemType);
			},

			/**
			 *
			 * @param	item
			 * @returns
			 */
			empty:function(item)
			{
				if(item.itemType === 'folder')
				{
					var children = Selectors.item.find.children.apply(this, [[item]]);
					return children.length == 0;;
				}
				else if(Selectors.item.filter.type(item, 'symbol'))
				{
					return Selectors.timeline.pseudo.empty(item.timeline);
				}
				return false;
			},

			/**
			 *
			 * @param	item
			 * @returns
			 */
			animated:function(item)
			{
				if(Selectors.item.filter.type(item, 'symbol'))
				{
					return Selectors.timeline.pseudo.animated(item.timeline);
				}
				return false;
			},

			/**
			 *
			 * @param	item
			 * @returns
			 */
			keyframed:function(item)
			{
				if(Selectors.item.filter.type(item, 'symbol'))
				{
					return Selectors.timeline.pseudo.keyframed(item.timeline);
				}
				return false;
			},

			/**
			 *
			 * @param	item
			 * @returns
			 */
			scripted:function(item)
			{
				if(Selectors.item.filter.type(item, 'symbol'))
				{
					return Selectors.timeline.pseudo.scripted(item.timeline);
				}
				return false;
			},

			/**
			 *
			 * @param	item
			 * @returns
			 */
			audible:function(item)
			{
				if(Selectors.item.filter.type(item, 'symbol'))
				{
					return Selectors.timeline.pseudo.audible(item.timeline);
				}
				return false;
			}

		},
		
		custom:
		{

		}

	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                ██ ██                  ██████              ██         
//    ██                     ██                       ██                ██         
//    ██   ██ ████████ █████ ██ ██ █████ █████        ██   █████ █████ █████ █████ 
//    ██   ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██        ██   ██ ██ ██     ██   ██    
//    ██   ██ ██ ██ ██ █████ ██ ██ ██ ██ █████        ██   █████ █████  ██   █████ 
//    ██   ██ ██ ██ ██ ██    ██ ██ ██ ██ ██           ██   ██       ██  ██      ██ 
//    ██   ██ ██ ██ ██ █████ ██ ██ ██ ██ █████        ██   █████ █████  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// # Timeline Tests

	Selectors.timeline =
	{
		// # Pseudo
		pseudo:
		{
			/**
			 *
			 * @param	item
			 * @returns
			 */
			empty:function(timeline)
			{
				return ! Iterators.layers(timeline, null, function (frame){ return frame.elements.length > 0; });
			},

			/**
			 *
			 * @param	element
			 * @returns
			 */
			animated:function(timeline)
			{
				return Iterators.layers(timeline, null, function (frame){ return frame.tweenType != 'none'; } );
			},

			/**
			 *
			 * @param	element
			 * @returns
			 */
			keyframed:function(timeline)
			{
				return Iterators.layers(timeline, null, function (frame){ return frame.startFrame > 0 && frame.elements.length > 0; } );
			},

			/**
			 *
			 * @param	element
			 * @returns
			 */
			scripted:function(timeline)
			{
				return Iterators.layers(timeline, null, function (frame){ return frame.actionScript != ''; });
			},

			/**
			 *
			 * @param	element
			 * @returns
			 */
			audible:function(timeline)
			{
				return Iterators.layers(timeline, null, function (frame){ return frame.soundLibraryItem != null; });
			}
		},

		custom:
		{

		}
	}
	
	// --------------------------------------------------------------------------------------------------------------------
	// Register class
	
		xjsfl.classes.register('Selectors', Selectors);

