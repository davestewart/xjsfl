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
		 * Config class, loads and saves XML from the config folders
		 * 
		 * @param	configPath	{String}	The absolute or relative path to the config file. Passing a relative file path will attempt to find the file in the cascading file structure, defaulting to user/config/
		 * @param	xml			{XML}		An XMl object with which to populate the Config instance
		 * @author	Dave Stewart	
		 */
		Config = function(configPath, xml)
		{
			// absolute uri
				if(configPath.indexOf('file:') == 0)
				{
					var uri = configPath;
				}
				
			// relative uri - find in paths
				else
				{
					// find in paths
						var uri	= xjsfl.file.find('config', configPath);
						
					// fall back to user config if module or user config doesn't exist
					//TODO decide if this is what we want. Should null configs be allowed?
						if(uri == null)
						{
							uri = xjsfl.file.makeURI('user/config/' + configPath + '.xml');
						}
				}
				
			// file
				this.file	= new File(uri);
				
			// if data is passed in, save
				if(xml)
				{
					this.xml = xml;
					this.save();
				}

			// if not, load if file exists
				else if(this.file.exists)
				{
					this.load();
				}
				
			// otherwise, just initialize XML
				else
				{
					this.clear();
				}
					
		}
		
	// ------------------------------------------------------------------------------------------------
	// Prototype
	
		Config.prototype =
		{
			xml:	null,
			file:	null,
			
			constructor:Config,
			
			/**
			 * Sets data on the wrapped XML data
			 * Yeah, yeah, so it uses eval. It allows us to set attributes and nested nodes in one go, so I'm using it!
			 * @param	path	{String}	A dot-notation path to a node or attribute
			 * @param	value	{Value}		Any value that can be converted to a string
			 * @returns			{Config}	The current Config node
			 */
			set:function(path, value)
			{
				// grab nodes
					var parts		= path.split('.')
					var nodeName	= parts.pop();
					var parent		= parts.length ? eval('this.xml.' + parts.join('.')) : this.xml;
					var node		= eval('this.xml.' + path);
					
				// delete any existing childnodes
					if(node.length())
					{
						node.setChildren(new XMLList());
					}
					
				// treat differently, depending on datatype
					switch(typeof value)
					{
						case 'boolean':
						case 'number':
						case 'string':
							parent[nodeName] = value;
						break;
					
						case 'xml':
							node[nodeName] += value
						break;
					
						default:
							node[nodeName] += new XML('<![CDATA[' + String(value) + ']]>');
					}
					
				// save
					this.save();
					
				// return
					return this
			},
			
			/**
			 * Gets the value of the specified node path
			 * @param	path	{Srting}	A dot-notation path to a node or attribute
			 * @param	parse	{Boolean}	A Boolean flag indicating that you want to parse the value to the currect datatype
			 * @param	test	{Boolean}	A Boolean flag to test the path exists, but trap and return an Error object if not
			 * @returns			{value}		The value of the node / attribute
			 */
			get:function(path, parse, test)
			{
				if(test !== false)
				{
					try{
						var value = eval('this.xml.' + path);
					}
					catch(err)
					{
						return new Error('The property "' +path+ '" does not exist');
					}
				}
				else
				{
					var value = eval('this.xml.' + path);
				}
				return parse === false ? value : xjsfl.utils.parseValue(value);
			},
			
			/**
			 * Loads the XML config from disk
			 * @returns			{Config}	The current Config node
			 */
			load:function()
			{
				this.xml = new XML(this.file.contents);
				return this;
			},
			
			/**
			 * Saves the internal XML to disk
			 * @returns			{Config}	The current Config node
			 */
			save:function()
			{
				var xml = this.xml.toXMLString().replace(/ {2}/g, '\t').replace(/\n/g, xjsfl.settings.newLine);
				this.file.write(xml);
				return this;
			},
			
			/**
			 * Clears all nodes inside the internal XML
			 * @returns			{Config}	The current Config node
			 */
			clear:function()
			{
				var matches = this.file.uri.match(/(\w+)\/[^\/]+$/);
				var name	= matches ? matches[1] : 'config';
				this.xml	= <{name} />;
				return this;
			},
			
			/**
			 * Returns either a standard String summary of the Config item or the pretty-printed XML contents
			 * @param	asXML	{Boolean}		An optional flag to return the XML String
			 * @returns			{String}		The standard String summary of the Config instance
			 * @returns			{String}		The pretty-printed XML contents
			 */
			toString:function(asXML)
			{
				var path	= this.file ? xjsfl.file.makePath(this.file.uri, true) : '';
				var nodes	= this.xml ? this.xml.*.length() : 0;
				return asXML ? this.xml.toXMLString() : '[object Config path="' +path+ '" nodes=' +nodes+ ']';
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
		// Create a test config item, but don't save
		
			if(0)
			{
				var config = new Config('settings/test')
				trace(config);
			}
			
		// --------------------------------------------------------------------------------
		// Create a test config item, and set some data
		
			if(0)
			{
				var config = new Config('settings/test');
				config
					.clear()
					.set('@id', 1)						// root-level attribute (number)
					.set('app', 'xJSFL')				// root-level node (string)
					.set('long.path.to.value', 'Hello')	// compound path

				trace(config.toString(true));
			}
		
		// --------------------------------------------------------------------------------
		// Create a test config item, and attempt to pass in various datatypes
		
			if(0)
			{
				var config = new Config('settings/test');
				config
					.clear()
					.set('string', '"Hello"')
					.set('illegalstring', '<Hello>')
					.set('number', 1)
					.set('boolean', true)
					.set('xml', <name>Dave</name>)
					.set('xmllist', new XMLList('<icon id="1" /><icon id="2" /><icon id="3" />'))
					.set('date', new Date())
					.set('class', new Config(''))
					.set('array', [1,2,3,4,5])
				
				trace(config.toString(true));
			}
		
		// --------------------------------------------------------------------------------
		// Read values from config
		
			if(0)
			{
				var config = new Config('settings/test');
				config
					.clear()
					.set('some.setting.@id', 'Hello')
					
				trace(config.toString(true));
				trace(config.get('some.setting.@id'));
			}
		
		// --------------------------------------------------------------------------------
		// Read parsed values from config
		
			if(0)
			{
				var config = new Config('settings/test');
				config
					.clear()
					.set('five', 5)
					.set('four', 4)
					
				trace(config.toString(true));
				trace('product is: ' + config.get('five') * config.get('four'));
			}
		
		// --------------------------------------------------------------------------------
		// Test that a value exists when getting
		
			if(0)
			{
				var config = new Config('settings/test');
				config.clear()
					
				var value = config.get('this.setting.does.not.exist');
				if(value instanceof Error)
				{
					trace('Oh no! ' + value);
				}
			}
		
		// --------------------------------------------------------------------------------
		// Clear the loaded config
		
			if(0)
			{
				var config = new Config('settings/test');
				config.clear()
				trace(config.toString(true));
			}
		

		
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
		
