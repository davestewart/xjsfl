/**
 * Finds items in the current document according to criteria you set
 * @icon {iconsURI}actions/find/find.png
 */
(function(){

	xjsfl.init(this);
	
	require('utils')
	
	function find(value, property, type, context)
	{
		trace('\nSorry! Find tool not yet implemented.');		
		
		inspect(Utils.getParams(find, arguments), 'Parameters');

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
