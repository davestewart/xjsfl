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
		 * @param	name		{string}	The name of your module - this should match the folder path
		 * @param 	properties	{object}	The properties and methods of the object. Supply a constructor with "init:function(){ ... }"
		 * @author	Dave Stewart	
		 */
		Module = function(name, properties)
		{
			// add class properties
				for(var prop in properties)
				{
					this[prop] = properties[prop];
				}
				
			// core properties
				this.name		= name;
				this.uri		= xjsfl.settings.folders.modules + escape(this.name) + '/';
				
			// register module so the module path is added to global paths before config is created
				xjsfl.modules.register(this);
				
			// instantiate default settings and data
				this.settings	= new Config('settings/' + this.key);
				this.data		= new Config('data/' + this.key);
				
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
				 * @type {String} The URI to the module's folder
				 */
				uri:		'',
				
			// ----------------------------------------------------------------------------------------
			// settings and data
			
				/**
				 * @type {Config} The default settings Config object
				 */
				settings:	null,
				
				/**
				 * @type {Config} The default data Config object
				 */
				data:		null,
				
			// ----------------------------------------------------------------------------------------
			// accessors
			
				/**
				 * @type {String} The module's key name in xjsfl.modules, ie "animationtools"
				 */
				get key(){ return this.name.toLowerCase().replace(/\W/g, ''); },
				
				/**
				 * @type {String} The path to the module's folder
				 */
				get path(){ return xjsfl.file.makePath(this.uri, true); },
				
			// methods
				getURI:function(folder, file)
				{
					//TODO update this so it's more intelligent about picking where config files are stored (module or user folders)
					folder	= folder ? folder + '/' : '';
					file	= file || '';
					return this.uri + folder + file;
				},
				
			// built-in
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
