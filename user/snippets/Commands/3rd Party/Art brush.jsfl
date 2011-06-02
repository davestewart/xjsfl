/**
 * Maps the selected library symbol onto the selected path
 * 
 * @author	David Johnston
 * @icon	{iconsURI}Objects/object/object_billiard_marker.png
 *
 */
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Art Brush!!!
// By David Johnston
// Last modified Tuesday, April 06, 2010
// v1.1
//
// Maps the selected library symbol onto the selected path
// The library symbol must be made only of raw shape data, all on the 
// first frame of the first layer of the symbol.
//
// v1.1 Added the ability to add vertices to the brush stroke to make it
// follow the path almost perfectly
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

fl.runScript( fl.configURI + "Commands/Art brush.include");

MAX_EDGE_SUBDIVISION = 0;        // Max number of recursions when subdividing an edge

///////////////////////////////////////////////////////////////////////////
// CompoundBezier
//
// A path made up of multiple bezier objects
///////////////////////////////////////////////////////////////////////////

function CompoundBezier(_pathEdges)
{
	this.edges = _pathEdges;
	this.startLength = [];
	this.beziers = [];
	this.length = 0;
	
	for(var n = 0; n < this.edges.length; n++)
	{
		this.beziers[n] = new Bezier(this.edges[n].pt0, this.edges[n].pt1, this.edges[n].pt2);
		//fl.trace("Edge points: " + this.edges[n].pt0.x + ", " + this.edges[n].pt0.y);
		//fl.trace("             " + this.edges[n].pt1.x + ", " + this.edges[n].pt1.y);
		//fl.trace("             " + this.edges[n].pt2.x + ", " + this.edges[n].pt2.y);
		//fl.trace("Bezier points: " + this.beziers[n].pointA.x + ", " + this.beziers[n].pointA.y);
		//fl.trace("               " + this.beziers[n].pointB.x + ", " + this.beziers[n].pointB.y);
		//fl.trace("               " + this.beziers[n].pointC.x + ", " + this.beziers[n].pointC.y);
		this.startLength[n] = this.length;
		this.length += this.beziers[n].getLength();
		//fl.trace("Bezier " + n + " has length " + this.beziers[n].getLength());
	}
	this.startLength[n] = this.length;
}

CompoundBezier.prototype.getPointFromLength = function(_len)
{
	if(_len > this.length)
		_len = this.length;
	if(_len < 0)
		_len = 0;
	//fl.trace("getting point at " + _len + " in path of length " + this.length);
	var top = this.edges.length;
	var bottom = 0;
	
	//fl.trace("bottom: " + bottom + ", middle: " + middle + ", top: " + top);
	//fl.trace("len: " + _len + ", bottom: " + this.startLength[bottom] + ", bottom + 1: " + this.startLength[bottom + 1] + ", top: " + this.startLength[top]);

	//var count = 0; 
	// First find the bezier our point is in
	while(this.startLength[bottom + 1] < _len && this.startLength[bottom + 1] != this.length)
	{
		//fl.trace("getpointfromlength: count = " + count++);
		var middle = ((top + bottom) / 2) | 0;
		
		//fl.trace("bottom: " + bottom + ", middle: " + middle + ", top: " + top);
		//fl.trace("len: " + _len + ", bottom: " + this.startLength[bottom] + ", middle: " + this.startLength[middle] + ", top: " + this.startLength[top]);
		
		if(this.startLength[middle] < _len)
			bottom = middle;
		else
			top = middle;
	}
	// Now bottom is the index of the bezier that has our point.
	
	//fl.trace("startLen[" + bottom + "] = " + this.startLength[bottom]);
	//fl.trace("in getPointFromLength: bezier " + bottom + " has length " + this.beziers[bottom].getLength());
	retval = this.beziers[bottom].getPointFromLength(_len - this.startLength[bottom]);
	
	//fl.trace("for length " + _len + ", point is at " + retval.x + ", " + retval.y);
	
	return retval;
}

CompoundBezier.prototype.getPointLinear = function(_s)
{
	//fl.trace("calling getPointLinear(" + _s + ")");
	//fl.trace("calling getPointFromLength(" + (_s * this.length) + ")");
	return this.getPointFromLength(_s * this.length);
}

CompoundBezier.prototype.getTangentVectorLinear = function(_t)
{
	var len = _t * this.length;

	var top = this.edges.length;
	var bottom = 0;
	
	//fl.trace("bottom: " + bottom + ", top: " + top);
	//fl.trace("len: " + len + ", bottom: " + this.startLength[bottom] + ", top: " + this.startLength[top]);
	// First find the bezier our point is in
	while(this.startLength[bottom + 1] < len && this.startLength[bottom + 1] != this.length)
	{
		var middle = ((top + bottom) / 2) | 0;

		//fl.trace("bottom: " + bottom + ", middle: " + middle + ", top: " + top);
		//fl.trace("len: " + _len + ", bottom: " + this.startLength[bottom] + ", middle: " + this.startLength[middle] + ", top: " + this.startLength[top]);
		
		if(this.startLength[middle] <= len)
			bottom = middle;
		else top = middle;
	}

	// Now bottom is the index of the bezier that has our point.
		
	//fl.trace("bottom: " + bottom + ", calling bezier.getParamFromLength(" + (len - this.startLength[bottom]) + ")");
	var param = this.beziers[bottom].getParamFromLength(len - this.startLength[bottom]);
	//fl.trace("... which returned " + param);
	
	return this.beziers[bottom].getTangentVector(param);
}

CompoundBezier.prototype.setBrushBounds = function(brushShape)
{
	var halfWidth = brushShape.width / 2;
	var halfHeight = brushShape.height / 2;
	
	this.brushX   = brushShape.x;
	this.brushY   = brushShape.y;

	this.brushLeft   = brushShape.x - halfWidth;
	this.brushTop    = brushShape.y - halfHeight;
	this.brushRight  = brushShape.x + halfWidth;
	this.brushBottom = brushShape.y + halfHeight;
	
	this.brushWidth  = brushShape.width;
	this.brushHeight = brushShape.height;
}


CompoundBezier.prototype.getBrushPoint = function(inPt)
{
	var normDist = (inPt.x - this.brushLeft)/ this.brushWidth;
	var outPt = this.getPointLinear(normDist);
	var tanVec = this.getTangentVectorLinear(normDist);
	var normalVec = {x: -tanVec.y, y: tanVec.x};     // perpendicular to the tangent
	
	//fl.trace("--------------getBrushPoint----------------------------------------");
	//fl.trace("normDist = " + normDist);
	//fl.trace("in point: " + inPt.x + ", " + inPt.y);
	//fl.trace("out point base: " + outPt.x + ", " + outPt.y);
	//fl.trace("Tangent: " + tanVec.x + ", " + tanVec.y);
	//fl.trace("Normal: " + normalVec.x + ", " + normalVec.y);
	
	// Normalize the normal
	var normalLen = Math.sqrt(normalVec.x * normalVec.x + normalVec.y * normalVec.y);
	normalVec.x /= normalLen;
	normalVec.y /= normalLen;
	//fl.trace("Normalized Normal: " + normalVec.x + ", " + normalVec.y);
	
	// Now multiply the normal by inPt.y and add it to outPt to get the final value;
	normalVec.x *= (inPt.y - this.brushY);
	normalVec.y *= (inPt.y - this.brushY);
	
	outPt.x += normalVec.x;
	outPt.y += normalVec.y;
	
	//fl.trace("------------------------------------------------------");
	return outPt;
}


CompoundBezier.prototype.getBrushPointAndVector = function(_inPt, _inVec)
{
	//fl.trace("------------get brush point and vector ");
	//fl.trace("in vector:      " + _inVec.x + ", " + _inVec.y);
	//fl.trace("in point:       " + _inPt.x + ", " + _inPt.y);

	_inVec.x *= this.length / this.brushWidth;

	var outVec = {};
	var normDist = (_inPt.x - this.brushLeft)/ this.brushWidth;
	var outPt = this.getPointLinear(normDist);
	var tanVec = this.getTangentVectorLinear(normDist);
	
	// Normalize the tangent vector
	var tanLen = Math.sqrt(tanVec.x * tanVec.x + tanVec.y * tanVec.y);
	tanVec.x /= tanLen;
	tanVec.y /= tanLen;
	
	var normalVec = {x: -tanVec.y, y: tanVec.x};     // perpendicular to the tangent
	
	//fl.trace("tangent vector: " + tanVec.x + ", " + tanVec.y);
	//fl.trace("normal vector:  " + normalVec.x + ", " + normalVec.y);
	
	// Now multiply the normal by _inPt.y and add it to outPt to get the final value;
	outPt.x += normalVec.x * (_inPt.y - this.brushY);
	outPt.y += normalVec.y * (_inPt.y - this.brushY);
	
	outVec.x = _inVec.x * tanVec.x;
	outVec.y = _inVec.x * tanVec.y;
	outVec.x += _inVec.y * normalVec.x;
	outVec.y += _inVec.y * normalVec.y;
	
	_inPt.x = outPt.x;
	_inPt.y = outPt.y;

	_inVec.x = outVec.x;
	_inVec.y = outVec.y;
	//fl.trace("out vector:     " + _inVec.x + ", " + _inVec.y);
	//fl.trace("out point:      " + _inPt.x + ", " + _inPt.y);
}

/////////////////////////////////////////////////////////////////////////////////////
// Test whether a bezier's bouding box intersects a vertical line at x
/////////////////////////////////////////////////////////////////////////////////////

boundsIntersectX = function(_edge, _x)
{
	var retval = Math.min(_edge.pt0.x, Math.min(_edge.pt1.x, _edge.pt2.x)) <= _x;
	retval = retval && (Math.max(_edge.pt0.x, Math.max(_edge.pt1.x, _edge.pt2.x)) >= _x);
	return retval;
}

/////////////////////////////////////////////////////////////////////////////////////
// addEdgeToDrawingPath(_edge, _path)
/////////////////////////////////////////////////////////////////////////////////////

addEdgeToDrawingPath = function(_edge, _path, _bezPath)
{
	var segPoints = [];
	var subdivision_level = 0;
	segPoints.push(_edge);
	segPoints.push(1);
                    
    // Pop edges off the stack one at a time until there are no more
    while(segPoints.length)
    {
    	subdivision_level = segPoints.pop();
    	
	    var thisEdge = segPoints.pop();
	    var thisBez = new Bezier(thisEdge.pt0, thisEdge.pt1, thisEdge.pt2);
	    
		var newVerts = [0]; // Start out with the start point, t = 0
		
		// Add vertices wherever there's a vertex in the path of the brushstroke
		//fl.trace("Number of edges in the brush path: " + (_bezPath.startLength.length - 1));
		for(var n = 1; n < _bezPath.startLength.length - 1; n++)
		{
			var localX = _bezPath.startLength[n] / _bezPath.startLength[_bezPath.startLength.length - 1] * _bezPath.brushWidth + _bezPath.brushLeft;
			//fl.trace("----------------------------------------------------------\ntesting for edge intersection with local x = " + localX);
			if(boundsIntersectX(thisEdge, localX))
			{
				//fl.trace("Yes!");
				var newIntercepts = thisBez.getXIntercepts(localX);
				//if(newIntercepts.length == 0)
					// fl.trace("####################################################################\n------------------------ Bounding box intercepted but edge didn't");
				newVerts = newVerts.concat(newIntercepts);
			}
		}
		newVerts.sort(function(a,b){ return a - b; });
		newVerts.push(1); // Finish off with the endpoint, t = 1
		//fl.trace("t values at intersections:");
		for(n = 0; n < newVerts.length; n++)
		{
			//fl.trace("t = " + newVerts[n]);
		}
		
		for(n = 0; n < newVerts.length - 1; n++)
		{
			//fl.trace("edge from t = " + newVerts[n] + " to t = " + newVerts[n + 1]);
			var pt0 = thisBez.getPointNatural(newVerts[n]);
			var pt2 = thisBez.getPointNatural(newVerts[n + 1]);
			var tan0 = thisBez.getTangentVector(newVerts[n]);
			var tan2 = thisBez.getTangentVector(newVerts[n + 1]);
			tan2.x = -tan2.x;
			tan2.y = -tan2.y;
			var pt1 = getIntersectionPoint(pt0, tan0, pt2, tan2, false);
			if(pt1 == INTERSECTION_PARALLEL)
			{
				// Must be a straight line.  Put pt1 right in the middle
				pt1 = {x: (pt0.x + pt2.x) / 2, y: (pt0.y + pt2.y) / 2};
			}
			//fl.trace("pt0: " + pt0.x + ", " + pt0.y);
			//fl.trace("pt1: " + pt1.x + ", " + pt1.y);
			//fl.trace("pt2: " + pt2.x + ", " + pt2.y);
			//fl.trace("tan0: " + tan0.x + ", " + tan0.y);
			//fl.trace("tan2: " + tan2.x + ", " + tan2.y);

			_bezPath.getBrushPointAndVector(pt0, tan0);
			_bezPath.getBrushPointAndVector(pt2, tan2);
	
			// Now I need to find the intersection of the two tangents -- that'll be pt1
			var tempPt1 = getIntersectionPoint(pt0, tan0, pt2, tan2);

			if(tempPt1 == INTERSECTION_PARALLEL || tempPt1 == INTERSECTION_OUTSIDE)
			{
				// The two vectors were parallel (probably the three control points 
				// are colinear), so just transform pt1 normally
				//fl.trace("intersection_parallel: " + (tempPt1 == INTERSECTION_PARALLEL));
				//fl.trace("intersection_outside:  " + (tempPt1 == INTERSECTION_OUTSIDE));
				pt1 = _bezPath.getBrushPoint(pt1);
			}
			else 
				pt1 = tempPt1;
	
			//fl.trace("transformed:");			
			//fl.trace("pt0: " + pt0.x + ", " + pt0.y);
			//fl.trace("pt1: " + pt1.x + ", " + pt1.y);
			//fl.trace("pt2: " + pt2.x + ", " + pt2.y);
			//fl.trace("tan0: " + tan0.x + ", " + tan0.y);
			//fl.trace("tan2: " + tan2.x + ", " + tan2.y);

			if(pt1 != undefined)
			{
				_path.addCurve(pt0.x, pt0.y, 
							   pt1.x, pt1.y, 
							   pt2.x, pt2.y);
			}
		}
	}
}

/////////////////////////////////////////////////////////////////////////////////////
// mapShapeToPath(shape)
//
// Draws the shape along the selected path as an art brush
/////////////////////////////////////////////////////////////////////////////////////

mapShapeToPath = function(brushShape, bezPath)
{	
	var currentEdgeNum;
	var segPoints;
	var firstEdgeNum;
	var fill;
	var stroke;
	
	// Set the fill and stroke for the new tweened shape
	var old_fill = doc.getCustomFill("toolbar");  
	var old_stroke = doc.getCustomStroke("toolbar");

	var selectionRect = doc.getSelectionRect()
	var prog = new ProgBar((selectionRect.left + selectionRect.right) / 2,
	                       (selectionRect.top + selectionRect.bottom) / 2);

	var numEdges = brushShape.edges.length;
	var progress = 0;

	for(var n = 0; n <  brushShape.contours.length; n++)
	{
		if(brushShape.contours[n].interior)
		{
			var he = brushShape.contours[n].getHalfEdge();
			var startPt;
			var thisEdge = he.getEdge();
			var pt0;
			var pt1;
			var pt2;
			var tan0, tan2;
			var newEdges;
			
			newEdges = getContourEdgeOrder(brushShape.contours[n]);
			drawPath = fl.drawingLayer.newPath();
			for(var m = 0; m < newEdges.length; m++)
			{
				addEdgeToDrawingPath(newEdges[m], drawPath, bezPath);
				if(progress++ % 10 == 0)
					prog.setProgress(progress / (numEdges * 2));
			}
			
			fill = brushShape.contours[n].fill;
			if(fill.style == "noFill")
			{
				// Creating a brushShape with "noFill" will leave the inside area unchanged, but we want it
				// to be transparent.  So let's fake it with a fully transparent color.
				// Maybe later we'll come back and delete all the transparent fills
				
				fill.style = "solid";
				fill.color = DUMMY_TRANSPARENCY;  // Alpha 0, any color but black (for some reason #00000000 won't work)
			}
			doc.setCustomFill(fill);
			
			//fl.trace("Drawing the filled brushShape");
			//fl.trace("      color = " + fill.color);
		
			// draw the brushShape without a stroke
			drawPath.makeShape(false, true);
		}
	}
	
	for(var n = 0; n < numEdges; n++)
	{
		if(brushShape.edges[n].stroke.style != "noStroke")
		{
			drawPath = fl.drawingLayer.newPath();
	
			var thisEdge = {pt0: brushShape.edges[n].getControl(0), 
			                pt1: brushShape.edges[n].getControl(1), 
			                pt2: brushShape.edges[n].getControl(2)};
			addEdgeToDrawingPath(thisEdge, drawPath, bezPath);
			
			fill = brushShape.contours[1].fill;
			fill.style = "noFill";
			stroke = brushShape.edges[n].stroke;
			doc.setCustomFill(fill);
			doc.setCustomStroke(stroke);
		
			// draw the curve
			drawPath.makeShape(fill.style == "noFill", stroke.shapeFill == undefined);
			
		}
		if(progress++ % 10 == 0)
			prog.setProgress(progress / (numEdges * 2));
	}
	
	// Retstore the original fill and stroke
	doc.setCustomFill(old_fill);
	doc.setCustomStroke(old_stroke);
	
	prog.end();
	
}

///////////////////////////////////////////////////////////////////////////
// Copies the raw shape data from layer 0, frame 0 of the item that's
// currently selected in the library and maps it onto the selected path
///////////////////////////////////////////////////////////////////////////

function mapSymbolToPath()
{
	if(doc)
	{
		if(doc.library.getSelectedItems().length != 1)
			alert("Please select a single item in the library");
		else
		{
			// Doesn't work properly if Flash is in object drawing mode
			var objectDrawingMode = fl.objectDrawingMode;
			fl.objectDrawingMode = false;
			
			// Get the shape data from the selected library item
			var brushShape = getBrushShape();

			var original_selection = doc.selection;
			
			var theEdges = [];

			// Draw the shape

			var tempFill = doc.getCustomFill("toolbar");
			var tempStroke = doc.getCustomStroke("toolbar");
			makeSelectionInvisible();
			doc.group();
			doc.setCustomFill(tempFill);
			doc.setCustomStroke(tempStroke);
			doc.unGroup();
			
			for(var i = 0; i < doc.selection.length; i++)
			{
				//fl.trace("shape " + i + " has " + doc.selection[i].edges.length + " edges");
				if(doc.selection[i] != undefined && doc.selection[i].elementType == "shape" && doc.selection[i].edges.length)
				{
					theEdges.push(doc.selection[i].edges);
					//fl.trace("shape " + i + " has " + doc.selection[i].edges.length + " edges");
				}
			}

			for(var i = 0; i < theEdges.length; i++)
			{
				doc.selectNone();
				doc.group();
				//fl.trace("Original path has " + theEdges[i].length + " edges");
				//fl.trace("creating bezier path");
				var orderedEdges = getEdgeOrderQuad(theEdges[i]);
				for(var n = 0; n < orderedEdges.length; n++)
				{
					var bezPath = new CompoundBezier(orderedEdges[n]);
					//fl.trace("created bezier path");
					bezPath.setBrushBounds(brushShape);
					mapShapeToPath(brushShape, bezPath);
				}
				doc.exitEditMode();
			}
			
			fl.objectDrawingMode = objectDrawingMode;
		}
	}
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

fl.outputPanel.clear();
mapSymbolToPath();