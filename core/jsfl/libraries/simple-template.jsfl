SimpleTemplate = function(uri, data)
{
	this.load(uri);
	if(data)
	{
		this.populate(data)
	}
}

SimpleTemplate.templates = {};
SimpleTemplate.toString = function()
{
	return '[class SimpleTemplate]';
}

SimpleTemplate.prototype =
{
	
	uri:'',
	
	input:'',
	
	output:'',
	
	load:function(uri)
	{
		// input
			this.uri	= uri;
			//this.input	= SimpleTemplate.templates[uri];
			
		// load file
			if( ! this.input)
			{
				var contents = new File(uri).contents;
				this.input = SimpleTemplate.templates[uri] = contents;
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


xjsfl.classes.register('SimpleTemplate', SimpleTemplate);