/**
 * Lists all defined variables
 * @icon {iconsURI}Feedback/action/action_help.png
 */
(function()
{
	// force a document open if none is
		if( ! dom )
		{
			fl.createDocument();
		}
	
	// values
		var context = Context.create();
		var scopes = 
		{
			xJSFL:		xjsfl,
			Flash:		fl,
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
			'radios:Depth={Top-level only:1,2 levels down:2,3 levels down:3,4 levels down:4,5 levels down:5,6 levels down:6}',
			'checkbox:Clear output panel=true'
		]
		.join(',');
		
	// create ui
		var xul = XUL
			.factory(controls)
			.show();
			
	// process input
		if(xul.values.depth)
		{
			if(xul.values.clearoutputpanel)
			{
				fl.outputPanel.clear();
			}
			Output.inspect(scopes[xul.values.scope], true, xul.values.depth);
		}

})()
