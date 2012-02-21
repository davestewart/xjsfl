/**
 * Renames elements correctly across frames to ensure that they are accessible from actionscript
 * @icon {iconsURI}Objects/object/object_wand.png
 */
(function()
{
	// --------------------------------------------------------------------------------
	// callbacks
	
		/**
		 * Frame callback
		 * @param	{Layer}	frame	The frame
		 */
		function processLayer(layer)
		{
			// check if only selected layers should be processed
				var selected = selectedLayers.indexOf(layer) !== -1;
				if(selectedOnly)
				{
					if(! selected)
					{
						return false;
					}
				}
				
			// variables
				currentLayer	= layer;
				currentName		= null;
				
			// feedback
				format('\n ~ Processing layer "{layer}"...', layer.name);
		}
		
		/**
		 * Frame callback
		 * @param	{Frame}	frame	The frame
		 */
		function processFrame(frame)
		{
			// skip frame if there is more than one element, or the frame isn't animated
				if( (animatedOnly && frame.tweenType !== 'motion') || frame.elements.length > 1 )
				{
					return false;
				}
				
			// otherwise, process if there is an element to process
				var element = frame.elements[0];
				if(element)
				{
					// determine the currentName
						if(currentName === null)
						{
							if(element.elementType == 'instance')
							{
								currentName = Utils[renameStyle](renameType == 'element' ? frame.elements[0].name : currentLayer.name);
								format('   @ Using "{currentName}" as element name', currentName);
							}
							else
							{
								return false;
							}
						}
					
					// rename element
						if(element && element.name !== currentName)
						{
							trace('   @ Renaming element on frame ' + (frame.startFrame + 1));
							element.name = currentName;
						}
				}
		}
		
		function onAccept(type, style, options)
		{
			// feedback
				clear();
				trace('\nRenaming elements...');
				
			// variables
				renameType		= type;
				renameStyle		= style;
				selectedOnly	= options.indexOf('Only selected layers') !== -1;
				animatedOnly	= options.indexOf('Only animated layers') !== -1;
				selectedLayers	= $timeline.selectedLayers;

			// process				
				Iterators.layers(Context.create(), processLayer, processFrame);	
		}
		
	// --------------------------------------------------------------------------------
	// code
	
		// init
			xjsfl.init(this);
			
		// globals
			var selectedLayers, currentLayer, currentName, renameType, renameStyle, animatedOnly;
			
		// start
			XUL
				.factory('title:Propgate element names across frames')
				.addRadiogroup('Rename using', 'type', {'First element name':'element', 'Layer name':'layer'})
				.addRadiogroup('Style', 'style', {'camelCase':'camelCase', 'under_score':'underscore'})
				.addCheckboxgroup('Options', 'options', ['Only selected layers', 'Only animated layers'])
				.show(onAccept);
})()

