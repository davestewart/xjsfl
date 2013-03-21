/**
 * Change the selected item's names to match their library item's name
 * @icon {iconsURI}ui/textfield/textfield_key.png
 */
(function()
{
	// ----------------------------------------------------------------------------------------------------
	// variables
	
		var fnCase, separator, hash = {};
		
	// ----------------------------------------------------------------------------------------------------
	// functions
	
		function rename(element, name)
		{
			// variables
				var name	= String(name)[fnCase]();
				var index	= name;
		
			// initialize hash
				if( ! hash[name] )
				{
					hash[name] = [];
				}
				
			// if hash only has one element, rename that, and update the name
				else if(hash[name].length == 1)
				{
					// rename old element
						hash[name][0].name = name + separator + '1';
					
					// rename new element
						name += separator + '2' ;
				}
				
			// if hash has more than one element, just rename the new element
				else
				{
					name += separator + (hash[name].length + 1);
				}
				
			// assign name to hash
				element.name = name;
				hash[index].push(element);
		}
			
		function onAccept(renameType, style, _separator)
		{
			try
			{
				// variables
					fnCase		= style;
					separator	= _separator === 'Underscore' ? '_' : '';
					
				// loop over elements and rename
					for each(var element in $selection)
					{
						var item = element.libraryItem;
						if(item)
						{
							var itemName	= item.itemName;
							var className	= item.linkageClassName ? item.linkageClassName.split('.').pop() : null;
							switch(renameType)
							{
								case 'class':
									rename(element, className || itemName, separator);
								break;
							
								case 'item':
									rename(element, item.itemName, separator);
								break;
							
								case 'path':
									rename(element, item.name, separator);
								break;
							}
						}
						else
						{
							format('Skipping {element.elementType} "{element.name}"', element);
						}
					}
					
				// update document
					$dom.update()
					
				// list
					list($selection, 'name');
			}
			catch(error)
			{
				debug(error);
			}
			
			
		}
		
	// ----------------------------------------------------------------------------------------------------
	// code
	
		xjsfl.init(this);
		if(UI.selection)
		{
			XUL.create('title:Assign unique names,radio:Name after={Class or item name:class,Item Name:item,Path:path},radio:Style={camelCase:toCamelCase,under_score:toUnderscore},radios:Numeric Separator=[Underscore,None]', onAccept)
		}
		
})()
