/**
 * Creates AS3 declarations for bitmaps in the library
 */
(function()
{
	// setup
		xjsfl.init(this);
		clear();

	// onAccept
		function onAccept(packageName, renameClasses, selectedOnly)
		{
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
						var varName, className;
						
					// update item export properties
						if(renameClasses)
						{
							varName					= item.shortName.replace(/\.\w+$/, '').toCamelCase();
							className				= varName.toSentenceCase();
							item.linkageExportForAS	= true;
							item.linkageClassName	= packageName + className;
						}
						else
						{
							if( ! item.linkageClassName)
							{
								return;
							}
							className				= item.linkageClassName.split('.').pop();
							packageName				= item.linkageClassName.replace(className, '');
							varName					= className.fromCamelCase().toCamelCase();
						}
		
					// rename item
						if(renameItem)
						{
							item.name = className;
						}
						
					// get bitmap size				
						$library.addItemToDocument(new Point(), item.name);
						var bounds	= new Bounds($selection);
						var width	= bounds.width || 0;
						var height	= bounds.height || 0;
						$dom.deleteSelection();
						
					// output
						format('var {varName}	:Bitmap	= new Bitmap(new {packageName}{className}({width}, {height}));', varName, packageName, className, width, height);
				}

			// checks
				if( ! selectedOnly && ! confirm('Do you really want to update all bitmaps in the library?'))
				{
					return;
				}
				
			// do it
			
				// setup
					clear();
					$timeline.addNewLayer();
					
				// parameters
					packageName		= packageName || '';
					
				// variables
					var renameItem	= false;
					var selector	= ':bitmap' + (selectedOnly ? ':selected' : '');
					var collection	= $$(selector);
					
				// hack - it appears that adding items to stage invalidates library item selection, so we need to store this here
					var selected	= $$(':selected');
					
				// output
					if(collection.elements.length > 0)
					{
						if(packageName)
						{
							trace('import ' + packageName + '*;\n');
						}
						collection.each(process)
					}
					
				// cleanup
					$timeline.deleteLayer();
					selected.select();
					
		}

	// delete
		if(UI.dom)
		{
			var packageName = 'assets.bitmaps.data.';
			XUL.create('title:Create Bitmap definitions,text:Package Name=' +packageName+ ',checkbox:Rename classes=true,checkbox:Selected Only=true', onAccept)
		}
})()
