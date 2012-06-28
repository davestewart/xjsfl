// ------------------------------------------------------------------------------------------------------------------------
//
//                                                                                   ██   ██     ██   ██
//  ██  ██                       ██████       ██              ██                    ██  ██████ ██████  ██
//  ██  ██                       ██           ██              ██                   ██   ██     ██       ██
//  ██ █████ █████ ████████      ██     █████ ██ █████ █████ █████ █████ ████      ██   ██     ██       ██
//  ██  ██   ██ ██ ██ ██ ██      ██████ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██        ██   ██████ ██████   ██
//  ██  ██   █████ ██ ██ ██          ██ █████ ██ █████ ██     ██   ██ ██ ██        ██       ██     ██   ██
//  ██  ██   ██    ██ ██ ██          ██ ██    ██ ██    ██     ██   ██ ██ ██        ██       ██     ██   ██
//  ██  ████ █████ ██ ██ ██      ██████ █████ ██ █████ █████  ████ █████ ██         ██  ██████ ██████  ██
//                                                                                   ██   ██     ██   ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Item Selector

	/**
	 * ItemSelector ($$)
	 * @overview	CSS-style selection of items in the Libray panel
	 * @instance	
	 */

	xjsfl.init(this, ['ItemCollection', 'Selectors']);
		
	/**
	 * Item selector function
	 *
	 * @name	$$
	 * @param	{String}				$expression		An optional selector expression
	 *
	 * @param	{Item}					$source			A Library Folder Item
	 * @param	{Array}					$source			An optional Array of Library Items
	 * @param	{ItemCollection}		$source			An optional ItemCollection instance
	 * @param	{ElementCollection}		$source			An optional ElementCollection instance (its Library Items are extracted)
	 *
	 * @param	{Document}				$document		An optional Document instance. Defaults to the current Document
	 * @param	{Context}				$document		An optional Context instance
	 *
	 * @param	{Boolean}				$debug			An optional Boolean to debug the result of the expression parsing
	 * @returns	{ItemCollection}						An ItemCollection instance
	 */
	$$ = function($expression, $source, $document, $debug)
	{
		// --------------------------------------------------------------------------------
		// resolve parameters

			// variables
				var expression, items, source, context, dom, library, debug;
				
			// parameter shift
				for each(var param in [$expression, $source, $document, $debug])
				{
					if(typeof param === 'string')
						expression	= param;
					else if(param instanceof LibraryItem)
					{
						source		= param;
					}
					else if(param instanceof Array)
						items		= param;
					else if(param instanceof ItemCollection)
					{
						items		= param.elements;
						dom			= param.dom;
					}
					else if(param instanceof ElementCollection)
					{
						items		= param.items;
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
		// resolve variables
		
			// dom
				dom = dom || (context ? context.dom : null) || $dom;

			// no document
				if( ! dom )
				{
					throw new ReferenceError('ReferenceError in $$(): Open a document before attempting to select items');
				}

			// if we've got items, and there's no expression, just return an ItemCollection of those items
				if(items && ! expression)
				{
					return new ItemCollection(items, dom);
				}

			// library
				library = dom.library;
				
			// source / items
				if(source && source instanceof FolderItem)
				{
					items = library.items.filter( function(element){ return element.name.indexOf(source.name + '/') == 0; } );
				}
				else if( ! items )
				{
					items = library.items;
				}
				

		// --------------------------------------------------------------------------------
		// calculate selection and return

			// filter items
				items		= Selectors.select(expression, items, library, debug);

			// return
				return new ItemCollection(items, dom);
	}

	xjsfl.classes.register('$$', $$);
