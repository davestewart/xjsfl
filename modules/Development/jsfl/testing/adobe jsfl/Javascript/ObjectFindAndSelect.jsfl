// Utility functions for walking the DOM and doing object selection

var FlashUtils_globalObj = {
	contents: [],
	libItems: [],
	debuggerStringOn: false
};

FlashUtils_debugString = function(msg)
{
	if (FlashUtils_globalObj.debuggerStringOn)
		fl.trace(msg);
}

FlashUtils_libraryItemWasNotSearched = function(item)
{
	for (var i = 0; i < FlashUtils_globalObj.libItems.length; i++)
	{
		if (FlashUtils_globalObj.libItems[i] == item)
		{
			return false;
		}
	}
	return true;
}

FlashUtils_findObjectInTimelineByType = function(objType, objTimeline, elementParent)
{
	FlashUtils_debugString("timeline: " + objTimeline.name);
	for (var j = 0; j < objTimeline.layers.length; j++)
	{
		FlashUtils_debugString("   layer: " + objTimeline.layers[j].name);
		var frameArray = objTimeline.layers[j].frames;
		var k;
		for (k = 0; k < frameArray.length; k++)
		{
			// only care about keyframes
			if (k == frameArray[k].startFrame)
			{
				var frame = frameArray[k]
				FlashUtils_debugString("      keyframe: " + frame.name);
				var items = frame.elements;
				for (var l = 0; l < items.length; l++)
				{
					if (items[l].elementType == objType)
					{
						var elementObj = {
							obj: items[l],
							keyframe: objTimeline.layers[j].frames[k],
							layer: objTimeline.layers[j],
							timeline: objTimeline,
							parent: elementParent
						};
						
						FlashUtils_globalObj.contents.push(elementObj);

						FlashUtils_debugString("         element: " + items[l].name + " type: " + items[l].elementType);
					}
					else if (items[l].elementType == "instance")
					{
						if (FlashUtils_libraryItemWasNotSearched(items[l].libraryItem))
						{
							var nextSymbolItemObj = items[l].libraryItem;
							FlashUtils_debugString("         symbol item in library: " + nextSymbolItemObj.name + " symbol type: " + nextSymbolItemObj.symbolType);
							
							// search children of instances
							var elementObj = {
								obj: items[l],
								keyframe: objTimeline.layers[j].frames[k],
								layer: objTimeline.layers[j],
								timeline: objTimeline,
								parent: elementParent
							};
							
							// track lib items in separate array
							FlashUtils_globalObj.libItems.push(nextSymbolItemObj);
							
							FlashUtils_findObjectInTimelineByType(objType, nextSymbolItemObj.timeline, elementObj);
						}
					}
				}
			}
		}
	}
}


FlashUtils_findObjectInTimelineByName = function(objName, objTimeline, elementParent)
{
	FlashUtils_debugString("timeline: " + objTimeline.name);
	for (var j = 0; j < objTimeline.layers.length; j++)
	{
		FlashUtils_debugString("   layer: " + objTimeline.layers[j].name);
		var frameArray = objTimeline.layers[j].frames;
		for (var k = 0; k < frameArray.length; k++)
		{
			// only care about keyframes
			if (k == frameArray[k].startFrame)
			{
				var frame = frameArray[k]
				FlashUtils_debugString("      keyframe: " + frame.name);
				var items = frame.elements;
				for (var l = 0; l < items.length; l++)
				{
					if (items[l].name == objName)
					{
						var elementObj = {
							obj: items[l],
							keyframe: objTimeline.layers[j].frames[k],
							layer: objTimeline.layers[j],
							timeline: objTimeline,
							parent: elementParent
						};
						
						FlashUtils_globalObj.contents.push(elementObj);

						FlashUtils_debugString("         element: " + items[l].name + " type: " + items[l].elementType);
					}
					else if (items[l].elementType == "instance")
					{
						if (FlashUtils_libraryItemWasNotSearched(items[l].libraryItem))
						{
							var nextSymbolItemObj = items[l].libraryItem;
							FlashUtils_debugString("         symbol item in library: " + nextSymbolItemObj.name + " symbol type: " + nextSymbolItemObj.symbolType);
							
							// search children of instances
							var elementObj = {
								obj: items[l],
								keyframe: objTimeline.layers[j].frames[k],
								layer: objTimeline.layers[j],
								timeline: objTimeline,
								parent: elementParent
							};
						
							// track lib items in separate array
							FlashUtils_globalObj.libItems.push(nextSymbolItemObj);
							
							FlashUtils_findObjectInTimelineByName(objName, nextSymbolItemObj.timeline, elementObj);
						}
					}
				}
			}
		}			
	}
}


FlashUtils_clearGlobalArrays = function()
{
	FlashUtils_globalObj.contents.length = 0;
	FlashUtils_globalObj.libItems.length = 0;
}


FlashUtils_getIndexOfObject = function(objArray, obj)
{
	for (var i = 0; i < objArray.length; i++)
	{
		if (obj == objArray[i])
		{
			return i;
		}
	}
	return -1;
}


/////////////////////////////////
// Flash object methods:
/////////////////////////////////

flash.findObjectInDocByName = function(nameToSearchFor, doc)
{
	FlashUtils_clearGlobalArrays();
	for (var i = 0; i < doc.timelines.length; i++)
	{
		FlashUtils_findObjectInTimelineByName(nameToSearchFor, doc.timelines[i], undefined);
	}
	return FlashUtils_globalObj.contents;
}


flash.findObjectInDocByType = function(typeToSearchFor, doc)
{
	FlashUtils_clearGlobalArrays();
	for (var i = 0; i < doc.timelines.length; i++)
	{
		FlashUtils_findObjectInTimelineByType(typeToSearchFor, doc.timelines[i], undefined);
	}
	return FlashUtils_globalObj.contents;
}


// assumes that initial call to this function is from the main timeline view
//
flash.selectElement = function(elementData, editSymbol)
{
	if (elementData.parent != undefined)
	{
		// go up one level
		flash.selectElement(elementData.parent, true);
	}
	else
	{
		FlashUtils_debugString("flash.selectElement function: element is on the main timeline");
	}
	
	// select the layer, keyframe and element in the symbol instance
	var layerIndex = FlashUtils_getIndexOfObject(elementData.timeline.layers, elementData.layer);
	var frameIndex = FlashUtils_getIndexOfObject(elementData.layer.frames, elementData.keyframe);
	if ((layerIndex >= 0) && (frameIndex >= 0))
	{
		// go to obj keyframe
		elementData.timeline.setSelectedLayers(layerIndex);
		elementData.timeline.setSelectedFrames(frameIndex, frameIndex);
		
		// clear all selections in keyframe
		fl.getDocumentDOM().selectNone();

		// select the obj
		elementData.obj.selected = true;
		
		if (editSymbol)
		{
			// switch to editing the symbol item associated with instance
			document.enterEditMode('inPlace');
		}
	}
	else
	{
		FlashUtils_debugString("flash.selectElement function: parent: failed to get valid layerIndex: " + layerIndex + " or frameIndex: " + frameIndex);
	}
}
