//
// DeployVideo
//

function deployVideoComponent(contentURL, videoWidth, videoHeight, swfVersion, asVersion, skinURL, skinColor, skinAlpha, cuePoints)
{
	fl.getDocumentDOM().selectNone();
	
	var tl = fl.getDocumentDOM().getTimeline();
	var numElementsBeforeAdd = tl.layers[tl.currentLayer].frames[tl.currentFrame].elements.length;

	if (asVersion >= 3) {
		fl.componentsPanel.addItemToDocument({x:0, y:0}, "Video", "FLVPlayback");
	} else if (swfVersion >= 8) {
		fl.componentsPanel.addItemToDocument({x:0, y:0}, "Video", "FLVPlayback");
	} else {
		fl.componentsPanel.addItemToDocument({x:0, y:0}, "Media", "MediaPlayback");
				
		if (videoHeight > 0) {
			videoHeight += 70;
		}
		
		if (videoWidth > 0) {
			videoWidth += 20;
		}
	}
	
	var elements = tl.layers[tl.currentLayer].frames[tl.currentFrame].elements;
	if (elements.length > numElementsBeforeAdd) {
		var mediaComponentInstance = elements[elements.length-1];
		if (asVersion >= 3) {
			mediaComponentInstance.parameters["source"].value = contentURL;	
			mediaComponentInstance.parameters["skinBackgroundColor"].value = skinColor;
			mediaComponentInstance.parameters["skinBackgroundAlpha"].value = skinAlpha;
	} else {
			mediaComponentInstance.parameters["contentPath"].value = contentURL;
		}
		
		if (swfVersion >= 8) {
			mediaComponentInstance.parameters["skin"].value = skinURL;
			mediaComponentInstance.parameters["cuePoints"].value = cuePoints;
		}
		
		if (videoHeight > 0) {
			mediaComponentInstance.height = videoHeight;
		}
		
		if (videoWidth > 0) {
			mediaComponentInstance.width = videoWidth;
		}

		if (videoHeight == 0 && videoWidth == 0) {
			mediaComponentInstance.parameters["autoSize"].value = true;
		}
		
		mediaComponentInstance.selected = true;
		fl.getDocumentDOM().align("vertical center", true);
		fl.getDocumentDOM().align("horizontal center", true);
	}
}

function deployVideoAsProgressiveDownload(contentURL, videoWidth, videoHeight, swfVersion, asVersion, skinURL, skinColor, skinAlpha, cuePoints)
{
	return deployVideoComponent(contentURL, videoWidth, videoHeight, swfVersion, asVersion, skinURL, skinColor, skinAlpha, cuePoints);
}

function deployVideoAsFVSS(contentURL, videoWidth, videoHeight, swfVersion, asVersion, skinURL, skinColor, skinAlpha, cuePoints)
{
	return deployVideoComponent(contentURL, videoWidth, videoHeight, swfVersion, asVersion, skinURL, skinColor, skinAlpha, cuePoints);
}

function deployVideoAsFlashCom(contentURL, videoWidth, videoHeight, swfVersion, asVersion, skinURL, skinColor, skinAlpha, cuePoints)
{
	return deployVideoComponent(contentURL, videoWidth, videoHeight, swfVersion, asVersion, skinURL, skinColor, skinAlpha, cuePoints);
}



