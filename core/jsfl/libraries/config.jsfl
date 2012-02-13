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

					// fall back to user config if module or user config doesn't exist
						if(uri == null)
						{
							uri = URI.toURI('//user/config/' + pathOrURI + '.xml');
						}
				}

			// file
				var file = new File(uri);
				this.getFile = function()
				{
					return file;
				}

			// if data is passed in, save
				if(xml)
				{
					this.xml = xml;
					this.save();
				}

			// if not, load if file exists
				else if(this.getFile().exists)
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

			get uri()
			{
				return this.getFile ? this.getFile().uri : '';
			},

			get path()
			{
				return this.getFile ? this.getFile().path : '';
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

				if(path.indexOf('@') != -1)
				{
					return parse === false ? value : xjsfl.utils.parseValue(value);
				}
				else
				{
					return value;
				}

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
			 * Saves the internal XML to disk
			 * @returns			{Config}	The current Config node
			 */
			save:function()
			{
				var xml = this.xml.toXMLString().replace(/ {2}/g, '\t').replace(/\n/g, xjsfl.settings.newLine);
				this.getFile().write(xml);
				return this;
			},

			/**
			 * Clears all nodes inside the internal XML
			 * @returns			{Config}	The current Config node
			 */
			clear:function()
			{
				this.xml	= <config />;
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
				var nodes	= this.xml ? this.xml.*.length() : 0;
				return asXML ? this.xml.toXMLString() : '[object Config path="' +this.path+ '" nodes=' +nodes+ ']';
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
