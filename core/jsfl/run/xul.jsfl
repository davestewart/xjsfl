// --------------------------------------------------------------------------------
// load XUL panel inside Flash

	// check for DOM
		var dom = fl.getDocumentDOM();
		
	// if a document is open...
		if( ! dom)
		{
			dom = fl.createDocument();
		}
		
	// grab uri 
		fl.runScript(fl.scriptURI.replace('/xul.jsfl', '/exec.jsfl'));
		
	// run the panel
		if(uri)
		{
			var results = dom.xmlPanel(uri);
			if(results.dismiss == 'accept')
			{
				xjsfl.classes.Output.inspect(results);
			}
		}
		else
		{
			xjsfl.trace('Error reading XUL');
		}
