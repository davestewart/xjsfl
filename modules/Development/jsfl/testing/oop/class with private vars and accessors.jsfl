

/**
 * @see http://javascript.crockford.com/private.html
 */
xjsfl.init(this);

// class
	Test = function()
	{
		// private variable
			var settings = {};
			
		// private accessors (closures)
			function setSetting(name, value)
			{
				settings[name] = value;
			}
			
			function getSetting(name)
			{
				return settings[name];
			}

		Test.prototype =
		{
			/**
			 * @type {Date}
			 */
			get foo() { return getSetting('foo') },
			
			
			/**
			 * @type {Date}
			 */
			set foo(value) { foo = 200 }
			
		};

	}
	


	
	

// create instance
	var test = new Test();
	
// set variables
	test.foo = 20;
	
// get variable
	fl.trace('foo is ' + test.foo);
	fl.trace('bar is ' + test.bar);
	
// inspect class
	Output.inspect(test)

// check access to settings object
	fl.trace('settings are ' + test.settings)