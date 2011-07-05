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
		 * @param	user		{boolean}	Don't use this! It's reserved for core framework modules only
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
				this.uri		= xjsfl.uri + 'modules/' + escape(this.name) + '/';
				
			// register module so the module path is added to global paths before config is created
				xjsfl.modules.register(this);
				
			// instantiate settings and data
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
			
			// core properties
				name:		'',
				uri:		'',
				
			// methods
				settings:	null,
				data:		null,
				
			// accessors
				get key(){ return this.name.toLowerCase().replace(/\W/g, ''); },
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
