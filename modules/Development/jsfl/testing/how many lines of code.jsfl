
xjsfl.init(this)

clear();

var folder = new Folder(xjsfl.utils.makeURI('core'));

var snippets = new Folder(xjsfl.utils.makeURI('E:/05 - Commercial Projects/xJSFL/2 - source/4 - AS3/4 - modules/Snippets/src'));
var source = new Folder(xjsfl.utils.makeURI('E:/05 - Commercial Projects/xJSFL/2 - source/4 - AS3/_classes/com/xjsfl'));

//trace(folder)

		function recurse(root, fnChild, fnTestChildren)
		{
			var indent = '';
			var level = 0;
			
			function list(e, i)
			{
				fnChild(e, i, level, indent);
				if(fnTestChildren ? fnTestChildren(e, level) : e.length)
				{
					level ++;
					indent += '	';
					e.each(list);
					indent = indent.substring(1);
					level--;
				}
			}
			
			list(root);
			
		}
		
		var totalLines = 0;
		//recurse(folder, function(e, i, l, indent){fl.trace(indent + '/' +  e.name)}, function(e){return e instanceof Folder})
		recurse
		(
			folder,
			
			function(e, i, l, indent)
			{
				var str = indent + '/' +  e.name
				if(e instanceof File)
				{
					var lines = e.contents.split('\n').length;
					totalLines += lines;
					//str += ' (' + lines + ')';
				}
				trace(str);
			},
			function(e, level)
			{
				return (e instanceof Folder) && (! /temp|docs/.test(e.name));
			}
		)
		
		trace(totalLines)
/*		
	var lines	= 0;
	var folder	= new Folder(xjsfl.utils.makeURI('core'));
	countLines	= function(file){ lines += file.contents.split('\n').length; };
	
	Data.recurseFolder(folder, countLines);
*/

