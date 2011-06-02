// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                        ██████                   ██   ██             
//  ██     ██                        ██                       ██                  
//  ██     ██ █████ █████ █████      ██     ████ █████ █████ █████ ██ █████ █████ 
//  ██     ██    ██ ██    ██         ██     ██   ██ ██    ██  ██   ██ ██ ██ ██ ██ 
//  ██     ██ █████ █████ █████      ██     ██   █████ █████  ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ ██    ██    ██      ██     ██   ██    ██ ██  ██   ██ ██ ██ ██ ██ 
//  ██████ ██ █████ █████ █████      ██████ ██   █████ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Class Creation

Class =
{
	/** @type Class */
	classDef:{},
	
	/**
	 * Creates and/or modifies existing classes
	 * @param name {String} The name of the new class.
	 * @param superclass {Class} The class to extend, if any. Pass null to simply create a new class
	 * @param constructor {function} An optinal constructor function for the new class
	 * @param members {Object} Any class members such as functions or properties
	 */
	create:function(name, superclass, constructor, members)
	{
		// check members
			members = members || {};
			
		// create class & default constructor if not supplied
			subclass = constructor || function(){ superclass.apply(this, arguments) };
			subclass.prototype = new superclass;
			subclass.prototype.constructor = subclass;
			
		// add user methods
			Class.extend(subclass, members);
			
		// add core methods
			subclass.prototype.toString = members.hasOwnProperty('toString') ? members.toString : function(){ return '[class ' +name+ ']' };
			
		// globally define class
			window[name] = this.classDef = subclass;
			
		// save class and return this for chaining
			return this;
	},

	/**
	 * Extends an existing class with new properties
	 * @param classDef {Class} The class to extend. Omit if extending the existing class
	 * @param name {String} The name of the new function. Pass an object of name:value pairs if extending with multuple properties
	 * @param fn {function} A function closure or property value
	 */
	extend:function(classDef, name, fn)
	{
		// test for passed classdef
			if(typeof arguments[0] != 'function')
			{
				fn = name;
				name = classDef;
				classDef = this.classDef;
			}
		
		// check classDef is valid
			if(typeof classDef != 'function')
			{
				fl.trace('classDef "' +classDef+ '" needs to be a function reference');
			}
		
		// if a method name and method function were passed, attach the function to the class prototype
			if(fn !== undefined)
			{
				if(classDef.prototype[name] == undefined)
				{
					// do we always want to overwrite? Probably...
				}
				classDef.prototype[name] = fn;
			}
			
		// if a methods object was passed, add the individual methods one by one
			else
			{
				var props = name;
				for(var i in props)
				{
					Class.extend(classDef, i, props[i]);
				}
			}
			
		// return this for chaining
			return this;

	},
	
	/**
	 * Defines a JavaScript 1.6 setter method
	 * @param classDef {Class} The class to extend. Omit if extending the existing class
	 * @param name {String} The name of the new function
	 * @param fn {function} A function closure
	 */
	defineSetter:function(classDef, name, fn)
	{
		// if only 2 arguments passed, retrieve the stored classDef
			if(arguments.length == 2)
			{
				fn = name;
				name = classDef;
				classDef = this.classDef;
			}
		
		// assign
			classDef.prototype.__defineSetter__(name, fn);
			
		// return
			return this;
	},
	
	/**
	 * Defines a JavaScript 1.6 getter method
	 * @param classDef {Class} The class to extend. Omit if extending the existing class
	 * @param name {String} The name of the new function
	 * @param fn {function} A function closure
	 */
	defineGetter:function(classDef, name, fn)
	{
		// if only 2 arguments passed, retrieve the stored classDef
			if(arguments.length == 2)
			{
				fn = name;
				name = classDef;
				classDef = this.classDef;
			}
		
		// assign
			classDef.prototype.__defineGetter__(name, fn);
			
		// return
			return this;
	},
	
	/**
	 * Defines a JavaScript 1.6 setter and getter pair
	 * @param classDef {Class} The class to extend. Omit if extending the existing class
	 * @param name {String} The name of the new function
	 * @param fnSet {function} A function closure
	 * @param fnGet {function} A function closure
	 */
	defineAccessorPair:function(classDef, name, fnSet, fnGet)
	{
		// if only 2 arguments passed, retrieve the stored classDef
			if(arguments.length == 3)
			{
				fnGet = fnSet;
				fnSet = name;
				name = classDef;
				classDef = this.classDef;
			}
		
		// assign
			classDef.prototype.__defineSetter__(name, fnSet);
			classDef.prototype.__defineGetter__(name, fnGet);
			
		// return
			return this;
	}
	
}

// ---------------------------------------------------------------------------------------------------------------------
// register class with xjsfl
	
	if(window.xjsfl && xjsfl.classes)
	{
		xjsfl.classes.register('Class', Class);
	}

// ---------------------------------------------------------------------
// extension code

if(false)
{
	
	Class.extend(A, { single:function(){trace(this.toString() + ': SINGLE')} } )
	a.single();
	b.single();
	
	Class.create('C', B, function(a, b, c){A.apply(this, arguments);this.c *= 3;})
	//Class.create4('C', B, {init:function(a, b, c){alert(this.superclass);alert(this.prototype);this.x = 10; this.y = 'DAVE'; A.apply(this, arguments);alert(this.x);}});
	c = new C(1,2,3)


	Class
		.create('D', C)
		.extend( {showPoo:function(){alert('Poo is :' + this._poo)} } )
		.defineSetter('poo', function(value){this._poo = value})
		.defineGetter('poo', function(){return this._poo} )

	d = new D('a','b','c')
	d.poo = 100
	d.showPoo()

	
	$debug(b, 'B')
	$debug(c, 'C')
	$debug(d, 'D')
	
	trace(c.constructor)
	
	var c2 = new c.constructor(4,5,6)
	$debug(c2)
	
	Class.extend(C, 'woo', function(){alert('WOO:' + this.toString())});
	
	var obj = d.__proto__, i = 0;
	do
	{
		trace([i, obj.toString()]);
		obj = obj.__proto__;
		i++
	}
	while(obj.__proto__)


	$debug(d, 'This is a label')
	
	//c.woo()
	//$debug(e)
	
	//$debug('dave')
	
// ---------------------------------------------------------------------
// instance code

	/* 
	trace((b instanceof A) + ', ' + (b instanceof B));
	b.doIt();
	trace(b.x + ', ' + b.y);
	*/
	/*
	a.trace()
	b.trace()
	
	trace([b instanceof A, b instanceof B]);
	*/
	
}
	

//Class.create('Filesystem', Object, function(a, b, c){A.apply(this, arguments);this.c *= 3;})
