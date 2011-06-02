if( ! window.Filesystem)
{
	var configURI = 'file:///E|/02 - Current Jobs/xJSFL/';
	fl.runScript(configURI + 'xJSFL/system/jsfl/lib/Filesystem.jsfl');
}


// recursive function
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
	
	
// main code
	function createFileList(compact)
	{
		// variables	
			var arr = [];
			var uri = configURI + 'xJSFL/user/jsfl/scripts/'
			
		// callack
			function callback(element, index, level, indent)
			{
				var props = { type:(element instanceof Folder ? 'folder' : 'file'), path:element.path, level:level - 1 };
				if(element instanceof File)
				{
					var contents	= element.contents || '';
					var comments	= contents.match(/\/\*(?:(?!\*\/|\/\*)[\s\S])*(?:\/\*(?:(?!\*\/|\/\*)[\s\S])*\*\/(?:(?!\*\/|\/\*)[\s\S])*)*[\s\S]*?\*\//);
					if(comments)
					{
						var desc	= comments[0].match(/\* (\w[^\r\n]+)/);
						var icon	= comments[0].match(/@icon\s+([^\r\n]+)/);
						icon ? props.icon = icon[1] : null;
						desc ? props.desc = desc[1] : null;
					}
				}
				arr.push(props);
			}
			
		// grab files
			recurse(new Folder(uri), callback, function(e){return e instanceof Folder})
			
		// generate xml
			var xml = '';
			xml += '<files>\r\n'
			
		// loop
			for(var i = 1; i < arr.length; i++)
			{
				// variables
					var item	= arr[i];
					var name	= item.path.split('/').pop();
					
				// folder
					if(item.type == 'folder')
					{
						xml += '	<item level="' +item.level+ '" type="folder" name="' +name+ '" state="open" />\r\n';
					}
					
				// file
					else
					{
						if(name.match(/.jsfl$/))
						{
							xml += '	<item level="' +item.level+ '" type="' +item.type+ '" name="' +name.substr(0, name.length - 5)+ '" path="' +item.path + '"';
							if(item.icon != null)
							{
								xml += ' icon="' +item.icon+ '"';
							}
							if(item.desc != null)
							{
								xml += ' desc="' +item.desc.replace(/"/g, '\"')+ '"';
							}
							xml += ' />\r\n'
						}
					}
			}
			xml += '</files>\r\n'
			
		// write file
			var uri = configURI + 'xJSFL/modules/snippets/data/snippets.xml';
			var file = new File(uri, xml);
			
		// trace
			xml = compact ? xml.replace(/[\t\r\n]/g, '') : xml;
			fl.trace(xml);
	
	}
	
	
	fl.outputPanel.clear();
	createFileList();


