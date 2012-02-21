/**
 * Finds items in the current document according to criteria you set
 * @icon {iconsURI}Actions/find/find.png
 */
xjsfl.init(this);
/**
 * Find something in your document
 * @icon {iconsURI}Objects/weather/weather_breeze.png
 */
(function(){

	function find(value, property, type, context)
	{
		inspect(Utils.getArguments(arguments));

		switch(context)
		{
			case '':
			break;

			case '':
			break;

			case '':
			break;
		}
	}

	XUL.create('text:Value,text:Property=name,radio:On={Library Item:item,Layer:layer,Frame:frame,Element:element},radio:In={Stage:stage,All Library Items:library,Selected Library Items:items},title:Find something...', find);

})()
