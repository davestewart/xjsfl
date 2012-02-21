/**
 * Generates AS3 class declarations for stage instances
 *
 * @author      Dave Stewart
 */


// ----------------------------------------------------------------------------------------------------------------------
// utilities

	function tabify(code, tabWidth, tabStop)
	{
		// functions
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
				return Utils.repeat('\t', n + 1);
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
				var tabAsSpaces = Utils.repeat(' ', tabWidth);
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
// variables

	var imports		= {};
	var elements	= {};


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

	function getImports()
	{
		var arrIn	= Utils.getValues(imports)
		var arrOut	= [];

		for (var i = 0; i < arrIn.length; i++)
		{
			arrOut.push('import ' + arrIn[i] + ';');
		}

		return Utils.sort(arrOut, false, true).join('\n') + '\n';
	}

	function getElements()
	{
		var arrIn	= Utils.getValues(elements)
		var arrOut	= [];

		for (var i = 0; i < arrIn.length; i++)
		{
			arrOut.push('public var ' + arrIn[i].name + '\t\t:' + arrIn[i].type + ';');
		}

		return arrOut.sort().join('\n') + '\n';
	}

	function processElement(element)
	{
		if(element.name)
		{
			switch( element.elementType )
			{
				case "instance":
					var type			= element.symbolType;
					var classname		= element.libraryItem.linkageClassName;
					var baseclassName	= element.libraryItem.linkageBaseClass;

					if(type !== 'graphic')
					{
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
							if(type === 'button')
							{
								addElement(element.name, 'SimpleButton', 'flash.display.SimpleButton');
							}
							else if(type === 'movie clip')
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
	}


// ----------------------------------------------------------------------------------------------------------------------
// main code

	// init
		xjsfl.init(this);
		clear();

	// process elements
		$('*').each(processElement);

	// trace
		trace(getImports());
		trace('// stage instances')
		trace(tabify(getElements(), 4, 7))

	// select any unnamed items on stage
		var collection = $(':movieclip[name=]');
		if(collection.elements.length)
		{
			collection.select();
			alert('The selected items are unnamed, so were skipped in the output process.');
		}
