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
// Element Selector ($)

	/**
	 * Element Selector ($)
	 * @overview	CSS-style selection of Stage elements
	 * @instance	collection
	 */

	xjsfl.init(this, ['Context', 'ElementCollection', 'Selectors', 'Utils']);
		
	/**
	 * Returns an ElementCollection of stage elements
	 *
	 * @name	$
	 * @param	{String}				$expression		An optional selector expression
	 * @param	{Array}					$source			An optional Array of Elements
	 * @param	{ElementCollection}		$source			An optional ElementCollection instance
	 * @param	{Document}				$document		An optional Document instance. Defaults to the current Document
	 * @param	{Context}				$document		An optional Context instance
	 * @param	{Boolean}				$debug			An optional Boolean to debug the result of the expression parsing
	 * @returns	{ElementCollection}						An Element Collection
	 */
	$ = function($expression, $source, $document, $debug)
	{
		// --------------------------------------------------------------------------------
		// resolve parameters

			// variables
				var expression, elements, context, dom, debug;
				
			// parameter shift
				for each(var param in [$expression, $source, $document, $debug])
				{
					if(typeof param === 'string')
						expression	= param;
					else if(param instanceof Array)
						elements	= param;
					else if(param instanceof ElementCollection)
					{
						elements	= param.elements;
						dom			= param.dom;
					}
					else if(param instanceof Document)
						dom			= param;
					else if(param instanceof Context)
						context		= param;
					else if(typeof param === 'boolean')
						debug		= param;
				}
				
		// --------------------------------------------------------------------------------
		// resolve context

			// supplied context
				if(context && context.dom)
				{
					dom = context.dom || $dom;
				}

			// supplied document
				else if(dom)
				{
					context		= new Context();
					context.setDOM(dom);
					context.setTimeline(true);
				}
				
			// current document
				else if($dom)
				{
					context		= Context.create();
					dom			= context.dom;
				}
				
			// no document
				if( ! dom )
				{
					throw new ReferenceError('ReferenceError in $(): Open a document before attempting to select elements');
				}
				
		// --------------------------------------------------------------------------------
		// resolve elements

			// if we've got elements, and there's no expression, just return an ElementCollection of those elements
				if(elements && ! expression)
				{
					return new ElementCollection(elements, dom);
				}

			// otherwise, if no elements, grab all elements from all layers at current time
				if( ! elements)
				{
					elements = [];
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
				
			// finally, select elements...
				elements = Selectors.select(expression, elements, dom, debug);

			// ... and return an ElementCollection
				return new ElementCollection(elements, dom);

	}

	xjsfl.classes.register('$', $);

