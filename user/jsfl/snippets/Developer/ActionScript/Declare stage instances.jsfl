/**
 * Generates AS3 class declarations for scriptable stage elements
 *
 * @author      Dave Stewart
 */

	// --------------------------------------------------------------------------------
	// setup
	
		// init
			xjsfl.init(this, ['ActionScript', 'Selectors', 'ElementSelector']);
	
		// variables
			var imports		= {};
			var elements	= [];
			var unnamed		= [];

	// --------------------------------------------------------------------------------
	// process
	
		// callback
			function processElement(element)
			{
				if(element.name)
				{
					var classPath = ActionScript.getClass(element);
					if(classPath)
					{
						var className		= classPath.split('.').pop();
						imports[classPath]	= 'import ' + classPath + ';';
						elements.push('public var {name}	:{type};'.inject(element.name, className));
					}
				}
				else
				{
					unnamed.push(element);
				}
			}
			
		// process scriptable elements
			var collection = $(':scriptable').each(processElement);
			
	// --------------------------------------------------------------------------------
	// output
	
		if(elements.length)
		{
			// format
				imports		= Utils.sort(Utils.getValues(imports), false, true).join('\n');
				elements	= Utils.columnizeText(elements.join('\n'), 1);
		
			// output
				clear();
				format('{imports}\n\n{elements}\n', imports, elements);
				
			// select any unnamed items on stage
				if(unnamed.length)
				{
					$selection = unnamed;
					alert('The selected items are unnamed, so were skipped in the output process.');
				}
		}
