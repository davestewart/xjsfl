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
			 * - Resolves {placeholder} variables
			 * - Corrects badly-formatted URIs
			 *
			 * @param	pathOrURI	{String}	A path or URI-formatted string
			 * @param	context		{String}	An optional uri or path context, from which to start the URI
			 * @param	context		{File}		An optional File from which to start the URI
			 * @param	context		{Folder}	An optional Folder from which to start the URI
			 * @param	context		{Number}	An optional stack-function index, the location of which to derive the URI from
			 * @returns				{String}	An absolute URI
			 * @see								Notes at the top of this file
			 */
			toURI:function(pathOrURI, context)
			{
				// ensure pathOrURI is a string
					pathOrURI = String(pathOrURI);

				// if pathOrURI is already a URI, no need to convert so return immediately
					if(pathOrURI.indexOf('file:///') === 0)
					{
						return pathOrURI;
					}

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
								return URI.correct(path.replace(matches[0], folder));
							}
						}
						throw new URIError('Error in URI.toURI(): Unrecognised placeholder ' +matches[0]+ ' in path "' +path+ '"');
					}

				// check to see if supplied context resolves to a URI
					if( context && (typeof context !== 'number') )
					{
						// variables
							var uri;

						// grab URI of context if possible
							if(typeof context === 'string')
							{
								if(String(context).indexOf('file:///') === 0)
								{
									uri = context;
								}
								else
								{
									uri = URI.toURI(context);
								}
							}
							else if(context instanceof File)
							{
								uri = context.uri;
							}
							else if(context instanceof Folder)
							{
								uri = context.uri + '/';
							}

						// test that a URI was found
							if(uri)
							{
								// check that path isn't absolute (or else it can't be resolved)
									if(/^([\w ]+:|\/)/.test(path))
									{
										throw new URIError('Error in URI.toURI(): It is not possible to resolve the absolute path "' +path+ '" relative to "' +context+ '"');
									}
									else
									{
										root = uri.replace(rxFile, '');
									}
							}
							else
							{
								throw new URIError('Error in URI.toURI(): It is not possible to resolve the path "' +path+ '" as the context "' +context+ '" as is not a valid URI, File or Folder');
							}
					}

				// if a root (context) wasn't resolved, check path for leading relative tokens and attempt to resolve correct source of file location
					if( ! root )
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
												path = path.replace(':', '/');
											}
											else
											{
												path = path.replace(':', '|');
											}
											return 'file:///' + URI.correct(path);
										}
										else
										{
											//trace('	rel - ' + path);
											root	= null;
										}
								}
							}
					}

				// if the root wasn't implied by the path (i.e. folder/file.txt), it must be relative, so derive from the calling file
					if( ! root )
					{
						var stack	= xjsfl.utils.getStack();
						var source	= stack[context].uri;
						uri			= source.replace(rxFile, '') + path;
					}

					else
					{
						uri			= root.replace('file:///', '') + path;
						return 'file:///' + URI.correct(uri);
					}

				// return
					return URI.correct(uri);
			},

			/**
			 * Create a valid path from a supplied string
			 *
			 * @param	pathOrURI	{String}	A path or URI-formatted string
			 * @param	shorten		{Boolean}	An optional boolean to return a path with {xjsfl} or {config} swapped out from the actual path
			 * @returns				{String}	An absolute, or shortened path
			 * @see								Notes at the top of this file
			 */
			toPath:function(pathOrURI, shorten)
			{
				// variables
					pathOrURI	= String(pathOrURI);
					var uri		= pathOrURI;

				// convert placeholders
					if(uri.indexOf('{') === 0)
					{
						uri = URI.toURI(uri);
					}

				// convert relative paths
					else if(/^([^:]+$|[^:]+\/|\.\/|\.\.\/|\/\/|\/)/.test(pathOrURI))
					{
						uri = URI.toURI(uri, 2);
					}

				// return the short version of registered URIs
					if(shorten && pathOrURI.indexOf('file:///') === 0)
					{
						// variables
							var folders = [];

						// get all folders matching the input URI
							for(var folder in xjsfl.settings.folders)
							{
								var uri = xjsfl.settings.folders[folder];
								if(pathOrURI.indexOf(uri) === 0)
								{
									folders.push({name:folder, uri:uri});
								}
							}

						// if there are any matches, sort the list and grab the longest match
							if(folders.length)
							{
								xjsfl.utils.sortOn(folders, 'name');
								var folder = folders.shift();
								uri = pathOrURI.replace(folder.uri, '{' +folder.name+ '}/');
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
			 * Resolves a relative path from the absolute location of another
			 *
			 * @param	{String}	path		A relative file path, such as 'path/to/file.txt'
			 * @param	{String}	context		An abxolute URI such as 'file:///path/to/file.txt'
			 * @returns	{String}				An absolute URI
			 */
			resolve:function(path, context)
			{
				return URI.correct(context.replace(/[^\/\\]+$/, '') + path);
			},

			/**
			 * Corrects badly-formatted URIs and paths
			 *
			 * - \\ are converted to /
			 * - ../ are resolved
			 * - // are converted to /
			 * - Spaces are converted to %20
			 *
			 * @param	{String}	pathOrURI	A path or URI-formatted string
			 * @returns	{String}				The corrected path or URI-formatted string
			 */
			correct:function(path)
			{
				// remove file:///
					var protocol = '';
					if(path.indexOf('file:///') === 0)
					{
						path = path.substr(8);
						protocol = 'file:///';
					}

				// replace backslashes
					path = path.replace(/\\+/g, '/');

				// replace double-slashes
					path = path.replace(/\/+/g, '/');

				// resolve folder/../ pairs
					while(path.indexOf('../') > -1)
					{
						// kill folder pair
							path = path.replace(/(^|\/)[^\/]+\/\.\.\//, "/");

						// replace any leading ../ tokens (as you can't go higher than root)
							path = path.replace(/^([a-z ]+[:|])\/[.\/]+/img, "$1/");
					}

				// replace redundant ./
					path = path.replace(/\.\//g, '');

				// replace %20 with spaces
					path = path.replace(/ /g, '%20');
					//path = path.replace(/%20/g, ' ');

				// return
					return protocol + path;
			},

			isAbsolute:function(pathOrURI)
			{
				var path = URI.toPath(pathOrURI);
				return /^[a-z]:/i.test(path);
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
