// --------------------------------------------------------------------------------
// test content and log the error on failure

	(function()
	{
		// grab uri
			var uri = FLfile.read(xjsfl.uri + 'core/jsfl/run/temp/uri.txt');

		// run the file
			if(uri && FLfile.exists(uri))
			{
				// remove any existing error logs
					xjsfl.debug.clear();

				// run the file
					try
					{
						//alert('Running "' +FLfile.uriToPlatformPath(uri).replace(/\\/g, '/')+ '"');
						xjsfl.file.load(uri);
					}

				// top-level catch (errors are logged to disk within xjsfl.debug.file)
					catch(error)
					{
						xjsfl.debug.error(error);
						
						var str			= "\nThe following JSFL error occurred:\n\n";
						str				+= 'At line ' +error.lineNumber+ ' of file "' +error.fileName.split('/').pop()+ '":\n';
						str				+= error.message + '\n';
						fl.trace(str);
					}
			}

		// trace if not found
			else
			{
				fl.trace('The file "' +FLfile.uriToPlatformPath(uri)+ '" was not found');
			}
	}())
