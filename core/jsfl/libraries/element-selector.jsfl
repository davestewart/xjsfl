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
	 * @param	selector	{String}				A selector expression
	 * @param	context		{Context}				A valid Context instance
	 * @returns				{ElementCollection}		An Element Collection
	 */
	$ = function(expression, context, debug)
	{
		// --------------------------------------------------------------------------------
		// setup

			// reference to library
				var dom	= $dom;
				if( ! dom)
				{
					return null;
				}
				var library		= dom.library;

		// --------------------------------------------------------------------------------
		// resolve context

			//TODO Review the use of context here

				if(context)
				{
					context.goto();
				}
				else
				{
					if(dom)
					{
						context = Context.create();
					}
					else
					{
						return false;
					}
				}

		// --------------------------------------------------------------------------------
		// calculate selection and return

			// resolve context

			// grab items
				var elements = [];
				for each(var layer in context.timeline.layers)
				{
					context.setLayer(layer).setFrame(true)
					elements = elements.concat(context.frame.elements);
				}

			// filter items
				elements = Selectors.select(expression, elements, context.dom, debug);

			// return
				return new ElementCollection(elements);
	}

	$.toString = function()
	{
		return '[function $]';
	}

	xjsfl.classes.register('$', $);
