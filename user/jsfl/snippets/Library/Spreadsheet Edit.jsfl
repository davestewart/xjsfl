/**
 * Export the items to a spreadsheet for mass editing, then import again once saved
 * @icon {iconsURI}UI/table/table_edit.png
 */

// --------------------------------------------------------------------------------
// initialize

	//xjsfl.init(this);
	
// --------------------------------------------------------------------------------
// do something with items

	var items = $$(':selected').sort('itemType');
	
	if(items.elements.length > 0)
	{
			
		// --------------------------------------------------------------------------------
		// variables
		
			// grab keys and filter
				var ignore		= 'constructor,timeline,scalingGridRect,sourceLibraryName,linkageImportForRS,linkageIdentifier,quality'.split(',');
				var keys		= xjsfl.utils.getKeys(items.elements);
				keys			= keys.filter(function(key){return ignore.indexOf(key) == -1});
				
			// reorder keys, with path, then name, so user can easily rename items
				var index		= keys.indexOf('name');
				keys.splice(index, 1);
				keys			= ['name', 'name'].concat(keys);
				
			// grab rows
				var rows		= xjsfl.utils.getValues(items.elements, keys);
				
			// update header
				keys[0]			= 'path';
				var str			= keys.join(',') + '\n';
				
			// create CSV content
				for each(var row in rows)
				{
					row[1]	= row[1].split('/').pop();
					str		+= '"' + row.join('","') + '"\n';
				}
				
			// create and save file
				var uri			= xjsfl.utils.makeURI('user/jsfl/temp/items.csv');
				var file		= new File(uri, str, true);
			
		// --------------------------------------------------------------------------------
		// handlers
	
			function accept()
			{
				// run (Flash will pause whilst the file is open)
					file.run();
					
				// get file contents
					var lines		= file.contents.split(/[\r\n]+/g);
					var keys		= lines.shift().split(',');
					
				// update items
					for each(var line in lines)
					{
						// grab values from line
							var values	= line.split(',');
							var path	= values[0].replace(/"/g, '');
							
						// item
							var index	= document.library.findItemIndex(path);
							var item	= document.library.items[index];
							if( ! item) continue;
							
						// loop through and assign
							for(var i = 0; i < values.length; i++)
							{
								// values
									var value	= values[i].replace(/"/g, '');
									var key		= keys[i];
									
								// check if OK to assign, and assign
									if(item[key] != undefined)
									{
										trace(item.name, key, value);
										item[key] = xjsfl.utils.parseValue(value);
									}
							}
					}
					
				// prompt
					alert('The items in the library have been updated!');					
			}
			
			
		// --------------------------------------------------------------------------------
		// do it
	
			var xul = new XUL('Spreadsheet edit')
				.setXML('<label value="Click OK to export selected item properties to spreadsheet" width="200" flex="1"/><spacer />')
				.show(accept);
				
	}
	else
	{
		alert('You need to select some library items before running this script');
	}
	
	

