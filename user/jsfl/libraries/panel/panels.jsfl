var trace		= fl.trace
var dom			= fl.getDocumentDOM()
dom.selectAll();
var elements	= dom.selection;
/*

trace(elements)

for (var i=0; i < elements.length; i++)
{
	var element = elements[i];
	element.x = Math.random() * 800;
	element.y = Math.random() * 800;
	
}
elements.forEach(function(e){e.x = Math.random() * 800;})


 //fl.getDocumentDOM().align('right', 'top');
*/
 
 
 /*
xjsfl.init(this);
Output.inspect(xjsfl);
 */
 
 //fl.trace(decodeURI(fl.scriptURI))
 
for(var i = 0 ; i < fl.swfPanels.length; i++)
{
	fl.trace(fl.swfPanels[i].name);
}