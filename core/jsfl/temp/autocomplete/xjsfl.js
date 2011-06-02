// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                    ██                     ██              
//  ██                        ██                     ██              
//  ██     █████ █████ █████ █████ ████ ██ ██ █████ █████ █████ ████ 
//  ██     ██ ██ ██ ██ ██     ██   ██   ██ ██ ██     ██   ██ ██ ██   
//  ██     ██ ██ ██ ██ █████  ██   ██   ██ ██ ██     ██   ██ ██ ██   
//  ██     ██ ██ ██ ██    ██  ██   ██   ██ ██ ██     ██   ██ ██ ██   
//  ██████ █████ ██ ██ █████  ████ ██   █████ █████  ████ █████ ██   
//
// ------------------------------------------------------------------------------------------------------------------------
// Constructor

	xjsfl = window.xjsfl = xjsfl = function (selector)
	{
		return xjsfl.elements(selector);
	}
		
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██               
//  ██            ██               
//  ██     █████ █████ ██ ██ █████ 
//  ██████ ██ ██  ██   ██ ██ ██ ██ 
//      ██ █████  ██   ██ ██ ██ ██ 
//      ██ ██     ██   ██ ██ ██ ██ 
//  ██████ █████  ████ █████ █████ 
//                           ██    
//                           ██    
//
// ------------------------------------------------------------------------------------------------------------------------
// Setup

	// root uri
		xjsfl.uri		= xjsfl.uri; // fl.scriptURI.substring(0, fl.scriptURI.lastIndexOf('/xJSFL/')) + '/xJSFL/';
		
	// temp variable for framework setup
		xjsflPath		= FLfile.uriToPlatformPath(xjsfl.uri).replace(/\\/g, '/');
		
	// temp output object, needed before libraries are loaded
		if(!xjsfl.settings)
		{
			xjsfl.settings	= {debugLevel:(window['debugLevel'] != undefined ? debugLevel : 1)};
			xjsfl.output =
			{
				trace: function(message){ if(xjsfl.settings.debugLevel > 0)fl.trace('> ' + message); },
				error: function(message){ fl.trace('<< ' + message + ' >>'); }
			}
		}

	 // if pre-CS4, extend FLfile to add platform to uri conversion (needs to be loaded in advance because of various file / path operations during setup)
		if( (! FLfile) || (! FLfile['platformPathToURI']) )
		{
			var path = 'core/jsfl/lib/FLfile.jsfl';
			fl.runScript(xjsfl.uri + path);
			xjsfl.output.trace('Loaded "<xJSFL>/' +path+ '"');
		}
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██  ██   ██ ██       
//  ██  ██  ██      ██       
//  ██  ██ █████ ██ ██ █████ 
//  ██  ██  ██   ██ ██ ██    
//  ██  ██  ██   ██ ██ █████ 
//  ██  ██  ██   ██ ██    ██ 
//  ██████  ████ ██ ██ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Utils

	/**
	 * Miscellaneous utility functions
	 */
	xjsfl.utils =
	{
		
		/**
		 * Converts back-slashes to forward-slashes, as Windows machines use back-slashes by default
		 * @param path {String} The path to convert
		 */
		tidyPath:function(path)
		{
			return path.replace(/\\/g, '/');
		},

		/**
		 * Checks if the object is an array or not
		 * @param obj {Object} Any object that needs to be checked if it's a true Array
		 * @returns {Boolean} True or false
		 */
		isArray:function (obj)
		{
			return toString.call(obj) === "[object Array]";
		},
		
		/**
		 * Extends an object or array with more properties or elements
		 * @param obj {Object|Array} The source object or array to be extended
		 * @param props {Object|Array} The properties or elements to be added
		 * @returns {Object|Array} Returns the modified object or array
		 */
		extend:function(obj, props)
		{
			// variables
				var prop;
				
			// extend array
				if(xjsfl.utils.isArray(obj) && xjsfl.utils.isArray(props))
				{
					for(var i = 0; i < props.length; i++)
					{
						obj.push(props[i]);
					}
				}
			
			// extend object
				else if (typeof props === "object")
				{
					for(prop in props)
					{
						if(props[prop] != undefined)
						{
							obj[prop] = props[prop];
						}
					}
				}
				
			// return
				return obj;
		},
		
		/**
		 * Returns a platform agnostic URI from a platform specific path
		 * Creates relative paths from the config directory, but leaves absolute paths as is
		 * @param path {String} The relative path of the file to be found
		 * @param root {String} An optional root path to the file (defaults to the config directory)
		 * @returns {String} The file URI-formatted path, i.e file:///c|/path/to/file.jsfl
		 */
		getUri:function(path, root)
		{
			root = root || xjsfl.settings.folders.root;
			if( ! xjsfl.utils.isAbsolute(path))
			{
				path = root + path;
			}
			path = path.replace(/\\/g, '/')
			return FLfile.platformPathToURI(path);
		},
		
		createPath:function()
		{
			// dummy
		},
		
		/**
		 * Convert a path to a uri
		 * @param {string} path	
		 * @returns	{string} The path in uri format
		 * @author	Dave Stewart	
		 */
		toUri:function(path)
		{
			return FLfile.platformPathToURI(path);
		},
		
		/**
		 * Checks if a path is absolute or not
		 * @param path {String} The path to the file
		 * @returns {Boolean} True (absolute) or False (relative)
		 */
		isAbsolute:function(path)
		{
			if(xjsfl.settings.platform == 'mac')
			{
				return path.substr(0, 1).replace('\\', '/') == '/';
			}
			else
			{
				return path.match(/^[A-Z]:/i);
			}
		},
		
		
		/**
		 * Tests if a supplied path is a filename
		 * @param path {String} A file path
		 */
		isFilename:function(path)
		{
			return /\/.+\..+$/.test(path);
		},
		
		/**
		 * Gets the path of the file relative to the core JSFL script
		 * @param file {String} A full path
		 * @returns {String} A filepath of the format <xJSFL>/path/to/file.jsfl
		 */
		getRootRelativePath:function(file)
		{
			return FLfile.uriToPlatformPath(file).replace(/\\/g, '/').replace(xjsfl.settings.folders.root, '<xJSFL>/');
		},
		
		/**
		 * Gets the path of the file relative to the core JSFL script
		 * @param file {String} A full path
		 * @returns {String} A filepath
		 */
		getRelativeFilePath:function(file)
		{
			return FLfile.uriToPlatformPath(file).replace(FLfile.uriToPlatformPath(this.folder), '');
		},
		
		/**
		 * Gets the relative path of the currently-running script
		 * @returns {String} A filepath
		 */
		getScriptPath:function()
		{
			return xjsfl.utils.getRelativeFilePath(fl.scriptURI);
		},
		
		/**
		 * Returns an array of files / line-numbers executing at the current time
		 */
		getStack:function(output)
		{
			/** @type {Error} */
			var error = new Error('Stack Trace');
			inspect(error);
		}
		
	}
	

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                       ██████        ██    ██   ██                   
//  ██                           ██            ██    ██                        
//  ██     █████ ████ █████      ██     █████ █████ █████ ██ █████ █████ █████ 
//  ██     ██ ██ ██   ██ ██      ██████ ██ ██  ██    ██   ██ ██ ██ ██ ██ ██    
//  ██     ██ ██ ██   █████          ██ █████  ██    ██   ██ ██ ██ ██ ██ █████ 
//  ██     ██ ██ ██   ██             ██ ██     ██    ██   ██ ██ ██ ██ ██    ██ 
//  ██████ █████ ██   █████      ██████ █████  ████  ████ ██ ██ ██ █████ █████ 
//                                                                    ██       
//                                                                 █████       
//
// ------------------------------------------------------------------------------------------------------------------------
// Core Settings

	/**
	 * Core settings and cached variables
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
				
			// the integer version of Flash
				version:	parseInt(fl.version.match(/\w+ (\d+)/)[1]),
				
			// the product name of flash, i.e. CS4
				name:		(
								function()
								{
									var version = fl.version.match(/\w+ (\d+)/)[1];
									var name = {'7':'MX2004','8':'8', '9':'CS3','10':'CS4', '11':'CS5', '12':'CS6'};
									return name[version] || 'Unknown';
								}
							)()
		},
	
		/**
		 * Folders
		 * The common folders which developers may wish to reference from within scripts or plugins
		 */
		folders:
		{
			root:		xjsflPath,
			user:		xjsflPath + 'user/',
			modules:	xjsflPath + 'modules/',
			core:		xjsflPath + 'core/',
			flash:		xjsfl.utils.tidyPath(fl.configDirectory),
			swf:		xjsfl.utils.tidyPath(fl.configDirectory + 'WindowSWF/')
		},

		/**
		 * Search paths
		 * A cache of paths which xJSFL searches in reverse order when loading files
		 */
		paths:
		{
			// properties
				user:		[ ],	// <path/to/folder>
				module:		[ ],	// <modulename>
				core:		[ ],	// xjsfl.settings.folders.xjsfl
				
			// methods
				add:		function(path, type)
				{
					type = type || 'user';
					path = path.replace(/[\/]+$/g, '') + '/';
					if(type == 'module')
					{
						path = xjsfl.settings.folders.root + 'modules/' + path
					}
					this[type].push(path);
				}
		},
			
		/**
		 * loaded files
		 * An internal cache which stores which file paths have been loaded, so they aren't loaded twice
		 */
		loadedFiles:
		{
			files:[	],
			set:function(uri){ this.files.push(uri);},
			get:function(uri){ return this.files.indexOf(uri) != -1; }
		},
		
		/**
		 * Debug level
		 * Can be set by the developer to either trace or alert framework errors and warnings
		 * @type {Number} debug level 0: off, 1:trace, 2:alert
		 */
		debugLevel:(window['debugLevel'] != undefined ? debugLevel : 1)
			
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
// File
	
	/**
	 * framework-specific file functionality
	 */
	xjsfl.file =
	{
		/**
		 * Finds files within the cascading file system
		 * @param path {String} A relative (from the config directory) or absolute path to a file
		 * @returns {String|Array|null} A string path if the file is found, or a bull value if not. If a path is not found, the system throws an error
		 */
		find:function(filePath)
		{
			// variables
				var uris = [];
				var folderPaths = []
				
			// if path is absolute, grab a single empty path
				if(xjsfl.utils.isAbsolute(filePath))
				{
					folderPaths = [''];
				}
				
			// if path is relative, collect all source paths into a single array
				else
				{
					for each(var type in ['user','modules','core'])
					{
						for(var i = 0; i < xjsfl.settings.paths[type].length; i++)
						{
							folderPaths.push(xjsfl.settings.paths[type][i]);
						}
					}
				}
				
			// if a library name was passed in, instead of a path, convert it to a proper library file path
				if(filePath.match(/^[\w_-/ ]+$/))
				{
					filePath = 'jsfl/' + filePath + '.jsfl';
				}
			
			// attempt all paths if relative
				for(var i = 0; i < folderPaths.length; i++)
				{
					var uri = xjsfl.utils.getUri(filePath, folderPaths[i]);
					if(FLfile.exists(uri))
					{
						return uri;
					}
					else
					{
						uris.push(xjsfl.utils.getRootRelativePath(uri));
					}
				}
				
			// file not found,so add the error to the stack and return null
				xjsfl.output.error('File "' +filePath+ '" not found in search paths', {'attempted filepaths':uris});
				return null;
		},
		
		/**
		 * Attempts to find and run a script (jsfl) file from the cascading file structure.
		 * @param file {String|Array} The relative or absolute path to the file, a name of a library without the file extension, or a comma-delimited list of the previous
		 * @param catchErrors {Boolean} An optional switch to read and eval file contents which traps errors
		 * @param reload {Boolean} An optional switch to force a reload of the file. Normally, paths are cached and limited to being loaded only once
		 * @returns {Boolean} A Boolean indicating Whether the file was successfully found and loaded
		 */
		load:function (file, catchErrors, reload)
		{
			// test for multiple files and recursively load if so
				if(file.indexOf(',') != -1)
				{
					var files = file.replace(/^\s+|\s+$/g, '').split(/\s*,\s*/);
					for(var i = 0; i < files.length; i++)
					{
						xjsfl.file.load(files[i], catchErrors, reload);
					}
				}
				
			// if not, attempt to load file
				else
				{
					// find the file
						var uri = xjsfl.file.find(file);
						
						//trace('file: ' + file)
						//trace('uri: ' + uri)
						
					// if the file is found and not already loaded, attempt to load it
						if(uri !== null && (reload || !xjsfl.settings.loadedFiles.get(uri) ))
						{
							// variables
								var strFilePath	= '"' + xjsfl.utils.getRootRelativePath(uri) + '"';
							
							// read file and perform an eval. Slower(?) but gives some idea if/where errors are occurring
								if(catchErrors)
								{
									try
									{
										var str = FLfile.read(uri);
										eval(str);
										xjsfl.output.trace('Executed: ' +strFilePath);
										xjsfl.settings.loadedFiles.set(uri);
										return true;
									}
									catch(err)
									{
										xjsfl.output.error('The file ' +strFilePath+ ' could not be executed');
										return false;
									}
								}
			
							// otherwise, simply run the file
								else
								{
									fl.runScript(uri);
									xjsfl.output.trace('Loaded ' + strFilePath);
									xjsfl.settings.loadedFiles.set(uri);
								}
						}
				}

				
			// return
				return this;
		},
		
		/**
		 * Loads all JSFL filesfrom the given folder
		 * @param path {String} A string path to the folder
		 */
		loadFolder:function(path)
		{
			// grab files
				var files = FLfile.listFolder(FLfile.platformPathToURI(path), 'files');
				if(files)
				{
					for(var file in files)
					{
						//xjsfl.file.load(path + file);
						trace(files.propertyIsEnumerable(file))
					}
				}
				
			// return
				return this;
			
		},
		
		loadLib:function (libName)
		{
			
		},
		
		/**
		 * Attempts to read a file or folder
		 * @param path {String} The relative or absolute path to the file or folder
		 * @returns {String|Array|null} Returns the contents of the specified file or folder if it exists or null if the read fails
		 */
		read:function (path)
		{
			if(! xjsfl.utils.isFilename(path))
			{
				return FLfile.exists(path) ? FLfile.listFolder(path) : null;
			}
			else
			{
				var uri = xjsfl.file.find(path);
				if(uri !== false)
				{
					return FLfile.read(uri);
				}
			}
			return null;
		}

	}
	
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██                ██   
//  ██  ██        ██                ██   
//  ██  ██ ██ ██ █████ █████ ██ ██ █████ 
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██████ █████  ████ █████ █████  ████ 
//                     ██                
//                     ██                
//
// ------------------------------------------------------------------------------------------------------------------------
// Output

	/**
	 * A collection of useful output methods
	 */
	xjsfl.output =
	{
		/**
		 * Upgraded trace function that takes multiple arguments
		 * @param args {Object} Multiple arguments
		 */
		trace:function()
		{
			//trace('>>' + xjsfl.settings.debugLevel)
			if(xjsfl.settings.debugLevel > 0)
			{
				fl.trace('> xjsfl: ' + Array.prototype.slice.call(arguments).join(', '));
			}
		},
		
		/**
		 * Output object in hierarchical format
		 * @param obj {Object} Any object
		 * @param label {String} An optional label or information to be printed to the Output panel
		 * @param maxDepth {Number} an optional max depth to recurse to. Needed to limit recursive objects
		 */
		inspect:function(obj, label, maxDepth)
		{
			return window['Output'] ? Output.inspect(obj, label, maxDepth) : ! this.trace('The Output class has not yet been loaded');
		},
		
		/**
		 * Issue a warning to the user
		 * @param message {String} The message to be displayed
		 * @param debugLevel {Number} 1 traces the message to the output panel, 2 shows the alert dialog
		 */
		warn:function(message)
		{
			xjsfl.output.error(message);
			if(xjsfl.settings.debugLevel > 0)
			{
				fl.trace('Warning: ' + message);
			}
			if(xjsfl.settings.debugLevel > 1)
			{
				alert(message);
			}
		},

		/**
		 * Traces a human-readable error to the Output Panel
		 * @param message	{String} A string defining the main error message
		 * @param message	{Error} A JavaScript Error object
		 * @param data		{Object} An optional Object contaiing key:value pairs of extra information
		 */
		error:function(message, data)
		{
			// generate error
				err = new Error(message);
			
			// variables
				var rxStack			= /^(.*?)@(.*?):(\d+)$/gim;
				var rxStackLine		= /(.*?)@(.*?):(\d+)/;
				var stack			= err.stack ? err.stack.match(rxStack) : [];
				
			// convert stack trace
				for(var i = 0; i < stack.length; i++)
				{
					var matches = stack[i].match(rxStackLine);
					stack[i] =
					{
						code:matches[1] || '',
						file:matches[2] || '',
						line:parseInt(matches[3]) || ''
					}
					
					stack[i].file = stack[i].file.replace(/\\/g, '/').replace(xjsfl.settings.folders.root, 'xJSFL/');
					
				}
				stack = stack.slice(2);
				
			// add any extra data
				data = xjsfl.utils.extend( { message:err.message, stack:stack }, data || {});
				
			// output
				xjsfl.output.inspect(data, err.name)
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
// Classes

	/**
	 * Mechanism to store and retrieve classes between external JSFL file executions
	 */
	xjsfl.classes =
	{
		items:{},
		
		/**
		 * Registers a class for later retrieval
		 * @param	name	The name of the class to register
		 * @param	obj		The actual class
		 * @returns	The original class
		 */
		register:function(name, obj)
		{
			xjsfl.classes.items[name] = obj;
			return obj;
		},
		
		/**
		 * Restores a class to the 
		 * @param	name	{string}	The name of the class to restore
		 * @param	scope	{Object}	The scope to which teh class should be restored to
		 */
		restore:function(name, scope)
		{
			// restore all classes
				if(typeof name != 'string')
				{
					scope = name;
					for (var name in xjsfl.classes.items)
					{
						xjsfl.classes.restore(name, scope);
					}	
				}
				
			// restore only one class
				else
				{
					scope = scope || window;
					scope[name] = xjsfl.classes.items[name];
				}
		}
	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████              ██                ██   
//  ██                  ██                ██   
//  ██     █████ █████ █████ █████ ██ ██ █████ 
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██     ██ ██ ██ ██  ██   █████  ███   ██   
//  ██     ██ ██ ██ ██  ██   ██    ██ ██  ██   
//  ██████ █████ ██ ██  ████ █████ ██ ██  ████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Context

		/*
			Checks:
			document open		true
			selection			true, 2, 1-3
			elements can be tweened
			library selection	true, 2,
			library selection is folder
			layer is selected
			layers are selected
			custom				fn(callback, failureMessage)
		
			if(check){ ... }
		*/
		
	/**
	 * The context object provides access to, and keeps track of the current document,
	 * timeline, frame, etc that Collection classes need in order to successfully run
	 */
	xjsfl.context =
	{
		get:
		{
			document:function()
			{
				var dom = fl.getDocumentDOM();
				if(dom == null)
				{
					xjsfl.output.warn("A document (.fla file) needs to be open");
				}
				xjsfl.context.dom = dom;
				return dom;
			},
			
			selection:function(fn)
			{
				if(this.document())
				{
					var dom = xjsfl.context.dom;
					var sel = dom.selection;
					if(sel == null)
					{
						xjsfl.output.warn("You need to make a selection first");
					}
				}
				return sel;
			},
			
			itemSelection:function(fn)
			{
				var dom = this.document();
				if(dom)
				{
					var sel = dom.library.getSelectedItems();
					if(sel == null)
					{
						xjsfl.output.warn("You need to make a selection in the library first");
					}
				}
				return sel;
			},
			
			layerSelection:function(fn)
			{
				if(this.document())
				{
					var timeline = this.dom.getTimeline();
					var indices = timeline.getSelectedLayers();
					return indices.map(function(index){return timeline.layers[index]}) || null;
				}
				return null;
			},
			
			frameSelection:function(fn)
			{
				if(this.document())
				{
					return this.dom.getTimeline().getSelectedFrames() || null;
				}
				return null;
			},
			
			elementsCanBeTweened:function(elements)
			{
				return null;
			}

		},
		
		set:function(type, value)
		{
			
		},
		
		clear:function()
		{
			for(var i in this)
			{
				if(typeof this[i] != 'function')
				{
					this[i] = null;
				}
			}
		},
		
		dom:		null,
		item:		null,
		layer:		null,
		frame:		null,
		element:	null
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
// Modules


	/**
	 * A namespace in which to store module code to prevent pollution of global scope
	 */
	xjsfl.modules = {};


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                ██                ██         
//  ██     ██                ██                ██         
//  ██     █████ █████ ████ █████ █████ ██ ██ █████ █████ 
//  ██████ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██   ██    
//      ██ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██   █████ 
//      ██ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██      ██ 
//  ██████ ██ ██ █████ ██    ████ █████ █████  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Shortcuts

	// element selection
	
		var shortcuts =
		{
			/**
			 * Selects elements on the stage
			 * @param selector {Mixed}
			 * @returns {Array} An array of elements
			 */
			elements:function(selector, frameContext)
			{
				var dom = xjsfl.context.get.document(2);
				if(dom)
				{
					dom.selectAll();
					return new ElementCollection(xjsfl.context.get.selection(true));
				}
				return null;
			},
			
			/**
			 * Selects elements on the stage
			 * @param selector {Mixed}
			 * @returns {Array} An array of elements
			 */
			selection:function()
			{
				//return xjsfl.context.get.selection();
				return new ElementCollection(document.selection);
			},
			
			/**
			 * Selects frames within the document
			 * @param selector {Mixed}
			 * @returns {Array} An array of (key)frames
			 */
			frames:function(selector, layerContext)
			{
				var frames = xjsfl.context.get.frameSelection(true);
				if(frames)
				{
					return frames;
				}
				return null;
			}, 
			
			/**
			 * Selects layers within the document
			 * @param selector {Mixed}
			 * @returns {Array} An array of layers
			 */
			layers:function(selector, timelineContext)
			{
				try
				{
					var dom = xjsfl.context.get.document(true);
					if(dom)
					{
						timelineContext = timelineContext || dom.getCurrentTimeline();
						return timelineContext.getSelectedLayers();
					}
					return null;
				}
				catch(err)
				{
					xjsfl.output.error(err);
					return null;
				}
			},
			
			/**
			 * Selects items within the Library
			 * @param selector {Mixed}
			 * @returns {Array} An array of library items
			 */
			items:function(selector, folderContext)
			{
				var dom = xjsfl.context.get.document(true);
				if(dom)
				{
					return dom.library.items;
				}
				return null;
			},
			
			documents:function(selector)
			{
				return fl.documents;
			}
			
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
// Initialize
	
	
	/**
	 * Extracts key variables / objects / functions to global scope for convenience
	 */
	xjsfl.init = function(scope)
	{
		// debug
			xjsfl.output.trace('setting environment variables');
		
		// variables
			scope.dom			= fl.getDocumentDOM();
			scope.xjsfl			= xjsfl;
			scope.$				= xjsfl;
			
		// functions
			scope.trace			= fl.outputPanel.trace;
			scope.clear			= fl.outputPanel.clear;
			
		// methods
			xjsfl.trace			= xjsfl.output.trace;
			scope.load			= xjsfl.file.load;
			scope.include		= xjsfl.file.include;
			scope.inspect		= xjsfl.output.inspect;
			
		// classes
			xjsfl.classes.restore(scope);
	}

	// debug
		//xjsfl.settings.debugLevel = 2;
		
	// set root path
		xjsfl.settings.paths.add(xjsfl.settings.folders.root + 'core/', 'core');
		
	// extend xjsfl with shortcut methods
		xjsfl.utils.extend(xjsfl, shortcuts);

	// debug
		fl.trace('> xjsfl: core loaded OK');
