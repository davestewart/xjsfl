fl.outputPanel.clear();

Foo = function(value)
{
	this._value = value;
}

Foo.prototype =
{
	_value:null,
	
	test:function()
	{
		return this;
	},
	
	get value()
	{
		return this._value;
	},
	
	set value(value)
	{
		this._value = value;
	}
}

Bar = function(value)
{
	this._value = value;
}

Bar.prototype = new Foo();

var props =
{
	get value()
	{
		return '{' + this._value.toUpperCase() + '}';
	},
	
	set value(value)
	{
		this._value = value.toUpperCase();
	},
	
	test:function(){ return '<TEST FUNCTION>'}
}

function extend(target, source)
{
	for ( var i in source )
	{
		var g = source.__lookupGetter__(i), s = source.__lookupSetter__(i);
			
		if ( g || s )
		{
			if ( g ) target.__defineGetter__(i, g);
			if ( s ) target.__defineSetter__(i, s);
		}
		else
		{
			target[i] = source[i];
		}
	}
	return target;
}


var foo = new Foo('hello');
fl.trace(foo.value)


var bar = new Bar('goodbye');
fl.trace(bar.value)

extend(Bar.prototype, props);

var bar = new Bar('goodbye');
fl.trace(bar.value)

fl.trace(foo.test())
fl.trace(bar.test())

