// ------------------------------------------------------------------------------------------------------------------------
//
//  ██   ██          ██       ██
//  ███ ███          ██       ██
//  ███████ █████ █████ ██ ██ ██ █████
//  ██ █ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██
//  ██   ██ ██ ██ ██ ██ ██ ██ ██ █████
//  ██   ██ ██ ██ ██ ██ ██ ██ ██ ██
//  ██   ██ █████ █████ █████ ██ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Module

	/**
	 * Module
	 * @overview	Base class used to create and manage xJSFL Modules
	 * @instance	module
	 */

	xjsfl.init(this, ['Config', 'URI', 'Utils']);
		
	// ------------------------------------------------------------------------------------------------
	// Constructor

		/**
		 * Base module class used to create xJSFL modules
		 *
		 * @param	{String}	namespace		The namespace of the module in the xjsfl.modules object, i.e. "keyframer"
		 * @param	{object}	properties		The properties and methods of the object. Supply a constructor with "init:function(){ ... }"
		 * @param	{Window}	window			The current window object
		 */
		Module = function(namespace, properties, window)
		{
			// add class properties
				for(var prop in properties)
				{
					this[prop] = properties[prop];
				}

			// load manifest
				this.manifest	= xjsfl.modules.getManifest(namespace);
				if( ! this.manifest)
				{
					throw new Error('Error in Module(): There is no manifest file for the module "' +namespace+ '"');
				}

			// namespace
				this.namespace	= namespace;

			// name
				this.name		= String(this.manifest.meta.name);

			// uri
				this.uri		= String(this.manifest.data.uri);

			// add module path to xjsfl list of search paths
				xjsfl.settings.uris.add(this.uri, 'module');

			// panel
				var panel		= Utils.getPanel(String(this.manifest.data.panel));
				if(panel)
				{
					this.panel = panel;
				}

			// window
				this.getWindow = function()
				{
					return window;
				}

			// call a constructor if provided
				if(this.init && ! window)
				{
					this.init();
				}
		}

	// ------------------------------------------------------------------------------------------------
	// Prototype & static methods

		Module.prototype =
		{
			// reset constructor
				constructor:Module,

			// ----------------------------------------------------------------------------------------
			// # Properties 

				/**
				 * @type {String} The namespace of the module
				 */
				namespace:	'',

				/**
				 * @type {String} The name of the module
				 */
				name:		'',

				/**
				 * @type {String} The URI to the module's root folder
				 */
				uri:		'',

				/**
				 * @type {SWFPanel} A reference to the panel, if it exists
				 */
				panel:		null,
				

			// ----------------------------------------------------------------------------------------
			// # Methods 

				/**
				 * Load a named module Config file object, either a default, or a specific object
				 * @param	{String}	pathOrURI	The absolute or relative path to the config file. Passing a relative file path will attempt to find the file in the cascading file structure, defaulting to //user/config/ModuleName.xml
				 * @returns	{Config}				A new Config instance
				 * @see								Config
				 */
				loadConfig:function(path)
				{
					return new Config(path || this.namespace);
				},

				/**
				 * Calls an externally-registered function in the module's panel. Note that the number of arguments MUST match the registered function
				 * @returns	{Object}	The result of the call
				 * @example				module.call('someFunction', 1, 2, 3);
				 */
				call:function()
				{
					if(this.panel)
					{
						return this.panel.call.apply(this.panel, arguments)
					}
				},

				/**
				 * Log a message to the listener, prefixed with the module's name
				 * @param	{String}	message		The message to log to the listener
				 * @param	{Boolean}	lineBefore	An optional Boolean to trace a blank line before the message
				 */
				log:function(message, lineBefore)
				{
					if(lineBefore)
					{
						trace('');
					}
					trace('> ' + this.name + ': ' + message);
				},

				/**
				 * Gets the Window object of the module
				 * @returns	{Window}	The current window
				 */
				getWindow:function()
				{
					// this method is overwritten in the constructor
				},
				
				/**
				 * Returns a string representation of the module
				 * @returns	{String}
				 */
				toString:function()
				{
					var path = URI.asPath(this.uri);
					return '[object Module name="' +this.name+ '" path="' +path+ '"]';
				}

		}

		Module.toString = function()
		{
			return '[class Module]';
		}

	// ------------------------------------------------------------------------------------------------
	// Register

		xjsfl.classes.register('Module', Module);