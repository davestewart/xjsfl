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
			var uri = FLfile.read(xjsfl.uri + 'core/jsfl/run/temp/uri.txt');

		// run the panel
			if(uri)
			{
				var results = dom.xmlPanel(uri);
				if(results.dismiss == 'accept')
				{
					xjsfl.classes.cache.Output.inspect(results);
				}
			}
			else
			{
				xjsfl.trace('The file "' +FLfile.uriToPlatformPath(uri)+ '" was not found');
			}
	}())
