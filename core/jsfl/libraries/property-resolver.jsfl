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
// Property Resolver - a set of routines to safely get, or gracefully skip, potentially unreachable properties

	// ---------------------------------------------------------------------------------------------------------------
	// librray

		PropertyResolver =
		{

			testInstance:function(instance)
			{
				return instance instanceof SymbolItem || instance instanceof Shape || instance instanceof Window;
			},

			testProperty:function(name)
			{
				return !! (name in this.methods);
			},

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
			}

		}

	// ---------------------------------------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('PropertyResolver', PropertyResolver);
