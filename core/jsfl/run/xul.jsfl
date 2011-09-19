// --------------------------------------------------------------------------------
// load XUL panel inside Flash

	(function()
	{
		// check for DOM
			var dom = fl.getDocumentDOM();

		// if no document is open...
			if( ! dom)
			{
				dom = fl.createDocument();
			}

		// grab uri
			var uri = FLfile.read(fl.scriptURI.replace('/xul.jsfl', '/uri.txt'));

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
	}())
