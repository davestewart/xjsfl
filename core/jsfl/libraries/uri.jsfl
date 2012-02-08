// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██████ ██
//  ██  ██ ██  ██ ██
//  ██  ██ ██  ██ ██
//  ██  ██ ██████ ██
//  ██  ██ ██ ██  ██
//  ██  ██ ██  ██ ██
//  ██████ ██  ██ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// URI - path and URI conversion

	// ---------------------------------------------------------------------------------------------------------------
	// class

		var URI =
		{
			/**
			 * Create a valid URI from a supplied string
			 *
			 * - Resolves relative paths (automatically or via context)
			 * - Allows concatenation and resolution of paths
			 * - Resolves paths relative to another file
			 * - Resolves {placeholder} variables
			 * - Tidies badly-formatted URIs
			 *
			 * @param	pathOrURI	{String}	A token, path or URI-formatted string
			 * @param	context		{String}	An optional uri or path context, from which to start the URI
			 * @param	context		{File}		An optional File from which to start the URI
			 * @param	context		{Folder}	An optional Folder from which to start the URI
			 * @param	context		{Number}	An optional stack-function index, the location of which to derive the URI from
			 * @param	parseURI	{Boolean}	An optional Boolean, to bypass immediate returning of file:/// URIs, and parse their content
			 * @returns				{String}	An absolute URI
			 * @see								Notes at the top of this file
			 */
			toURI:function(pathOrURI, context, parseURI)
			{
				// ---------------------------------------------------------------------------------------------------------------
				// process URI

					// ensure pathOrURI is a string
						pathOrURI = String(pathOrURI);

					// process URIs
						if(pathOrURI.indexOf('file:///') === 0)
						{
							// if pathOrURI is already a URI, return immediately
								if( ! parseURI )
								{
									return pathOrURI;
								}

							// convert URI to a path
								pathOrURI = pathOrURI
									.replace('file:///', '')
									.replace('|', ':')
									.replace(/%20/g, ' ');
						}

				// ---------------------------------------------------------------------------------------------------------------
				// process {placeholders}

					// variables
						var uri;
						var root;
						var path		= pathOrURI.replace(/\\+/g, '/');;
						var rxFile		= /[^\/\\]+$/;

					// check path for and convert any leading {placeholder} variables
						if(path.indexOf('{') === 0)
						{
							var matches = path.match(/{(\w+)}/);
							if(matches)
							{
								var folder = xjsfl.settings.folders[matches[1]];
								if(folder)
								{
									uri		= path.replace(matches[0], folder);
								}
							}
							else
							{
								throw new URIError('Error in URI.toURI(): Unrecognised placeholder ' +matches[0]+ ' in path "' +path+ '"');
							}
						}

				// ---------------------------------------------------------------------------------------------------------------
				// process context

					// check to see if supplied context resolves to a URI
						else if( context && (typeof context !== 'number') )
						{
							// grab URI of context if possible
								if(typeof context === 'string')
								{
									if(String(context).indexOf('file:///') === 0)
									{
										root = context;
									}
									else
									{
										root = URI.toURI(context);
									}
								}
								else if(context instanceof File)
								{
									root = context.uri;
								}
								else if(context instanceof Folder)
								{
									root = context.uri + '/';
								}

							// test that a URI was found
								if(root)
								{
									// check that path isn't absolute (or else it can't be resolved)
										if(URI.isAbsolute(path))
										{
											throw new URIError('Error in URI.toURI(): It is not possible to resolve the absolute path "' +path+ '" relative to "' +context+ '"');
										}
										else
										{
											uri = root.replace(rxFile, '') + path;
										}
								}
								else
								{
									throw new URIError('Error in URI.toURI(): It is not possible to resolve the path "' +path+ '" as the context "' +context+ '" as is not a valid URI, File or Folder');
								}
						}

				// ---------------------------------------------------------------------------------------------------------------
				// process relative paths

					// if a URI isn't yet resolved, check path for leading relative tokens and attempt to resolve correct source of file location
						if( ! uri )
						{
							// variables
								var rx			= /^(\.\/|\.\.\/|\/\/|\/|[\w ]+:)/;
								var matches		= path.match(rx);
								context			= context || 1;

							// parse relative-path formats to resolve root
								if(matches)
								{
									switch(matches[1])
									{
										case './':
											//trace('	./  - ' + path);
											root		= null;
										break;
										case '../':
											//trace('	../ - ' + path);
											root		= null;
										break;
										case '/':
											//trace('	/   - ' + path);
											root		= xjsfl.uri;
										break;
										case '//':
											//trace('	//  - ' + path);
											var stack	= xjsfl.utils.getStack();
											var matches	= stack[context].uri.match(/(file:\/\/\/[^\/]+\/)/);
											root		= matches[1];
										break;
										default:
											if(matches[1].indexOf(':') !== -1)
											{
												//trace('	c:  - ' + path);
												if(matches[1].length > 2 || fl.version.indexOf('mac') > -1)
												{
													root = path.replace(':', '/');
												}
												else
												{
													root = path.replace(':', '|');
												}
												path = '';
											}
											else
											{
												//trace('	rel - ' + path);
												root	= null;
											}
									}

									if(root)
									{
										uri = root + path;
									}
								}
						}

					// if still no URI, the root wasn't implied by the path (i.e. folder/file.txt) therefore it must be relative, so derive from the calling file
						if( ! uri )
						{
							var stack	= xjsfl.utils.getStack();
							var source	= stack[context].uri;
							uri			= source.replace(rxFile, '') + path;
						}

				// ---------------------------------------------------------------------------------------------------------------
				// tidy URI

					// remove file:///
						if(uri.indexOf('file:///') === 0)
						{
							uri = uri.substr(8);
						}

					// replace backslashes
						uri = uri.replace(/\\+/g, '/');

					// replace double-slashes
						uri = uri.replace(/\/+/g, '/');

					// replace redundant ./
						uri = uri.replace(/(^|\/)\.\//img, '$1');

					// replace %20 with spaces
						uri = uri.replace(/ /g, '%20');

					// tidy drive letter
						uri	= uri.replace(/^([a-z ]+):/i, '$1|')

					// resolve relative tokens
						while(uri.indexOf('../') > 0)
						{
							// kill folder/../ pairs
								uri = uri.replace(/(^|\/)[^\/]+\/\.\.\//, '/');

							// replace any leading ../ tokens (as you can't go higher than root)
								uri = uri.replace(/^([a-z ]+[:|])\/[.\/]+/img, '$1/');
								//path = path.replace(/^\/\.\.\//img, '');
						}

					// add 'file:///'
						uri = 'file:///' + uri;

				// ---------------------------------------------------------------------------------------------------------------
				// done!

					// return
						return uri;
			},

			/**
			 * Create a valid path from a supplied string
			 *
			 * @param	pathOrURI	{String}	A token, path or URI-formatted string
			 * @param	shorten		{Boolean}	An optional Boolean to return a path with {placeholder} variables for registered URIs
			 * @returns				{String}	An absolute, or shortened path
			 * @see								Notes at the top of this file
			 */
			toPath:function(pathOrURI, shorten)
			{
				// parse all input via toURI()
					var uri = URI.toURI(String(pathOrURI), 2, true);

				// return the {placeholder} version of registered URIs
					if(shorten)
					{
						// convert to URI if not already
							if(uri.indexOf('file:///') !== 0)
							{
								uri = uri
									.replace(/(^[a-z ]+):/i, '$1|')
									.replace(/\\/g, '/')
									.replace(/ /g, '%20')
									.replace(/^/, 'file:///');
							}

						// variables
							var folders = [];

						// get all folders matching the input URI
							for(var folder in xjsfl.settings.folders)
							{
								var folderURI = xjsfl.settings.folders[folder];
								if(uri.indexOf(folderURI) === 0)
								{
									folders.push({name:folder, uri:folderURI});
								}
							}

						// if there are any matches, sort the list and grab the longest match
							if(folders.length)
							{
								xjsfl.utils.sortOn(folders, 'name');
								var folder = folders.shift();
								uri = uri.replace(folder.uri, '{' +folder.name+ '}');
							}
					}

				// convert anything that makes it through to a path
					var path = uri
						.replace('file:///', '')
						.replace(/(^[a-z])\|/i, '$1:')
						.replace(/(^[a-z ]{2,}):\/?/i, '$1/')
						.replace(/\\/g, '/')
						.replace(/%20/g, ' ');

				// return
					return path;
			},

			/**
			 * Tests if a path is absolute or not
			 * @param	{String}	path	A valid path
			 * @returns	{Boolean}			true or false, depending on the result
			 */
			isAbsolute:function(path)
			{
				return /^([\w ]+[:|])/.test(path.replace('file:///', ''));
			}
		}

	// ---------------------------------------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('URI', URI);


	// ---------------------------------------------------------------------------------------------------------------
	// notes on JSFL and xJSFL URI juggling

		/*
			FLASH URI FORMAT

				Both
					URI format must be file:/// (the standard is file://<host>/<filepath>, but Flash ignores the host) @see http://en.wikipedia.org/wiki/File_URI_scheme

				Windows

					All relative URIs fail
					c:/ appears to be valid, as well as c|/
					Spaces appear to be valid, they get converted to %20 inside FLfile

				Mac

					Relative URIs, i.e. file.ext, ./file.ext and ../file.ext are relative to HD root
					Absolute URIs, i.e. /file.ext are relative to HD root
					Leading Hard drive name is valid, i.e. Macintosh HD/file, but NOT /Macintosh HD/file (note the leading slash)

			FLASH CONSTANTS

				Mac
					fl.configDirectory:	/Users/davestewart/Library/Application Support/Adobe/Flash CS4/en/Configuration/
					fl.configURI:		file:///Macintosh%20HD/Users/davestewart/Library/Application%20Support/Adobe/Flash%20CS4/en/Configuration/

				Windows
					fl.configDirectory:	F:\Users\Dave Stewart\AppData\Local\Adobe\Flash CS4\en\Configuration\
					fl.configURI:		file:///F|/Users/Dave%20Stewart/AppData/Local/Adobe/Flash%20CS4/en/Configuration/

			xJSFL STRING FORMAT

				Relative-location syntax

					Relative URIs, i.e. file, ./ or ../ are relative to the calling file
					/ is relative to xJSFL root
					// is relative to the drive of the running script
					C: or Drive: is relative to the drive (platform specific)

				Parsing

					Paths are parsed for

						- Relative-locations as outlined above (./, ../, /, //, c:, drive name:)
						- {placeholder} variables are replaced

					URIs and Paths are parsed for

						- \\ are converted to /
						- ../ are resolved
						- // are converted to /
						- Spaces are converted to %20


		*/
