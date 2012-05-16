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

	// includes
		xjsfl.init(this, ['Utils', 'URI', 'Output']);

	// ----------------------------------------------------------------------------------------------------
	// functions
	
		// ------------------------------------------------------------------------------------------------
		// # Library functions
		
			/**
			 * Loads a class from disk, but only if it's not yet been loaded.
			 * @param	{String}	className	The class filename (without extension) to load
			 * @info							This method accepts multiple arguments
			 */
			include = function(className)
			{
				xjsfl.classes.load(Array.slice.call(this, arguments));
			}
			
			/**
			 * Loads a class from disk (even if it's already been loaded) but not its dependencies
			 * @param	{String}	className	The class filename (without extension) to load
			 * @info							This method accepts multiple arguments
			 */
			require = function(className)
			{
				xjsfl.file.stackLimit = 1;
				xjsfl.classes.load(Array.slice.call(this, arguments), true);
				xjsfl.file.stackLimit = 99;
			}
			
		// ------------------------------------------------------------------------------------------------
		// # File functions
		
			/**
			 * Loads a file using the xjsfl.file.load() method
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @param	{Boolean}	quiet		An optional Boolean to not trace the load to the Output panel
			 * @returns	{Boolean}				Trie of false, depeneding on whether the file loaded
			 */
			load = function(pathOrURI, quiet)
			{
				return xjsfl.file.load(URI.toURI(pathOrURI, 1), null, quiet);
			}
			
			/**
			 * Saves a file using the xjsfl.file.save() method
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @param	{String}	contents	The contents to save
			 * @returns	{Boolean}				Trie of false, depeneding on whether the file saved
			 */
			save = function(pathOrURI, contents)
			{
				return xjsfl.file.save(URI.toURI(pathOrURI, 1), contents);
			};
			
			
		// ------------------------------------------------------------------------------------------------
		// # Output functions
		
			/**
			 * Trace arguments to the Output panel
			 * @param {Mixed}	...args		Multiple parameters
			 */
			trace = function()
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
			format = function(template, values)
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
			inspect = function()
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
			list = function()
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
			debug = function(obj, params, scope)
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
			
			
	// ----------------------------------------------------------------------------------------------------
	// # Shortcuts
	
		/**
		 * Create global variables in supplied scope
		 * @param	scope		{Object}	The scope into which the vars should be set
		 * @returns
		 */
		xjsfl.initVars = function(scope)
		{
			// initialize only if core $dom method is not yet defined
				if(typeof scope.$dom === 'undefined')
				{
					/**
					 * Gets the current Document object
					 * @property	{Document}		$dom	The current DOM
					 */
					scope.__defineGetter__( '$dom', function()
					{
						return fl.getDocumentDOM();
					});
					
					/**
					 * Gets the current Timeline
					 * @property	{Timeline}	$timeline	The current Timeline
					 */
					scope.__defineGetter__( '$timeline', function()
					{
						var dom = fl.getDocumentDOM();
						return dom ? dom.getTimeline() : null;
					});
					
					/**
					 * Gets the current Library
					 * @property	{Library}	$library	The current Library
					 */
					scope.__defineGetter__( '$library', function()
					{
						var dom = fl.getDocumentDOM(); return dom ? dom.library : null;
					});
					
					/**
					 * Set or get the current selection
					 * @property	{Array}		$selection	The current selection
					 */
					scope.__defineGetter__( '$selection', function()
					{
						var dom = fl.getDocumentDOM(); return dom ? dom.selection.reverse() : null;
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
			
			