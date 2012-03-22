// ------------------------------------------------------------------------------------------------------------------------
//
//                                                                                                      ██   ██   ██
//  ██████ ██                             ██        ██████       ██              ██                    ██  ██████  ██
//  ██     ██                             ██        ██           ██              ██                   ██   ██       ██
//  ██     ██ █████ ████████ █████ █████ █████      ██     █████ ██ █████ █████ █████ █████ ████      ██   ██       ██
//  █████  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██  ██        ██████ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██        ██   ██████   ██
//  ██     ██ █████ ██ ██ ██ █████ ██ ██  ██            ██ █████ ██ █████ ██     ██   ██ ██ ██        ██       ██   ██
//  ██     ██ ██    ██ ██ ██ ██    ██ ██  ██            ██ ██    ██ ██    ██     ██   ██ ██ ██        ██       ██   ██
//  ██████ ██ █████ ██ ██ ██ █████ ██ ██  ████      ██████ █████ ██ █████ █████  ████ █████ ██         ██  ██████  ██
//                                                                                                      ██   ██   ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Element Selector ($) - CSS-style selection of layers, frames and elements

	/**
	 * Element Selector function to return an ElementCollection of stage elements
	 *
	 * @param	{String}				selector	A selector expression
	 * @param	{Array}					context		An optional Array of Elements
	 * @param	{ElementCollection}		context		An optional ElementCollection instance
	 * @param	{Context}				context		An optional Context instance
	 * @returns	{ElementCollection}					An Element Collection
	 */
	$ = function(expression, context, debug)
	{
		// --------------------------------------------------------------------------------
		// resolve context and elemets

			// variables
				var elements;
				var dom;

			// throw error if expression is not a string
				if(typeof expression !== 'string')
				{
					//throw new TypeError('TypeError in $(): parameter "expression" must be a string');
				}

			// resolve context
				if(context)
				{
					// ElementCollection
						if(context instanceof ElementCollection)
						{
							elements	= context.elements;
							dom			= context.dom;
						}

					// Array
						else if(context instanceof Array)
						{
							elements	= context;
							dom			= $dom; // unexpected results may occur if the dom doesn't reflect the location of the elements
						}

					// Timeline
						else if(context instanceof Timeline)
						{
							//TODO Add ability to pass in Timeline, without going there
							dom			= true;
						}

					// Context
						else if(context instanceof Context)
						{
							context.goto();
							dom			= context.dom;
						}
				}

			// current document
				else
				{
					if($dom)
					{
						context		= Context.create();
						dom			= context.dom;
					}
				}

		// --------------------------------------------------------------------------------
		// resolve elements if not already

			if(dom)
			{
				// grab all elements from all layers at current time
					if( ! elements)
					{
						var elements = [];
						for each(var layer in context.timeline.layers)
						{
							if(layer.layerType == 'folder')
							{
								continue;
							}
							if( ! layer.locked )
							{
								context.setLayer(layer).setFrame(true)
								elements = elements.concat(context.frame.elements);
							}
						}
					}
					
				// filter items
					if(typeof expression === 'string')
					{
						elements = Selectors.select(expression, elements, dom, debug);
					}
					else
					{
						elements = expression;
					}

				// return
					if(Utils.isArray(elements))
					{
						return new ElementCollection(elements);
					}
			}
			else
			{
				throw new ReferenceError('ReferenceError in $(): You need to open a document before attempting to select elements');
			}


	}

	xjsfl.classes.register('$', $);
