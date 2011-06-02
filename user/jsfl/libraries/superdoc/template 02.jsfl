xjsfl.init(this);

fl.outputPanel.clear();
trace = fl.trace;

Template = function(uri, data)
{
	this.load(uri);
	if(data)
	{
		this.set(data);
	}
}

Template.prototype =
{
	templates:{},
	
	uri:'',
	
	file:'',
	
	input:'',
	
	output:'',
	
	_indent:'',
	
	data:{},
	
	load:function(uri)
	{
		// input
			this.uri	= uri;
			this.file	= uri.substr(uri.lastIndexOf('/') + 1)
			//this.input	= Template.prototype.templates[uri];
			
		// load file
			if( ! this.input)
			{
				var file = new File(uri);
				if(!file.exists)
				{
					throw new Error('The file "' +file.path+ '" does not exist')
				}
				this.input	= Template.prototype.templates[uri] = file.contents;
			}
			
		// return
			return this;
	},
	
	set:function(data, value, append)
	{
		if(data.constructor === Object)
		{
			this.data = data;
		}
		else if(typeof data != 'undefined' && typeof value != 'undefined')
		{
			this.data[data] = value;
		}
	},
	
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
	
	render:function()
	{
		// debug
			trace('Render: ' + this.file)
		
		// functions
			function indent(text, indent)
			{
				return text.replace(/^/gm, indent);
			}
			
		if(false)
		{
			// variables
				var rx, matches;
				var text, lines, line;
				
			// loop through lines and populate
				lines = this.input.split(/\r\n?|\n/);
				for(var i = 0; i < lines.length; i++)
				{
					// line
						line = lines[i];
						
					// auto-indentated placeholders
						/*
						rx			= /^(\s*){>(\w+)\??}/;
						matches		= text.match(rx);
						Output.inspect(matches)
						
						if(matches)
						{
							for each(var match in matches)
							{
								trace(match)
							}
						}
						*/
						
					// normal placeholders
						trace('');
						for(var key in this.data)
						{
							trace(key)
							rx		= new RegExp('{.?' +key+ '\??}', 'g')
							line	= line.replace(rx, this.data[key]);
						}
						
					// cleanup optional empty placeholders
						/*
						rx		= /(^|\r\n|\n)?\s*{>?\w+\?}/g;
						text	= text.replace(rx, '');
						*/
						
					// update line
						line[i] = line;
						
				}
				
			// join all lines
				text = lines.join('\n');
				
			// global indent
				//text = text.replace(/^/gm, this._indent);
				
			// update
				this.output = text;
				
			// return
				return this.output;
		}
		else if(false)
		{
			var text = this.input;
			for(var key in this.data)
			{
				trace(key)
				rx		= new RegExp('{.?' +key+ '\??}', 'g')
				text = text.replace(rx, this.data[key]);
			}
			this.output = text;
		}
		else
		{
			// input
				var text		= this.input;
				var lines		= text.split(/\r\n|\n/);
				var data		= {};
				var rx, matches, line, key, i, replacement;
				
			// pre-convert all data to strings, so nested Templates do not
			// re-render each time they are populated in the parent Template
				for(var key in this.data)
				{
					data[key] = String(this.data[key]);
				}
				
			// population callback
				function replace()
				{
					
				}
				
			// populate template
				for(i = 0; i < lines.length; i++)
				{
					// variable
						line = lines[i];
					
					// indented placeholders (there can only be one per line) - grab indent
						for(key in data)
						{
							rx = new RegExp('^(\s*){>' +key+ '\??})')
							if(line.match(rx) && data[key] !== undefined)
							{
								line = line.replace(rx, indent(data[key], matches[1]));
							}
						}
						
					
					// normal placeholders
						for(key in data)
						{
							rx		= new RegExp('(\s*){(>?)' +key+ '(\??)}', 'g')
							line	= line.replace(rx, data[key]);
						}
						
					// clear optional placeholders
						
						
					// update line
						lines[i] = line;
				}
				
			// text
				text = lines.join('\n');
				
			// update output
				this.output = text;
		}
		
	},
	
	toString:function()
	{
		trace('toString: ' + this.file)
		this.render();
		return this.output;
	}
	
}


var urls =
{
	object:		xjsfl.utils.createURI('templates/object.txt', fl.scriptURI),
	method:		xjsfl.utils.createURI('templates/method.txt', fl.scriptURI),
}

// inner template
var method = new Template(urls.method, {name:'test', params:'str', content:'alert(str);'});
 
// outer template
var object = new Template(urls.object, {name:'Test', content:method});
 
// render
trace(object);

