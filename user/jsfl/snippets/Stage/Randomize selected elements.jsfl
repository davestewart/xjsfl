/**
 * Randomize width, height and rotation of selected elements on the stage
 * @icon {iconsURI}Objects/weather/weather_breeze.png
 */
if(xjsfl.get.selection())
{
	var collection = new ElementCollection(dom.selection);
	
	function randomize(event)
	{
		collection
			.resetTransform()
			.randomize(event.xul.values)
			.refresh();
	}
	
	XUL
		.factory('x,y,width,height,rotation,button:Apply,title:Randomize elements')
		.addEvent('apply', 'command', randomize)
		.show();
}