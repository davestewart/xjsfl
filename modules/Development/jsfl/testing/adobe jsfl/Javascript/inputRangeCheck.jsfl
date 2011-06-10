// JavaScript Document

function requireAlphaNumericData(property){
	var curValue = fl.xmlui.get(property);
	var value = parseInt(curValue);
	if (!isNaN(value))
		alert("Value must begin with alpha character");
}
