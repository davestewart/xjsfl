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

				// top-level catch (errors are logged to disk within xjsfl.debug.file)
					catch(err)
					{
						var str			= "\nThe following JSFL error occurred:\n\n";
						str				+= 'At line ' +err.lineNumber+ ' of file "' +err.fileName.split('/').pop()+ '":\n';
						str				+= err.message + '\n';
						fl.trace(str);
					}
			}

		// trace if not found
			else
			{
				fl.trace('The file "' +FLfile.uriToPlatformPath(uri)+ '" was not found');
			}
	}())
