// --------------------------------------------------------------------------------
// run script on selected library items

	(function()
	{
		// check for DOM
			xjsfl.init(this);

		// if a document is open...
			if($dom)
			{
				// grab uri
					var uri		= FLfile.read(xjsfl.uri + 'core/jsfl/run/temp/uri.txt');
					var path	= FLfile.uriToPlatformPath(uri);

				// exit early if the file doesn't exist
					if( ! FLfile.exists(uri))
					{
						xjsfl.output.trace('The file "' +path+ '" does not exist');
						return false;
					}

				// variables
					var jsfl	= FLfile.read(uri);

				// loop
					if(jsfl)
					{
						// variables
							var lib		= $library;
							var sel		= lib.getSelectedItems();

						// no need to init twice
							jsfl		= jsfl.replace('xjsfl.init(this)', '');

						// debug
							xjsfl.output.trace('Running file "' +path+ '" on ' +sel.length+ ' library item(s)...');

						// loop
							for(var i = 0; i < sel.length; i++)
							{
								// open librray item
									xjsfl.output.trace("Updating item '" + sel[i].name + "'")
									lib.editItem(sel[i].name);

								// execute script
									eval(jsfl);
							}
					}
					else
					{
						xjsfl.output.trace('The JSFL command was empty');
					}
			}

	})()
