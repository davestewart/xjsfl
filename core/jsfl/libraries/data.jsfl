// ------------------------------------------------------------------------------------------------------------------------
//
//  █████         ██
//  ██  ██        ██
//  ██  ██ █████ █████ █████
//  ██  ██    ██  ██      ██
//  ██  ██ █████  ██   █████
//  ██  ██ ██ ██  ██   ██ ██
//  █████  █████  ████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Data - The Data class is designed to munge data in a variety of ways

	//TODO Assess feasibility of moving Output.inspect functions to Data as a generic recurse method


	/**
	 * The Data class is designed to munge data in a variety of ways
	 */
	Data =
	{
		//TODO review recursive function signatures & implementation, & provide default callbacks if appropriate. @see Data#recurseFolder

		/**
		 * Generic function to recurse / walk hierarchical structures calling user-supplied calllbacks on traversed elements
		 * @param	{Object}	rootElement		The root element to start processing on
		 * @param	{Function}	fnChild			A callback function to call on child elements
		 * @param	{Function}	fnTestChildren	A callback function to determine whether child nodes should be processed
		 * @returns	{value}						The result of the passed fnChild function
		 */
		recurse2:function(rootElement, fnChild, fnTestChildren)
		{
			function process(element, index)
			{
				var result = fnChild(element, index, depth);

				if(fnTestChildren ? fnTestChildren(element, index, depth) : element.length > 0)
				{
					depth ++;
					for(var i = 0; i < element.length; i++)
					{
						process(element[i], i);
					}
					depth--;
				}

				return result;
			}

			var depth = 0;
			return process(rootElement, 0);
		},

		/**
		 * Generic function to recurse a data structure, processing nodes and children with callbacks
		 * @param	{Object}	rootElement		The root element to start processing on
		 * @param	{Function}	fnChild			A callback function to call on child elements
		 * @param	{Function}	fnTestChildren	A callback function to determine whether child nodes should be processed
		 * @param	{Object}	scope			An optional Object on which to appy "this" scope to
		 * @returns	{value}						The result of the passed fnChild function
		 */
		recurse:function(rootElement, fnChild, fnTestChildren, scope)
		{
			function process(element, index)
			{
				//fl.trace('Processing:' + element)

				var result = fnChild.apply(scope, [element, index, depth]);

				if(fnTestChildren ? fnTestChildren.apply(scope, [element, index, depth]) : element.length > 0)
				{
					depth ++;
					for(var i = 0; i < element.length; i++)
					{
						//fl.trace('Processing folder item ' +element[i]+ ':' + [element, element.length, index, depth])
						process(element[i], i);
					}
					depth--;
				}

				return result;
			}

			scope = scope || window;
			var depth = 0;
			return process(rootElement, 0);
		},

		/**
		 * Recursively trawl a folder's contents, optionally calling a callback per element (note that $ arguments may passed in any order)
		 * @param	{String}	folder			The path or uri to a valid folder
		 * @param	{Folder}	folder			A valid Folder object
		 * @param	{Function}	$callback		An optional callback of the format callback(element, index, depth, indent) to call on each element. Return false to skip processing of that element. Return true to cancel all iteration.
		 * @param	{Number}	$maxDepth		An optional max depth to recurse to, defaults to 100
		 * @param	{Boolean}	$returnPaths	An optional max depth to recurse to, defaults to 100
		 * @returns	{Array}						An array of URIs or paths
		 */
		recurseFolder:function(folder, $callback, $maxDepth, $returnPaths)
		{
			// ------------------------------------------------------------
			// functions

				function process(element, index)
				{
					// callback
						var state = callback ? callback(element, index, depth, indent) : null;

					// process if the callback didn't return false (false == skip element)
						if(state !== false)
						{
							// path
								paths.push(returnPaths ? element.path : element.uri);

							// return if callback passed back true (true == stop all processing)
								if(state === true)
								{
									return true;
								}

							// children
								if(element instanceof Folder && depth < maxDepth)
								{
									// dow down a level
										depth ++;
										indent += '	';

									// iterate
										var contents = element.contents;
										for(var i = 0 ; i < contents.length; i++)
										{
											// catch long URI errors
												if(contents[i].uri.length > 260)
												{
													URI.throwLengthError(contents[i].uri);
													throw new Error('URIError in Data.recurseFolder(): The uri "' +contents[i].uri+ '" is longer than the maximum 260 char length JSFL can process');
												}

											// process content
												if( process(contents[i], i) )
												{
													return true;
												}
										}

									// go up a level
										indent = indent.substring(1);
										depth--;
								}
						}

					// return
						return null;
				}

			// ------------------------------------------------------------
			// code

				// defaults
					var maxDepth	= 100;
					var callback	= null;
					var returnPaths	= false;

				// parameter shift
					for each(var arg in [$callback, $maxDepth, $returnPaths])
					{
						if(typeof arg === 'number')
							maxDepth = arg;
						else if(typeof arg === 'function')
							callback = arg;
						else if(typeof arg === 'boolean')
							returnPaths = arg;
					}

				// folder
					if(typeof folder === 'string')
					{
						folder = new Folder(folder);
					}

				// variables
					var paths		= [];
					var indent		= '';
					var depth		= 0;

				// process
					if(folder instanceof Folder && folder.exists)
					{
						process(folder, 0);
					}
					else
					{
						throw new Error('URIError in Data.recurseFolder: the folder "' +folder.path+ '" does not exist');
					}

			// return
				return paths;
		},

		toString:function()
		{
			return '[class Data]';
		}

	};

	xjsfl.classes.register('Data', Data);