function init()
{
	AdobePatentID = "B557";

	fl.showAlertOnError = true;
	
	IGNORE_WHITESPACE_OLD = XML.ignoreWhitespace;
	IGNORE_COMMENTS_OLD = XML.ignoreComments;
	IGNORE_PROC_INSTRUCTIONS_OLD = XML.ignoreProcessingInstructions;
	PRETTY_PRINTING_OLD = XML.prettyPrinting;
	XML.ignoreWhitespace = true;
	XML.ignoreComments = true;
	XML.ignoreProcessingInstructions = true;
	XML.prettyPrinting = true; // affects whitespace between nodes

	XFL_FOLDER = '';
	UCF_ROOT_XML_NAME = 'DOMDocument';
	
}
	
function cleanUp()
{
	default xml namespace = '';
	XML.ignoreWhitespace = IGNORE_WHITESPACE_OLD;
	XML.ignoreComments = IGNORE_COMMENTS_OLD;
	XML.ignoreProcessingInstructions = IGNORE_PROC_INSTRUCTIONS_OLD;
	XML.prettyPrinting = PRETTY_PRINTING_OLD;
}

function describeType(typeName)
{
	return TYPE_LISTING.type.(@name==typeName);
}

function getPropertyType(typeName, propertyName)
{
	var typeInfo = describeType(typeName);
	var accessor = typeInfo.accessor.(@name==propertyName);
	return String(accessor.@type);
}

function toBoolean(attributeXML, defaultValue)
{
	if (!attributeXML) return defaultValue;
	if (defaultValue)
		return String(attributeXML).toLowerCase() != 'false'; 
	return String(attributeXML).toLowerCase() == 'true';
}



function getQualifiedClassName(o)
{
	for each (var type in TYPE_LISTING.type)
	{
		var name = String(type.@name);
		var classConstructor = eval(name);
		if (o.constructor == classConstructor)
		{
			return name;
		}
	}
	return '';
}

function fromMXMLCopyProperties(xml, obj, fullClassName)
{
	if (!obj || !xml || !xml.length()) return null;
	if (!fullClassName)
		fullClassName = xml.localName();
		
	var typeInfo = describeType(fullClassName); 
	var propertyList = typeInfo.accessor; 
	// Loop through the schema and copy each property from XFL,
	// so the defaults are strictly enforced.
	for each (var propertyInfo in propertyList)
	{
		var attribName = String(propertyInfo.@name);
		var attrib = xml.@[attribName];
		var attribValue = null;
		if (attrib.length())
		{
			attribValue = String(attrib);
		}
		else if (String(propertyInfo.@defaultValue))
		{	// If the attribute isn't defined in the XFL, grab the schema's default value, if there is one.
			attribValue = String(propertyInfo.@defaultValue);
		}
		if (attribValue == null || attribValue === 'undefined')
			continue;
		
		var propertyType = String(propertyInfo.@type);
		var propertyValue = null;
		switch (propertyType)
		{
			case 'String':  propertyValue = attribValue; break;
			case 'Boolean': propertyValue = (attribValue.toLowerCase() == 'true'); break;
			case 'Number':  propertyValue = Number(attribValue); break;
			default:	   
		}
		obj[attribName] = propertyValue;
	}				
	// Using this return value is optional, because
	// the object is passed by reference and will be changed anyway.
	return obj;
	
}

function setDocumentXML(documentXML)
{
	var typeListingURI = fl.configURI + 'Javascript/Scripts/XFLTypeListingForImport.xml';
	var typeListingString =  FLfile.read(typeListingURI);
	TYPE_LISTING = new XML(typeListingString);
	
	var document = fl.createDocument('timeline');
	if (!document) return;
	DOM2 = document.DOM2;
	if (!DOM2 || (DOM2 == undefined))
	{
		// last chance
		document = fl.getDocumentDOM();
		DOM2 = document.DOM2;
		if (!DOM2 || (DOM2 == undefined))
		{
			fl.trace("DOM2 is not valid: " + DOM2);
			return;
		}
	}
	fromMXMLCopyProperties(documentXML, DOM2, 'DOMDocument');
	
	var paperBounds = DOM2.paperBounds;
	paperBounds.left = 0;
	paperBounds.top = 0;
	paperBounds.right = Number(documentXML.@width) || 550;
	paperBounds.bottom = Number(documentXML.@height) || 400;
	DOM2.paperBounds = paperBounds;
	
	var gridX = Number(documentXML.@gridSpacingX);
	var gridY = Number(documentXML.@gridSpacingY);
	if (gridX && gridY)
	{
		var gridSpacing = DOM2.gridSpacing;
		gridSpacing.x = gridX;
		gridSpacing.y = gridY;
		DOM2.gridSpacing = gridSpacing;
	}
	
	//IMPORTANT: The bitmaps and other media must be created before the symbols,
	//because symbols can contain bitmaps, but not vice versa.
	setItemsXML(document.library, documentXML.folders.children());
	setItemsXML(document.library, documentXML.media.children());
	setItemsXML(document.library, documentXML.fonts.children());
	setItemsXML(document.library, documentXML.symbols.children());
	
	
	var timelinesXML = documentXML.timelines.children();
	for (var i=0; i<timelinesXML.length(); i++)
	{
		var timelineXML = timelinesXML[i];
		document.addNewScene(timelineXML.@name);
		// remove the default scene
		if (i == 0)
		{ 
			document.editScene(0);
			document.deleteScene();
		}
		var lastIndex = DOM2.timelines.length-1;
		document.editScene(lastIndex);
		var timeline = document.timelines[lastIndex];
		var timelineDOM2 = DOM2.timelines[lastIndex];
		setTimelineXML(timelineDOM2, timelineXML);
	}
	document.currentTimeline = Number(documentXML.@currentTimeline);
	document = fl.getDocumentDOM();
	
	importMetadata(DOM2);
	importPublishSettings(DOM2);
	importMobileSettings(document);
			
	document.selectNone();
	document.getTimeline().setSelectedFrames([]);
	var timeline = document.getTimeline();
	timeline.currentFrame = 0;
	var timeline0XML = timelinesXML[0];
	if (timeline0XML && timeline0XML.length())
	{
		timeline.currentFrame = Number(timeline0XML.@currentFrame) || 0;
	}
	
	
	DOM2.refreshLibraryPanel();
	DOM2.refreshStage();
}

function importMetadata(dom2)
{
	var metadataURI = XFL_FOLDER + 'META-INF/metadata.xml';
	var xmlString = FLfile.read(metadataURI);
	if (!xmlString) 
		return;
	dom2.metadata = xmlString; 
}

function importPublishSettings(dom2)
{
	var publishSettingsURI = XFL_FOLDER + 'PublishSettings.xml';
	var xmlString = FLfile.read(publishSettingsURI);
	if (!xmlString) 
		return;
	dom2.publishSettings = xmlString; 
}

function importMobileSettings(document)
{
	var mobileSettingsURI = XFL_FOLDER + 'MobileSettings.xml';
	var xmlString = FLfile.read(mobileSettingsURI);
	if (!xmlString) 
		return;
	document.setMobileSettings(xmlString);
}

function setItemsXML(library, itemsXML)
{
	if (!itemsXML || !itemsXML.length())
		return;
		
	var len = itemsXML.length();
	for (var i=0; i<len; i++)
	{
		var itemXML = itemsXML[i];
		setItemXML(library, itemXML);
		fl.updateProgressBar(i*100/len);
	}
}

function setItemXML(library, itemXML)
{
	var item = null;
	
	var tagName = itemXML.localName();
	switch (tagName)
	{
		case 'Include':
			var itemSourceXML = getIncludeXML(itemXML);
			item = setItemXML(library, itemSourceXML);
			break;
		case 'DOMFolderItem':
			item = setFolderItemXML(library, itemXML);
			break;
		case 'DOMBitmapItem':
			item = setBitmapItemXML(library, itemXML);
			break;
		case 'DOMFontItem':
			item = setFontItemXML(library, itemXML);
			break;
		case 'DOMSoundItem':
			item = setSoundItemXML(library, itemXML);
			break;
		case 'DOMVideoItem':
			item = setVideoItemXML(library, itemXML);
			break;
		case 'DOMCompiledClipItem':
			item = setCompiledClipItemXML(library, itemXML);
			break;
		case 'DOMSymbolItem':
		case 'DOMComponentItem':
			item = setSymbolItemXML(library, itemXML);
			break;
	}
	
	importItemProperties(itemXML, item);
	
	return item;
}

function importItemProperties(itemXML, item)
{
	if (!item) return;
	
	var tagName = itemXML.localName();
	if (tagName == 'FolderItem' 
		|| tagName == 'DOMFolderItem'
		|| tagName == 'DOMVideoItem'
		|| tagName == 'DOMCompiledClipItem'
		//|| tagName == 'DOMComponentItem'
		|| tagName == 'Include'
		) 
		return;

	fromMXMLCopyProperties(itemXML, item, 'DOMItem');
	var importForRS = itemXML.@linkageImportForRS;
	if (importForRS == 'true') {
		item.linkageImportForRS = true;
	}
	if (item.linkageExportForAS || item.linkageImportForRS)
	{
		var fullClassName = (item.linkageExportForAS) ? 'DOMItem_linkageExportForAS' : 'DOMItem_linkageImportForRS';
		fromMXMLCopyProperties(itemXML, item, fullClassName);
		var linkageID = String(itemXML.@linkageIdentifier);
		if (linkageID)
		{
			item.linkageIdentifier = linkageID;
		}
	}
	//else if (!item.linkageExportForRS)
	//{
		//var importForRS = String(itemXML.@linkageImportForRS);
		//item.linkageImportForRS = (importForRS == 'true');
	//}
	
}


function getIncludeXML(includeXML)
{ 
	// assume a relative URI
	var targetURI = XFL_FOLDER + (String(includeXML.@href));
	var xmlString = FLfile.read(targetURI);
	var x = new XML(xmlString);
	return x;
}


function setCompiledClipItemXML(library, cciXML)
{
	var dom = fl.getDocumentDOM(); 
	var itemName = String(cciXML.@name);
	var swcURI = String(cciXML.@swcPath);
	var swcURIAbsolute = XFL_FOLDER + swcURI;
	var loadSWCSuccess = DOM2.importComponentFromSWC(swcURIAbsolute, itemName);
	var cci = findItem(itemName);
	fromMXMLCopyProperties(cciXML, cci, 'DOMCompiledClipItem');
}


function setBitmapItemXML(library, bitmapItemXML)
{
	var dom = fl.getDocumentDOM(); 
	var itemName = String(bitmapItemXML.@name);
	var href = String(bitmapItemXML.@href);
	var bitmapItem = importMediaFile(href, itemName);
	
	fromMXMLCopyProperties(bitmapItemXML, bitmapItem, 'DOMBitmapItem');

	var compressionType = String(bitmapItemXML.@compressionType);
	
	var USE_IMPORTED_JPEG_DATA = 0; // for reference
	var LOSSLESS_IMAGE_DATA = 1; // for reference
	var DONT_USE_IMPORTED_JPEG_DATA = 2; // for reference
	if (compressionType == 'photo')
	{
		bitmapItem.quality = Number(bitmapItemXML.@quality) || 100;
		// default is true
		var useImportedJPEGData = (bitmapItemXML.@useImportedJPEGData != 'false');
		if (useImportedJPEGData)
		{
			bitmapItem.compressionTypeAsInt = USE_IMPORTED_JPEG_DATA;
		}
		else
		{
			bitmapItem.compressionTypeAsInt = DONT_USE_IMPORTED_JPEG_DATA;
		}
	}
	else
	{
		bitmapItem.compressionTypeAsInt = LOSSLESS_IMAGE_DATA;
	}
	fl.getDocumentDOM().exitEditMode();
	return bitmapItem;
}

function setVideoItemXML(library, videoItemXML)
{	
	var href = String(videoItemXML.@href);
	var itemName = String(videoItemXML.@name);
	var videoItem = importMediaFile(href, itemName);
	
	fl.getDocumentDOM().exitEditMode();
	return videoItem;
}

function setSoundItemXML(library, soundItemXML)
{	
	var href = String(soundItemXML.@href);
	var itemName = String(soundItemXML.@name);
	var soundItem = importMediaFile(href, itemName);
	
	fl.getDocumentDOM().exitEditMode();
	return soundItem;
}

function importMediaFile(href, itemName)
{
	var libraryFoldersArray = itemName.split('/');
	var itemNameLocal = libraryFoldersArray.pop();
	// Imported assets land in the library root before being moved to a folder.
	// There could be two items with the same local name, one in the root,
	// so check for it and rename temporarily to avoid a collision.
	var existingItemInRoot = findItem(itemNameLocal);
	if (existingItemInRoot)
	{
		existingItemInRoot.name = '__XFL_IMPORT_TEMP__';
	}
	var uri = XFL_FOLDER + (href);
	var dom = fl.getDocumentDOM(); 
	var libraryItemName = dom.DOM2.importFile(uri);
	if (!libraryItemName.length)
		return;
		
	var item = findItem(libraryItemName);
	if (!item)
		return;
		
	item.name = itemNameLocal;
	var library = dom.library;
	// create the folder structure in the library
	if (libraryFoldersArray.length)
	{
		var libraryFolderPath = libraryFoldersArray.join('/');
		library.newFolder(libraryFolderPath);
		if (item)
			library.moveToFolder(libraryFolderPath, item.name);
	}
	
	if (existingItemInRoot)
	{
		existingItemInRoot.name = itemNameLocal;
	}
	return item;
}

function setFontItemXML(library, fontItemXML)
{
    var itemName = String(fontItemXML.@name);
    DOM2.addNewItem('font', itemName);
    var fontItem = findItem(itemName);
    fromMXMLCopyProperties(fontItemXML, fontItem, 'DOMFontItem');
    var fontName = String(fontItemXML.@font);
    if (!fl.isFontInstalled(fontName))
    {
        fl.trace('--- MISSING FONT: ' + fontName + ' is not installed');
        fontName = fl.defaultFontName;
    }
    fontItem.font = fontName;
    return fontItem;
}


function setFolderItemXML(library, folderItemXML)
{
	var itemName = String(folderItemXML.@name);
	library.addNewItem('folder', itemName);
	var folderItem = findItem(itemName); 
	folderItem.isExpanded = (String(folderItemXML.@isExpanded) == 'true'); // default is false
	//DOM2.refreshLibraryPanel();
	return folderItem;
}

function setComponentItemXML(ci, ciXML)
{
	fromMXMLCopyProperties(ciXML, ci.timeline, 'DOMComponentItem_timeline');
}



function setSymbolItemXML(library, symbolItemXML)
{
	var itemName = String(symbolItemXML.@name);
	var symbolType = String(symbolItemXML.@symbolType) || 'movie clip';

	var symbolItem = null;
	var timelineXML = null;
	
	// first check if the symbol exists
	symbolItem = findSymbolItem(itemName);
	if (symbolItem == null)
	{
		DOM2.addNewItem(symbolType, itemName);
		symbolItem = findSymbolItem(itemName);
	}
	else
	{
		// make sure it's the right type, because it could have been created in some other proces
		symbolItem.symbolType = symbolType;
	}
	if (symbolItemXML.@isFlexComponent == 'true') {
		symbolItem.isFlexComponent = true;
	}
	if (symbolItemXML.@isSpriteSubclass == 'true') {
		symbolItem.isSpriteSubclass = true;
	}
	timelineXML = symbolItemXML.timeline.DOMTimeline[0];

	
	library.editItem(symbolItem.name);
	setTimelineXML(symbolItem.timeline, timelineXML);
	
	if (symbolItemXML.localName() == 'DOMComponentItem')
	{
		setComponentItemXML(symbolItem, symbolItemXML);
	}
	
	if (symbolItemXML.@scaleGridLeft.length())
	{
		symbolItem.timeline.scalingGrid = true;
		var s9Left = Number(symbolItemXML.@scaleGridLeft);
		var s9Top = Number(symbolItemXML.@scaleGridTop);
		var s9Right = Number(symbolItemXML.@scaleGridRight);
		var s9Bottom = Number(symbolItemXML.@scaleGridBottom);
		var gridRect = {left:s9Left, top:s9Top, right:s9Right, bottom:s9Bottom};
		
		symbolItem.timeline.scalingGridRect = gridRect;
	}
	
	fl.getDocumentDOM().exitEditMode();
	return symbolItem;
}

// The timeline must exist before calling this method. 
// Documents, SymbolItems and Screens have timelines.
function setTimelineXML(timeline, timelineXML, timelineDOM2)
{
	if (!timelineXML)
		return;
	
	var timelineDOM1 = fl.getDocumentDOM().getTimeline();
	var layersXML = timelineXML.layers.DOMLayer;
	var currentLayerIndex = 0;
	for (var i=0; i<layersXML.length(); i++)
	{
		var layerXML = layersXML[i];
		setLayerXML(timeline, layerXML, i);
		if (String(layerXML.@current) == 'true')
		{
			currentLayerIndex = i;
		}
	}
	fromMXMLCopyProperties(timelineXML, timeline, 'DOMTimeline');
	var parmsXML = timelineXML.parametersAsXML.children();
	var parmsXMLString = parmsXML.toXMLString();
	timeline.parametersAsXML = parmsXMLString;
	
	// restore current layer state in the timeline
	var layer = timeline.layers[currentLayerIndex];
	layer.current = true;
}

 
function findLayerAboveByName(timeline, targetLayerName, currentLayerIndex)
{
	for (var i=currentLayerIndex-1; i>=0; i--)
	{
		var layer = timeline.layers[i];
		if (layer.name == targetLayerName)
		{
			return layer;
		}
	}
	return null;
}

// layerIndex is optional. It is used when a Timeline is being created from scratch,
// in order to properly replace the default layer (a Timeline cannot have 0 layers) with the first layer.
function setLayerXML(timeline, layerXML, layerIndex) //, timelineDOM2)
{
	var timelineDOM1 = fl.getDocumentDOM().getTimeline();
	var bDeleteOriginalLayer = false;
	//// create the layer
	var layerType = String(layerXML.@layerType) || 'normal';
	var addLayerAbove = false;
	var newLayerIndex = timeline.addNewLayer(layerXML.@name, layerType, addLayerAbove);
	if (layerIndex == null)
	{
		layerIndex = newLayerIndex;
	}
	// Replace the timeline's default layer.
	else if (layerIndex == 0)
	{
		bDeleteOriginalLayer = true;
		layerIndex = newLayerIndex;
	}
	
	var layer = timeline.layers[layerIndex];
	// make sure the layer can be edited
	layer.locked = false;
	layer.visible = true;
	
	if (layerXML.@parentLayerIndex.length())
	{
		var parentLayerIndex = parseInt(layerXML.@parentLayerIndex);
		layer.parentLayer = timeline.layers[parentLayerIndex];
	}
	
	//// give the layer the correct number of frames
	var frameCount = Number(layerXML.@frameCount) || 0; // default is 0
	if (bDeleteOriginalLayer)
	{
		// make sure original layer is as long as next layer
		timelineDOM1.currentLayer = 0;
		timelineDOM1.currentFrame = 0;
		timelineDOM1.insertFrames(frameCount-1, false, 1);
	}
	timelineDOM1.currentLayer = layerIndex;
	timelineDOM1.currentFrame = 0;
	if (layer.frameCount > frameCount)
	{
		timelineDOM1.removeFrames(frameCount, layer.frameCount);
	}
	else if (layer.frameCount < frameCount)
	{
		timelineDOM1.insertFrames(frameCount-layer.frameCount, false, layer.frameCount-1);
	}
		
	//// create child frames
	var framesXML = layerXML.frames.DOMFrame;
	
	for (var i=0; i<framesXML.length(); i++)
	{
		timelineDOM1.currentLayer = layerIndex;
		var frameXML = framesXML[i];
		setFrameXML(layer, frameXML);
	}
	
	
	// Do a second pass to add tweens to keyframes.
	// This is necessary because non-ending motion tween arrows trail out from frames, 
	// and mess up new frames that are added to the right.
	for (var i=0; i<framesXML.length(); i++)
	{
		timelineDOM1.currentLayer = layerIndex;
		var frameXML = framesXML[i];
		setFrameTweenPropertiesXML(layer, frameXML);
	}
	
	
	var color = String(layerXML.@color);
	if (color)
		layer.color = getColorAndAlphaStringForJS(color);
	
	fromMXMLCopyProperties(layerXML, layer, 'DOMLayer');	

	if (bDeleteOriginalLayer)
	{
		timelineDOM1.deleteLayer(0);
	}
}

function setFrameXML(layer, frameXML) 
{
	var frameIndex = Number(frameXML.@index);
	var timeline = fl.getDocumentDOM().getTimeline();
	if (!layer.frames[frameIndex] || frameIndex > 0)
	{
		if (frameIndex == 1)
		{
			timeline.convertToBlankKeyframes(0, 1);
		}
		else
		{
			timeline.convertToBlankKeyframes(frameIndex, frameIndex+1);
		}
	}
	var frame = layer.frames[frameIndex];
	if (!frame)
	{
		return;
	}
	timeline.currentFrame = frameIndex;
		
	frame.tweenType = 'none';
	
	if (frameXML.actionScript.length())
	{
		frame.actionScript = String(frameXML.actionScript);
	}
	
	setElementsXML(frame, frameXML.elements.children());
	fromMXMLCopyProperties(frameXML, frame, 'DOMFrame');
	
	if (frameXML.@envelopeMark44.length())
	{
		var envelopeMark44Array = String(frameXML.@envelopeMark44).split(',');
		frame.envelopeMark44 = envelopeMark44Array;
	}
	if (frameXML.@envelopeLevel0.length())
	{
		frame.envelopeLevel0 = String(frameXML.@envelopeLevel0).split(',');
	}
	if (frameXML.@envelopeLevel1.length())
	{
		frame.envelopeLevel1 = String(frameXML.@envelopeLevel1).split(',');
	}
	
}


function setFrameTweenPropertiesXML(layer, frameXML)
{
	var timeline = fl.getDocumentDOM().getTimeline();
	var frameIndex = Number(frameXML.@index);
	var frame = layer.frames[frameIndex];
	
	fromMXMLCopyProperties(frameXML, frame, 'FrameTweenProperties');
	
	if (frameXML.tweens.length())
	{
		setTweensXML(frame, frameXML.tweens);
	}
	
	fromMXMLCopyProperties(frameXML, frame, 'MotionObjectProperties');
	var mns = new Namespace('http://ns.adobe.com/xfl/2008/motion');
	var motionObjectXML = frameXML.mns::motionObjectXML;
	if (motionObjectXML.length())
	{
		var motionObjectXMLString = motionObjectXML.children().toXMLString();
		if (motionObjectXMLString.length)
		{
			frame.motionObjectXML = motionObjectXMLString;
		}
	}
	
}


function customEaseXMLToPoints(customEaseXML)
{
	if (!customEaseXML || !customEaseXML.length())
		return null;
		
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

function setTweensXML(frame, tweensXML)
{
	var tweensChildren = tweensXML.children();
	for (var tci=0; tci<tweensChildren.length(); tci++)
	{
		var tween = tweensChildren[tci];
		var tweenTarget = String(tween.@target);
		if (tween.localName() == 'CustomEase')
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
				
				frame.setCustomEase(customEaseTarget, pts);
			}
		}
	}
}

function setElementsXML(frame, elementsXML)
{
	if (!elementsXML || !elementsXML.length())
		return;
	var newElements = [];
	for (var ei=0; ei<elementsXML.length(); ei++)
	{
		var elementXML = elementsXML[ei];
		var element = setElementXML(frame, elementXML);
		if (element)
			newElements.push(element);
		
		fl.updateProgressBar(ei*100/elementsXML.length());
	}
	return newElements;
}
	
function setElementXML(frame, elementXML)
{
	var element = null;
	var tagName = elementXML.localName();
	switch(tagName)
	{
		case 'DOMShape': 
		case 'DOMGroup': 
			element = setShapeXML(frame, elementXML);
			break;
		case 'DOMOvalObject':
		case 'DOMRectangleObject':
			element = setPrimitiveXML(frame, elementXML);
			break;
		case 'DOMSymbolInstance':
		case 'DOMComponentInstance':
			element = setSymbolInstanceXML(frame, elementXML);
			break;
		case 'DOMCompiledClipInstance':
			element = setCompiledClipInstanceXML(frame, elementXML);
			break;
		case 'DOMBitmapInstance':
			element = setBitmapInstanceXML(frame, elementXML);
			break;
		case 'DOMVideoInstance':
			element = setVideoInstanceXML(frame, elementXML);
			break;
		case 'DOMStaticText':
		case 'DOMDynamicText':
		case 'DOMInputText':
			element = setTextXML(frame, elementXML);
			break;
		default:
	}
				
	if (!element) return null;
	
	fromMXMLCopyProperties(elementXML, element, 'DOMElement');
	var isDrawingObject = (String(elementXML.@isDrawingObject) == 'true');
	var isRawShape = (tagName == 'DOMShape' && !isDrawingObject);
	// raw shapes don't use matrices and transformation points
	if (!(isRawShape || tagName == 'DOMStaticText'))
	{
		var elementMatrixXML = elementXML.matrix.Matrix;
 		var matrix = element.matrix;
		setMatrixXML(matrix, elementMatrixXML);
		element.matrix = matrix;
		//For primitives, setting the matrix doesn't change the tx and ty, so forcing it with .x and .y.
		element.x = matrix.tx;
		element.y = matrix.ty;
		setTransformationPointXML(element, elementXML.transformationPoint[0]);
	}
		
	
	return element;
}


function setRectangleXML(rect, rectXML)
{
	rect.left = Number(rectXML.@left);
	rect.top = Number(rectXML.@top);
	rect.right = Number(rectXML.@right);
	rect.bottom = Number(rectXML.@bottom);
	return rect;
}

function setMatrixXML(matrix, matrixXML)
{
	if (!matrix) return null;
	matrix.a = (matrixXML.@a.length()) ? Number(matrixXML.@a) : 1;
	matrix.b = (matrixXML.@b.length()) ? Number(matrixXML.@b) : 0;
	matrix.c = (matrixXML.@c.length()) ? Number(matrixXML.@c) : 0;
	matrix.d = (matrixXML.@d.length()) ? Number(matrixXML.@d) : 1;
	matrix.tx = (matrixXML.@tx.length()) ? Number(matrixXML.@tx) : 0;
	matrix.ty = (matrixXML.@ty.length()) ? Number(matrixXML.@ty) : 0;
	return matrix;
}

function traceMatrix(m)
{
	if (m == null) 
	{
		fl.trace('matrix is null'); 
		return;
	}
	fl.trace('a='+m.a+', b='+m.b+', c='+m.c+', d='+m.d+', tx='+m.tx+', ty='+m.ty);
}


function setTransformationPointXML(element, transPointXML)
{
	var point = {x:0, y:0};
	if (transPointXML && transPointXML.length())
	{
		transPointXML = transPointXML.children()[0];
		point = {x:Number(transPointXML.@x), y:Number(transPointXML.@y)};
	}
	element.setTransformationPoint(point);
}


// Combines a number in #RRGGBB format, and an alpha value between 0 and 1, into a string for JSFL.
function getColorAndAlphaStringForJS(colorString0x, alphaDecimal)
{ 
	if (!colorString0x || !colorString0x.length) 
		var colorString0x = '#000000';
	if (alphaDecimal == null || isNaN(alphaDecimal))
		var alphaDecimal = 1;
	var colorJS = colorString0x;
	if (colorJS.substr(0, 2) == '0x')
		colorJS = '#' + colorString0x.slice(2);
	var alpha255 = Math.round(alphaDecimal * 255);
	if (alpha255 > 255) alpha255 = 255;
	else if (alpha255 < 0) alpha255 = 0;
	var alphaHex = alpha255.toString(16).toUpperCase();
	if (alphaHex.length == 1) alphaHex = '0' + alphaHex;
	var colorAndAlphaStringForJS = colorJS + alphaHex;
	return colorAndAlphaStringForJS;
}

function newIdentityMatrixObject()
{
	// matrix is a generic JS object
	var matrix = {
		a:  1.0,
		b:  0.0,
		c:  0.0,
		d:  1.0,
		tx: 0.0,
		ty: 0.0
	};
	
	return matrix;
}

function newFillObject()
{
	var m = newIdentityMatrixObject();
	
	// fill is a generic JS object
	var fill = {
		style: "noFill",
		matrix: m
	};
	
	return fill;
}

function getFillFromXML(fillXML)
{
	if (!fillXML || !fillXML.length()) return null;
	
	var fill = newFillObject();
	
	var nodeName = fillXML.localName();
	if (nodeName == 'SolidColor')
	{
		fill.style = 'solid';
		
		var colorString = String(fillXML.@color);
		var alphaDecimal = 1;
		var alphaString = String(fillXML.@alpha);
		if (alphaString != '')
		{
			alphaDecimal = Number(alphaString);
		}
		var colorAndAlphaStringForJS = getColorAndAlphaStringForJS(colorString, alphaDecimal);

		fill.color = colorAndAlphaStringForJS; 
	
	}
	else if (nodeName == 'LinearGradient' || nodeName == 'RadialGradient')
	{
		var colorArray = [];
		var posArray = [];
		
		for each (var entryXML in fillXML.GradientEntry)
		{
			var colorString = String(entryXML.@color);
			var alphaDecimal = 1;
			var alphaString = String(entryXML.@alpha);
			if (alphaString != '')
			{
				alphaDecimal = Number(alphaString);
			}
			var colorAndAlphaStringForJS = getColorAndAlphaStringForJS(colorString, alphaDecimal);
			colorArray.push(colorAndAlphaStringForJS);
			
			var ratio = Number(entryXML.@ratio);
			var pos = Math.round(ratio*255);
			if (pos > 255) pos = 255;
			else if (pos < 0) pos = 0;
			posArray.push(pos);
		}
		fill.style = (nodeName == 'LinearGradient') ? 'linearGradient' : 'radialGradient';
		fill.colorArray = colorArray;
		fill.posArray = posArray;
		fill.extend = String(fillXML.@extend) || 'extend';
		if (nodeName == 'RadialGradient')
		{
			fill.focalPoint = Number(fillXML.@focalPointRatio)*255 || 0;
		}
		
		var m = fill.matrix;
		var matrixXML = fillXML.matrix.Matrix;
		setMatrixXML(m, matrixXML);
		if (m)
			fill.matrix = m;

		// The default is 'rgb'.
		fill.linearRGB = (fillXML.@interpolationMethod == 'linearRgb');
		// The default is 'extend', which is 'pad' in JSFL.
		var overflow = String(fillXML.@spreadMethod) || 'extend';
		if (overflow == 'pad')
			overflow = 'extend';
		fill.overflow = overflow;
		fill.color = "#000000"; // gradient fill still requires color property
	}
	else if (nodeName == 'BitmapFill')
	{
		fill.style = 'bitmap';
		fill.bitmapPath = String(fillXML.@bitmapPath);
		fill.bitmapIsClipped = (fillXML.@bitmapIsClipped == 'true');
		var m = newIdentityMatrixObject();
		var matrixXML = fillXML.matrix.Matrix;
		setMatrixXML(m, matrixXML);
		// correction for bitmap fill matrix
		m.a *= 20;
		m.b *= 20;
		m.c *= 20;
		m.d *= 20;
		fill.matrix = m;
	}

	return fill;
}

function setFillXML(shape, fillXML)
{
	if (!shape) return;
	shape.selected = true;
	var fill = getFillFromXML(fillXML);
	shape.setCustomFill(fill);
	shape.selected = false;
}


function getStrokeFromXML(strokeXML)
{
	if (!strokeXML) return null;
	var dom = fl.getDocumentDOM(); 
	
	// this is the only way to create a new stroke object at present
	var stroke = dom.getCustomStroke(); 
	if (!stroke) return null;
	
	stroke.style = 'solid';
	var style = 'solid';
	switch (strokeXML.localName())
	{
		case 'DashedStroke': style = 'dashed'; break;
		case 'DottedStroke': style = 'dotted'; break;
		case 'RaggedStroke': style = 'ragged'; break;
		case 'StippleStroke': style = 'stipple'; break;
		case 'HatchedStroke': style = 'hatched'; break;
	}

	
	var strokeFillXML = strokeXML.fill.children()[0];
	var strokeFill = getFillFromXML(strokeFillXML);
	stroke.shapeFill = strokeFill;
	// This conditional is necessary for bitmap strokes to import correctly.
	if (stroke.shapeFill.color != undefined)
		stroke.color = stroke.shapeFill.color;
	else
		stroke.color = "#FFFFFF";

	stroke.style = style;
	
	var weight = Number(strokeXML.@weight);
	// .05 is the minimum stroke weight in Flash Authoring; the stroke disappears otherwise.
	if (weight < .05) weight = .05;
	stroke.thickness = weight;
	stroke.capType = String(strokeXML.@caps);
	//NOTE: breakAtCorners is deprecated in favor of joinType
	stroke.joinType = String(strokeXML.@joints);
	stroke.miterLimit = Number(strokeXML.@miterLimit);
	stroke.scaleType = String(strokeXML.@scaleMode) || 'normal';
	stroke.strokeHinting = toBoolean(strokeXML.@pixelHinting, false);

	var tagName = strokeXML.localName();
	if (tagName != 'Stroke')
	{
		fromMXMLCopyProperties(strokeXML, stroke);
	}
	
	return stroke;
}

function setShapeStroke(shape, stroke)
{
	if (!shape || !stroke) return;
	var dom = fl.getDocumentDOM(); 
	dom.selectNone();
	dom.selection = [shape];
	shape.setCustomStroke(stroke);
	dom.selectNone();
}

function findSymbolItem(name)
{
	var symbols = DOM2.symbols;
	for each (var symbol in symbols)
	{
		if (symbol.name == name)
			return symbol;
	}
	return null;
}

function findItem(name)
{
	var items = DOM2.items;
	for each (var item in items)
	{
		if (item.name == name)
			return item;
	}
	return null;
}

function setCompiledClipInstanceXML(frame, swcInstanceXML)
{
	var itemName = String(swcInstanceXML.@libraryItemName);
	var item = findItem(itemName);
	var addSuccess = frame.addItem({x:0, y:0}, item); 
	var swcInstance = frame.elements[frame.elements.length-1]; 
	fromMXMLCopyProperties(swcInstanceXML, swcInstance, 'DOMElement');
	fromMXMLCopyProperties(swcInstanceXML, swcInstance, 'DOMCompiledClipInstance');
	fromMXMLCopyProperties(swcInstanceXML, swcInstance, 'AccessibilityGroup');
	
	var parmsXML = swcInstanceXML.parametersAsXML.children();
	var parmsXMLString = parmsXML.toXMLString();
	if (parmsXMLString)
	{
		swcInstance.parametersAsXML = parmsXMLString;
	}
	
	return swcInstance;
}

function setGroupXML(frame, groupXML)
{
	var document = fl.getDocumentDOM();
	
	var membersXML = groupXML.members.children();
	if (!membersXML.length()) 
		return null;
		
	var members = setElementsXML(frame, membersXML);
	var lockedMembers = [];
	// Temporarily unlock children of the group so they can be selected and grouped.
	for each (var member in members)
	{
		if (member.locked)
		{
			lockedMembers.push(member);
			member.locked = false;
		}
	}
	document.selectNone();
	document.selection = [];
	document.DOM2.selection = [];
	
	document.DOM2.selection = members;
	document.group();
	var group = document.DOM2.selection[0];
	document.selectNone();
	// Restore locked state.
	for each (var member in lockedMembers)
	{
		member.locked = true;
	}
	return group;
}

	
	
function setSymbolInstanceXML(frame, symbolInstanceXML)
{
	var document = fl.getDocumentDOM();
	var library = document.library;
	var oldSelection = document.selection;
	
	var itemName = String(symbolInstanceXML.@libraryItemName);
	var item = findSymbolItem(itemName);
	// if the symbol doesn't exist yet, create an empty one
	if (item == null)
	{	
		DOM2.addNewItem('movie clip', itemName);
		item = findSymbolItem(itemName);
	}
	
	frame.addItem({x:0, y:0}, item);
	
	var symbolInstance = frame.elements[frame.elements.length-1]; 
	if (!symbolInstance) 
	{
		fl.trace('WARNING: After addItemToDocument, did not find libraryItem: ' + symbolInstanceXML.@libraryItemName);
		return;
	}
	//NOTE: just setting the .selection array doesn't clear the selection properly, so must call selectNone().
	document.selectNone(); 
	document.selection = [symbolInstance];
	
	var symbolType = String(symbolInstanceXML.@symbolType) || 'movie clip';
	setColorXML(symbolInstance, symbolInstanceXML.color.Color);
	
	fromMXMLCopyProperties(symbolInstanceXML, symbolInstance, 'DOMElement');
	fromMXMLCopyProperties(symbolInstanceXML, symbolInstance, 'DOMSymbolInstance');
	fromMXMLCopyProperties(symbolInstanceXML, symbolInstance, 'AccessibilityGroup');
	
	if (symbolType == 'graphic')
	{
		symbolInstance.firstFrame = Number(symbolInstanceXML.@firstFrame);
		symbolInstance.loop = String(symbolInstanceXML.@loop);
	}
	else if (symbolInstance.symbolType == 'button')
	{
		symbolInstance.buttonTracking = String(symbolInstanceXML.@buttonTracking) || 'button';
	}
	else if (symbolType == 'movie clip')
	{
		// disabling until crasher is fixed
		if (symbolInstanceXML.@matrix3D.length())
		{
			var matrix3DString = String(symbolInstanceXML.@matrix3D);
			// remove possible spaces between commas and numbers
			matrix3DString = stringReplace(matrix3DString, ' ', ''); 
			if (matrix3DString)
			{
				var matrix3DArray = matrix3DString.split(',');
				if (matrix3DArray.length)
				{
					// convert the array of strings to numbers
					for (var mi=0; mi<matrix3DArray.length; mi++)
					{
						matrix3DArray[mi] = Number(matrix3DArray[mi]);
					}
					symbolInstance.rotationX = Number(symbolInstanceXML.@rotationX) || 0;
					symbolInstance.rotationY = Number(symbolInstanceXML.@rotationY) || 0;
					symbolInstance.rotationZ = Number(symbolInstanceXML.@rotationZ) || 0;
					if (symbolInstance.centerPoint3D)
					{
						var centerPt = {};	// create generic object with x,y,z properties
						centerPt.x = Number(symbolInstanceXML.@centerPoint3DX) || 0;
						centerPt.y = Number(symbolInstanceXML.@centerPoint3DY) || 0;
						centerPt.z = Number(symbolInstanceXML.@centerPoint3DZ) || 0;
						symbolInstance.centerPoint3D = centerPt;
					}
					
					symbolInstance.matrix3D = matrix3DArray;
				}
			}
		}
		
		
		setFiltersXML(symbolInstance, symbolInstanceXML.filters);
		var parmsXML = symbolInstanceXML.parametersAsXML.children();
		var parmsXMLString = parmsXML.toXMLString();
		if (parmsXMLString)
		{
			symbolInstance.parametersAsXML = parmsXMLString;
		}
		
		}
	
	
	if (symbolInstanceXML.actionScript.length())
	{
		symbolInstance.actionScript = String(symbolInstanceXML.actionScript);
	}
		

	return symbolInstance;
}

// NOTE: The element must be selected before calling this function.
function setColorXML(element, colorXML)
{
	if (!colorXML || !colorXML.length())
		return;
		
	//// BRIGHTNESS
	
	var brightness = (colorXML.@brightness.length()) ? Number(colorXML.@brightness) : null;
	if (brightness != null)
	{
		var brightnessPercent = Math.round(brightness*100);
		element.brightness = brightnessPercent;
		return;
	}

	
	//// TINT
	
	var tintColor = (colorXML.@tintColor.length()) ? colorXML.@tintColor : null;
	var tintMultiplier = (colorXML.@tintMultiplier.length()) ? Number(colorXML.@tintMultiplier) : null;
	
	if (tintColor != null && tintMultiplier != null)
	{
		var tintPercent = Math.round(tintMultiplier*100);
		element.setTint(tintColor, tintPercent);
		return;
	}

	
	//// COLOR MATRIX
	
	var redMultiplier = (colorXML.@redMultiplier.length()) ? Number(colorXML.@redMultiplier) : null;
	var redOffset = (colorXML.@redOffset.length()) ? Number(colorXML.@redOffset) : null;
	
	var greenMultiplier = (colorXML.@greenMultiplier.length()) ? Number(colorXML.@greenMultiplier) : null;
	var greenOffset = (colorXML.@greenOffset.length()) ? Number(colorXML.@greenOffset) : null;

	var blueMultiplier = (colorXML.@blueMultiplier.length()) ? Number(colorXML.@blueMultiplier) : null;
	var blueOffset = (colorXML.@blueOffset.length()) ? Number(colorXML.@blueOffset) : null;

	var alphaMultiplier = (colorXML.@alphaMultiplier.length()) ? Number(colorXML.@alphaMultiplier) : null;
	var alphaOffset = (colorXML.@alphaOffset.length()) ? Number(colorXML.@alphaOffset) : null;
	
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
		element.colorMode = 'alpha';
		
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
		element.colorMode = 'advanced';

		element.colorRedPercent   = (redMultiplier   != null) ? redMultiplier   * 100 : 100;
		element.colorGreenPercent = (greenMultiplier != null) ? greenMultiplier * 100 : 100;
		element.colorBluePercent  = (blueMultiplier  != null) ? blueMultiplier  * 100 : 100;
		element.colorAlphaPercent = (alphaMultiplier != null) ? alphaMultiplier * 100 : 100;

		element.colorRedAmount   = (redOffset   != null) ? redOffset   : 0;
		element.colorGreenAmount = (greenOffset != null) ? greenOffset : 0;
		element.colorBlueAmount  = (blueOffset  != null) ? blueOffset  : 0;
		element.colorAlphaAmount = (alphaOffset != null) ? alphaOffset : 0;
	}
	else
	{
		element.colorMode = 'none';
	}
	
}

function getElementType(element)
{
	if (!element) return '';

	var elementType = '';
	var libraryItem = element.libraryItem;
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


function setFiltersXML(element, filtersXML)
{
	if (!filtersXML || !filtersXML.length())
		return;

	var filtersChildren = filtersXML.children();
	for (var fci=0; fci<filtersChildren.length(); fci++)
	{
		var filter = filtersChildren[fci];
		setFilterXML(element, filter);
	}
	
}


function setFilterXML(element, filterXML)
{
	var dom = fl.getDocumentDOM();
	dom.selectNone();
	dom.selection = [element];
	// avoid an error message if the object does not support filters
	var elementType = getElementType(element);
	if (   elementType != 'movie clip' 
		&& elementType != 'text' 
		&& elementType != 'button')
	{
		return;
	}
	
	var filterName = filterXML.localName();
	var atts = filterXML.attributes();
	
	// We have to create a filter object this way because we can't use the constructor.
	dom.addFilter(filterName);
	var filtersArray = element.filters;
	var filter = filtersArray.pop();
	//// default values
	filter.angle = 45; 
	filter.blurX = 4;
	filter.blurY = 4;
	filter.brightness = 0;
	filter.contrast = 0;
	filter.distance = 4;
	filter.enabled = true;
	filter.hideObject = false;
	filter.hue = 0;
	filter.inner = false;
	filter.knockout = false;
	filter.quality = 1;
	filter.saturation = 0;
	filter.strength = 100; // 100 in JSAPI == 1 in Player
	filter.type = 'inner';

	var alpha = filterXML.@alpha.length() ? Number(filterXML.@alpha) : 1;
	filter.color = getColorAndAlphaStringForJS(String(filterXML.@color), alpha);
	
	var highlightAlpha = filterXML.@highlightAlpha.length() ? Number(filterXML.@highlightAlpha) : 1;
	var highlightColor = '#FFFFFF'; // highlight defaults to white, not black
	if (filterXML.@highlightColor.length())
		highlightColor = String(filterXML.@highlightColor);
	filter.highlightColor = getColorAndAlphaStringForJS(highlightColor, highlightAlpha);

	var shadowAlpha = filterXML.@shadowAlpha.length() ? Number(filterXML.@shadowAlpha) : 1;
	filter.shadowColor = getColorAndAlphaStringForJS(String(filterXML.@shadowColor), shadowAlpha);

	for (var i=0; i<atts.length(); i++)
	{
		var att = atts[i];
		var propName = att.localName();
		if (   propName == 'color'
			|| propName == 'alpha'
			|| propName == 'highlightColor'
			|| propName == 'highlighAlpha'
			|| propName == 'shadowColor'
			|| propName == 'shadowAlpha'
			)
			continue;
			
		var propValue = String(att);
		var attribType = FilterSchema[filterName][propName];
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
				var colorAndAlphaStringForJS = getColorAndAlphaStringForJS(colorString, alphaDecimal);
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


// Parses a string in the format "[1, 2, 3]" or "[1,2,3]" into an array.
function parseArrayString(arrayString)
{
	arrayString = arrayString.substring(1, arrayString.length-1);
	arrayString = stringReplace(arrayString, ' ', '');
	var valuesArray = arrayString.split(',');
	return valuesArray;
}

function stringReplace(source, find, replace)
{
	if (!source || !source.length)
		return ''; 
	return source.replace(find, replace, 'g');
}



/////////////////////////////////////

FilterSchema = {};

FilterSchema.BlurFilter = 
{
	  blurX:"number"
	, blurY:"number"
	, quality:"number"
}

FilterSchema.GlowFilter = 
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

FilterSchema.DropShadowFilter = 
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

FilterSchema.BevelFilter = 
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


FilterSchema.GradientGlowFilter = FilterSchema.GradientBevelFilter =
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
 

FilterSchema.AdjustColorFilter = 
{
	  brightness:"number"
	, contrast:"number"
	, saturation:"number"
	, hue:"number"
}



//////////////////////////////////////////////////////////////////////////////








function setBitmapInstanceXML(frame, bitmapInstanceXML)
{
	var library = fl.getDocumentDOM().library;
	library.addItemToDocument({x:0, y:0}, bitmapInstanceXML.@libraryItemName);
	var element = frame.elements[frame.elements.length-1];
	return element;
}

function setVideoInstanceXML(frame, videoInstanceXML)
{
	var library = fl.getDocumentDOM().library;
	library.addItemToDocument({x:0, y:0}, videoInstanceXML.@libraryItemName);
	var element = frame.elements[frame.elements.length-1];
	return element;
}



function setTextXML(frame, textXML)
{
	var document = fl.getDocumentDOM();
	var oldSelection = document.selection;

	var textLeft = Number(textXML.@left);
	var textTop = Number(textXML.@top);
	var width = Number(textXML.@width);
	var height = Number(textXML.@height);
	var textRight = textLeft + width;
	var textBottom = textTop + height;
	var textRectangle = {left:textLeft, top:textTop, right:textRight, bottom:textBottom};
	// If we don't put any characters in the textfield, 
	// it sometimes disappears from the stage, so use a space and remove it later.
	frame.addNewText(textRectangle, ' ');
	var text = frame.elements[frame.elements.length-1];
	text.autoExpand = true;
	text.setTextString('');
	
	for each (var textRunXML in textXML.textRuns.DOMTextRun)
	{
		setTextRunXML(text, textRunXML);
	}
	
	var tagName = textXML.localName();
	fromMXMLCopyProperties(textXML, text, 'DOMText_Common');
	switch (tagName)
	{
		case 'DOMStaticText': 
			text.textType = 'static';
			fromMXMLCopyProperties(textXML, text, 'DOMStaticText');
			break;
		case 'DOMDynamicText': 
			text.textType = 'dynamic';
			fromMXMLCopyProperties(textXML, text, 'DOMDynamicText');
			fromMXMLCopyProperties(textXML, text, 'DOMText_DynamicOrInput');
			break;
		case 'DOMInputText': 
			text.textType = 'input';
			fromMXMLCopyProperties(textXML, text, 'DOMInputText');
			fromMXMLCopyProperties(textXML, text, 'DOMText_DynamicOrInput');
			break;
	}
	
	// If autoExpand is false, set it only after adding all the text, 
	// otherwise the bounding box will get locked into a small size.
	text.autoExpand = (String(textXML.@autoExpand) == 'true'); // default is false
	
	document.selectNone();
	document.selection = [text];
	////////////////////////////////////////////////////////////
	if (!text.autoExpand)
	{
		text.setTextRectangle(textRectangle);
	}
	////////////////////////////////////////////////////////////
	setFiltersXML(text, textXML.filters);
	
	if (tagName == "DOMStaticText")
	{
		var textMatrixXML = textXML.matrix.Matrix;
		var matrix = newIdentityMatrixObject();
		setMatrixXML(matrix, textMatrixXML);
		text.matrix = matrix;
		
		var xDiff = textLeft - text.left;
		document.moveSelectionBy({x:xDiff, y:0});
	}

	// unselect the text so the cursor doesn't end up inside it
	document.selectNone();		

	return text;
}

function traceRectangle(r)
{
	fl.trace('[left:'+r.left+', top:'+r.top+', right:'+r.right+', bottom:'+r.bottom+']');
}

function setTextRunXML(text, textRunXML)
{
	var chars = String(textRunXML.characters);
	var startIndex = text.length;
	var endIndex = startIndex + chars.length;
	
	var type = text.textType; 
	
	var attrs = {};
	
	if (type == 'static' && text.orientation != 'horizontal')
		attrs.rotation = false;
		
	if (type == 'static')
	{
		if (textRunXML.@characterPosition.length())
			attrs.characterPosition = String(textRunXML.@characterPosition);
		attrs.target = String(textRunXML.@target) || '';
		attrs.url = String(textRunXML.@url) || '';
		if (text.orientation != 'horizontal')
			attrs.rotation = String(textRunXML.@rotation)=='true';
		
	}
	
	// Iterate over the properties in the schema for DOMTextAttrs.
	// Not using fromMXMLCopyProperties() because we have to use text.setTextAttr() method,
	// rather than setting properties on a DOMTextAttrs instance.
	var typeInfo = describeType('DOMTextAttrs'); 
	var propertyList = typeInfo.accessor; 
	var textAttrs = textRunXML.textAttrs.DOMTextAttrs;
	for each (var propertyInfo in propertyList)
	{
		var attribName = String(propertyInfo.@name);
		
		var attrib = textAttrs.@[attribName];
		var attribValue = null;
		if (attrib.length())
		{
			attribValue = String(attrib);
		}
		else if (String(propertyInfo.@defaultValue))
		{	// If the attribute isn't defined in the XFL, grab the schema's default value, if there is one.
			attribValue = String(propertyInfo.@defaultValue);
		}
		if (attribValue == null || attribValue === 'undefined')
			continue;
		
		var attribType = String(propertyInfo.@type);
		if (attribType == 'Boolean')
			attribValue = (attribValue=='true');
		else if (attribType == 'Number')
			attribValue = Number(attribValue);

		attrs[attribName] = attribValue;
	}
	text.addTextRun(attrs, chars);	
}


function getTextAttrsXML(ta)
{
	return toMXML(ta);
}


// In Flash Authoring, a group is actually a shape that has "members" as well as paths.
function setShapeXML(frame, shapeXML)
{
	var dom = fl.getDocumentDOM();
	dom.selectNone();
		
	var shape = null;
	fl.objectDrawingMode = (String(shapeXML.@isDrawingObject) == 'true');
	var pathsXML = shapeXML.paths.Path;
	for (var ci=0; ci<pathsXML.length(); ci++)
	{
		var pathXML = pathsXML[ci]; 
		// for now, should be the same every time
		shape = setPathXML(frame, pathXML, fl.objectDrawingMode);
	}
	
	if (shapeXML.localName() == 'DOMGroup')
		shape = setGroupXML(frame, shapeXML);   

		
	return shape;
}


function setPathXML(frame, pathXML, isDrawingObject)
{
	var dom = fl.getDocumentDOM();
	dom.selectNone();
	var path = fl.drawingLayer.newPath();
	fl.drawingLayer.beginDraw(true);
	fl.drawingLayer.beginFrame();
	
	var shape = null;			
	
	
	var data = String(pathXML.@data);
	if (!data.length)
		return;

	// Split letter followed by number (ie "M3" becomes "M 3")
	var temp = data.replace(/([A-Za-z])([0-9\-\.])/g, "$1 $2");
	// Split number followed by letter (ie "3M" becomes "3 M")
	temp = temp.replace(/([0-9\.])([A-Za-z\-])/g, "$1 $2");
	// Split letter followed by letter (ie "zM" becomes "z M")
	temp = temp.replace(/([A-Za-z\-])([A-Za-z\-])/g, "$1 $2");
	// Replace commas with spaces
	temp = temp.replace(/,/g, " ");
	// Finally, split the string into an array 
	var items = temp.split(/\s+/);

	var penX = 0;
	var penY = 0;
	var pathStartX = 0;
	var pathStartY = 0;
	var command = 'M';
	for (var i=0; i<items.length; i++)
	{
		var item = items[i];
		if (isNaN(item))
		{
			// if it's not a number, assume it's a drawing command
			command = item;
		}
		else
		{
			// Handle the style where repeated sets of numbers are used 
			// without explicitly stating the command, e.g. repeated lineTos.
			// Move the index back as if we're at a command.
			i--;
		}
		
		if (command == 'M')
		{
			path.newContour();
			pathStartX = penX = Number(items[i+1]);
			pathStartY = penY = Number(items[i+2]);
			i += 2;
		}
		else if (command == 'L')
		{
			path.addPoint(penX, penY);
			path.addPoint(Number(items[i+1]), Number(items[i+2]));
			penX = Number(items[i+1]);
			penY = Number(items[i+2]);
			i += 2;
		}
		else if (command == 'z')
		{
			path.addPoint(penX, penY);
			path.addPoint(pathStartX, pathStartY);
		}
		else if (command == 'Q')
		{
			path.addCurve(penX, penY, Number(items[i+1]), Number(items[i+2]), Number(items[i+3]), Number(items[i+4]));
			penX = Number(items[i+3]);
			penY = Number(items[i+4]);
			i += 4;
		}	
		else if (command == 'C')
		{
			path.addCubicCurve(penX, penY, Number(items[i+1]), Number(items[i+2]), Number(items[i+3]), Number(items[i+4]), Number(items[i+5]), Number(items[i+6]));
			penX = Number(items[i+5]);
			penY = Number(items[i+6]);
			i += 6;
		}	
	}	

	
	var fillXML = pathXML.fill[0];
	if (fillXML)
		fillXML = fillXML.children()[0];
		
	var strokeXML = pathXML.stroke[0];
	if (strokeXML)
		strokeXML = strokeXML.children()[0];

	var noFill = (!fillXML || !fillXML.length());
	var noStroke = (!strokeXML || !strokeXML.length());
	
	var stroke = getStrokeFromXML(strokeXML);
	if (stroke)
		dom.setCustomStroke(stroke);
	var fill = getFillFromXML(fillXML);
	if (fill)
	{
		dom.setCustomFill(fill);
	}
	
	// track if elements array size changes
	var oldLength = frame.elements.length;
	
	var evenOddWinding = true;
	if (pathXML.@winding.length())
	{
		if (String(pathXML.@winding) == 'nonZero')
			evenOddWinding = false;
	}
	// The 5th parameter for makeShape() is to support overlapping compound paths (BUG 214101).
	// The 6th parameter enables the "nonZero" winding mode for filling shapes in Player 10 (default is "evenOdd").
	path.makeShape(noFill, noStroke, true, true, true, evenOddWinding);
	
	// The shape will only appear on top of previous objects if it is a drawing object.
	// Raw shapes, on the other hand, are merged into a Shape beneath everything.
	if (isDrawingObject)
	{
		// grab the last created element in the frame
		shape = frame.elements[frame.elements.length-1];
	}
	else
	{
		// shape was merged into the parent frame's shape, which is at index 0 if it exists.
		shape = frame.elements[0];
	}
		
	fl.drawingLayer.endFrame();
	fl.drawingLayer.endDraw();
	
	// a fill with a matrix, i.e. bitmap or gradient, must be set *after* drawing the shape
	if (fill)
	{
		var fillStyle = fill.style;
		if (fillStyle == "bitmap" || fillStyle == "linearGradient" || fillStyle == "radialGradient")
			shape.setCustomFill(fill);
	}
	
	// same for bitmap and gradient strokes 
	if (stroke)
	{
		var strokeStyle = stroke.shapeFill.style;
		if (strokeStyle == "bitmap" || strokeStyle == "linearGradient" || strokeStyle == "radialGradient")
		{
			shape.setCustomStroke(stroke);
		}
	}
	return shape;
}

function setPrimitiveXML(frame, primitiveXML)
{
	var dom = fl.getDocumentDOM();

	var tagName = primitiveXML.localName();
	var rect = null;
	var width = Number(primitiveXML.@objectWidth);
	var height = Number(primitiveXML.@objectHeight);
	var left = -.5*width;
	var top = -.5*height;
	var bounds = {left:left, top:top, right:-left, bottom:-top};
	
	var fillXML = primitiveXML.fill[0];
	if (fillXML)
		fillXML = fillXML.children()[0];
		
	var strokeXML = primitiveXML.stroke[0];
	if (strokeXML)
		strokeXML = strokeXML.children()[0];

	var noFill = (!fillXML || !fillXML.length());
	var noStroke = (!strokeXML || !strokeXML.length());
	
	var fillHasMatrix = false;  // add actual fill after primitive is positioned
	var fill = getFillFromXML(fillXML);
	if (fill)
	{
		fillHasMatrix = (fill.style == "linearGradient" || fill.style == "radialGradient" || fill.style == "bitmap");
		if (fillHasMatrix)
		{
			var dummy_fill = newFillObject();
			dummy_fill.style = "solid";
			dummy_fill.color = "#FFFFFF";
			dom.setCustomFill(dummy_fill);
		}
		else
		{
			dom.setCustomFill(fill);
		}
	}
	var stroke = getStrokeFromXML(strokeXML);
	if (stroke)
		dom.setCustomStroke(stroke);

		
	var primitive = null;
	if (tagName == 'RectangleObject' || tagName == 'DOMRectangleObject')
	{
		frame.addNewPrimitiveRectangle(bounds, 0, noFill, noStroke);
		primitive = frame.elements[frame.elements.length-1];
		primitive.selected = true;
		var lockFlag = (String(primitiveXML.@lockFlag) == 'true'); // default is false
		dom.setRectangleObjectProperty('lockFlag', lockFlag);
		var topLeftRadius = Number(primitiveXML.@topLeftRadius) || 0;
		dom.setRectangleObjectProperty('topLeftRadius', topLeftRadius);
		if (!lockFlag)
		{
			var topRightRadius = Number(primitiveXML.@topRightRadius) || 0;
			dom.setRectangleObjectProperty('topRightRadius', topRightRadius);
			var bottomLeftRadius = Number(primitiveXML.@bottomLeftRadius) || 0;
			dom.setRectangleObjectProperty('bottomLeftRadius', bottomLeftRadius);
			var bottomRightRadius = Number(primitiveXML.@bottomRightRadius) || 0;
			dom.setRectangleObjectProperty('bottomRightRadius', bottomRightRadius);
		}
		primitive.selected = false;
	}
	else if (tagName == 'OvalObject' || tagName == 'DOMOvalObject')
	{
		dom.addNewPrimitiveOval(bounds, noFill, noStroke);
		primitive = frame.elements[frame.elements.length-1];
		primitive.selected = true;
		
		var closePath = (String(primitiveXML.@closePath) != 'false'); // default is true
		dom.setOvalObjectProperty('closePath', closePath);
		
		var startAngle = 0;
		if (primitiveXML.@startAngle.length())
			startAngle = Number(primitiveXML.@startAngle);
		dom.setOvalObjectProperty('startAngle', startAngle);
		
		var endAngle = 360;
		if (primitiveXML.@endAngle.length())
			endAngle = Number(primitiveXML.@endAngle);
		dom.setOvalObjectProperty('endAngle', endAngle);
		
		var innerRadius = 0;
		if (primitiveXML.@innerRadius.length())
			innerRadius = Number(primitiveXML.@innerRadius);
		dom.setOvalObjectProperty('innerRadius', innerRadius);
		
		primitive.selected = false;
	}
	
	if (fill)
	{
		var fillStyle = fill.style;
		if (fillStyle == "bitmap" || fillStyle == "linearGradient" || fillStyle == "radialGradient")
			primitive.setCustomFill(fill);
	}
	
	if (stroke)
	{
		var strokeStyle = stroke.shapeFill.style;
		if (strokeStyle == "bitmap" || strokeStyle == "linearGradient" || strokeStyle == "radialGradient")
			primitive.setCustomStroke(stroke);
	}
	
	return primitive;
}

function assureFolder(uri) 
{
	if (!FLfile.exists(uri)) 
	{
		FLfile.createFolder(uri);
		FLfile.setAttributes(uri, "N");
	}
	return uri;
}


function askForXmlURI()
{
	var fileURI = '';
	fileURI = fl.browseForFileURL("open", "Open XFL file...");
	if (!fileURI || !fileURI.length)
		return '';
	return fileURI;
}

function getFolderFromURI(uri)
{
	var folders = uri.split('/');
	folders.pop();
	var folder = folders.join('/') + '/';
	return folder;
}

function getFileNameNoExtensionFromURI(uri)
{
	var fileName = uri.split('/').pop();
	var nameParts = fileName.split('.');
	nameParts.pop();
	fileName = nameParts.join('.');
	return fileName;
}

function getExtensionFromURI(uri)
{
	var fileName = uri.split('/').pop();
	var nameParts = fileName.split('.');
	var extension = nameParts.pop();
	return extension;
}


function loadXFL(fileURI)
{
	if (!fileURI || !fileURI.length)
		return '';
	if (FLfile.exists(fileURI))
	{
		var contents = FLfile.read(fileURI);
		return contents;
	}
	return '';
}

function importXFL()
{
	var folder = fl.configURI;
	// ensure there is a slash at the end of the folder path
	if (folder.substr(folder.length-1, 1) != '/')
		folder += '/';
	importXFLFromFile(folder + 'XFL/XFLClipboard.xfl');
}

function importXFL_XML()
{	 
	importXFLFromFile(fl.configURI + 'XFL/XFLClipboard.xml');
}

function deleteFolderContents(folder)
{
	// Ensure that there is a slash at the end of the folder path.
	// This is important for concatenating names of subfolders.
	var lastChar = folder.substr(folder.length-1, 1);
	if (lastChar != '/')
		folder += '/';
	var items = FLfile.listFolder(folder)
	for(var i=0; i<items.length; i++)
	{
		var item = items[i];
		var fullItem = folder+item;
		if (!FLfile.exists(fullItem))
		{
			continue;
		}
		var attributes = FLfile.getAttributes(fullItem);
		if (attributes.indexOf("D") != -1) // if it's a directory
		{
			deleteFolderContents(fullItem); // recurse
		}
		if (attributes.indexOf("R") != -1) // if it's read-only
		{
			FLfile.setAttributes(folder+item, "N");
		}
		attributes = FLfile.getAttributes(fullItem);
		var itemWasDeleted = FLfile.remove(folder+item);
	}
}

function importXFLFromFile(xflURI)
{	
	if (!xflURI || !xflURI.length) {
		var xflURI = askForXmlURI();
		if (!xflURI || !xflURI.length) return;
	}
	
	// set global property
	XFL_FOLDER = getFolderFromURI(xflURI);
	DOCUMENT_NAME = getFileNameNoExtensionFromURI(xflURI);
	var xmlURI = xflURI; // note: this gets reset below if an xfl filename was passed in
	
	var filenameExtension = getExtensionFromURI(xflURI);
	var useUCF = (filenameExtension.toLowerCase() == "xfl");
	if (useUCF)
	{ 
		// Always extract the UCF to the same temp folder location.
		var tempFolder = fl.configURI + 'XFL/temp/';
		assureFolder(tempFolder);
		deleteFolderContents(tempFolder);
		XFL_FOLDER = tempFolder;

		if (!fl.extractUCFPackage(xflURI, XFL_FOLDER))
		{
			alert("The XFL file could not be opened."); //TODO: localize error string
			return;	// exit script
		}
		var extractedFolder = XFL_FOLDER;
		// use a static name for the main XML file in the UCF
		xmlURI = extractedFolder + UCF_ROOT_XML_NAME + '.xml';
		XFL_FOLDER = extractedFolder;
	}

	var xflString = loadXFL(xmlURI);
	if (xflString.length > 0)
	{
		var documentXML = new XML(xflString);
		setDocumentXML(documentXML);
	}
	else
	{
		alert("Error - Could not read DOMDocument.xml file.");
	}
	if (useUCF)
	{
		if (tempFolder[tempFolder.length-1] == "/")
			tempFolder = tempFolder.substr(0,tempFolder.length-1);
		FLfile.remove(tempFolder);
	}
	cleanUp();
}

function getCurrentFrame()
{
	var timeline = fl.getDocumentDOM().getTimeline();
	var layer = timeline.layers[timeline.currentLayer];
	var frame = layer.frames[timeline.currentFrame];
	return frame;
}


function setSelectionXFL(xflString)
{
	var elements = document.selection;
	var elementsXML = new XMLList(xflString);
	
	var elementsOld = document.selection;
	document.deleteSelection();
	var frame = getCurrentFrame();
	
	var elementsNew = setElementsXML(frame, elementsXML);
	document.selection = elementsNew;
	
}



//////////////////////////////////////////////////
// This code doesn't work when inside a function.
var ns = new Namespace('http://ns.adobe.com/xfl/2008/');
default xml namespace = ns;

init();	





