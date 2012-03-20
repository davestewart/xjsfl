	/**
	 * Create global variables and functions in supplied scope
	 * @param	scope		{Object}	The scope into which the framework should be extracted
	 * @param	scopeName	{String}	An optional scopeName, which when supplied, traces a short message to the Output panel
	 * @returns
	 */
	xjsfl.initGlobals = function(scope, scopeName)
	{
		// initialize only if core $dom method is not yet defined
			if(typeof scope.$dom === 'undefined')
			{
				// ----------------------------------------------------------------------------------------------------
				// debug
				
					if(scopeName)
					{
						xjsfl.output.log('initializing [' +scopeName+ ']');
					}

				// ----------------------------------------------------------------------------------------------------
				// variables
				
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

				// ----------------------------------------------------------------------------------------------------
				// functions
				
					// ------------------------------------------------------------------------------------------------
					// output
					
						/**
						 * Trace arguments to the Output panel
						 * @param {Mixed}	...args		Multiple parameters
						 */
						scope.trace = function()
						{
							fl.outputPanel.trace(Array.slice.call(this, arguments).join(', '))
						};
						
						
						/**
						 * A shortcut to the Output.format() method
						 * @see Utils.format
						 */
						scope.format = function()
						{
							Output.format.apply(this, arguments);
						}

						/**
						 * Clears the Output panel
						 */
						scope.clear = fl.outputPanel.clear;

					
					// ------------------------------------------------------------------------------------------------
					// introspection
					
						/**
						 * A shortcut to the Output inspect() method
						 * @see Output.inspect
						 */
						scope.inspect = function()
						{
							fl.trace('inspect() not yet initialized');
						};
						
						/**
						 * A shortcut to the Output list() method
						 * @see Output.list
						 */
						scope.list = function()
						{
							fl.trace('list() not yet initialized');
						};
						
						/**
						 * A shortcut to the Utils debug() method
						 * @see Utils.debug
						 */
						scope.debug = Utils.debug;
						
						
					// ------------------------------------------------------------------------------------------------
					// file
					
						/**
						 * Loads a class from disk, even if it's already been loaded.
						 * @param	{String}	className	The class filename (without extension) to load
						 * @info							This method accepts multiple arguments
						 */
						scope.require = function(className)
						{
							for (var i = 0; i < arguments.length; i++)
							{
								xjsfl.classes.load(arguments[i], true);
							}
						}

						/**
						 * Loads a file using the xjsfl.file.load() method
						 * @param	{String}	pathOrURI	A valid path or URI
						 * @param	{Boolean}	quiet		An optional Boolean to not trace the load to the Output panel
						 * @returns	{Boolean}				Trie of false, depeneding on whether the file loaded
						 */
						scope.load = function(pathOrURI, quiet)
						{
							return xjsfl.file.load(URI.toURI(pathOrURI, 1), null, quiet);
						}
						
						/**
						 * Saves a file using the xjsfl.file.save() method
						 * @param	{String}	pathOrURI	A valid path or URI
						 * @param	{String}	contents	The contents to save
						 * @returns	{Boolean}				Trie of false, depeneding on whether the file saved
						 */
						scope.save = function(pathOrURI, contents)
						{
							return xjsfl.file.save(URI.toURI(pathOrURI, 1), contents);
						}
						
			}
	}