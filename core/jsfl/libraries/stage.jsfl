// ------------------------------------------------------------------------------------------------------------------------
//
//                                        ██   ██   ██   
//  ██████  ██                           ██  ██████  ██  
//  ██      ██                          ██   ██       ██ 
//  ██     █████ █████ █████ █████      ██   ██       ██ 
//  ██████  ██      ██ ██ ██ ██ ██      ██   ██████   ██ 
//      ██  ██   █████ ██ ██ █████      ██       ██   ██ 
//      ██  ██   ██ ██ ██ ██ ██         ██       ██   ██ 
//  ██████  ████ █████ █████ █████       ██  ██████  ██  
//                        ██              ██   ██   ██   
//                     █████                             
//
// ------------------------------------------------------------------------------------------------------------------------
// Stage - CSS-style selection of layers, frames and elements

	// ------------------------------------------------------------------------------------------------
	// Stage selector
	
		/**
		 * Stage Selection function to return an ElementCollection of stage elements
		 * @param	selector	{String}				A selector expression
		 * @param	context		{Context}				A valid Context instance
		 * @returns				{ElementCollection}		An Element Collection
		 */
		$ = function(selector, context)
		{
			if(context)
			{
				context.goto();
			}
			else
			{
				context = Context.create();
			}
			
			var elements = [];
			
			if(typeof selector === 'string')
			{
				switch(selector)
				{
					case '*':
						var selection = dom.selection;
						dom.selectAll();
						elements = dom.selection;
						dom.selectNone();
						dom.selection = selection;
					break;
				
					case ':frame':
						elements = context.frame.elements;
					break;
				
					case ':selection':
					case ':selected':
						elements = dom.selection;
				}
			}
			
			else if(typeof selector === 'undefined')
			{
				elements = dom.selection;
			}
			
			else if(xjsfl.utils.isArray(selector))
			{
				elements = selector;
			}
			

			return new ElementCollection(elements);
		}
		
	xjsfl.classes.register('$', $);

