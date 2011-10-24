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
// Item Selector ($$) - CSS-style selection of items in the Libray panel

	/**
	 * Item selector function
	 *
	 * @param	expression	{String}			A String expression
	 * @param	context		{String}			A path to a library Item
	 * @param	context		{Item}				A library Item
	 * @param	context		{Context}			A Context object with a valid item property
	 * @returns				{ItemCollection}	An ItemCollection instance
	 */
	$$ = function(expression, context, debug)
	{
		// --------------------------------------------------------------------------------
		// setup

			// reference to library
				var dom	= xjsfl.get.dom()
				if( ! dom)
				{
					return null;
				}
				var library		= dom.library;

		// --------------------------------------------------------------------------------
		// resolve context

			//TODO Review the use of context here

			// check context is a library item (should be a folder) or valid path
				if(context)
				{
					if(typeof context === 'string')
					{
						var index	= library.findItemIndex(String(context));
						context		= index != '' ? library.items[index] : null;
					}
					else if(context instanceof LibraryItem)
					{
						context = context;
					}
					else if(context instanceof Context)
					{
						if(context.item)
						{
							context = context.item;
						}
						else
						{
							throw new Error('Library Selector Error: item not set on supplied Context object');
						}
					}
					else
					{
						throw new Error('Library Selector Error: invalid context supplied');
					}
				}

		// --------------------------------------------------------------------------------
		// convert arrays, element collections, single items, etc

			// TODO Handle arrays, element collections, single items, etc

			/*
				var item = $(':selected').get(0).libraryItem;

				var elements = $(':selected').elements.filter( function(element){ return element.elementType == 'instance'; } )
				var items = [];
				elements.forEach(function(e){items.push(e.libraryItem)})

				trace(items)
				var collection = new ItemCollection(items)
			*/


		// --------------------------------------------------------------------------------
		// calculate selection and return

			// grab items
				items		= context ? Selectors.tests.items.find.decendents(library.items, context) : library.items;

			// filter items
				items		= Selectors.select(expression, items, library, debug);

			// return
				return new ItemCollection(items);
	}

	$$.toString = function()
	{
		return '[function $$]';
	}

	xjsfl.classes.register('$$', $$);
