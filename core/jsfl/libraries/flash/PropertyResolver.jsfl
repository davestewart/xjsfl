// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                              ██              ██████                   ██
//  ██  ██                              ██              ██  ██                   ██
//  ██  ██ ████ █████ █████ █████ ████ █████ ██ ██      ██  ██ █████ █████ █████ ██ ██ ██ █████ ████
//  ██████ ██   ██ ██ ██ ██ ██ ██ ██    ██   ██ ██      ██████ ██ ██ ██    ██ ██ ██ ██ ██ ██ ██ ██
//  ██     ██   ██ ██ ██ ██ █████ ██    ██   ██ ██      ██ ██  █████ █████ ██ ██ ██ ██ ██ █████ ██
//  ██     ██   ██ ██ ██ ██ ██    ██    ██   ██ ██      ██  ██ ██       ██ ██ ██ ██  ███  ██    ██
//  ██     ██   █████ █████ █████ ██    ████ █████      ██  ██ █████ █████ █████ ██  ███  █████ ██
//                    ██                        ██
//                    ██                     █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Property Resolver

	/**
	 * PropertyResolver
	 * @overview	A set of routines to safely get, or gracefully skip, potentially unreachable properties
	 * @instance	PropertyResolver
	 */

	// ---------------------------------------------------------------------------------------------------------------
	// librray

		PropertyResolver =
		{

			/**
			 * Tests whether an element is one of the few elements that needs resolving
			 * @param	{Object}	instance	An object or class instance
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			testInstance:function(instance)
			{
				return instance instanceof SymbolItem || instance instanceof Shape || instance instanceof Window;
			},

			/**
			 * Tests an element to see if a property name needs resolving
			 * @param	{String}	name		A property name
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			testProperty:function(name)
			{
				return !! (name in this.methods);
			},

			/**
			 * Resolves the property value of an element
			 * @param	{Object}	element		An object or class instance
			 * @param	{String}	name		A property name
			 * @returns	{Object}				The value of the property
			 */
			resolve:function(element, name)
			{
				if(element instanceof SymbolInstance)
				{
					var method = this.methods[name];
					return method ? method(element) : element[name];
				}
				return element[name];
			},

			methods:
			{
				brightness:function(element)
				{
					if(element instanceof Element)
					{
						return element.colorMode === 'brightness' ? element.brightness : undefined;
					}
					return element.brightness;
				},

				tintColor:function(element)
				{
					if(element instanceof Element)
					{
						return element.colorMode === 'tintColor' ? element.tintColor : undefined;
					}
					return element.tintColor;
				},

				tintPercent:function(element)
				{
					if(element instanceof Element)
					{
						return element.colorMode === 'tintPercent' ? element.tintPercent : undefined;
					}
					return element.tintPercent;
				},
			},

			toString:function()
			{
				return '[class PropertyResolver]';
			}
	
		}

	// ---------------------------------------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('PropertyResolver', PropertyResolver);
