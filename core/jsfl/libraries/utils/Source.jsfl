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
// Source

	/**
	 * Source
	 * @overview	Examine and manipulate source code
	 * @instance	source
	 */

	xjsfl.init(this, ['Class', 'URI']);

	/*

		Recognises sections:
		
			/** ... * /		- doc comments
			// # title		- section titles
			// #1 title		- numbered section titles
	
		Recognises tags:
		
			@class		- class name
			@param		- param properties
			@returns	- return values
			@type		- variable
			@any		- any other tag format treated as text
			
		Also useful for Documentor:
			
			@ignore		- ignores the object
			@example	- can be used to provide a one-line example
			@extends	- 
			@private
	*/


	Source = function(pathOrURI, debug)
	{
		// populate properties in order, so they inspect() correctly
			this.debug			= false;
			this.uri			= '';
			this.name			= '';
			this.desc			= '';
			this.instance		= '';
			this.currentClass	= null;
		
		// assign path
			if(pathOrURI)
			{
				this.parseFile(URI.toURI(pathOrURI, 1), debug);
			}
	}
	
	Source.prototype =
	{
		// --------------------------------------------------------------------------------
		// variables
		
			// debug
				debug			:false,
				
			// properties
				uri				:'',
				name			:'',
				desc			:'',
				instance		:'',
				
			// variables that get populated as the file is processed
				currentClass	:null,
				
			// properties
				members			:[],
		
	
		// --------------------------------------------------------------------------------
		// public functions
		
			/**
			 * Gets all memebers of the file, including comments
			 * @returns	{Array}		An Array of all file members
			 */
			getMembers:function()
			{
				return this.members;
			},
			
			/**
			 * Gets all members as an unorganised list
			 * @returns	{Array}		An Array of all file elements
			 */
			getElements:function()
			{
				var members = [];
				for each(var member in this.members)
				{
					if(member instanceof Source.classes.Element)
					{
						members.push(member);
					}
				}
				return members;
			},
			
			/**
			 * Gets all classes in a file
			 * @returns	{Array}		An Array of file classes
			 */
			getClasses:function()
			{
				var members = [];
				for each(var member in this.members)
				{
					if(member instanceof Source.classes.Element && member.getTag('class'))
					{
						members.push(member);
					}
				}
				return members;
			},
	
	
		// --------------------------------------------------------------------------------
		// parsing functions
	
			/**
			 * Summary
			 * @param	{File}	src	The Source file
			 * @return	{Object}		Description
			 */
			parseFile:function(uri, debug)
			{
				// properties
					this.uri			= URI.toURI(uri, 1);
					this.debug			= debug;
					this.members		= [];
					
				// variables
					var path			= URI.asPath(this.uri);
					var rx				= /\/\/\s*([#@])(\d*)\s*([^@{}\r\n]+)|(\/\*\*[\s\S]*?\*\/)\s+([^\r\n]+)/g;
					var matches;
					var m;
		
				// debug
					if(debug)
					{
						format('\n > Processing path "{path}"', path);
					}

				// process file
					if( ! FLfile.exists(this.uri) )
					{
						throw new URIError('The path "' +path+ '" does not exist');
					}
					var contents		= FLfile.read(this.uri);
					
				// match headings or comments
					while( (matches = rx.exec(contents)) != null )
					{
						// debug
							//inspect(matches)
							
						// process member
							var member = this.parseMatch(matches);
							if(member)
							{
								// update member
									member.line = contents.substr(0, rx.lastIndex).split('\n').length;
	
								// update source properties
									if(member instanceof Source.classes.Element)
									{
										if(member.getFlag('ignore'))
										{
											continue;
										}
									
										if(member.getFlag('class'))
										{
											this.currentClass = member;
										}
									}
									
								// test if accessor has an existing pair, and if so, update the original
									var accessorUpdated = false;
									if(member.class === 'Accessor')
									{
										for each(var m in this.members)
										{
											if(member.name == m.name && member.object == m.object)
											{
												if(member.readable == true)
												{
													m.readable = true;
													m.addText(member.getText());
													accessorUpdated = true;
													continue;
												}
												else if(member.writable == true)
												{
													m.writable = true;
													m.addText(member.getText());
													accessorUpdated = true;
													continue;
												}
											}
										}
										
										if(accessorUpdated)
										{
											continue;
										}
									}
								
								// add member
									this.members.push(member);
							}
					}
					
				// return
					return this;
			},
		
			parseMatch:function(matches)
			{
				// comment and object
					var headingType	= matches[1];
					var level		= parseInt(matches[2]);
					var heading		= matches[3].trim();
					var comment		= matches[4].trim();
					var code		= matches[5].trim();
					
				// # heading-style comment 
					if(heading)
					{
						var obj = this.makeHeading(heading, level);
					}
					
				// #* doc comment code
					else
					{
						//TODO Add support for parsing comments before code, so that the object type can be overridden by comment tags
						//TODO Make sure $ = function works
						
						// reg exp to match all member types
							var rx = /^\s*((var\s+[\$\w]+\s+=)|(function\s+[\$\w]+\()|([\$\w.]+\s*=)|([\$\w]+\s*:\s*)|([gs]et\s+[\$\w]+\s*\()|.*(__define[GS]etter__))/;

						// matches
							/*
							
								Matches
								1	the whole line
								2	var word =
								3	function word(
								4	word = / word.word = 
								5	word:
								6	get word( or set word(
								7	__definerGetter__ or __definerSetter__
							*/

						// examples
							/*
								// variables
									var name = 200;
									Object.Test.prototype =
									
								// functions
									function Test(one, two, three)
									test = function(one, two, three)
									Object.Test = function (one, two, three)
									var test = function(one, two, three)
									
								// properties
									constructor:Test
									inlineProperty:1
									method:function(one, two, three)
									
								// accessors
									get value()
									set value(value)
							*/
							
							
						// match and process
							var subMatches = code.match(rx);
							if(subMatches)
							{
								// variables
									var isFunction	= (code.indexOf('function') !== -1 && ! subMatches[7]);
									var isVariable	= !! (subMatches[2] || subMatches[3] || subMatches[4]);
									var isProperty	= !! (subMatches[5] || subMatches[6] || subMatches[7] || subMatches[4].indexOf('.') !== -1);
									var isAccessor	= !! (subMatches[6] || subMatches[7]);
									
								// process
									if(isFunction)
									{
										var obj = this.makeFunction(comment, code);
									}
									else if(isAccessor)
									{
										var obj = this.makeAccessor(comment, code);
									}
									else if(isVariable || isProperty)
									{
										var obj = this.makeVariable(comment, code);
									}
									else
									{
										throw new Error('Unknown Object');
									}
									
								// quit if no object
									if(obj == null)
									{
										throw new Error('A null object was returned in "' +this.uri+ '" from: ' + code);
									}
									//inspect(obj)
									
								// update with object
								
									//TODO review this block
									
									if(isProperty && this.currentClass && obj.hasTag)
									{
										obj.object = obj.getTag('extends') || obj.object || this.currentClass.name;
										if(obj.hasTag('property'))
										{
											obj.name = obj.getTag('property').text
										}
									}
									
								// set class flag
									if(obj.getTag('class'))
									{
										obj.addFlag('class');
									}
									
								// set as private
									if(obj.name.indexOf('_') == 0)
									{
										obj.addFlag('private');
									}
							}
							
						// comment, or possibly a __defineGetter__
							else
							{
								var obj = this.makeDocComment(comment);
							}
					}
					
				// test if match was a file overview, and if so, add properties to main class
					if(obj && obj.tags && obj.tags.overview)
					{
						this.name		= obj.text[0];
						this.desc		= obj.tags.overview[0].text;
						if(obj.tags.instance)
						{
							this.instance	= obj.tags.instance[0].text;
						}
						return null;
					}
					
				// return
					return obj;
			},
			
	
			parseComment:function(comment, obj)
			{
				// regexs
					var rxType		= /^@(\w+)\s*(.*)/;									// @something ...
					var rxParam1	= /^@param\s+([\$\w]+)\s+\{([\w\.]+)\}\s+(\w.*)/;	// @param name {Type} Comment
					var rxParam2	= /^@param\s+\{([\w\.]+)\}\s+([\$\w]+)\s+(\w.*)/;	// @param {Type} name Comment
					var rxReturns	= /^@returns?\s+\{([\w\.]+)\}\s+(.*)/				// @return(s) {Type} Comment
					var rxVariable	= /^@(type)\s+\{([\w\.]+)\}[\t ]*([^\r\n]*)/;		// @type {Type} Comment
					
				// split comment into trimmed lines
					var lines		= comment
										.replace(/\r/g, '')
										.replace(/^\s*\/\*\*\s*|\s*\*\/$/g, '')			// block-start /** and block-end */
										.replace(/[\*\s]$/g, '')						// block-trailing *
										.replace(/^[\t ]*\*[\t ]*/gm, '')				// line-leading *
										.split(/\n/g);
										
				// store a current object so multi-line text can be added to it
					var textObject	= obj;
										
				// debug
					//inspect(lines);
										
				// process lines
					for each(var line in lines)
					{
						// match against @type
							line		= line.trim();
							matches		= line.match(rxType);
		
						// reset textObject if there's a blank line
							if(line === '')
							{
								textObject = obj;
							}
						
						// type
							if(matches)
							{
								// variables
									var type	= matches[1];			// type (param, see, etc)
									var content	= matches[2];			// ...	(the following text)

								// debug		
									//inspect([type, content]);
		
								// content
									switch(type)
									{
									// function @param
										case 'param':
											if(obj instanceof Source.classes.Function)
											{
												var param = matches[0].match(rxParam1);
												if(param)
												{
													textObject = obj.addParam(param[1], param[2], param[3]);
												}
												else
												{
													var param = matches[0].match(rxParam2);
													if(param)
													{
														textObject = obj.addParam(param[2], param[1], param[3]);
													}
												}
											}
		
										break;
		
									// function @return
										case 'return':
										case 'returns':
											var param = matches[0].match(rxReturns);
											if(param && obj.addReturn)
											{
												//BUG This obj.addReturn check is only here so that __getter__s don't break the code
												textObject = obj.addReturn(param[1], param[2]);
											}
		
										break;

									// variable @type		
										case 'type':
											var param = matches[0].match(rxVariable);
											if(param)
											{
												obj.type = param[2];
												obj.addText(param[3]);
											}
										break;
									
									// any other @tag
										default: 
											if(obj.addTag)
											{
												//inspect(matches)
												textObject = matches[2] ? obj.addTag(matches[1], matches[2]) : obj.addFlag(matches[1]);
											}
									}
							}
		
						// if no @type match found, we're just dealing with text
							else
							{
								if(textObject instanceof Source.classes.Tag)
								{
									textObject.text += '\n' + line;
								}
								else
								{
									textObject.addText(line);
								}
								
							}
					}
					
				// debug
					//inspect(obj, {'function':false} );
		
				// return
					return obj;
			},
		
		// --------------------------------------------------------------------------------
		// make functions
		
			makeHeading:function(text, level)
			{
				// variables
					var props	= text.split(/\s+-\s+/);
					var heading	= props.shift();
					var desc	= props.shift();
					
				// object
					var obj		= new Source.classes.Heading(heading.trim(), desc ? desc.trim() : '', text, level);
					
				// debug
					if(this.debug)
					{
						trace('\n > HEADING: ' + heading);
					}
		
				// return
					return obj;
			},
		
			makeDocComment:function(comment)
			{
				var obj = new Source.classes.DocComment();
				return this.parseComment(comment, obj);
			},
	
			makeFunction:function(comment, code)
			{
				// attempt to match signature
					var rxSignature		= /(function|\w+)\s*[:=]*\s*(function|\w+)\s*\((.*)\)/
					var matches			= code.match(rxSignature);
					var name			= matches[1] == 'function' ? matches[2] : matches[1];
					
				// object
					var obj				= new Source.classes.Function();
		
				// signature
					obj.setSignature(name, matches[3]);
		
				// debug
					if(this.debug)
					{
						trace(' > FUNCTION: ' + name);
					}
		
				// set class name for this file if not already set
					/*
					if( ! this.className)
					{
						this.className	= name;
						this.classType	= 'function';
					}
					*/
		
				// parse comment
					this.parseComment(comment, obj);
					
				// set as constructor
					if(obj.flags.class || name === URI.getName(this.uri, true))
					{
						obj.addFlag('constructor');
					}
					
				// rename if @name tag found
					if(obj.tags.name)
					{
						var name =  obj.tags.name[0].text;
						obj.signature = obj.signature.replace(obj.name, name);
						obj.name = name;
					}
		
				// return
					return obj;
			},
		
			makeVariable:function(comment, code)
			{
				// variables
					var rx			= /(var\s+)?([.\w]+?)\s*[:=]/i;
					var matches		= code.match(rx);
					var obj;
		
				// signature
					var matches		= code.match(rx);
					if(matches)
					{
						// properties
							obj			= new Source.classes.Variable(matches[2]);
							
						// object
							if(matches[2].indexOf('.') !== -1)
							{
								obj.object = matches[2].replace(/\.[^\.]+$/, '');
							}
					}
					
				// debug
					if(this.debug)
					{
						trace(' > VALUE: ' + obj.name);
					}
		
				// parse comment
					this.parseComment(comment, obj);
		
				// return
					return obj;
			},
		
			makeAccessor:function(comment, code)
			{
				// variables
					var rx1		= /^([gs])et\s*([\.\w]+)/;
					var rx2		= /__define([GS])etter__\s*\(\s*['"]?([$_\w]+)/;
					
				// properties
					var obj		= new Source.classes.Accessor();
					var type;
					
				// parse signature
					var matches	= code.match(rx1) || code.match(rx2);

									if(matches)
					{
						obj.name	= matches[2];
						type		= matches[1].toLowerCase();
						if(type === 'g')
						{
							obj.readable = true;
						}
						if(type === 's')
						{
							obj.writable = true;
						}
					}
					else
					{
						throw new Error("Couldn't parse getter for code: " + code);
						return null;
					}
					
				// debug
					if(this.debug)
					{
						trace(' > ACCESSOR: ' + obj.name);
					}
		
				// comment
					this.parseComment(comment, obj);
		
				// return
					return obj;
			},
			
		// --------------------------------------------------------------------------------
		// utilities
	
			toString:function()
			{
				return '[class Source members="' +this.members.length+ '" path="' +URI.asPath(this.uri, true)+ '"]';
			},

	}
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                                         ██                               
//  ██                                             ██                               
//  ██     █████ ██ ██ ████ █████ █████      █████ ██ █████ █████ █████ █████ █████ 
//  ██████ ██ ██ ██ ██ ██   ██    ██ ██      ██    ██    ██ ██    ██    ██ ██ ██    
//      ██ ██ ██ ██ ██ ██   ██    █████      ██    ██ █████ █████ █████ █████ █████ 
//      ██ ██ ██ ██ ██ ██   ██    ██         ██    ██ ██ ██    ██    ██ ██       ██ 
//  ██████ █████ █████ ██   █████ █████      █████ ██ █████ █████ █████ █████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Source classes

	// --------------------------------------------------------------------------------
	// structure
	
		/*
			+- Comment						class, text, line
			|	+- Heading					class, text, line, desc, level
			|	+- DocComment				class, text, line, tags
			|		+- Element				class, text, line, tags, object, name
			|			+- Variable			class, text, line, tags, object, name, type, 
			|			|	+- Accessor		class, text, line, tags, object, name, type, accessor
			|			+- Function			class, text, line, tags, object, name, params, returns, signature
			|			+- Class			class, text, line, tags, object, name, members, constructor
			|
			+- Tag							class, text
				+- Value					class, text, type
					+- Param				class, text, type, name
			
		*/

	// --------------------------------------------------------------------------------
	// classes
	// --------------------------------------------------------------------------------

		Source.classes =
		{
				
			// Elements
				Comment				:null,
				Heading				:null,
				Element				:null,
				Variable			:null,
				Accessor			:null,
				Function			:null,
				Class				:null, //TODO implement Source.classes.Class class
				
			// Tags
				Tag					:null,
				Value				:null,
				Param				:null,
		}

		/**
		 * Base class to represent comments, and items that have comments
		 * @class
		 */
		Source.classes.Comment =
		{
			class		:null,
			line		:null,
			text		:[],
			
			/**
			 * @constructor
			 * @param	{String}	text	Description
			 * @param	{Number}	line	Description
			 */
			init:function(text, line)
			{
				this.class		= 'Comment';
				this.line		= line || null;
				this.text		= [];
				this.addText(text);
			},
				
			addText:function(text, newLine)
			{
				if(text !== undefined)
				{
					if(newLine)
					{
						this.addText();
					}
					var text = (text || '').trim();
					this.text.push(text);
				}
				return this;
			},
			
			getText:function()
			{
				return this.getAllText().shift();
			},
			
			getExtraText:function()
			{
				return this.getAllText().slice(1).join('\n');
			},
			
			getAllText:function()
			{
				return this.text.join(' \n').split(' \n \n');
			},
			
			toString:function()
			{
				return '[object Comment text="' +(this.class ? this.getText() : '')+ '"]';
			}
		}
		
		/**
		 * Represents Heading comments in source code
		 * @class
		 * @extends		{Source.classes.Comment}
		 */
		Source.classes.Heading =
		{
			init:function(text, desc, line, level)
			{
				this._super(text, line);
				this.level		= level || 1;
				this.addText(desc || '');
				this.class		= 'Heading';
			},
				
			getText:function()
			{
				return this.text[0];
			},
			
			toString:function()
			{
				return '[object Heading level="' +this.level+ '" text="' +(this.class ? this.getText() : '')+ '"]';
			}
		}
		
		/**
		 * Base class for anything doc commentable
		 * @class
		 * @extends		{Source.classes.Comment}
		 */
		Source.classes.DocComment =
		{
			tags		:{},
			flags		:{},
			
			init:function(text, line)
			{
				this._super(text, line);
				this.class		= 'DocComment';
				this.flags		= {};
				this.tags		= {};
			},
			
			/**
			 * Adds a tag to the element
			 * @param	{String}	name	The name of the tag
			 * @param	{String}	value	The value of the tag
			 * @returns	{Element}			The original Element object
			 */
			addTag:function(name, value)
			{
				if( ! this.tags[name])
				{
					this.tags[name] = [];
				}
				if(typeof value === 'string')
				{
					value = new Source.classes.Tag(value);
				}
				this.tags[name].push(value);
				return value;
			},

			/**
			 * Gets the first tag of a particular name
			 * @param	{String}	name	The name of the tag
			 * @returns	{Tag}				The Tag or Param, if it exists
			 */
			getTag:function(name)
			{
				return this.tags[name] ? this.tags[name][0] : null;
			},

			/**
			 * Gets all tags for the particular name
			 * @param	{String}	name	The name of the Tag
			 * @returns	{Array}				An Array of Tags or Params if they exist
			 */
			getTags:function(name)
			{
				var obj = name ? this.tags[name] : this.tags;
				if(obj)
				{
					var tags = [];
					for each(var tag in obj)
					{
						tags.push(tag);
					}
					return tags;
				}
				return [];
			},
			
			/**
			 * Adds a tag to the element
			 * @param	{String}	name	The name of the flag
			 * @returns	{Element}			The original Element object
			 */
			addFlag:function(name)
			{
				name = name === 'constructor' ? 'isConstructor' : name;
				this.flags[name] = true;
				return this;
			},

			getFlag:function(name)
			{
				name = name === 'constructor' ? 'isConstructor' : name;
				return this.flags[name];
			},
			
			getFlags:function()
			{
				return this.flags;
			},

			reorderProps:function()
			{
				var text = this.text;
				delete this.text;
				this.text = text;
				
				var flags = this.flags;
				delete this.flags;
				this.flags = flags;
				
				var tags = this.tags;
				delete this.tags;
				this.tags = tags;
			},

			toString:function()
			{
				return '[object DocComment text="' +this.text+ '" tags="' +(this.class ? this.getTags().length : '')+ '"]';
			}
		}
		
	// --------------------------------------------------------------------------------
	// Elements
	// --------------------------------------------------------------------------------

		/**
		 * Base class for source elements, such as Objects, Functions, Variables, etc
		 * @class
		 * @extends		{Source.classes.DocComment}
		 */
		Source.classes.Element =
		{
			object		:null,
			name		:'',
			
			init:function(name, text, line)
			{
				this._super(text, line);
				this.class		= 'Element';
				this.name		= name;
				this.object		= null;
			},
			
			toString:function()
			{
				return '[object Element text="' +this.text+ '" tags="' +(this.class ? this.getTags().length : '')+ '"]';
			}
		}
		
		/**
		 * Represents Variables or Objects in source code
		 * @class
		 * @extends		{Source.classes.Element}
		 */
		Source.classes.Variable =
		{
			type		:'',
			
			init:function(name, type, text, line)
			{
				this._super(name, text, line);
				this.class		= 'Variable';
				this.type		= type;
				this.reorderProps();
			},
				
			toString:function()
			{
				return '[object Variable name="' +this.name+ '" type="' +this.type+ '" text="' +(this.class ? this.getText() : '')+ '"]';
			}
		}
		
		/**
		 * Represents Accessors in source code
		 * @class
		 * @extends		{Source.classes.Variable}
		 */
		Source.classes.Accessor =
		{
			readable	:false,
			writable	:false,
			acesss		:'',
			
			init:function(name, type, text, accessor, line)
			{
				this._super(name, type, text);
				this.class		= 'Accessor';
				this.readable	= accessor == 'get';
				this.writable	= accessor == 'set';
				this.reorderProps();
			},
			
			getAccess:function()
			{
				var accessors = [];
				if(this.readable)
				{
					accessors.push('read');
				}
				if(this.writable)
				{
					accessors.push('write');
				}
				return accessors.join(' and ').toSentenceCase();
			},
			
			toString:function()
			{
				return '[object Accessor name="' +this.name+ '" type="' +this.type+ '" access="' +(this.class ? this.getAccess() : '')+ '" text="' +this.text+ '"]';
			}
		}
		
	// --------------------------------------------------------------------------------
	// Function

		/**
		 * Represents Functions in source code
		 * @class
		 * @extends		{Source.classes.Element}
		 */
		Source.classes.Function =
		{
			// --------------------------------------------------------------------------------
			// properties
			
				name		:'',
				signature	:'',
				
				init:function(signature, text, params, returns, line)
				{
					// name
						var name = ''
						if(signature)
						{
							var matches = String(signature).match(/(\w+)\s*\(/);
							if(matches)
							{
								name = matches[1];
							}
						}
						
					// super
						this._super(name, text, line);
						this.tags		= {};
						this.class		= 'Function';
						
					// params
						if(params)
						{
							for each(var param in params)
							{
								this.addParam(param.name, param.type, param.text);
							}
						}
						
					// returns
						if(returns)
						{
							for each(var value in returns)
							{
								this.addReturn(value.type, value.text);
							}
						}
						
					// update tags
						this.reorderProps();
		
					// return
						return this;
				},
			
			// --------------------------------------------------------------------------------
			// setters
			
				setSignature:function(name, params)
				{
					this.name		= name;
					this.signature	= name + '(' + params + ')';
					return this;
				},

				addParam:function(name, type, text)
				{
					var param = new Source.classes.Param(name, type.replace(/\W/g, ''), text);
					this.addTag('param', param);
					return param;
				},

				addReturn:function(type, text)
				{
					var param = new Source.classes.Value(type.replace(/\W/g, ''), text);
					this.addTag('return', param);
					return param;
				},

			// --------------------------------------------------------------------------------
			// getters
			
				getParams:function()
				{
					return this.getTags('param');
				},
				
				getReturns:function()
				{
					return this.getTags('return');
				},
			
			// --------------------------------------------------------------------------------
			// methods
			
				toString:function()
				{
					return '[object Function signature="' +this.signature+ '" params="' +(this.class ? this.getTags('param').length : '')+ '" returns=' +(this.class ? this.getTags('returns').length : '')+ '"]';
				}
		}
		
	// --------------------------------------------------------------------------------
	// Class

		/**
		 * Represents a Class in source code
		 * @class
		 * @extends		{Source.classes.Element}
		 */
		Source.classes.Class =
		{
			// --------------------------------------------------------------------------------
			// properties
			
				members		:[],
				
				init	:function(name, text, members, line)
				{
					// super
						this._super(name, text, line);
						this.tags = {};
						
					// variables
						this.class = 'Class';
						if(members && members instanceof Array)
						{
							this.members = members;
						}
						
					// update tags
						this.reorderProps();
		
					// return
						return this;
				},
			
			// --------------------------------------------------------------------------------
			// methods
			
				addMember:function(member)
				{
					this.members.push(member);
				},
			
				getConstructor:function()
				{
					for each(var member in this.members)
					{
						if(member.getFlag('constructor'))
						{
							return member;
						}
					}
				},
				
				getProperties:function()
				{
					var members = [];
					for each(var member in this.members)
					{
						if( ! member instanceof Source.classes.Function )
						{
							members.push(member);
						}
					}
					return members;
				},
				
				getMethods:function()
				{
					var members = [];
					for each(var member in this.members)
					{
						if(member instanceof Source.classes.Function)
						{
							members.push(member);
						}
					}
					return members;
				},
				
				getMembers:function()
				{
					return this.members;
				},
				
				toString:function()
				{
					return '[object Class members="' +(this.class ? this.members.length : '')+ '"]';
				}
		}
		
	// --------------------------------------------------------------------------------
	// Tags

		/**
		 * Represents values
		 * @class
		 */
		Source.classes.Tag =
		{
			class		:null,
			text		:'',
			
			init	:function(text)
			{
				this.class		= this.class || 'Tag';
				this.text		= String(text).trim();
			},
			
			toString:function()
			{
				return '[object Tag text="' +this.text+ '"]';
			}
		}
		
		/**
		 * Represents Function return values 
		 * @class
		 * @extends		{Source.classes.Tag}
		 */
		Source.classes.Value =
		{
			type		:'',
			
			init	:function(type, text)
			{
				this.class		= this.class || 'Value';
				this.type		= String(type).trim();
				this._super(text);
			},

			toString:function()
			{
				return '[object Value type="' +this.type+ '" text="' +this.text+ '"]';
			}
		}
		
		/**
		 * Represents function Parameters
		 * @class
		 * @extends		{Source.classes.Value}
		 */
		Source.classes.Param =
		{
			name		:'',
			
			init	:function(name, type, text)
			{
				this.class		= this.class || 'Param';
				this.name		= String(name).trim();
				this._super(type, text);
			},

			toString:function()
			{
				return '[object Param name="' +this.name+ '" type="' +this.type+ '" text="' +this.text+ '"]';
			}
		}
		
	// ------------------------------------------------------------------------------------------------------------------------
	// Final setup
	
		// extensions
		
			Source.classes.Comment				= Class.extend(Source.classes.Comment);
			Source.classes.Heading				= Source.classes.Comment.extend(Source.classes.Heading);
			Source.classes.DocComment			= Source.classes.Comment.extend(Source.classes.DocComment);
			Source.classes.Element				= Source.classes.DocComment.extend(Source.classes.Element);
			Source.classes.Variable				= Source.classes.Element.extend(Source.classes.Variable);
			Source.classes.Accessor				= Source.classes.Variable.extend(Source.classes.Accessor);
			Source.classes.Function				= Source.classes.Element.extend(Source.classes.Function);
			
			Source.classes.Tag					= Class.extend(Source.classes.Tag);
			Source.classes.Value				= Source.classes.Tag.extend(Source.classes.Value);
			Source.classes.Param				= Source.classes.Value.extend(Source.classes.Param);
				
		// toStrings
		
			Source.classes.Comment.toString		= function(){return '[class Source.classes.Comment]'; }
			Source.classes.Heading.toString		= function(){return '[class Source.classes.Heading]'; }
			Source.classes.DocComment.toString	= function(){return '[class Source.classes.DocComment]'; }
			
			Source.classes.Element.toString		= function(){return '[class Source.classes.Element]'; }
			Source.classes.Variable.toString	= function(){return '[class Source.classes.Variable]'; }
			Source.classes.Accessor.toString	= function(){return '[class Source.classes.Accessor]'; }
			Source.classes.Function.toString	= function(){return '[class Source.classes.Function]'; }
		
			Source.classes.Tag.toString			= function(){return '[class Source.classes.Tag]'; }
			Source.classes.Value.toString		= function(){return '[class Source.classes.Value]'; }
			Source.classes.Param.toString		= function(){return '[class Source.classes.Param]'; }
		
	// ------------------------------------------------------------------------------------------------------------------------
	// register class

		xjsfl.classes.register('Source', Source);
