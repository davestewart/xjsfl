// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * filename examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);

	// variables
		var arr = [1, 2, 3, 4, [5, 6, 7, 8, [9, 10, 11, 12, 13], 14, 15, 16, 17], 18, 19, 20, 21];
		var obj = {a:1, b:2, c:3, d:4, e:{a:5, b:6, c:7, d:8, e:{a:9, b:10, c:11, d:12, e:13}, f:14, g:15, h:16, i:17}, f:18, g:19, h:20, i:21 };

		function indent(depth)
		{
			return Utils.pad(null, depth, '	');
		}
		
	// --------------------------------------------------------------------------------
	// Objects and Arrays

		/**
		 * Walk the structure of an Object or Array
		 */
		function walkObject()
		{
			function process(value, index, depth)
			{
				trace(indent(depth) + '[' +index+ '] ' + value);
			}

			Utils.walk(arr, process);
			Utils.walk(obj, process);
		}

		/**
		 * Skip elements by returning a Boolean false from the callback
		 */
		function walkObjectSkip()
		{
			function process(value, index, depth)
			{
				if(index > 0 && depth > 0 && index % 2 == 0)
				{
					return false;
				}
				trace(indent(depth) + '[' +index+ '] ' + value);
			}

			Utils.walk(arr, process);
		}

		/**
		 * Find an element by returning a Boolean true from the callback
		 */
		function walkObjectFind()
		{
			function process(value, index, depth)
			{
				trace(indent(depth) + '[' +index+ '] ' + value);
				if(Utils.getValues(value).indexOf(Number(search)) !== -1)
				{
					return true;
				}
			}

			var search = prompt('Enter a number (1 - 21) to return the parent');
			var result = Utils.walk(obj, process);

			result ? inspect(result, 'Found') : trace('Nothing was found');
		}

		/**
		 * Process custom objects (in this case, folders) by providing a callback to get contents
		 */
		function walkObjectProcess()
		{
			// the function to process the children
				function process(element, index, depth)
				{
					trace (indent(depth) + '/' + element.name);
				}

			// the function to identify the children
				function getContents(element)
				{
					return element instanceof Folder ? element.contents : null;
				}

			// start processing
				var folder = new Folder('{user}');
				Utils.walk (folder, process, getContents)
		}

	// --------------------------------------------------------------------------------
	// Filesystem

		/**
		 * Call a callback function on each of the iterated items
		 */
		function walkFolderCallback()
		{
			function callback(element, index, level, indent)
			{
				trace(indent + '/' + element.name);
			}

			Utils.walkFolder('{user}', callback);
		}

		/**
		 * Collect all paths from a folder
		 */
		function walkFolderCollect()
		{
			function collect(element)
			{
				paths.push(element.path);
			}

			var paths = [];
			Utils.walkFolder('{user}', collect);
			list(paths)
		}

		/**
		 * Skip processing of subfolders where the parent folder has the letter a in it
		 */
		function walkFolderSkip()
		{
			function callback(element, index, level, indent)
			{
				if(element instanceof Folder && element.name.indexOf('a') != -1)
				{
					return false;
				}
				trace(indent + '/' + element.name);
			}

			Utils.walkFolder('{user}', callback);
		}

		/**
		 * Find a file by searching folders and comparing contents
		 */
		function walkFolderFind()
		{
			// set up the callback function
				function callback(element, index, level, indent)
				{
					trace(indent + '/' + element.name);
					if(element instanceof File && element.contents.indexOf(search) > -1)
					{
						return true;
					}
				}

			// promt the user and search
				var search = prompt('Enter some text to find', 'Find a file by searching folders and comparing contents')
				var result = Utils.walkFolder('{user}', callback);

			// do something with the result
				result ? trace(result) : trace('Nothing was found');

		}

