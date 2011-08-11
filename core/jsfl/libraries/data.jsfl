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

	// ------------------------------------------------------------------------------------------------
	// Class
	
		//TODO Assess fesibility of moving Output.inspect functions to Data as a generic recurse method
	
		
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
			 * @param	arg2		{Function}	An optional callback of the format callback(element, index, level, indent) to call on each element. Return false to skip processing of that element
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
							
						// process
							if(state !== false)
							{
								// path
									paths.push(element.path);
									
								// children
									if(element instanceof Folder && level < depth)
									{
										level ++;
										indent += '	';
										element.each(process);
										indent = indent.substring(1);
										level--;
									}
							}
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
							process(folder);
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
	
		
		
// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.init(this);
			clear();
			try
			{
				
		// --------------------------------------------------------------------------------
		// Default iteration returns the array of iterated paths
		
			if(0)
			{
				var paths = Data.recurseFolder('c:/temp/test/');
				trace(paths.join('\n'));
			}
					
		
		// --------------------------------------------------------------------------------
		// Call a callback function on each of the iterated items
		
			if(0)
			{
				function callback(element, index, level, indent)
				{
					trace (indent + '/' + element.name);
				}
				
				Data.recurseFolder('c:/temp/test/', callback);
			}
					
		// --------------------------------------------------------------------------------
		// Skip subfolders with the letter a in them
		
			if(1)
			{
				function callback(element, index, level, indent)
				{
					return element.name.indexOf('a') == -1;
				}
				
				var paths = Data.recurseFolder('c:/temp/test/', callback);
				trace(paths.join('\n'));
			}
					
		
		// --------------------------------------------------------------------------------
		// Test
		
			if(0)
			{
				// stuff
					//Data.recurse (new Folder('c:/temp/'))
							 
					function traceElement(element, index, level)
					{
						var indent = Array(level).join('\t')
						fl.trace (indent + '/' + element.name);
					}
					
					function testFolder(element)
					{
						return element instanceof Folder;
					}
					
						
					Data.recurse (new Folder ('c:/temp/'), traceElement, testFolder)
					
					
				/*
				*/
				
				/*
					// object & scope example
					
					fl.outputPanel.clear();
					
					var obj =
					{
						str:'',
						
						arr:[1,2,3,4,[1,2,3,4,[1,2,3,4],5,6,7,8],4,5,6,7],
					
						traceElement:function(element, index, level)
						{
							var indent = new Array(level + 1).join('\t');
							var str = indent + level + ' : ' + element + '\n';
							this.str += str;
						},
						
						testElement:function(element, level, index)
						{
							return element instanceof Array;
						},
						
						start:function()
						{
							Data.recurse(this.arr, this.traceElement, this.testElement, this)
						}
						
					}
					
					//obj.start();
					//fl.trace(obj.str);
				*/
				
				/*
					// function example
					
					function traceElement(element, index, level)
					{
						var indent = new Array(level + 1).join('\t');
						fl.trace (indent + level + ' : ' + element);
					}
					
					function testElement(element, level, index)
					{
						return element instanceof Array;
					}
					
					fl.outputPanel.clear();
					
					var arr = [1,2,3,4,[1,2,3,4,[1,2,3,4],5,6,7,8],4,5,6,7];
					
					Data.recurse(arr, traceElement, testElement)
					
				
				*/
			}
		
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
		

