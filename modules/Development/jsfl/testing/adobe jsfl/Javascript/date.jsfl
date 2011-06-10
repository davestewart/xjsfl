// JavaScript Document

function setControlToMonth(property){
	var nameArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	var monthArray = new Array();

	var elem;
	elem = new Object();
		elem.label = "";
		elem.value = "";
		monthArray[0] = elem;
		
	for (i=0;i<nameArray.length;i++){
		elem = new Object();
		elem.label = nameArray[i];
		elem.value = i;
		monthArray[i+1] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,monthArray);
}

function setControlToYear(property){
	var yearArray = new Array();
	var startYear = 2004;
	var length = 10;
	var elem;
	for (i=0;i<length;i++){
		elem = new Object();
		var year = startYear+i;
		elem.label = year;
		elem.value = elem.label;
		yearArray[i] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,yearArray);
}

function setControlToDate(property){
	var dateArray = new Array();
	var length = 31;
	var elem;
	for (i=0;i<length;i++){
		elem = new Object();
		var val = i+1;
		elem.label = val;
		elem.value = elem.label;
		dateArray[i] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,dateArray);
}


function setControlToHours(property){
	var hourArray = new Array();

	var elem;
	elem = new Object();
	elem.label = "Midnight";
	elem.value = 0;
	hourArray[0] = elem;
	
	for (i=1;i<12;i++){
		elem = new Object();
		elem.label = i + " AM";
		elem.value = i;
		hourArray[i] = elem;
	}
	
	elem = new Object();
	elem.label = "Noon";
	elem.value = 12;
	hourArray[12] = elem;
	
	for (i=1;i<12;i++){
		elem = new Object();
		elem.label = i + " PM";
		elem.value = i+12;
		hourArray[i+12] = elem;
	}
	fl.xmlui.setControlItemElements(property,hourArray);
}
