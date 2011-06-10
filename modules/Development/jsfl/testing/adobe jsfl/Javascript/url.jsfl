// JavaScript Document

function setControlToURLWindowOptions(property){
	var nameArray = new Array("_blank", "_self", "_parent", "_top");
	var windowArray = new Array();

	var elem;
	elem = new Object();
		elem.label = "";
		elem.value = "";
		windowArray[0] = elem;
		
	for (i=0;i<nameArray.length;i++){
		elem = new Object();
		elem.label = nameArray[i];
		elem.value = elem.label;
		windowArray[i+1] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,windowArray);
}


