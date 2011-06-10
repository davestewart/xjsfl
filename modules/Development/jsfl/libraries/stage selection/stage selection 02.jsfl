
xjsfl.init(this);

//FLBridge.xjsfl.classes.restore('ElementCollection');



//clear();

/*
	layers
		:selected
		0
		0-5
		name
		type :normal :guide :guided :mask :masked :folder
		:locked :visible
		[attribute=value]
		
		
	frames
		:selected
		0
		0-5
		index
		keyframe
		type
		:empty 
		
	elements
		:selected
		0
		0-5
		name
		type :movieclip :graphic :button :symbol :shape
		:Class
		[attribute=value]
		:within()
	
*/

//@TODO
/*

Add :not() type to all filters
Try to make filters global
Remember that frame indices are 1 less than frame numbers
Add labelled functions to the Event class

look at sizzle prefilter - perhaps set variables like RegExps there?

FrameCollection
.select()

$(':frames').find(':elements');
$(':frames(0-5) :movieclips')

$(':layers(1-5):frames(:sound):elements(:movieclip|stuff)')

[':bitmap', ':graphic', ':button'].forEach(function(e, i) { $$(e).moveTo('assets/' + i + ' - ' + e + 's') } );



*/

function collect(arrIn, property)
{
	var arrOut = [];
	for(var i = 0; i < arrIn.length; i++)
	{
		trace(arrIn[i])
		arrOut[i] = arrIn[i][property];
	}
	return arrOut;
}

/**
 * Returns an array or frame arrays, rather than one long array
 * @param	layerIndex	
 * @returns		
 * @author	Dave Stewart	
 */
function getFrames(layerIndex)
{
	var temp		= [];
	var timeline	= fl.getDocumentDOM().getTimeline();
	var layer		= timeline.layers[layerIndex];
	var frames		= layer.frames;
	for(var i = 0; i < frames.length / 3; i++)
	{
		temp[i] = frames.slice(i * 3, (i * 3) + 3)
	}
	return temp;
}

function getKeyframes(layerIndex)
{
	var layer		= fl.getDocumentDOM().getTimeline().layers[layerIndex];
	var frames		= layer.frames;
	var keyframes	= [];;
	
	for (i = 0; i < frames.length; i++)
	{
		if (i == frames[i].startFrame)
		{
			keyframes.push(frames[i]);
		}
	}
	
	return keyframes;
}

/**
 * Gets the elements at the requested frame
 * @param		
 * @returns		
 * @author	Dave Stewart	
 */
getElements = function(frameIndex, selected)
{
	var frames		= [];
	var elements	= [];
	var timeline	= fl.getDocumentDOM().getTimeline();
	var layers		= selected ? timeline.getSelectedLayers() : timeline.layers;
	frameIndex		= frameIndex || timeline.currentFrame;
	
	//trace('frameIndex:' + frameIndex);
	
	for(var i = 0; i < layers.length; i++)
	{
		var layer = layers[i];
		var keyframes = getKeyframes(i);
		//fl.trace(layer.name);
		for(var j = 0; j < keyframes.length; j++)
		{
			var frame = keyframes[j];
			//fl.trace(frame.startFrame);
			if(frame.startFrame <= frameIndex && frame.startFrame + frame.duration >= frameIndex)
			{
				frames.push(frame);
				elements = elements.concat(frame.elements);
			}
		}
	}
	
	return new ElementCollection(elements);
}

$ = function(selector)
{
	return getElements();
}

	//var collection = new ElementCollection();
	//trace(collection)

	/**
	 * @type {ElementCollection}
	 */
		$()
		.randomize({rotation:40})
		.select();
	
	
	
/*
	var names = collect(elements, 'symbolType')
	fl.trace('>' + elements);
	
	
	document.selection = elements;
	document.livePreview = true;
	
	
	var timeline = dom.getTimeline();
	var layers = timeline.getSelectedLayers();
	trace(layers);
	
*/
try{
	
}
catch(err)
{
	xjsfl.output.error(err);
}