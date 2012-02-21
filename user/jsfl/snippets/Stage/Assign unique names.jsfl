/**
 * Change the selected item's names to match their library item's name
 * @icon {iconsURI}Design/text/text_replace.png
 */
(function()
{
	// ----------------------------------------------------------------------------------------------------
	// variables
	
		var fnCase, hash = {};
		
	// ----------------------------------------------------------------------------------------------------
	// functions
	
		function rename(element, name)
		{
			// variables
				var name	= fnCase(name);
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
						hash[name][0].name = name + '_1';
					
					// rename new element
						name += '_2' ;
				}
				
			// if hash has more than one element, just rename the new element
				else
				{
					name += '_' + (hash[name].length + 1);
				}
				
			// assign name to hash
				element.name = name;
				hash[index].push(element);
		}
			
		function onAccept(renameType, style)
		{
			try
			{
				// set rename style
					fnCase = Utils[style];
					
				// loop over elements and rename
					for each(var element in $selection)
					{
						var item = element.libraryItem;
						if(item)
						{
							var itemName	= item.shortName;
							var className	= item.linkageClassName ? item.linkageClassName.split('.').pop() : null;
							switch(renameType)
							{
								case 'class':
									rename(element, className || itemName);
								break;
							
								case 'item':
									rename(element, item.shortName);
								break;
							
								case 'path':
									rename(element, item.name);
								break;
							
							}
						}
						else
						{
							format('Skipping {element.elementType} "{element.name}"', element);
						}
						
					// update document
						$dom.update()
				}
			}
			catch(error)
			{
				debug(error);
			}
			
			
		}
		
	// ----------------------------------------------------------------------------------------------------
	// code
	
		xjsfl.init(this);
		if(Get.selection())
		{
			XUL.create('title:Assign unique names,radio:Name after={Class or item name:class,Item Name:item,Path:path},radio:Style={camelCase:camelCase,under_score:underscore}', onAccept)
		}
		
})()
