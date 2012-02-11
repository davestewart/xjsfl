// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.reload(this);
		clear();
		try
		{

	// --------------------------------------------------------------------------------
	// function + filenames and URIs

		// logger

		// test function

			function test(caption, paths, func, arg1, arg2)
			{
				var rows = [];
				for each(var path in paths)
				{
					// attempt to get the conversion
						try
						{
							var value = func(path, arg1, arg2);
						}
						catch(err)
						{
							var value = err.message;
						}

					// create and add row
						rows.push( {Original:path === '' ? '<blank>' : path, Conversion:value} );
				}

				Table.print(rows, caption, null, 200);
			}

		// variables

			var paths =
			[
				// relative paths
					'',
					'./',
					'../',
					'folder',
					'folder/',
					'file.txt',
					'./file.txt',
					'../file.txt',
					'../../file.txt',
					'./.././../file.txt',
					'../../../../../file.txt',
					'some path/to/file.txt',
					'some path\\to\\file.txt',

				// relative mixed paths
					'a/b/c/d/.././../file.txt',
					'./a/b/c/d/../../file.txt',

				// roots
					'/file.txt',
					'//file.txt',

				// folders
					'C:/path/to/',
					'C:\\path\\to\\',

				// drives
					'C:/path/to/file.txt',
					'C:\\path\\to\\file.txt',
					'Macintosh HD:long path/to/file.txt',
					'Macintosh HD:/long path/to/file.txt',

				// URIs
					'file:///C|/path/to/file.txt',
					'file:///C:/path/to/file.txt',
					'file:///path to/file.txt',
					'file:///file.txt',

				// registered paths
					/*
					'F:/Users/Dave Stewart/AppData/Local/Adobe/Flash CS4/en/Configuration/WindowSWF/',
					FLfile.uriToPlatformPath(xjsfl.uri) + 'modules\\Some Module\\manifest.xml',

				// registered URIs
					xjsfl.uri,
					fl.configURI + 'WindowSWF/',
					fl.scriptURI,
					fl.configDirectory,
					*/

				// placeholders
					'{user}path/to/file.txt',
					'{user}/path/to/file.txt',
					'{flash}path/to/file.txt',
					'{flash}/path/to/file.txt',
					'{flash}../path/to/file.txt',

				// root paths
					'/',
					'//',
					'C:/',
					'C:'

			];

	// --------------------------------------------------------------------------------
	// Test filenames and URIs

		// --------------------------------------------------------------------------------
		// xJSFL conversion to URIs

			// convert to URIs
				if(1)
				{
					test('convert to URIs', paths, URI.toURI);
				}

			// convert to URIs and force parsing of URIs
				if(1)
				{
					test('convert to URIs and force parsing of URIs', paths, URI.toURI, 1, true);
				}

			// convert to URIs with URI context
				if(1)
				{
					test('convert to URIs with URI context', paths, URI.toURI, 'file:///C:/SOME PATH/TO/');
					test('convert to URIs with URI context and force parsing of URIs', paths, URI.toURI, 'file:///C:/SOME PATH/TO/', true);
				}

		// --------------------------------------------------------------------------------
		// xJSFL conversion to paths

			// convert to paths
				if(1)
				{
					test('convert to paths', paths, URI.toPath);
				}

			// convert to short paths
				if(1)
				{
					test('convert to short paths', paths, URI.toPath, true);
				}

		// --------------------------------------------------------------------------------
		// Simple conversion

			// treat as URIs
				if(1)
				{
					test('treat as URIs', paths, URI.asURI);
				}

			// treat as paths
				if(1)
				{
					test('treat as paths', paths, URI.asPath);
				}

		// --------------------------------------------------------------------------------
		// Testing

			// test if absolute
				if(1)
				{
					test('test if absolute', paths, URI.isAbsolute);
				}

			// test if URI
				if(1)
				{
					test('test if URI', paths, URI.isURI);
				}

			// test if path
				if(1)
				{
					test('test if path', paths, URI.isPath);
				}

		// --------------------------------------------------------------------------------
		// Path, containing folder, or name

			// get item path
				if(1)
				{
					test('get path', paths, URI.getPath);
				}

			// get item name
				if(1)
				{
					test('get name', paths, URI.getName);
				}

			// get item parent
				if(1)
				{
					test('get folder', paths, URI.getParent);
				}

	// catch
		}catch(err){xjsfl.debug.error(err);}
