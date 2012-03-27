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
		// # File-related functions
		
			/**
			 * Loads a class from disk, but only if it's not yet been loaded.
			 * @param	{String}	className	The class filename (without extension) to load
			 * @info							This method accepts multiple arguments
			 */
			function include(className)
			{
				xjsfl.classes.load(Array.slice.call(this, arguments), arguments);
			}
			
			/**
			 * Loads a class from disk, even if it's already been loaded.
			 * @param	{String}	className	The class filename (without extension) to load
			 * @info							This method accepts multiple arguments
			 */
			function require(className)
			{
				xjsfl.file.stackLimit = 1;
				xjsfl.classes.load(Array.slice.call(this, arguments), true);
				xjsfl.file.stackLimit = 99;
			}
			
			/**
			 * Loads a file using the xjsfl.file.load() method
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @param	{Boolean}	quiet		An optional Boolean to not trace the load to the Output panel
			 * @returns	{Boolean}				Trie of false, depeneding on whether the file loaded
			 */
			function load(pathOrURI, quiet)
			{
				return xjsfl.file.load(URI.toURI(pathOrURI, 1), null, quiet);
			}
			
			/**
			 * Saves a file using the xjsfl.file.save() method
			 * @param	{String}	pathOrURI	A valid path or URI
			 * @param	{String}	contents	The contents to save
			 * @returns	{Boolean}				Trie of false, depeneding on whether the file saved
			 */
			function save(pathOrURI, contents)
			{
				return xjsfl.file.save(URI.toURI(pathOrURI, 1), contents);
			};
			
			
		// ------------------------------------------------------------------------------------------------
		// # Output functions
		
			/**
			 * Trace arguments to the Output panel
			 * @param {Mixed}	...args		Multiple parameters
			 */
			function trace()
			{
				fl.outputPanel.trace(Array.slice.call(this, arguments).join(', '))
			};
			
			
			/**
			 * A shortcut to the Output.format() method
			 * @see Utils.format
			 */
			function format()
			{
				if(Output && Output.format)
				{
					Output.format.apply(this, arguments);
				}
				else
				{
					trace('format() not yet initialised');
				}
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
			function inspect()
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
			function list()
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
			function debug(obj, params, scope)
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
			
