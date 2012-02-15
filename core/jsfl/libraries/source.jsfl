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

	// ------------------------------------------------------------------------------------------------------------------------
	// Source

		Source =
		{
			/**
			 * Parses DocComments into an Object that can be easily-interogated
			 * @param	{String}	source	A URI to a source file that contains comments
			 * @param	{File}		source	A file pointing to a source file that contains comments
			 * @returns	{Object}			An object containing the comment content as properties
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
						else if(typeof source == 'string' && source.indexOf('file:') == 0)
						{
							source = new File(source).contents;
						}

				// grab comment
					var comments	= source.match(/\/\*(?:(?!\*\/|\/\*)[\s\S])*(?:\/\*(?:(?!\*\/|\/\*)[\s\S])*\*\/(?:(?!\*\/|\/\*)[\s\S])*)*[\s\S]*?\*\//);

				// parse comment
					if(comments)
					{
						// property object
							var obj = {};

						// intro text


						// params
							var desc	= comments[0].match(/@(\w+)\s+([^\r\n]+)/);
							if(desc == null)
							{
								var desc	= comments[0].match(/\* (\w[^\r\n]+)/);
							}
							var icon	= comments[0].match(/@icon\s+([^\r\n]+)/);

							if(icon)
							{
								//item.@icon = icon[1];
							}
							if(desc)
							{
								//item.@desc = desc[1].replace(/"/g, '\"');
							}

						// return
							return obj;
					}

				// return
					return null;
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
		Function.prototype.toString = function(verbose)
		{
			return verbose ? Function.prototype.toSource.call(this, this) : this.toSource().match(/function.+?\)/) + ' { ... }';
		}

	// ------------------------------------------------------------------------------------------------------------------------
	// register class

		xjsfl.classes.register('Source', Source);
