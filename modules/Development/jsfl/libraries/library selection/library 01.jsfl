/**
 * Library Item selector function
 * @param	expression		{String}		A String expression
 * @param	context			{String||Item}	A path or reference to a library Item
 * @returns					{Array}			An array of library Items
 * @author	Dave Stewart	
 */
$$ = function(expression, context)
{
	// --------------------------------------------------------------------------------
	// recursively handle multiple selectors
	
		var expressions	= xjsfl.utils.trim(expression).split(/,/g);
		var items		= [];
		if(expressions.length > 1)
		{
			// callback
				for(var i = 0; i < expressions.length; i++)
				{
					items = items.concat($$(expressions[i], context).elements);
				}
			
			// ensure items are unique
				items = xjsfl.utils.unique(items);
				
			// return
				return new ItemCollection(items);
		}
			
	// --------------------------------------------------------------------------------
	// setup
	
		// expand wildcards
			expression		= expression.replace(/\*/g, '.*');
			
		// reference to library
			var library		= fl.getDocumentDOM().library;
			
	// --------------------------------------------------------------------------------
	// selector functions
	
		var selectors =
		{
			combo:
			{
				//TODO not() functionality 
				not:function(selector)
				{
					// do a new select call, then compare the returned array / item collection
				},
				
				//TODO filter() functionality 
				filter:function(selector)
				{
					
				},
				
				//TODO contains() functionality 
				contains:function(selector)
				{
					
				}
			
			},
			
			filter:
			{
				name:function(item, name, rxName)
				{
					var itemName = item.name.split('/').pop();
					return rxName.test(itemName);
				},
				
				path:function(item, path, rxPath)
				{
					var itemPath = item.name.split('/');
					//itemPath.pop();
					//trace(rxPath, itemPath, rxPath.test(itemPath))
					return rxPath.test(itemPath);
				},
				
				//TODO Add package filter and RegExp
				package:function(item, package, rxPackage)
				{
					return true;
				},
				
				Class:function(item, Class, rxClass)
				{
					if(item['linkageClassName'])
					{
						return rxClass.test(item.linkageClassName);
					}
					return false;
				},
				
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
				},
				
				attribute:function(item, name, test, value, rxValue)
				{
					var itemValue = String(item[name]);
					if(rxValue != null)
					{
						return rxValue.test(itemValue);
					}
					else
					{
						switch(test)
						{
							case '=':
								return itemValue === value;
							break;
							case '!=':
								return itemValue !== value;
							break;
						}
					}
					return false;
				}
				
			},
			
			find:
			{
				first:function(items)
				{
					return [items.shift()];
				},
				
				last:function(items)
				{
					return [items.pop()];
				},
				
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
						paths = xjsfl.utils.unique(paths);
						
					// grab folders from library
						var index, temp = [];
						for each(var path in paths)
						{
							index = library.findItemIndex(path);
							if(index != '')
							{
								temp.push(library.items[index]);
							}
						}
						
					// return 
						return temp;
				},
				
				children:function(items, parent)
				{
					// loop through items and add to temp array
						var temp = [];
						for each(var item in items)
						{
							if(item.itemType == 'folder')
							{
								var rx			= new RegExp('^' + item.name + '/[^/]+$');
								var filtered	= library.items.filter( function(item){ return rx.test(item.name); }, this );
								temp			= temp.concat(filtered);
							}
						}
						
					// return 
						return temp;
				},
				
				descendants:function(items, parent)
				{
					// loop through items and add to temp array
						var temp = [];
						for each(var item in items)
						{
							if(item.itemType == 'folder')
							{
								var rx			= new RegExp('^' + item.name + '/.+');
								var filtered	= library.items.filter( function(item){ return rx.test(item.name); }, this );
								temp			= temp.concat(filtered);
							}
						}
						
					// return 
						return temp;
				},
				
				selected:function(item)
				{
					return library.getSelectedItems();
				}
				
			},
			
			pseudo:
			{
				exported:function(item)
				{
					return item.linkageExportForAS == true;
				},
				
				empty:function(item)
				{
					if(item['timeline'])
					{
						return ! xjsfl.iterators.layers(item, null, function (frame){ return frame.elements.length > 0; });
					}
					return false;
				},
				
				animated:function(item)
				{
					if(item['timeline'])
					{
						return xjsfl.iterators.layers(item, null, function (frame){ return frame.tweenType != 'none'; } );
					}
					return false;
				},
				
				scripted:function(item)
				{
					if(item['timeline'])
					{
						return xjsfl.iterators.layers(item, null, function (frame){ return frame.actionScript != ''; });
					}
					return false;
				},
				
				audible:function()
				{
					if(item['timeline'])
					{
						return xjsfl.iterators.layers(item, null, function (frame){ return frame.soundLibraryItem != null; });
					}
					return false;
				}
				
			}
			
		}
	
	// --------------------------------------------------------------------------------
	// resolve context
	
		// check context is a library item or valid path
			if(context)
			{
				if( ! (context instanceof LibraryItem))
				{
					var index	= library.findItemIndex(String(context));
					context		= index != '' ? library.items[index] : null;
				}
			}
			
		// grab items
			items = context ? selectors.find.decendents(library.items, context) : library.items;

	// --------------------------------------------------------------------------------
	// parse a selector expression into tests - also called from :not()
	
		function chunk(expression)
		{
			// chunker
				/*
					1: filter/not
					2: name
					3: path
					4: Class
					5: type
					6: attribute
				*/
				var chunker = /(:[-\w]+\(.+\))|#([\w\s/_-.]+)|(^[\w\s/_-.]+)|:([A-Z]\w+)|:([a-z]\w+)|(\[\w+[\^\$\*!]?=?.+?\])/g;
				
			// add function
				function addTest(type, method, params)
				{
					params = Array.slice.apply(this, [arguments, 2]);
					tests.push({selector:exec[0], type:type, method:method, params:params});
				}
				
			// parse
				var exec, matches, rx, tests = [];
				while(exec = chunker.exec(expression))
				{
					// debug
						//Output.inspect(exec);
						
					// reset
						rx = null;
					
					// filter / not
						if(exec[1])
						{
							matches = exec[1].match(/(\w+)\((.+)\)/);
							addTest('combo', matches[1], matches[2]);
						}
						
					// name
						else if(exec[2])
						{
							addTest('filter', 'name', exec[2], new RegExp('^' + exec[2] + '$'));
						}
						
					// path
						else if(exec[3])
						{
							addTest('filter', 'path', exec[3], new RegExp('^' + exec[3] + '$'));
						}
						
					// Class
						else if(exec[4])
						{
							addTest('filter', 'Class', exec[4], new RegExp('^' + exec[4] + '$'));
						}
						
					// find / pseudo / type
						else if(exec[5])
						{
							if(exec[5].match(/selected|children|descendants|parent|first|last/))
							{
								addTest('find', exec[5], true);
							}
							else if(exec[5].match(/exported|empty|animated|scripted|audible/))
							{
								addTest('pseudo', exec[5], true);
							}
							else
							{
								addTest('filter', 'type', exec[5]);
							}
						}
						
					// attribute
						else if(exec[6])
						{
							matches = exec[6].match(/\[(\w+)([\^\$\*!]?=?)(.+?)\]/);
							switch(matches[2])
							{
								case '^=':
									rx = new RegExp('^' + matches[3]);
								break;
								case '$=':
									rx = new RegExp(matches[3] + '$');
								break;
								case '*=':
									rx = new RegExp(matches[3]);
								break;
							}
							addTest('filter', 'attribute', matches[1], matches[2], matches[3], rx);
						}
				}
				
			// return
				return tests;
		}

	// --------------------------------------------------------------------------------
	// selection function
	
		function select(items)
		{
			var selector, params, temp;
			for each(var test in tests)
			{
				// grab the selector, and test to see that it exists
					selector	= selectors[test.type][test.method];
					if( ! selector )
					{
						xjsfl.trace('Illegal selector "' +test.selector+ '"');
						continue;
					}
					else
					{
						//trace('Selecting: ' + test.selector + ' (' + [test.type, test.method] + ')')
					}
					
				// filter items as a group, with extra calculation in the testing function
					if(/find/.test(test.type))
					{
						params		= [items].concat(test.params);
						items		= selector.apply(this, params);
						items		= xjsfl.utils.unique(items);
					}
					
				// filter items with one test per item
					else
					{
						// variables
							temp	= [];
							params	= [''].concat(test.params)
							
						// process
							for each(var item in items)
							{
								params[0]	= item;
								if(selector.apply(this, params))
								{
									temp.push(item);
								}
							}
							
						// update items
							items = temp;
					}
					
				// break if 0 items
					if(items.length == 0)
					{
						break;
					}
			}
			
			return items;
		}
		
	// --------------------------------------------------------------------------------
	// calculate selection and return
	
		// tests
			var tests	= chunk(expression);
			
		// items
			items		= select(items);
			
		// return
			return new ItemCollection(items);
}


xjsfl.init(this);
clear();

//var items = $$('Folder 1:movieclip');
var items = $$(':movieclip');


/**
 * Item renaming callback
 * @param	name	{String}
 * @param	index	{Number}
 * @param	item	{Item}
 * @returns			{String}
 */
function rename(name, index, item)
{
	return item.linkageClassName + ' ' + (index + 1);
}


Timer.start();
items
	.sort()
	//.inspect()
	.select()
	.rename()
	.rename(rename)
	.move('clips')

Timer.stop(true)
	
/*
// organise library items
[':bitmap',':graphic',':button',':movieclip'].forEach
(
    function(e,i)
    {
        $$(e).move('assets/' + e + 's');
    }
);
*/