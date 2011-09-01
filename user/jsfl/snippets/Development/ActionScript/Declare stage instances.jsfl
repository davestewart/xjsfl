/**
 * Generates AS3 class declarations for stage instances
 * 
 * @author      Dave Stewart
 * @icon		{iconsURI}FileSystem/file/file_actionscript.png
 */


// ----------------------------------------------------------------------------------------------------------------------
// utilities

	function tabify(code, tabWidth, tabStop)
	{
		// functions
			function repeat(char, num)
			{
				return new Array(num + 1).join(char);
			}

			function getNextTabStop(colIndex)
			{
				if(colIndex % tabWidth == 0)
				{
					colIndex ++;
				}
				return Math.ceil(colIndex / tabWidth) * tabWidth;
			}
			
			function getNumTabs(colIndex, colTarget)
			{
				return Math.ceil((colTarget - colIndex) / tabWidth);
			}
			
			function getTabs(colIndex, colTarget)
			{
				if(colIndex % tabWidth == 0)
				{
					colIndex --;
				}
				var n = Math.ceil((colTarget - colIndex) / tabWidth);
				return repeat('\t', n + 1)
			}
			
		// properties
			var tabSpaces	= '';
			var tabStop		= tabStop ? tabStop * tabWidth : 0;
			
		// code
			var lines		= code.split(/[\r\n]/);
			
		// variables
			var tabWidth	= tabWidth || 8;
			var char		= ':';


		// code
			// get max tab stop
				var tabAsSpaces = repeat(' ', tabWidth);
				for(var i = 0; i < lines.length; i++)
				{
					var line		= lines[i];
					var colIndex	= line.indexOf(char);
					if(colIndex > tabStop)
					{
						tabStop = colIndex;
					}
				}
				
				
			// go through text and add tabs
				for(var i = 0; i < lines.length; i++)
				{
					var line		= lines[i];
					var colIndex	= line.indexOf(char);
					lines[i]		= line.substr(0, colIndex) + getTabs(colIndex, tabStop) + line.substr(colIndex);
				}

			// echo
				return lines.join('\n');
		
	}
		
		
		
// ----------------------------------------------------------------------------------------------------------------------
// globals

	var trace				= fl.trace;
	var tl					= fl.getDocumentDOM().getTimeline();
	var lib					= fl.getDocumentDOM().library;

// ----------------------------------------------------------------------------------------------------------------------
// locals

	var imports				= {};
	var elements			= {};
	var currentTimelineName = tl.name;


// ----------------------------------------------------------------------------------------------------------------------
// functions

	function addElement(name, type, path)
	{
		if(! imports[path])
		{
			imports[path] = path;
		}
		
		if(! elements[name])
		{
			elements[name] = {name:name, type:type}
		}
	}

	function objectToArray(obj)
	{
		var arr		= [];
		for (var prop in obj)
		{
			arr.push(obj[prop]);
		}
		return arr.reverse();
	}

	function getImports()
	{
		var arrIn	= objectToArray(imports)
		var arrOut	= [];
		
		for (var i = 0; i < arrIn.length; i++) 
		{
			arrOut.push('import ' + arrIn[i] + ';');
		}
		
		return arrOut.sort().join('\n') + '\n';
	}

	function getElements()
	{
		var arrIn	= objectToArray(elements)
		var arrOut	= [];
		
		for (var i = 0; i < arrIn.length; i++) 
		{
			arrOut.push('public var ' + arrIn[i].name + '\t\t:' + arrIn[i].type + ';');
		}
		
		return arrOut.sort().join('\n') + '\n';
	}

	function processElement(element)
	{

		switch( element.elementType ) 
		{
			case "instance": 
				var classname		= element.libraryItem.linkageClassName;  
				var baseclassName	= element.libraryItem.linkageBaseClass;
				
				// If class attached, import it and use the base name, otherwise use the MovieClip class
				if(baseclassName != '')
				{
					classname = baseclassName;
				}
				
				if(classname != null)
				{
					addElement(element.name, classname.split('.').pop(), classname );
				}
				else
				{
					var type = element.libraryItem.itemType;
					
					if(type == 'button')
					{
						addElement(element.name, 'SimpleButton', 'flash.display.SimpleButton');
					}
					else if(type == 'movie clip')
					{
						if(element.libraryItem.timeline.frameCount > 1)
						{
							addElement(element.name, 'MovieClip', 'flash.display.MovieClip');
						}
						else
						{
							addElement(element.name, 'Sprite', 'flash.display.Sprite');
						}
					}
				}
			break;
				
			case "text":
				if(element.textType != 'static')
				{
					addElement(element.name, 'TextField', 'flash.text.TextField');
				}
			break;
				
			case "shape":
				if(element.isGroup)
				{
					// found a group of items, not supported
				}
			break;
		}
		
	}


// ----------------------------------------------------------------------------------------------------------------------
// main code

	function processTimeline(timeline)
	{
		if(timeline == undefined)
		{
			timeline = tl; 
		}
		
		currentTimelineName = tl.name;
		
		// layers
		var varlines = "";
		for(l = 0; l < timeline.layers.length; l++) 
		{	 
			// frames
			for(f = 0; f < timeline.layers[l].frames.length; f++) 
			{		
				// elements
				var elements = timeline.layers[l].frames[f].elements;
				for(var e = 0; e < elements.length; e++)
				{
					processElement( elements[e] );
				}
			}
		}
		
		lib.editItem(currentTimelineName);

		fl.trace(getImports());
		fl.trace('// stage instances')
		fl.trace(tabify(getElements(), 4, 7))
		
	}

	fl.outputPanel.clear();
	processTimeline();