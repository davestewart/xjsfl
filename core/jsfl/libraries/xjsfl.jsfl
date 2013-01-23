// ------------------------------------------------------------------------------------------------------------------------
//
//           ██ ██████ ██████ ██
//           ██ ██     ██     ██
//  ██ ██    ██ ██     ██     ██
//  ██ ██    ██ ██████ █████  ██
//   ███     ██     ██ ██     ██
//  ██ ██    ██     ██ ██     ██
//  ██ ██ █████ ██████ ██     ██████
//
// ------------------------------------------------------------------------------------------------------------------------
// xJSFL 

	/**
	 * xJSFL
	 *
	 * @overview	Rapid development framework for extending Adobe Flash
	 * @author		Dave Stewart:	dave@xjsfl.com
	 * @see			Main website:	http://www.xjsfl.com
	 * @see			Support:		http://www.xjsfl.com/support
	 * @see			License:		http://www.xjsfl.com/license
	 * @instance	xjsfl
	 */

	// Fake xjsfl instantation for Komodo autocomplete
		if( ! xjsfl )
		{
			xjsfl = { };
		}



// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██    ██   ██
//  ██            ██    ██
//  ██     █████ █████ █████ ██ █████ █████ █████
//  ██████ ██ ██  ██    ██   ██ ██ ██ ██ ██ ██
//      ██ █████  ██    ██   ██ ██ ██ ██ ██ █████
//      ██ ██     ██    ██   ██ ██ ██ ██ ██    ██
//  ██████ █████  ████  ████ ██ ██ ██ █████ █████
//                                       ██
//                                    █████
//
// ------------------------------------------------------------------------------------------------------------------------
// # Settings - Core settings and cached variables

	/**
	 * Core settings and cached variables
	 * @class	xjsfl.settings
	 * @ignore
	 */
	xjsfl.settings =
	{
		/**
		 * Application data
		 * Information about the Flash version the user is currently running
		 */
		app:
		{
			// Apple: "mac" | Windows: "win"
				platform:	fl.version.substr(0, 3).toLowerCase(),
				
			// an object property to test against
				os:			{
								mac:fl.version.substr(0, 3) == 'MAC',
								win:fl.version.substr(0, 3) == 'WIN'
							},

			// the product name of flash, i.e. CS4
				name:		(function(){
								var version = fl.version.match(/\w+ (\d+)/)[1];
								var name = { '9':'CS3', '10':'CS4', '11':'CS5', '12':'CS6', '13':'CS7' };
								return name[version] || 'Unknown';
							})(),

			// the integer version of Flash
				version:	parseInt(fl.version.match(/\w+ (\d+)/)[1]),

			// the CS version of Flash
				csVersion:	parseInt(fl.version.match(/\w+ (\d+)/)[1]) - 6

		},

		/**
		 * Folder URIs
		 * Common folders which may be used as placeholders in URI references, i.e. '{core}path/to/file.txt'
		 */
		folders:
		{
			// methods
				get:function()
				{
					var uris = [];
					for(var name in this)
					{
						if( ! /^(get|set)$/.test(name) )
						{
							uris.push(this[name]);
						}
					}
					return uris.sort().reverse();
				},

				set:function(name, uri)
				{
					if( ! /^(set|get)$/.test(this.name) )
					{
						this[name] = URI.toURI(uri, 1);
					}
				},

			// properties
				xjsfl:		xjsfl.uri,
				core:		xjsfl.uri + 'core/',
				modules:	xjsfl.uri + 'modules/',
				user:		xjsfl.uri + 'user/',
				flash:		fl.configURI,
				swf:		fl.configURI + 'WindowSWF/',

		},

		/**
		 * URIs
		 * An ordered list of base URIs which xJSFL uses when searching for files
		 * module uris are updated automatically when new modules are added
		 * @type {Object}
		 */
		uris:
		{
			// properties
				core:	[ ],
				module: [ ],
				user:	[ ],

			// methods

				/**
				 * Adds URIs to the URIs list
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @param	{String}	type		The type of URI to add. Valid types are user, module, or core
				 */
				add:function(pathOrURI, type)
				{
					// check uri is valid
						var uri = URI.toURI(pathOrURI);

					// check URI exists
						if( ! FLfile.exists(uri))
						{
							throw new URIError('Error in xjsfl.settings.uris.add(): URI "' +uri+ '" does not exist');
						}

					// variables
						type	= type || 'user';
						uri		= uri.replace(/[\/]+$/g, '') + '/';	// ensure a single trailing slash

					// add if not already added
						if(this[type].indexOf(uri) == -1)
						{
							this[type].push(uri);
							xjsfl.settings.searchPaths.add(uri);
						}
				},

				/**
				 * Gets all URIs in order
				 * @returns	{Array}		An Array or URIs
				 */
				get:function()
				{
					var uris = xjsfl.settings.uris;
					return [].concat(uris.core).concat(uris.module).concat(uris.user);
				},

		},

		/**
		 * Search paths
		 * A cache of folder paths which xJSFL searches when loading files
		 */
		searchPaths:
		{
			add:function(uri)
			{
				if(URI.isURI(uri))
				{
					// grab the path
						var path = URI.toPath(uri, true);

					// get all searchable paths
						var paths = Utils.getSearchableURIs(uri, 'folders', true);
						xjsfl.output.trace('added ' +paths.length+ ' search paths for "' +path+ '"');
						if(paths.length > 50)
						{
							xjsfl.output.warn('WARNING! Adding this many search paths can slow down file searching. Consider using manifest.xml files to exlude sub folders');
						}

					//BUG - for some reason, an error is thrown when there are 70+ paths in pocket god.
							// it's not always this pattern either. And the error is only thrown when
							// calling xjsfl.settings.uris.add from the bootstrap.
							// WTF?

					// assign the paths as a new URIList
						this[uri] = new URIList(paths);
				}
			},

			/**
			 * returns an Array or URILists
			 * @param	{String}			Filter all paths by the first folder
			 * @returns	{Array}				An Array of URILists
			 */
			get:function(filter)
			{
				// variables
					/** @type {URIList}	A list of URIs */
					var list;
					var inputPaths;
					var outputPaths	= [];
					var uris		= xjsfl.settings.uris.get();

				// loop over URI lists in order, extract paths, and collect source URI + paths
					for each(var uri in uris)
					{
						list = this[uri];
						if(list)
						{
							inputPaths = filter ? list.filter(new RegExp('^' + filter.replace(/\/*$/, '/'))) : list.getURIs();
							for each(var path in inputPaths)
							{
								outputPaths.push(uri + path);
							}
						}
					}

				// return
					return outputPaths;
			},

		},

		/**
		 * Newline character depending on PC or Mac
		 * @type {String}
		 */
		newLine:fl.version.substr(0, 3).toLowerCase() === 'win' ? '\r\n' : '\n'

	}


// ------------------------------------------------------------------------------------------------------------------------
//
//  █████        ██
//  ██  ██       ██
//  ██  ██ █████ █████ ██ ██ █████
//  ██  ██ ██ ██ ██ ██ ██ ██ ██ ██
//  ██  ██ █████ ██ ██ ██ ██ ██ ██
//  ██  ██ ██    ██ ██ ██ ██ ██ ██
//  █████  █████ █████ █████ █████
//                              ██
//                           █████
//
// ------------------------------------------------------------------------------------------------------------------------
// # Debug - debugging methods for file, function and error

	/**
	 * @type {Object}	The xJSFL Debug object
	 * @class
	 */
	xjsfl.debug =
	{
		/**
		 * Tests a callback and outputs the error stack if the call fails. Add additional parameters after the callback reference
		 * @param	{Function}	fn			The function to test
		 * @param	{Array}		params		An optional Array of arguments or Arguments object to pass to the function
		 * @param	{Object}	scope		An optional scope to run the function in
		 * @returns	{Value}					The result of the function if successful
		 */
		func:function(fn, params, scope)
		{
			// feedback
				xjsfl.output.trace('testing function: "' + Utils.parseFunction(fn).signature + '"');

			// test!
				try
				{
					return fn.apply(scope || this, params);
				}
				catch(err)
				{
					this.error(err, true);
				}
		},

		/**
		 * Tests for errors in loaded JSFL files
		 */
		file:function(path)
		{
			// clear any previous errors
				//this.clear();
				if(xjsfl.halted)
				{
					//return;
				}

			// detect if there's an error loading files, either by the output panel, or by a delay, caused by the user responding to an alert box

				// detect delay since the file was loaded
					var delay		= new Date().getTime() - xjsfl.file.lastLoadTime;

				// grab panel output
					var outputURI	= xjsfl.uri + 'core/jsfl/run/temp/output-panel.txt';
					fl.outputPanel.save(outputURI);
					var output		= FLfile.read(outputURI);
					//FLfile.remove(outputURI);

				// determine error type, if any
					var state	= false;
					var message	= '...';
					if(delay > 1000)
					{
						message = 'a delay (possibly due to an error alert box) was detected';
						state	= true;
					}
					else if(/(The following JavaScript error\(s\) occurred:|Open a Flash document \(FLA\) before running this script\.)\s*$/.test(output))
					{
						message = 'Flash threw a JavaScript error';
						state	= true;
					}
					return true;


			// generate an error if the file appeared to load incorrectly
				if(state)
				{
					//TODO	Think about loading and eval()ing the file to detect errors.
					//		Would need to create a files in the same folder, i.e. "some file.debug.jsfl" 
					//		and eval from there so URI methods don't fail

					// create a new error object (but only the first time an error is trapped)
						if( ! xjsfl.halted )
						{
							// flags
								xjsfl.halted		= true;
								xjsfl.loading		= false;

							// build error
								var error			= new Error('<error>', '', 0);
								error.message		= "The currently-loading file wouldn't run, as " +message + '.';
								error.fileName		= URI.toURI(path);
								error.stack			= error.stack.replace('Error("<error>","",0)@:0', 'Exact cause of error unknown. Run file manually to debug@' +path+ ':0');

							// remove fake items
								var arr				= error.stack.split(/[\r\n]+/);
								arr.splice(1,2);
								error.stack			= arr.join('\n');

							// log a file warning
								xjsfl.output.log('JavaScript error in "' +path+ '"\n', Log.FILE, 3);

							// debug this error
								xjsfl.debug.error(error);

							// pop the stack!
								xjsfl.file.stack.pop();

							// throw a new Error
								//throw error;
								throw new Error('File load error');
						}
				}
		},


		/**
		 * Generates, logs and traces a human-readable error stack
		 *
		 * @param	{Error}		error		A JavaScript Error object
		 * @param	{Boolean}	log			An optional Boolean to log the error
		 * @param	{Boolean}	testing		Internal use only. Removes test() stack items
		 */
		error:function(error, testing)
		{
			// reload required classes if not defined
				if( ! xjsfl.classes.cache.Template )
				{
					// override include so dependencies aren't loaded
						include = function(){  };

					// load files needed for debugging
						var files =
						[
							'utils/Utils.jsfl',
							'utils/Class.jsfl',
							'objects/JSON.jsfl',
							'file/FileSystemObject.jsfl',
							'file/File.jsfl',
							'text/Output.jsfl',
							'text/Template.jsfl',
							'flash/PropertyResolver.jsfl',
							'text/Table.jsfl'
						];
						for each(var file in files)
						{
							fl.runScript(xjsfl.uri + 'core/jsfl/libraries/' + file);
						}
				}

			// variables
				var stack;
				if(error instanceof Error)
				{
					stack = xjsfl.classes.cache.Utils.getStack(error, true);
					if(testing)
					{
						stack.splice(stack.length - 3, 2);
					}
				}
				else
				{
					error	= new Error(error);
					stack	= Utils.getStack(error, true);
					stack	= stack.slice(1);
				}

			// log error as JSON
				var data = Utils.getValues(stack, ['uri', 'line', 'code'], true);
				fl.runScript(xjsfl.uri + 'core/jsfl/libraries/objects/JSON.jsfl');
				FLfile.write(xjsfl.uri + 'core/jsfl/run/temp/error.txt', JSON.encode({message:error.message, stack:data}));

			// generate error text
				if(true)
				{
					// template uris
						var uriErrors	= xjsfl.uri + 'core/assets/templates/errors/errors.txt';
						var uriError	= xjsfl.uri + 'core/assets/templates/errors/error.txt';

					// build errors
						var content = '';
						for(var i = 0; i < stack.length; i++)
						{
							stack[i].index = i;
							content += new xjsfl.classes.cache.Template(uriError, stack[i]).render(); // reference Template class directly
						}

					// build output
						var data		= { error:error.toString(), content:content };
						var output		= new xjsfl.classes.cache.Template(uriErrors, data).render();
				}
				else
				{
					var data = Utils.getValues(stack, ['path','file','line','code'], true)
					var output = '\n\n' + new Table(data).render(false);
				}

			// log
				xjsfl.output.warn('File load error:');
				xjsfl.output.log(output);
				trace(output.replace(/^[\r\n]+/, ''))

			// update flags
				xjsfl.loading	= false;
				//xjsfl.halted	= false;
		},

		/**
		 * Clears any existing errors & logs
		 */
		clear:function()
		{
			xjsfl.halted = false;
			var uri = xjsfl.uri + 'core/jsfl/run/temp/error.txt';
			if(FLfile.exists(uri))
			{
				FLfile.remove(uri);
			}
		},
	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██ ██
//  ██        ██
//  ██     ██ ██ █████
//  █████  ██ ██ ██ ██
//  ██     ██ ██ █████
//  ██     ██ ██ ██
//  ██     ██ ██ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// # File - Methods to load framework assets, or handle common filesystem functionality

	/**
	 * Methods to load framework assets, or handle common filesystem functionality
	 * @class
	 */
	xjsfl.file =
	{
		get loading()
		{
			return xjsfl.file.stack.length > 0;
		},

		lastLoadTime:0,

		stackLimit:99,

		stack:[],

		/**
		 * Finds all files of a particular type within the cascading file system
		 *
		 * @param	{String}	type		The folder in which to look in to find the files, @see switch statement
		 * @param	{String}	name		A file name (pass no extension to use default), or partial file path
		 * @param	{Number}	returnType	An optional 0, 1 or -1; 0: all files (default), -1: the last file (user), 1:the first file (core)
		 * @returns	{String}				A single file path if found and return type is 1 or -1, or null if not
		 * @returns	{Array}					An Array of file uris if found, and return type is 0, or null if not
		 */
		find:function(type, name, returnType)
		{
			// --------------------------------------------------------------------------------
			// work out base uri

				// variables
					name = name ? String(name) : '';

				// file-specific variables
					var path, name, ext, which;

				// switch type
					switch(type)
					{
						// for scripts, return the last file found, from: core, modules, user (jsfl)
						case 'script':
						case 'scripts':
						case 'jsfl':
							path	= 'jsfl/';
							ext		= '.jsfl';
							which	= -1;
						break;

						// for libraries, return all found files, in order: core, modules, user (jsfl)
						case 'lib':
						case 'libs':
						case 'library':
						case 'libraries':
							path	= 'jsfl/libraries/';
							ext		= '.jsfl';
							which	= 0;
						break;

						// for full config path return the last file found from: core, modules, user (xml)
						case 'config':
						case 'settings':
							path	= 'config/';
							ext		= '.xml';
							which	= -1;
						break;

						// for templates, return the last file found, from: core, modules, user (txt, or supplied extension)
						case 'template':
							path	= 'assets/templates/';
							ext		= '.txt';
							which	= -1;
						break;

						// otherwise, return all files found, from: core, modules, user
						default:
							path	= type.replace(/\/+$/g, '') + '/';
							ext		= '';
							which	= 0;
					}

				// add default extension if not provided;
					name += name.match(/\.\w+$/) ? '' : ext;


			// --------------------------------------------------------------------------------
			// find files

				// variables
					var uris		= [];
					var paths		= xjsfl.settings.searchPaths.get(path);

				// check all paths for files
					for(var i = 0; i < paths.length; i++)
					{
						var uri = paths[i] + name;
						if(FLfile.exists(uri))
						{
							uris.push(uri);
						}
					}

				// return null if no URIs found
					if(uris.length === 0)
					{
						return null;
					}

			// --------------------------------------------------------------------------------
			// return

				// variables
					returnType = Number(returnType || which)

				// return
					if(returnType > 0)
					{
						return uris.shift();
					}
					else if(returnType < 0)
					{
						return uris.pop();
					}
					else
					{
						return uris;
					}
		},

		/**
		 * Attempts to directly load files, or find and run or return files from the cascading file structure.
		 * Parameters and return type vary depending on file type!
		 *
		 * @param	{String}		pathOrName	The relative or absolute path, or uri to the file (glob wildcards allowed)
		 * @param	{String}		pathOrName	The name or path fragment to a file, with or without the file extension
		 * @param	{String}		type		The folder type in which to look (i.e. settings) for the file(s)
		 *
		 * @returns	{Boolean}					A Boolean indicating Whether the file was successfully found and loaded
		 * @returns	{XML}						An XML object of the content of the file, if XML
		 * @returns	{String}					The string content of the file otherwise
		 */
		load:function (pathOrName, type)
		{
			/*
				// path types
					if absolute or relative path, attempt to load it
					if type and name, find it, then attempt to load it

				// signatures
					load(path)
					load(name, type)
			*/

			// --------------------------------------------------------------------------------
			// Resolve URI and load content in

				// variables
					var uriResult	= null;
					//trace(pathOrName)
					
				// a wildcard (path or URI) is passed in, so glob it
					if(String(pathOrName).indexOf('*') !== -1)
					{
						var uri		= URI.toURI(pathOrName, 1);
						uriResult	= Utils.glob(uri);
						inspect(uriResult)
					}

				// a URI was passed in, test that it exists
					else if(URI.isURI(pathOrName))
					{
						uriResult	= FLfile.exists(pathOrName) ? pathOrName : null;
					}

				// a single path was passed in, so convert it to a uri
					else if(type == undefined || type === true || type === false)
					{
						var uri		= URI.toURI(pathOrName, 1);
						uriResult	= FLfile.exists(uri) ? uri : null;
					}

				// name and type supplied, so find the file we need in the cascading file system
					else
					{
						uriResult	= xjsfl.file.find(type, pathOrName);
					}

			// --------------------------------------------------------------------------------
			// take action on uriResult

				// variables
					var content;

				// if uriResult is null, no files were found
					if(uriResult == null)
					{
						var path = URI.toPath(pathOrName);
						if(type == null || type === true || type === false)
						{
							var message = 'Error in xjsfl.file.load(): The file "' +path+ '" could not be found';
						}
						else
						{
							var message = 'Error in xjsfl.file.load(): Could not resolve type "' +type+ '" and path "' +path+ '" to an existing file';
						}
						throw(new URIError(message));
					}

				// otherwise, do something with the uri / uris (plural) if more than 1 was found
					else
					{
						var uris = Utils.isArray(uriResult) ? uriResult : [uriResult];
						for each(var uri in uris)
						{

							// variables
								uri				= String(uri);
								var ext			= URI.getExtension(uri);
								var shortPath	= URI.asPath(uri, true);

							// exit early if file is in a recursive loop (this can happen with recursive includes)
								if(xjsfl.file.stack.indexOf(uri) !== -1)
								{
									//trace('FILE LOADED:' + uri);
									return null;
								}

							// flag
								xjsfl.file.stack.push(uri);

							// log
								xjsfl.output.log('[' +xjsfl.file.stack.length+ '] loading file: "' + shortPath + '" ...', Log.FILE);

							// do something depending on extension
								switch(ext)
								{
									case 'jsfl':
										// load JSFL script
											xjsfl.file.lastLoadTime = new Date().getTime();
											content		= fl.runScript(uri);

										// test for load errors
											xjsfl.debug.file(URI.toPath(uri));
									break;

									case 'xul':
									case 'xml':
										content			= FLfile.read(uri);
										content			= content.replace(/<\?.+?>/, ''); // remove any doc type declaration
										content			= new XML(content);
									break;

									default:
										content			= FLfile.read(uri);
								}

						}
					}

			// log
				xjsfl.output.log('[' +(xjsfl.file.stack.length - 1)+ '] loaded file:  "' +shortPath+ '" OK', Log.FILE);

			// flag
				xjsfl.file.stack.pop();

			// if all files have loaded, and execution is halted, reset the flag
				if(xjsfl.file.stack.length == 0)
				{
					//xjsfl.output.log('all files loaded', Log.FILE);
					if(xjsfl.halted)
					{
						xjsfl.output.log('Setting xjsfl.halted to false', Log.FILE);
						xjsfl.halted = false;
						throw new Error('File load error');
					}
				}


			// return
				return content;
		},

		/**
		 * Saves data to file
		 * @param	{String}	pathOrURI	The path or URI to save data to
		 * @param	{String}	contents	The data to save
		 * @param	{Boolean}	force		An optional Boolean to force overwriting of readonly files
		 * @returns	{Boolean}				true or false depending on the result
		 */
		save:function(pathOrURI, contents, force)
		{
			var uri			= URI.toURI(pathOrURI, 1)
			var file		= new File(uri);
			

			//TODO Re-look at all this file permissions stuff - perforce always seems to throw something up
			if(force)
			{
				FLfile.setAttributes(uri, 'N');
			}
			
			file.contents	= contents;
			return file.exists && file.size > 0;
		},

		/**
		 * Copies a file from one location to another
		 * @param	{String}	srcPathOrURI	The source path or URI
		 * @param	{String}	trgPathOrURI	The target path or URI
		 * @returns	{Boolean}					true or false depending on whether the copy was successful or not
		 */
		copy:function(srcPathOrURI, trgPathOrURI)
		{
			// not yet implemented
		}
	}


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██
//  ██     ██
//  ██     ██ █████ █████ █████ █████ █████
//  ██     ██    ██ ██    ██    ██ ██ ██
//  ██     ██ █████ █████ █████ █████ █████
//  ██     ██ ██ ██    ██    ██ ██       ██
//  ██████ ██ █████ █████ █████ █████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// # Classes - Core methods to load and register framework libraries and classes

	xjsfl.classes =
	{
		/** @type {Object}	Cache of all loaded URIs */
		loadedURIs:{},

		/** @type {Object}	Cache of class URIs */
		uris:{},

		/** @type {Object}	Cache of class definitions */
		cache:{},

		/**
		 * Load a class or array of classes from disk
		 *
		 * @param	{String}	fileRef		A class name
		 * @param	{String}	fileRef		A class filename or path, relative to any jsfl/libraries folder
		 * @param	{String}	fileRef		A wildcard string, i.e. '//user/jsfl/libraries/**.jsfl'
		 * @param	{Array}		fileRef		An Array of class filepaths
		 * @param	{Boolean}	reload		An optional Boolean to force a reload of loaded URIs
		 * @returns	{xjsfl}					The main xJSFL object
		 */
		load:function(fileRef, reload)
		{
			// catch errors
				if(arguments.length > 2 || typeof reload === 'string')
				{
					throw new Error('xjsfl.classes.load() accepts only 2 arguments: fileRef (which can be an Array) & reload.');
				}

			// exit if xjsfl is halted
				if(xjsfl.halted)
				{
					return;
				}

			// --------------------------------------------------------------------------------
			// Load URI references

				if(URI.isURI(fileRef) && String(fileRef).indexOf('*') === -1)
				{
					// variables
						var uri		= fileRef;
						var name	= uri.split('/').pop().replace(/\.\w+$/, '');

					// never reload xjsfl
						if(name === 'xjsfl')
						{
							return;
						}

					// load
						if(FLfile.exists(uri))
						{
							// otherwise, load
								if( ! this.loadedURIs[uri.toLowerCase()] || reload)
								{
									// exit if file is already loading
										if(xjsfl.file.stack.indexOf(uri) !== -1)
										{
											//trace('FILE ALREADY LOADED:' + uri);
											return null;
										}

									// exit if file.stack limit is reached
										if(xjsfl.file.stack.length > xjsfl.file.stackLimit)
										{
											xjsfl.output.log('not loading library: ' + name)
											return;
										}
										else
										{
											xjsfl.output.trace('loading library: ' + name);
										}

									// load class
										this.loadedURIs[uri.toLowerCase()] = true;
										xjsfl.output.log('load library: "' + name + '"', Log.FILE);
										xjsfl.file.load(uri);
								}
								else
								{
									xjsfl.output.log('already loaded library: "' + name + '"');
								}
						}
						else
						{
							xjsfl.output.warn('library "' + name + '" could not be found', Log.FILE);
						}
				}

			// --------------------------------------------------------------------------------
			// resolve wildcard

				else if(typeof fileRef === 'string' && fileRef.indexOf('*') !== -1)
				{
					// variables
						fileRef		= URI.toURI(fileRef, 1);
						var uris	= Utils.glob(fileRef);
						
					// debug
						if(uris.length)
						{
							xjsfl.output.log('found ' +uris.length+ ' file(s) files in path "' +fileRef+ '"', Log.FILE);
						}
						else
						{
							xjsfl.output.log('path "' +fileRef+ '" did not resolve to any files', Log.FILE);
						}

					// load files
						xjsfl.classes.load(uris, reload);
				}

			// --------------------------------------------------------------------------------
			// resolve single tokens

				else if(typeof fileRef === 'string' && /^\w+$/.test(fileRef) && fileRef != 'xjsfl')
				{
					var uris = xjsfl.file.find('library', fileRef);
					for each(var uri in uris)
					{
						xjsfl.classes.load(uri, reload);
					}
				}


			// --------------------------------------------------------------------------------
			// resolve Array

				else if(fileRef instanceof Array && fileRef.length)
				{
					var operation = reload ? 'require' : 'include';
					xjsfl.output.log(operation + ' classes: "' + fileRef.join('", "') + '"', Log.FILE);
					for each(var file in fileRef)
					{
						xjsfl.classes.load(file, reload);
					}
				}

			// return
				return this;
		},

		/**
		 * Registers a class/function for later retrieval
		 *
		 * @param	{String}	name		The name of the class / function / object to register
		 * @param	{Object}	obj			The actual class / function / object
		 * @param	{String}	uri			An optional URI to the object's file, defaults to the calling file's URI
		 * @returns	{xjsfl}					The main xJSFL object
		 */
		register:function(name, obj, uri)
		{
			// only log if we're not in the middle of an error
				if( ! xjsfl.halted )
				{
					xjsfl.output.log('registering ' +(/[a-z]/.test(name[0]) ? 'function ' : 'class ')+ name);
				}

			// work out URI before utils has loaded
				var error	= new Error();
				var rx		= /@(.+):\d+\s*$/;
				var match	= error.stack.match(rx);
				var uri		= uri || match ? FLfile.platformPathToURI(match[1]) : null;

			// store class
				xjsfl.classes.cache[name]	= obj;
				xjsfl.classes.uris[name]	= uri;

				//alert(name)
		},

		/**
		 * Internal function that restores a class/function to the supplied namespace
		 *
		 * @param	{Object}	scope		The scope to which the class should be restored to (defaults to window)
		 * @param	{string}	name		An optional name of the class to restore. if this is omitted, all classes are restored
		 * @returns	{xjsfl}					The main xJSFL object
		 */
		restore:function(scope, name)
		{
			// restore all classes if no name is passed
				if(arguments.length === 1)
				{
					for (name in xjsfl.classes.cache)
					{
						xjsfl.classes.restore(scope, name);
					}
				}

			// restore only one class
				else if(typeof name === 'string')
				{
					delete scope[name];
					scope[name] = xjsfl.classes.cache[name];
				}

			// return this for chaining
				return this;
		}
	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██   ██          ██       ██
//  ███ ███          ██       ██
//  ███████ █████ █████ ██ ██ ██ █████ █████
//  ██ █ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██
//  ██   ██ ██ ██ ██ ██ ██ ██ ██ █████ █████
//  ██   ██ ██ ██ ██ ██ ██ ██ ██ ██       ██
//  ██   ██ █████ █████ █████ ██ █████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// # Modules - Core methods to handle the initialization and loading of modules

	/**
	 * Core methods to handle the initialization and loading of modules
	 *
	 * A namespace in which to store module code to prevent pollution of global
	 * scope as well as a couple of methods to add and load module code
	 *
	 * Needs to be created in a closure to keep the modules and manifests private
	 *
	 * The syntax below is somewhat convoluted, in order to trick Komodo into
	 * displaying the members correctly in autocomplete. Nothing else :)
	 *
	 * @ignore
	 * @class
	 */
	xjsfl.modules =
	(
		/**
		 * The module lazy-loading process goes like this...
		 *
		 * 1 - 	All modules reside in their own folder, with a manifest.xml in the root, and a
		 * 		bootstrap.jsfl in jsfl. The manifest stores all information about the module, and
		 * 		the bootstrap contains optional JSFL code that the module needs to run on startup.
		 *
		 * 2 - 	During the main xJSFL bootstrap, xjsfl.modules.find() is called, to search the main
		 *		modules folder for modules' manifest.xml files. Note that find() can also be called
		 *		manually from the user bootstrap to initialize modules external to the xJSFL modules
		 *		folder.
		 *
		 * 3 -	For any modules that are found, xjsfl.modules.init(path) is called and the module's
		 *		manifest information is cached, and any files in <module>/flash/ are copied to the
		 *		main Flash folder.
		 *
		 *		Note that no modules instances are instantiated yet!
		 *
		 * 4 -	When any panels are opened, xjsfl.modules.load(namespace) is called via MMExecute()
		 * 		from the AbtractModule.initialize() function. This loads the module's bootstrap.jsfl
		 *		file, which should in turn load the module's main JSFL file which contains the module's
		 *		JSFL properties and methods. This file then calls...
		 *
		 * 5 -	...xjsfl.modules.create(), which creates and registers the module internally, so it
		 *		can be retrieved if necessary via xjsfl.modules.getModule(namespace)
		 *
		 * @ignore
		 */
		function modules()
		{
			/**
			 * A private reference to all found manifests
			 */
			var manifests = {};

			/**
			 * A private reference to all loaded modules
			 */
			var modules = {};

			/**
			 * The property object that will be returned as xjsfl.modules
			 */
			xjsfl.modules =
			{
				/**
				 * Gets the manifest for a particular module namespace
				 * @param	{String}	namespace	The namespace of the manifest to get
				 * @returns	{XML}					The manifest XML
				 */
				getManifest:function(namespace)
				{
					var manifest = manifests[namespace];
					if(manifest)
					{
						return manifest;
					}
					throw new Error('xjsfl.modules.getManifest(): there is no manifest registered under the namespace "' +namespace+ '"');
				},

				/**
				 * Gets the Module instance for a particular module namespace
				 * @param	{String}	namespace	The namespace of the module (should match the AS3 and manifest values)
				 * @returns	{Module}				An xJSFL Module instance
				 */
				getModule:function(namespace)
				{
					var module = modules[namespace];
					if(module)
					{
						return module;
					}
					throw new Error('xjsfl.modules.getModule(): there is no module registered under the namespace "' +namespace+ '"');
				},

				/**
				 * Returns the base URI of all modules in a given folder and sub folder
				 * Called in the main bootstrap, and can be called manually in the user bootstrap to add other folders.
				 * @param	{String}	uri			An optional folder URI to search in, defaults to xJSFL/modules/
				 * @param	{Boolean}	init		An optional Boolean to initialize any found modules
				 * @returns	{Array}					An Array of module URIs
				 */
				find:function(uri, init)
				{
					// callback function to process files and folders
						function processFile(element)
						{
							if(element instanceof Folder)
							{
								// skip folders where manifests shouldn't be
								if(/assets|config|docs|temp|ui/.test(element.name))
								{
									return false;
								}
							}
							// if a manifest is found, with module information, initialize it
							else if(element.name === 'manifest.xml')
							{
								var manifest = xjsfl.file.load(element.uri);
								if(manifest.module.length())
								{
									var uri = element.parent.uri;
									uris.push(uri);
									if(init)
									{
										xjsfl.modules.init(uri);
									}
									return false;
								}
							}
						};

					// find and load modules automatically
						var uris	= [];
						uri			= uri ? URI.toURI(uri, 1) : xjsfl.settings.folders.modules;
						Utils.walkFolder(uri, processFile);

					// return
						return uris;
				},

				//TODO Does init() need to be public? Consider making it private

				/**
				 * Initializes, but does not instantiate a module, by caching its manifest files, and copying
				 * any panel resources to the Flash/WindowSWF folder, and commands to the Commands folder
				 *
				 * @param	{String}	folderNameOrURI		The module folder name or path, relative to xJSFL/modules/ i.e. "Snippets", or an absolute URI
				 */
				init:function(folderNameOrURI)
				{
					// ensure path has a trailing slash
						folderNameOrURI = folderNameOrURI.replace(/\/*$/, '/');
						
					// if URI is a path, and absolute, convert to be a URI (this allows us to use paths to load init user modules)
						if(URI.isAbsolute(folderNameOrURI) && URI.isPath(folderNameOrURI))
						{
							folderNameOrURI = URI.toURI(folderNameOrURI);
						}

					// if path is not a URI, it will probably be a path fragment, so default to the modules folder
						var uri = URI.isURI(folderNameOrURI) ? folderNameOrURI : xjsfl.settings.folders.modules + folderNameOrURI;

					// attempt to load the module's manifest
						var manifest = xjsfl.file.load(uri + 'manifest.xml');
						if(manifest)
						{
							manifest = manifest.module;
						}

					// if no module manifest, assume the module is code-only, and return
						else
						{
							return this;
						}

					// feedback
						function warn(message)
						{
							xjsfl.output.warn(message + ' in "' +URI.asPath(uri)+ 'manifest.xml"');
						}
						var name = String(manifest.meta.name);
						if( ! name )
						{
							warn('Manifest module.meta.name not declared');
							return false;
						}
						xjsfl.output.trace('registering module "' +name+ '"', 1);

					// update manifest with the *actual* URI, and store on main xjsfl object
						manifest.data.uri		= uri;
						var namespace			= String(manifest.data.namespace);
						if( ! namespace )
						{
							warn('Manifest module.data.namespace not declared');
							return false;
						}
						manifests[namespace]	= manifest;

					// add the URI to xjsfl.settings.folders
						var token			= String(manifest.data.uri.@token) || namespace;
						var token			= String(namespace);
						xjsfl.settings.folders[token] = uri;

					// add the URI to xjsfl.settings.uris.modules
						xjsfl.settings.uris.add(uri, 'module');

					// copy any flash assets
						var assetsURI = uri + 'flash/';
						if(FLfile.exists(assetsURI))
						{
							// variable and callback
								var copyURIs = [];
								var process = function(element)
								{
									if(element instanceof File)
									{
										var targetURI	= URI.reTarget(element.uri, fl.configURI, assetsURI);
										var targetFile	= new File(targetURI);
										if( ! targetFile.exists || targetFile.modified < element.modified)
										{
											copyURIs.push({fromURI:element.uri, toURI:targetFile.uri, toPath:targetFile.path});
										}
									}
								}

							// find new or updated files
								Utils.walkFolder(assetsURI, process);

							// copy files, if any
								if(copyURIs.length)
								{
									xjsfl.output.trace('copying / updating ' + copyURIs.length + ' asset(s) to the Flash configuration folder');
									for each(var obj in copyURIs)
									{
										new File(obj.fromURI).copy(obj.toURI, true);
										xjsfl.output.trace('copying asset to "' +obj.toPath+ '"', false, false);
									}
								}
								else
								{
									xjsfl.output.trace('assets are already up to date', false, false);
								}
						}


					// preload any modules which asked to load immediately
						if(String(manifest.data.preload) == 'true')
						{
							this.load(manifest.data.namespace);
						}

					// return
						return this;
				},

				/**
				 * Runs the module bootstrap to load code locally into the host panel
				 * @param	{String}	namespace	The namespace of the module to initialize
				 */
				load:function(namespace)
				{
					var manifest = manifests[namespace];
					if(manifest)
					{
						xjsfl.file.load(String(manifest.data.uri) + 'jsfl/bootstrap.jsfl');
					}
					else
					{
						throw new Error('xjsfl.modules.load(): there is no module registered under the namespace "' +namespace+ '"');
					}
				},

				/**
				 * Factory method to create an xJSFL module instance
				 * @param	{String}	namespace	The namespace of the module (should match the AS3 and manifest values)
				 * @param	{Object}	properties	The properties of the module
				 * @param	{Window}	window		A reference to the window the function was called from
				 * @returns	{Module}				An xJSFL Module instance
				 */
				create:function(namespace, properties, window)
				{
					// if manifest is not yet loaded (perhaps in development) attempt to initialize the module
						if( ! manifests[namespace])
						{
							this.init(namespace);
						}

					// create module
						try
						{
							// create module
								var module = new xjsfl.classes.cache.Module(namespace, properties, window);

							// register with module and window
								if(module)
								{
									modules[namespace] = module;
									window[namespace] = module;
								}

							// call constructor
								if(window)
								{
									module.init();
								}
								return module;
						}
						catch(err)
						{
							xjsfl.debug.error(err);
						}
				}
			}

			return xjsfl.modules;
		}
	)();


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██████ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// # UI - Global access to XUL UI dialogs

	/**
	 * Global access to XUL UI dialogs
	 * @type {Object}	Description
	 * @class
	 */
	xjsfl.ui =
	{
		dialogs:[],

		/**
		 * Show a new XUL dialog, nesting if one is already shown
		 * @param	{XUL}		xul			A valid XUL object
		 * @returns	{Object}				The settings object from the XMLUI
		 */
		show:function(xul)
		{
			// clear dialogs if there's no current XMLUI
				var xulid = fl.xmlui.get('xulid');
				if(xulid == undefined)
				{
					this.dialogs = [];
				}

			// grab new id
				xul.id			= this.dialogs.length;

			// update XML id placeholders with correct id
				 var xml		= xul
									.xml.prettyPrint()
									.replace(/{xulid}/g, xul.id)
									.replace(/xjsfl.ui.handleEvent\(0,/g, 'xjsfl.ui.handleEvent(' +xul.id+ ',');

			// save XML to dialog.xml
				var uri			= xul.uri || xjsfl.uri + 'core/ui/dialog.xul';
				if(FLfile.exists(uri))
				{
					FLfile.setAttributes(uri, 'W');
				}
				FLfile.write(uri, xml);

			// register XUL
				this.dialogs.push(xul);

			// debug
				xjsfl.output.log('Showing XUL dialog "' +xul.title+ '"');

			// show
				var settings = fl.xmlPanel(uri);

			// unregister
				this.dialogs.pop();

			// debug
				//Output.inspect(settings);

			// return settings
				return settings;
		},

		handleEvent:function(xulid, type, id)
		{
			var dialog = this.dialogs[xulid];
			if(dialog)
			{
				dialog.handleEvent(type, id);
			}
		},

		getFlashData:function()
		{
			var xul = this.dialogs[this.dialogs.length - 1];
			return xul ? xul.flashData : null;
		},

		setFlashData:function(data)
		{
			var xul = this.dialogs[this.dialogs.length - 1];
			xul ? xul.flashData = data: null;
		},

	}


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                    ██
//  ██                        ██
//  ██     ██ ██ █████ █████ █████ █████
//  █████  ██ ██ ██ ██ ██ ██  ██   ██
//  ██     ██ ██ █████ ██ ██  ██   █████
//  ██      ███  ██    ██ ██  ██      ██
//  ██████  ███  █████ ██ ██  ████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Events

	// add events stub. event code will be added in core/jsfl/libraries/events.jsfl
		if( ! xjsfl.events )
		{
			xjsfl.events =
			{
				/**
				 * Add an event handler function for a particular event type
				 * @param	{String}	type		A String Event constant
				 * @param	{Function}	callback	A callback function to be fired when the event happens
				 * @param	{String}	name		A named id with which to get, delete or overwrite the callback
				 * @param	{Object}	scope		An optional scope in which to call the callback function
				 */
				add:function(type, callback, name, scope){},
				
				/**
				 * Remove an event handler function for a single or all event types
				 * @param	{String}	type		A String Event constant
				 * @param	{String}	name		The supplied name of a previously-registered callback
				 */
				remove:function(type, name){},
				
				/**
				 * Remove all event handler functions for a single, or all event types
				 * @param	{String}	type	An optional String Event constant
				 */
				removeAll:function(type){},
				
				/**
				 * Get a reference to an event handler function for an event type
				 * @param	{String}	type		A String Event constant
				 * @param	{String}	name		A name of a previously-registered callback
				 * @returns	{Function}				An event handler function or null if it doesn't exist
				 */
				get:function(type, name){}
			};
		}


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██       ██  ██   ██       ██ ██
//  ██           ██            ██
//  ██ █████ ██ █████ ██ █████ ██ ██ ████ █████
//  ██ ██ ██ ██  ██   ██    ██ ██ ██   ██ ██ ██
//  ██ ██ ██ ██  ██   ██ █████ ██ ██  ██  █████
//  ██ ██ ██ ██  ██   ██ ██ ██ ██ ██ ██   ██
//  ██ ██ ██ ██  ████ ██ █████ ██ ██ ████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// # Initialisation - Functions to initialize and reload the framework

	/**
	 * Final setup
	 */
	(function toString()
	{
		// These properties are assigned using extend, to remain hidden from Komodo's code-intelligence
			var props =
			{
				toString:function(){ return '[object xJSFL]'; }
			};
			for(var prop in props)
			{
				xjsfl[prop] = props[prop];
			};
	})()

	/**
	 * Initialize the environment by extracting variables / objects / functions to global scope
	 * @param	{Object}	scope			The scope into which the framework should be extracted
	 * @param	{String}	$scopeName		An optional id, which when supplied, traces a short message to the Output panel
	 * @param	{Array}		$classes		An optional Array of classes to load
	 */
	xjsfl.init = function(scope, $scopeName, $classes)
	{
		// parameter shift
			var scopeName	= '';
			var classes		= [];
			for each(var param in [$scopeName, $classes])
			{
				if(typeof param === 'string')
					scopeName = param;
				if(param instanceof Array)
					classes = param;
			}

		// if classes were specified, and search paths have been initialized, attempt to load classes
			if( ! xjsfl.halted )
			{
				var paths = xjsfl.settings.searchPaths.get();
				if(paths.length && classes.length)
				{
					// only reload classes if xJSFL is NOT loading, and the current file stack 
					// length is 0 (so nested classes don't xjsfl.init() and reload their classes)
					xjsfl.classes.load(classes, ! xjsfl.loading && xjsfl.file.stack.length == 0);
				}
			}

		// only initialize if not loading
			if( ! xjsfl.loading )
			{
				// debug
					if(scopeName)
					{
						xjsfl.output.trace('initializing [' +scopeName+ ']', 1);
					}

				// set flags
					xjsfl.file.stackLimit	= 99;

				// copy core variables and functions into scope
					xjsfl.initVars(scope);

				// copy registered classes into scope
					xjsfl.classes.restore(scope);

				// flag xJSFL initialized by setting a scope-level variable (xJSFL, not xjsfl)
					scope.xJSFL = xjsfl;
			}

	}


