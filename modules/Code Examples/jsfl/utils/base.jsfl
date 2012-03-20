// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * filename examples
	 * @snippets	all
	 */

/**
 * A chain of 3 extensions using the Base class
 */

xjsfl.init(this);
clear()

// ----------------------------------------------------------------------------------------------------
// class definitions

	/**
	 * Foo class
	 * @class	Foo
	 */
	var Foo =
	{
		a:1,
		constructor:function(a)
		{
			this.a = a || this.a;
		},
		doFoo:function()
		{
			trace('FOO: ' + this);
		},
		toString:function()
		{
			return '[object Foo a="{a}"]'.populate(this);
		}
	}
	
	Foo = Base.extend(Foo);
	
	/**
	 * Bar class
	 * @class		Bar
	 * @memberOf	Foo
	 */
	var Bar =
	{
		b:2,
		constructor:function(a, b)
		{
			this.base(a);
			this.b = b || this.b;
		},
		doBar:function()
		{
			trace('BAR: ' + this);
		},
		toString:function()
		{
			return '[object Bar a="{a}" b="{b}"]'.populate(this);
		}
	}
	
	Bar = Foo.extend(Bar);
	
	/**
	 * Baz class
	 * @class		Baz
	 * @memberOf	Bar
	 */
	var Baz =
	{
		c:3,
		constructor:function(a, b, c)
		{
			this.base(a, b);
			this.c = c || this.c;
		},
		doBaz:function()
		{
			trace('BAZ: ' + this);
		},
		toString:function()
		{
			return '[object Baz a="{a}" b="{b}" c="{c}"]'.populate(this);
		}
	}
	
	Baz = Bar.extend(Baz);
	

// ----------------------------------------------------------------------------------------------------
// create and inxpect classes

	// foo
		var foo = new Foo();
		inspect(foo);
		foo.doFoo();
		
	// bar
		var bar = new Bar();
		inspect(bar);
		bar.doFoo();
		bar.doBar();
		
	// baz
		var baz= new Baz();
		inspect(baz);
		baz.doFoo();
		baz.doBar();
		baz.doBaz();


	