

var dom				= fl.getDocumentDOM();
var timeline		= dom.getTimeline();
var layers			= timeline.layers;
var layer			= layers[0];
var elements		= layer.frames[0].elements;

for(var i = 0; i < elements.length; i++)
{
	elements[i].name = (elements[i].libraryItem.name + ' ' + (i + 1)).replace(/[^a-z0-9]/gi, '_');
}

