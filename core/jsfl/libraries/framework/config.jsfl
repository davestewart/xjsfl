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
		 * @param	pathOrURI	{String}	The absolute or relative path to the config file. Passing a relative file path will attempt to find the file in the cascading file structure, defaulting to user/config/
		 * @param	xml			{XML}		An XML object with which to populate the Config instance
		 */
		Config = function(pathOrURI, xml)
		{
			// ----------------------------------------------------------------------------------------------------
			// resolve the URI

				// throw error if no path passed
					if(typeof pathOrURI !== 'string')
					{
						throw new TypeError('TypeError in Config: pathOrURI "' +pathOrURI+ '" must be a string')
					}

				// absolute uri
					if(URI.isURI(pathOrURI))
					{
						var uri = pathOrURI;
					}

				// relative uri - find in paths
					else
					{
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
					if(typeof value == 'undefined' || value === null)
					{
						parent[nodeName] = '';
					}
					else
					{
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
					}

				// save
					this.save();

				// return
					return this
			},

			/**
			 * Gets the value of the specified node path
			 * @param	path		{Srting}	A dot-notation path to a node or attribute
			 * @param	asXML		{Boolean}	A Boolean flag indicating that you want to return the actual XML, rather than return the XML, parse the value to the currect datatype
			 * @returns				{value}		The value of the node / attribute, or null (===) if no value, or undefined (===) if missing. Test for XML with typeof value === 'xml'
			 */
			get:function(path, asXML)
			{
				/**
				 * nodes that exist, but with no value will return a null value (value === null)
				 * nodes that don't exist will return undefined, but not null (value === undefined)
				 * test for XML with typeof value == 'xml'
				 */

				// get the value
					var result = path ? eval('this.xml.' + path) : this.xml;
					var length = result.length();

				// result will always be an XML node, now choose whether to convert it
					if(length == 0)
					{
						return undefined;
					}
					else
					{
						return (length > 1 || asXML) ? result : Utils.parseValue(result);
					}

			},

			/**
			 * Clears all nodes inside the internal XML
			 * @returns			{Config}	The current Config node
			 */
			clear:function()
			{
				delete this.xml.*;
				return this;
			},

			/**
			 * Loads the XML config from disk
			 * @returns			{Config}	The current Config node
			 */
			load:function()
			{
				this.xml = new XML(this.getFile().contents);
				return this;
			},

			/**
			 * Saves the pretty-printed XML to disk
			 * @returns			{Config}	The current Config node
			 */
			save:function()
			{
				this.getFile().write(this.xml.prettyPrint());
				return this;
			},

			/**
			 * Removes the config file from disk
			 * @returns			{Config}	The current Config node
			 */
			remove:function()
			{
				this.clear();
				return this.getFile().remove(true);
			},

			/**
			 * Returns a String representation of the Config instance
			 * @returns			{String}		The String summary of the Config instance
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
			 * @returns			{String}		The pretty-printed XML contents
			 */
			toXMLString:function()
			{
				return this.xml.prettyPrint();
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
