// init
	xjsfl.init(this);
	clear();

// --------------------------------------------------------------------------------
// functions

	ElementPrototype = function()
	{
		// properties
			this.type		= null;
			
		// properties
			this.name		= '';
			this.member		= null;
			this.setter		= null;
			this.getter		= null;
			
		// content
			this.content	= '';
			
		// meta
			this.indent		= '';
			this.level		= 0;
			this.parent		= null;
			
		// load templates
			function loadTemplate(uri)
			{
				return new Template(xjsfl.utils.createURI(uri, fl.scriptURI));
			}
			
			this.templates =
			{
				root:			loadTemplate('templates/root.txt'),
				object:			loadTemplate('templates/object.txt'),
				method:			loadTemplate('templates/method.txt'),
				gettersetter:	loadTemplate('templates/getter-setter.txt'),
				property:		loadTemplate('templates/property.txt')
			}
			
		// debug
			//trace('Loaded templates');
	}
	
	ElementPrototype.prototype =
	{
		// constructor
			init: function(thisLine, nextLine)
			{
				// variables
					var rx = /^(\t*)(\w+)\t(\w*)\t(\w*)/;
					
				// properties
					if(thisLine)
					{
						var matches 	= thisLine.match(rx);
						this.indent		= matches[1];
						this.name		= matches[2];
						if(matches[4])
						{
							this.setter		= matches[3];
							this.getter		= matches[4];
						}
						else
						{
							this.member		= matches[3];
						}
						this.level		= this.indent.length;
					}
					
				// type
					if(nextLine)
					{
						var matches 	= nextLine.match(rx);
						var indent		= matches[1];
						this.type		= indent > this.indent ? 'object' : 'method';
						
					}
					else
					{
						this.type = 'method';
					}
					
				// template
					this.template	= this.level == 0 ? this.templates.root : this.templates[this.type];
			},
			
		// public methods
			add:function(content)
			{
				if(this.content != '')
				{
					this.content += ',\n';
				}
				this.content += content;
			},
			
			render:function()
			{
				// debug
					//trace('Rendering:' + this.path);
					
				// get props
					var props	=
					{
						name:		this.name,
						content:	this.content,
						method:		this.method,
						getter:		this.getter,
						setter:		this.setter
					};
					
				// template and extra props
					if(this.member)
					{
						// method
							if(CIX.type(this.member) == 'method')
							{
								this.template	= this.templates.method;
								props.params	= CIX.params(this.member);
								props.content	= 'document.' + CIX.signature(this.member) + ';';
								props.doc		= CIX.docComment(this.member);
								if(CIX.returns(this.member))
								{
									props.content = 'return ' + props.content;
								}
							}
						
						// property
							else
							{
								this.template	= this.templates.property;
								props.param		= this.name;
								props.content	= 'document.' + this.member;
								props.doc		= CIX.docComment(this.member);
							}
					}
					
				// getter / setter
					else if(this.getter || this.setter)
					{
						this.template	= this.templates.gettersetter;
						props.params	= CIX.params(this.setter),
						props.getter	= 'document.' + CIX.signature(this.getter),
						props.setter	= 'document.' + CIX.signature(this.setter);
						props.doc		= CIX.docComment(this.getter);
					}
					
				// populate
					var content	= this.template.populate(props);
					if(this.level > 0)
					{
						content = content.indent();
					}
					
				// update
					if(this.parent)
					{
						this.parent.add(content);
					}
					
					return content;
			},
			
			toString:function()
			{
				return '[' +this.type+ ' "' +this.name+ '"]';
			},
			
			get path()
			{
				var parent = this.parent;
				var parts = [this.name];
				while(parent != null)
				{
					parts.push(parent.name);
					parent = parent.parent;
				};
				return parts.reverse().join('.');
			},
			
			template:''
	}
	
	
	Element.prototype = new ElementPrototype();
	Element.prototype.constructor = Element;
	function Element(thisLine, nextLine)
	{
		this.init(thisLine, nextLine);
	}
	
	//fl.trace('>>' + branch);
		
// --------------------------------------------------------------------------------
// CIX


	
	
	
	CIX =
	{
		nodes:(function(){
			var cix = 'file:///F|/Users/Dave%20Stewart/AppData/Local/ActiveState/KomodoEdit/6.1/apicatalogs/jsfl.cix';
			var str = xjsfl.file.load(cix).replace('<?xml version="1.0" encoding="UTF-8"?>', '');
			var xml = eval(str)
			return xml..scope.(@name == 'Document');
		})(),
		
		find:function findNode(name)
		{
			var node = this.nodes.*.(@name == name);
			return node;
		},
		
		attr:function(name, attr)
		{
			var node = this.find(name);
			return node.attribute(attr);
		},
		
		type:function(name)
		{
			var node = this.find(name);
			return node.name() == 'scope' ? 'method' : 'property';
		},
		
		doc:function(name)
		{
			var node = this.find(name);
			return node.attribute('doc');
		},
		
		signature:function(name)
		{
			var signature = String(this.attr(name, 'signature')).replace(/[\[\] ]/g, '').replace(/,/g, ', ').replace(/:\w+$/, '');
			return signature;
		},
		
		params:function(name)
		{
			var matches = this.signature(name).match(/\((.*)\)/);
			return matches ? matches[1] : '';
		},
		
		returns:function(name)
		{
			return this.attr(name, 'returns').length() != 0;
		},
		
		docComment:function(name)
		{
			// basics
				var type		= this.type(name);
				var template	= new Template(xjsfl.utils.createURI('templates/comment.txt', fl.scriptURI));
				
			// method
				if(type == 'method')
				{
					// node and params
						var node	= this.find(name);
						var params	= node.children();
						
					// params
						var strParams = '';
						for each(var param in params)
						{
							strParams += ' * @param ' +param.@name+ ' {' + param.@citdl + '} ' + param.@doc + '\n';
						}
						strParams += ' * @returns {' +node.@returns + '}\n';
						
					// props
						var props	=
						{
							doc:	this.doc(name),
							params:	strParams,
							url:	this.attr(name, 'url')
						}
				}
				
			// property
				else
				{
					var props	=
					{
						doc:	this.doc(name),
						params:	'',
						url:	this.attr(name, 'url')
					}
				}
				
			// populate and return
				template.populate(props);
				return template;
		}
		
	}
	
	//trace(CIX.docComment('addNewPublishProfile'));
	

// --------------------------------------------------------------------------------
// variables

	// lines
		var str		= new File(xjsfl.utils.createURI('superdoc.txt', fl.scriptURI)).contents;
		var lines	= str.split(/\n/);
		
	// delete empty lines
		var temp	= [];
		for(var i = 0; i < lines.length; i++)
		{
			if( ! lines[i].match(/^\s+$/g))
			{
				temp.push(lines[i]);
			}
		}
		lines		= temp;
		
	// trace
		//trace(str)
	
// --------------------------------------------------------------------------------
// main

function process()
{
	var element, rootElement, lastElement, parentElement;
	
	function close(lastElement, element)
	{
		// variables
			var i = 0;
			var level = element ? element.level : 0;
			
		// track back through parents
			parentElement = lastElement.parent;
			while(parentElement && parentElement.level >= level && i++ < lastElement.level)
			{
				parentElement.render();
				//trace(parentElement.indent + '	<== ' + parentElement.name)
				parentElement = parentElement.parent;
			}
	}
	
	for(var i = 0; i < lines.length; i++)
	{
		// variables
			element	= new Element(lines[i], lines[i + 1]);
			
		// root
			if(i == 0)
			{
				rootElement = element;
			}
			
		// if close, pop object, and populate
			if(lastElement && element.level < lastElement.level)
			{
				close(lastElement, element);
			}
			
		// set parent
			element.parent = parentElement;
			
		// if object, stick on stack
			if(element.type == 'object')
			{
				parentElement = element;
			}
			
		// else, add current function to parent element
			else
			{
				element.render();
			}
			
		// process element
			//trace(element.indent + '--> ' + element.name + ' (' +(element.parent ? element.parent.name : '') + ')')
			
		// update element
			lastElement = element;
	}
	
	close(lastElement);
	trace('Rendering')
	trace(rootElement.render())
}

process();


