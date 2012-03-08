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

	// ---------------------------------------------------------------------------------------------------------------
	// /* URI Instance - Instantiatable class that can be used to easily create and manipulate URI strings */

		/**
		 * URI Constructor
		 * @param	{String}	pathOrURI		A token, path or URI-formatted string
		 * @param	{String}	context			An optional uri or path context, from which to start the URI
		 * @param	{File}		context			An optional File from which to start the URI
		 * @param	{Folder}	context			An optional Folder from which to start the URI
		 * @param	{Number}	context			An optional stack-function index, the location of which to derive the URI from
		 */
		function URI(pathOrURI, context)
		{
			this.uri = URI.toURI(pathOrURI, context || 1);
		}

		URI.prototype =
		{
			constructor:URI,

			/** @type {String}	The file:/// URI of the URI instance (casting the URI object to a String gives the same result) */
			uri:'',

			/** @type {String}	The folder path URI to the URI instance */
			get folder()
			{
				return URI.getFolder(this.uri);
			},

			/** @type {String}	The name of the file or folder referred to by the URI instance */
			get name()
			{
				return URI.getName(this.uri);
			},

			/** @type {String}	The platform-specific path of the file or folder referred to by the URI instance */
			get path()
			{
				return URI.asPath(this.uri);
			},

			/** @type {String}	The type of the URI, 'file' or 'folder' */
			get type()
			{
				return URI.isFile(this.uri) ? 'file' : 'folder';
			},

			/** @type {URI}		The parent folder of the file or folder referred to by the URI instance */
			getParent:function()
			{
				return new URI(URI.getParent(this.uri));
			},

			/**
			 * Returns a new URI that resolves to the target path or URI
			 * @param	{String}	pathOrURI	The target URI, such as '../../'
			 * @returns	{URI}					The new URI
			 */
			pathTo:function(pathOrURI)
			{
				return URI.pathTo(this.uri, pathOrURI);
			},

			/**
			 * The URI string of the URI instance
			 * @returns	{String}				The string of the URI, i.e. file://path/to/file.txt
			 */
			toString:function()
			{
				return this.uri;
			}
		}

	// ---------------------------------------------------------------------------------------------------------------
	// /* Static methods - a host of static utility functions that can be used to manipulate paths or URIs */

		// ---------------------------------------------------------------------------------------------------------------
		// /* Creation functions */

			/**
			 * Create a valid URI from virtually any URI or path
			 *
			 * - Resolves relative paths (automatically or via context)
			 * - Allows concatenation and resolution of paths
			 * - Resolves source path relative to a target path
			 * - Expands registered {placeholder} variables
			 * - Tidies badly-formatted URIs
			 *
			 * @param	{String}	pathOrURI		A token, path or URI-formatted string
			 * @param	{String}	context			An optional uri or path context, from which to start the URI
			 * @param	{File}		context			An optional File from which to start the URI
			 * @param	{Folder}	context			An optional Folder from which to start the URI
			 * @param	{Number}	context			An optional stack-function index, the location of which to derive the URI from
			 * @param	{Boolean}	parseURI		An optional Boolean, to bypass immediate returning of file:/// URIs, and parse their content. Defaults to off
			 * @param	{Boolean}	checkLength		An optional Boolean, to test resulting URIs are not longer than the 260 characters allowed for most FLfile operations. Defaults to true
			 * @returns	{String}					An absolute URI
			 */
			URI.toURI = function(pathOrURI, context, parseURI, checkLength)
			{
				// ---------------------------------------------------------------------------------------------------------------
				// process URI

					// if pathOrURI is null, grab the calling file
						if(arguments.length == 0 || typeof pathOrURI == 'undefined')
						{
							pathOrURI = Utils.getStack()[2].uri;
						}

					// variables
						pathOrURI	= String(pathOrURI || '');
						parseURI	= typeof parseURI === 'undefined' ? false : parseURI;
						checkLength = typeof checkLength === 'undefined' ? true : checkLength;

					// process URIs
						if(pathOrURI.indexOf('file:///') === 0)
						{
							// check length
								if(checkLength)
								{
									URI.checkURILength(pathOrURI);
								}

							// if URI parsing ise set to off, return immediately
								if(parseURI == false)
								{
									return pathOrURI;
								}

							// otherwise, convert URI to a path
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
											uri = URI.getFolder(root) + path;
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
													var stack	= Utils.getStack();
													var source	= stack[stackIndex].uri;
													var root	= URI.getFolder(source);

												// grab root folder by comparing against registered URIs
													var folders	= xjsfl.settings.folders.get();
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
							var stack	= Utils.getStack();
							var source	= stack[stackIndex].uri;
							uri			= URI.getFolder(source) + path;
						}

				// ---------------------------------------------------------------------------------------------------------------
				// tidy URI

					// remove file:///
						if(uri.indexOf('file:///') === 0)
						{
							uri = uri.substr(8);
						}

					// tidy drive letter
						uri	= uri.replace(/^([a-z ]+):/i, '$1|')

					// tidy path
						uri = URI.tidy(uri);

					// replace %20 with spaces
						pathOrURI = pathOrURI.replace(/ /g, '%20');

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
			}

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
			URI.toPath = function(pathOrURI, shorten)
			{
				// parse all input via toURI()
					var uri = URI.toURI(String(pathOrURI), 2, true, false);

				// convert and return result
					return URI.asPath(uri, shorten);
			}


		// ---------------------------------------------------------------------------------------------------------------
		// /* Conversion functions */

			/**
			 * Perform simple path to URI conversion
			 * @param	{String}	path		A valid path
			 * @param	{Boolean}	checkLength	An optional Boolean, to test resulting URIs are not longer than the 260 characters allowed for most FLfile operations. Defaults to true
			 * @returns	{String}				A URI-formatted string
			 */
			URI.asURI = function(pathOrURI, checkLength)
			{
				// variable
					var uri;
					pathOrURI = String(pathOrURI);

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
			}

			/**
			 * Perform simple URI to path conversion
			 * @param	{String}	uri			A valid URI string
			 * @param	{URI}		uri			A valid URI instance
			 * @param	{Boolean}	shorten		An optional Boolean to return a path with {placeholder} variables for registered URIs
			 * @returns	{String}				A path-formatted string
			 */
			URI.asPath = function(pathOrURI, shorten)
			{
				// return existing paths early
					if(URI.isPath(pathOrURI) && shorten !== true)
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
								Utils.sortOn(folders, 'name');
								var folder = folders.shift();
								uri = uri.replace(folder.uri, '{' +folder.name+ '}');
							}

						// re-set uri variable
							pathOrURI = uri;
					}

				// convert to path format
					var path = String(pathOrURI)
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
			}


		// ---------------------------------------------------------------------------------------------------------------
		// /* Testing functions */

			/**
			 * Test if the supplied value is a URI-formatted string
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			URI.isURI = function(pathOrURI)
			{
				return (typeof pathOrURI === 'string' || pathOrURI instanceof URI) && String(pathOrURI).indexOf('file:///') === 0;
			}

			/**
			 * Test if the supplied value is a path-formatted string, such as c:/path/to/file.txt or /path
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			URI.isPath = function(pathOrURI)
			{
				return typeof pathOrURI === 'string' && pathOrURI.indexOf('file:///') === -1;
			}

			/**
			 * Tests if a path or URI is absolute (includes tokens and special xJSFL syntax)
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			URI.isAbsolute = function(pathOrURI)
			{
				return /^([\w ]+[:|]|\/|{\w+})/.test(String(pathOrURI).replace(/^file:\/\/\//, ''));
			}

			/**
			 * Tests if a path or URI is relative (includes tokens and special xJSFL syntax)
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			URI.isRelative = function(pathOrURI)
			{
				return ! URI.isAbsolute(pathOrURI);
			}

			/**
			 * Tests if a path or URI looks like a filename, rather than a folder
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			URI.isFile = function(pathOrURI)
			{
				return ! /[\/\\]$/.test(String(pathOrURI));
			}

			/**
			 * Tests if a path or URI looks like a folder, rather than a filename
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			URI.isFolder = function(pathOrURI)
			{
				return pathOrURI == '' || /[\/\\]$/.test(String(pathOrURI));
			}

			/**
			 * Tests if a path or URI is at the highest folder level it can go
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			URI.isRoot = function(pathOrURI)
			{
				return pathOrURI != null ? /^([\w ]+[:|]\/?|\/)$/.test(String(pathOrURI).replace('file:///', '')) : false;
			}


		// ---------------------------------------------------------------------------------------------------------------
		// /* Extraction functions */

			/**
			 * Returns the current folder path of the item referenced by the path or URI
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{String}				The folder of the path or URI
			 */
			URI.getFolder = function(pathOrURI)
			{
				return String(pathOrURI).replace(/([^\/\\]+)$/, '');
			}

			/**
			 * Returns the file or folder name of the item referenced by the path or URI (note names are unescaped)
			 * @param	{String}	pathOrURI		A vald path or URI
			 * @param	{Boolean}	removeExtension	An optional Boolean to remove the extension
			 * @returns	{String}					The file or folder name
			 */
			URI.getName = function(pathOrURI, removeExtension)
			{
				var name = (String(pathOrURI).replace(/\/$/, '')).split(/[\/\\]/).pop().replace(/%20/, ' ');
				return removeExtension ? name.replace(/\.\w+$/, '') : name;
			}

			/**
			 * Returns the parent folder of the item referenced by the path or URI (for folders, this is the parent folder)
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @returns	{String}				The folder of the path or URI
			 */
			URI.getParent = function(pathOrURI)
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
			}

			/**
			 * Resolves a path from the Source URI to a target URI, returning a relative path-formatted path
			 * @param	{String}	srcURI		The source path or URI
			 * @param	{String}	trgURI		The target path or URI
			 * @returns	{String}				The new relative path between the two, or the absolute URI if there's no relationship
			 */
			URI.pathTo = function(srcURI, trgURI)
			{
				// variables
					var trgPath;
					var srcPart, trgPart;
					var srcParts	= URI.asURI(srcURI).replace('file:///', '').split('/');
					var trgParts	= URI.asURI(trgURI).replace('file:///', '').split('/');

				// loop over folders and remove common ancestors
					while(srcParts.length > 1 && srcParts[0] == trgParts[0])
					{
						srcPart 	= srcParts.shift();
						trgPart 	= trgParts.shift();
					}

				// determine relationship between srcURI and trgURI

					// no relationship, so just return the trgURI
						if(srcPart === undefined)
						{
							trgPath = trgURI;
						}
					// src is same level, so path will be 'trg.txt'
						else if(srcParts.length == 1 && trgParts.length == 1)
						{
							trgPath = trgParts.pop();
						}
					// src is below, so path will be '../../trg.txt'
						else if(srcParts.length > 1)
						{
							trgPath = '../'.repeat(srcParts.length - 1) + trgParts.join('/');
						}
					// src is above, so path will be 'path/to/trg.txt'
						else if(srcParts.length < trgParts.length)
						{
							trgPath = trgParts.join('/');
						}

				// return
					return URI.asPath(trgPath);
			}

			/**
			 * Returns the path or URI truncated to the supplied folder name or path
			 * @param	{String}	pathOrURI	A path or URI string
			 * @param	{URI}		pathOrURI	A URI instance
			 * @param	{String}	folder		The name or partial name of a folder to find in the path
			 * @returns	{String}				The new URI or path
			 */
			URI.findFolder = function(pathOrURI, folder)
			{
				// build the string to match the folder
					var str = '^.*' + Utils.rxEscape(folder);
					if( ! /\/$/.test(folder))
					{
						str += '.*?/'; // only add wildcard if the last character is not a slash
					}

				// match and return
					var rx			= new RegExp(str, 'i');
					var matches		= String(pathOrURI).match(rx);
					return matches ? matches[0] : null;
			}

			/**
			 * Re-targets a specified portion of a URI (or URIs) to point at a new folder
			 * @param	{String}	src			The source path or URI
			 * @param	{Array}		src			An Array of source paths or URI
			 * @param	{String}	base		The name or partial name of a folder in the src path or URI you want to branch from
			 * @param	{String}	trg			A folder you want to retarget to, from the source base and downwards
			 * @returns	{String}				The new path or URI
			 * @returns	{Array}					An Array of new paths or URIs
			 */
			URI.reTarget = function(src, base, trg)
			{
				//TODO - relook at this function - is it too confusing!?
				// perhaps have src, trg, base
				src = String(src);
				if(base.indexOf('..') !== -1)
				{
					var folder = URI.getFolder(src);
					base = URI.tidy(folder + base);
				}
				base	= URI.findFolder(src, base);
				trg		= URI.getFolder(trg);
				return trg + src.substr(base.length);
			}

		// ---------------------------------------------------------------------------------------------------------------
		// /* Utility functions */

			URI.tidy = function(pathOrURI)
			{
				// cast to string
					pathOrURI = String(pathOrURI);

				// remove file:/// & convert spaces to %20
					var protocol = '';
					if(pathOrURI.indexOf('file:///') > -1)
					{
						protocol =  'file:///';
						pathOrURI = pathOrURI.substr(8).replace(/ /g, '%20');
					}

				// replace backslashes
					pathOrURI = pathOrURI.replace(/\\+/g, '/');

				// replace double-slashes
					pathOrURI = pathOrURI.replace(/\/+/g, '/');

				// replace redundant ./
					pathOrURI = pathOrURI.replace(/(^|\/)\.\//img, '$1');

				// resolve relative tokens
					while(pathOrURI.indexOf('../') > 0)
					{
						// kill folder/../ pairs
							pathOrURI = pathOrURI.replace(/(^|\/)[^\/]+\/\.\.\//, '/');

						// replace any leading ../ tokens (as you can't go higher than root)
							pathOrURI = pathOrURI.replace(/^([a-z ]+[:|])\/[.\/]+/img, '$1/');
							//path = path.replace(/^\/\.\.\//img, '');
					}
					
				// return
					return protocol + pathOrURI;
			}

			/**
			 * Checks that the length of a URI is not longer than the maximum 260 characters supported by FLfile
			 * @param	{String}	uri			A URI
			 * @returns	{Boolean}				true of false depending on the result
			 */
			URI.checkURILength = function(uri)
			{
				if(uri.length > 260)
				{
					URI.throwURILengthError(uri);
				}
			}

			URI.throwURILengthError = function(uri)
			{
				throw new URIError('The URI for path "' +URI.asPath(uri)+ '" is more than 260 characters.');
			}

			URI.toString = function()
			{
				return '[class URI]';
			}


	// ---------------------------------------------------------------------------------------------------------------
	// register

		if(xjsfl && xjsfl.classes)
		{
			xjsfl.classes.register('URI', URI);
		}
