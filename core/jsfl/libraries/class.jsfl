// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                   
//  ██     ██                   
//  ██     ██ █████ █████ █████ 
//  ██     ██    ██ ██    ██    
//  ██     ██ █████ █████ █████ 
//  ██     ██ ██ ██    ██    ██ 
//  ██████ ██ █████ █████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Class - OO Class class for creating and modifying JavaScript classes

	// ------------------------------------------------------------------------------------------------
	// Constructor
	
		/**
		 * Class.js, version 1.1
		 * Copyright 2006-2007, Dean Edwards
		 * License: http://www.opensource.org/licenses/mit-license.php
		 *
		 * Modified (ever-so slightly) by Dave Stewart
		 *
		 * @see http://dean.edwards.name/weblog/2006/03/base/
		 * @see http://dean.edwards.name/weblog/2006/05/prototype-and-base/
		 * 
		 */
		var Class = function()
		{
			// dummy
		};
		
	// ------------------------------------------------------------------------------------------------
	// Static extend method
	
		/**
		 * 
		 * @param	_instance	
		 * @param	_static	
		 * @returns		
		 */
		Class.extend = function(_instance, _static) // subclass
		{
			var extend = Class.prototype.extend;
			
			// build the prototype
			Class._prototyping = true;
			var proto = new this;
			extend.call(proto, _instance);
			delete Class._prototyping;
			
			// extend the wrapper for the constructor function
			//var constructor = proto.constructor.valueOf(); //-dean
			var constructor = proto.constructor;
			var klass = proto.constructor = function()
			{
				if (!Class._prototyping)
				{
					if (this._constructing || this.constructor == klass) // instantiation
					{
						this._constructing = true;
						constructor.apply(this, arguments);
						delete this._constructing;
					}
					else if (arguments[0] != null) // casting
					{
						return (arguments[0].extend || extend).call(arguments[0], proto);
					}
				}
			};
			
			// build the class interface
			klass.ancestor = this;
			klass.extend = this.extend;
			klass.forEach = this.forEach;
			klass.implement = this.implement;
			klass.prototype = proto;
			klass.toString = this.toString;
			
			klass.valueOf = function(type)
			{
				//return (type == "object") ? klass : constructor; //-dean
				return (type == "object") ? klass : constructor.valueOf();
			};
			
			extend.call(klass, _static);
			// class initialisation
			if (typeof klass.init == "function") klass.init();
			return klass;
		};
	
		
	// ------------------------------------------------------------------------------------------------
	// Prototype
	
		Class.prototype = {	
			extend: function(source, value)
			{
				if (arguments.length > 1) // extending with a name/value pair
				{
					var ancestor = this[source];
					if (ancestor && (typeof value == "function") && // overriding a method?
						// the valueOf() comparison is to avoid circular references
						(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
						/\bbase\b/.test(value))
					{
						// get the underlying method
						var method = value.valueOf();
						// override
						value = function()
						{
							var previous = this.base || Class.prototype.base;
							this.base = ancestor;
							var returnValue = method.apply(this, arguments);
							this.base = previous;
							return returnValue;
						};
						// point to the underlying method
						value.valueOf = function(type)
						{
							return (type == "object") ? value : method;
						};
						value.toString = Class.toString;
					}
					this[source] = value;
				}
				else if (source) // extending with an object literal
				{
					var extend = Class.prototype.extend;
					// if this object has a customised extend method then use it
					if (!Class._prototyping && typeof this != "function") {
						extend = this.extend || extend;
					}
					var proto = {toSource: null};
					// do the "toString" and other methods manually
					var hidden = ["constructor", "toString", "valueOf"];
					// if we are prototyping then include the constructor
					var i = Class._prototyping ? 0 : 1;
					while (key = hidden[i++])
					{
						if (source[key] != proto[key])
						{
							extend.call(this, key, source[key]);
		
						}
					}
					// copy each of the source object's properties to this object
					for (var key in source)
					{
						if (!proto[key]) extend.call(this, key, source[key]);
					}
				}
				return this;
			},
		
			base: function()
			{
				// call this method from any other method to invoke that method's ancestor
			}
		};
		
	// ------------------------------------------------------------------------------------------------
	// Initialize
	
		Class = Class.extend({
			constructor: function()
			{
				this.extend(arguments[0]);
			}
		},
		{
			ancestor: Object,
			version: "1.1",
			
			forEach: function(object, block, context)
			{
				for (var key in object)
				{
					if (this.prototype[key] === undefined)
					{
						block.call(context, object[key], key, object);
					}
				}
			},
				
			/**
			 * 
			 * @param		
			 * @returns		
			 */
			implement: function()
			{
				for (var i = 0; i < arguments.length; i++)
				{
					if (typeof arguments[i] == "function")
					{
						// if it's a function, call it
						arguments[i](this.prototype);
					}
					else
					{
						// add the interface using the extend method
						this.prototype.extend(arguments[i]);
					}
				}
				return this;
			},
			
			toString: function()
			{
				return String(this.valueOf());
			}
		});
		
		Class.toString = function()
		{
			return '[class Class]';
		}
		
	// register
		xjsfl.classes.register('Class', Class)
		
		
		
	// ------------------------------------------------------------------------------------------------
	// Tets code
	
		if( ! xjsfl.file.loading )
		{
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
		}
		
		

