var library		= fl.getDocumentDOM().library;
var index		= library.findItemIndex("Folder 1/MovieClip 1");
var item		= library.items[index];


function testLayersAndFrames(item, layerCallback, frameCallback)
{
	// variables
		var layer, frame, state = false;
		
	// loop
		for(var i = 0; i < item.timeline.layers.length; i++)
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
					for(var j = 0; j < layer.frames.length; j++)
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

function testLayer(layer, index, layers)
{
	//fl.trace('Layer: ' + [layer, index]);
}

/**
 * 
 * @param	layer	{Layer}
 * @param	frame	{Frame}
 * @param	index	
 * @param	frames	
 * @returns		
 * @author	Dave Stewart	
 */
function testFrame(frame, index, frames, layer, layerIndex)
{
	/*
	fl.trace([
							layer.name + ':' + index,
							frame.soundLibraryItem != null,
							frame.tweenType
						].join(' | '));
	*/
	//return frame.actionScript != '';
	//return frame.tweenType != 'none';
	//return frame.soundLibraryItem != null;
}

fl.outputPanel.clear();
//fl.trace(testLayersAndFrames(item, testLayer, testFrame));

/**
 * @type {Item}
 */
var item = library.getSelectedItems()[0];

fl.trace(item.linkageBaseClass)



/*
function log(element)
{
	//trace(element);
	var value = element['something']
}

function testLayersAndFrames(timeline, layerCallback, frameCallback)
{
	// variables
		var i, j, layer, frame, state = false;
		
	// loop
		for(i = 0; i < timeline.layers.length; i++)
		{
			// layer
				layer = timeline.layers[i];
				
			// callback
				if(layerCallback && layerCallback(layer, i, timeline.layers))
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
				


Timer.start();
for(var i = 0; i < 1000; i++)
{
	xjsfl.iterators.layers(null, log, log)
}
Timer.stop(true);	

var timeline = fl.getDocumentDOM().getTimeline();
Timer.start();
for(var i = 0; i < 1000; i++)
{
	testLayersAndFrames(timeline, log, log)
}
Timer.stop(true);	


*/