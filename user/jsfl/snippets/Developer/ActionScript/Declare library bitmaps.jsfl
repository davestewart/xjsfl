/**
 * Creates AS3 declarations for bitmaps in the library
 */
(function()
{
	// setup
		xjsfl.init(this);

	// onAccept
		function onAccept(selectedOnly, rename, userPackageName, columnize)
		{
							alert(userPackageName)
			// callback
				/**
				 * Processes items
				 * @param		{Item}		item			The item to process
				 * @param		{Number}	index			The index of the interation
				 * @param		{Array}		elements		The items being processed
				 */
				function process(item, index, elements)
				{
					// variables
						var varName, className, packageName;
						
					// update item export properties
						if(rename)
						{
							varName					= item.itemName.replace(/\.\w+$/, '').toCamelCase();
							className				= varName.toSentenceCase();
							packageName				= userPackageName.replace(/\.?$/, '.');
							item.linkageExportForAS	= true;
							item.linkageClassName	= packageName + className;

						}
						else
						{
							if( ! item.linkageClassName)
							{
								skipped.push(item.name);
								return;
							}
							className				= item.linkageClassName.split('.').pop();
							packageName				= item.linkageClassName.replace(className, '');
							varName					= className.fromCamelCase().toCamelCase();
						}
		
					// get bitmap size				
						$library.addItemToDocument(new Point(), item.name);
						var bounds	= new Bounds($selection);
						var width	= bounds.width || 0;
						var height	= bounds.height || 0;
						$dom.deleteSelection();
						
					// output
						output += 'var {varName}	:Bitmap	= new Bitmap(new {packageName}{className}({width}, {height}));\n'.inject(varName, packageName, className, width, height);
				}
				
			// checks
				if( ! selectedOnly && rename && ! confirm('Are you sure you want to update *all* bitmap class names in the library to "' +(packageName ? packageName + '.' : '')+ 'BitmapName" ?'))
				{
					return;
				}
				
			// do it
			
				// parameters
					packageName		= packageName || '';
					
				// variables
					var output		= '';
					var selector	= ':bitmap' + (selectedOnly ? ':selected' : '');
					var collection	= $$(selector);
					var skipped		= [];
					
				// output
					if(collection.elements.length > 0)
					{
						// setup
							clear();
							$timeline.addNewLayer();
							
						// hack - it appears that adding items to stage invalidates library item selection, so we need to store this here
							var selected	= $$(':selected');
							
						// do it
							collection.each(process);
							
						// output
							if(packageName && output)
							{
								trace('import ' + packageName + '*;\n');
							}
							trace(columnize ? Utils.columnizeText(output, 1) : output.replace(/\t/g, ' '));
							
					// cleanup
						$timeline.deleteLayer();

						selectedOnly ? selected.select() : collection.select();
					}
					else
					{
						trace('No bitmaps were found or selected for declaration.');
					}
					
				// report skipped items
					if(skipped.length)
					{
						trace('WARNING: The following items were skipped, as their export paths were not set:\n');
						trace(' > ' + skipped.join('\n > '));
					}
					
		}

	// delete
		if(UI.dom)
		{
			var packageName = 'assets.bitmaps.data';
			XUL.create('title:Create Bitmap definitions,columns:[100, 150],radios:Bitmaps={Selected:true, All:false},radios:Naming={Use current class names:false, Rename classes from item:true},text:Package=' +packageName + ',checkbox:Columnize results=true', onAccept)
		}
})()
