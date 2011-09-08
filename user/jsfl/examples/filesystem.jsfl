// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code
	
	// initialize
	
		xjsfl.reload();
		clear();
		
		// Mac users - do a find and replace on c:/temp/ for your temp folder!
	
	// --------------------------------------------------------------------------------
	// create a new file and inspect its properties
	
		if(0)
		{
			var file	= new File('c:/temp/this/is/a/new/file.txt', 'Hello!')
			var folder	= file.parent;
			
			fl.trace('file: ' + file.toString(true))
			fl.trace('file contents: ' + file.contents)
			
			fl.trace('parent: ' + folder)
			fl.trace('grandparent: ' + folder.parent)
		}
	
	// --------------------------------------------------------------------------------
	// create a new file, copy it, and inspect creation dates
	
		if(0)
		{
			var file	= new File('c:/temp/test.jsfl').save()
			var copy	= file.copy('c:/temp/a/new/folder/')
			
			fl.trace('file: ' + file.createdDate);
			fl.trace('copy: ' + copy.createdDate);
		}
	
	// --------------------------------------------------------------------------------
	// create and open a new AS file
	
		if(0)
		{
			var file = new File('c:/temp/test.fla').open();
			var file = new File('c:/temp/some file.as', '// this is a new AS file').open();
		}
	
	// --------------------------------------------------------------------------------
	// create, copy, write to and open a text file
	
		if(0)
		{
			var file = new File('c:/temp/test.txt', 'Some content')
				.copy('c:/temp/test copy.txt')
				.write(' and some more', true)
				.open();
		}
	
	// --------------------------------------------------------------------------------
	// open / create a word document
	
		if(0)
		{
			var file = new File('c:/temp/document.doc', 'Hello!').open();
		}
	
	// --------------------------------------------------------------------------------
	// list the contents of folder
	
		if(0)
		{
			var folder		= new Folder('c:/temp');
			for each(var item in folder.contents)
			{
				trace(item.toString(true))
			}
		}
	
	// --------------------------------------------------------------------------------
	// iterate over the contents of a folder
	
		if(0)
		{
			new Folder('c:/temp').each(function(e, i){trace(i, e)});
		}
	// --------------------------------------------------------------------------------
	// list the filtered contents of folder
	
		if(0)
		{
			var files = new Folder('c:/temp').filter(/\.txt$/)
			for each(var item in files)
			{
				trace(item);
			}
		}
	
	
	// --------------------------------------------------------------------------------
	// recursively list the contents of a folder
	
		// base function
		
			if(0)
			{
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
			}
				
		// Same function, but tweetable (136 characters)
		
			if(0)
			{
				var n='\t';function l(e){trace(n+'/'+e.name);if(e instanceof Folder){ n+='\t';e.each(l);n=n.substr(1);}}var f=new Folder('c:/temp');l(f)
			}

		// Same function, but using the Output library
		
			if(1)
			{
				Output.folder('c:/temp/', 5, true);
			}
			
		// Same function, but using the Data library
		
			//TODO - implemement Data.recurse properly!
		
			if(0)
			{
				var folder			= new Folder('c:/temp');
				var fileCallback	= function(e){ trace(e) };
				var folderCallback	= function(e){ return e instanceof Folder };
				
				Data.recurse(folder, fileCallback, folderCallback);
			}