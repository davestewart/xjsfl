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
					if(prop != 'init')
					{
						this[prop] = properties[prop];
					}
				}
				
			// core properties
				this.name		= name;
				
			// derived properties
				this.uri		= xjsfl.uri + 'modules/' + escape(this.name) + '/';
				var configUri	= xjsfl.uri + 'user/config/';
				
			// instantiate settings and data
				this.settings	= new Config(this.name, 'settings', configUri);
				this.data		= new Config(this.name, 'data', configUri);
				
			// load settings and data
				this.settings.load();
				this.data.load();
		
			// call a constructor if provided
				if(properties && properties.init)
				{
					properties.init.apply(this);
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
				path:		'',
				
			// methods
				settings:	null,
				data:		null,
				
			// accessors
				get key(){ return this.name.toLowerCase().replace(/\W/g, ''); },
				
			// built-in
				toString:function()
				{
					return '[object Module "' +this.name+ '"]';
				}
		}
		
		Module.toString = function()
		{
			return '[class Module]';
		}
	
	// ------------------------------------------------------------------------------------------------
	// Register
	
		xjsfl.classes.register('Module', Module);
		
		
		
	// ------------------------------------------------------------------------------------------------
	// Test code
	
		if( ! xjsfl.file.loading)
		{
			xjsfl.init(this);
			var module = new Module('Test');
		}
