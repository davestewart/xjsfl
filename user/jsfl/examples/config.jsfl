// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.reload(this);
		clear();
		try
		{
	
	// --------------------------------------------------------------------------------
	// Create a test config item, but don't save
	
		if(1)
		{
			var config = new Config('test')
			trace(config);
			trace(config.toXMLString());
		}
		
	// --------------------------------------------------------------------------------
	// Create a test config item, and pass in some data
	
		if(0)
		{
			// root node name
				var config	= new Config('test', 'test')
				trace(config);
				trace(config.toXMLString());
				
			// XML
				var xml		= <settings><a /><b /><c /></settings>;
				var config	= new Config('test', xml)
				trace(config);
				trace(config.toXMLString());
		}
		
	// --------------------------------------------------------------------------------
	// Create a test config item, and set some data
	
		if(0)
		{
			var config = new Config('test');
			config
				.clear()
				.set('@attribute', 1)						// root-level attribute (number)
				.set('app', 'xJSFL')				// root-level node (string)
				.set('attribute.@id', 1)						// root-level attribute (number)
				.set('path.to.value', 'Hello')	// compound path

			trace(config);
			trace(config.toXMLString());
		}
	
	// --------------------------------------------------------------------------------
	// Load an existing config
	
		if(0)
		{
			var config = new Config('test');
			trace(config);
			trace(config.toXMLString());
		}
		
	// --------------------------------------------------------------------------------
	// Clear a loaded config
	
		if(0)
		{
			// clear
				var config = new Config('test');
				config.clear()
				trace(config);
				trace(config.toXMLString());
				
			// clear and save
				var config = new Config('test');
				config.clear()
				trace(config);
				trace(config.toXMLString());
		}
	
	// --------------------------------------------------------------------------------
	// Delete a loaded config
	
		if(0)
		{
			var config = new Config('test');
			config.remove()
			trace(config);
			trace(config.toXMLString());
		}
	
	// --------------------------------------------------------------------------------
	// Create a test config item, and attempt to pass in various datatypes
	
		if(0)
		{
			var config = new Config('test');
			config
				.clear()
				.set('datatypes.string', '"Hello"')
				.set('datatypes.illegalstring', '<Hello>')
				.set('datatypes.number', 1)
				.set('datatypes.boolean', true)
				.set('datatypes.xml', <name>Dave</name>)
				.set('datatypes.xmllist', new XMLList('<icon id="1" /><icon id="2" /><icon id="3" />'))
				.set('datatypes.array', [1,2,3,4,5])
				.set('datatypes.date', new Date())
				.set('datatypes.class', new Config(''))
			
			trace(config);
			trace(config.toXMLString());
		}
	
	
	// --------------------------------------------------------------------------------
	// Read parsed values from config
	
		if(0)
		{
			var config = new Config('test');
			config
				.clear()
				.set('four', 4)
				.set('five', 5)
				
			trace(config.toXMLString());
			trace('the product is: ' + config.get('five') * config.get('four'));
		}
	
	// --------------------------------------------------------------------------------
	// Test for a value, null value, or non-existant of nodes
	
		if(0)
		{
			// testing function
				function testValue(path)
				{
					var value = config.get(path);
					if(value === undefined) // note, strict equality to undefined
					{
						trace('The path "' +path+ '" does not exist');
					}
					else if(value === null) // note, strict equality to null
					{
						trace('The path "' +path+ '" exists, but is null');
					}
					else
					{
						trace('The path "' +path+ '" is set to ' + value);
					}
				}
				
			// create the config and set some values
				var config = new Config('test');
				config
					.clear()
					.set('node.is.set', 1)
					.set('node.is.unset')
					.set('attribute.is.@set', 1)
					.set('attribute.is.@unset')
					
			// trace the config XML
				trace(config.toXMLString());
				
			// test values
				testValue('node.is.set');
				testValue('node.is.unset');
				testValue('node.is.undefined');
				testValue('attribute.is.@set');
				testValue('attribute.is.@unset');
				testValue('attribute.is.@undefined');
		}
	
	// catch
		}catch(err){xjsfl.debug.error(err);}
	
