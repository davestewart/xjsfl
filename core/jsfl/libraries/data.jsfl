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
	
		Data =
		{
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
			
			functions:
			{
				
			},
			
			toString:function()
			{
				return '[class Data]';
			}
			
		};
		
			
		xjsfl.classes.register('Data', Data);
	
		
	// ---------------------------------------------------------------------------------------------------------------------
	// code
	
		if( ! xjsfl.file.loading )
		{
			xjsfl.init(this);
		 
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
