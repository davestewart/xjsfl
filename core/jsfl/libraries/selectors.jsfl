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
		select:function(items, selectors)
		{
			for each(var selector in selectors)
			{
				// debug
					trace(selector);
					
				// selector
					items = selector.test(items);
					
				// exit early if 0 items
					if(items.length == 0)
					{
						break;
					}
			}
			
			return items;
		},
		
		tests:
		{
			
		}
		
	}
	
	Selectors.tests.core  =
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
			attribute:function(item, name, operand, value)
			{
				// no operand
					if(operand == undefined)
					{
						return item.hasOwnProperty(name);
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
					if(value.min !== undefined)
					{
						return Selectors.tests.core.math.range(prop, value);
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
			
			range:function(value, range)
			{
				var matches = String(value).match(/\d+/);
				if(matches)
				{
					value = parseFloat(matches[1]);
					return value >= range.min && value <= range.max;
				}
				return false;
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
			not:function(selector, test)
			{
				// do a new select call, then compare the returned array / item collection
			},
			
			//TODO filter() functionality 
			/**
			 * 
			 * @param	selector	
			 * @returns		
			 */
			filter:function(selector)
			{
				
			},
			
			//TODO contains() functionality - should this be custom per type, i.e. items, elements, frames?
			/**
			 * 
			 * @param	selector	
			 * @returns		
			 */
			contains:function(selector)
			{
				
			},
			
			//TODO nth()
			/**
			 * 
			 * @param	selector	
			 * @returns		
			 */
			nth:function(selector)
			{
				
			}
		
		}
		
	}
	
	Selectors.tests.elements  =
	{
		
		filter:
		{
			
		},
		
		find:
		{
			
		},
		
		pseudo:
		{
			//TODO Add :empty functionality for folders, including folders that have only folders in them
			//TODO Add :tip functionality for folders that have no sub-folders
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			empty:function(item)
			{
				trace('\n' + item.name)
				var state = Iterators.layers(item, null, function (frame){ trace(frame.elements.length); if(frame.elements.length > 0){ return true}; });
				trace(state)
				return ! state;
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			animated:function(item)
			{
				return Iterators.layers(item, null, function (frame){ return frame.tweenType != 'none'; } );
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			scripted:function(item)
			{
				return Iterators.layers(item, null, function (frame){ return frame.actionScript != ''; });
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			audible:function(item)
			{
				return Iterators.layers(item, null, function (frame){ return frame.soundLibraryItem != null; });
			}
		}

	}
	
	Selectors.tests.items  =
	{
		filter:
		{
			/**
			 * 
			 * @param	item	
			 * @param	name	
			 * @param	rxName	
			 * @returns		
			 */
			name:function(item, rxName)
			{
				var itemName = item.name.split('/').pop();
				return itemName.match(rxName) !== null;
			},
			
			/**
			 * 
			 * @param	item	
			 * @param	path	
			 * @param	rxPath	
			 * @returns		
			 */
			path:function(item, rxPath)
			{
				return rxPath.test(item.name);
			},
			
			//TODO Add package filter and RegExp, also look at class filtering & selection in general
			/**
			 * 
			 * @param	item	
			 * @param	Package	
			 * @param	rxPackage	
			 * @returns		
			 */
			Package:function(item, rxPackage)
			{
				if(item['linkageClassName'])
				{
					return rxPackage.test(item.linkageClassName);
				}
				return false;
			},
			
			/**
			 * 
			 * @param	item	
			 * @param	Class	
			 * @param	rxClass	
			 * @returns		
			 */
			Class:function(item, rxClass)
			{
				if(item['linkageClassName'])
				{
					return rxClass.test(item.linkageClassName);
				}
				return false;
			},
			
			/**
			 * 
			 * @param	item	
			 * @param	type	
			 * @returns		
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
			first:function(items)
			{
				return [items.shift()];
			},
			
			/**
			 * 
			 * @param	items	
			 * @returns		
			 */
			last:function(items)
			{
				return [items.pop()];
			},
			
			/**
			 * 
			 * @param	items	
			 * @returns		
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
					paths = xjsfl.utils.toUniqueArray(paths);
					
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
			children:function(parent, items)
			{
				// loop through items and add to temp array
					var temp = [];
					for each(var item in items)
					{
						if(item.itemType == 'folder')
						{
							var rx			= new RegExp('^' + item.name + '/[^/]+$');
							var filtered	= items.filter( function(item){ return rx.test(item.name); }, this );
							temp			= temp.concat(filtered);
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
			descendants:function(items, parent)
			{
				// loop through items and add to temp array
					var temp = [];
					for each(var item in items)
					{
						if(item.itemType == 'folder')
						{
							var rx			= new RegExp('^' + item.name + '/.+');
							var filtered	= this.items.filter( function(item){ return rx.test(item.name); }, this );
							temp			= temp.concat(filtered);
						}
					}
					
				// return 
					return temp;
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			selected:function(item)
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
			exported:function(item)
			{
				return item.linkageExportForAS === true;
			},
			
			timeline:function(item)
			{
				return /movie clip|graphic|button/.test(item.itemType);
			},
			
			/**
			 * 
			 * @param	item	
			 * @returns		
			 */
			empty:function(item)
			{
				//TODO Fix :empty - it's broken
				if(item.itemType === 'folder')
				{
					return Selectors.tests.items.find.children(item, this.items).length == 0;
				}
				else if(Selectors.tests.items.pseudo.timeline(item))
				{
					return Selectors.tests.elements.pseudo.empty(item.timeline);
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
				if(Selectors.tests.items.pseudo.timeline(item))
				{
					return Selectors.tests.elements.pseudo.animated(item.timeline);
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
				if(Selectors.tests.items.pseudo.timeline(item))
				{
					return Selectors.tests.elements.pseudo.scripted(item.timeline);
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
				if(Selectors.tests.items.pseudo.timeline(item))
				{
					return Selectors.tests.elements.pseudo.audible(item.timeline);
				}
				return false;
			}
			
		}				
	}
	
	xjsfl.classes.register('Selectors', Selectors);
