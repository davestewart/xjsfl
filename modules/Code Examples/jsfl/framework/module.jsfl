// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * Module examples
	 * @snippets	all
	 */
	
	// initialize
		xjsfl.init(this);
		clear();
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// functions

		/**
		 * Create a Test module
		 */
		function moduleCreate()
		{
			// module properties
			
				var test =
				{
					init:function()
					{
						this.value = 'Hello World!'
						trace(this.name + ' module instantiated!');
					},
					
					value:'',
					
					setValue:function(value)
					{
						this.value = value;
					},
					
					trace:function()
					{
						trace(this.name + ' value is: ' + this.value);
					}
					
				}
				
			// create module	
				var module = new Module('test', test, 'Test');
				
			// test module
				module.trace();
				module.setValue('New value');
				module.trace();
				Output.inspect(module);
		}
