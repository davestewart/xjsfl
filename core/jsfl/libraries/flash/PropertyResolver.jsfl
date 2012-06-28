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
			 * Tests whether an object is one of the few objects that needs resolving
			 * @param	{Object}	object		An object or class instance
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			testObject:function(object)
			{
				return object instanceof SymbolItem || object instanceof Shape || object instanceof Window;
			},

			/**
			 * Tests an object to see if a property name needs resolving
			 * @param	{String}	name		A property name
			 * @returns	{Boolean}				true or false, depending on the result
			 */
			testProperty:function(name)
			{
				return !! (name in this.methods);
			},

			/**
			 * Resolves the property value of an object
			 * @param	{Object}	object		An object or class instance
			 * @param	{String}	name		A property name
			 * @returns	{Object}				The value of the property
			 */
			resolve:function(object, name)
			{
				if(object instanceof SymbolInstance)
				{
					var method = this.methods[name];
					return method ? method(object) : object[name];
				}
				return object[name];
			},

			methods:
			{
				brightness:function(object)
				{
					if(object instanceof Element)
					{
						return object.colorMode === 'brightness' ? object.brightness : undefined;
					}
					return object.brightness;
				},

				tintColor:function(object)
				{
					if(object instanceof Element)
					{
						return object.colorMode === 'tint' ? object.tintColor : undefined;
					}
					return object.tintColor;
				},

				tintPercent:function(object)
				{
					if(object instanceof Element)
					{
						return object.colorMode === 'tint' ? object.tintPercent : undefined;
					}
					return object.tintPercent;
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
