var IMPORT_TAG = "%AUTO_IMPORTS%";
var ELEMENT_TAG = "%AUTO_ELEMENTS%";
var IMPORT_HEADER = "// ** AUTO-UI IMPORT STATEMENTS **";
var IMPORT_FOOTER = "// ** END AUTO-UI IMPORT STATEMENTS **";
var ELEMENTS_HEADER = "// ** AUTO-UI ELEMENTS **";
var ELEMENTS_FOOTER = "// ** END AUTO-UI ELEMENTS **";
var LINE_BREAK = "\r\n";

var DEFAULT_LINKAGE_CLASS = 'flash.display.MovieClip';

var whiteSpace = /[\t ]/; //:RegExp

function fillUI(p_libItem, p_scriptURI, p_props) {
	var dom = fl.getDocumentDOM();
	if (dom == null) { return; }
	var lib = dom.library;
	
	var imports = [];
	var vars = [];
	
	// Read in script, and determine action
	contents = FLfile.read(p_scriptURI);
	var hasImports = ((contents.indexOf(IMPORT_HEADER) != -1 && contents.indexOf(IMPORT_FOOTER) != -1) || contents.indexOf(IMPORT_TAG) != -1);
	var hasElements = ((contents.indexOf(ELEMENTS_HEADER) != -1 && contents.indexOf(ELEMENTS_FOOTER) != -1) || contents.indexOf(ELEMENT_TAG) != -1);
	if (!hasElements) { return false; } // Missing or improper format tags
	
	if (contents.indexOf(IMPORT_TAG) != -1) {
		var importsMargin = getPreviousWhiteSpace(IMPORT_TAG, contents);
	} else {
		var importsMargin = getPreviousWhiteSpace(IMPORT_HEADER, contents);
	}
	
	if (contents.indexOf(ELEMENT_TAG) != -1) {
		var elementMargin = getPreviousWhiteSpace(ELEMENT_TAG, contents);
	} else {
		var elementMargin = getPreviousWhiteSpace(ELEMENTS_HEADER, contents);
	}
	
	// Replace Formatting tag with a header/footer combo
	contents = contents.split(IMPORT_TAG).join(IMPORT_HEADER + LINE_BREAK + IMPORT_FOOTER + ((p_props.asVersion == 1)?LINE_BREAK+LINE_BREAK:''));
	contents = contents.split(ELEMENT_TAG).join(ELEMENTS_HEADER + LINE_BREAK + ELEMENTS_FOOTER);
	
	if (p_libItem != undefined) {
		var t = p_libItem.timeline;
		var namedElements = [];
		var elementNames = [];
		
		// Store all elements with a name into an array
		var tl = t.layers.length;
		for (var i=0; i<tl; i++) {
			var layer = t.layers[i];
			var tf = layer.frames.length;
			for (var j=0; j<tf; j++) {
				var frame = layer.frames[j];
				var te = frame.elements.length;
				for (var k=0; k<te; k++) {
					var e = frame.elements[k];
					if (e.name != undefined && e.name != "") {
						if (inArray(elementNames, e.name)) { continue; }
						namedElements.push(e);
						elementNames.push(e.name);
					}
				}
			}
		}
		
		//Rewrite all named elements and store statements
		var l = namedElements.length;
		var imports = [];
		for (var i=0; i<l; i++) {
			var e = namedElements[i];
			if (p_props.asVersion == 1) {
				vars.push(formatAs2Import(e, hasImports, imports));
			} else {
				vars.push(formatAs3Import(e, hasImports, imports));
			}
		}
		vars = vars.sort(cis);
	}
	
	//Add in imports padding
	var l = imports.length;
	for (i=0;i<l;i++) {
		imports[i] = importsMargin + imports[i];
	}
	
	//Add in elements padding
	l = vars.length;
	for (i=0;i<l;i++) {
		vars[i] = elementMargin + vars[i];
	}
	
	// Swap in imports.
	if (hasImports && vars.length > 0) {
		var importStart = contents.indexOf(IMPORT_HEADER);
		var importEnd = contents.indexOf(IMPORT_FOOTER);
		var importStatements = contents.substr(importStart, importEnd + IMPORT_FOOTER.length - importStart);
		if (imports == undefined || imports.length == 0 || p_props.fillUI == false || p_props.fillUI == undefined) {
			//contents = contents.split(importStatements).join(''); //Remove Tags
			contents = contents.split(importStatements).join(IMPORT_HEADER + LINE_BREAK + importsMargin + IMPORT_FOOTER); //Keep Tags
		} else {
			//contents = contents.split(importStatements).join(imports.join(LINE_BREAK)); //Remove Tags
			contents = contents.split(importStatements).join(IMPORT_HEADER + LINE_BREAK + imports.join(LINE_BREAK) + LINE_BREAK + importsMargin + IMPORT_FOOTER); //Keep Tags
		}
	} else {
		contents = contents.split(IMPORT_HEADER).join('').split(IMPORT_FOOTER).join('');
	}
	
	// Swap in elements
	var varStart = contents.indexOf(ELEMENTS_HEADER);
	var varEnd = contents.indexOf(ELEMENTS_FOOTER);
	var varStatements = contents.substr(varStart, varEnd + ELEMENTS_FOOTER.length - varStart);
	if (vars == undefined || vars.length == 0 || p_props.fillUI == false || p_props.fillUI == undefined) {
		//contents = contents.split(varStatements).join(LINE_BREAK); //Remove Tags
		contents = contents.split(varStatements).join(ELEMENTS_HEADER + LINE_BREAK + ELEMENTS_FOOTER); //Keep tags
	} else {
		//contents = contents.split(varStatements).join(vars.join(LINE_BREAK)); //Remove tags
		contents = contents.split(varStatements).join(ELEMENTS_HEADER + LINE_BREAK + vars.join(LINE_BREAK) + LINE_BREAK + elementMargin + ELEMENTS_FOOTER); //Keep Tags
	}
	
	// Write to file
	FLfile.write(p_scriptURI, contents);
	return true;
}

function getPreviousWhiteSpace(p_needle, p_stack) { //:String
	var index = p_stack.indexOf(p_needle);
	var chars = '';
	
	while (index--) {
		
		var currChar = p_stack.charAt(index);
		
		if (whiteSpace.test(currChar) == false) {
			break;
		}
		chars += currChar;
	}
	
	return chars;
}

function formatAs2Import(p_element, p_hasImports, p_imports) { //:String
	var iType = p_element.elementType;
	
	if (iType == "instance") { // Text elements dont work
		var type = p_element.symbolType;
		var li = p_element.libraryItem;
		if (type == "" || type == undefined) { type = li.itemType; }
		
		if (li.linkageClassName != "" && li.linkageClassName != undefined && p_hasImports) {
			var imp = "import " + li.linkageClassName + ";";
			if (! inArray(p_imports, imp)) { p_imports.push(imp); }
			type = li.linkageClassName.split(".").pop();
		}
	} else if (iType == "text") {
		var type = "TextField";
	}	
		
	switch (type) {
		case "video":
			type = "Video"; break;
		case "movie clip":
			type = "MovieClip"; break;
		case "button":
			type = "Button"; break;
		case "compiled clip":
			var imp = getAs2Components(li.linkageIdentifier);
			
			if (imp == null || !p_hasImports) {
				type = "MovieClip";
			} else {
				imp = "import " + imp + ";";
				if (! inArray(p_imports, imp)) { p_imports.push(imp); }
				type =li.linkageIdentifier.split(".").pop();
			}
			break;
	}
	return "private var " + p_element.name + ":" + type + ";";
}

function formatAs3Import(p_element, p_hasImports, p_imports) { //:String
	var type = p_element.symbolType;
	var iType = p_element.elementType;
	var li = p_element.libraryItem;
	var className = '';
	
	switch (iType) {
		case 'text':
			className = "flash.text.TextField";
			break;
	}
	
	if (li) {
		switch (li.itemType) {
			case 'button':
				className = "flash.display.SimpleButton";
				break;
			case 'video':
				className = "flash.media.Video";
				break;
			case 'movie clip':
				className = DEFAULT_LINKAGE_CLASS;
				break;
		}
	}
	
	if (li && li.linkageClassName) {
		className = li.linkageClassName;
	}
	
	if (className != "" && p_hasImports) {
		var imp = "import " + className + ";";
		if (className != DEFAULT_LINKAGE_CLASS && !inArray(p_imports, imp)) { p_imports.push(imp); }
		type = className.split(".").pop();
	}
	
	return "public var " + p_element.name + ":" + type + ";";
}

// Return a Classpath for MM/AS2 Components
function getAs2Components(p_type) {
	var imp = '';
	switch (p_type) {
		case "Accordion":
		case "ScrollPane":
		case "Window":
			imp = "mx.containers." + p_type; break;
		case "Alert":
		case "Button":
		case "CheckBox":
		case "ComboBox":
		case "DataGrid":
		case "DateChooser":
		case "DateField":
		case "Label":
		case "List":
		case "Loader":
		case "MenuBar":
		case "NumericStepper":
		case "ProgressBar":
		case "RadioButton":
		case "TabBar":
		case "TextArea":
		case "TextInput":
		case "Tree":
		case "UIScrollBar":
			imp = "mx.controls." + p_type; break;
		case "FLVPlayback":
			imp = "mx.video." + p_type; break;
	}
	return imp;
}

// Utility Methods
function inArray(p_array, p_item) {
	var l = p_array.length;
	for (var i=0; i<l; i++) {
		if (p_array[i] == p_item) { return true; }
	}
	return false;
}
function cis(a, b) {
	if (a.toLowerCase() < b.toLowerCase()) return -1;
	if (a.toLowerCase() > b.toLowerCase()) return 1;
	return 0;
}