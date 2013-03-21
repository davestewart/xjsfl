xjsfl.init(this);
/**
 * Randomize width, height and rotation of selected elements on the stage
 * @icon {iconsURI}objects/weather/weather_breeze.png
 */
(function(){

	if(UI.selection)
	{
		var collection = new ElementCollection($selection);

		function randomize(event)
		{
			collection
				.resetTransform()
				.randomize(event.xul.values)
				.refresh();
		}

		XUL
			.factory('x=20%,y=50%,width=50%,height=50%,rotation=360,button:Apply,title:Randomize elements')
			.addEvent('apply', 'command', randomize)
			.show();
	}

})()
