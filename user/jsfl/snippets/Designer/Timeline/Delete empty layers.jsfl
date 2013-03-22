/**
 * Deletes empty layers
 * @icon {iconsURI}feedback/bin/bin.png
 */
(function()
{
	// variables
		var layers = $timeline.layers;
		
	// loop over layers
		for (var i = layers.length - 1; i >= 0 ; i--)
		{
			// loop over frames
				var layer = layers[i];
				for (var j = 0; j < layer.frames.length; j++)
				{
					// variables
						var state = false;
						var frame = layer.frames[j];
						
					// test frame to see if it should be saved
						if(frame.startFrame == j)
						{
							if(frame.elements.length > 0 || frame.actionScript.replace(/^(/s+|/s+)$/g, '') !== '' || frame.labelType !== 'none' || frame.name !== '' || frame.soundLibraryItem)
							{
								state = true;
								break;
							}
						}
				}
				
			// if state is true, delete the layer
				if( ! state )
				{
					format('Deleting layer {layer}', layer.name);
					$timeline.deleteLayer(i);
				}
		}
	
	
})()
