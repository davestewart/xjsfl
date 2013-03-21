/**
 * Export the items to a spreadsheet for mass editing, then import again once saved
 * @icon {iconsURI}ui/table/table_edit.png
 */

// object

	SpreadsheetEdit =
	{
		// --------------------------------------------------------------------------------
		// properties

			items:null,

			file:null,

			modified:null,

			xul:null,

		// --------------------------------------------------------------------------------
		// functions

			exportCSV:function()
			{
				// create file
					var uri			= URI.toURI('//user/temp/spreadsheet-edit.csv');
					this.file		= new File(uri, true);

				// grab keys and filter
					var ignore		= 'constructor,timeline,sourceFilePath,scalingGridRect,itemName,sourceLibraryName,linkageImportForRS,linkageIdentifier,quality'.split(',');
					var keys		= Utils.getKeys(this.items);
					keys			= keys.filter(function(key){return ignore.indexOf(key) === -1});

				// reorder keys, with path, then name, so user can easily rename items
					var index		= keys.indexOf('name');
					keys.splice(index, 1);
					keys			= ['name', 'name'].concat(keys);

				// grab rows
					var rows		= Utils.getValues(this.items, keys);

				// update header
					keys[0]			= 'original item';
					var str			= keys.join(',') + '\n';

				// create CSV content
					for each(var row in rows)
					{
						row[1]	= row[1].split('/').pop();
						str		+= '"' + row.join('","') + '"\n';
					}

				// save to file
					var state		= this.file.write(str, false);
					this.modified	= this.file.modified;

				// open excel
					if(state)
					{
						if(this.xul.controls.excel.value)
						{
							this.file.run();
						}
					}
					else
					{
						alert("The file couldn't be written. If it's still open in Excel, close it first then try again.");
					}

			},

			importCSV:function()
			{
				// only import if file has been created
					if( ! this.file )
					{
						alert('You need to export properties before importing them again.');
						return false;
					}

				// only import if file has been saved
					if(this.file.modified == this.modified)
					{
						alert('The Excel file needs to be saved before importing.');
						return false;
					}

				// update modified
					this.modified	= this.file.modified;

				// get file contents
					var lines		= this.file.contents.split(/[\r\n]+/g);
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
										trace(item.name, key, value, Utils.parseValue(value));
										try
										{
											item[key] = Utils.parseValue(value);
										}
										catch(error)
										{
											trace(error);
										}
									}
							}
							
						// update the item
							document.library.updateItem(path);
					}

				// prompt
					alert('The items in the library have been updated!');
					return true;
			},

		// --------------------------------------------------------------------------------
		// main

			open:function()
			{
				this.items = UI.items;
				if(this.items)
				{
					// ui
						var ui = 
						<ui>
							<label flex="1" width="370" value="This script exports the values of the selected objects to a CSV file, which is then opened in Excel for easy editing. Once edited, just click 'Import' to update the selected objects with the new values."/>
							<spacer />
							<label value="IMPORTANT: Ensure Excel is open before exporting values." flex="1" />
							<spacer />
							<separator />
							<hbox>
								<button id="export" label="1: Export" width="120" />
								<button id="import" label="2: Import" width="120" />
								<button id="cancel" label="3: Close" width="120" />
							</hbox>
						</ui>

					// build UI
						this.xul = new XUL('Spreadsheet Edit')
							.setButtons('')
							.setTitle('Spreadsheet Edit (' +this.items.length+ ' items)')
							.setXML(ui)
							.addCheckbox('Open exported file in Excel', 'excel', {checked:true})
							.setEventScope(this)
							.addEvent('export', 'click', this.exportCSV)
							.addEvent('import', 'click', this.importCSV)
							.addEvent('cancel', 'click', fl.xmlui.cancel)

					// show ui
						this.xul.show();
				}

			}

	}

// start
	xjsfl.init(this);
	SpreadsheetEdit.open();
