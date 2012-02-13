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
// URI - Handles URI and path conversion, including detection and resolution of relative paths

	// ---------------------------------------------------------------------------------------------------------------
	// class

		var URI =
		{

			// ---------------------------------------------------------------------------------------------------------------
			// creation functions

				/**
				 * Create a valid URI from virtually any URI or path
				 *
				 * - Resolves relative paths (automatically or via context)
				 * - Allows concatenation and resolution of paths
				 * - Resolves source path relative to a target path
				 * - Expands registered {placeholder} variables
				 * - Tidies badly-formatted URIs
				 *
				 * @param	{String}	pathOrURI	A token, path or URI-formatted string
				 * @param	{String}	context		An optional uri or path context, from which to start the URI
				 * @param	{File}		context		An optional File from which to start the URI
				 * @param	{Folder}	context		An optional Folder from which to start the URI
				 * @param	{Number}	context		An optional stack-function index, the location of which to derive the URI from
				 * @param	{Boolean}	parseURI	An optional Boolean, to bypass immediate returning of file:/// URIs, and parse their content
				 * @param	{Boolean}	checkLength	An optional Boolean, to test resulting URIs are not longer than the 260 characters allowed for most FLfile operations. Defaults to true
				 * @returns	{String}				An absolute URI
				 */
				toURI:function(pathOrURI, context, parseURI, checkLength)
				{
					// ---------------------------------------------------------------------------------------------------------------
					// process URI

						// ensure pathOrURI is a string
							pathOrURI = String(pathOrURI || '');

						// process URIs
							if(pathOrURI.indexOf('file:///') === 0)
							{
								// if pathOrURI is already a URI, return immediately
									if( ! parseURI )
									{
										if(checkLength !== false)
										{
											URI.checkURILength(pathOrURI);
										}
										return pathOrURI;
									}

								// convert URI to a path
									pathOrURI = URI.asPath(pathOrURI);
							}

					// ---------------------------------------------------------------------------------------------------------------
					// variables

						// variables
							var uri;
							var root;
							var path = pathOrURI.replace(/\\+/g, '/');

					// ---------------------------------------------------------------------------------------------------------------
					// process context

						// check to see if supplied context resolves to a URI
							if( context && (typeof context !== 'number') )
							{
								// grab URI of context if possible
									if(typeof context === 'string')
									{
										if(URI.isURI(context))
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
												uri = URI.getPath(root) + path;
											}
									}
									else
									{
										throw new URIError('Error in URI.toURI(): It is not possible to resolve the path "' +path+ '" as the context "' +context+ '" as is not a valid URI, File or Folder');
									}
							}

					// ---------------------------------------------------------------------------------------------------------------
					// process {placeholders}

						// check path for and convert any leading {placeholder} variables
							else if(path.indexOf('{') === 0)
							{
								var matches = path.match(/{(\w+)}/);
								if(matches)
								{
									var folder = xjsfl.settings.folders[matches[1]];
									if(folder)
									{
										uri = path.replace(matches[0], folder);
									}
								}
								else
								{
									throw new URIError('Error in URI.toURI(): Unrecognised placeholder ' +matches[0]+ ' in path "' +path+ '"');
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
									var stackIndex	= context ? context + 1 : 1;

								// parse relative-path formats to resolve root
									if(matches)
									{
										switch(matches[1])
										{
											// current folder
												case './':
													root		= null;
													//path		= path.substr(2);
												break;

											// parent folder
												case '../':
													root		= null;
												break;

											// "framework root" folder
												case '//':
													root		= xjsfl.uri;
													//path		= path.substr(2);
												break;

											// "current root" folder
												case '/':

													// update path
														path		= path.substr(1);

													// grab calling URI
														var stack	= xjsfl.utils.getStack();
														var source	= stack[stackIndex].uri;
														var root	= URI.getPath(source);

													// grab root folder by comparing against registered URIs
														var folders	= xjsfl.settings.folders.all;
														for each(var folder in folders)
														{
															if(source.indexOf(folder) === 0)
															{
																root = folder;
																break;
															}
														}

												break;

											// drive or same folder
												default:

													// drive
														if(matches[1].indexOf(':') !== -1)
														{
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

													// same folder (i.e. no match)
														else
														{
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
								var source	= stack[stackIndex].uri;
								uri			= URI.getPath(source) + path;
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

						// check that URI is on or below the legal limit of 260 chars
							if(checkLength !== false)
							{
								URI.checkURILength(uri);
							}

					// ---------------------------------------------------------------------------------------------------------------
					// done!

						// return
							return uri;
				},

				/**
				 * Create a valid path from virtually any URI or path
				 *
				 * Has the same functionality of URI.toURI()
				 * @see #URI.toURI()
				 *
				 * @param	{String}	pathOrURI	A token, path or URI-formatted string
				 * @param	{Boolean}	shorten		An optional Boolean to return a path with {placeholder} variables for registered URIs
				 * @returns	{String}				An absolute, or shortened path
				 */
				toPath:function(pathOrURI, shorten)
				{
					// parse all input via toURI()
						var uri = URI.toURI(String(pathOrURI), 2, true, false);

					// convert and return result
						return URI.asPath(uri, shorten);
				},


			// ---------------------------------------------------------------------------------------------------------------
			// conversion functions

				/**
				 * Perform simple path to URI conversion
				 * @param	{String}	path		Any valid path
				 * @param	{Boolean}	checkLength	An optional Boolean, to test resulting URIs are not longer than the 260 characters allowed for most FLfile operations. Defaults to true
				 * @returns	{String}				A URI-formatted string
				 */
				asURI:function(pathOrURI, checkLength)
				{
					// variable
						var uri;

					// convert
						if(URI.isURI(pathOrURI))
						{
							uri = pathOrURI;
						}
						else
						{
							uri = pathOrURI
								// replace backslashes
									.replace(/\\+/g, '/')

								// replace double-slashes
									.replace(/\/+/g, '/')

								// replace redundant ./
									.replace(/(^|\/)\.\//img, '$1')

								// replace spaces with %20
									.replace(/ /g, '%20')

								// tidy drive letter or name
									.replace(/^([a-z ]+):/i, '$1|')

								// add 'file:///'
									uri = 'file:///' + uri;
						}

					// check that URI is on or below the legal limit of 260 chars
						if( (checkLength !== false) && uri.length > 260 )
						{
							URI.throwURILengthError(uri);
						}

					// return
						return uri;
				},

				/**
				 * Perform simple URI to path conversion
				 * @param	{String}	uri			Any valid URI
				 * @param	{Boolean}	shorten		An optional Boolean to return a path with {placeholder} variables for registered URIs
				 * @returns	{String}				A path-formatted string
				 */
				asPath:function(pathOrURI, shorten)
				{
					// return existing paths early
						if(URI.isPath(pathOrURI) && shorten != true)
						{
							return pathOrURI.replace(/\\/g, '/');
						}

					// return the {placeholder} version of registered URIs
						if(shorten && URI.isURI(pathOrURI))
						{
							// variables
								var folders = [];
								var uri		= pathOrURI;

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

							// re-set uri variable
								pathOrURI = uri;
						}

					// convert to path format
						var path = pathOrURI
							// remove file:///
								.replace('file:///', '')

							// replace N| with N:
								.replace(/(^[a-z])\|/i, '$1:')

							// replace Drive Name: with Drive Name/
								.replace(/(^[a-z ]{2,}):\/?/i, '$1/')

							// replace \ with /
								.replace(/\\/g, '/')

							// replace %20 with spaces
								.replace(/%20/g, ' ');

					// return
						return path;
				},


			// ---------------------------------------------------------------------------------------------------------------
			// testing functions

				/**
				 * Test if the supplied value is a URI-formatted string
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @returns	{Boolean}				true or false, depending on the result
				 */
				isURI:function(pathOrURI)
				{
					return typeof pathOrURI === 'string' && pathOrURI.indexOf('file:///') === 0;
				},

				/**
				 * Test if the supplied value is a path-formatted string
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @returns	{Boolean}				true or false, depending on the result
				 */
				isPath:function(pathOrURI)
				{
					return typeof pathOrURI === 'string' && pathOrURI.indexOf('file:///') === -1;
				},

				/**
				 * Tests if a path or URI is absolute or not (includes tokens and special xJSFL syntax)
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @returns	{Boolean}				true or false, depending on the result
				 */
				isAbsolute:function(pathOrURI)
				{
					return /^([\w ]+[:|]|\/|{\w+})/.test(String(pathOrURI).replace(/^file:\/\/\//, ''));
				},

				/**
				 * Tests if a path or URI looks like a filename, rather than a folder
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @returns	{Boolean}				true or false, depending on the result
				 */
				isFile:function(pathOrURI)
				{
					return ! /[\/\\]$/.test(String(pathOrURI));
				},

				/**
				 * Tests if a path or URI looks like a folder, rather than a filename
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @returns	{Boolean}				true or false, depending on the result
				 */
				isFolder:function(pathOrURI)
				{
					return pathOrURI == '' || /[\/\\]$/.test(String(pathOrURI));
				},


			// ---------------------------------------------------------------------------------------------------------------
			// extraction functions

				/**
				 * Returns the current folder path of the item referenced by the  of the path or URI
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @returns	{String}				The folder of the path or URI
				 */
				getPath:function(pathOrURI)
				{
					return String(pathOrURI).replace(/([^\/\\]+)$/, '');
				},

				getName:function(pathOrURI)
				{
					return (String(pathOrURI).split(/[\/\\]/).pop());
				},

				/**
				 * Returns the parent folder of the item referenced by the path or URI (for folders, this is the parent folder)
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @returns	{String}				The folder of the path or URI
				 */
				getParent:function(pathOrURI)
				{
					// ensure pathOrURI is a string
						pathOrURI	= String(pathOrURI);

					// remove file:/// and drive name or letter
						var matches	= pathOrURI.match(/(.+[:|]\/?)/);
						var drive	= matches ? matches[1] : '';
						var path	= pathOrURI.substr(drive.length);

					// remove final segment
						var rx		= /[^\/\\]+[\/\\]?$/;
						return drive + path.replace(rx, '');
				},

			// ---------------------------------------------------------------------------------------------------------------
			// utility functions

				checkURILength:function(uri)
				{
					if(uri.length > 260)
					{
						URI.throwURILengthError(uri);
					}
				},

				throwURILengthError:function(uri)
				{
					throw new URIError('The URI for path "' +URI.asPath(uri)+ '" is more than 260 characters.');
				},

				toString:function()
				{
					return '[class URI]';
				}

		}

	// ---------------------------------------------------------------------------------------------------------------
	// register

		if(xjsfl && xjsfl.classes)
		{
			xjsfl.classes.register('URI', URI);
		}


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
					/ is relative to the "current root" i.e. user, or the current module
					// is relative to the "framework root" i.e. the xJSFL root
					C: or Drive: is relative to the drive (platform specific)

				Parsing

					Paths are parsed for

						- Relative-locations as outlined above (./, ../, /, //, c:, drive name:)
						- {placeholder} variables, which are replaced

					URIs and Paths are parsed for

						- drive names are converted to and from drive| and drive:
						- \ are converted to /
						- ../ are resolved
						- //+ are converted to /
						- Spaces are converted to %20


		*/
