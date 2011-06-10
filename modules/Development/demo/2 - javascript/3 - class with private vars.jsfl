
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
			
		// public accessors
			this.set = function(name, value)
			{
				setSetting(name, value);
			}
			
			this.get = function(name)
			{
				return getSetting(name);
			}
	}

// create instance
	var test = new Test();
	
// set variables
	test.set('foo', 20);
	
// get variable
	fl.trace('foo is ' + test.get('foo'));
	fl.trace('bar is ' + test.get('bar'));
	
// inspect class
	Output.inspect(test)

// check access to settings object
	fl.trace('settings are ' + test.settings)