fl.outputPanel.clear();
trace = fl.trace;


Test = function(name, age)
{
	var _name = name;
	var _age = age;
	
	trace('CREATING!')
	
	function getName()
	{
		return _name;
	}
	this.__defineGetter__('name', getName);
	
	function getGreeting()
	{
		return 'Hello my name is ' + _name + ' and I am ' + _age;
	}

	this.__defineGetter__('greeting', getGreeting);
}







test1 = new Test('Dave 1', 36);
trace('test1.name:' + test1.name)

test2 = new Test('Dave 2', 18);
trace('test2.name:' + test2.name)

trace('test1.greet:' + test1.greeting)
trace('test2.greet:' + test2.greeting)

trace(test1 instanceof Test)