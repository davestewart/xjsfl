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
// Selectors - global selector functions to be used by all Selector functions

	var Selectors =
	{
		/**
		 * 
		 * @param	expression	{String}		A CSS expression
		 * @param	items		{Array}			An array of items to filter
		 * @param	scope		{Object}		A valid scope reference. Valid types are Library, Document, Timeline, Layer, Frame
		 * @param	debug		{Boolean}		An optional flsg to print Selector information to the Output panel
		 * @returns				{Collection}	
		 */
		select:function(expression, items, scope, debug)
		{
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
					throw new TypeError('TypeError: Invalid scope ' +scope+ ' supplied to Selector.select()');
				}


			// parse selectors			
				var selectors = this.parse(expression, type);
				
			// debug
				if(debug)
				{
					Output.inspect(selectors, 'Selectors for "' + expression + '"');
				}
				
			// test
				return Selectors.test(selectors, items, scope)
			
		},
		

		/**
		 * parse a selector expression into selectors - also called from :not()
		 * @param	expression	
		 * @param	typeTests	
		 * @param	scope	
		 * @returns		
		 */
		parse:function(expression, type)
		{
			// --------------------------------------------------------------------------------
			// setup
			
				// chunker
					/*
						#  type             match
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
						   10:  name		attribute
						   11:  operand		=
						   12: value		value
					*/
					//var chunker = /(:([\-\w]+)\((.+)\))|([\*\d\w][\-\w\d\s_*{|}]+)|\/([\-\w\s\/_*{|}]+)|\.([*A-Z][\w*]+)|\.([a-z][\w.*]+)|:([a-z]\w+)|\[((\w+)([\^$*!=<>]{1,2})?(.+?)?)\]/g;
					var chunker = /(:([\-\w]+)\((.+)\))|([A-Za-z_*][\-\w\s_.*{|}]+)|\/([\-\w\s\/_*{|}]+)|:([*A-Z][\w*]+)|:([a-z][\w*]+\.[a-z][\w.*]+)|:([a-z]\w+)|\[((\w+)([\^$*!=<>]{1,2})?(.+?)?)\]/g;
	
				// variables
					var exec,
						selector,
						selectors = [],
						typeTests = Selectors[type.toLowerCase()],
						coreTests = Selectors.core;
						
				// debug
					//trace('\n\n\n\n--------------------------------------------------------------------------------\n' + expression + '\n--------------------------------------------------------------------------------')
				
			// --------------------------------------------------------------------------------
			// parse
			
				while(exec = chunker.exec(expression))
				{
					// --------------------------------------------------------------------------------
					// setup
					
						// debug
							//Output.inspect(exec);
							//trace(limit++);
							
						// create
							selector = new Selector(exec[0]);
						
					// --------------------------------------------------------------------------------
					// create selector
					
						// 1: combo ":not(:bitmap)"
							if(exec[1])
							{
								/*
								// build sub-selector
									var subselectors		= Selectors.parse(exec[3], typeTests, scope);
									
								// re-assign sub-selector
									//Output.inspect(subselectors, 'SUBSELECTORS');
									if(subselectors.length)
									{
										selector			= subselectors[0];
										selector.not		= exec[3] === 'not';
									}
									*/
								selector.type	= 'combo';
								selector.method	= coreTests.combo[exec[2]];
								selector.params	= [null, Selector.makeRX(exec[3], selector)];
							}
							
						// 4: name "this is a name"
							else if(exec[4])
							{
								selector.type	= 'name';
								selector.method	= typeTests.filter.name;
								selector.params	= [null, Selector.makeRX(exec[4], selector), selector.range];
							}
							
						// 5: path "/path/to/item"
							else if(exec[5])
							{
								selector.type	= 'path';
								selector.method	= typeTests.filter.path;
								selector.params	= [null, Selector.makeRX(exec[5], selector), selector.range];
							}
							
						// 6: Class ".Class"
							else if(exec[6])
							{
								selector.type	= 'class';
								selector.method	= typeTests.filter.Class;
								selector.params	= [null, Selector.makeRX(exec[6], selector)];
							}
							
						// 7: package ".com.domain.package.Class"
							else if(exec[7])
							{
								selector.type	= 'package';
								selector.method	= typeTests.filter.Package;
								selector.params	= [null, Selector.makeRX(exec[7], selector)];
							}
							
						// 8: pseudo ":type"
							else if(exec[8])
							{
								if(exec[8].match(/selected|children|descendants|parent|first|last/))
								{
									selector.type	= 'find';
									selector.method	= typeTests.find[exec[8]];
								}
								else if(exec[8].match(/exported|timeline|empty|animated|scripted|audible/))
								{
									selector.type	= 'pseudo';
									selector.method	= typeTests.pseudo[exec[8]];
								}
								else
								{
									selector.type	= 'type';
									selector.method	= typeTests.filter.type;
								}
								selector.params	= [null, exec[8]];
							}
							
						// 9: attribute "[attribute=value]"
							else if(exec[9])
							{
								selector.type	= 'attribute';
								selector.method	= coreTests.filter.attribute;
								selector.params	= [null, exec[10], exec[11], Selector.makeRX(exec[12], selector), selector.range];
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
				//Output.inspect(selectors, 'SELECTORS');
				
			// return
				return selectors;
		},
		
		test:function(selectors, items, scope)
		{
			// exit early if no valid selectors
				if(selectors.length === 0)
				{
					return [];
				}
			
			// loop over all selectors
				for each(var selector in selectors)
				{
					// debug
						//trace(selector);
						
					// variables
						var temp	= [];
						
					// filter items as a group, with any extra processing taking place in the testing function
						if(selector.type === 'find')
						{
							temp = selector.find(items, scope);
						}
						
					// filter items with one test per item
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
						
					// update items
						items = temp;
						
					// exit early if 0 items
						if(items.length == 0)
						{
							break;
						}
				}
				
			// return
				return items;
		}
		
	}
	
	Selectors.core  =
	{
		/**
		 * 
		 */
		filter:
		{
			/**
			 * Test an attribute of an object against a value
			 * @param	item		{Object}	The item to test
			 * @param	name		{String}	The name of the attribute
			 * @param	operand		{String}	The operand type. Acceptable string values are =, !=, ^=, $=, *=. Acceptable numeric values are =, >, >=, <, <=
			 * @param	value		{String}	The value to test against. Acceptable values are Numbers, Strings, regExps, or Range syntax
			 * @returns				{Boolean}	True if the test passes
			 */
			attribute:function attribute(item, name, operand, value, range)
			{
				// no operand, just test for property
					if(operand == '')
					{
						for(var prop in item)
						{
							if(prop === name)
							{
								return true;
							}
						}
						return false;
					}
				
				// numeric operand (>, >=, <, <=)
					if(/<>/.test(operand))
					{
						var prop = parseFloat(item[name]);
						switch(operand)
						{
							case '<':		return prop < value;
							case '<=':		return prop <= value;
							case '>':		return prop > value;
							case '>=':		return prop >= value;
						}
					}
				
				// RegExp comparison (^=, $=, *=)
					if(value instanceof RegExp)
					{
						var prop = String(item[name]);
						return value.test(prop);
					}
				
				// range comparison (={min|max} converted to range object {min:n, max:m})
					if(range)
					{
						return Selectors.core.math.range(prop, range);
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
		
		math:
		{
			
			range:function range(str, range)
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
		
		find:
		{
			
		},
		
		pseudo:
		{
			
		},
		
		combo:
		{
			//TODO not() functionality 
			/**
			 * 
			 * @param	selector		
			 * @param	test		
			 * @returns		
			 */
			not:function not(items, selector)
			{
				trace('NOT ' + selector)
				// get the items with the new selecor
					var newItems = Selectors.select(selector, items, this);
					
					Output.inspect(newItems)
				
				// compare to items in
					return newItems
				
			},
			
			//TODO filter() functionality 
			/**
			 * 
			 * @param	selector	
			 * @returns		
			 */
			filter:function filter(selector)
			{
				
			},
			
			//TODO contains() functionality - should this be custom per type, i.e. items, elements, frames?
			/**
			 * 
			 * @param	selector	
			 * @returns		
			 */
			contains:function contains(selector)
			{
				
			},
			
			//TODO nth()
			/**
			 * 
			 * @param	selector	
			 * @returns		
			 */
			nth:function nth(selector)
			{
				
			}
		
		}
		
	}
	
	Selectors.element =
	{
		
		filter:
		{
			
		},
		
		find:
		{
			
		},
		
		pseudo:
		{
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			empty:function empty(element)
			{
				return ! Iterators.layers(element, null, function (frame){ return frame.elements.length > 0; });
			},
			
			/**
			 * 
			 * @param	element	
			 * @returns		
			 */
			animated:function animated(element)
			{
				return Iterators.layers(element, null, function (frame){ return frame.tweenType != 'none'; } );
			},
			
			/**
			 * 
			 * @param	element	
			 * @returns		
			 */
			scripted:function scripted(element)
			{
				return Iterators.layers(element, null, function (frame){ return frame.actionScript != ''; });
			},
			
			/**
			 * 
			 * @param	element	
			 * @returns		
			 */
			audible:function audible(element)
			{
				return Iterators.layers(element, null, function (frame){ return frame.soundLibraryItem != null; });
			}
		}

	}
	
	Selectors.item  =
	{
		filter:
		{
			/**
			 * 
			 * @param	item	{Item}		A library Item instance
			 * @param	rx		{RegExp}	A regular expression to match against the item name
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			name:function name(item, rx, range)
			{
				var name	= item.name.split('/').pop();
				var matches	= name.match(rx);
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
			path:function path(item, rx, range)
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
			Package:function Package(item, rx)
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
			Class:function Class(item, rxClass)
			{
				if(item['linkageClassName'])
				{
					return rxClass.test(item.linkageClassName);
				}
				return false;
			},
			
			/**
			 * 
			 * @param	item	{Item}		A library Item instance
			 * @param	type	{String}	A valid Item itemType
			 * @returns			{Boolean}	True if matched, false if failed
			 */
			type:function type(item, type)
			{
				// remove spaces from item type
					var itemType = item.itemType.replace(/ /g, '');
					
				// common selector for symbols
					if(type === 'symbol')
					{
						return /movieclip|graphic|button/.test(itemType);
					}
					
				// special case for videos
					if(itemType === 'video' && type.match(/linkedvideo|embeddedvideo/))
					{
						return item.videoType === type;
					}
					
				// undefined, component, movieclip, graphic, button, folder, font, sound, bitmap, compiledclip, screen
					else
					{
						return itemType === type;
					}
			}
			
		},
		
		find:
		{
			/**
			 * 
			 * @param	items	
			 * @returns		
			 */
			first:function first(items)
			{
				return [items.shift()];
			},
			
			/**
			 * 
			 * @param	items	
			 * @returns		
			 */
			last:function last(items)
			{
				return [items.pop()];
			},
			
			/**
			 * 
			 * @param	items	
			 * @returns		
			 */
			parent:function parent(items)
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
					paths = xjsfl.utils.toUniqueArray(paths);
					
					Output.inspect(paths)
					
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
			 * 
			 * @param	items	
			 * @param	parent	
			 * @returns		
			 */
			children:function children(parents)
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
			 * 
			 * @param	items	
			 * @param	parent	
			 * @returns		
			 */
			descendants:function descendants(parents)
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
			 * 
			 * @param	item	
			 * @returns		
			 */
			selected:function selected(items)
			{
				return this.getSelectedItems();
			}
			
		},
		
		pseudo:
		{
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			exported:function exported(item)
			{
				return item.linkageExportForAS === true;
			},
			
			timeline:function timeline(item)
			{
				return /movie clip|graphic|button/.test(item.itemType);
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			empty:function empty(item)
			{
				if(item.itemType === 'folder')
				{
					var children = Selectors.item.find.children.apply(this, [[item]]);
					return children.length == 0;;
				}
				else if(Selectors.item.pseudo.timeline(item))
				{
					return Selectors.element.pseudo.empty(item.timeline);
				}
				return false;
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			animated:function animated(item)
			{
				if(Selectors.item.pseudo.timeline(item))
				{
					return Selectors.element.pseudo.animated(item.timeline);
				}
				return false;
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			scripted:function scripted(item)
			{
				if(Selectors.item.pseudo.timeline(item))
				{
					return Selectors.element.pseudo.scripted(item.timeline);
				}
				return false;
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			audible:function audible(item)
			{
				if(Selectors.item.pseudo.timeline(item))
				{
					return Selectors.element.pseudo.audible(item.timeline);
				}
				return false;
			}
			
		}				
	}
	
	xjsfl.classes.register('Selectors', Selectors);
