
xjsfl.init(this);

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
	
	recurse(new Folder('c:/temp/'), function(e, i, l, indent){fl.trace(indent + '/' +  e.name)}, function(e){return e instanceof Folder})
	//recurse(new Folder('c:/temp/'), function(e, i, l, indent){fl.trace(indent + '/' +  e.name)})
