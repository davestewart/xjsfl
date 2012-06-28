// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                    ██        ██
//    ██                      ██        ██
//    ██ █████ ████████ █████ ██ █████ █████ █████
//    ██ ██ ██ ██ ██ ██ ██ ██ ██    ██  ██   ██ ██
//    ██ █████ ██ ██ ██ ██ ██ ██ █████  ██   █████
//    ██ ██    ██ ██ ██ ██ ██ ██ ██ ██  ██   ██
//    ██ █████ ██ ██ ██ █████ ██ █████  ████ █████
//                      ██
//                      ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Template

	/**
	 * Template
	 * @overview	Handes loading and population of text data, including nested templating and indentation
	 * @instance	template
	 */

	xjsfl.init(this, ['File', 'URI', 'Utils']);
		
	// ------------------------------------------------------------------------------------------------
	// Constructor

		/**
		 * Handes loading and population of text data, including nested templating and indentation
		 * @param	{String}	pathOrURI	A URI or path to the template file
		 * @param	{Object}	data		An object of key:value pairs
		 * @returns	{Template}				A new Template instance
		 */
		Template = function(pathOrURI, data)
		{
			if(pathOrURI)
			{
				var uri = URI.toURI(pathOrURI, 1);
				this.load(uri);
			}
			if(data)
			{
				this.set(data);
			}

			//alert(pathOrURI)
			/*
			_render = function()
			{

			}

			this.render = function()
			{
				return _render();
			}
			*/

			//TODO Make render() more obvious - offload to a protected method perhaps? Need to make stack better-protected


			//TODO Add option to auto-clean unused tags
			//TODO Look at re-constructing class to make variables private
			//TODO Look at renaming variables to _name, then updating Output class
			//TODO Add some kind of post-processing / callback, which is called after render
		}

	// ------------------------------------------------------------------------------------------------
	// Static properties

		Template.templates = {};
		Template.toString = function()
		{
			return '[class Template]';
		}


	// ------------------------------------------------------------------------------------------------
	// Prototype

		Template.prototype =
		{
			// --------------------------------------------------------------------------------
			// # Properties

				/** @type {String}	The URI of the Template */
				uri:		'',
				
				input:		'',
				
				output:		'',
				
				data:		null,
				
				options:	null,
				
				_indent:	'',

			// --------------------------------------------------------------------------------
			// # Methods

				/**
				 * reset constructor
				 * @ignore
				 */
				constructor:Template,

				/**
				 * Loads the template source text file
				 * @param	{String}	pathOrURI	A URI or path to the template file
				 * @returns	{Template}				Itself
				 */
				load:function(pathOrURI)
				{
					// input
						this.uri	= URI.toURI(pathOrURI, 1);

					// restore from cache?
						//this.input	= Template.templates[uri];

					// load file
						if( ! this.input)
						{
							//TODO What's happening here? Does Template still cache old templates on the class itself?
							var file = new File(this.uri);
							if( ! file.exists )
							{
								throw new ReferenceError('ReferenceError in Template.load(): The file "' +file.path+ '" does not exist')
							}
							this.input	= Template.templates[this.uri] = file.contents;
						}

					// return
						return this;
				},

				/**
				 * Saves the rendered template to a file
				 * @param	{String}	pathOrURI	The uri of where to save the file
				 * @param	{Boolean}	overwrite	An optional Boolean specifying whether to overwrite an existing file or not
				 */
				save:function(pathOrURI, overwrite)
				{
					if(pathOrURI != this.uri)
					{
						//TODO Make sure this works properly (and compare to previous version)
						var uri		= URI.toURI(pathOrURI, 1);
						var file	= new File(uri, this.render());
						if( ! file.save() )
						{
							xjsfl.output.trace('The template "' +URI.asPath(uri)+ '" was not saved');
						}
					}
					else
					{
						xjsfl.output.trace('A template cannot be saved over itself!');
					}

					return this;
				},

				/**
				 * Set the values for the placeholders in template
				 * @param	{Object}	data		An Object of key:value pairs, or any instance with accessible properties
				 * @param	{String}	data		A key name
				 * @param	{mixed}		value		Any value that can be converted to a string, even another Template instance
				 * @param	{Boolean}	append		Append the value, rather than replacing it
				 * @returns	{Template}				Itself
				 */
				set:function(data, value, append)
				{
					// object
						if(arguments.length == 1)
						{
							this.data = data;
						}

					// key + value
						else
						{
							if( ! this.data)
							{
								this.data = {};
							}
							if(append && this.data[data])
							{
								this.data[data] += '\n' + value;
							}
							else
							{
								this.data[data] = value;
							}
						}

					// return
						return this;
				},

				/**
				 * Set a global indent for the final rendered output
				 * @param	{Number}	indent		The number of tabs to indent
				 * @param	{String}	indent		A string that will be used as the indent
				 * @returns	{Template}				Itself
				 */
				indent:function(indent)
				{
					// indent
						switch(typeof indent)
						{
							case 'string':
								this._indent = indent.match(/^\t+$/) ? indent : '	';
							break;

							case 'number':
								this._indent = new Array(Math.floor(indent + 1)).join('	');
							break;

							default:
								this._indent = '	';
						}

					// return
						return this;
				},

				/**
				 * Renders the Template and all its placeholder values
				 * @returns	{String}				The rendered template
				 */
				render:function(_stack)
				{
					// utility functions
						function isBlank(str)
						{
							return str.replace(/^\s*$/g, '') === '';
						}

						function indent(text, indent)
						{
							return text.replace(/^/gm, indent);
						}

					// main replacement function
						function replace(input)
						{
							// matches
								var output, value;
								var matches = input.match(rxLocal);

							// handle > indented placeholder
								if(matches[2])
								{
									value	= data[matches[2]];
									output	= value !== undefined ? indent(value, matches[1]) : matches[0];
								}

							// handle normal placeholder
								else
								{
									value	= data[matches[3]];
									output	= value !== undefined ? value : matches[0];
								}

							// remove empty optional placeholder, and return
								return value === undefined && input.indexOf('?') != -1 ? '' : output;
						}

					// placeholder matching regular expressions
						//TODO add in support for default placeholders {default=value}
						//TODO add in support for deep properties i.e. {timeline.frameCount}
						var rxLocal		= /^([\t ]*){>(\w+)\??}|{(\w+)\??}/;
						var rxGlobal	= new RegExp(rxLocal.source, 'g');

					// recursion check
						_stack = Utils.isArray(_stack) ? _stack : [];
						if(_stack.indexOf(this) > -1)
						{
							return '// RECURSION! (' +URI.getFile(this.uri)+ ')';
						}

					// flatten and cache all data values as strings, so repeated placeholders
					// are not rendered each time they reappear in the parent Template.

						// variables
							var data		= {};
							var value		= null;

						// flatten values
							for(var key in this.data)
							{
								value = this.data[key]
								if(value === this)
								{
									data[key] = this.clone().render();
								}
								else if(value instanceof Template)
								{
									data[key] = value.render(_stack.concat([this]));
								}
								else
								{
									data[key] = String(value);
								}
							}

					// input / output
						var lines		= this.input.split(/\r\n|\n/);
						var output		= [];

					// process lines
						for(var i = 0; i < lines.length; i++)
						{
							// populate
								var result = lines[i].replace(rxGlobal, replace);

							// add non-blank results to output
								if( ! isBlank(lines[i]) && ! isBlank(result))
								{
									// TODO See how lines that have all placeholders removed can be removed, without removing ALL blank lines
									// Some kind of clever regexp parsing? exec()?
								}

							// output results
								output.push(result)
						}

					// convert lines to text and indent
						var text = output.join('\n');
						text = indent(text, this._indent);

					// return
						return text;
				},

				/**
				 * Return a copy of the object
				 * @returns	{Template}				An independant copy of the object
				 */
				clone:function()
				{
					var template = new Template();
					for(var prop in this)
					{
						if(typeof this[prop] != 'function')
						{
							template[prop] = this[prop]; //eval(uneval(this[prop]));
						}
					}
					return template;
				},

				/**
				 * Returns the String representation of the Template
				 * @returns
				 */
				toString:function()
				{
					return '[object Template path="' +URI.asPath(this.uri, true)+ '"]';
				}

		}

	// ------------------------------------------------------------------------------------------------
	// Register class with xjsfl

		xjsfl.classes.register('Template', Template);
