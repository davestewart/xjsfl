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

	// includes
		xjsfl.init(this, ['File', 'URI', 'Utils', 'XML']);
		
	// ------------------------------------------------------------------------------------------------
	// Constructor

		/**
		 * Config class, loads and saves XML from the config folders
		 *
		 * @param	{String}	pathOrURI	The absolute or relative path to the config file. Passing a relative file path will attempt to find the file in the cascading file structure, defaulting to user/config/
		 * @param	{XML}		xml			An XML object with which to populate the Config instance
		 */
		Config = function(pathOrURI, xml)
		{
			// ----------------------------------------------------------------------------------------------------
			// resolve the URI
			
				// convert URIs to Strings
					if(pathOrURI instanceof URI)
					{
						pathOrURI = pathOrURI.uri;
					}

				// throw error if no path passed
					if(typeof pathOrURI !== 'string')
					{
						throw new TypeError('TypeError in Config: pathOrURI "' +pathOrURI+ '" must be a String or URI instance')
					}

				// absolute uri
					if(URI.isURI(pathOrURI))
					{
						var uri = pathOrURI;
					}

				// relative uri - find in paths
					else
					{
						// error on empty strings
							if(pathOrURI.trim() == '')
							{
								throw new TypeError('TypeError in Config: pathOrURI "' +pathOrURI+ '" must be a valid path, URI, filename, or token');
							}
							
						// find in paths
							var uri	= xjsfl.file.find('config', pathOrURI);

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
			xml:	null,
			
			autosave:true,

			getFile:function()
			{
				return null;
			},

			get uri()
			{
				var file = this.getFile();
				return file ? file.uri : null;
			},

			constructor:Config,

			/**
			 * Gets the value of the specified node path
			 * @param	{String}		path		A dot-notation path to a node or attribute
			 * @param	{Boolean}		asXML		A Boolean flag indicating that you want to return the actual XML, rather than return the XML, parse the value to the currect datatype
			 * @returns	{value}						The value of the node / attribute, or null (===) if no value, or undefined (===) if missing. Test for XML with typeof value === 'xml'
			 */
			get:function(path)
			{
				/**
				 * nodes that exist, but with no value will return a null value (value === null)
				 * nodes that don't exist will return undefined, but not null (value === undefined)
				 * test for XML with typeof value == 'xml'
				 */

				// get the value
					var value	= this.xml.get(path);
					var length	= value.length();

				// result will always be an XML node, now choose whether to convert it
					if(length == 0)
					{
						return undefined;
					}
					else
					{
						return value.length() == 1 && value.nodeKind() === 'attribute' ? Utils.parseValue(value) : value;
					}

			},
			
			/**
			 * Sets data on the wrapped XML data
			 * Yeah, yeah, so it uses eval. It allows us to set attributes and nested nodes in one go, so I'm using it!
			 * @param	{String}		path		An xJSFL XML notation path to a node or attribute
			 * @param	{Value}			value		Any value that can be converted to a string
			 * @param	{Boolean}		append		An optional Boolean that allows you to add the items to path, rather than replacing it
			 * @returns	{Config}					The current Config node
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
			 * @returns	{Config}		The current Config node
			 */
			clear:function()
			{
				delete this.xml.*;
				return this;
			},

			/**
			 * Loads the XML config from disk
			 * @returns	{Config}		The current Config node
			 */
			load:function()
			{
				this.xml = new XML(this.getFile().contents);
				return this;
			},

			/**
			 * Saves the pretty-printed XML to disk
			 * @returns	{Config}		The current Config node
			 */
			save:function()
			{
				this.getFile().write(this.xml.prettyPrint());
				return this;
			},

			/**
			 * Removes the config file from disk
			 * @returns	{Config}		The current Config node
			 */
			removeFile:function()
			{
				this.clear();
				var uri = this.getFile().uri;
				if(uri.indexOf('/xJSFL/core/config/') === -1)
				{
					return this.getFile().remove(true);
				}
				return false;
			},

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
