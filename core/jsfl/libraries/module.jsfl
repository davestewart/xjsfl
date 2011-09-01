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
		 * @param	folder		{String}	The folder/name of your module, i.e. "Tools/Keyframer"
		 * @param 	namespace	{String}	The namespace of the module in the xjsfl.modules object, i.e. "keyframer"
		 * @param 	properties	{object}	The properties and methods of the object. Supply a constructor with "init:function(){ ... }"
		 */
		Module = function(folder, namespace, properties)
		{
			// add class properties
				for(var prop in properties)
				{
					this[prop] = properties[prop];
				}
				
			// core properties
				this.name		= folder.replace(/\/*$/, '').split('/').pop();
				this.namespace	= namespace.replace(/^xjsfl\.modules\./, '');
				this.uri		= xjsfl.settings.folders.modules + escape(folder) + '/';
				
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
				 * @type {String} The English name of the module, ie "Animation Tools"
				 */
				name:		'',
				
				/**
				 * @type {String} The namespace of the object in the xjsfl.modules object
				 */
				namespace:	'',
				
				/**
				 * @type {String} The URI to the module's folder
				 */
				uri:		'',
				
			// ----------------------------------------------------------------------------------------
			// accessors
			
				/**
				 * @type {String} The shortened path to the module's folder
				 */
				get path(){ return xjsfl.file.makePath(this.uri, true); },
				
			// ----------------------------------------------------------------------------------------
			// methods
			
				/**
				 * Get a named module Config object, either a default, or a specific object
				 * @param	configName	{String}	An optional name syntax i.e. "data" to default to "modules/Tools/config/tools data.xml"
				 * @param	configName	{String}	An optional leading-slash syntax i.e. "/cache/data" to reference a specific file: "modules/Tools/config/cache/data.xml"
				 * @returns		
				 */
				loadConfig:function(configName)
				{
					// default path
						var path = this.name.toLowerCase();
						
					// update if config name supplied
						if(configName)
						{
							if(configName.indexOf('/') != -1)
							{
								path = configName.replace(/^\//, '');
							}
							else
							{
								path = this.name.toLowerCase() + ' ' + configName;
							}
						}
						
					// return config
						return new Config(path);
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
		
		
		
// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.init(this);
			clear();
			try
			{
		
		// --------------------------------------------------------------------------------
		// Test
		
			if(1)
			{
				xjsfl.init(this);
				var module = new Module('Test');
				trace(module);
			}
		
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
