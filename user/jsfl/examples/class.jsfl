// ------------------------------------------------------------------------------------------------
// Test code


	// WIP
	/*
	
	animal = function(name)
	{
		this.name = name;
		
		this.eat = function()
		{
			this.say("Yum!");
		}
		
		this.say = function(message)
		{
			fl.trace(this.name + ": " + message);
		}
	}
	
	var Animal = Class.extend( new animal() );
	
	
	var chicken = new Animal('Chick');
	
	chicken.say('Hello there!');
	*/
	
	/*
	Animal = Class.extend({
		constructor: function(name) {
			this.name = name;
		},
		
		eat: function() {
			this.say("Yum!");
		},
		
		say: function(message) {
			fl.trace(this.name + ": " + message);
		}
	});
	
	
	Cat = Animal.extend({
		eat: function(food) {
			if (food instanceof Mouse) this.base();
			else this.say("Yuk! I only eat mice.");
		},
		super:function()
		{
		
		},
		cuteName:function()
		{
			return 'CUTE:' + this.name;
		}
	});
		
	var Mouse = Animal.extend();
	
	var cat = new Cat('Molly');
	var mouse = new Mouse('Mousey');
	cat.eat(mouse);
	*/	
