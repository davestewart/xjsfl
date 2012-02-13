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
		/**
		 * Generic function to recurse a data structure, processing nodes and children with callbacks
		 * @param	{Object}	rootElement		The root element to start processing on
		 * @param	{Function}	fnChild			A callback function to call on child elements
		 * @param	{Function}	fnContents		An optional callback function which should return an object which can be processed for its contents, i.e. folder.contents
		 * @param	{Object}	scope			An optional Object on which to appy "this" scope to
		 * @returns	{value}						The result of the passed fnChild function
		 */
		recurse:function(rootElement, fnChild, fnContents, scope)
		{
			// processing function
				function process(element, index)
				{
					// process the element with the callback
						var result = fnChild.apply(scope, [element, index, depth]);

					// Now, depending on the result, we do one of three things:
						/*
							- Boolean false		Skip processing of this element
							- Boolean true		Stop processing and return this element
							- no return value	Continue processing child elements
						*/

					// if the result is a Boolean true, consider this element found, and return it
						if(result === true)
						{
							return element;
						}

					// if false was not returned, process the current element
						else if(result !== false)
						{
							// get the custom contents, or just use the object itself if no callback supplied
								var contents = fnContents ? fnContents.apply(scope, [element, index, depth]) : element;

							// process contents
								if( contents && ! ((typeof contents) in simpleTypes) )
								{
									depth ++;
									if(contents instanceof Array)
									{
										for (var i = 0; i < contents.length; i++)
										{
											var result = process(contents[i], i);
											if( result )
											{
												return result;
											}
										}
									}
									else
									{
										for(var name in contents)
										{
											var result = process(contents[name], name);
											if( result )
											{
												return result;
											}
										}
									}
									depth--;
								}

						}

					// return null if everything is normal
						return null;
				}

			// variables
				var simpleTypes =
				{
					'number'	:1,
					'string'	:1,
					'boolean'	:1,
					'xml'		:1,
					'function'	:1,
					'undefined'	:1
				}

			// defaults
				scope = scope || window;
				var depth = 0;

			// process
				return process(rootElement, 0);
		},

		/**
		 * Recursively trawl a folder's contents, optionally calling a callback per element (note that $ arguments may passed in any order)
		 * @param	{String}	folder			The path or uri to a valid folder
		 * @param	{Folder}	folder			A valid Folder object
		 * @param	{Function}	$callback		An optional callback of the format callback(element, index, depth, indent) to call on each element. Return false to skip processing of that element. Return true to cancel all iteration.
		 * @param	{Number}	$maxDepth		An optional max depth to recurse to, defaults to 100
		 * @returns	{Array}						An array of URIs or paths
		 */
		recurseFolder:function(pathOrURI, $callback, $maxDepth, $returnPaths)
		{
			// ------------------------------------------------------------
			// functions

				function process(element, index)
				{
					// callback
						var state = callback ? callback(element, index, depth, indent) : null;

					// return immediately if the callback returned true
						if(state === true)
						{
							return element;
						}

					// process if the callback didn't return false (false == skip element)
						if(state !== false)
						{
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
													URI.throwURILengthError(contents[i].uri);
												}

											// process content
												var result = process(contents[i], i)
												if(result)
												{
													return result;
												}
										}

									// go up a level
										indent = indent.substring(1);
										depth--;
								}
						}
				}

			// ------------------------------------------------------------
			// code

				// defaults
					var maxDepth	= 100;
					var callback	= null;
					var folder;

				// parameter shift
					for each(var arg in [$callback, $maxDepth, $returnPaths])
					{
						if(typeof arg === 'number')
							maxDepth = arg;
						else if(typeof arg === 'function')
							callback = arg;
					}

				// folder
					if(typeof pathOrURI === 'string')
					{
						var uri		= URI.toURI(pathOrURI, 1);
						folder		= new Folder(uri);
					}

				// variables
					var indent		= '';
					var depth		= 0;

				// process
					if(folder instanceof Folder)
					{
						if(folder.exists)
						{
							return process(folder, 0);
						}
						else
						{
							throw new URIError('URIError in Data.recurseFolder(): the folder "' +folder.path+ '" does not exist');
						}
					}
					else
					{
						throw new URIError('URIError in Data.recurseFolder(): the pathOrURI "' +pathOrURI+ '" must refer to a valid folder');
					}

		},

		toString:function()
		{
			return '[class Data]';
		}

	};

	xjsfl.classes.register('Data', Data);