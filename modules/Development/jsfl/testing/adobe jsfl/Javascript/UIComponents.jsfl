// JavaScript Document

function setControlToEvents(eventProperty, componentType){
	var nameArray;
	var objectName;
	//"Object" is the id of the control for the object field - built into flash
	objectName = fl.xmlui.get("Object");
	var classname = fl.actionsPanel.getClassForObject(objectName);
	if (objectName != "")
		componentType = classname;

	if ((componentType=="mx.containers.Accordion") || (componentType=="Accordion")){
		nameArray = new Array("change", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.Alert") || (componentType=="Alert")){
		nameArray = new Array("click", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "mouseDownOutside", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.Button") || (componentType=="Button")){
		nameArray = new Array("click", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.CheckBox") || (componentType=="CheckBox")){
		nameArray = new Array("click", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.ComboBox") || (componentType=="ComboBox")){
		nameArray = new Array("change", "close", "draw", "enter", "focusIn", "focusOut", "itemRollOut", "itemRollOver", "keyDown", "keyUp", "load", "move", "open", "resize", "scroll", "unload");
	} else if ((componentType=="mx.controls.DataGrid") || (componentType=="DataGrid")){
		nameArray = new Array("cellEdit", "cellFocusIn", "cellFocusOut", "cellPress", "change", "columnStretch", "draw", "focusIn", "focusOut", "headerRelease", "itemRollOut", "itemRollOver", "keyDown", "keyUp", "load", "move", "resize", "scroll", "unload");
	} else if ((componentType=="mx.controls.DataHolder") || (componentType=="DataHolder")){
		nameArray = new Array();	
	} else if ((componentType=="mx.data.components.DataSet") || (componentType=="DataSet")){
		nameArray = new Array("addItem","afterLoaded","calcFields","deltaPacketChanged","iteratorScrolled","modelChanged","newItem","removeItem","resolveDelta");
	} else if ((componentType=="mx.controls.DateChooser") || (componentType=="DateChooser")){
		nameArray = new Array("change", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "scroll", "unload");
	} else if ((componentType=="mx.controls.DateField") || (componentType=="DateField")){
		nameArray = new Array("change", "close", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "open", "resize", "scroll", "unload");
	} else if (componentType=="Form"){
		nameArray = new Array("allTransactionsInDone", "allTransactionsOutDone", "complete", "draw", "focusIn", "focusOut", "hide", "keyDown", "keyUp", "load", "mouseDown", "mouseDownSomewhere", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "mouseUpSomewhere", "move", "progress", "resize", "reveal", "unload");
	} else if ((componentType=="mx.video.FLVPlayback") || (componentType=="flvplayback")){
		nameArray = new Array("buffering", "close", "complete", "cuePoint", "fastForward", "metadataReceived", "paused", "playheadUpdate", "playing", "progress", "ready", "resize", "rewind", "scrubFinish", "scrubStart", "seek", "skinError", "skinLoaded", "stateChange", "stopped", "volumeUpdate" );
	} else if ((componentType=="mx.controls.Label") || (componentType=="Label")){
		nameArray = new Array("draw", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.List") || (componentType=="List")){
		nameArray = new Array("change", "draw", "focusIn", "focusOut", "itemRollOut", "itemRollOver", "keyDown", "keyUp", "load", "move", "resize", "scroll", "unload");
	} else if ((componentType=="mx.controls.Loader") || (componentType=="Loader")){
		nameArray = new Array("complete", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.MediaController") || (componentType=="MediaController")){
		nameArray = new Array("click", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "playheadChange", "resize", "unload", "volume");
	} else if ((componentType=="mx.controls.MediaDisplay") || (componentType=="MediaDisplay")){
		nameArray = new Array("change", "complete", "cuePoint", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "progress", "resize", "start", "unload");
	} else if ((componentType=="mx.controls.MediaPlayback") || (componentType=="MediaPlayback")){
		nameArray = new Array("change", "complete", "cuePoint", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "pause", "play", "playheadChange", "progress", "resize", "start", "unload", "volume");
	} else if ((componentType=="mx.controls.Menu") || (componentType=="Menu")){
		nameArray = new Array("change", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "menuHide", "menuShow", "move", "resize", "rollOut", "rollOver", "unload");
	} else if ((componentType=="mx.controls.MenuBar") || (componentType=="MenuBar")){
		nameArray = new Array("draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.NumericStepper") || (componentType=="NumericStepper")){
		nameArray = new Array("change", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.managers.PopUpManager") || (componentType=="PopUpManager")){
		nameArray = new Array("mouseDownOutside");
	} else if ((componentType=="mx.controls.ProgressBar") || (componentType=="ProgressBar")){
		nameArray = new Array("complete", "draw", "load", "move", "progress", "resize", "unload");
	} else if ((componentType=="mx.controls.RadioButton") || (componentType=="RadioButton")){
		nameArray = new Array("click", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.RadioButtonGroup") || (componentType=="RadioButtonGroup")){
		nameArray = new Array("click");
	} else if ((componentType=="mx.data.components.RDBMSResolver") || (componentType=="RDBMSResolver")){
		nameArray = new Array("beforeApplyUpdates", "reconcileResults", "reconcileUpdates");
	} else if ((componentType=="mx.containers.ScrollPane") || (componentType=="ScrollPane")){
		nameArray = new Array("complete", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "progress", "scroll", "resize", "unload");
	} else if (componentType=="Slide"){
		nameArray = new Array("allTransactionsInDone", "allTransactionsOutDone", "complete", "draw", "focusIn", "focusOut", "hide", "hideChild", "keyDown", "keyUp", "load", "mouseDown", "mouseDownSomewhere", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "mouseUpSomewhere", "move", "progress", "resize", "reveal", "revealChild", "unload");
	} else if ((componentType=="mx.controls.TextArea") || (componentType=="TextArea")){
		nameArray = new Array("change", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.TextInput") || (componentType=="TextInput")){
		nameArray = new Array("change", "draw", "enter", "focusIn", "focusOut", "keyDown", "keyUp", "load", "move", "resize", "unload");
	} else if ((componentType=="mx.controls.Tree") || (componentType=="Tree")){
		nameArray = new Array("change", "draw", "focusIn", "focusOut", "itemRollOut", "itemRollOver", "keyDown", "keyUp", "load", "move", "nodeClose", "nodeOpen", "resize", "scroll", "unload");
	} else if ((componentType=="mx.controls.UIScrollBar") || (componentType=="UIScrollBar")){
		nameArray = new Array("scroll","draw","focusIn", "focusOut","keyDown", "keyUp","load","move","resize", "unload");
	} else if ((componentType=="mx.data.components.WebServiceConnector") || (componentType=="WebServiceConnector")){
		nameArray = new Array("result","send","status");
	} else if ((componentType=="mx.containers.Window") || (componentType=="Window")){
		nameArray = new Array("click", "draw", "focusIn", "focusOut", "keyDown", "keyUp", "load", "mouseDownOutside", "move", "resize", "scroll", "unload");
	} else if ((componentType=="mx.data.components.XMLConnector") || (componentType=="XMLConnector")){
		nameArray = new Array("result","send","status");
	} else if ((componentType=="mx.data.components.XUpdateResolver") || (componentType=="XUpdateResolver")){
		nameArray = new Array("beforeApplyUpdates", "reconcileResults");
	} else {
		nameArray = new Array();		
	}
	var eventArray = new Array();

	var elem;
	elem = new Object();
	elem.label = "";
	elem.value = "";
	if (nameArray.length>0){
		eventArray[0] = elem;
	
		for (i=0;i<nameArray.length;i++){
			elem = new Object();
			elem.label = "\"" + nameArray[i] +  "\"";
			elem.value = elem.label;
			eventArray[i+1] = elem;
		}
	}
	
	fl.xmlui.setControlItemElements(eventProperty,eventArray);
}

function setControlToFlags(property){
	var nameArray = new Array("Alert.OK", "Alert.CANCEL", "Alert.YES", "Alert.NO");
	var monthArray = new Array();

	var elem;
	elem = new Object();
		elem.label = "";
		elem.value = "";
		monthArray[0] = elem;
		
	for (i=0;i<nameArray.length;i++){
		elem = new Object();
		elem.label = nameArray[i];
		elem.value = elem.label;
		monthArray[i+1] = elem;
	}
	
	fl.xmlui.setControlItemElements(property,monthArray);
}
