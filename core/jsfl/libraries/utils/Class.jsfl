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
// Class

	/**
	 * Class
	 * @overview	OO Class class for creating and extending JSFL/JavaScript classes
	 * @instance	Class
	 */

	// --------------------------------------------------------------------------------
	// class
		
		/**
		 * Static class for creating and modifying JavaScript classes
		 *
		 * Combination of John Resig's Simple JavaScript Inheritane and Getters and Setters code
		 * @see			http://ejohn.org/blog/simple-javascript-inheritance/
		 * @see			http://ejohn.org/blog/javascript-getters-and-setters/
		 * @class
		 */
		(function ()
		{
			var initializing = false;
			var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
			
			this.Class = function () { };
		
			/**
			 * Static method to create a new class, or extend an existing one
			 * @param	{Object}	prop	The properties to add to the class
			 * @class
			 * @example		Class.extend(values);})
			 */
			Class.extend = function (prop)
			{
				var _super = this.prototype;
		
				// Instantiate a base class (but only create the instance,
				// don't run the init constructor)
				initializing = true;
				var prototype = new this();
				initializing = false;
		
				// Copy the properties over onto the new prototype
				for (var name in prop)
				{
					// variables
						var getter = prop.__lookupGetter__(name);
						var setter = prop.__lookupSetter__(name);
						
					// getters / setters
						if ( getter || setter )
						{
							if ( getter ) prototype.__defineGetter__(name, getter);
							if ( setter ) prototype.__defineSetter__(name, setter);
						}
						
					// normal property
						else
						{
							// Check if we're overwriting an existing function
								if(typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]))
								{
									prototype[name] =
									(function (name, fn)
									{
										return function ()
										{
											var tmp = this._super;
						
											// Add a new ._super() method that is the same method
											// but on the super-class
											this._super = _super[name];
						
											// The method only need to be bound temporarily, so we
											// remove it when we're done executing
											var ret = fn.apply(this, arguments);
											this._super = tmp;
						
											return ret;
										};
									})(name, prop[name]);
								}
								else
								{
									prototype[name] =  prop[name];
								}
						}
		
				}
		
				// The dummy class constructor
				function Class()
				{
					// All construction is actually done in the init method
					if (!initializing && this.init) this.init.apply(this, arguments);
				}
		
				// Populate our constructed prototype object
				Class.prototype = prototype;
		
				// Enforce the constructor to be what we expect
				Class.prototype.constructor = Class;
		
				// And make this class extendable
				Class.extend = arguments.callee;
		
				return Class;
			};
		})();
		
	// --------------------------------------------------------------------------------
	// register class
		
		xjsfl.classes.register('Class', Class);
