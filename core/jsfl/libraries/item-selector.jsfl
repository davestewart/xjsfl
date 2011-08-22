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
	 * @param	expression	{String}	A String expression
	 * @param	context		{String}	A path to a library Item
	 * @param	context		{Item}		A library Item
	 * @param	context		{Context}	A Context object with a valid item property
	 * @returns				{Array}		An array of library Items
	 */
	$$ = function(expression, context)
	{
		// --------------------------------------------------------------------------------
		// recursively handle multiple rules
		
			var expressions	= xjsfl.utils.trim(expression).split(/,/g);
			var items		= [];
			if(expressions.length > 1)
			{
				// callback
					for(var i = 0; i < expressions.length; i++)
					{
						items = items.concat($$(expressions[i], context).elements);
					}
				
				// ensure items are unique
					items = xjsfl.utils.toUniqueArray(items);
					
				// return
					return new ItemCollection(items);
			}
				
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
		
			// check context is a library item or valid path
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
				
			// grab items
				items = context ? Selectors.library.find.decendents(library.items, context) : library.items;
	
		// --------------------------------------------------------------------------------
		// parse a selector expression into selectors - also called from :not()
		
			// chunker
				/*
				    #  type             match
					-------------------------------------------------
					1: combo			:not(selector)
					   2: type			:not
					   3: selector		:bitmap
					4: name				this is a name
					5: path				/this is/a path
					6: Class			.Class
					7: package			.com.domain.package.Class
					8: pseudo			:type
					9: attribute		[attribute=value]
					   10:  name		attribute
					   11:  operand		=
					   12: value		value
				*/
				var chunker = /(:([\-\w]+)\((.+)\))|([A-Za-z_][\-\w\s_*{|}]+)|\/([\-\w\s\/_*{|}]+)|\.([*A-Z][\w*]+)|\.([a-z][\w.*]+)|:([a-z]\w+)|\[((\w+)([\^$*!=<>]{1,2})?(.+?)?)\]/g;

			// variables
				var exec,
					selector,
					selectors = [],
					typeTests = Selectors.tests.items
					coreTests = Selectors.tests.core;
					
			// debug
				//trace('\n\n\n\n--------------------------------------------------------------------------------\n' + expression + '\n--------------------------------------------------------------------------------')
				
			// parse
				while(exec = chunker.exec(expression))
				{
					// --------------------------------------------------------------------------------
					// setup
					
						// debug
							//Output.inspect(exec);
							
						// create
							selector = new Selector(exec[0], library);
						
					// --------------------------------------------------------------------------------
					// create selector
					
						// 1: combo
							if(exec[1])
							{
								selector.type	= 'combo';
								selector.method	= coreTests.combo[exec[1]];
								selector.params	= [exec[2]];
							}
							
						// 4: name
							else if(exec[4])
							{
								selector.type	= 'name';
								selector.method	= typeTests.filter.name;
								selector.params	= [selector.makeRX(exec[4])];
							}
							
						// 5: path
							else if(exec[5])
							{
								selector.type	= 'path';
								selector.method	= typeTests.filter.path;
								selector.params	= [selector.makeRX(exec[5])];
							}
							
						// 6: Class
							else if(exec[6])
							{
								selector.type	= 'class';
								selector.method	= typeTests.filter.Class;
								selector.params	= [selector.makeRX(exec[6])];
							}
							
						// 7: package
							else if(exec[7])
							{
								selector.type	= 'package';
								selector.method	= typeTests.filter.Package;
								selector.params	= [selector.makeRX(exec[7])];
							}
							
						// 8: pseudo
							else if(exec[8])
							{
								if(exec[8].match(/selected|children|descendants|parent|first|last/))
								{
									selector.type	= 'find';
									selector.method	= typeTests.find[exec[8]];
								}
								else if(exec[8].match(/exported|timeline|empty|animated|scripted|audible/))
								{
									selector.type	= 'pseudo';
									selector.method	= typeTests.pseudo[exec[8]];
								}
								else
								{
									selector.type	= 'type';
									selector.method	= typeTests.filter.type;
								}
								selector.params	= [exec[8]];
							}
							
						// 9: attribute
							else if(exec[9])
							{
								selector.type	= 'attribute';
								selector.method	= coreTests.filter.attribute;
								selector.params	= [exec[10], exec[11], selector.makeRX(exec[12])];
							}
							
					// --------------------------------------------------------------------------------
					// assign selector, or throw error
					
						// finally, add selector
							if(selector.method)
							{
								selector.scope = library;
								selectors.push(selector);
							}
							else
							{
								throw new TypeError('TypeError: unrecognised selector "' +selector.pattern+ '" in Item Selector function ($$)');
							}
						
				}
				
				Output.inspect(selectors)
	
		// --------------------------------------------------------------------------------
		// calculate selection and return
		
			// items
				items		= Selectors.select(items, selectors);
				
			// return
				return new ItemCollection(items);
	}
	
	$$.toString = function()
	{
		return '[function $$]';
	}

	xjsfl.classes.register('$$', $$);
	

// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.init(this);
			clear();
			try
			{
		
		// --------------------------------------------------------------------------------
		// Test
		
			if(0)
			{
				
			}
		
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
		
