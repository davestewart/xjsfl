/**
 * Lists all defined variables
 * @icon {iconsURI}Feedback/action/action_help.png
 */
(function()
{
	var xul = XUL
		.factory('title:Show variables...,radios:Scope={Window:0,Document:1,Library:2,xJSFL:3},radios:From={Top-level only:1,2 levels down:2,3 levels down:3,4 levels down:4,5 levels down:5,6 levels down:6},checkbox:Clear output panel=true')
		.show();
		
	if(xul.values.from)
	{
		if(xul.values.clearoutputpanel)
		{
			fl.outputPanel.clear();
		}
		Output.inspect([window,dom,dom.library,xJSFL][xul.values.scope], true, xul.values.from);
	}
	
})()
