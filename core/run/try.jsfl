// --------------------------------------------------------------------------------
// test content and log the error on failure

	(function()
	{
		// grab uri
			var uri = FLfile.read(xjsfl.uri + 'core/temp/uri.txt');

		// run the file
			if(uri && FLfile.exists(uri))
			{
				// remove any existing error logs
					xjsfl.debug.clear();

				// debug file
					try
					{
						xjsfl.debug.file(uri);
					}
					catch(err)
					{
						//xjsfl.trace(err.message);
						//xjsfl.debug.log(err);
					}
			}

		// trace if not found
			else
			{
				fl.trace('The file "' +FLfile.uriToPlatformPath(uri)+ '" was not found');
			}
	}())
