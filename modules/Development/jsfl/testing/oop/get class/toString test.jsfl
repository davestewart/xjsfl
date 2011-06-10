xjsfl.init(this);

trace = fl.trace;

// --------------------------------------------------------------------------------
// classes and objects

	// class definition
		function Test()
		{
			this.toString = function()
			{
				return '[instance Test]';
			}
		}
		
	// class toString
		Test.toString = function()
		{
			return '[class Test]';
		}
	
	// prototype object
		Test.prototype = {}
		
	// reset prototype constructor
		Test.prototype.constructor = Test;
		
	// prototype toString
		Test.prototype.toString = function()
		{
			return '[prototype Test]';
		}

	
// --------------------------------------------------------------------------------
// utility class

	function getClass(obj)
	{
		if (obj != null && obj.constructor && obj.constructor.toSource !== undefined)
		{
			// match constructor function name
				var matches = obj.constructor.toSource().match(/^function\s*(\w+)/);
				if (matches && matches.length == 2)
				{
					// fail if the return value is an anonymous / wrapped Function
						if(matches[1] != 'Function')
						{
							//trace('Constructor')
							return matches[1];
						}
						
					// attempt to grab object toSource() result
						else
						{
							matches = obj.toSource().match(/^function\s*(\w+)/);
							if(matches && matches[1])
							{
								//trace('Source')
								return matches[1];
							}
							
						// attempt to grab object toString() result
							else
							{
								matches = obj.toString().match(/^\[\w+\s*(\w+)/);
								if(matches && matches[1])
								{
									//trace('String')
									return matches[1];
								}
							}
						}
			}
		}

		return undefined;
	}

// --------------------------------------------------------------------------------
// trace

	var tests =
	[
		'test',
		null,
		'test.toString()',
		'test.toSource()',
		'test.constructor',
		'test.constructor.toSource()',
		null,
		'Test',
		'Test.prototype',
		'Test.prototype.constructor',
		null,
		'typeof test',
		'test instanceof Function',
		'getClass(test)',
		'xjsfl.utils.getClass(test)',
	]
	
// --------------------------------------------------------------------------------
// test object

	// clear
		//clear();

	// create instance
		var test = alert;
	
	// test
		trace('');
		for each(var str in tests)
		{
			trace(str ? str + ': ' + eval(str) : '')
		}
