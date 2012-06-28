// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * Source
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();
		
	// ----------------------------------------------------------------------------------------------------
	// data

		var params =
		[
			 new Source.classes.Param('one', 'Number', 'This is a Number'),
			 new Source.classes.Param('two', 'String', 'This is a String'),
			 new Source.classes.Param('three', 'XML', 'This is some XML'),
		]
		
		var returns =
		[
			 new Source.classes.Value('Number', 'This is a return value'),
		]
		
		var members =
		[
			new Source.classes.Tag('see', 'www.xjsfl.com'),
			
			new Source.classes.Value('Number', 'This is a value'),
			
			new Source.classes.Param('numThings', 'Number', 'This is a value'),
			
			new Source.classes.Comment('This is a comment', 100)
				.addText('This is some more text'),
				
			new Source.classes.Heading('This is a Heading', 100)
				.addText('This is some more text'),
				
			new Source.classes.Element('This is an Element', 100)
				.addText('This is some more text')
				.addTag('see', 'something'),
				
			new Source.classes.Variable('Source.object.property', 'Number', 'This is a Variable', 100)
				.addText('This is some more text')
				.addTag('see', 'something'),
				
			new Source.classes.Accessor('Source.object.property', 'Number', 'This is an Accessor', 'get', 100)
				.addText('This is some more text')
				.addTag('see', 'something'),
				
			new Source.classes.Function('Source.object.addStuff(one, two, three)', 'This adds stuff', params, returns, 100),
		];
		
		var func = new Source.classes.Function('Source.object.addStuff(one, two, three)', 'This adds stuff', params, returns, 100);
		func
			.addText('')
			.addText('Line 1')
			.addText('Line 2')
			.addText('')
			.addText('Line 3')
			.addText('Line 4')
			.addTag('snippet', 'yes it is')
			.addParam('snippet', 'Number', 'yes it is')
			.addTag('see', 'This web URL')
			.addTag('see', 'This other web URL')
			.addTag('constructor')
			.addTag('extends', 'Source.something.else');
		
	// ----------------------------------------------------------------------------------------------------
	// functions

		/**
		 * Inspect some sample members
		 */
		function sourceMembers()
		{
			inspect(members, 'Test members', 6);
		}
		
		/**
		 * Inspect a manually-created function
		 */
		function sourceFunction()
		{
			inspect(func, 'Test function')
		}
		
		/**
		 * 
		 */
		function sourceFunctionText()
		{
			trace(func.getText())
		}
		
		/**
		 * 
		 */
		function sourceFunctionExtraText()
		{
			inspect(func.getExtraText(), 'Test function extra text')
		}
		
		/**
		 * Test instance
		 */
		function sourcePrototypeChain()
		{
			trace(func instanceof Source.classes.Comment)
		}
		
		
		
		
