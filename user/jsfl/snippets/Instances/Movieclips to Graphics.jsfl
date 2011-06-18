/**
 * Recursively converts all movieclips to graphics on all timelines
 */
var lib				= dom.library

function setAsGraphic(item)
{
	if(item.symbolType == 'movie clip')
	{
		item.symbolType = 'graphic';
	}
}

function processRecursive(element, func)
{
	// variables
		var i, f, e
		var item, name, layers, elements
		
	// edit item
		item	= element.libraryItem
		if(item == null)
		{
			return;
		}

	// edit item
		fl.trace('Processing: ' + item.name);
		lib.editItem(item.name);
	
	// process all layers
		layers	= dom.getTimeline().layers;
		for (i = 0; i < layers.length; i++)
		{
		// process all frames
			for (f = 0; f < layers[i].frames.length; f++)
			{
			// process all elements
				elements = layers[i].frames[f].elements;
				for (e = 0; e < elements.length; e++)
				{
				// apply function to element
					func(elements[e])
					
				// process children
					processRecursive(elements[e], func);
				}
			}
		}
}

function init()
{
	var sel		= dom.selection;
	var func	= setAsGraphic;
	for(var i = 0; i < sel.length; i++)
	{
		processRecursive(sel[i], func)
	}
	alert('Finished processing!')
}

init();