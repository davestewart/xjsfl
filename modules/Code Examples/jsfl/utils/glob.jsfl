// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code

	/**
	 * filename examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this, ['Utils']);
		clear();

	// -----------------------------------------------------------------------------------------------------------------------------------------
	// functions

		function glob(pattern)
		{
			var uri		= xjsfl.uri + 'user/jsfl/';
			var path	= URI.asPath(uri);
			
			for each(var node in pattern)
			{
				// variables
					var pattern		= node[0];
					var desc		= node[1];
					var debug		= {};
					
				// text
					var input =
					{
						pattern: pattern,
						path:    URI.toPath(uri) + pattern,
					};
					
				// glob						
					var uris		= Utils.glob(uri + pattern, false, true, debug);
					
				// results
					inspect({input:input, results:uris, 'glob debug':debug}, desc);
			}
		}
	
		/**
		 * Glob a variety of test patterns
		 * @see http://www.codeproject.com/Articles/2809/Recursive-patterned-File-Globbing
		 */
		function globFolder()
		{
			var patterns =
			[
				['*.*',				'Root files'],
				['*/',				'Root folders'],
				['*',				'Root folders and files'],
				['*t*.*',			'Root files with the letter "t" in them'],
				['*t*/',			'Root folders with the latter "t" in them'],
				['*.jsfl',			'Root files with a "jsfl" extension'],
				['*.(as|jsfl)',		'Root files with a "jsfl" or "as" extension'],
			];
			
			glob(patterns);
		}
	
		/**
		 * Recursively-glob a variety of test patterns
		 * @see http://www.codeproject.com/Articles/2809/Recursive-patterned-File-Globbing
		 */
		function globRecursive()
		{
			// uris
				var pattern	= '**/s**/*';
				var pattern	= '**/*.(as|jsfl)';
				var pattern	= '**/*.jsfl';
				var pattern	= '**.xml';
				var pattern	= '**';
				
				// IDEAS
				
				// update glob so that trailing single-star segments, without slashes, match /*$
				
				//		*		Root files
				//		*/		Root folders
				//		*>		Root everything
				//		
				//		**		All files
				//		**/		All folders
				//		**>		All files and folders
				
			var patterns =
			[
				
				['**.*',			'All files, recursively'],
				['**/',				'All folders, recursively'],
				['**',				'All folders and files, recursively'],
				
				['**/*x*.*',		'All files with the letter "x" in them, recursively'],
				['*x**/',			'All folders with the letter "x" in them, recursively'],
				['*x**',			'All files and folders with the letter "x" in them, recursively'],
				
				
				['**a*.jsfl',		'All ".jsfl" files with the letter "a" in them, recursively'],
				
				['**/*jsfl',		'All JSFL files, recursively'],
				
				['s*/**',	'All JSFL files, beneath any root folder beginning with "S", recursively'],
			];
			
			glob(patterns);
		}
	
	globRecursive()
	//globFolder()
