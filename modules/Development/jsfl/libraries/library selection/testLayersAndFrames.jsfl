

	function testLayersAndFrames(item, layerCallback, frameCallback)
	{
		// variables
			var i, j, layer, frame, state = false;
			
		// loop
			for(i = 0; i < item.timeline.layers.length; i++)
			{
				// layer
					layer = item.timeline.layers[i];
					
				// callback
					if(layerCallback && layerCallback(layer, i, item.timeline.layers))
					{
						return true;
					}
					
				// frames
					if(frameCallback)
					{
						for(j = 0; j < layer.frames.length; j++)
						{
							// frame
								frame = layer.frames[j];
								
							// keyframe / callback
								if(j == frame.startFrame && frameCallback(frame, j, layer.frames, layer, i))
								{
									return true;
								}
						}
					}
			}
			
		// return
			return false;
	}
					
