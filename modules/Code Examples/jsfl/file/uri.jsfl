// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * filename examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();

	// --------------------------------------------------------------------------------
	// testing function

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

	// --------------------------------------------------------------------------------
	// variables

		// paths
			var paths =
			[
				// nothing
					null,
					undefined,
					this,
					'',

				// relative paths
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
					'C:',

				// misc
					/*
					{},
					[1, 2, 3],
					new Date()
					*/

			];
			
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// URI instances

		/**
		 * Test URI instances
		 * @snippet Yes
		 */
		function uriTestInstances()
		{
			for each(var path in paths)
			{
				try
				{
					var uri		= new URI(path);
					Table.print(uri, path, 'uri,folder,path,name,type');
				}
				catch(err)
				{
					format('{err} on line {line} in file "{file}"', err, err.lineNumber, err.fileName);
				}
			}
		}


	// --------------------------------------------------------------------------------
	// Test URI static methods


		// --------------------------------------------------------------------------------
		// xJSFL conversion to URIs

			/**
			 * convert to URIs
			 */
			function uriConvertToURI()
			{
				trace('\n\nTEST URI STATIC METHODS\n')
				test('convert to URIs', paths, URI.toURI);
			}

			/**
			 * convert to URIs with URI context
			 */
			function uriContextConvertToURI()
			{
				test('convert to URIs with URI context', paths, URI.toURI, 'file:///C:/SOME PATH/TO/');
			}

		// --------------------------------------------------------------------------------
		// xJSFL conversion to paths

			/**
			 * convert to paths
			 */
			function uriConvertToPath()
			{
				test('convert to paths', paths, URI.toPath);
			}

			/**
			 * convert to short paths
			 */
			function uriConvertToShortPath()
			{
				test('convert to short paths', paths, URI.toPath, true);
			}

		// --------------------------------------------------------------------------------
		// Simple conversion

			/**
			 * treat as URIs
			 */
			function uriTreatAsURI()
			{
				test('treat as URIs', paths, URI.asURI);
			}

			/**
			 * treat as paths
			 */
			function uriTreatAsPath()
			{
				test('treat as paths', paths, URI.asPath);
			}

		// --------------------------------------------------------------------------------
		// Testing

			/**
			 * test if absolute
			 */
			function uriIsAbsolute()
			{
				test('test if absolute', paths, URI.isAbsolute);
			}

			/**
			 * test if URI
			 */
			function uriIsURI()
			{
				test('test if URI', paths, URI.isURI);
			}

			/**
			 * test if path
			 */
			function uriIsPath()
			{
				test('test if path', paths, URI.isPath);
			}

			/**
			 * test if root
			 */
			function uriIsRoot()
			{
				test('test if root', paths, URI.isRoot);
			}

		// --------------------------------------------------------------------------------
		// Path, containing folder, or name

			/**
			 * get item name
			 */
			function uriGetName()
			{
				test('get name', paths, URI.getName);
			}

			/**
			 * get item folder
			 */
			function uriGetPath()
			{
				test('get path', paths, URI.getFolder);
			}

			/**
			 * get item parent
			 */
			function uriGetParent()
			{
				test('get folder', paths, URI.getParent);
			}

	// --------------------------------------------------------------------------------
	// relative URI resolution

		// variables

			var relativeSrc	= 'file:///c|/folder a/folder b/folder c/folder d/folder e/file.txt';
			var relativePaths =
			{
				shorter		:'file:///c|/folder a/folder b/folder c/file.txt',
				same		:'file:///c|/folder a/folder b/folder c/folder d/folder e/another file.txt',
				longer		:'file:///c|/folder a/folder b/folder c/folder d/folder e/folder f/folder g/folder h/folder i/file.txt',

				branched1	:'file:///c|/folder a/folder b/folder c/folder d/other file.txt',
				branched2	:'file:///c|/folder a/folder b/folder c/folder d/FOLDER E/other file.txt',
				branched3	:'file:///c|/folder a/folder b/folder c/FOLDER D/other file.txt',
				branched4	:'file:///c|/folder a/folder b/folder c/FOLDER D/FOLDER E/other file.txt',
				branched5	:'file:///c|/other file.txt',
				different	:'file:///E|/other folder/other file.txt',
			}
		
		// function
		
			/**
			 * get relative paths from source to target
			 */
			function uriTestRelativePathsTo()
			{
				trace('\n\nTEST RELATIVE URIS with URI.pathTo\n')
				try
				{
					for(var name in relativePaths)
					{
						var target = URI.pathTo(relativeSrc, relativePaths[name], name);
						inspect({srcURI:relativeSrc, trgURI:relativePaths[name], target:target}, name.toUpperCase())
	
					}
				}
				catch(err)
				{
					debug(err)
				}
			}
