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
				var result = fnChild(element, index, level);

				if(fnTestChildren ? fnTestChildren(element, index, level) : element.length > 0)
				{
					level ++;
					for(var i = 0; i < element.length; i++)
					{
						process(element[i], i);
					}
					level--;
				}

				return result;
			}

			var level = 0;
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
			fl.trace(this);
			function process(element, index)
			{
				//fl.trace('Processing:' + element)

				var result = fnChild.apply(scope, [element, index, level]);

				if(fnTestChildren ? fnTestChildren.apply(scope, [element, index, level]) : element.length > 0)
				{
					level ++;
					for(var i = 0; i < element.length; i++)
					{
						//fl.trace('Processing folder item ' +element[i]+ ':' + [element, element.length, index, level])
						process(element[i], i);
					}
					level--;
				}

				return result;
			}

			scope = scope || window;
			var level = 0;
			return process(rootElement, 0);
		},

		/**
		 * Recursively trawl a folder's contents, optionally calling a callback per element. (NB, arguments 2 and 3 may be swapped)
		 * @param	{String}	folder		The path or uri to a valid folder
		 * @param	{Folder}	folder		A valid Folder object
		 * @param	{Function}	arg2		An optional callback of the format callback(element, index, level, indent) to call on each element. Return false to skip processing of that element. Return true to cancel all iteration.
		 * @param	{Number}	arg3		An optional max depth to recurse to, defaults to 100
		 * @returns	{Array}					An array of paths
		 */
		recurseFolder:function(folder, arg2, arg3)
		{
			// ------------------------------------------------------------
			// functions

				function process(element, index)
				{

					// callback
						var state = callback ? callback(element, index, level, indent) : null;

					// process if the callback didn't return false (false = skip element)
						if(state !== false)
						{
							// path
								paths.push(element.path);

							// return if callback passed back true (true = stop all processing)
								if(state === true)
								{
									return true;
								}

							// children
								if(element instanceof Folder && level < depth)
								{
									level ++;
									indent += '	';
									var contents = element.contents;
									for(var i = 0 ; i < contents.length; i++)
									{
										if(contents[i].uri.length > 260)
										{
											//BUG Errors when file URIs go beyond 260 chars. @see FileSystem for more info
											//TODO Fix 260 character limit in File
											throw new Error('URIError in Data.recurseFolder: The uri "' +contents[i].uri+ '" is longer than the maximum 260 char length JSFL can process');
										}

										if(process(contents[i], i))
										{
											return true;
										}
									}
									indent = indent.substring(1);
									level--;
								}
						}

					// return
						return null;
				}

			// ------------------------------------------------------------
			// code

				// defaults
					var depth		= depth || 100;
					var callback	= null;

				// parameter shift
					for each(var arg in [arg2, arg3])
					{
						if(typeof arg === 'number')
							depth = arg;
						else if(typeof arg === 'function')
							callback = arg;
					}

				// folder
					if(typeof folder === 'string')
					{
						folder = new Folder(folder);
					}

				// variables
					var paths		= [];
					var indent		= '';
					var level		= 0;

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
