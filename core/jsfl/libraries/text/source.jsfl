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

	Source =
	{
		// --------------------------------------------------------------------------------
		// variables
		
			// debug
				debug			:false,
		
			// chunker for headings and comments
				rxAll			:/\/\*([^@{}\r\n]+?)\*\/|(\/\*\*[\s\S]*?\*\/)\s+([^\r\n]+)/g,
		
			// variables that get populated as the fileis processed
				currentObj		:'',
				className		:'',
				classType		:'',
				classText		:'',
			
	
		// --------------------------------------------------------------------------------
		// functions
	
			/**
			 * Summary
			 * @param	{File}	src	The Source file
			 * @return	{Object}		Description
			 */
			parseFile:function(srcURI, debug)
			{
				// properties
					this.currentObj		= '';
					this.className		= '';
					this.classType		= '';
					this.classText		= '';
					this.debug			= debug;
					
				// variables
					var members			= [];
					var src				= new File(srcURI);
		
				// debug
					if(debug)
					{
						format('\n > Processing "{path}"', URI.asPath(srcURI));
					}
		
				// match functions
					var matches = src.contents.match(this.rxAll);
					if (matches != null)
					{
						// debug
							if(this.debug)
							{
								format(' > Matches: {matches}\n', matches.length);
							}
		
						// process matches
							for(var i = 0 ; i < matches.length; i++)
							{
								var member = this.parseMatch(matches[i]);
								if(member)
								{
									members.push(member);
								}
							}
					}
					
				// return
					var obj =
					{
						name:this.className,
						desc:this.className,
						members:members
					}
					return obj;
			},
		
			parseMatch:function(match)
			{
				// create local version of global RegExp
					var rx			= new RegExp(this.rxAll.source);
		
				// comment and object
					var matches		= match.match(rx);
					var heading		= matches[1];
					var comment		= matches[2];
					var signature	= matches[3];
		
				// parse
					if(heading)
					{
						var obj = this.parseHeading(heading);
					}
					else if(signature.indexOf('function') != -1)
					{
						var obj = this.parseFunction(comment, signature);
					}
					else if(signature.match(/\bget|set\b/))
					{
						var obj = this.parseProperty(comment, signature);
					}
					else
					{
						var obj = this.parseProperty(comment, signature);
					}
		
				// return
					return obj;
			},
		
			parseHeading:function(text)
			{
				// variables
					var props	= text.split(' - ');
					var heading	= props.shift();
					var desc	= props.shift();
					
				// object
					var obj		= new Source.classes.Heading(heading.trim(), desc ? desc.trim() : '');
					
				// debug
					if(this.debug)
					{
						trace('\n > HEADING: ' + heading.toUpperCase());
					}
		
				// return
					return obj;
			},
		
			parseFunction:function(comment, signature)
			{
				// variables
					var rxSignature	= /(function|\w+)\s*[:=]*\s*(function|\w+)\s*\((.*)\)/
		
				// object
					var obj			= new Source.classes.Function();
		
				// signature
					var matches		= signature.match(rxSignature);
					var name		= matches[1] == 'function' ? matches[2] : matches[1];
					obj.setSignature(name, matches[3]);
		
				// debug
					if(this.debug)
					{
						trace(' > FUNCTION: ' + name);
					}
		
				// set class name for this file if not already set
					if(this.className == '')
					{
						this.className	= name;
						this.classType	= 'function';
					}
		
				// parse comment
					this.parseComment(comment, obj);
		
				// return
					return obj;
			},
		
			parseObject:function(comment, signature)
			{
				// variables
					var rxVar		= /(var )*([.\w]+?)\s*[:=]/i;
					var obj			= new Source.classes.Source.classes.Object();
		
				// signature
					var matches		= signature.match(rxVar);
					if(matches)
					{
						obj.name = matches[2];
						this.currentObj = obj.name;
						if(this.className == '')
						{
							this.className	= this.currentObj;
							this.classType	= 'object'
						}
					}
		
				// skip if private
					if(obj.name.indexOf('_') == 0)
					{
						return null;
					}
		
				// debug
					if(this.debug)
					{
						trace(' > OBJECT: ' + obj.name);
					}
		
				// parse comment
					this.parseComment(comment, obj);
		
				// return
					return obj;
			},
		
			parseProperty:function(comment, signature)
			{
				// variables
					var rx		= /\b(get\b|set\b)?\s*([\.\w]+)/;
					var obj		= new Source.classes.Property();
		
				// signature
					var matches		= signature.match(rx);
					if(matches)
					{
						obj.name		= matches[2]
											.replace('this.', '')
											.replace(/var\s+/, '');
						obj.accessor	= matches[1] == 'get' ? 'Read' : 'Write';
					}
		
				// skip if private
					if(obj.name && obj.name.indexOf('_') == 0)
					{
						return null;
					}
		
				// debug
					if(this.debug)
					{
						trace(' > PROPERTY: ' + obj.name);
					}
		
				// comment
					this.parseComment(comment, obj);
		
				// return
					return obj;
			},
		
			parseComment:function(comment, obj)
			{
				// reg exps
					var rxType		= /\*\s+@(\w+)\s*(.*)/;							// /* @something ...
					var rxText		= /\*\s+(\w[^\n\r]+)/;							// Text
					var rxParam1	= /@param\s+([\$\w]+)\s+(\{\w*\})\s+(\w.*)/;	// name {Type} Comment
					var rxParam2	= /@param\s+(\{\w*\})\s+([\$\w]+)\s+(\w.*)/;	// {Type} name Comment
					var rxReturns	= /@returns?\s+(\{\w+\})\s+(.*)/				// @return(s) {Type} Comment
					var rxDataType	= /@(type|param)\s+({\w*})?[\t ]*([^\r\n]*)/;	// @type {Type} Comment
		
				// loop over lines and
					var lines		= comment.split(/[\r\n]+/g);
					for each(var line in lines)
					{
						// match
							matches = line.match(rxType);
		
						// type
							if(matches)
							{
								// variables
									var type	= matches[1];			// type (i.e., param)
									var content	= matches[2];			// ...	(the following text)
		
									if(type == 'param' && obj instanceof Source.classes.Property)
									{
										//type = 'type';
									}
		
								// content
									switch(type)
									{
										case 'param':
											if(obj instanceof Source.classes.Function)
											{
												var param = matches[0].match(rxParam1);
												if(param)
												{
													obj.addParam(param[1], param[2], param[3]);
												}
												else
												{
													var param = matches[0].match(rxParam2);
													if(param)
													{
														obj.addParam(param[2], param[1], param[3]);
													}
												}
											}
		
										break;
		
										case 'type':
											var param = matches[0].match(rxDataType);
											if(type)
											{
												obj.type 	= String(param[2]).replace(/[{}]/g, '');
												obj.text	= String(param[3]).replace('*/', '').trim();
											}
										break;
		
										case 'return':
										case 'returns':
											if(obj instanceof Source.classes.Function)
											{
												var param = matches[0].match(rxReturns);
												if(param)
												{
													obj.addReturns(param[1], param[2]);
												}
											}
		
										break;
		
										default:
											if(obj.addTag)
											{
												if(matches[1] === 'constructor')
												{
													obj.isConstructor = true;
													obj.object = obj.name;
												}
												else
												{
													obj.addTag(matches[1], matches[2]);
												}
											}
									}
							}
		
						// text
							else
							{
								matches = line.match(rxText);
								if(matches)
								{
									obj.addText(matches[1]);
									if(this.classText == '')
									{
										this.classText = matches[1];
									}
								}
							}
					}
		
				// return
					return obj;
			},
			
		// --------------------------------------------------------------------------------
		// utilities
	
			toString:function()
			{
				return '[class Source]';
			},
			
		// --------------------------------------------------------------------------------
		// classes
	
			classes:
			{
				Heading:function(text, desc)
				{
					this.object	= 'Heading';
					this.text	= text;
					this.desc	= desc;
				},
		
				Object:function(name, text)
				{
					this.object	= 'Object';
					this.name	= name;
					this.text	= text;
				},
		
				Property:function(name, accessor, type, text)
				{
					this.object		= 'Property';
					this.name		= name;
					this.accessor	= accessor;
					this.type		= type;
					this.text		= text;
				},
		
				Function:function(signature, text, params, returns)
				{
					// variables
						this.object		= 'Function';
						this.name		= '';
						this.signature	= signature ;
						this.text		= text;
						this.details	= '';
						this.params		= {};
						this.tags		= {};
						this.returns	= [];
		
					// constructor
						if(params !== undefined)
						{
							for each(var param in params)
							{
								this.addParam(param.name, param.type, param.text);
							}
						}
		
					// return
						return this;
				},
		
				Param:function(name, type, text)
				{
					this.object		= 'Param';
					this.name		= name;
					this.type		= type;
					this.text		= text;
				}
			}

	}
	

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████             ██          ██                           
//  ██  ██             ██          ██                           
//  ██  ██ ████ █████ █████ █████ █████ ██ ██ █████ █████ █████ 
//  ██████ ██   ██ ██  ██   ██ ██  ██   ██ ██ ██ ██ ██ ██ ██    
//  ██     ██   ██ ██  ██   ██ ██  ██   ██ ██ ██ ██ █████ █████ 
//  ██     ██   ██ ██  ██   ██ ██  ██   ██ ██ ██ ██ ██       ██ 
//  ██     ██   █████  ████ █████  ████ █████ █████ █████ █████ 
//                                         ██ ██                
//                                      █████ ██                
//
// ------------------------------------------------------------------------------------------------------------------------
// Prototypes

	// --------------------------------------------------------------------------------
	// Param

		Source.classes.Param.prototype =
		{
			constructor:Source.classes.Param,
			
			toString:function()
			{
				return '[object Param name="' +this.name+ '" type="' +this.type+ '" text = "' +this.text+ '"]';
			}
		}

	// --------------------------------------------------------------------------------
	// Function

		Source.classes.Function.prototype =
		{
			// constructor
				constructor:Source.classes.Function,
			
			// setters
				setSignature:function(name, params)
				{
					this.name = name;
					this.signature = name + '(' + params + ')';
				},

				addReturns:function(type, text)
				{
					var param = new Source.classes.Param(null, type.replace(/\W/g, ''), text);
					this.returns.push(param);
				},

				addParam:function(name, type, text)
				{
					var param = new Source.classes.Param(name, type.replace(/\W/g, ''), text);

					if( ! this.params[name])
					{
						this.params[name] = [param];
					}
					else
					{
						this.params[name].push(param);
					}
				},

				addText:function(text)
				{
					if( ! this.text)
					{
						this.text = text.trim();
					}
					else
					{
						this.details += text.trim();
					}
				},
				
				addTag:function(name, text)
				{
					if( ! this.tags[name])
					{
						this.tags[name] = [text || true];
					}
					else
					{
						this.tags[name].push(text || true);
					}
					
				},

			// param getters
				getParam:function(name, obj)
				{
					obj = obj || this.params;
					return obj[name] ? obj[name][0] : null;
				},

				getParams:function(obj)
				{
					var params = [];
					obj = obj || this.params;
					for(var name in obj)
					{
						params.push(this.getParam(name, obj));
					}
					return params;
				},

				getAllParams:function(obj)
				{
					var params = [];
					obj = obj || this.params;
					for(var name in obj)
					{
						for each(var param in obj[name])
						{
							params.push(param);
						}
					}
					return params;
				},

			// tag getters
				getTag:function(name)
				{
					return this.getParam(name, this.tags);
				},

				getTags:function(name)
				{
					return this.getParams(name, this.tags);
				},

				getAllTags:function(name)
				{
					return this.getAllParams(name, this.tags);
				},

			// return getters
				getReturns:function()
				{
					var params = [];
					for each(var param in this.returns)
					{
						params.push(param);
					}
					return params;
				},

				getReturn:function()
				{
					return this.returns[0];
				},

			// utilities
				toString:function()
				{
					return '[object Function signature="' +this.signature+ '" params=' +this.getParams().length+ ']';
				}
		}

	// --------------------------------------------------------------------------------
	// Obj

		Source.classes.Object.prototype =
		{
			constructor:Source.classes.Object,
			
			addText:function(text)
			{
				if( ! this.text)
				{
					this.text = text.trim();
				}
			},

			toString:function()
			{
				return '[object Object name="' +this.name+ '" text="' +this.text+ '"]';
			}
		}

	// --------------------------------------------------------------------------------
	// Property

		Source.classes.Property.prototype =
		{
			constructor:Source.classes.Property,
			
			addText:function(text)
			{
				if( ! this.text)
				{
					this.text = text.trim();
				}
			},

			toString:function()
			{
				return '[object Property name="' +this.name+ '" type="' +this.type+ '" text="' +this.text+ '"]';
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
