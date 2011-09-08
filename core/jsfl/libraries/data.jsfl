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
		 * Utility function to recurse / walk hierarchical structures calling user-supplied calllbacks on traversed elements
		 */
		/*
		*/
		recurse2:function(rootElement, fnChild, fnTestChildren)
		{
			function process(element, index)
			{
				fnChild(element, index, level);
				
				if(fnTestChildren ? fnTestChildren(element, index, level) : element.length > 0)
				{
					level ++;
					for(var i = 0; i < element.length; i++)
					{
						process(element[i], i);
					}
					level--;
				}
			}
			
			var level = 0;
			process(rootElement, 0);
		},
		
		recurse:function(rootElement, fnChild, fnTestChildren, scope)
		{
			fl.trace(this);
			function process(element, index)
			{
				//fl.trace('Processing:' + element)
	
				fnChild.apply(scope, [element, index, level]);
				
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
			}
			
			scope = scope || window;
			var level = 0;
			process(rootElement, 0);
		},
		
		/**
		 * Recursively trawl a folder's contents, optionally calling a callback per element. (NB, arguments 2 and 3 may be swapped)
		 * @param	folder		{String}	The path or uri to a valid folder
		 * @param	folder		{Folder}	A valid Folder object
		 * @param	arg2		{Function}	An optional callback of the format callback(element, index, level, indent) to call on each element. Return false to skip processing of that element. Return true to cancel all iteration.
		 * @param	arg3		{Number}	An optional max depth to recurse to, defaults to 100 
		 * @returns				(Array}		An array of paths
		 */
		recurseFolder:function(folder, arg2, arg3)
		{
			// ------------------------------------------------------------
			// functions
			
				function process(element, index)
				{
					//BUG Errors when file URIs go beyond 260 chars. @see FileSystem for more info
					
					// callback
						var state = callback ? callback(element, index, level, indent) : true;
						
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
				
			// return
				return paths;
		},
		
		toString:function()
		{
			return '[class Data]';
		}
		
	};
	
		
	xjsfl.classes.register('Data', Data);
