// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code

	/**
	 * Filesystem examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();

		var temp = xjsfl.uri + 'user/temp/';

	// --------------------------------------------------------------------------------
	// Files

		/**
		 * create a new file and inspect its properties
		 * 
		 * @param	{String}	filename	The filename
		 * @param	{String}	folder		The folder
		 * @returns	{String}				A new folder
		 */
		function fileCreate()
		{
			var file	= new File(temp + 'this/is/a/new/file.txt', 'this a new text file')
			var folder	= file.parent;

			fl.trace('file: ' + file.toString(true))
			fl.trace('file contents: ' + file.contents)

			fl.trace('parent: ' + folder)
			fl.trace('grandparent: ' + folder.parent)
		}

		/**
		 * Create a new file, copy it, and inspect creation dates
		 */
		function fileCopy()
		{
			var file	= new File(temp + 'test.jsfl').save()
			var copy	= file.copy(temp + 'a/new/folder/')

			fl.trace('file: ' + file.createdDate);
			fl.trace('copy: ' + copy.createdDate);
		}
		
		/**
		 * Create, copy, write to and open a text file
		 */
		function fileCopyWrite()
		{
			var file = new File(temp + 'test.txt', 'Some content')
				.copy(temp + 'test copy.txt')
				.write(' and some more', true)
				.open();
		}

		/**
		 * Create and open a new ActionScipt file
		 */
		function fileOpenAS()
		{
			var file = new File(temp + 'test.fla').open();
			var file = new File(temp + 'some file.as', '// this is a new ActionScipt file').open();
		}

		/**
		 * open / create a word document
		 */
		function fileOpenWord()
		{
			var file = new File(temp + 'document.doc', 'this is a new word document').open();
		}
		
		/**
		 * Write to a writable and unwritable file and see the results
		 */
		function fileWritable()
		{
			// clear the existing file
				var file = new File('writable.txt', '', true);
				
			// create the new (unsaved) file reference
				var file = new File('writable.txt');
				
			// check contents
				file.writable = false;
				var written = file.write('Hello!');
				
			// results
				trace('Writing to unwritable file...');
				trace('contents: ' + file.contents);
				trace('writable: ' + file.writable);
				trace('written : ' + written);
				trace('saved:    ' + file.saved);
				
			// set unwritable and attempt to write
				file.writable = true;
				var written = file.write('Goodbye!');
				
			// results
				trace('\nWriting to writable file...');
				trace('contents: ' + file.contents)
				trace('writable: ' + file.writable);
				trace('written : ' + written);
				trace('saved:    ' + file.saved);
		}

	// --------------------------------------------------------------------------------
	// Folders

		/**
		 * list the contents of folder
		 */
		function folderList()
		{
			var folder		= new Folder('c:/temp');
			for each(var item in folder.contents)
			{
				trace(item.toString(true))
			}
		}

		/**
		 * iterate over the contents of a folder
		 */
		function folderEach()
		{
			new Folder('c:/temp').each(function(e, i){trace(i, e)});
		}
		
		/**
		 * list the filtered contents of folder
		 */
		function folderFilter()
		{
			var files = new Folder('c:/temp').filter(/\.txt$/)
			for each(var item in files)
			{
				trace(item);
			}
		}


	// --------------------------------------------------------------------------------
	// Recursive

		/**
		 * recursively list the contents of a folder
		 */
		function folderRecurse()
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

			recurse(new Folder(temp), function(e, i, l, indent){fl.trace(indent + '/' +  e.name)}, function(e){return e instanceof Folder})
		}

		/**
		 * Same function, but tweetable (136 characters)
		 */
		function folderRecurseShort()
		{
			var n='\t';function l(e){trace(n+'/'+e.name);if(e instanceof Folder){ n+='\t';e.each(l);n=n.substr(1);}}var f=new Folder('c:/temp');l(f)
		}

		/**
		 * Same function, but using the Output.folder()
		 */
		function folderOutput()
		{
			Output.folder(temp, 5, true);
		}

		//TODO - implemement Utils.walk properly!

		/**
		 * Same function, but using Utils.walk()
		 */
		function folderWalk()
		{
			var folder			= new Folder(temp);
			var fileCallback	= function(e){ trace(e) };
			var folderCallback	= function(e){ return e instanceof Folder };

			Utils.walk(folder, fileCallback, folderCallback);
		}