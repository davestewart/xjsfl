// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████
//  ██
//  ██     █████ ██ ██ ████ █████ █████
//  ██████ ██ ██ ██ ██ ██   ██    ██ ██
//      ██ ██ ██ ██ ██ ██   ██    █████
//      ██ ██ ██ ██ ██ ██   ██    ██
//  ██████ █████ █████ ██   █████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Source - examine and manipulate source code

	// ----------------------------------------------------------------------------------------------------
	// Tag class
	
		function Tag(data)
		{
			this.line		= data[0];
			this.type		= data[1];
			this.datatype	= data[2];
			this.name		= data[3];
			this.comment	= data[4];
		}
		
		Tag.prototype =
		{
			line		:null,
			type		:null,
			datatype	:null,
			name		:null,
			comment		:null
		}
	
	// ----------------------------------------------------------------------------------------------------
	// Doc Comment class
	
		function DocComment(text)
		{
			var rxBlock = /\/\*\*([\s\S]+?)\*\//;
			var matches = text.match(rxBlock);
			if(matches)
			{
				// variables
					this.intro		= '';
					this.details	= '';
					this.tags		= [];
					
				// regexps
					
				// initial content
					var block	= matches[1].replace(/^\s\* ?/gm, '');
					var lines	= block.split(/\r\n|\n|\r/);
					while(/^\s+$/.test(lines[0]))
					{
						lines.shift();
					}
					
				// process lines
					while(lines.length)
					{
						var line = lines.shift();
						if(line.indexOf('@') !== 0)
						{
							if(this.intro == '')
							{
								this.intro = line;
							}
							else
							{
								if( ! /^\s*$/.test(line) )
								{
									this.details += line + '\n';
								}
							}
						}
						else
						{
							var matches = line.match(/@(\w+)\s*(?:{(.+)})?\s+(\w*)\s*(.*)/);
							if(matches)
							{
								this.tags.push(new Tag(matches));
							}
						}
					}
			}
		}
		
		DocComment.prototype =
		{
			// --------------------------------------------------------------------------------
			// properties
			
				intro:'',
				
				details:'',
				
				tags:[],
				
			// --------------------------------------------------------------------------------
			// tags
			
				
				/**
				 * Gets all specific tags
				 * @param	{String}	type	The type of tag, i.e. param, icon, returns
				 * @returns	{Array}				An Array of Tag objects
				 */
				getTags:function(type)
				{
					var tags = [];
					for each(var tag in this.tags)
					{
						if(tag.type == type)
						{
							tags.push(tag);
						}
					}
					return tags;
				},
				
				/**
				 * Gets a specific tag
				 * @param	{String}	type	The type of tag, i.e. param, icon, returns
				 * @returns	{Tag}				The Tag object
				 */
				getTag:function(type)
				{
					for each(var tag in this.tags)
					{
						if(tag.type == type)
						{
							return tag;
						}
					}
				},
				
			// --------------------------------------------------------------------------------
			// params
			
				/**
				 * Gets a named param
				 * @param	{String}	name	The name of the Param to get, i.e. 
				 * @returns	{Tag}				The Tag object
				 */
				getParam:function(name)
				{
					var params = this.getParams();
					for each(var param in params)
					{
						if(param.name == name)
						{
							return param;
						}
					}
				},
				
				/**
				 * Gets all params
				 * @returns	{Tag}				The Tag object
				 */
				getParams:function()
				{
					return this.getTags('param');
				},
				
				/**
				 * Gets all param names
				 * @returns	{Array}				An Array of names
				 */
				getParamNames:function()
				{
					var params = this.getParams();
					for (var i = 0; i < params.length; i++)
					{
						params[i] = params[i].name;
					}
					return params;
				},
				
			// --------------------------------------------------------------------------------
			// returns
			
				/**
				 * Gets the return tag
				 * @param	{String}	type	The type of tag, i.e. param, icon, returns
				 * @returns	{Tag}				The Tag object
				 */
				getReturn:function()
				{
					return this.getTag('return');
				},
		}
	
	
	// ------------------------------------------------------------------------------------------------------------------------
	// Source

		Source =
		{
			/**
			 * Parses DocComments into an Object that can be easily-interogated
			 * @param	{String}	source	A URI to a source file that contains comments
			 * @param	{File}		source	A file pointing to a source file that contains comments
			 * @returns	{DocComment}		An DocComment object containing the comment content as properties
			 */
			parseDocComment:function(source)
			{
				// derive content

					// file
						if(source instanceof File)
						{
							source = source.contents;
						}
					// uri
						else if(URI.isURI(source))
						{
							source = new File(source).contents;
						}
						
					// get comments
						if(source)
						{
							return new DocComment(source);
						}

			},

			/**
			 * Parses a function source into an object
			 * @param	{Function}	fn		A reference to a function
			 * @returns	{Object}			An Object with name and params properties
			 */
			parseFunction:function(fn)
			{
				var matches		= fn.toSource().match(/function\s*((\w*)\s*\(([^\)]*)\))/);
				if(matches)
				{
					var params = matches[2].match(/(\w+)/g);
					return {name:matches[1], params:params, signature:matches[0].replace(/function (\w+)/, '$1')};
				}
				return {name:null, params:[], signature:''};
			},

			toString:function()
			{
				return '[class Source]';
			}

		}

	// ------------------------------------------------------------------------------------------------------------------------
	// override Function.toString()

		/**
		 * get the signature only, or full source of the function
		 * @param	{Boolean}	verbose		An optional Boolean to return the function source
		 * @returns	{String}				The signature or the source of the function
		 */
		/*
		Function.prototype.toString = function(verbose)
		{
			return verbose ? Function.prototype.toSource.call(this, this) : this.toSource().match(/function.+?\)/) + ' { ... }';
		}
		*/

	// ------------------------------------------------------------------------------------------------------------------------
	// register class

		xjsfl.classes.register('Source', Source);
