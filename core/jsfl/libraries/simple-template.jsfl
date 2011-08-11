// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                ██          ██████                      ██        ██         
//  ██                       ██            ██                        ██        ██         
//  ██     ██ ████████ █████ ██ █████      ██   █████ ████████ █████ ██ █████ █████ █████ 
//  ██████ ██ ██ ██ ██ ██ ██ ██ ██ ██      ██   ██ ██ ██ ██ ██ ██ ██ ██    ██  ██   ██ ██ 
//      ██ ██ ██ ██ ██ ██ ██ ██ █████      ██   █████ ██ ██ ██ ██ ██ ██ █████  ██   █████ 
//      ██ ██ ██ ██ ██ ██ ██ ██ ██         ██   ██    ██ ██ ██ ██ ██ ██ ██ ██  ██   ██    
//  ██████ ██ ██ ██ ██ █████ ██ █████      ██   █████ ██ ██ ██ █████ ██ █████  ████ █████ 
//                     ██                                      ██                         
//                     ██                                      ██                         
//
// ------------------------------------------------------------------------------------------------------------------------
// Simple Template - A simpler version of the Template class

	// ------------------------------------------------------------------------------------------------
	// Constructor
	
		SimpleTemplate = function(uri, data)
		{
			if(uri)
			{
				this.load(uri);
			}
			if(data)
			{
				this.populate(data)
			}
		}
		
	// ------------------------------------------------------------------------------------------------
	// Static properties
	
		SimpleTemplate.templates = {};
		SimpleTemplate.toString = function()
		{
			return '[class SimpleTemplate]';
		}
		
	// ------------------------------------------------------------------------------------------------
	// Prototype
	
		SimpleTemplate.prototype =
		{
			
			constructor:SimpleTemplate,
		
			uri:'',
			
			input:'',
			
			output:'',
			
			load:function(uri, append)
			{
				// input
					this.uri	= uri;
					//this.input	= SimpleTemplate.templates[uri];
					
				// load file
					if( ! this.input)
					{
						// load contents
							var input = new File(uri).contents;
							
						// cache?
							//SimpleTemplate.templates[uri] = input;
							
						// update input
							append ? this.input += input : this.input = input;
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
		
	// ------------------------------------------------------------------------------------------------
	// Register class with xjsfl
	
		xjsfl.classes.register('SimpleTemplate', SimpleTemplate);