fl.outputPanel.clear();
trace = fl.trace;

function Restaurant(name, age) 
{
	var _name = name;
	var _age = age;
	this.init(_name, _age);
}

Restaurant.prototype = (function()
{
	var private_stuff = function() 
	{
		return this + ' PRIVATE!'// Private code here
	};

	return {

		constructor:Restaurant,

		use_restroom:function()
		{
			trace(this)
			return private_stuff();
		},
		
		init:function(name, age)
		{
			trace([1, 2])
		}

	};
})();

var r = new Restaurant(1, 2);

// This will work:
trace(r.use_restroom());

trace(r instanceof Restaurant)

