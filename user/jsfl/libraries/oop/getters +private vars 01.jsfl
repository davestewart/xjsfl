fl.outputPanel.clear();
trace = fl.trace;


	Test = function(name)
	{
		var _name = name;
	}


	(function()
	{
		
		Test.prototype =
		{
			get name()
			{
				return this._name;
			}
		}
		
	})()

/*
Test.prototype =
{
	constructor:function(name)
	{
		var _name = name;
	},
	
	get name()
	{
		return 
	}
	
}
*/

test1 = new Test('Dave 1');
trace('test1.name:' + test1.name)

test2 = new Test('Dave 2');
trace('test2.name:' + test2.name)

trace('test1.name:' + test1.name)

var Obj = function(name, age) {
	
    var _name = name;
	
	var _age = age;
	
    return {
        get name() { return _name },
        set name(name) { _name = name },
		get greeting()
		{
			return 'Hello my name is ' + name + ' and I am ' + _age;
		}
    };
};

var obj = new Obj('Bill', 36);


for(var i in obj)
{
	trace(i + ':' + obj[i]);
}


trace(obj.greeting)
trace(obj instanceof Obj)
trace(test1 instanceof Test)