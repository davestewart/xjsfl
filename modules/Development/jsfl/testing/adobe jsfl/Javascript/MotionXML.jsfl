///////////////////////////////////////////////////////
// ERROR STRINGS FOR LOCALIZATION

CopyMotionErrorStrings = {};
CopyMotionErrorStrings.FOLDER_LAYER = 'This layer is a folder. To copy motion, select frames on a layer with content.';
CopyMotionErrorStrings.GUIDE_LAYER = 'To copy motion with a motion guide, select the animation \non the guided layer, rather than the motion guide.\nThe motion guide will be copied automatically with the animation.';
CopyMotionErrorStrings.MULTIPLE_SPANS = 'Multiple spans of frames are selected. \nTo copy motion, select a continuous span of frames on one layer.';
CopyMotionErrorStrings.NO_CONTENT = 'For copy motion, the first selected frame should have content.';
CopyMotionErrorStrings.SAVE_ERROR = 'An error occured while trying to store the motion on disk.';
CopyMotionErrorStrings.NO_OBJECTS = 'There are no objects on frame {1}.';
CopyMotionErrorStrings.MULTIPLE_OBJECTS = 'There is more than one object on frame {1}.';
CopyMotionErrorStrings.NO_CONTAINER = 'The shape on frame {1} has no container. \nTo copy motion, convert it to a symbol or group.';


PasteMotionErrorStrings = {};
PasteMotionErrorStrings.NO_SELECTION = 'Nothing is selected. To paste motion, select an object on stage.';
PasteMotionErrorStrings.MULTIPLE_SPANS = 'Multiple spans of frames are selected. \nTo paste motion, select a continuous span of frames on one layer.';
PasteMotionErrorStrings.NO_OBJECTS = 'There are no objects on frame {1}.';
PasteMotionErrorStrings.MULTIPLE_OBJECTS = 'There is more than one object on frame {1}.';

////////////////////////////////////////////////////////

MotionXMLExporter = function() 
{
	this.xml = '';

	this.startX = 0;
	this.startY = 0;
	
	this.positionX = 0;
	this.positionY = 0;
	this.positionXOld = this.positionX;
	this.positionYOld = this.positionY;
	
	
	this.scaleX = 1;
	this.scaleY = 1;
	this.scaleXOld = this.scaleX;
	this.scaleYOld = this.scaleY;
	this.blendModeOld = 'normal';
	this.colorModeOld = 'none';
	
	this.skewX = 0;
	this.skewY = 0;
	this.skewXOld = this.skewX;
	this.skewYOld = this.skewY;
	
	this.sourceXML = '';
	
	this.useWhiteSpace = true;
	this.dom = null;
	this.timeline = null;
	this.layerIndex = -1;
	this.layer = null;
	this.startFrameIndex = -1;
	this.endFrameIndex = -1;
	this.duration = 0;
	this.hasMultipleCustomEase = false;
	
}

MotionXMLExporter.prototype.BlurFilter = 
{
	  blurX:"number"
	, blurY:"number"
	, quality:"number"
}

MotionXMLExporter.prototype.GlowFilter = 
{
	  alpha:"number"
	, blurX:"number"
	, blurY:"number"
	, color:"string"
	, strength:"number"
	, quality:"number"   // JSFL gives 'low', 'medium', 'high
	, inner:"boolean"
	, knockout:"boolean"
}

MotionXMLExporter.prototype.DropShadowFilter = 
{
	  distance:"number"
	, angle:"number"
	, color:"string"
	, alpha:"number"
	, blurX:"number"
	, blurY:"number"
	, strength:"number"
	, quality:"number"
	, inner:"boolean"
	, knockout:"boolean"
	, hideObject:"boolean"
}

MotionXMLExporter.prototype.BevelFilter = 
{
	  distance:"number"
	, angle:"number"
	
	, highlightColor:"string"		// JSFL lumps color and alpha into one string; AS separates them
	, highlightAlpha:"number" 
	
	, shadowColor:"string"
	, shadowAlpha:"number"
	
	, blurX:"number"
	, blurY:"number"
	
	, strength:"number"
	, quality:"number"
	, type:"string"		// Valid values are "inner", "outer", and "full". The default value is "inner".
	, knockout:"boolean"

}


MotionXMLExporter.prototype.GradientGlowFilter = MotionXMLExporter.prototype.GradientBevelFilter =
{
	  distance:"number"
	, angle:"number"

	// these 3 names are used in XML and AS3
	, colors:"array"
	, alphas:"array"
	, ratios:"array"
	
	// these 2 names are used in JSFL; color and alpha are combined in JS filter.colorArray values
	, posArray:"array"  
	, colorArray:"array"  
	
	, blurX:"number"
	, blurY:"number"

	, strength:"number"
	, quality:"number"
	, type:"string"
	, knockout:"boolean"
}
 

MotionXMLExporter.prototype.AdjustColorFilter = 
{
	  brightness:"number"
	, contrast:"number"
	, saturation:"number"
	, hue:"number"
}


MotionXMLExporter.prototype.getXML = function(useWhiteSpace, forActionScript, startFrameIndex, endFrameIndex)
{
	this.useWhiteSpace = useWhiteSpace;
	this.forActionScript = forActionScript;
	
	this.m = '\t'; // indent
	this.n = '\n'; // newline character
	if (!this.useWhiteSpace) this.m = this.n = '';

	this.dom = fl.getDocumentDOM();
	this.timeline = this.dom.getTimeline();
	this.currentFrameOriginal = this.timeline.currentFrame;
	
	// use only the first region of selected frames; ignore the rest (i.e. non-contiguous selection)
	this.layerIndex = this.timeline.currentLayer; //this.selFramesArray[0];
	this.layer = this.timeline.layers[this.layerIndex];
	this.layerWasVisible = this.layer.visible;
	this.layer.visible = true;
	
	// getSelectedFrames() returns an array containing 3n integers, 
	// where n is the number of selected regions. 
	// The first integer in each group is the layer index, 
	// the second integer is the start frame of the beginning of the selection, 
	// and the third integer specifies the ending frame of that selection range. 
	// The ending frame is not included in the selection.
	
	this.selFramesArray = this.timeline.getSelectedFrames();
	this.startFrameIndex = startFrameIndex || this.selFramesArray[1];
	this.frame = this.layer.frames[this.startFrameIndex];
	
	// detect when the first selected frame is not a keyframe, and automatically extend the selection to the preceding keyframe
	if (this.frame && (this.frame.startFrame != this.startFrameIndex))
	{
		this.selFramesArray[1] = this.startFrameIndex = this.frame.startFrame;
		this.frame = this.layer.frames[this.startFrameIndex];
		
	}
	this.endFrameIndex = endFrameIndex || this.selFramesArray[2]; // The ending frame is not included in the selection.
	
	//// detect when a tween frame sequence is partially selected, and automatically extend the selection to the next keyframe	
	var finalFrameIndex = this.endFrameIndex - 1;
	var finalFrame = this.layer.frames[finalFrameIndex];
	if (finalFrame)
	{
		var finalKeyframeIndex = finalFrame.startFrame;
		var finalKeyframe = this.layer.frames[finalKeyframeIndex];
		var finalKeyframeIsTweening = finalKeyframe.tweenType == 'motion';
		var framesPastFinalKeyframe = finalFrameIndex - finalKeyframeIndex;
		
		if (framesPastFinalKeyframe > 0 && finalKeyframeIsTweening)
		{
			var betterFinalKeyframeIndex = finalKeyframeIndex + finalKeyframe.duration;
			var betterFinalKeyframe = this.layer.frames[betterFinalKeyframeIndex];
			if (betterFinalKeyframe)
			{
				this.selFramesArray[2] = this.endFrameIndex = betterFinalKeyframeIndex + 1; 
			}
		}
	}
	
	this.duration = this.endFrameIndex - this.startFrameIndex;
	 
	if (this.layer.layerType == 'folder')
	{
		alert(CopyMotionErrorStrings.FOLDER_LAYER);
		return '';
	}
	else if (this.layer.layerType == 'guide')
	{
		alert(CopyMotionErrorStrings.GUIDE_LAYER);
		return '';
	}
	else if (this.selFramesArray.length > 3)
	{
		alert(CopyMotionErrorStrings.MULTIPLE_SPANS); 
		return '';
	}
	else if ((!this.selFramesArray.length && !this.dom.selection.length)
			|| this.startFrameIndex > this.layer.frameCount-1 
			|| !this.frame 
			|| !this.frame.elements.length)
	{
		alert(CopyMotionErrorStrings.NO_CONTENT);
		return '';
	}

	
	// A list of frames where there is a keyframe that is tweening under the control of a motion guide.
	// Note that if the initial keyframe is under a motion guide, the whole tween is controlled by it,
	// even if the rest of the frame sequence doesn't have the motion guide graphics.
	this.guidedTweenKeyframes = [];
	// A list of frames that should not have tweens in XML when motion guide is keyframed out.
	this.guidedFrames = [];
	
	// If there is a motion guide on this layer, convert it all to keyframes
	// so we can grab the values from them.
	// There is logic here to handle cases where some of the animation uses the motion guide and some does not.
	if (this.layer.layerType == 'guided')
	{
		if (this.forActionScript)
		{
			this.guidedTweenKeyframes = getGuidedTweeningKeyframeIndices(this.layer, this.startFrameIndex, this.endFrameIndex);
			
			// This loop has redundancies sometimes, but is necessary because 
			// we could have spans of hold (non-tweening) frames in the middle
			for (var tfi=0; tfi<this.guidedTweenKeyframes.length; tfi++)
			{
				if (!this.guidedTweenKeyframes[tfi])
					continue;
					
				var tweeningFrameIndex = tfi;
				var tweeningKeyframe = this.layer.frames[tweeningFrameIndex];
				
				// Workaround for Flash convertToKeyframes bug with connected tweens--we have to keyframe the connected
				// chain of tweens all at once, otherwise the results are incorrect.
				var lastFrameIndex = tweeningFrameIndex; //+tweeningKeyframe.duration;
				var lastFrame = this.layer.frames[lastFrameIndex];

				while (lastFrame 
					   && lastFrame.tweenType == 'motion' 
					   && this.guidedTweenKeyframes[lastFrameIndex])
				{
					var nextFrameIndex = lastFrameIndex + lastFrame.duration;
					// avoid the case where the last frame of the layer has a motion tween on it,
					// in which case it has a duration of 1, but there is no keyframe after it
					if (this.layer.frames[nextFrameIndex])
					{
						lastFrameIndex = nextFrameIndex;
						lastFrame = this.layer.frames[lastFrameIndex];
					}
					else
					{
						break;
					}
				}

				if (lastFrameIndex > tweeningFrameIndex+1)
				{
					this.timeline.convertToKeyframes(tweeningFrameIndex+1, lastFrameIndex);
				}
				for (var gfi=tweeningFrameIndex; gfi<lastFrameIndex; gfi++)
				{
					this.guidedFrames[gfi] = true;
				}
			}
			
		}
		else
		{
			// If we're doing an immediate copy and paste, not to save in a file, 
			// we copy the frames of the motion guide layer to memory with timeline.copyFrames().
			this.parentLayer = this.layer.parentLayer;
			this.parentLayerIndex = -1;
			// find the index of the parent layer
			for (var li=0; li<this.timeline.layers.length; li++)
			{
				var theLayer = this.timeline.layers[li];
				if (theLayer == this.parentLayer && theLayer.layerType == 'guide')
				{
					this.parentLayerIndex = li;
					break;
				}
			}
			this.timeline.currentLayer = this.parentLayerIndex;
			this.timeline.setSelectedFrames([this.parentLayerIndex, this.startFrameIndex, this.endFrameIndex]);
			this.timeline.copyFrames(this.startFrameIndex, this.endFrameIndex);

			var guideStartFrame = this.parentLayer.frames[this.startFrameIndex];
			var guideStartElement = guideStartFrame.elements[0];
			
			if (guideStartElement)
			{
				this.guideLeft = guideStartElement.left;
				this.guideTop = guideStartElement.top;
			}
		}
	}
	
	
	// restore original frame selection
	this.timeline.currentLayer = this.layerIndex;
	this.timeline.currentFrame = this.currentFrameOriginal;
	this.timeline.setSelectedFrames(this.selFramesArray);
	
	
	// loop through selected frames and get xml for each keyframe
	for (var frameIndex = this.startFrameIndex; frameIndex < this.endFrameIndex; frameIndex++)
	{
		var frameXML = this.getFrameXML(frameIndex);
		this.xml += frameXML;
	}
	
	if (this.xml.length)
	{
		this.xml = '' 
			+ '<Motion duration="'+this.duration+'" xmlns="fl.motion.*" xmlns:geom="flash.geom.*" xmlns:filters="flash.filters.*">' 
			+ this.sourceXML 
			+ this.xml 
			+ this.n 
			+ '</Motion>';
	}

	// Motion guide: At this point we clear the keyframes we created.
	// In order to restore it completely to its original condition,
	// we stored a list of which keyframes were in the middle of the selection.
	if (this.layer.layerType == 'guided' && this.forActionScript)
	{
		for (var tfi=0; tfi<this.guidedTweenKeyframes.length; tfi++)
		{
			if (!this.guidedTweenKeyframes[tfi])
				continue;
			var tweeningFrameIndex = tfi;
			// find duration of the keyframe
			var tweeningKeyframe = this.layer.frames[tweeningFrameIndex];
			var keyframeDuration = this.guidedTweenKeyframes[tfi];
			// the keyframe could be immediately followed by another keyframe, in which case don't clear it
			if (keyframeDuration == 1)
				continue;
			var lastFrameIndex = tweeningFrameIndex + keyframeDuration;			
			this.timeline.clearKeyframes(tweeningFrameIndex+1, lastFrameIndex);
		}
	}
		
	// restore original frame selection
	this.timeline.setSelectedFrames(this.selFramesArray);
	this.timeline.currentFrame = this.currentFrameOriginal;
	
	this.layer.visible = this.layerWasVisible;	
	return this.xml;
}

getX = function(element)
{
	return roundToTwip(element.transformX);
}

getY = function(element)
{
	return roundToTwip(element.transformY);
}

setX = function(element, x)
{
	element.transformX = x;
}

setY = function(element, y)
{
	element.transformY = y;
}

MotionXMLExporter.prototype.setSourceXML = function()
{
	this.matrix = this.element.matrix;

	var n = this.n; var m = this.m;
	
	this.startX = getX(this.element);
	this.startY = getY(this.element);
	this.scaleXStart = getMatrixScaleX(this.matrix);
	this.scaleYStart = getMatrixScaleY(this.matrix);
	this.skewXStart = getMatrixSkewX(this.matrix);
	this.skewYStart = getMatrixSkewY(this.matrix);
	
	this.sourceXML = n + m + '<source>'
		+ n + m+m + '<Source'
		+ ' frameRate="'+this.dom.frameRate+'"';
	this.sourceXML += ' x="'+this.startX+'"';
	this.sourceXML += ' y="'+this.startY+'"';
	this.sourceXML += ' scaleX="'+this.scaleXStart+'"';
	this.sourceXML += ' scaleY="'+this.scaleYStart+'"';
		
		
	if (skewsAreEqual(this.skewXStart, this.skewYStart))
	{
		this.sourceXML += ' rotation="'+this.skewYStart+'"';
	}
	else
	{
		this.sourceXML += ' skewX="'+this.skewXStart+'"';
		this.sourceXML += ' skewY="'+this.skewYStart+'"'
	}
	
	var elementType = getElementType(this.element);
	this.sourceXML += ' elementType="' + elementType + '"';

	if (this.element.name)
		this.sourceXML += ' instanceName="' + this.element.name + '"';

	var libraryItem = this.element.libraryItem;
	if (libraryItem)
	{
		if (libraryItem.name)
			this.sourceXML += ' symbolName="' + libraryItem.name + '"';
		if (libraryItem.linkageIdentifier)
			this.sourceXML += ' linkageID="' + libraryItem.linkageIdentifier + '"';
		if (libraryItem.linkageClassName)
			this.sourceXML += ' class="' + libraryItem.linkageClassName + '"';
		if (libraryItem.linkageBaseClass)
			this.sourceXML += ' baseClass="' + libraryItem.linkageBaseClass + '"';
		//TODO: file bug on linkageBaseClass being blank when it's set to MovieClip
	}
	this.sourceXML += '>';
	
	//// find the object's normalized dimensions (i.e. without scaling or skewing)
	var transPoint = getTransformationPointForElement(this.element);
	var leftOriginal = this.element.left;
	var topOriginal = this.element.top;
	var xOriginal = getX(this.element);
	var yOriginal = getY(this.element);
	
	var identityMatrix = {a:1, b:0, c:0, d:1, tx:0, ty:0};
	this.element.matrix = identityMatrix; 
	if (elementType != 'text')
		setTransformationPointForElement(this.element, transPoint);
		
	var bb = this.indentCR(3) + '<dimensions>';
	bb += this.indentCR(4) + '<geom:Rectangle';
	bb += ' left="'+roundToTwip(this.element.left)+'"';
	bb += ' top="' +roundToTwip(this.element.top)+'"';
	bb += ' width="'+this.element.width+'"';
	bb += ' height="'+this.element.height+'"';
	bb += '/>';
	bb += this.indentCR(3) + '</dimensions>';
	this.sourceXML += bb; 
	
	var transXNormal = (this.element.transformX - this.element.left) / this.element.width;
	var transYNormal = (this.element.transformY - this.element.top) / this.element.height;

	this.sourceXML += this.indentCR(3) + '<transformationPoint>'
	this.sourceXML += this.indentCR(4) + '<geom:Point x="'+transXNormal+'" y="'+transYNormal+'"/>';
	this.sourceXML += this.indentCR(3) + '</transformationPoint>';

	// restore object to original matrix and position
	this.element.matrix = this.matrix;
	// this causes problems for text - Sept. 14 
	//TODO: file a bug 
	if (elementType != 'text')
		setTransformationPointForElement(this.element, transPoint);
	
	//this.element.left = leftOriginal;
	//this.element.top = topOriginal;
	setX(this.element, xOriginal);
	setY(this.element, yOriginal);
	
	if (this.layer.layerType == 'guided' && !this.forActionScript)
	{
		var guideLeftRelative = this.guideLeft - this.startX;//transPoint.x;//
		var guideTopRelative = this.guideTop - this.startY;//transPoint.y;//
		if (!isNaN(guideLeftRelative + guideTopRelative))
		{
			this.sourceXML += this.indentCR(3) + '<motionGuide>';
			this.sourceXML += this.indentCR(4) + '<MotionGuide left="'+guideLeftRelative+'" top="'+guideTopRelative+'"/>';
			this.sourceXML += this.indentCR(3) + '</motionGuide>';
		}
	}
	this.sourceXML += this.indentCR(2) + '</Source>';
	
	this.sourceXML += this.indentCR(1) + '</source>';
}// end setSourceXML()


getElementType = function(element)
{
	if (!element) return '';

	var elementType = '';
	var libraryItem = element.libraryItem;
	// element.elementType: "shape", "text", "instance", or "shapeObj"
	// item.itemType: "undefined", "component", "movie clip", "graphic", "button", "folder", "font", "sound", "bitmap", "compiled clip", "screen", and "video".
	switch (element.elementType)
	{
		case 'shape' : 
			//NOTE: a drawing object is both a group and a drawing object, so check it first
			elementType = element.isRectangleObject ? 'rectangle object'
						: element.isOvalObject ? 'oval object'
						: element.isDrawingObject ? 'drawing object'
						: element.isGroup ? 'group'
						: 'shape'; 
						break;
		case 'shapeObj' : elementType = 'shape object'; break;
		case 'text' : elementType = 'text'; break;
		case 'instance' : 
			if (element.symbolType)
				elementType = element.symbolType;
			else if (libraryItem.itemType && libraryItem.itemType != 'undefined')
				elementType = libraryItem.itemType;
			break;
	}
	return elementType;
}

roundToTwip = function(value)
{
	return Math.round(value*20) / 20;
}


// endFrameIndex is not included in the span
getKeyframeIndices = function(layer, startFrameIndex, endFrameIndex)
{
	var list = [];
	for (var frameIndex=startFrameIndex; frameIndex<endFrameIndex; frameIndex++)
	{
		var frame = layer.frames[frameIndex];
		var isFirstFrame = (frameIndex == startFrameIndex);
		var isKeyframe = (isFirstFrame || frame.startFrame == frameIndex);
		if (isKeyframe)
		{
			list[frameIndex] = true;
		}
	}
	
	return list;	
}

// endFrameIndex is not included in the selection (like other timeline JSAPIs)
getGuidedTweeningKeyframeIndices = function(layer, startFrameIndex, endFrameIndex)
{
	if (!layer)	return [];
	// find the index of the parent layer
	var parentLayerIndex = -1;
	var timeline = fl.getDocumentDOM().getTimeline();
	if (!timeline)	return [];
	for (var li=0; li<timeline.layers.length; li++)
	{
		var theLayer = timeline.layers[li];
		if (theLayer == layer.parentLayer && theLayer.layerType == 'guide')
		{
			parentLayerIndex = li;
			//fl.trace('found parentLayerIndex: ' + parentLayerIndex);
			break;
		}
	}
	var parentLayer = timeline.layers[parentLayerIndex];
	if (!parentLayer) return [];
	
	var list = [];
	// added the -1 to the for condition because there is no point in remembering whether the last frame is a keyframe,
	// and it contributes to a bug
	for (var frameIndex=startFrameIndex; frameIndex<endFrameIndex-1; frameIndex++)
	{
		var frame = layer.frames[frameIndex];
		if (!frame)
			continue;
			
		// first check that the frame is a keyframe
		var isFirstFrame = (frameIndex == startFrameIndex);
		var isKeyframe = (isFirstFrame || frame.startFrame == frameIndex);
		if (!isKeyframe) 
			continue;
		
		// now check that the keyframe has a motion tween
		var isTweening = frame.tweenType == 'motion';
		if (!isTweening)
			continue;
			
		// now check that the motion guide contains graphics at the same frame
		var parentFrame = parentLayer.frames[frameIndex];
		if (!parentFrame)
			continue;
			
		if (!parentFrame.elements.length)
			continue;		
		
		// now check that the tween has an existing ending keyframe
		var lastFrameIndex = frameIndex + frame.duration;
		var lastFrame = layer.frames[lastFrameIndex];
		if (!lastFrame)
			continue;
			
			
		list[frameIndex] = frame.duration;
	}
	
	return list;	
}

// returns an xml string <Keyframe ...
MotionXMLExporter.prototype.getFrameXML = function(frameIndex)
{
	this.frameIndex = frameIndex;
	this.frame = this.layer.frames[this.frameIndex];
	this.isFirstFrame = (this.frameIndex == this.startFrameIndex);
	if (!this.frame) 
	{
		var msg = CopyMotionErrorStrings.NO_OBJECTS.replace('{1}', (this.frameIndex+1));
		alert(msg);
		return '';
	}
	
	// we have to select the frame so the transformation point is read correctly
	selectFrameIndex(this.frameIndex);
	
	var n=this.n;
	var m=this.m;
	
	var isKeyframe = (this.isFirstFrame || this.frame.startFrame == this.frameIndex);
	if (!isKeyframe)
		return '';	
	
	if (!this.frame.elements.length && this.isFirstFrame)
	{
		var msg = CopyMotionErrorStrings.NO_OBJECTS.replace('{1}', (this.frameIndex+1));
		alert(msg);
		return '';
	}
	else if (this.frame.elements.length > 1)
	{
		var msg = CopyMotionErrorStrings.MULTIPLE_OBJECTS.replace('{1}', (this.frameIndex+1));
		alert(msg);
		return '';
	}
		
	// use the first element in the frame (by this point, we should have guaranteed there is only one anyway)
	this.element = this.frame.elements[0];
	if (this.element)
		this.matrix = this.element.matrix;
	else
		this.matrix = null;
	
	var elementType = getElementType(this.element);
	if (elementType == 'shape' || elementType == 'shape object')
	{
		var msg = CopyMotionErrorStrings.NO_CONTAINER.replace('{1}', (this.frameIndex+1));
		alert(msg);
		return '';
	}
	
	this.hasMultipleCustomEase = (this.frame.hasCustomEase && !this.frame.useSingleEaseCurve);
	
	if (this.isFirstFrame)
	{
		this.setSourceXML();
	}


	//////////////////////////// TWEEN ///////////////////////////////
	
	var keyframeTweenXML = '';
	var isTween = (this.frame.tweenType == 'motion');
	// if exporting a motion guide for AS, we're keyframing everything, so omit tweens
	var isGuidedKeyframe = this.guidedFrames[this.frameIndex];
	this.isTweening = isTween & !isGuidedKeyframe;
	
	if (this.isTweening)
	{
		keyframeTweenXML += this.indentCR(2) + '<tweens>';//this.getTweenHeaderXML(2);//
		
		// insert CustomEase if it has specific curve for color
		if (this.hasMultipleCustomEase)
		{
			var customEaseXML = '';
			
			var posCustomEasePts = this.frame.getCustomEase('position');
			customEaseXML += this.customEasePointsToXML(posCustomEasePts, 3, 'position');

			var scaleCustomEasePts = this.frame.getCustomEase('scale');
			customEaseXML += this.customEasePointsToXML(scaleCustomEasePts, 3, 'scale');

			var rotationPts = this.frame.getCustomEase('rotation');
			customEaseXML += this.customEasePointsToXML(rotationPts, 3, 'rotation');
			
			var colorPts = this.frame.getCustomEase('color');
			customEaseXML += this.customEasePointsToXML(colorPts, 3, 'color');
			
			var filtersPts = this.frame.getCustomEase('filters');
			customEaseXML += this.customEasePointsToXML(filtersPts, 3, 'filters');
			
			keyframeTweenXML += customEaseXML;
		}
		else if (this.frame.hasCustomEase && this.frame.useSingleEaseCurve)
		{
			var pts = this.frame.getCustomEase('all');
			keyframeTweenXML += this.customEasePointsToXML(pts, 3);
		}
		else
		{
			keyframeTweenXML += this.indentCR(3);
			keyframeTweenXML += '<SimpleEase ease="'+this.frame.tweenEasing/100+'"/>';
		}
		
		keyframeTweenXML += this.indentCR(2) + '</tweens>';
	}
	
		
	var keyframeXML = n+n+m 
		+ '<Keyframe'
		+ this.getKeyframePropertiesXML()
		+ this.getTransformXML()
	
	var childNodesXML = this.getColorXML() + keyframeTweenXML + this.getFiltersXML();
	
	// use shorthand tag closer if no child nodes
	if (childNodesXML)
		keyframeXML += '>' + childNodesXML + n+m + '</Keyframe>';
	else
		keyframeXML += '/>';

	this.positionXOld = this.positionX;
	this.positionYOld = this.positionY;
		
	this.scaleXOld = this.scaleX;
	this.scaleYOld = this.scaleY;
	
	this.skewXOld = this.skewX;
	this.skewYOld = this.skewY;
	
	return keyframeXML;
}

MotionXMLExporter.prototype.getTransformXML = function()
{
	if (!this.element) return '';
	
	var transformXML = '';

	this.positionX = getX(this.element) - this.startX;
	this.positionY = getY(this.element) - this.startY;

	if (!this.isFirstFrame 
		&& ((this.positionX != this.positionXOld)
		|| this.hasMultipleCustomEase))
	{
		transformXML += ' x="'+this.positionX+'"';
	}
		
	
	if (!this.isFirstFrame 
		&& ((this.positionY != this.positionYOld)
		|| this.hasMultipleCustomEase))
	{
		transformXML += ' y="'+this.positionY+'"';
	}
	
	////////////////// SCALE ////////////////////
	
	this.scaleX = getMatrixScaleX(this.matrix) / this.scaleXStart;
	this.scaleY = getMatrixScaleY(this.matrix) / this.scaleYStart;
		
	if ((this.scaleX != this.scaleXOld
		|| this.hasMultipleCustomEase))
	{
		transformXML += ' scaleX="'+this.scaleX+'"';
	}
		

	if ((this.scaleY != this.scaleYOld
		|| this.hasMultipleCustomEase))
	{
		transformXML += ' scaleY="'+this.scaleY+'"';
	}
	

	//////////// SKEW & ROTATION ////////////

	// extract rotation angles from the matrix coefficients
	this.skewX = getMatrixSkewX(this.matrix) - this.skewXStart;
	this.skewY = getMatrixSkewY(this.matrix) - this.skewYStart;
	
	// Need to check for changes in either angle because 
	// the previous frame could have been just one skew. 
	var skewHasChanged = (this.skewX != this.skewXOld 
		|| this.skewY != this.skewYOld
		|| this.hasMultipleCustomEase);
		
	// only write rotation or skew if the values have changed from previous keyframe
	if (skewHasChanged) 
	{
		if (!skewsAreEqual(this.skewX, this.skewY))
		{
			if (this.skewX != this.skewXOld)
			{
				transformXML += ' skewX="'+this.skewX+'"';
			}
			if (this.skewY != this.skewYOld)
			{
				transformXML += ' skewY="'+this.skewY+'"';
			}
		}
		else 
		{
			transformXML += ' rotation="'+this.skewY+'"';
		}
	}
	
	return transformXML;
}


MotionXMLExporter.prototype.getKeyframePropertiesXML = function()
{
	var s = '';
	s += ' index="'+(this.frameIndex-this.startFrameIndex)+'"';
	
	if (!this.element)
	{
		// default is false
		s += ' blank="true"';
	}
	
	var label = this.frame.name;
	if (label)
	{
		label = escapeForXML(label);
		s += ' label="'+label+'"';
	}
		
		
	if (this.isTweening)
	{
		var rotateDirection = 'auto';
		// default when XML attribute is omitted is AUTO 
		if (this.frame.motionTweenRotate == 'none')
			rotateDirection = 'none';
		else if (this.frame.motionTweenRotate == 'clockwise')
			rotateDirection = 'cw';
		else if (this.frame.motionTweenRotate == 'counter-clockwise')
			rotateDirection = 'ccw';
		
		if (rotateDirection != 'auto')
			s += ' rotateDirection="'+rotateDirection+'"';
			
			
		var rotateTimes = this.frame.motionTweenRotateTimes;
		if (rotateTimes != 0)
			s += ' rotateTimes="'+rotateTimes+'"';

			
		// default is false
		if (this.frame.motionTweenOrientToPath)
			s += ' orientToPath="true"'; 
			
		// default is true
		if (!this.frame.motionTweenScale)
			s += ' tweenScale="false"';		

			
		// default is false
		if (this.frame.motionTweenSnap)
			s += ' tweenSnap="true"';
	}

	// Workaround for bug #185170 - Flash renders the keyframe separator line for sync, even when there is no tween.
	// Always export the sync setting, even if there isn't a tween. This will ensure the pasted frames look the same as the source.
	// default is false
	if (this.frame.motionTweenSync)
		s += ' tweenSync="true"';
	
	
	if (this.element)
	{
		// blendMode attribute in XML is only present if not 'normal' mode 
		if (this.element.blendMode != null && this.element.blendMode != 'normal')
			s += ' blendMode="'+this.element.blendMode+'"'; //.toUpperCase()
			
		// cacheAsBitmap attribute in XML is only present if true 
		if (this.element.cacheAsBitmap)
			s += ' cacheAsBitmap="'+this.element.cacheAsBitmap+'"';
			
		if (this.element.symbolType == 'graphic')
		{
			// 'loop' is the default for loop
			if (this.element.loop != 'loop')
				s += ' loop="'+this.element.loop+'"';
			// 0 is the default for firstFrame
			if (this.element.firstFrame > 0)
				s += ' firstFrame="'+this.element.firstFrame+'"';
		}
	}
	
	return s;
}
  
MotionXMLExporter.prototype.customEasePointsToXML = function(pts, indentLevel, targetName)
{
	if (!pts || !pts.length) return '';
	if (!indentLevel) indentLevel = 0;
	if (!targetName) targetName = '';
	
	var customEaseXML = '';
	customEaseXML += this.indentCR(indentLevel);
	customEaseXML += '<CustomEase';
	if (targetName) 
		customEaseXML += ' target="'+targetName+'"';
		
	customEaseXML += '>';
	
	// the first and last points are always (0, 0) and (1, 1), so skip them
	for (var i=1; i<pts.length-1; i++) 
	{
		var pt = pts[i];
		var tagName = 'geom:Point';
		
		customEaseXML += this.indentCR(indentLevel+1);
		customEaseXML += '<'+tagName
			+' x="'+pt.x+'"'
			+' y="'+pt.y+'"'
			+'/>';
	}
	customEaseXML += this.indentCR(indentLevel);
	customEaseXML += '</CustomEase>';
	
	return customEaseXML;
}

customEaseXMLToPoints = function(customEaseXML)
{
	var pts = [{x:0, y:0}];
	var customEaseChildren = customEaseXML.children();
	for (var pi=0; pi<customEaseChildren.length(); pi++)
	{
		var pointXML = customEaseChildren[pi];
		var point = {};
		point.x = Number(pointXML.@x);
		point.y = Number(pointXML.@y);
		pts.push(point);
	}
	pts.push({x:1, y:1});
	return pts;
}


MotionXMLExporter.prototype.getColorXML = function()
{
	if (!this.element) return '';

	var colorMode = this.element.colorMode;
	if (!colorMode) 
		return '';
		
	// check for color changes from previous keyframe
	if (colorMode == this.colorModeOld)
	{
		if (colorMode == 'none' && 
			!this.hasMultipleCustomEase)
		{
			return '';
		}
		//TODO: also check if color elements like brightness have changed
	}
	
	var n = this.n; var m = this.m;
	var s = n + m+m;
	s += '<color>';
	s += n + m+m+m;
	s += '<Color';
	
	switch (colorMode)
	{
		case 'none': 
			s += ''; 
			break;
		case 'brightness': 
			s += ' brightness="'+(this.element.brightness/100)+'"';
			break;
			
		case 'tint':
			var tintColor = cleanColor(this.element.tintColor); 
			s += ' tintColor="'+tintColor+'"';
			s += ' tintMultiplier="'+this.element.tintPercent/100+'"';
			break;
			
		case 'alpha': 
			s += ' alphaMultiplier="'+this.element.colorAlphaPercent/100+'"';
			break;
			
		case 'advanced': 
			s += ' redMultiplier="'+this.element.colorRedPercent/100+'"';
			s += ' greenMultiplier="'+this.element.colorGreenPercent/100+'"';
			s += ' blueMultiplier="'+this.element.colorBluePercent/100+'"';
			s += ' alphaMultiplier="'+this.element.colorAlphaPercent/100+'"';

			s += ' redOffset="'+this.element.colorRedAmount+'"';
			s += ' greenOffset="'+this.element.colorGreenAmount+'"';
			s += ' blueOffset="'+this.element.colorBlueAmount+'"';
			s += ' alphaOffset="'+this.element.colorAlphaAmount+'"';

			break;
	}
	s += '/>';
	s += n + m+m;
	s += '</color>'; 
	
	this.colorModeOld = colorMode;
	return s;
}

cleanColor = function(colorStringFromJSFL)
{
	if (colorStringFromJSFL.substr(0, 2) == "'#")
	{
		colorStringFromJSFL = colorStringFromJSFL.substr(2, 6);
	}
	else if (colorStringFromJSFL.substr(0, 1) == "#")
	{
		colorStringFromJSFL = colorStringFromJSFL.substr(1, 6);
	}
	return '0x' + colorStringFromJSFL.toUpperCase();
}


MotionXMLExporter.prototype.getFiltersXML = function()
{
	if (!this.element) return '';
	var filters = this.dom.getFilters();
	if (!filters || !filters.length) return '';
	
	var s = '';
	
	for (var i=0; i<filters.length; i++) 
	{
		var filter = filters[i];
		var filterXML = this.getFilterXML(filter);
		if (filterXML) s += this.indentCR(3) + filterXML;
	} 
	
	if (s.length)
	{
		s = this.indentCR(2) + '<filters>' + s + this.indentCR(2) + '</filters>';
	}
	return s;
}

//TODO: clean up filter export code
MotionXMLExporter.prototype.getFilterXML = function(filter)
{
	if (!filter) return '';
	var name = this.capitalize(filter.name);
	// if we don't have a schema defined for this type of filter, skip it, e.g. AdjustColorFilter
	if (!this[name]) return '';
	var whiteSpace = '';

	var qualityValues = {low:1, medium:2, high:3};
	var s = '<';
	if (filter.name != 'adjustColorFilter')
		s += 'filters:';
	// the Adjust Color filter doesn't have an AS class, so remove it from XML
	else if (this.forActionScript)
		return '';
		
	s += name;
	
	//TODO: test this again
	if (!filter.enabled)
	{
		// The AS classes for filters don't have an enabled property, so just remove them from XML.
		if (this.forActionScript)
		{
			return '';
		}
		else
		{
			// if the enabled property is absent from XML, it's assumed to be true by default
			s += ' enabled="false"';
		}
	}
	
	
	// iterate over the filter schema and grab only the non-tweenable values, which become attributes in XML
	//for (var propName in MotionXMLExporter.prototype[name]) 
	//{
		//var propValue = filter[propName];
		//if (typeof(propValue) == 'boolean' || propName == 'type')
		//{
			//s += ' '+propName+'="'+propValue+'"';
		//}
		//else if (propName == 'quality')
		//{
			//propValue = qualityValues[propValue];
			//s += ' '+propName+'="'+propValue+'"';
		//}
	//} 

	
	//TODO: consolidate the two for loops into one, since it's now all attributes
	
	// loop through schema again, this time writing the tweenable properties to XML
	for (var propName in MotionXMLExporter.prototype[name]) 
	{
		var propValue = filter[propName];
		
		//if ((typeof(propValue) == 'number' 
			//|| typeof(propValue) == 'string'
			//|| typeof(propValue) == 'object') 
			//&& propName != 'quality'
			//&& propName != 'type')
		//{
			 
			if (typeof(propValue) == 'boolean' || propName == 'type')
			{
				s += ' '+propName+'="'+propValue+'"';
			}
			else if (propName == 'quality')
			{
				propValue = qualityValues[propValue];
				s += ' '+propName+'="'+propValue+'"';
			}
			else if (typeof(propValue) == 'number' 
			|| typeof(propValue) == 'string'
			|| typeof(propValue) == 'object')
			{
				// handle JSFL-mangled color strings that mix color and alpha, and in the wrong order
				if (propName == 'color')
				{
					var colorValue = cleanColor(propValue);		
					s += ' '+propName+'="'+colorValue+'"';
					var alphaPercent = this.getFilterAlphaPercent(propValue);
					s += ' alpha="'+alphaPercent+'"';
					continue;
				}
				else if (propName == 'highlightColor')
				{
					var colorValue = cleanColor(propValue);				
					s += ' '+propName+'="'+colorValue+'"';
					var alphaPercent = this.getFilterAlphaPercent(propValue);
					s += ' highlightAlpha="'+alphaPercent+'"';
					continue;
				}
				else if (propName == 'shadowColor')
				{
					var colorValue = cleanColor(propValue);				
					s += ' '+propName+'="'+colorValue+'"';
					var alphaPercent = this.getFilterAlphaPercent(propValue);
					s += ' shadowAlpha="'+alphaPercent+'"';
					continue;
				}    
							
				// detect gradient arrays
				else if (propName == 'posArray')
				{
					propValue = '['+propValue.join(',')+']';
					propName = 'ratios';
				}
				else if (propName == 'colorArray')
				{
					var colorJSFLArray = propValue;
					var colorHexArray = [];
					var alphaPercentArray = [];
					
					for (var i=0; i<colorJSFLArray.length; i++) 
					{
						var colorJSFL = colorJSFLArray[i];
						colorHexArray[i] = cleanColor(colorJSFL);
						alphaPercentArray[i] = this.getFilterAlphaPercent(colorJSFL);
					} 
					
					// Use Flex notation for array values, 
					// e.g. backgroundGradientColors="[0x990000,0x330000]"
					
					propValue = '['+colorHexArray.join(',')+']';
					propName = 'colors';
					s += ' '+propName+'="'+propValue+'"';
					
					var alphaPercent = '['+alphaPercentArray.join(',')+']';
					s += ' alphas="'+alphaPercent+'"';
					
					continue;
				}
				else if (propName == 'angle')
				{
					propValue = Math.round(propValue*10)/10;
				}
				else if (propName == 'strength')
				{
					propValue /= 100;
				}
				
				s += ' '+propName+'="'+propValue+'"';
			
			}
		//}
		
	}// end propName for loop
	
	
	s += '/>';
	
	return s;
}


MotionXMLExporter.prototype.getFilterAlphaPercent = function(colorStringFromJSFL)
{
	var alphaPercent = 1; 
	
	// there was a bug fix in build d265 that removed the quotes from the string
	if (colorStringFromJSFL.substr(0, 2) == "'#")
	{
		colorStringFromJSFL = colorStringFromJSFL.substr(2, 8);
	}
	else if (colorStringFromJSFL.substr(0, 1) == "#")
	{
		colorStringFromJSFL = colorStringFromJSFL.substr(1, 8);
	}
	
	// if the alpha is 100%, JSFL omits it from the color string
	// if the alpha is not 100%, JSFL puts the alpha hex at the end of the color string
	if (colorStringFromJSFL.length == 8)
	{
		var alphaHex = colorStringFromJSFL.substr(6, 2);
		// normalize alpha to 1
		var alpha255 = parseInt(alphaHex, 16);
		alphaPercent = alpha255 / 255;
		// round to the nearest .01
		alphaPercent = Math.round(alphaPercent * 100) / 100;
	}
	return alphaPercent;
}


MotionXMLExporter.prototype.capitalize = function(str)
{
	return str.slice(0, 1).toUpperCase() + str.slice(1);
}

MotionXMLExporter.prototype.indent = function(numIndents)
{
	var s = '';
	for (var i=0; i<numIndents; i++) s += this.m;
	return s;
}

MotionXMLExporter.prototype.indentCR = function(numIndents)
{
	var s = this.n;
	for (var i=0; i<numIndents; i++) s += this.m;
	return s;
}

  //////////////////////////////////////////////////////////////
 /////////////// End MotionXMLExporter ////////////////////////
//////////////////////////////////////////////////////////////



/**
* @return	Horizontal scaling percent, where 1 is normal size.
*/
//TODO: update unit tests and AS3; let Jethro know to fix scaleX, scaleY JSAPIs
getMatrixScaleX = function(matrix)
{
	var angleYRad = Math.atan2(matrix.b, matrix.a);
	var cos = Math.cos(angleYRad);
	var scaleX = matrix.a / cos;
	if (Math.abs(cos) < 1e-12)
		scaleX = matrix.b / Math.sin(angleYRad);
	var scaleRound = 1000;
	scaleX = Math.round(scaleX*scaleRound)/scaleRound;
	return scaleX;
}

/**
* @return	Vertical scaling percent, where 1 is normal size.
*/
getMatrixScaleY = function(matrix)
{
	var angleXRad = Math.atan2(-matrix.c, matrix.d);
	var cos = Math.cos(angleXRad);
	var scaleY = matrix.d / cos;
	if (Math.abs(cos) < 1e-12)
		scaleY = -matrix.c / Math.sin(angleXRad);
	var scaleRound = 1000;
	scaleY = Math.round(scaleY*scaleRound)/scaleRound;
	return scaleY;
}

/**
* @return	Horizontal skew angle in degrees, rounded to the nearest .1 degree.
*/
getMatrixSkewX = function(matrix)
{
	var angleXRad = Math.atan2(-matrix.c, matrix.d);
	var angleRound = 10;
	var angleX = Math.round(angleXRad * 180/Math.PI * angleRound)/angleRound;
	return angleX;
}

/**
* @return	Vertical skew angle in degrees, rounded to the nearest .1 degree.
*/
getMatrixSkewY = function(matrix)
{
	var angleYRad = Math.atan2(matrix.b, matrix.a);
	var angleRound = 10;
	var angleY = Math.round(angleYRad * 180/Math.PI * angleRound)/angleRound;
	return angleY;
}


////////////////////////////////////////////////////////////////
 
 
getFrameOrCurrent = function(frameIndex)
{
	var dom = fl.getDocumentDOM();
	var timeline = dom.getTimeline();
	
	if (frameIndex == null)
		frameIndex = timeline.currentFrame;
		
	var layer = timeline.layers[timeline.currentLayer];
	var frame = layer.frames[frameIndex];
	return frame;
}
 
getFrameAtIndex = function(frameIndex)
{
	if (frameIndex == undefined) return null;
	
	var dom = fl.getDocumentDOM();
	var timeline = dom.getTimeline();
	var layer = timeline.layers[timeline.currentLayer];
	var frame = layer.frames[frameIndex];
	return frame;
}
 
getCurrentFrame = function()
{
	var timeline = fl.getDocumentDOM().getTimeline();
	var layer = timeline.layers[timeline.currentLayer];
	var frame = layer.frames[timeline.currentFrame];
	return frame;
}

getInstanceName = function()
{
	var dom = fl.getDocumentDOM();
	if (!dom.selection.length) return '';
	var ob = dom.selection[0];
	if (ob.name != undefined)
		return ob.name;
	return '';
}
 

// frameIndex is required
makeKeyframe = function(frameIndex)
{
	var frame = getFrameAtIndex(frameIndex);
	
	// if it's already a keyframe, don't change it
	if (!frame || frame.startFrame == frameIndex)
	{
		return;
	}
	
	fl.getDocumentDOM().getTimeline().convertToKeyframes(frameIndex, frameIndex+1);
}



selectFrameIndex = function(frameIndex)
{
	var dom = fl.getDocumentDOM();
	var timeline = dom.getTimeline();
	var selFramesArray = [timeline.currentLayer, frameIndex, frameIndex+1];
	timeline.setSelectedFrames(selFramesArray);
}
       


  ////////////////////////////////////////
 ////// Begin Matrix Manipulations //////
////////////////////////////////////////

function getScaleX(m)
{
	return Math.sqrt(m.a*m.a + m.b*m.b);
}
function setScaleX(m, scaleX)
{
	var oldValue = getScaleX(m);
	// avoid division by zero 
	if (oldValue)
	{
		var ratio = scaleX / oldValue;
		m.a *= ratio;
		m.b *= ratio;
	}
	else
	{
		var skewYRad = getSkewYRadians(m);
		m.a = Math.cos(skewYRad) * scaleX;
		m.b = Math.sin(skewYRad) * scaleX;
	}
}
	
function getScaleY(m)
{
	return Math.sqrt(m.c*m.c + m.d*m.d);
}	
function setScaleY(m, scaleY)
{
	var oldValue = getScaleY(m);
	// avoid division by zero 
	if (oldValue)
	{
		var ratio = scaleY / oldValue;
		m.c *= ratio;
		m.d *= ratio;
	}
	else
	{
		var skewXRad = getSkewXRadians(m);
		m.c = -Math.sin(skewXRad) * scaleY;
		m.d =  Math.cos(skewXRad) * scaleY;
	}
}

function getSkewXRadians(m)
{
	return Math.atan2(-m.c, m.d);
}
function setSkewXRadians(m, skewX)
{
	var scaleY = getScaleY(m);
	m.c = -scaleY * Math.sin(skewX);
	m.d =  scaleY * Math.cos(skewX);
}

function getSkewYRadians(m)
{
	return Math.atan2(m.b, m.a);
} 
function setSkewYRadians(m, skewY)
{
	var scaleX = getScaleX(m);
	m.a = scaleX * Math.cos(skewY);
	m.b = scaleX * Math.sin(skewY);
}

function getSkewX(m)
{
	return Math.atan2(-m.c, m.d) * (180/Math.PI);
}
function setSkewX(m, skewX)
{
	setSkewXRadians(m, skewX*(Math.PI/180));
}

function getSkewY(m)
{
	return Math.atan2(m.b, m.a) * (180/Math.PI);
}
function setSkewY(m, skewY)
{
	setSkewYRadians(m, skewY*(Math.PI/180));
}	

function getRotationRadians(m)
{
	var skewEqualityDelta = .0001; // customizable
	var skewXRad = getSkewXRadians(m);
	var skewYRad = getSkewYRadians(m);
	if (Math.abs(skewXRad-skewYRad) <= skewEqualityDelta)	
		return skewYRad;
	return NaN;
}
function setRotationRadians(m, rotation)
{
	setSkewXRadians(m, rotation);
	setSkewYRadians(m, rotation);		
}	

function getRotation(m)
{
	return getRotationRadians(m)*(180/Math.PI);
}	
function setRotation(m, rotation)
{
	setSkewXRadians(m, rotation*(Math.PI/180));
	setSkewYRadians(m, rotation*(Math.PI/180));		
}


  //////////////////////////////////////
 ////// End Matrix Manipulations //////
//////////////////////////////////////



  //////////////////////////////////////
 ////// Begin Assert Framework ////////
//////////////////////////////////////

function assertTrue() {
	var message;
	var condition;

	if(args.length == 1) {
		message = "";
		condition = Boolean(arguments[0]);
	}
	else if(args.length == 2) {
		message = arguments[0];
		condition = Boolean(arguments[1]);
	}
	else {
		failError("Invalid argument count: " + message, 'assertTrue');
	}

	if(!condition) {
		//fail(message);
		failNotEquals(message, true, condition);
	}
}

function assertFalse() {
	var message;
	var condition;

	if(args.length == 1) {
		message = "";
		condition = Boolean(arguments[0]);
	}
	else if(args.length == 2) {
		message = arguments[0];
		condition = Boolean(arguments[1]);
	}
	else {
		failError("Invalid argument count: " + message, 'assertFalse');
	}

	if(condition) {
		//fail(message);
		failNotEquals(message, false, condition);
	}
}


function assertEquals() {
	var message;
	var expected;
	var actual;

	if(arguments.length == 2) {
		message = "";
		expected = arguments[0];
		actual = arguments[1];
	}
	else if(arguments.length == 3) {
		message = arguments[0];
		expected = arguments[1];
		actual = arguments[2];
	}
	else {
		failError("Invalid argument count: " + message, 'assertEquals');
	}

	if(expected == null && actual == null) {
		return;
	}

	if(expected != null && expected.equals && expected.equals(actual)) {
		return;
	}
	
	if(expected != null && expected == actual) {
		return;
	}

	failNotEquals(message, expected, actual, 'assertEquals');
}



function assertEqualsFloat() 
{
	var message;
	var expected;
	var actual;
	var tolerance = 0;

	if(arguments.length == 3) {
		message = "";
		expected = arguments[0];
		actual = arguments[1];
		tolerance = arguments[2];
	}
	else if(arguments.length == 4) {
		message = arguments[0];
		expected = arguments[1];
		actual = arguments[2];
		tolerance = arguments[3];
	}
	else {
		failError("Invalid argument count: " + message, 'assertEqualsFloat');
	}

	if(Math.abs(expected - actual) <= tolerance) {
		return;
	}
	failNotEquals(message, expected, actual, 'assertEqualsFloat');
}

function fail(msg, assertType) 
{
	//fl.trace('Failed ' + assertType + ' -- ' + msg);
}

function failError(msg, assertType) 
{
	//fl.trace('Error in ' + assertType + ' -- ' + msg);
}

function failNotEquals(message, expected, actual, assertType) 
{
	fail(format(message, expected, actual), assertType);
}

function format(message, expected, actual) 
{
	var formatted = "";
	if(message != null) {
		formatted = message + " ";
	}
	return formatted + "expected:<" + expected + "> but was:<" + actual + ">";
}

  ////////////////////////////////////
 ////// End Assert Framework ////////
////////////////////////////////////



   

/**
* @return	Zero-based index of the first frame in the selection span
*/
getFirstSelectedFrameIndex = function()
{
	var dom = fl.getDocumentDOM(); 
	var timeline = dom.getTimeline();
	var selFramesArray = timeline.getSelectedFrames();
	if (!selFramesArray.length)
		return -1;
	
	// use only the first region of selected frames; ignore the rest (i.e. non-contiguous selection)
	var startFrameIndex = selFramesArray[1];
	return startFrameIndex;
}


insertFramesBefore = function(numFrames, frameIndex)
{
	var dom = fl.getDocumentDOM(); 
	var timeline = dom.getTimeline();
	timeline.insertFrames(numFrames, false, frameIndex);
	timeline.convertToKeyframes(frameIndex+numFrames);
	selectFrameIndex(frameIndex);
}

//TODO: test if .replace is replacing all line breaks properly
stringReplace = function(source, find, replace)
{
	if (!source || !source.length)
		return '';
	//return source.replace(find, replace);
	return source.split(find).join(replace);
}

escapeForXML = function(str)
{
	// the ampersand must be replaced before the others
	str = stringReplace(str, '&', '&amp;');
	str = stringReplace(str, '"', '&quot;');
	str = stringReplace(str, "'", '&apos;');
	str = stringReplace(str, '<', '&lt;');
	str = stringReplace(str, '>', '&gt;');
	return str;
} 


// Detect whether there is a skew by checking if the two angles are different.
// However, we have to handle a special case: 
// if there is a rotation of 180, one angle will be 180 and the other will be -180
// so even though the angles are different, it's not a skew in this case.
// Also, this handles the case where one angle is a multiple of 360 added to the other.
skewsAreEqual = function(skewX, skewY)
{
	var SKEW_EQUALITY_DELTA = .1;
	return ((Math.abs(skewY-skewX) % 360) <= SKEW_EQUALITY_DELTA);
}

traceSelectedFramesXML = function(useWhiteSpace, forActionScript)
{
	fl.outputPanel.clear();
	var motionXML = new MotionXMLExporter();
	var xml = motionXML.getXML(useWhiteSpace, forActionScript);
	fl.trace(xml);
}

getSelectedFramesXML = function(useWhiteSpace, forActionScript, startFrameIndex, endFrameIndex)
{
	var motionXML = new MotionXMLExporter();
	return motionXML.getXML(useWhiteSpace, forActionScript, startFrameIndex, endFrameIndex);
}

saveMotionXML = function(contents, motionName)
{
	if (!contents)
		return false;
	var fileURL = '';
	if (!motionName)
	{
		fileURL = fl.browseForFileURL("save", "Save Motion XML as...");
		if (!fileURL || !fileURL.length)
			return false;
	}
	else
	{
		var motionsFolder = fl.configURI+'JavaScript/';
		FLfile.createFolder(motionsFolder);
		fileURL = motionsFolder + motionName;
	}
	var ending = fileURL.slice(-4);
	if (ending != '.xml')
		fileURL += '.xml';
		
	var contentsLinebreaks = stringReplace(contents, "\n", "\r\n");

	if (!FLfile.write(fileURL, contentsLinebreaks)) 
	{
		alert(CopyMotionErrorStrings.SAVE_ERROR); 
		return false;
	}
	return true;
}


loadMotionXML = function(motionName)
{
	var fileURL = '';
	if (!motionName)
	{
		var obsoleteDWPreviewAreaObject = {};
		var macFormatStr = "XML File|TEXT[*.xml||";
		var winFormatStr = "XML File|*.xml||"; 
		fileURL = fl.browseForFileURL("open", "Open Motion XML", obsoleteDWPreviewAreaObject, macFormatStr, winFormatStr);
		if (!fileURL || !fileURL.length)
			return '';
	}
	else
	{
		var motionsFolder = fl.configURI+'JavaScript/';
		fileURL = motionsFolder + motionName;
	}

	var ending = fileURL.slice(-4);
	if (FLfile.exists(fileURL) && ending == '.xml')
	{
		var contents = FLfile.read(fileURL);
		return contents;
	}
	return '';
}




copyMotion = function(startFrameIndex, endFrameIndex)
{
	var xmlString = getSelectedFramesXML(true);
	//fl.outputPanel.clear();
	//fl.trace(xmlString);
	//fl.clipCopyString(xmlString);
	saveMotionXML(xmlString, 'MotionClipboard.xml'); 	
	return xmlString;
}

exportMotionXML = function()
{
	var xmlString = getSelectedFramesXML(true, true);
	return saveMotionXML(xmlString);
}

copyMotionAsXML = function()
{
	var xmlString = getSelectedFramesXML(true, true);
	if (xmlString)
		fl.clipCopyString(xmlString);
	return xmlString;
}


pasteMotion = function(options)
{
	var xmlString = loadMotionXML('MotionClipboard.xml');
	if (!xmlString) 
		return false;
	var importer = new MotionXMLImporter();
	importer.importXMLString(xmlString, options);
	savePasteOptions(importer.options);
	return true;
}

importMotionXML = function(options)
{
	// calling loadMotionXML() without a file name triggers a file open dialog
	var xmlString = loadMotionXML();
	if (!xmlString) 
		return false;
	var importer = new MotionXMLImporter();
	var options = fl.getDocumentDOM().xmlPanel(fl.configURI + "Javascript/PasteMotionSpecialDialog.xml"); 
	importer.importXMLString(xmlString, options);
	savePasteOptions(importer.options);
	return true;
}

pasteMotionSpecial = function()
{
	var options = fl.getDocumentDOM().xmlPanel(fl.configURI + "Javascript/PasteMotionSpecialDialog.xml"); 
	if (options.dismiss == 'accept')
		return pasteMotion(options);
	return false;
}

savePasteOptions = function(options)
{
	if (!options) return;
	
	var templateURL = fl.configURI + "Javascript/PasteMotionSpecialDialogTemplate.xml";
	if (!FLfile.exists(templateURL)) return;
	
	var contents = FLfile.read(templateURL);
	
	var optionNames = ['x', 'y', 'scaleX', 'scaleY', 'rotationAndSkew', 'color', 'filters', 'blendMode', 
		'overrideScale', 'overrideRotationAndSkew'];
	for (var i=0; i<optionNames.length; i++)
	{
		var optionName = optionNames[i];
		var optionValue = options[optionName];
		var varName = '%'+optionName+'%';
		contents = stringReplace(contents, varName, optionValue);
	}

	var dialogURL = fl.configURI + "Javascript/PasteMotionSpecialDialog.xml";
	if (!FLfile.write(dialogURL, contents)) 
	{
		fl.trace('An error occured while trying to save Paste Motion settings to disk.');
		return false;
	}
	
	return true;
}

copyMotionAsAS3 = function(instanceName)
{
	var id = instanceName;
	if (!id || id == '')
	{
		// if id argument is not supplied, prompt user for the instance name
		var xmlString = getSelectedFramesXML(true, true);
		if (!xmlString) return;
			
		//TODO: get the instance name from a keyframe.  
		// Currently if the playhead is in the middle of a tween, the instance name is not found.
		var detectedName = getInstanceName();
		do
		{
			// ask for the instance name of the movie clip to apply the motion to
			var id = prompt('Instance name to use in the ActionScript:',
				detectedName);
		
		} while (id == '')
		
		var canceled = (id == null);
		if (canceled) return false;
	}
	
	var templateURL = fl.configURI + 'Javascript/CopyMotionAsAS3Template.as';
	
	if (!FLfile.exists(templateURL)) 
	{
		fl.trace('Error: Missing template file ' + templateURL);
		return false;
	}
	
	var s = FLfile.read(templateURL);
	s = stringReplace(s, '%id%', id);
	s = stringReplace(s, '%xml%', xmlString);

	//// moved this to CopyMotionAsAS3Template.as
	//var s = '';
	//s += 'import fl.motion.Animator;';
	//s += '\n';
	//s += 'var '+id+"_xml:XML = "+xmlString+";";
	//s += '\n\n';
	//s += 'var '+id+'_animator:Animator = new Animator('+id+'_xml, '+id+');';
	//s += '\n';
	//s += id+'_animator.play();';
	//s += '\n';

	fl.clipCopyString(s);
	return s;
}


tracePoints = function(pts, name)
{ 
	if (!name) name = '';
	fl.trace('--- ' + name + ' points ---');
	for (var i=0; i<pts.length; i++)
	{
		var p = pts[i];
		fl.trace(i + ' - ('+p.x+', '+p.y+')');
	}
}



MotionXMLImporter = function() 
{
}




MotionXMLImporter.prototype.importColor = function(color)
{	
	if (this.element.elementType != 'instance')
		return;
	
	
	//// BRIGHTNESS
	
	var brightness = (color.@brightness.length()) ? Number(color.@brightness) : null;
	
	if (brightness != null)
	{
		var brightnessPercent = Math.round(brightness*100);
		//fl.trace('brightnessPercent: ' + brightnessPercent);
		//fl.trace('this.element.selected: ' + this.element.selected);
		this.element.colorMode = 'brightness';
		fl.getDocumentDOM().setInstanceBrightness(brightnessPercent);
		return;
	}

	
	//// TINT
	
	var tintColor = (color.@tintColor.length()) ? parseInt(color.@tintColor) : null;
	var tintColorString = tintColor != null ? tintColor.toString(16) : '';
	var tintMultiplier = (color.@tintMultiplier.length()) ? Number(color.@tintMultiplier) : null;
	
	if (tintColor != null && tintMultiplier != null)
	{
		var tintPercent = Math.round(tintMultiplier*100);
		this.element.colorMode = 'tint';
		fl.getDocumentDOM().setInstanceTint(tintColor, tintPercent);
		return;
	}
	
	
	//// COLOR MATRIX
	
	var redMultiplier = (color.@redMultiplier.length()) ? Number(color.@redMultiplier) : null;
	var redOffset = (color.@redOffset.length()) ? Number(color.@redOffset) : null;
	
	var greenMultiplier = (color.@greenMultiplier.length()) ? Number(color.@greenMultiplier) : null;
	var greenOffset = (color.@greenOffset.length()) ? Number(color.@greenOffset) : null;

	var blueMultiplier = (color.@blueMultiplier.length()) ? Number(color.@blueMultiplier) : null;
	var blueOffset = (color.@blueOffset.length()) ? Number(color.@blueOffset) : null;

	var alphaMultiplier = (color.@alphaMultiplier.length()) ? Number(color.@alphaMultiplier) : null;
	var alphaOffset = (color.@alphaOffset.length()) ? Number(color.@alphaOffset) : null;
	
	//// ALPHA
	
	if (   alphaMultiplier != null 
		&& (alphaOffset == null || alphaOffset == 0)
		&& redMultiplier == null
		&& greenMultiplier == null
		&& blueMultiplier == null
		&& redOffset == null
		&& greenOffset == null
		&& blueOffset == null
		)
	{
		this.element.colorMode = 'alpha';
		
		// rounding alpha to work around bug where decimal values will halt JSFL
		var newAlpha = Math.round(alphaMultiplier * 100);
		fl.getDocumentDOM().setInstanceAlpha(newAlpha);
		return;
	}
	
	var hasAdvancedColor = (
		   redMultiplier   != null 
		|| greenMultiplier != null
		|| blueMultiplier  != null
		|| alphaMultiplier != null
		|| redOffset       != null 
		|| greenOffset     != null
		|| blueOffset      != null
		|| alphaOffset     != null
		);
		
		
	if (hasAdvancedColor)
	{
		this.element.colorMode = 'advanced';

		this.element.colorRedPercent   = (redMultiplier   != null) ? redMultiplier   * 100 : 100;
		this.element.colorGreenPercent = (greenMultiplier != null) ? greenMultiplier * 100 : 100;
		this.element.colorBluePercent  = (blueMultiplier  != null) ? blueMultiplier  * 100 : 100;
		this.element.colorAlphaPercent = (alphaMultiplier != null) ? alphaMultiplier * 100 : 100;

		this.element.colorRedAmount   = (redOffset   != null) ? redOffset   : 0;
		this.element.colorGreenAmount = (greenOffset != null) ? greenOffset : 0;
		this.element.colorBlueAmount  = (blueOffset  != null) ? blueOffset  : 0;
		this.element.colorAlphaAmount = (alphaOffset != null) ? alphaOffset : 0;
	}
	else
	{
		this.element.colorMode = 'none';
	}
} 


MotionXMLImporter.prototype.importTransform = function(kf)
{
	
	var transformXOriginal = this.element.transformX;
	var transformYOriginal = this.element.transformY;
	
	//// create the matrix here and just send the coefficients to JS
	
	if (this.doScaleX && (kf.@scaleX.length() || this.frameIndex==0)) 
	{
		var scaleX = kf.@scaleX.length() ? Number(kf.@scaleX) : 1;
		setScaleX(this.matrix, scaleX * this.scaleXStart);
	}

	if (this.doScaleY && (kf.@scaleY.length() || this.frameIndex==0)) 
	{
		var scaleY = kf.@scaleY.length() ? Number(kf.@scaleY) : 1;
		setScaleY(this.matrix, scaleY * this.scaleYStart);
	}
	
	if (this.doRotationAndSkew && (kf.@rotation.length() || this.frameIndex==0) )
	{
		var rotation = kf.@rotation.length() ? Number(kf.@rotation) : 0;

		setSkewX(this.matrix, rotation + this.skewXStart);
		setSkewY(this.matrix, rotation + this.skewYStart);
	}
	
	if (this.doRotationAndSkew && (kf.@skewX.length() || this.frameIndex==0))
	{
		var skewX = kf.@skewX.length() ? Number(kf.@skewX) : 0;
		setSkewX(this.matrix, skewX + this.skewXStart);
	}

	if (this.doRotationAndSkew && (kf.@skewY.length() || this.frameIndex==0))
	{
		var skewY = kf.@skewY.length() ? Number(kf.@skewY) : 0;
		setSkewY(this.matrix, skewY + this.skewYStart);
	}
	
	// store the transformation point so we can restore it after the matrix change (JSAPI limitation workaround)
	var transPointTemp = getTransformationPointForElement(this.element);
	
	// apply transformed matrix; shift position afterward
	this.element.matrix = this.matrix;
		
	// restore transformation point because it gets messed up by the matrix change
	setTransformationPointForElement(this.element, transPointTemp);

	// ensure the transform point doesn't move as a result of the scaling and rotation
	this.element.transformX = transformXOriginal; 
	this.element.transformY = transformYOriginal; 
	
	
		
	if (this.doX && kf.@x.length()) 
	{
		var positionX = this.startX + Number(kf.@x);
		setX(this.element, positionX);
	}
	
	if (this.doY && kf.@y.length()) 
	{
		var positionY = this.startY + Number(kf.@y);	
		setY(this.element, positionY);
	}
	
}


getTransformationPointForElement = function(element)
{
	var oldSelected = element.selected;
	element.selected = true;
	var pt = element.getTransformationPoint();
	element.selected = oldSelected;
	return pt;
}

setTransformationPointForElement = function(element, transPoint)
{
	var oldSelected = element.selected;
	element.selected = true;
	element.setTransformationPoint(transPoint);
	element.selected = oldSelected;
}

MotionXMLImporter.prototype.importFrameProperties = function(kf)
{
	
	var rotateDirection = 'auto'; // default value
	if (kf.@rotateDirection.length()) 
	{
		rotateDirection = kf.@rotateDirection;
	}
	var rotateDirectionJSFL = 
		  rotateDirection == 'none' ? 'none'
		: rotateDirection == 'cw' ? 'clockwise'
		: rotateDirection == 'ccw' ? 'counter-clockwise'
		: 'auto';
		
	this.frame.motionTweenRotate = rotateDirectionJSFL;
	
	
	var rotateTimes = 0;
	if (kf.@rotateTimes.length()) 
	{
		rotateTimes = Number(kf.@rotateTimes);
	}
	this.frame.motionTweenRotateTimes = rotateTimes;

		
	if (this.doBlendMode)
	{
		var blendMode = 'normal';
		if (kf.@blendMode.length()) 
			blendMode = String(kf.@blendMode);
		fl.getDocumentDOM().setBlendMode(blendMode);
	}
		
	var cacheAsBitmap = false; // default value
	if (kf.@cacheAsBitmap.length()) 
	{
		cacheAsBitmap = Boolean(kf.@cacheAsBitmap);
	}
	fl.getDocumentDOM().setElementProperty("cacheAsBitmap", cacheAsBitmap);
	

	var tweenSnap = false; // default value
	if (kf.@tweenSnap.length()) 
	{
		tweenSnap = (kf.@tweenSnap == 'true');
	}
	this.frame.motionTweenSnap = tweenSnap;
	
	var tweenSync = false; // default value
	if (kf.@tweenSync.length()) 
	{
		tweenSync = (kf.@tweenSync == 'true');
	}
	this.frame.motionTweenSync = tweenSync;

	var tweenScale = true; // default value
	if (kf.@tweenScale.length()) 
	{
		tweenScale = (kf.@tweenScale == 'true');
	}
	this.frame.motionTweenScale = tweenScale;

	var orientToPath = false; // default value
	if (kf.@orientToPath.length())
	{
		orientToPath = (kf.@orientToPath == 'true');
	}
	this.frame.motionTweenOrientToPath = orientToPath;


	var label = '';
	if (kf.@label.length()) 
	{
		label = String(kf.@label);
		this.frame.name = label;
	}

	// working around bug where setting "loop" on non-graphic symbol causes JSFL execution to halt
	if (this.element.symbolType == 'graphic')
	{
		var loop = 'loop'; // default value
		if (kf.@loop.length()) 
			loop = String(kf.@loop);
		this.element.loop = loop;
		
		var firstFrame = 0;
		if (kf.@firstFrame.length()) 
			firstFrame = Number(kf.@firstFrame);
		this.element.firstFrame = firstFrame;
	}
		
}

MotionXMLImporter.prototype.importMotionGuide = function()
{
	// find the motion guide coordinates
	var guideLeft = null;
	var guideTop = null;
	
 	for (var si=0; si<this.motionChildren.length(); si++) 
	{
		var source = this.motionChildren[si];
		if (source.localName() != 'source') continue;
		
		source = source.children()[0];
		if (source.localName() != 'Source') continue;
		
		for (var sci=0; sci<source.children().length(); sci++) 
		{
			var sourceChild = source.children()[sci];
			if (sourceChild.localName() != 'motionGuide') continue;
			
			var motionGuide = sourceChild.children()[0];
			if (motionGuide.localName() != 'MotionGuide') continue;
			
			if (motionGuide.@left.length())
				guideLeft = Number(motionGuide.@left); 
				
			if (motionGuide.@top.length())
				guideTop = Number(motionGuide.@top);
			
			break;
		}
		
	}
	

	if (guideLeft != null && guideTop != null)
	{
		this.pasteMotionGuide(
			this.startFrameIndex, 
			this.startFrameIndex + this.duration, 
			guideLeft + this.startX, 
			guideTop + this.startY
			);
	}    
}




// currentLayer needs to be set ahead of time
MotionXMLImporter.prototype.pasteMotionGuide = function(startFrameIndex, endFrameIndex, left, top)
{
	var dom = fl.getDocumentDOM(); 
	var timeline = dom.getTimeline();

	if (this.layer.layerType != 'guided')
		timeline.currentLayer = timeline.addMotionGuide();
	else
	{
		// find the index of the parent layer
		var parentLayerIndex = -1;
		for (var li=0; li<timeline.layers.length; li++)
		{
			var theLayer = timeline.layers[li];
			if (theLayer == this.layer.parentLayer && theLayer.layerType == 'guide')
			{
				parentLayerIndex = li;
				break;
			}
		}
		timeline.currentLayer = parentLayerIndex;
	}
		
	var guideLayer = timeline.layers[timeline.currentLayer];
		
	timeline.pasteFrames(startFrameIndex, endFrameIndex);
	
	// remove extra frames in the new motion guide layer
	var startFrameIndexClear = this.startFrameIndex + this.duration;
	var endFrameIndexClear = this.layer.frameCount;
	this.timeline.removeFrames(startFrameIndexClear, endFrameIndexClear);
	
	timeline.setSelectedFrames([timeline.currentLayer, startFrameIndex, startFrameIndex+1]);

	var guideStartFrame = guideLayer.frames[startFrameIndex];
	var guideStartElement = guideStartFrame.elements[0];
	if (guideStartElement)
	{
		dom.selection = [guideStartElement];
		dom.moveSelectionBy({x:left-guideStartElement.left, y:top-guideStartElement.top});
	}
	
}



MotionXMLImporter.prototype.importTweens = function(tweens)
{
	
	var tweensChildren = tweens.children();
	for (var tci=0; tci<tweensChildren.length(); tci++)
	{
		var tween = tweensChildren[tci];
		var tweenTarget = String(tween.@target);
		// only import the SimpleEase if it doesn't target a specific property
		if (tween.localName() == 'SimpleEase' && !tweenTarget.length)
		{
			var ease = Number(tween.@ease);
			this.frame.tweenType = 'motion';
			this.frame.tweenEasing = ease*100;
		}
		else if (tween.localName() == 'CustomEase')
		{
			var pts = customEaseXMLToPoints(tween);
				
			// ignore y and scaleY; assume them to be identical to x and scaleX, respectively
			if (pts.length && tweenTarget != 'y' && tweenTarget != 'scaleY')
			{
				var customEaseTarget = tweenTarget;
				var useSingleEaseCurve = false;
				if (tweenTarget == 'x') 
					customEaseTarget = 'position';
				else if (tweenTarget == 'scaleX') 
					customEaseTarget = 'scale';
				// if there is no target specified, all properties share one curve
				else if (!tweenTarget.length)
				{
					customEaseTarget = 'all';
					useSingleEaseCurve = true;
				}
				
				this.frame.tweenType = 'motion';
				this.frame.useSingleEaseCurve = useSingleEaseCurve;
				this.frame.setCustomEase(customEaseTarget, pts);
				this.frame.hasCustomEase = true;
			}
		}// end if CustomEase
	}// end tweens children loop
}


MotionXMLImporter.prototype.importTransformPoint = function()
{
	this.transX = 0;
	this.transY = 0;
	
	var leftSource = 0;
	var rightSource = 0;
	var widthSource = 0;
	var heightSource = 0; 

	// grab transformation point and dimensions 
	for (var sci=0; sci<this.sourceChildrenLength; sci++) 
	{
		var sourceChild = this.sourceChildren[sci];
		if (sourceChild.localName() == 'transformationPoint') 
		{
			var transPoint = sourceChild.children()[0];
			if (transPoint.localName() != 'Point') continue;
			
			if (transPoint.@x.length())
				this.transX = Number(transPoint.@x);
			if (transPoint.@y.length())
				this.transY = Number(transPoint.@y);
		}
		else if (sourceChild.localName() == 'dimensions') 
		{
			var rect = sourceChild.children()[0];
			if (rect.localName() != 'Rectangle') continue;
			
			if (rect.@left.length())
				leftSource = Number(rect.@left);
			if (rect.@top.length())
				topSource = Number(rect.@top);
			if (rect.@width.length())
				widthSource = Number(rect.@width);
			if (rect.@height.length())
				heightSource = Number(rect.@height);
		}
	}

	// find the target's untransformed dimensions
	var identityMatrix = {a:1, b:0, c:0, d:1, tx:0, ty:0};
	this.element.matrix = identityMatrix;
	// setting the x and y properties to workaround a bug where drawing object's don't move with matrix change to tx, ty 
	this.element.x = 0;
	this.element.y = 0;
	var targetNormalLeft = this.element.left //- this.startX;
	var targetNormalTop = this.element.top //- this.startY;
	var targetNormalWidth = this.element.width;
	var targetNormalHeight = this.element.height;
	
	this.transXTarget = this.transX*targetNormalWidth + targetNormalLeft;
	this.transYTarget = this.transY*targetNormalHeight + targetNormalTop;

	// account for two-pixel gutter; this is symmetric with Copy Motion's adjustment
	if (this.element.elementType == 'text')
	{
		//this.transX -= 2;
		//this.transY -= 2;
	}
	
	var transPoint = {x:this.transXTarget, y:this.transYTarget};
	
	// transform point using percentage of bounding box 
	setTransformationPointForElement(this.element, transPoint);

	// restore matrix
	this.element.matrix = this.matrix;
	// setting the x and y properties to workaround a bug where drawing object's don't move with matrix change to tx, ty 
	this.element.x = this.matrix.tx;
	this.element.y = this.matrix.ty;

	setTransformationPointForElement(this.element, transPoint);
	
}


matrixTransformPoint = function (matrix, pt) {
	var newX = matrix.a * pt.x + matrix.c * pt.y + matrix.tx;
	var newY = matrix.d * pt.y + matrix.b * pt.x + matrix.ty;
    return {x:newX, y:newY};
};

matrixDeltaTransformPoint = function (matrix, pt) {
	var newX = matrix.a * pt.x + matrix.c * pt.y;
	var newY = matrix.d * pt.y + matrix.b * pt.x;
    return {x:newX, y:newY};
};

// returns a success flag
MotionXMLImporter.prototype.prepareFrameAtIndex = function(frameIndex)
{
	this.frameIndex = frameIndex;
	makeKeyframe(this.frameIndex);
	selectFrameIndex(this.frameIndex);
	this.frame = getCurrentFrame();
	if (!this.frame) return false;
	elements = this.frame.elements;
	if (!elements.length) return false;
	this.element = elements[0];
	this.matrix = this.element.matrix;
	// ensure the object is selected on stage
	this.dom.selection = [this.element];
	
	return true;
}


MotionXMLImporter.prototype.addKeyframes = function()
{
	var motionChildrenLength = this.motionChildren.length();
	
	for (var i=0; i<motionChildrenLength; i++) 
	{
		var kf = this.motionChildren[i];
		
		if (kf.localName() == 'Keyframe') 
		{
			var index = parseInt(kf.@index);
			this.frameIndex = index + this.startFrameIndex;
			if (!this.prepareFrameAtIndex(this.frameIndex))
				continue;
			
			this.dom.setFilters(this.originalFilters);
				
			var kfc = kf.children();
			for (var kfci=0; kfci<kfc.length(); kfci++)
			{
				var kfChild = kfc[kfci];
				
				//////// COLOR ////////
				if (this.doColor && kfChild.localName() == 'color')
				{
					var color = kfChild.children()[0];
					this.importColor(color);
					
				}
				//////// FILTERS ////////
				else if (this.doFilters && kfChild.localName() == 'filters')
				{
					var filters = kfChild;
					var filtersChildren = filters.children();

					for (var fci=0; fci<filtersChildren.length(); fci++)
					{
						var filter = filtersChildren[fci];
						this.importFilter(filter);
					}
				}
				
			} // end keyframe children loop
				
			this.importFrameProperties(kf);
			this.importTransform(kf);
		}
	} //end first keyframe loop
	
	// remove the number of frames that were selected before paste
	var startFrameIndexClear = this.startFrameIndex + this.duration;
	var endFrameIndexClear = startFrameIndexClear + this.numSelectedFrames;
	this.timeline.removeFrames(startFrameIndexClear, endFrameIndexClear);
}


MotionXMLImporter.prototype.importFilter = function(filterXML)
{
	// avoid an error message if the object does not support filters
	var elementType = getElementType(this.element);
	if (   elementType != 'movie clip' 
		&& elementType != 'text' 
		&& elementType != 'button')
	{
		return;
	}
	
	var filterName = filterXML.localName();
	var atts = filterXML.attributes();
	if (!atts.length()) return;
	
	var dom = fl.getDocumentDOM();
	dom.addFilter(filterName);
	var filtersArray = dom.getFilters();
	var filter = filtersArray.pop();
	
	for (var i=0; i<atts.length(); i++)
	{
		var att = atts[i];
		var propName = att.localName();
		var propValue = att.toString();
		var attribType = MotionXMLExporter.prototype[filterName][propName];
		switch (attribType)
		{
			case 'number':
				propValue = Number(propValue);
				break;
			case 'boolean':
				propValue = (propValue == 'true');
				break;
			case 'array':
				propValue = parseArrayString(propValue);
				break;
			case 'string':
				propValue = String(propValue);
				break;
		}
		
		if (propName == 'strength')
		{
			propValue *= 100;
		}
		else if (propName == 'quality')
		{
			var qualityNames = ['', 'low', 'medium', 'high'];
			propValue = qualityNames[propValue];
		}
		else if (propName == 'alpha')
		{
			// skip alpha because we need to handle it together with color
			continue;
		}
		else if (propName == 'color')
		{
			var alphaDecimal = Number(filterXML.@alpha.toString());
			propValue = this.getColorAndAlphaStringForJS(propValue, alphaDecimal);
		}
		else if (propName == 'highlightAlpha')
		{
			// skip alpha because we need to handle it together with color
			continue;
		}
		else if (propName == 'highlightColor')
		{
			// combine color and alpha numbers into one string formatted for JSFL
			var alphaDecimal = Number(filterXML.@highlightAlpha.toString());
			propValue = this.getColorAndAlphaStringForJS(propValue, alphaDecimal);
		}
		else if (propName == 'shadowAlpha')
		{
			// skip alpha because we need to handle it together with color
			continue;
		}
		else if (propName == 'shadowColor')
		{
			// combine color and alpha numbers into one string formatted for JSFL
			var alphaDecimal = Number(filterXML.@shadowAlpha.toString());
			propValue = this.getColorAndAlphaStringForJS(propValue, alphaDecimal);
		}
		else if (propName == 'alphas')
		{
			// skip alpha because we need to handle it together with color
			continue;
		}
		else if (propName == 'colors')
		{
			propName = 'colorArray';
			var colorsArray = propValue;
			var alphasArrayString = filterXML.@alphas.toString();
			var alphasArray = parseArrayString(alphasArrayString);
			
			var colorsAndAlphasForJSArray = [];
			for (var pi=0; pi<colorsArray.length; pi++)
			{
				// combine color and alpha numbers into one string formatted for JSFL
				var colorString = colorsArray[pi];
				var alphaDecimal = Number(alphasArray[pi]);
				var colorAndAlphaStringForJS = this.getColorAndAlphaStringForJS(colorString, alphaDecimal);
				colorsAndAlphasForJSArray[pi] = colorAndAlphaStringForJS;
			}
			propValue = colorsAndAlphasForJSArray;
		}
		else if (propName == 'ratios')
		{
			propName = 'posArray';
			// convert each item from a string to a number
			for (var vi=0; vi<propValue.length; vi++)
			{
				propValue[vi] = Number(propValue[vi]);
			}
		}
		filter[propName] = propValue;
	}
	var filterEnabled = true;
	if (filterXML.@enabled.length())
		filterEnabled = (filterXML.@enabled == 'true');
	
	filter.enabled = filterEnabled;
	filtersArray.push(filter);
	dom.setFilters(filtersArray);
}



parseArrayString = function(arrayString)
{
	arrayString = arrayString.substring(1, arrayString.length-1);
	arrayString = stringReplace(arrayString, ' ', '');
	var valuesArray = arrayString.split(',');
	return valuesArray;
}


MotionXMLImporter.prototype.getColorAndAlphaStringForJS = function(colorString0x, alphaDecimal)
{
	var colorJS = '#' + colorString0x.slice(2);
	var alpha255 = Math.round(alphaDecimal * 255);
	if (alpha255 > 255) alpha255 = 255;
	else if (alpha255 < 0) alpha255 = 0;
	var alphaHex = alpha255.toString(16).toUpperCase();
	
	var colorAndAlphaStringForJS = colorJS + alphaHex;
	return colorAndAlphaStringForJS;
}



MotionXMLImporter.prototype.setOptions = function(options)
{
	this.options = options;
	this.doX =                     !options || (options.x == 'true'); 
	this.doY =                     !options || (options.y == 'true'); 
	this.doScaleX =                !options || (options.scaleX == 'true'); 
	this.doScaleY =                !options || (options.scaleY == 'true'); 
	this.doRotationAndSkew =       !options || (options.rotationAndSkew == 'true'); 
	this.doColor =                 !options || (options.color == 'true'); 
	this.doFilters =               !options || (options.filters == 'true'); 
	this.doBlendMode =             !options || (options.blendMode == 'true'); 
	this.overrideScale =           !options || (options.overrideScale == 'true');
	this.overrideRotationAndSkew = !options || (options.overrideRotationAndSkew == 'true');

}

MotionXMLImporter.prototype.addTweensToKeyframes = function()
{
	for (var i=0; i<this.motionChildren.length(); i++) 
	{
		var kf = this.motionChildren[i];
		if (kf.localName() != 'Keyframe') continue;
		
		this.frameIndex = parseInt(kf.@index) + this.startFrameIndex;
		
		if (!this.prepareFrameAtIndex(this.frameIndex))
			continue;

		// handle blank keyframes
		if (kf.@blank == 'true')
		{
			fl.getDocumentDOM().deleteSelection();
		}
		
		this.frame.tweenType = 'none'; // default
				
		var kfc = kf.children();
		for (var kfci=0; kfci<kfc.length(); kfci++)
		{
			var kfChild = kfc[kfci];
			//////// TWEENS ////////
			if (kfChild.localName() == 'tweens')
			{
				var tweens = kfChild;
				this.importTweens(tweens);
			}
			
		} // end keyframe children loop
	} // end keyframes loop 2nd pass
}

MotionXMLImporter.prototype.findSource = function(xmlString)
{
	this.motion = new XML(xmlString);
	this.motionChildren = this.motion.children();
	this.source = null;
	this.sourceChildren = null;
	this.sourceChildrenLength = 0;

	// find the source tag
	for (var si=0; si<this.motionChildren.length(); si++) 
	{
		var motionChild = this.motionChildren[si];
		if (motionChild.localName() != 'source') continue;
		
		motionChild = motionChild.children()[0];
		if (motionChild.localName() == 'Source')
		{
			this.source = motionChild;
			this.sourceChildren = this.source.children();
			this.sourceChildrenLength = this.sourceChildren.length();
		}	
		break;
	}
}

MotionXMLImporter.prototype.restoreTimelineState = function()
{
	// restore the original frame selection before pasting
	this.timeline.setSelectedFrames(this.selFramesArray);
	// return the playhead to where it was when we started 
	this.timeline.currentFrame = this.currentFrameIndex;
	this.layer.visible = this.layerWasVisible;
	this.layer.locked = this.layerWasLocked;
}

MotionXMLImporter.prototype.setupTimeline = function()
{
	this.dom = fl.getDocumentDOM();
	this.timeline = this.dom.getTimeline();
	this.layer = this.timeline.layers[this.timeline.currentLayer];
	this.layerWasVisible = this.layer.visible;
	this.layer.visible = true;
	this.layerWasLocked = this.layer.locked;
	this.layer.locked = false;

	this.selFramesArray = this.timeline.getSelectedFrames();
	
	this.startFrameIndex = getFirstSelectedFrameIndex();
	this.endSelectedFrameIndex = this.selFramesArray[2]; // end index is not included in selection
	// store this so we can remove that number of frames after pasting--users prefer paste that replaces
	this.numSelectedFrames = this.endSelectedFrameIndex - this.startFrameIndex;
	
	// the playhead could be at a different place than the selection 
	this.currentFrameIndex = fl.getDocumentDOM().getTimeline().currentFrame;
	this.duration = parseInt(this.motion.@duration);
	this.frame = getCurrentFrame();
	
	if (!this.frame || !this.selFramesArray || !this.selFramesArray.length) 
	{
		alert(PasteMotionErrorStrings.NO_SELECTION);
		return false;
	}
	
	this.elements = this.frame.elements;
	if (!this.elements.length)
	{
		var msg = PasteMotionErrorStrings.NO_OBJECTS.replace('{1}', (this.startFrameIndex+1));
		alert(msg);
		return false;
	}
	else if (this.elements.length > 1)
	{
		var msg = PasteMotionErrorStrings.MULTIPLE_OBJECTS.replace('{1}', (this.startFrameIndex+1));
		alert(msg);
		return false;
	}
	else if (this.selFramesArray.length > 3)
	{
		alert(PasteMotionErrorStrings.MULTIPLE_SPANS); 
		return false;
	}

	insertFramesBefore(this.duration, this.startFrameIndex);
	selectFrameIndex(this.startFrameIndex);
	this.element = this.elements[0];
	this.matrix = this.element.matrix;
	
	if (!this.overrideScale)
	{
		this.scaleXStart = getScaleX(this.matrix);
		this.scaleYStart = getScaleY(this.matrix);
	}
	else
	{
		var scaleXSource = 1;
		if (this.source.@scaleX.length())
			scaleXSource = Number(this.source.@scaleX);
			
		var scaleYSource = 1;
		if (this.source.@scaleY.length())
			scaleYSource = Number(this.source.@scaleY);

		this.scaleXStart = scaleXSource;
		this.scaleYStart = scaleYSource;
	}
	
	if (!this.overrideRotationAndSkew)
	{
		this.skewXStart = getSkewX(this.matrix);
		this.skewYStart = getSkewY(this.matrix);
	}
	else
	{
		var skewXSource = 0;
		var skewYSource = 0;
		
		if (this.source.@rotation.length())
		{
			skewXSource = skewYSource = Number(this.source.@rotation);
		}	
			
			
		if (this.source.@skewX.length())
			skewXSource = Number(this.source.@skewX);

		if (this.source.@skewY.length())
			skewYSource = Number(this.source.@skewY);
		
		this.skewXStart = skewXSource;
		this.skewYStart = skewYSource;
	}
	
	this.importTransformPoint();
	this.startX = getX(this.element);
	this.startY = getY(this.element);
	this.originalFilters = this.dom.getFilters();
	return true;
}

MotionXMLImporter.prototype.importXMLString = function(xmlString, options)
{
	if (!xmlString) return false;
	this.setOptions(options);
	this.findSource(xmlString);
	if (!this.setupTimeline()) return false;
	this.addKeyframes();
	this.addTweensToKeyframes();
	this.importMotionGuide();
	this.restoreTimelineState(); 
	return true;
} 

