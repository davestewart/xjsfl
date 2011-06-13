// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                      ██        ██         
//    ██                        ██        ██         
//    ██   █████ ████████ █████ ██ █████ █████ █████ 
//    ██   ██ ██ ██ ██ ██ ██ ██ ██    ██  ██   ██ ██ 
//    ██   █████ ██ ██ ██ ██ ██ ██ █████  ██   █████ 
//    ██   ██    ██ ██ ██ ██ ██ ██ ██ ██  ██   ██    
//    ██   █████ ██ ██ ██ █████ ██ █████  ████ █████ 
//                        ██                         
//                        ██                         
//
// ------------------------------------------------------------------------------------------------------------------------
// Template - Handes loading and population of text data, including nested templating and indentation

	// ------------------------------------------------------------------------------------------------
	// Constructor
	
		/**
		 * Handes loading and population of text data, including nested templating and indentation
		 * @param	uri		{String}	A URI or path to the template file
		 * @param	data	{Object}	An object of key:value pairs
		 * @returns		
		 * @author	Dave Stewart	
		 */
		function Template(uri, data)
		{
			if(uri)
			{
				this.load(uri);
			}
			if(data)
			{
				this.set(data);
			}
			
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
			// properties
			
				uri:		'',
				file:		'',
				input:		'',
				output:		'',
				data:		null,
				options:	null,
				_indent:	'',
				
			// --------------------------------------------------------------------------------
			// properties
			
				/**
				 * reset constructor
				 */
				constructor:Template,
			
				/**
				 * Loads the template source text file
				 * @param	uri		{String}	A URI or path to the template file
				 * @returns			{Template}	Itself
				 * @author	Dave Stewart	
				 */
				load:function(uri)
				{
					// input
						this.uri	= uri;
						this.file	= uri.substr(uri.lastIndexOf('/') + 1)
						
					// restore from cache?
						//this.input	= Template.templates[uri];
						
					// load file
						if( ! this.input)
						{
							var file = new File(uri);
							if(!file.exists)
							{
								throw new Error('The file "' +file.path+ '" does not exist')
							}
							this.input	= Template.templates[uri] = file.contents;
						}
						
					// return
						return this;
				},
				
				/**
				 * Saves the rendered template to a file
				 * @param	uri			{String}	The uri of where to save the file
				 * @param	overwrite	{Boolean}	An optional Boolean specifying whether to overwrite an existing file or not
				 * @returns				{Template}	Itself
				 */
				save:function(uri, overwrite)
				{
					if(uri != this.uri)
					{
						var file = new File(uri, this.render());
						if( ! file.exists || overwrite)
						{
							file.save();
						}
						else
						{
							xjsfl.output.warn('The template "' +xjsfl.utils.makePath(uri, true)+ '" was not saved');
						}
					}
					else
					{
						xjsfl.output.warn('A template cannot be saved over itself!');
					}
					
					return this;
				},
				
				/**
				 * Set the values for the placeholders in template
				 * @param	data	{Object}	An object of key:value pairs
				 * @param	data	{String}	A key name
				 * @param	value	{mixed}		Any value that can be converted to a string, even another Template instance
				 * @param	append	{Boolean}	Append teh value, rather than replacing it
				 * @returns			{Template}	Itself
				 * @author	Dave Stewart	
				 */
				set:function(data, value, append)
				{
					// object
						if(data.constructor === Object)
						{
							this.data = data;
						}
						
					// key + value
						else if(typeof data != 'undefined' && typeof value != 'undefined')
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
				 * @param	indent	{Number}	The number of tabs to indent
				 * @param	indent	{String}	A string that will be used as the indent
				 * @returns			{Template}	Itself
				 * @author	Dave Stewart	
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
				 * @returns		{String}	The rendered template
				 * @author	Dave Stewart	
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
						var rxLocal		= /^(\s*){>(\w+)\??}|{(\w+)\??}/;
						var rxGlobal	= new RegExp(rxLocal.source, 'g');
						
					// recursion check
						_stack = _stack || [];
						if(_stack.indexOf(this) > -1)
						{
							return '// RECURSION! (' +this.file+ ')';
						}
					
					// flatten and cache all data as strings, so repeated placeholders
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
									output.push(result)
								}
						}
						
					// convert lines to text and indent
						var text = output.join('\n');
						text = indent(text, this._indent);
					
					// return
						return text;
				},
				
				/**
				 * Returna copy of the object
				 * @returns		{Template}	An independant copy of the object
				 * @author	Dave Stewart	
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
				 * @author	Dave Stewart	
				 */
				toString:function()
				{
					return '[object Template "' +this.file+ '"]';
				}
				
		}
		
	// ------------------------------------------------------------------------------------------------
	// Register class with xjsfl
	
		xjsfl.classes.register('Template', Template);

