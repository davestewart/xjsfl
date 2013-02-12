// --------------------------------------------------------------------------------
// load XUL panel inside Flash

	(function()
	{
		// grab uri
			var uri = FLfile.read(xjsfl.uri + 'core/jsfl/run/temp/uri.txt');

		// run the panel
			if(uri)
			{
				var results = fl.xmlPanel(uri);
				if(results.dismiss == 'accept')
				{
					xjsfl.classes.cache.Output.inspect(results);
				}
			}
			else
			{
				xjsfl.output.trace('The file "' +FLfile.uriToPlatformPath(uri)+ '" was not found');
			}
	}())
