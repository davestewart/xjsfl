	





var collection =
{
	elements:[],
	
	name:'Collection',
	
	constructor: function(elements)
	{
		this.add(elements);
		
		var foo = 50;
		
		this.test = function()
		{
			foo++;
			alert(foo);
		}
		
	},
	
	each:function(callback)
	{
		for(var i = 0; i < this.elements.length; i++)
		{
			this.elements[i] = callback(this.elements[i], i, this.elements, this);
		}
	},
	
	add:function(element)
	{
		if(element instanceof Array)
		{
			this.elements = this.elements.concat(element);
		}
		else
		{
			this.elements.push(element);
		}
	},
	
	select:function()
	{
		return this.elements;
	},
	
	toString:function()
	{
		return '[object ' +this.name+ ']';
	}
}
Collection = Class.extend(collection);

var itemCollection =
{
	name:'ItemCollection',
	
	adds:function(element)
	{
		this.base('(' + element.toString() + ')')
	},
	
	select:function()
	{
		return this.base().toString().toUpperCase();
	},
	
	toString:function()
	{
		return '[object ItemCollection]';
	}
	
}
ItemCollection = Collection.extend(itemCollection);


