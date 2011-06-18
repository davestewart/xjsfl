// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████              ████ ██       
//  ██                  ██            
//  ██     █████ █████  ██   ██ █████ 
//  ██     ██ ██ ██ ██ █████ ██ ██ ██ 
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ 
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ 
//  ██████ █████ ██ ██  ██   ██ █████ 
//                                 ██ 
//                              █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Config - an object oriented wrapper for easily saving and loading settings

	// ------------------------------------------------------------------------------------------------
	// Constructor
	
		/**
		 * Config class for Modules, loads and saves XML from the config folders
		 * 
		 * @param	name	{String}	The name of your Config object. Include slashes to place in subfolders
		 * @param	type	{String}	An optional type of preference ('settings' or 'data', defaults to 'settings')
		 * @param	path	{Module}	An optional base path (defaults to '<xJSFL>/user/config/')
		 * @author	Dave Stewart	
		 */
		Config = function(name, type, path)
		{
			// uri
				type		= type || 'settings';
				path		= path || xjsfl.uri + 'user/config/';
				this.uri	= path + escape(type.toLowerCase() + '/' + name.toLowerCase()) + '.xml';
				
			// xml
				this.xml	= new XML('<' +type+ '/>');
		}
		
	// ------------------------------------------------------------------------------------------------
	// Prototype
	
		Config.prototype =
		{
			xml:	null,
			uri:	'',
			
			constructor:Config,
		
			load:function()
			{
				var text = new File(this.uri).contents;
				if(text)
				{
					this.xml = new XML(text);
				}
			},
			
			save:function()
			{
				if(this.xml.*.length() > 0)
				{
					var xml		= this.xml.toXMLString().replace(/ {2}/g, '	').replace(/\n/g, xjsfl.settings.newLine);
					var file	= new File(this.uri, xml, true);
					file.save()
				}
			},
			
			toString:function()
			{
				return '[object Config]';
			}
			
		}
		
	// ------------------------------------------------------------------------------------------------
	// Static methods
	
		Config.toString = function()
		{
			return '[class Config]';
		}
		
	// ------------------------------------------------------------------------------------------------
	// register
	
		xjsfl.classes.register('Config', Config);
		
