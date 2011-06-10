// JavaScript Document

function setControlToEvents(property, componentType){
	var nameArray;
	if (componentType=="flvplayback"){
		nameArray = new Array("buffering", "close", "complete", "cuePoint", "fastForward", "metadataReceived", "paused", "playheadUpdate", "playing", "progress", "ready", "resize", "rewind", "scrubFinish", "scrubStart", "seek", "skinError", "skinLoaded", "stateChange", "stopped", "volumeUpdate");
	} else {
		nameArray = new Array("event");		
	}
	var eventArray = new Array();

	var elem;
	elem = new Object();
	elem.label = "";
	elem.value = "";
	eventArray[0] = elem;
		
	for (i=0;i<nameArray.length;i++){
		elem = new Object();
		elem.label = "\"" + nameArray[i] +  "\"";
		elem.value = elem.label;
		eventArray[i+1] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,eventArray);
}
