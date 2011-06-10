xjsfl.init(this);
clear();

function log(str)
{
	trace('"' + str + '"');
}

function render()
{
	// utility functions
		function isBlank(str)
		{
			return str.replace(/^\s*$/g, '') === '';
		}
		
		function indent(text, indent)
		{
			return text.replace(/^/gm, indent);
		}
		
	// main replacement function
		function replace(input)
		{
			// matches
				var output, value;
				var matches = input.match(rxLocal);
				
			// handle > indented placeholder
				if(matches[2])
				{
					value	= data[matches[2]];
					output	= value !== undefined ? indent(value, matches[1]) : matches[0];
				}
				
			// handle normal placeholder
				else
				{
					value	= data[matches[3]];
					output	= value !== undefined ? value : matches[0];
				}
			
			// return, and remove empty optional placeholders
				return value === undefined && input.indexOf('?') != -1 ? '' : output;
		}
		
		
	// placeholder matching regular expressions
		var rxLocal		= /^(\s*){>(\w+)\??}|{(\w+)\??}/;
		var rxGlobal	= new RegExp(rxLocal.source, 'g');
		
	// I/O
		var lines		= input.split(/\r\n|\n/);
		var output		= [];
		
	// process lines
		for(var i = 0; i < lines.length; i++)
		{
			var result = lines[i].replace(rxGlobal, replace);
			if( ! isBlank(lines[i]) && ! isBlank(result))
			{
				output.push(result)
			}
		}
		
	// return
		return output.join('\n');
	
}
var input		= "			{>greeting} {name}\n	{>body?}";
//var input		= "			{>greeting} {name}\n	{body?}\n";

var data =
{
	greeting:	'Hello\nthere\nMr',
	name:		'Dave Stewart',
	body:		'. \nHow are \nyou today?'
}


log(input);

log(render());