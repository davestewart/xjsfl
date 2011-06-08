xjsfl.init(this);

fl.outputPanel.clear();
trace = fl.trace;

Template = function(uri, data)
{
	this.load(uri);
	if(data)
	{
		this.populate(data)
	}
}

Template.prototype =
{
	templates:{},
	
	uri:'',
	
	input:'',
	
	output:'',
	
	load:function(uri)
	{
		// input
			this.uri	= uri;
			//this.input	= Template.prototype.templates[uri];
			
		// load file
			if( ! this.input)
			{
				var contents = new File(uri).contents;
				this.input = Template.prototype.templates[uri] = contents;
			}
			
		// return
			return this;
	},
	
	populate:function(data)
	{
		// populate
			var rx;
			var text = this.input;
			for(var i in data)
			{
				rx		= new RegExp('{' +i+ '}', 'g')
				text	= text.replace(rx, data[i]);
			}
			
		// update
			this.output = text;
			
		// return
			return this;
	},
	
	indent:function(indent)
	{
		// indent
			switch(typeof indent)
			{
				case 'string':
					indent = indent.match(/^\t+$/) ? indent : '	';
				break;
			
				case 'number':
					indent = new Array(Math.floor(indent + 1)).join('	');
				break;
			
				default:
					indent = '	';
			}
			this.output = this.output.replace(/^/gm, indent);
			
		// return
			return this;
	},
	
	render:function()
	{
		fl.trace(this.output);
	},
	
	toString:function()
	{
		return this.output;
	}
	
}

var urls =
{
	comment:	xjsfl.utils.makeURI('templates/comment.txt', fl.scriptURI),
	property:	xjsfl.utils.makeURI('templates/property.txt', fl.scriptURI),
	method:		xjsfl.utils.makeURI('templates/method.txt', fl.scriptURI),
}

new Template(urls.comment);
new Template(urls.comment);
new Template(urls.comment);
new Template(urls.comment);
new Template(urls.property);
new Template(urls.property);
new Template(urls.property);
new Template(urls.property);
new Template(urls.method);
new Template(urls.method);
new Template(urls.method);
var method = new Template(urls.method);

			 

method.populate({name:'Dave', params:'1, 2, 3', content:'// hello'}).indent('			').render();
method.populate({name:'Ian', params:'4, 5, 6', content:'// goodbye'}).indent().render();


 new Template(urls.method)
	.populate({name:'Ian', params:'4, 5, 6', content:'// goodbye'})
	.indent()
	.render();
	
trace('>' + method.uri)