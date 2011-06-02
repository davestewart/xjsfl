// --------------------------------------------------------------------------------
// functions

		function populate(text, obj)
		{
			// populate
				var rx;
				for(var i in obj)
				{
					rx		= new RegExp('{' +i+ '}', 'g')
					text	= text.replace(rx, obj[i]);
				}
				
			// return
				return text;
		}
		
		function blockIndent(text, indent)
		{
			if(typeof indent == 'number')
			{
				indent = new Array(indent).join('\t');
			}
			return text.replace(/^/gm, indent);
		}
		
		function parseLine(line)
		{
			if(line)
			{
				// variables
					var matches = line.match(/^(\t*)(\w+)/);
					var indent	= matches[1];
					var name	= matches[2];
				
				// return
					return {indent:indent, level:indent.length, name:name, code:''};
			}
			return null;
		}
		
		function Element(line)
		{
			// properties
				this._jsfl = '';
				this.type = '';
				
			// methods
				this.jsfl = set(jsfl)
				{
					this._jsfl += jsfl;
				}
				
				this.render = function()
				{
					return this._jsfl;
				}
				
			// constructor
				
			
		}
		
// --------------------------------------------------------------------------------
// variables

	// init
		xjsfl.init(this);
		clear();
	
	// lines
		var str		= new File(xjsfl.utils.createURI('simpledoc.txt', fl.scriptURI)).contents;
		var lines	= str.split(/\n/);
		var level	= 0;
		trace(str)
	
	// templates	
		var objectTemplate		= new File(xjsfl.utils.createURI('templates/object.txt', fl.scriptURI)).contents;
		var functionTemplate	= new File(xjsfl.utils.createURI('templates/function.txt', fl.scriptURI)).contents;
	
// --------------------------------------------------------------------------------
// main

/*
Doc
	appearance
		stroke
			properties
			color
			size
		view
			livePreview
			zoom
			matrix
	containers
		scene
			add
			delete
			duplicate
		timeline
			edit
			exit
			get
*/

function process()
{
	function processObject(object, content)
	{
		var props	= {name:object.name, content:content};
		return blockIndent(populate('\n' + objectTemplate, props), object.indent);
	}
	
	function processFunction(object, addComma)
	{
		var props	= {name:thisLine.name, content:''};
		var str		= blockIndent(populate('\n' + functionTemplate, props), thisLine.indent);
		if(addComma)
		{
			str	+= ',';
		}
		return str;
	}
	
	function processClose(dir)
	{
		do
		{
			//Output.inspect(levels);
			var object 	= levels.pop();
			//trace('close: ' + object.name + ' (' +typeof object+ ')')
			levels.push(processObject(object, str));
			//trace('------------------------------------------------------------');
			//trace(str);
			str = '';					
		}
		while(dir++ <= 0)
	}
	
	var levels		= [];
	var str			= '';
	var thisLine, nextLine;
	
	for(var i = 0; i < lines.length; i++)
	{
		// variables
			thisLine	= parseLine(lines[i]);
			nextLine	= parseLine(lines[i + 1]);
			var type	= nextLine && nextLine.level > thisLine.level ? 'object' : 'function';
			var dir		= nextLine ? nextLine.level - thisLine.level : - thisLine.level;
			
			
		// if object, stick on stack
			if(type == 'object')
			{
				trace('obj:' + thisLine.indent + thisLine.name);
				levels.push(thisLine);
			}
			
		// else, concatenate all functions
			else
			{
				trace('fun:' + thisLine.indent + thisLine.name);
				str	+= processFunction(thisLine, dir == 0);
			}
			
		// if close, pop object, and populate
			if(dir < 0)
			{
				processClose(dir);
			}
	}
	
	processClose()
	
	Output.inspect(levels);	
}

process();