// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██       ██          ██       
//  ██     ██       ██          ██       
//  ██     ██ █████ █████ █████ ██ █████ 
//  ██ ███ ██ ██ ██ ██ ██    ██ ██ ██    
//  ██  ██ ██ ██ ██ ██ ██ █████ ██ █████ 
//  ██  ██ ██ ██ ██ ██ ██ ██ ██ ██    ██ 
//  ██████ ██ █████ █████ █████ ██ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Globals

	/**
	 * Globals
	 * @overview	Framework functions that have been made global
	 */

	xjsfl.init(this, ['Utils', 'URI', 'Output']);
	
	// ----------------------------------------------------------------------------------------------------
	// # Shortcuts
	
		/**
		 * Create global variables in supplied scope
		 * @param	scope		{Object}	The scope into which the vars should be set
		 * @ignore
		 * @returns
		 */
		xjsfl.initVars = function(scope)
		{
			// initialize only if core $dom method is not yet defined
				if(typeof scope.$dom === 'undefined')
				{
					/**
					 * Gets the current Document object
					 * @type	{Document}
					 * @name				$dom
					 */
					scope.__defineGetter__( '$dom', function()
					{
						return fl.getDocumentDOM();
					});
					
					/**
					 * Gets the current Timeline
					 * @type	{Timeline}
					 * @name				$timeline
					 */
					scope.__defineGetter__( '$timeline', function()
					{
						var dom = fl.getDocumentDOM();
						return dom ? dom.getTimeline() : null;
					});
					
					/**
					 * Gets the current Library
					 * @type	{Library}
					 * @name				$library
					 */
					scope.__defineGetter__( '$library', function()
					{
						var dom = fl.getDocumentDOM();
						return dom ? dom.library : null;
					});
					
					/**
					 * Set or get the current selection
					 * @type	{Array}
					 * @name				$selection
					 */
					scope.__defineGetter__( '$selection', function()
					{
						var dom = fl.getDocumentDOM();
						return dom ? dom.selection.reverse() : null;
					});
					
					scope.__defineSetter__( '$selection', function(elements)
					{
						var dom = fl.getDocumentDOM();
						if(dom)
						{
							dom.selectNone();
							dom.selection = elements instanceof Array ? elements : [elements];
						}
					});
				}
		};
	
	
	// ----------------------------------------------------------------------------------------------------
	// functions
	
		// ------------------------------------------------------------------------------------------------
		// # Output functions
		
			/**
			 * Trace arguments to the Output panel
			 * @param {Mixed}	...args		Multiple parameters
			 */
			trace = function trace()
			{
				fl.outputPanel.trace(Array.slice.call(this, arguments).join(', '))
			};
			
			
			/**
			 * Shortcut to String.inject() that populates a template string with values, and traces to the Output panel
			 * @param	{String}	template	A template String containing {placeholder} variables
			 * @param	{Object}	values		Any Object or instance of Class that with named properties
			 * @param	{Array}		values		An Array of values, which replace named placeholders in the order they are found
			 * @param	{Mixed}		...values	Any values, passed in as parameters, which replace named placeholders in the order they are found
			 * @returns	{String}				The populated String
			 */
			format = function format(template, values)
			{
				values = Array.prototype.splice.call(arguments, 1);
				fl.outputPanel.trace(String(template).inject(values));
			}
			
			/**
			 * Clears the Output panel
			 */
			clear = fl.outputPanel.clear;
	
		
		// ------------------------------------------------------------------------------------------------
		// # Introspection functions
		
			/**
			 * A shortcut to the Output inspect() method
			 * @see Output.inspect
			 */
			inspect = function inspect()
			{
				if(xjsfl.classes.cache.Output)
				{
					xjsfl.classes.cache.Output.inspect.apply(this, arguments);
				}
				else
				{
					fl.trace('inspect() not yet initialized');
				}
			};
			
			/**
			 * A shortcut to the Output list() method
			 * @see Output.list
			 */
			list = function list()
			{
				if(xjsfl.classes.cache.Output)
				{
					xjsfl.classes.cache.Output.list.apply(this, arguments);
				}
				else
				{
					fl.trace('list() not yet initialized');
				}
			};
			
			/**
			 * Catch-all wrapper for the xjsfl.debug object
			 * @param	{Error}		obj			A javaScript Error object
			 * @param	{Function}	obj			A function to test
			 * @param	{String}	obj			A URI or path of the file to load and debug
			 * @param	{Array}		params		An Array or arguments to pass to the function
			 * @param	{Object}	scope		An alternative scope to run the function in
			 * @returns	{Value}					The result of the function if successful
			 */
			debug = function debug(obj, params, scope)
			{
				if(obj instanceof Error)
				{
					xjsfl.debug.error(obj);
				}
				else if(typeof obj === 'function')
				{
					xjsfl.debug.func(obj, params, scope);
				}
				else if(typeof obj === 'string')
				{
					xjsfl.debug.file(obj);
				}
			}
			
			
		// ------------------------------------------------------------------------------------------------
		// # Library functions
		
			/**
			 * Loads a class from disk, but only if it's not yet been loaded.
			 * @param	{String}	className	The class filename (without extension) to load
			 * @info							This method accepts multiple arguments
			 */
			include = function include(className)
			{
				xjsfl.classes.load(Array.slice.call(this, arguments));
			}
			
			/**
			 * Loads a class from disk (even if it's already been loaded) but not its dependencies
			 * @param	{String}	className	The class filename (without extension) to load
			 * @info							This method accepts multiple arguments
			 */
			require = function require(className)
			{
				xjsfl.file.stackLimit = 1;
				xjsfl.classes.load(Array.slice.call(this, arguments), true);
				xjsfl.file.stackLimit = 99;
			}
			
		// ------------------------------------------------------------------------------------------------
		// # File functions
		
			/**
			 * Attempts to directly load files, or find and run or return files from the cascading file structure.
			 * Parameters and return type vary depending on file type!
			 *
			 * @param	{String}		pathOrName	The relative or absolute path, or uri to the file
			 * @param	{String}		pathOrName	The name or path fragment to a file, with or without the file extension
			 * @param	{String}		type		The folder type in which to look (i.e. settings) for the file(s)
			 *
			 * @returns	{Boolean}					A Boolean indicating Whether the file was successfully found and loaded
			 * @returns	{XML}						An XML object of the content of the file, if XML
			 * @returns	{String}					The string content of the file otherwise
			 */
			load = function load(pathOrURI, type)
			{
				pathOrURI = type ? pathOrURI : URI.toURI(pathOrURI, 1);
				return xjsfl.file.load(pathOrURI, type);
			}
			
			/**
			 * Saves a file using the xjsfl.file.save() method
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @param	{String}	contents	The contents to save
			 * @returns	{Boolean}				Trie of false, depeneding on whether the file saved
			 */
			save = function save(pathOrURI, contents)
			{
				return xjsfl.file.save(URI.toURI(pathOrURI, 1), contents);
			};

		
	// ------------------------------------------------------------------------------------------------
	// final setup
	
		// register functions
		
			[
				['trace', trace],
				['format', format],
				['clear', clear],
				
				['inspect', inspect],
				['list', list],
				['debug', debug],
				
				['include', include],
				['require', require],
				['save', save],
				['load', load],
				
			].forEach(function(f){xjsfl.classes.register(f[0], f[1]);});
			
			