xjsfl.init(this);
clear();

/**
 * Converts elements on stage to items in the library
 * @icon {iconsURI}filesystem/folder/folder_page.png
 * 
 * Features:
 *
 *   Conversion:
 *     - Processes by elements or layers
 *     - Creates movieclips, graphics, or buttons
 *     - Optionally converts shapes and sub-shapes
 *     - Optionally converts existing symbols
 *     - Retains original stage selection
 *     
 *   Creation:
 *     - Intelligent naming (Drawing Object 01, 02, 03, Text 01, 02, 03, etc)
 *     - Optionally prompt for names
 *     - Optionally skip elements
 *     - Creates items in currently-chosen library folder, or supplied alternative
 *     - Optionally create subfolders per layer
 *     - Optionally names stage instances (in camelCase)
 *
 */
(function(){
	
	// --------------------------------------------------------------------------------
	// Utilities
	
		function getType(element)
		{
			switch(element.elementType)
			{
				case 'shape':
					var names =
					{
						isGroup				:'Group',
						isOvalObject		:'Oval',
						isRectangleObject	:'Rectangle',
						isDrawingObject		:'Drawing Object'
					}
					for(var name in names)
					{
						if(element[name]) return names[name];
					}
					return 'Shape';
				break;
			
				case 'instance':
					return element.symbolType.toTitleCase(true);
				break;
			}
			return element.elementType.toTitleCase(true);
		}
		
		function getElements(layer)
		{
			return layer.frames[$timeline.currentFrame].elements;
		}
		
	// --------------------------------------------------------------------------------
	// Conversion function
	
		function convertElement(element)
		{
			if(element)
			{
				// skip symbols if selected
					if(element.elementType == 'instance' && ! options.includeSymbols)
					{
						return;
					}
					
				// select
					$selection = element;
					dom.update();
					
				// return if there's no selection (we can't select the shape unless it is passed in via a frame reference; looks like a bug in Flash)
					if($selection.length == 0)
					{
						return;
					}
					
				// generate name
					var type		= getType(element);
					var count		= counts[type] || 1;
					var name		= type + ' ' + count.pad(options.numberPadding);
					if(options.promptForName)
					{
						name = prompt('Name this item, or Cancel to skip', name);
						if( ! name )
						{
							return;
						}
					}
					counts[type] = count + 1;
					
				// create item
					dom.convertToSymbol(options.convertTo, name, 'center');
					instances.push($selection[0]);
					
				// move item
					var libraryPath = options.libraryPath;
					if(libraryPath)
					{
						if(options.useSubfolders && options.process == 'layer')
						{
							libraryPath += '/' + options.subFolder;
							$library.newFolder(libraryPath)
						}
						$library.moveToFolder(libraryPath, name);
					}
					
				// update names
					names.push(libraryPath + '/' + name);
					
				// name instance
					if(options.nameInstances)
					{
						$selection[0].name = name.toCamelCase();
					}
			}
		}
		
	// --------------------------------------------------------------------------------
	// Processing functions
	
		function processElements(elements)
		{
			if(options.includeShapes)
			{
				// create a new movieclip in which to do our conversion
					dom.convertToSymbol('graphic', '__temp__', 'center');
					dom.enterEditMode('inPlace');
					dom.distributeToLayers();
					
				// loop through the layers, and converting elements
					var timeline = document.getTimeline();
					for (var i = 1; i < timeline.layers.length; i++)
					{
						convertElement(timeline.layers[i].frames[0].elements[0])
					}
					
				// return to the parent timeline
					dom.exitEditMode();
					dom.breakApart();
					$library.deleteItem('__temp__');
					instances = instances.concat($selection);
			}
			else
			{
				for each(var element in elements)
				{
					convertElement(element);
				}
			}
		}
		
		function processLayers()
		{
			// variables
				var timeline	= $timeline;
				var frames		= timeline.selectedFrames;
				var indices		= Utils.getValues(frames, 'index', true);
				
			// loop over layer indices
				var index, layer, elements;
				for (var i = 0; i < indices.length; i++)
				{
					// variables
						index				= indices[i];
						layer				= timeline.layers[index];
						elements			= getElements(layer);
						options.subFolder	= layer.name;
						
					// set layer and selection
						$timeline.setSelectedLayers(index, true);
						$selection			= elements;
						
					// process
						processElements(elements);
				}
		}
		
		function processSelection()
		{
			if($selection.length)
			{
				processElements($selection);
			}
		}
		
	// --------------------------------------------------------------------------------
	// Main code
		
		function onAccept(process, convertTo, includeOptions, namingOptions, libraryPath, useSubfolders)
		{
			// parameters
				options.process			= process.match(/^\w+/).pop().toLowerCase();
				options.convertTo		= convertTo.toLowerCase();
				options.includeShapes	= includeOptions.indexOf('Shapes') > -1;
				options.includeSymbols	= includeOptions.indexOf('Symbols') > -1;
				options.promptForName	= namingOptions.indexOf('Prompt for names') > -1;
				options.nameInstances	= namingOptions.indexOf('Name stage instances') > -1;
				options.libraryPath		= libraryPath;
				options.useSubfolders	= useSubfolders;
				options.numberPadding	= String($selection.length).length;
				
			// code
				if(options.libraryPath)
				{
					$library.newFolder(options.libraryPath);
				}
				options.process == 'element' ? processSelection() : processLayers();
				$selection = instances;

		}
		
	// --------------------------------------------------------------------------------
	// Main code
	
		// parameters
			var dom			= $dom;
			var names		= [];
			var instances	= [];
			var counts		= {};
			var options		=
			{
				process			:'',
				convertTo		:'',
				includeShapes	:false,
				includeSymbols	:false,
				promptForName	:false,
				nameInstances	:false,
				numberPadding	:2,
				libraryPath		:'',
				subFolder		:'',
				useSubfolders	:false
			};
			
		// debug
			//dom.selectAll();

		// code
			if(UI.dom && UI.selection)
			{
				var item	= $library.getItems(true).shift();
				var folder	= (item
								? item.itemType == 'folder'
									? item.name
									: item.name.indexOf('/') > -1
										? item.name.replace(/\/[^\/]+$/, '')
										: ''
								: '') || 'Converted Items';
					
			// ui
				var xul = XUL
					.factory([
							  'title:Convert Elements to Library Items',
							  'columns:[120,200]',
							  'radios:Process by=[Element, Layer]',
							  'radios:Convert to=[Movie Clip,Graphic,Button]',
							  'checkboxes:Include=[Shapes,Symbols]',
							  'checkboxes:Naming=[Prompt for names,Name stage instances]',
							  'text:Create in folder=' + folder,
							  'checkbox:Create subfolder per layer'
							  ].toString())
					.setValue('options', [true,true,true])
					.show(onAccept);
			}

})();

