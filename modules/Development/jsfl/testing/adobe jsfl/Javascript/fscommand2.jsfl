// JavaScript Document

function setControlToOFF(property){
	fl.xmlui.setVisible(property, false);
}

function setControlToInputTypes(property){
	var nameArray = new Array("Numeric", "Alpha", "AlphaNumeric", "Latin", "NonLatin", "NoRestriction");
	var typeArray = new Array();

	var elem;
	for (i=0;i<nameArray.length;i++){
		elem = new Object();
		elem.label = nameArray[i];
		elem.value = elem.label;
		typeArray[i] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,typeArray);
}

function setControlToQualityTypes(property){
	var nameArray = new Array("high", "medium", "low");
	var typeArray = new Array();

	var elem;
	for (i=0;i<nameArray.length;i++){
		elem = new Object();
		elem.label = nameArray[i];
		elem.value = elem.label;
		typeArray[i] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,typeArray);
}

function setControlToNumbeList(property, count){
	var countArray = new Array();

	var elem;
	for (i=1;i<=count;i++){
		elem = new Object();
		elem.label = i;
		elem.value = i;
		countArray[i-1] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,countArray);
}
function setControlToBool(property){
	var boolArray = new Array();
	var elem;
	elem = new Object();
	elem.label = "\"" + "false" + "\"";
	elem.value = elem.label;
	boolArray[0] = elem;
		
	elem = new Object();
	elem.label = "\"" + "true" + "\"";
	elem.value = elem.label;
	boolArray[1] = elem;
		
	fl.xmlui.setControlItemElements(property,boolArray);
}
