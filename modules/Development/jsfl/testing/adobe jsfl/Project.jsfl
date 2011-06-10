var version = getVersion();

var DEFAULT_BASE_CLASS = 'flash.display.MovieClip';


//ZUL Testing
function showDismiss() {
	var path = fl.configURI + "Project/dialogs/ZULWindow.xml";
	
	var values = fl.xmlPanel(path);
	//fl.xmlPanel.set('inputField', 'default from JSFL!');
	fl.trace('values.inputField: ' + values.inputField);
}

//p_props = <props showHiddenFile='true' />
function getDirectory(p_path, p_fileTypes, p_hideFilters, p_props) {
	if (!fl.fileExists(p_path)) {
		return;
	}
	
	var props = attributesToObject(new XML(unescape(p_props)));
	
	var branch = new XMLList(<n/>);//<n><branch type="nullBranch"/></n>;
	var folders = FLfile.listFolder(p_path, "directories");
	var files = FLfile.listFolder(p_path, "files");
	var items = folders.concat(files);

	var len = items.length;
	
	//hideClassesFolder
	var fileTypeFilter = filterCollectionToArray(p_fileTypes); //Array
	var hideFileFliter = filterCollectionToArray(p_hideFilters); //Array
	
	for (var i=0; i<len; i++) {
		var item = items[i];
				
		var pathToItem = directory(p_path) + item;
		var attr = FLfile.getAttributes(pathToItem);
		
		var isBranch = false;
		var hidden = false;
		
		//wdg:: there is an edge case where if the file name has a \ in it, FLfile opertaions fail.
		// attr was causing jsfl erros, so just surpress them.
		if (attr != null) {
			isBranch = attr.indexOf("D") != -1;
			hidden = attr.indexOf("H") != -1;
		}
		
		var fileExt = '';
		
		if (item.indexOf('.') != -1) {
			fileExt = item.split('.').pop().toLowerCase();
		}
		
		//Some files are treated as folders by JSFL, filter them here.
		switch (fileExt) {
			case 'exe':
			case 'app':
			case 'pkg':
				isBranch = false;
				break;
		}
		
		//Only return valid files
		if (getVersion().windows && props.showHiddenFiles == false && hidden) { continue; }
		
		//Macs hide files if the first chracter is a ., so filter them when showHiddenFiles == false
		if (getVersion().mac && props.showHiddenFiles == false && item.indexOf('.') == 0) { continue; }
		
		if (!isBranch &&!isFileTypeValid(item, fileTypeFilter)) { continue; }
		if (hideFile(item, hideFileFliter)) { continue; }
		
		// RM: Classes are special so we never want to put them in our directory listing
		if (pathToItem.toLowerCase() == props.classFolderURI.toLowerCase() ) { continue; }
		
		var uri = <uri />;
		uri.@compileState = 1;
		uri.@label = item;
		uri.@uri = pathToItem;
		
		if (isBranch) {
			uri.@isBranch = true;
		} else {
			uri.@fileType = item.substr( item.lastIndexOf(".")+1, item.length);
		}
		
		branch.appendChild(uri);
	}
	//fl.trace('getDir '+branch.toXMLString())
	return branch;
}

function isFolder(p_uri) {
	return FLfile.listFolder(p_uri, "files") != false;
}

//p_files:XML
function compileList(p_files) {
	if (p_files == null) { return; }
	var xList = new XML(unescape(p_files)).children();
	
	var l = xList.length();
	if (l == 0) { return 'JSFL_COMPILELIST_NO_FILES'; }
	
	var openFiles = {};
	var openDocuments = fl.documents;
	
	//Store off currently open documents, so we don't close them after compile
	var len = openDocuments.length;
	for (i=0;i<len;i++) {
		var path = openDocuments[i].path;
		if (!path) { continue; }
		path = convertURI(path) + openDocuments[i].name;
		openFiles[escape(path)] = true;
	}
	
	var missingFiles = [];
	
	//Loop and compile the list of flas.
	for (var i=0;i<l;i++) {
		var uri = xList[i].valueOf().toString();
		if (!FLfile.exists(uri)) { missingFiles.push(uri); continue; }
		publishMovie(uri);
		
		// this chunk writes the error panel contents to a file and checks for errors
		// first save off the output
		var errorFile = uri.substr(0, uri.lastIndexOf("/")+1) + "publishErrors.txt";
		
		fl.compilerErrors.save(errorFile, false);
		
		if (numberOf("**Error** ", FLfile.read(errorFile)) != 0) {			
			FLfile.remove(errorFile);
			return 'JSFL_COMPILELIST_COMPILE_ERROR';
		} else {
			// remove output file
			FLfile.remove(errorFile);
		/*
			if (getVersion().mac) {
				uri = uri.split('Macintosh HD/').join('');
			} else {
				uri = 
			}
			*/	
			uri = convertURI(uri);
			
		
			if (openFiles[escape(uri)] !== true) {
				fl.getDocumentDOM().close();
			}
		}
	}
	
	if (missingFiles.length > 0) {
		return '%MISSING_FILES%'+missingFiles.join(';');
	}
}

function testMovie(p_file) {
	var doc = fl.openDocument(p_file);
	doc.testMovie();
}

function publishMovie(p_file) {
	var doc = fl.openDocument(p_file);
	doc.publish();
}

function exportSWF(p_file, p_locale) {
	var locale = new XML(unescape(p_locale));
	
	var swf = fl.browseForFileURL("save", locale.@CM_EXPORT_SWF);
	
	if(swf != undefined) {
		var docIndex = fl.findDocumentIndex(p_file.substr(p_file.lastIndexOf("/")+1, p_file.length-1));
		var doc = fl.openDocument(p_file);
		var dom = fl.getDocumentDOM();
		dom.exportSWF(swf, true);

		if (docIndex == "") { dom.close(false); }
	}
}

function browseForFile(p_dialogLabel, p_fileType, p_typeLabel) { //:String
	var macFormat;
	var winFormat;
	
	switch (p_fileType) {
		case 'as':
			macFormat = p_typeLabel + '|AS[*.as||';
			winFormat = p_typeLabel + '|*.as||';
			break;
		case 'swc':
			macFormat = p_typeLabel + '|SWC[*.swc||';
			winFormat = p_typeLabel + '|*.swc||';
			break;
	}
	
	//3rd param is for dreamweaver only.
	return fl.browseForFileURL("open", p_dialogLabel, {}, macFormat, winFormat);
}

function fileProperties(p_path, p_locale) { //:XML
	var locale = new XML(unescape(p_locale));
	
	// Lop off the trailing slashes, otherwise it breaks.
	if (p_path.substr(p_path.length-1,1) == "/") {
		p_path = p_path.substr(0, p_path.length-1);
	}
	
	var size;
	
	if (isFolder(p_path)) {
		size = getFolderFileCount(p_path); //'0 (' + getFolderFileCount(p_path) + ' ' + locale.@LBL_FILES + ')';
	} else {
		size = getSize(p_path, true);
	}
	
	var created = FLfile.getCreationDateObj(p_path);
	var modified = FLfile.getModificationDateObj(p_path);
	var attr = FLfile.getAttributes(p_path);
	
	var props = new XML(<props />);
	props.@size = size;
	props.@created = created.getTime();
	props.@modified = modified.getTime();
	props.@attr = attr;
	
	return props.toXMLString();
}

function getFolderFileCount(p_uri) {
	/*
	var folders = FLfile.listFolder(p_uri, "directories");
	var files = FLfile.listFolder(p_uri, "files");
	var items = folders.concat(files);
	*/
	return FLfile.listFolder(p_uri).length;
}

function emptyDirectory(p_path) { //:Boolean
	var items = FLfile.listFolder(p_path);
	var failCount = 0;
	var len = items.length;
	if (len) {	
		for (var i=0; i<len; i++) {
			var item = items[i];
			if (item == null) { continue; }
		
			if (!FLfile.remove(p_path + item)) {
				failCount++;
			}
		}
	}
	return failCount;
}

function roundTo(p_num, p_place) {
	return Math.round(p_num*Math.pow(10, p_place))/Math.pow(10, p_place);
}

function getSize(p_fileURI, p_convert) {
	var bytes = FLfile.getSize(p_fileURI);
	if (p_convert) { return getByteValue(bytes); }
	return bytes
}

function getByteValue(p_val) {
	if (p_val < 1024) {
		return p_val + " bytes";
	} else if (p_val < 1048576) {
		return roundTo((p_val/1024),2)+" KB";
	} else if (p_val < 1073741824) {
		return roundTo((p_val/1048576), 2)+" MB";
	} else if (p_val < 1099511627776) {
		return roundTo((p_val/1073741824), 2)+" GB";
	} else if (p_val < 1125899906842624) {
		return roundTo((p_val/1099511627776), 2)+" TB";
	} else if (p_val < 1152921504606846976) {
		return roundTo((p_val/1125899906842624),2)+" PB";
	} else {
		return roundTo((p_val/1152921504606846976),2)+" EB";
	}
}

function directory(p_path) {
	if (p_path == undefined) { return; }
	if (p_path.substr(-1) == "/") { return p_path; }
	return p_path + "/";
}

function createFile(p_fileURI, p_contents) {
	var success = FLfile.write(p_fileURI, unescape(p_contents));
	return success
}

function createFLA(p_path, p_openFile, p_version) {
	if (FLfile.exists(p_path)) { return false; }
	
	/*
	Undocumented:
	fl.createNewDialog(1)
	Number of types 7
	choice: 0 - Flash File (ActionScript 3.0) : fla
	choice: 1 - Flash File (ActionScript 2.0) : fla
	choice: 2 - Flash File (Mobile) : fla
	choice: 3 - ActionScript File : as
	choice: 4 - ActionScript Communication File : asc
	choice: 5 - Flash JavaScript File : jsfl
	choice: 6 - Flash Project : flp
	*/
	var asVersion = (p_version == '0' || p_version == '3')?0:1;
	
	fl.createNewDialog(asVersion);//fl.createDocument("timeline");
	
	var doc = fl.getDocumentDOM();
	doc.setMetadata(''); // Must do this to save
	/*
	//wdg:: This caused a bug where the file would open with the play head on frame 2. 
	//		setMetadata('') modifies the file with no timeline modification.
	doc.getTimeline().insertFrames(1); // Must do this to save
	doc.getTimeline().removeFrames(1);
	*/
	var success = fl.saveDocument(doc, p_path);
	
	if (!success) { return false; }
	if (p_openFile != 'true') { fl.closeDocument(doc); }
	return true;
}

//
//	CreateClass
//	* Create a class file based on template files
//
/*
Flash sends paths based on projects langugae type
	p_templatePaths = <templatePaths standardClass='file://' boundClass='file://' />
	p_props: <props boundClass='' fullPath='' fillUI=true useSelected=true asVersion=2 openClass=true />
*/
function createClass(p_classPath, p_package, p_templatePaths, p_props) {
	// Mostly, the following is converting between package paths, URIs and arrays
	var PACKAGES = {};	// Object of packages (com.package.views)
	var ARRAYS = {};	// Object of package arrays ([com,package,views])
	var URIS = {};		// Object of Full URIs (file:///path/to/URI
	
	var templatePaths = new XML(p_templatePaths);
	var props = attributesToObject(new XML(p_props));
	
	URIS.classPath = directory(p_classPath); //getClassPath(p_basePath, (uriList[0] == "default") ? defaultClassPath : uriList[0]); // (Uses Default Path and Relative Class Path...
	URIS.classTemplate = templatePaths.@standardClass;
	URIS.boundTemplate = templatePaths.@boundClass;
	
	//wdg:: uri2Array should return a Array, if an String is returned, an error happened, so pass it back to flash.
	var classPath = uri2Array(p_classPath);
	if (classPath instanceof String) {
		return classPath;
	}
	
	ARRAYS.classPath = classPath;
	
	var folder = p_package.split(".");
	var className = folder.pop(); // ClassName
	var pieces = [className.substr(0,1), className.substr(1,className.length-1)];
	className = pieces[0].toUpperCase() + pieces[1]; // Capitalize the First Letter.
	
	ARRAYS.folder = folder; // [com,test,views]
	PACKAGES.folder = fixPackage(ARRAYS.folder.join("."));
	
	var libraryFolder = ARRAYS.folder.join("/"); // Library Folder
	URIS.classFolder = fixURI(URIS.classPath + ARRAYS.folder.join("/"));
	
// Library/Clip Creation
	var dom = fl.getDocumentDOM();
	if (props.boundClass && dom != null) {
		var lib = dom.library;
		var linkageID = (props.fullPath) ? PACKAGES.folder + (PACKAGES.folder!=''?'.':'') + className : className;
		if (props.useSelected)  {
			var selItems = lib.getSelectedItems();

			if (selItems.length > 1) {
				return "JSFL_TO_MANY_ITEMS";
			} else if (selItems.length < 1) {
				return "JSFL_NO_ITEMS_SELECTED";
			} else {
				
				// Always grab first item in selection array
				var item = selItems[0];

				if (item.itemType != "movie clip") {
					return "JSFL_ITEM_NOT_MOVIE_CLIP";
				}
		
				applyLinkageOrClass(item, linkageID, PACKAGES.folder, className, props);
	
				if (lib.itemExists(libraryFolder+ "/" +item.name)) {
					return "JSFL_ITEM_EXISTS";
				} else {
					if (libraryFolder != "") { lib.newFolder(libraryFolder); }
					lib.moveToFolder(libraryFolder, item.name);
				}
			}
		} else {
			// create clip
			var itemPath = libraryFolder + "/" + className;
			var created = lib.addNewItem("movie clip", itemPath);
			// apply linkage
			if (created) {
				lib.selectItem(itemPath);
				var item = lib.getSelectedItems()[0];
				applyLinkageOrClass(item, linkageID, PACKAGES.folder, className, props);
			} else {
				return "JSFL_ITEM_CREATE_FAIL";
			}
		}
	}

	// Create Package
	if (! FLfile.exists(URIS.classFolder)) {
		var success = FLfile.createFolder(URIS.classFolder);
		if (!success) { return "JSFL_CREATE_FOLDER_FAIL"; }
	}

	// Read the Tempate Package
	var templateURI = (props.boundClass) ? URIS.boundTemplate : URIS.classTemplate;
	
	if (! FLfile.exists(templateURI)) { return "JSFL_NO_CLASS_TEMPLATE%URI%"+templateURI; }
	var code = FLfile.read(templateURI);
	
	// Populate Template
	
	if (props.asVersion == 1) {
		var classSource = code.split("%PACKAGE_NAME%"+((PACKAGES.folder == '')?'.':'')).join(PACKAGES.folder);
	} else {
		var classSource = code.split("%PACKAGE_NAME%").join(PACKAGES.folder);
	}
	
	classSource = classSource.split("%CLASS_NAME%").join(className);
	
	if (linkageID != null) { classSource = classSource.split("%LINKAGE_ID%").join(linkageID); }
	
	//Add the Base class, if the clip doesn't have one just use MovieClip (DEFAULT_BASE_CLASS) / AS3 Only.
	if (props.asVersion == 0 && props.boundClass) {
		var baseClassPath = item.linkageBaseClass;
		
		if (baseClassPath) {
			var baseClassName = '';
			
			if (baseClassPath.indexOf('.') != -1) {
				baseClassName = baseClassPath.split('.').pop();
			} else {
				baseClassName = baseClassPath;
			}
			
		} else {
			baseClassPath = DEFAULT_BASE_CLASS;
			baseClassName = DEFAULT_BASE_CLASS.split('.').pop();
		}
		
		classSource = classSource.split('%BASE_CLASS_PATH%').join(baseClassPath);
		classSource = classSource.split('%BASE_CLASS_NAME%').join(baseClassName);	
	}
	
	//Clean any beginning line breaks / spaces
	if (/\w/.test(classSource.charAt(0)) == false) {
		classSource = classSource.replace(/\s+/, '');
	}
	
	// Write to Disk
	var saveURI = fixURI(URIS.classFolder+ "/" + className + ".as");
	
	if (!FLfile.exists(saveURI)) {
		FLfile.write(saveURI, classSource);
	} else {
		return 'JSFL_CREATECLASS_EXISTS';
	}
	
	if (props.boundClass) {
		// Run this, regardless of fillUI option, to clean it.
		fl.runScript(fl.configURI + "Project/UIAutoFill.jsfl", "fillUI", item, saveURI, props); // AutoFill UI?
	}
	
	// Optional, Open Class
	if (props.openClass == true) { fl.openScript(saveURI); }
	
	return true;
}

function applyLinkageOrClass(p_item, p_linkageID, p_package, p_className, p_props) {
	switch (p_props.asVersion) {
		case 1: //AS 2
			if (linkageExists(p_linkageID, p_item)) {
				return "JSFL_LINKAGE_EXISTS"; //"The linkage \""+p_linkageID+"\" already exists, and can not be overwritten.\nThe export settings for this item will not be changed.";
			} else {
				if (p_item.linkageIdentifier == undefined) { p_item.linkageExportForAS = true; }
				p_item.linkageIdentifier = p_linkageID;
				p_item.linkageClassName = ((p_package != '')?p_package + '.':'') + p_className;
				p_item.linkageExportInFirstFrame = true;
			}
			break;
		case 0: //AS3
			if (classExists(p_linkageID, p_item)) {
				return "JSFL_CLASS_EXISTS"; //"The class \""+p_linkageID+"\" already exists, and can not be overwritten.\nThe export settings for this item will not be changed.";
			} else {
				if (p_item.className == undefined) { p_item.linkageExportForAS = true; }
				p_item.linkageIdentifier = p_linkageID;
				p_item.linkageClassName = ((p_package != '')?p_package + '.':'') + p_className;
				p_item.linkageExportInFirstFrame = true;
			}
			break;
	}
}

function findClassesDirectory(p_path, p_projectRoot) { //:String
	var relPath = p_projectRoot;
	
	if (p_path.indexOf(':') != -1 && p_path.indexOf("file://") == -1) {
		p_path = p_path.split(':').join('/');
	}
	
	if (p_path.indexOf("file://") == 0) {
		p_path = p_path.split('file://').join('');
	}
	
	if (p_path.indexOf("../") == 0) {
		var newPath = recurseURI(_encodeURI(relPath), p_path);
		
		if (newPath != -1) {
			classPath = newPath;
		}
		
	} else if (p_path.indexOf(".") == 0) {
		if (p_path.indexOf("./") == 0) {
			var newPath = p_path.substr(2, p_path.length);
			if (newPath == '/') { newPath = ''; }
			classPath = _encodeURI(relPath+newPath);
		} else {
			classPath = _encodeURI(relPath);
		}
	} else if (p_path == '/') {
		classPath = _encodeURI(relPath);
	} else {
		classPath = _encodeURI(p_path);
	}
	
	return classPath;
}

//p_errors: Array
function formatErrorXML(p_errors, p_level) { //XML
	p_level = (p_level == null)?'none':p_level
	
	var errorXML = <errors level={p_level} />;
	
	if (!p_errors || p_errors.length == 0) { return errorXML; }
	
	while (p_errors.length) {
		errorXML.appendChild(p_errors.shift());
	}
	
	return errorXML;
}

/*
wdg:: Utility Method to send errors Back to Flash.

	<errors level="error | warning | information | none">
		<error key="UTIL_NO_OPEN_DOCUMENTS">
			<string key="itemName" value="My movie clip name." />
		</error>
		<error key="UTIL_NO_OPEN_DOCUMENTS" />
	</errors>
*/
function formatErrorXMLNode(p_string, p_replaceStrings) { //XML
	var node = <error key={p_string} />
	for (var n in p_replaceStrings) {
		var stringNode = new XML('<string />');
		stringNode.@key = n;
		stringNode.@value = p_replaceStrings[n];
		
		node.appendChild(stringNode);
	}
	return node;
}

// UPDATE UI
function updateUIElements(p_classPath, p_locations) {
	var dom = fl.getDocumentDOM();
	
	if (dom == null) { return formatErrorXML( [ formatErrorXMLNode('UTIL_NO_OPEN_DOCUMENTS', {}) ], 'warning'); }
	if (dom.path == undefined) { return formatErrorXML( [ formatErrorXMLNode('DLG_SAVE_DOCUMENT', {}) ], 'warning'); }
	
	var items = getLibraryURIs(p_classPath);
	if (items == undefined || items.length == 0) { return formatErrorXML( [ formatErrorXMLNode('UTIL_NO_LIB_ITEMS', {}) ], 'warning'); }

	var found = items.found;
	updated = [];
	var errors = [];
	
	for (var i=0; i<found.length; i++) {
		//fl.trace("Updating symbol: " + found[i].item.name);
		var ok = fl.runScript(fl.configURI + "Project/UIAutoFill.jsfl", "fillUI", found[i].item, found[i].path, {asVersion:dom.asVersion, fillUI:true});
		if (ok != "false") {
			updated.push("-- " + found[i].item.name);
		} else {
			errors.push(formatErrorXMLNode('UTIL_TAGS_INVALID', {}));
			//fl.trace("** The format tags for this class are incorrect. This class will not be updated.");
		}
	}
	
	if (updated.length > 0) {
		var item = (updated.length == 1) ? "item" : "items";
		
		errors.push(formatErrorXMLNode('UTIL_CLASS_UPDATED', {classCount:updated.length + ' ' + item }));
	}

	var notFound = items.notFound;
	if (notFound.length > 0) {
		errors.push(formatErrorXMLNode('UTIL_CLASSES_NOT_FOUND', {numClasses:notFound.length, classList:notFound.join("\n")}));
		//fl.trace("\n-- " + notFound.length + " class(es) not found --\n" + notFound.join("\n"));
	}
	
	return formatErrorXML(errors, 'warning');
}

// Organize Library
function organizeLibrary() { //XML
	var dom = fl.getDocumentDOM();
	if (dom == null) { return formatErrorXML([ formatErrorXMLNode('UTIL_NO_OPEN_DOCUMENTS', {}) ]); }
	var lib = dom.library;
	var libItems = lib.items;
	var l = libItems.length;
	
	if (l == 0 || libItems == undefined) { return formatErrorXML([ formatErrorXMLNode('UTIL_NO_LIB_ITEMS', {}) ]); }
	
	var libraryErrors = [];
	var copyCount = 0;
	
	for (var i=0; i<l; i++) {
		var item = libItems[i];
		
		var path = '';
		if (dom.asVersion == 1) {
			if (item.linkageIdentifier == undefined) { continue; }
			if (item.linkageIdentifier.indexOf(".") == -1) { continue; }
			path = item.linkageIdentifier.split(".");
		} else {
			if (item.linkageClassName == undefined) { continue; }
			if (item.linkageClassName.indexOf(".") == -1) { continue; }
			path = item.linkageClassName.split(".");
		}
		
		if (path[path.length-1].indexOf(":") != -1) {
			// we're going to need an assets dir too:
			var foo = path[path.length-1].split(":")[0]+" Assets";
			path.splice(path.length-1,0,foo);
		}

		var dirSuccess = true;
		// walk the path, and create directories if they don't already exist:
		var l2 = path.length;
		var strPath="";
		for (var j=0; j<l2-1; j++) {
			strPath += (j==0) ? path[j] : "/"+path[j];
			if (!lib.itemExists(strPath)) {
				// doesn't exist, create dir:
				lib.addNewItem("folder", strPath);
			}
			var dirIndex = lib.findItemIndex(strPath);
			var dir = lib.items[dirIndex];
			if (dir.itemType != "folder") {
				libraryErrors.push(formatErrorXMLNode('UTIL_DIRECTORY_CREATE_ERROR', {dirPath:strPath}));
				dirSuccess = false;
				break;
			}
		}
		if (!dirSuccess) {
			libraryErrors.push(formatErrorXMLNode('UTIL_TARGET_FOLDER_MISSING', {itemName:item.name}));
			continue;
		}
		
		// now move the original item into the new directory:
		var moveSuccess = lib.moveToFolder(strPath,item.name,false);
		if (moveSuccess) {
			copyCount++;
		} else {
			libraryErrors.push(formatErrorXMLNode('UTIL_ITEM_EXISTS', {path:strPath, itemName:item.name}));
		}
	}
	
	if (libraryErrors.length > 0) {
		return formatErrorXML(libraryErrors, 'warning');
	} else {
		return formatErrorXML( [ formatErrorXMLNode('UTIL_LIB_ITEMS_MOVED', {numItems:copyCount}) ], 'information');
	}
}

//Open bound classes.
function openBoundClasses(p_projectClassPath) { //XML
	var classPaths = []; //["./classes", "$(LocalData)/Classes", "."];

	var dom = fl.getDocumentDOM();
	
	if (dom == null) {
		return formatErrorXML( [formatErrorXMLNode('DLG_NO_DOCUMENT', {})], 'error');
	}
	
	if (dom.path == undefined) {
		return formatErrorXML( [formatErrorXMLNode('DLG_SAVE_DOCUMENT', {})], 'error');
	}
	
	switch (dom.asVersion) {
		case 0:
			classPaths = fl.as3PackagePaths.split(';'); break;
		case 1: 
			classPaths = fl.packagePaths.split(';'); break;
	}
	
	//trace('p_projectClassPath: ' + p_projectClassPath);
	
	if (classPaths.indexOf(p_projectClassPath) == -1) {
		classPaths.push(p_projectClassPath); //Add in the project class path.
	}
	
	var found = true;
	
	var relPath = dom.path.split(dom.name).join("");
	var items = dom.library.getSelectedItems();
	var len = items.length;
	var errors = [];
	
	for (var i = 0; i<len; i++) {
		var ocLoc = items[i].linkageClassName;
		
		if (ocLoc == undefined) {
			errors.push( formatErrorXMLNode('UTIL_NO_CLASS', {libItemName:items[i].name}) );
			continue;
		}
		
		if ((ocLoc != undefined) && (String(ocLoc).length)) {
			var cLoc = ocLoc.split(".").join("/")+".as";
			var cLen = classPaths.length;
			var scriptPath;
			for (var j = 0; j<cLen; j++) {
				var path = classPaths[j];
				if (path.indexOf("../") != -1) {
					var newPath = recurseURI(_encodeURI(relPath), path);
					if (newPath != -1) {
						scriptPath = newPath+"/"+cLoc;
					}
				} else if (path.indexOf(".") != -1) {
					if (path.indexOf("./") != -1) {
						var newPath = path.substr(2, path.length)+"/";
						
						newPath = (newPath.lastIndexOf('/') == newPath.length-1)?newPath:newPath+'/';
						
						scriptPath = _encodeURI(relPath+newPath+cLoc);
						//trace('scriptPath: ' + scriptPath);
					} else {
						scriptPath = _encodeURI(relPath+cLoc);
					}
				} else if (path.indexOf("$(LocalData)") != -1) { // || path.indexOf("$(AppConfig)") != -1) {
					if (path.indexOf("/") != -1) {
						var dir = path.substring(13, path.length);
						scriptPath = (fl.configURI+dir+"/"+cLoc);
					} else {
						scriptPath = (fl.configURI+"/"+cLoc)
					}
				} else {
					scriptPath = path+cLoc;
				}
				
				//Remove trailing slash that _encodeURI() adds
				if (scriptPath.lastIndexOf('/') == scriptPath.length-1) {
					scriptPath = scriptPath.substr(0, scriptPath.length-1);
				}
				
				if (FLfile.exists(scriptPath)) {
					found = true;
					fl.openScript(scriptPath);
					break;
				} else { found = false; }
			}
			
			if (!found) {
				errors.push( formatErrorXMLNode('UTIL_CLASS_NOT_FOUND', {className:ocLoc}) );
			}
		}
	}
	
	if (errors.length > 0) {
		return formatErrorXML(errors, 'error');
	}
}

//################################################
//Internal Utility Methods
//################################################
function getClassURI(p_basePath, p_classPath, p_locations, p_item) {
	var path = p_item.linkageClassName;
	if (path == undefined || String(path).length == 0) { return; }
	
	var cLoc = path.split(".").join("/") + ".as";
	var paths = [p_basePath + cLoc, directory(p_classPath) + cLoc];
	
	for (var i=0; i<p_locations.length; i++) {
		paths.push(directory(p_locations[i]) + cLoc);
	}
	
	for (var i=0; i<paths.length; i++) {
		var scriptPath = paths[i];
		if (FLfile.exists(scriptPath)) { return scriptPath; }
	}
	
	return false;
}

function getLibraryURIs(p_classPath, p_locations) {
	var dom = fl.getDocumentDOM();
	
	var lib = dom.library;
	if (lib == null) { return; }
	var items = lib.getSelectedItems();
	var l = items.length
	if (l == 0) { return; }

	// Start Looking in [file folder / classPath]
	var basePath = convertURI(dom.path);
	var locations = (p_locations == undefined) ? [] : p_locations.split("|||");

	var notFound = [];
	var found = [];
	for (var i=0; i<l; i++) {
		var path = getClassURI(basePath, p_classPath, locations, items[i]);
		if (path == undefined) { continue; }
		if (path != false) {
			found.push({path:path, item:items[i]});
		} else {
			notFound.push("-" + items[i].name);
		}
	}
	return {found:found, notFound:notFound};
}

function isFileTypeValid(p_file, p_validTypes) { //:Boolean
	if (p_file.indexOf('.') == -1) { return true; }
	
	var l = p_validTypes.length;
//	if (!l) { return true; }
	var fileExt = p_file.split('.').pop().toLowerCase();
	
	for (i=0;i<l;i++) {
		if (fileExt == p_validTypes[i].toString().toLowerCase()) { return true; }
	}
	return false;
}

function hideFile(p_file, p_hideFiles) { //:Boolean
	var l = p_hideFiles.length;
	for (i=0;i<l;i++) {
		if (p_file.toLowerCase().indexOf(p_hideFiles[i].toLowerCase()) == 0) { return true; }
	}
	return false;
}

function getVersion() {
	var ver = fl.version;
	var pieces = ver.split(",");
	var plat = pieces[0].split(" ");
	return {
		platform: plat[0],
		windows: (plat[0] == "WIN"),
		mac: (plat[0] == "MAC"),
		major: plat[1],
		minor: pieces[1],
		revision: pieces[2],
		build: pieces[3]
	};
}

function attributesToObject(p_xml) {
	var atts = p_xml.attributes();
	var obj = {};
	
	var l = atts.length();
	for (i=0;i<l;i++) {
		var name = atts[i].name();
		var value = atts[i].valueOf();
		obj[name] = (value == 'true')?true:(value == 'false')?false:value;
		
		if (!isNaN(parseInt(value))) {
			obj[name] = parseInt(value);
		}
	}
	return obj;
}

function recurseURI(p_uri, p_steps) {
	var uriSteps = p_uri.split("/");
	var uriLen = uriSteps.length;
	var stepArr = p_steps.split("../");
	var stepCount = stepArr.length;
	for (var i=0;i<stepCount;i++) { uriSteps.pop();	}
	var newURI = uriSteps.join("/") + "/" + stepArr[stepCount-1];
	if (!FLfile.exists(newURI)) { return -1; }
	return newURI;
}

function _encodeURI(p_uri) {
	var uri = p_uri.split("\\").join("/");
	
	//Remove any extra trailing slashes.
	//To ensure whe only have 1
	if (p_uri.length > 0) {
		while (p_uri.lastIndexOf('/') == p_uri.length-1) {
			p_uri = p_uri.slice(0, p_uri.length-1)
		}
		p_uri = p_uri + '/';
	}
	
	if (p_uri.indexOf('file:///') == -1) {
		
		if (p_uri.indexOf('/') == 0) { p_uri = p_uri.slice(1, p_uri.length); }
		
	 	p_uri = "file:///"+p_uri;
	}
	
	return p_uri;
}

// remove Double Slashes
function fixURI(p_uri) {
	var fst = getURIPrefix(p_uri);
	var uri = p_uri.split(fst).join("$$$");
	uri = uri.split("//").join("/");
	uri = uri.split("$$$").join(fst);
	return uri;
}

// Remove preceding or trailing or double "."
function fixPackage(p_package) {
	var p = p_package.split(".");
	var l = p.length;
	for (var i=0; i<l; i++) {
		if (p[i] == "") { p.splice(i, 1); }
	}
	return p.join(".");
}

function uri2Array(p_uri) {
	var fst = getURIPrefix(p_uri);
	if (fst == "") { return "JSFL_BAD_URI"; }
	p_uri = p_uri.substr(fst.length, p_uri.length-1);
	var arr = p_uri.split("/");
	while (arr[arr.length-1] == "") { arr.pop(); }
	return arr;
}

function getURIPrefix(p_uri) {
	var fst = "";
	if (p_uri.substr(0,8) == "file:///") {
		fst = "file:///";
	} else if (p_uri.substr(0,7) == "file://") {
		fst = "file://";
	}
	return fst;
}

function linkageExists(p_linkage, p_ignore) {
	var dom = fl.getDocumentDOM();
	if (dom == null) { return true; }
	var lib = dom.library;
	if (lib == null) { return true; }
	var l = lib.items.length;
	
	for (var i=0; i<l; i++) {
		if (lib.items[i] == p_ignore) { continue; }
		if (lib.items[i].linkageIdentifier == p_linkage) { return true; }
	}
	
	return false;
}

function classExists(p_class, p_ignore) {
	var dom = fl.getDocumentDOM();
	if (dom == null) { return true; }
	var lib = dom.library;
	if (lib == null) { return true; }
	var l = lib.items.length;
	for (var i=0; i<l; i++) {
		if (lib.items[i] == p_ignore) { continue; }
		if (lib.items[i].linkageClassName == p_class) { return true; }
	}
	return false;
}

function convertURI(p_path) {
	var network = (p_path.substr(0,2) == "\\\\"); // Does path start with "\\"?
	
	//Already an URI so just return it.
	if (p_path.indexOf('file://') == 0) { return p_path; }

	if (version.mac) { // Sort of a URI, but without a "file://"
		//fl.trace(" > Platform: Mac 8+");
		var fst = "file:///";
		var div = "/";
		p_path = getMacHD() + p_path;
	} else if (network) {
		//fl.trace(" > Platform: Win Network");
		var fst = "file://";
		var div = "\\";
	} else { // Windows ALWAYS uses a windows path...
		//fl.trace(" > Platform: Win Local 7");
		var fst = "file:///"
		var div = "\\";
		p_path = p_path.split(":").join("|");
	}
	
	var path = p_path.substr(0, p_path.lastIndexOf(div)+1);
	path = fst + path.split(div).join("/");
	return path;
}

function getMacHD() {
	// RM: hack attempt at finding HD name
	return unescape(fl.configURI.replace('file:///','').split('/').shift());
}

function filterCollectionToArray(p_xmlList) { //Array
	var xml = new XML(unescape(p_xmlList));
	var fileArray = [];
	var children = xml.children();
	var l = children.length();
	for (i=0;i<l;i++) {
		fileArray.push(children[i].valueOf());
	}
	return fileArray;
}

function numberOf(p_substr, p_string) {
	return p_string.split(p_substr).length-1;
}

function getPublishProfileItem(p_tab, p_item) {
	// output publish profile xml file
	var fileURI = fl.configURI + "_tempasdf1234.xml";
	fl.getDocumentDOM().exportPublishProfile(fileURI);

	// read file in as string
	var pubContent = FLfile.read(fileURI);
	
	// RM: JSFL dies if the xml tag is there..	
	var xmlContent = new XML( pubContent.replace('<?xml version="1.0"?>','') );
	
	// delete temp file
	FLfile.remove(fileURI);

	return eval('xmlContent..Publish'+p_tab+'Properties..'+p_item); // RM: impressive isn't it..
}

function trace(p_str) {
	fl.trace(unescape(p_str));
}