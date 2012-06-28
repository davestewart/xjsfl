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
// Config

	/**
	 * Config
	 * @overview	An object oriented wrapper for easily saving and loading settings
	 * @instance	config
	 */

	xjsfl.init(this, ['File', 'URI', 'Utils', 'XML']);
		
	// ------------------------------------------------------------------------------------------------
	// Constructor

		/**
		 * Config class, loads and saves XML from the config folders
		 *
		 * @param	{String}	pathOrURI	The relative path to the config file, which will prompt the system to find the file in the cascading file structure, defaulting to user/config/
		 * @param	{String}	pathOrURI	An absolute path to the config file. Th
		 * @param	{XML}		xml			An XML object with which to populate the Config instance
		 * @param	{Boolean}	autosave	An optional Boolean to not save the XML when updates are made via set()
		 */
		Config = function(pathOrURI, xml, autosave)
		{
			// ----------------------------------------------------------------------------------------------------
			// resolve the URI
			
				// variable
					var uri;
			
				// convert URIs to Strings
					if(pathOrURI instanceof URI)
					{
						uri = pathOrURI.uri;
					}

				// throw error if no path passed
					else if(typeof pathOrURI !== 'string')
					{
						throw new TypeError('TypeError in Config: pathOrURI "' +pathOrURI+ '" must be a String or URI instance')
					}

				// absolute uri
					else if(URI.isAbsolute(pathOrURI))
					{
						uri = URI.toURI(pathOrURI, 1);
					}

				// relative uri - find in paths
					else
					{
						// error on empty strings
							if(pathOrURI.trim() === '')
							{
								throw new TypeError('TypeError in Config: pathOrURI "' +pathOrURI+ '" must be a valid path, URI, filename, or token');
							}
							else if(pathOrURI.indexOf('/' == 0))
							{
								var uri = URI.toURI(pathOrURI);
							}
							
						// find in paths
							uri	= xjsfl.file.find('config', pathOrURI);

						// fall back to user config if module or user config doesn't exist (but don't save yet)
							if(uri == null)
							{
								uri = URI.toURI('//user/config/' + pathOrURI);
							}
					}

				// make sure URI has an xml extension
					uri = uri.replace(/(\.xml)?$/, '.xml');

			// ----------------------------------------------------------------------------------------------------
			// protected functions

				// override prototype function with protected getter
					var file = new File(uri);
					this.getFile = function()
					{
						return file;
					}

			// ----------------------------------------------------------------------------------------------------
			// save passed in data, or load existing file

				// if data is passed in, save
					if(xml)
					{
						if(typeof xml === 'string')
						{
							xml = new XML('<' + xml + ' />');
						}
						this.xml = xml;
						this.save();
					}

				// if not, load the existing data if a file exists
					else if(this.getFile().exists)
					{
						this.load();
						if(this.xml.localName() == undefined)
						{
							var str = 'A new Config instance cannot be instantiated, as the XML in file...\n\n"' +URI.asPath(uri)+ '"\n\n...appears to be invalid';
							if(confirm(str + '\n\nWould you like to view this file?'))
							{
								this.getFile().reveal();
							}
							throw new Error(str);
						}
					}

				// otherwise, just initialize XML
					else
					{
						this.xml = <config />;
					}
		}

	// ------------------------------------------------------------------------------------------------
	// Prototype

		Config.prototype =
		{
			
			// --------------------------------------------------------------------------------
			// # Properties
			
				/**
				 * The uri of the config instance
				 * @type {Object}
				 */
				get uri()
				{
					var file = this.getFile();
					return file ? file.uri : null;
				},
	
				/** @type {XML}	The raw XML in the config object */
				xml:	null,
				
				/** @type {Boolean}	A flag to save data as soon as it is set */
				autosave:true,
	
				// reset constructor
				constructor:Config,
	
			// --------------------------------------------------------------------------------
			// # Data methods
			
				/**
				 * Gets the value of the specified node path. Attributes are automatically converted to type
				 * @param	{String}		path		A dot-notation path to a node or attribute
				 * @returns	{value}						The value of the node / attribute, or null (===) if no value, or undefined (===) if missing. Test for XML with typeof value === 'xml'
				 */
				get:function(path, parseValue)
				{
					/**
					 * nodes that exist, but with no value will return a null value (value === null)
					 * nodes that don't exist will return undefined, but not null (value === undefined)
					 * test for XML with typeof value == 'xml'
					 */
	
					// get the value
						var value	= this.xml.get(path);
						var length	= value.length();
						
					// result will always be an XMLList, now choose whether to convert it
						if(length == 0)
						{
							return undefined;
						}
						else if(value.nodeKind() === 'element' && (value.hasComplexContent() || value.attributes().length() > 0))
						{
							return value;
						}
						else
						{
							return Utils.parseValue(value);
						}
	
				},
				
				/**
				 * Sets data on the wrapped XML data
				 * Yeah, yeah, so it uses eval. It allows us to set attributes and nested nodes in one go, so I'm using it!
				 * @param	{String}		path		An xJSFL XML notation path to a node or attribute
				 * @param	{Value}			value		Any value that can be converted to a string
				 * @param	{Boolean}		append		An optional Boolean that allows you to add the items to path, rather than replacing it
				 * @returns	{Config}					The current Config instance
				 */
				set:function(path, value, append)
				{
					// set value
						this.xml.set(path, value, append);
					
					// save
						if(this.autosave)
						{
							this.save();
						}
	
					// return
						return this
				},
	
				/**
				 * Removes the node from the Config instance's XML
				 * @param	{String}		path		An xJSFL XML notation path to a node or attribute
				 * @returns	{Config}					The current Config instance
				 */
				remove:function(path)
				{
					// set value
						this.xml.remove(path);
					
					// save
						if(this.autosave)
						{
							this.save();
						}
	
					// return
						return this
				},
	
				/**
				 * Clears all nodes inside the internal XML
				 * @returns	{Config}		The current Config instance
				 */
				clear:function()
				{
					this.xml = <config />;
					return this;
				},
				
			// --------------------------------------------------------------------------------
			// # File methods
	
				/**
				 * Loads the XML config from disk
				 * @returns	{Config}		The current Config instance
				 */
				load:function()
				{
					this.xml = new XML(this.getFile().contents);
					return this;
				},
	
				/**
				 * Saves the pretty-printed XML to disk
				 * @returns	{Config}		The current Config instance
				 */
				save:function()
				{
					this.getFile().write(this.xml.prettyPrint());
					return this;
				},
	
				/**
				 * Removes the config file from disk
				 * @returns	{Config}		The current Config instance
				 */
				removeFile:function()
				{
					var uri = this.getFile().uri;
					if(uri.indexOf(xjsfl.uri + 'core/config/') === -1)
					{
						return this.getFile().remove(true);
					}
					return false;
				},
				
				getFile:function()
				{
					// temporary function
					return null;
				},
	
			// --------------------------------------------------------------------------------
			// # Utility methods
	
				/**
				 * Returns a String representation of the Config instance
				 * @returns	{String}			The String summary of the Config instance
				 */
				toString:function()
				{
					var nodes	= this.xml ? this.xml.*.length() : 0;
					var file	= this.getFile();
					var exists	= false;
					var path	= ''
					if(file)
					{
						exists	= file.exists;
						path	= file.path;
					}
					return '[object Config path="' +path+ '" rootnodes=' +nodes+ ' exists=' +exists+ ']';
				},
	
				/**
				 * Returns the pretty-printed XML contents
				 * @returns	{String}			The pretty-printed XML contents
				 */
				toXMLString:function()
				{
					return this.xml.prettyPrint();
				},
				
				debug:function()
				{
					trace(this.toXMLString());
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
