/**
* BitmapSlice9 JSFL by Grant Skinner. Apr 13, 2010
* Visit www.gskinner.com/blog for documentation, updates and more free code.
*
* Copyright (c) 2010 Grant Skinner
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
* @icon	{iconsURI}/design/imaging/imaging_workspace.png
* @desc Slices a bitmap into parts so slice-9 scaling works correctly
**/

/**
* Version 1.1, May 4: fixed issue with symbols in library folders. 
**/

var doc = fl.getDocumentDOM();
var minAsVersion = 2;
var minPlayerVersion = 8;
var selection = null;
var layer = null;
var grid = null;

run();

function run() {
	if (!checkDocument()) { return; }
	if (!checkSelection()) { return; }
	if (!checkScale9()) { return; }
	
	// everything checks out.
	slice();
}

function checkDocument() {
	if (doc == null) {
		alert('You must have an FLA open as your active document to run this command.');
		return false;
	}
	if (doc.asVersion < minAsVersion || parseInt(doc.getPlayerVersion()) < minPlayerVersion) {
		alert('The Scale9 feature must target Flash Player ' + minPlayerVersion + ' and ActionScript ' + minAsVersion + '.');
		return false;
	}
	return true;
}

function checkSelection() {
	var selectedItems = doc.selection;
	if (selectedItems.length != 1 || selectedItems[0].instanceType != "bitmap") {
		alert('Please select a single bitmap object on the stage before running this command.');
		return false;
	}
	
	var selectedFrames = doc.getTimeline().getSelectedFrames();
	if (selectedFrames.length != 3) {
		alert('Only a single keyframe should be selected before running this command.');
		return false;
	}
	selection = selectedItems[0];
	layer = doc.getTimeline().layers[selectedFrames[0]];
	frame = layer.frames[selectedFrames[1]];
	return true;
}

function checkScale9() {
	var item = doc.getTimeline().libraryItem; //CS5
	if (item == null) {
		doc.library.selectItem(doc.getTimeline().name,true,true);
		item = doc.library.getSelectedItems()[0];
	}
	if (item == null) {
		alert('The selected bitmap must be in a MovieClip symbol.');
		return false;
	}
	if (!item.scalingGrid) {
		if (confirm('Scale 9 must be enabled for the parent symbol. Would you like to enable this now?')) {
			item.scalingGrid = true;
		}
		return false;
	}
	grid = item.scalingGridRect;
	grid = {x:grid.left, y:grid.top, width:grid.right-grid.left, height:grid.bottom-grid.top};
	return true;
}

function slice() {
	var timeline = doc.getTimeline();
	var bmp = selection.libraryItem;
	var name = bmp.name;
	if (name.indexOf(".") > 0) { name = name.substr(0,name.indexOf(".")); }
	if (name.indexOf("/") > 0) { name = name.substr(name.lastIndexOf("/")+1); }
	var sliceLayer = null;
	var bmpLayer = null;
	var index;
	
	
	// check if our selection is already on an existing _bmp layer:
	if (layer.name.substr(-4) == "_bmp") {
		bmpLayer = layer;
		name = layer.name.substr(0,layer.name.length-4);
	}
	
	// check if the slice layer already exists:
	var sliceLayerIndexes = timeline.findLayerIndex(name+"_slices");
	if (sliceLayerIndexes != null && sliceLayerIndexes.length > 0) {
		sliceLayer = timeline.layers[sliceLayerIndexes[0]];
	}
	
	// create or rename bmpLayer if needed:
	if (bmpLayer == null) {
		// create a bmpLayer if there are other elements on the current layer.
		if (frame.elements.length > 1) {
			// create new layer:
			doc.clipCut();
			if (sliceLayer) { timeline.setSelectedLayers(sliceLayerIndexes[0]); }
			index = timeline.addNewLayer(name+"_bmp","guide",true);
			bmpLayer = timeline.layers[index];
			doc.clipPaste(true);
		} else {
			// rename the current layer:
			layer.name = name+"_bmp";
			bmpLayer = layer;
		}
	}
	
	// set up bmpLayer properties:
	bmpLayer.visible = false; // hidden
	bmpLayer.layerType = "guide"; // avoid compiling it into the SWF
	
	if (sliceLayer) {
		// sliceLayer already exists, clear old slices:
		if (selectSlices(sliceLayer)) { document.deleteSelection(); }
	} else {
		// create new sliceLayer below the bmpLayer:
		index = timeline.addNewLayer(name+"_slices","normal",false);
		sliceLayer = timeline.layers[index];
	}
	
	// ensure the sliceLayer is selected:
	timeline.setSelectedLayers(timeline.findLayerIndex(sliceLayer.name)[0]);
	
	// find the original size and path of the library bitmap
	var bmpWidth = selection.hPixels;
	var bmpHeight = selection.vPixels;
	var bmpPath = bmp.name;
	
	// do the slicing:
	var srcRect = {x:selection.x, y:selection.y, width:selection.width, height:selection.height};
	
	var cols = [grid.x-10000, grid.x, grid.x+grid.width, 10000, grid.width, 10000];
	var rows = [grid.y-10000, grid.y, grid.y+grid.height, 10000, grid.height, 10000];
	
	for (var row=0; row<3; row++) {
		for (var col=0; col<3; col++) {
			var targetRect = getIntersection(srcRect, {x:cols[col], y:rows[row], width:cols[col+3], height:rows[row+3]});
			drawRect(bmpPath, bmpWidth, bmpHeight, srcRect, targetRect);
		}
	}
	
	selectSlices(sliceLayer);
}

function selectSlices(sliceLayer) {
	var elements = sliceLayer.frames[0].elements;
	var s = [];
	for (var i=0; i<elements.length; i++) {
		// only remove rectangle primitives, in case there are other items on the layer:
		if (elements[i].elementType == "shape" && elements[i].isRectangleObject) {
			s.push(elements[i]);
		}
	}
	if (s.length > 0) {
		document.selection = s;
	}
	return s.length > 0;
}

function drawRect(bmpPath, bmpWidth, bmpHeight, srcRect, targetRect) {
	if (targetRect == null) { return; }
	var fill = doc.getCustomFill();
	fill.style = "bitmap";
	fill.bitmapIsClipped = false;
	fill.bitmapPath = bmpPath;
	var matrix = selection.matrix;
	matrix.tx = srcRect.x;
	matrix.ty = srcRect.y;
	matrix.a = srcRect.width/(bmpWidth/20); // 20 seems to be a magic number for calculating the matrix.
	matrix.d = srcRect.height/(bmpHeight/20);
	matrix.b = matrix.c = 0;
	fill.matrix = matrix;
	doc.setCustomFill(fill);
	doc.addNewPrimitiveRectangle({left:targetRect.x, top:targetRect.y, right:targetRect.x+targetRect.width, bottom:targetRect.y+targetRect.height},0,false,true);
}

function getIntersection(rect1, rect2) {
	var x = max(rect1.x, rect2.x);
	var y = max(rect1.y, rect2.y);
	var r = min(rect1.x+rect1.width, rect2.x+rect2.width);
	var b = min(rect1.y+rect1.height, rect2.y+rect2.height);
	if (r > x && b > y) {
		return {x:x, y:y, width:r-x, height:b-y}
	}
	return null;
}

function max(num1, num2) {
	return (num1 > num2) ? num1 : num2;
}
function min(num1, num2) {
	return (num1 < num2) ? num1 : num2;
}