/**
 * Lists all defined variables
 * @icon {iconsURI}feedback/action/action_help.png
 */
(function()
{
	// init
		xjsfl.init(this);
		
	// force a document open
		if(! $dom)
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
			Selection:	$selection,
			Events:		xjsfl.events
		};

	// setup controls
		var controls =
		[
			'title:Show variables...',
			'radios:Scope=[' +Utils.getKeys(scopes).join(',')+ ']',
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
			inspect(scopes[xul.values.scope], true, xul.values.scope, xul.values.depth);
		}

})()
