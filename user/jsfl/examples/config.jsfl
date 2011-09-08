// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.init(this);
		clear();
		try
		{
	
	// --------------------------------------------------------------------------------
	// Create a test config item, but don't save
	
		if(0)
		{
			var config = new Config('settings/test')
			trace(config);
		}
		
	// --------------------------------------------------------------------------------
	// Create a test config item, and set some data
	
		if(0)
		{
			var config = new Config('settings/test');
			config
				.clear()
				.set('@id', 1)						// root-level attribute (number)
				.set('app', 'xJSFL')				// root-level node (string)
				.set('long.path.to.value', 'Hello')	// compound path

			trace(config.toString(true));
		}
	
	// --------------------------------------------------------------------------------
	// Create a test config item, and attempt to pass in various datatypes
	
		if(0)
		{
			var config = new Config('settings/test');
			config
				.clear()
				.set('string', '"Hello"')
				.set('illegalstring', '<Hello>')
				.set('number', 1)
				.set('boolean', true)
				.set('xml', <name>Dave</name>)
				.set('xmllist', new XMLList('<icon id="1" /><icon id="2" /><icon id="3" />'))
				.set('date', new Date())
				.set('class', new Config(''))
				.set('array', [1,2,3,4,5])
			
			trace(config.toString(true));
		}
	
	// --------------------------------------------------------------------------------
	// Read values from config
	
		if(0)
		{
			var config = new Config('settings/test');
			config
				.clear()
				.set('some.setting.@id', 'Hello')
				
			trace(config.toString(true));
			trace(config.get('some.setting.@id'));
		}
	
	// --------------------------------------------------------------------------------
	// Read parsed values from config
	
		if(0)
		{
			var config = new Config('settings/test');
			config
				.clear()
				.set('five', 5)
				.set('four', 4)
				
			trace(config.toString(true));
			trace('product is: ' + config.get('five') * config.get('four'));
		}
	
	// --------------------------------------------------------------------------------
	// Test that a value exists when getting
	
		if(0)
		{
			var config = new Config('settings/test');
			config.clear()
				
			var value = config.get('this.setting.does.not.exist');
			if(value instanceof Error)
			{
				trace('Oh no! ' + value);
			}
		}
	
	// --------------------------------------------------------------------------------
	// Clear the loaded config
	
		if(0)
		{
			var config = new Config('settings/test');
			config.clear()
			trace(config.toString(true));
		}
	

	
	// catch
		}catch(err){xjsfl.output.debug(err);}
	
