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
// Module - Base class used to create and manage xJSFL Modules

	// ------------------------------------------------------------------------------------------------
	// Constructor
	
		/**
		 * Base module class used to create xJSFL modules
		 * 
		 * @param 	namespace	{String}	The namespace of the module in the xjsfl.modules object, i.e. "keyframer"
		 * @param 	properties	{object}	The properties and methods of the object. Supply a constructor with "init:function(){ ... }"
		 * @param	panelName	{String}	An optional name for your module, i.e. "Keyframer", defaults to the folder name
		 */
		Module = function(namespace, properties, panelName)
		{
			//TODO replace name with panelName and add new prototype .panel property
			
			// add class properties
				for(var prop in properties)
				{
					this[prop] = properties[prop];
				}
				
			// namespace
				this.namespace	= namespace;
				
			// uri				// grab the folder one level up from the last "/jsfl/" folder
				this.uri		= xjsfl.utils.getStack().pop().uri.replace(/\/jsfl\/.*/, '/')
				
			// name				// default to folder name if unsupplied
				this.name		= panelName || unescape(this.uri.replace(/\/$/, '').split('/').pop());
				
			// panel			// use panel name, or default to folder name if missing
				var panel		= xjsfl.utils.getPanel(panelName || this.name);
				if(panel)
				{
					this.panel = panel;
				}
				
			// register module so the module path is added to global paths before init is called
				xjsfl.modules.register(this);
				
			// call a constructor if provided
				if(this.init)
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
			// core properties
			
			
				/**
				 * @type {String} The namespace of the object in the xjsfl.modules object
				 */
				namespace:	'',
				
				/**
				 * @type {String} The URI to the module's root folder
				 */
				uri:		'',
				
				/**
				 * @type {String} The English name of the module or if it exists, the panel, ie "Keyframer"
				 */
				name:		'',
				
				/**
				 * @type {swfPanel} A reference to the panel, if t exists
				 */
				panel:		null,
				
			// ----------------------------------------------------------------------------------------
			// accessors
			
				/**
				 * @type {String} The shortened path to the module's folder
				 */
				get path(){ return xjsfl.file.makePath(this.uri, true); },
				
				/**
				 * 
				 * @param		
				 * @returns		
				 */
				getWindow:function()
				{
					return window;
				},
			
			// ----------------------------------------------------------------------------------------
			// methods
			
				/**
				 * Get a named module Config object, either a default, or a specific object
				 * @param	configName	{String}	An optional name syntax i.e. "data" to default to "modules/Tools/config/tools data.xml"
				 * @param	configName	{String}	An optional leading-slash syntax i.e. "/cache/data" to reference a specific file: "modules/Tools/config/cache/data.xml"
				 * @returns		
				 */
				loadConfig:function(path)
				{
					return new Config(path || this.namespace);
				},
				
				log:function(message, lineBefore)
				{
					if(lineBefore)
					{
						trace('');
					}
					trace('> ' + this.name + ': ' + message);
				},
			
				toString:function()
				{
					return '[object Module name="' +this.name+ '" path="' +this.path+ '"]';
				}
				
		}
		
		Module.toString = function()
		{
			return '[class Module]';
		}
	
	// ------------------------------------------------------------------------------------------------
	// Register
	
		xjsfl.classes.register('Module', Module);
		
