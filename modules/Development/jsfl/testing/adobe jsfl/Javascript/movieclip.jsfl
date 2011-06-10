// JavaScript Document

function setControlToURLVariableOptions(property){
	var textArray = new Array();
	elem = new Object();
	elem.label = "don't send";
	elem.value = "\"" + "" + "\"";
	textArray[textArray.length] = elem;
	
	elem = new Object();
	elem.label = "send using GET";
	elem.value = "\"" + "GET" + "\"";
	textArray[textArray.length] = elem;
	
	elem = new Object();
	elem.label = "send using POST";
	elem.value = "\"" + "POST" + "\"";
	textArray[textArray.length] = elem;
	
	fl.xmlui.setControlItemElements(property,textArray);
}

function setControlToMovieClipProperties(property){
	var nameArray = new Array("_alpha", "_focusrect", "_height", "_highquality", "_name", "_quality", "_rotation", "_soundbuftime", "_visible", "_width", "_x", "_xscale", "_y", "_yscale");
	var propArray = new Array();

	var elem;
	elem = new Object();
		elem.label = "";
		elem.value = "";
		propArray[0] = elem;
		
	for (i=0;i<nameArray.length;i++){
		elem = new Object();
		elem.label = nameArray[i];
		elem.value = elem.label;
		propArray[i+1] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,propArray);
}

function setControlToNoScale(property){
	var textArray = new Array();
	elem = new Object();
	elem.label = "normal";
	elem.value = "\"" + "normal" + "\"";
	textArray[textArray.length] = elem;
	
	elem = new Object();
	elem.label = "none";
	elem.value = "\"" + "none" + "\"";
	textArray[textArray.length] = elem;
	
	elem = new Object();
	elem.label = "vertical";
	elem.value = "\"" + "vertical" + "\"";
	textArray[textArray.length] = elem;
		
	elem = new Object();
	elem.label = "horizontal";
	elem.value = "\"" + "horizontal" + "\"";
	textArray[textArray.length] = elem;
	
	fl.xmlui.setControlItemElements(property,textArray);
}

function setControlToCapsStyle(property){
	var textArray = new Array();
	elem = new Object();
	elem.label = "round";
	elem.value = "\"" + "round" + "\"";
	textArray[textArray.length] = elem;
	
	elem = new Object();
	elem.label = "square";
	elem.value = "\"" + "square" + "\"";
	textArray[textArray.length] = elem;
	
	elem = new Object();
	elem.label = "none";
	elem.value = "\"" + "none" + "\"";
	textArray[textArray.length] = elem;
	
	fl.xmlui.setControlItemElements(property,textArray);
}
function setControlToJointStyle(property){
	var textArray = new Array();
	elem = new Object();
	elem.label = "round";
	elem.value = "\"" + "round" + "\"";
	textArray[textArray.length] = elem;
	
	elem = new Object();
	elem.label = "miter";
	elem.value = "\"" + "miter" + "\"";
	textArray[textArray.length] = elem;
	
	elem = new Object();
	elem.label = "bevel";
	elem.value = "\"" + "bevel" + "\"";
	textArray[textArray.length] = elem;
	
	fl.xmlui.setControlItemElements(property,textArray);
}

