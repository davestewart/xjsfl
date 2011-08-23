/**
 * Lists all defined variables
 * @icon {iconsURI}Feedback/action/action_help.png
 */
(function()
{
	// values
		var context = Context.create();
		var scopes = 
		{
			xJSFL:		xjsfl,
			Window:		window,
			Document:	context.dom,
			Library:	context.dom.library,
			Timeline:	context.timeline,
			Layer:		context.layer,
			Frame:		context.frame,
			Selection:	dom.selection
		};
	
	// setup controls
		var controls = 
		[
			'title:Show variables...',
			'radios:Scope=[' +xjsfl.utils.getKeys(scopes).join(',')+ ']',
			'radios:From={Top-level only:1,2 levels down:2,3 levels down:3,4 levels down:4,5 levels down:5,6 levels down:6}',
			'checkbox:Clear output panel=true'
		]
		.join(',');
		
	// create ui
		var xul = XUL
			.factory(controls)
			.show();
			
	// process input
		if(xul.values.from)
		{
			if(xul.values.clearoutputpanel)
			{
				fl.outputPanel.clear();
			}
			Output.inspect(scopes[xul.values.scope], true, xul.values.from);
		}
	
})()
