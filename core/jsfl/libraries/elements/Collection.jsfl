// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██ ██              ██   ██
//  ██           ██ ██              ██
//  ██     █████ ██ ██ █████ █████ █████ ██ █████ █████
//  ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██
//  ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██
//  ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██
//  ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Collection

	/**
	 * Collection
	 * @overview	Base class which provides functionality to store and modify multiple items as a single entity
	 * @instance	collection
	 */

	xjsfl.init(this, ['Class', 'Output', 'Utils']);
		
	Collection =
	{

			elements:[],
	
			className:'Collection',
	
			/**
			 * Collection Constructor
			 * @constructor
			 * @name Collection
			 * @param	{Array}			elements	An array of values
			 * @returns	{Collection}				A new Collection
			 */
			init:function(elements)
			{
				this.elements = [];
				this.add(elements);//elements = elements instanceof Array ? elements : [];
			},
	
	
		// --------------------------------------------------------------------------------
		// # Standard methods
			
			/**
			 * Calls a function on each element in the collection in forward order (although internally, it's in reverse)
			 * @param	{Function}		callback	A callback function to fire on each iteraction
			 * @param	{Array}			params	 	An optional array of parameters to pass to the callback function
			 * @param	{Object}		scope		An optional scope object, defaults to the collection
			 * @returns	{Collection}				The original Collection object
			 */
			each:function(callback, params, scope)
			{
				if(params !== undefined && ! Utils.isArray(params))
				{
					throw new TypeError('TypeError: parameter "params" must be an Array in Collection.each()');
				}
	
				params	= [null, null, this.elements].concat(params || []);
				scope	= scope || this;
				var i	= 0;
				while(i < this.elements.length)
				{
					params[0] = this.elements[i];
					params[1] = i;
					callback.apply(scope, params);
					i++;
				}
				return this;
			},
	
			/**
			 * Calls a function on each element in the collection in reverse (native) order
			 * @param	{Function}		callback	A callback function to fire on each iteraction
			 * @param	{Array}			params	 	An optional array of parameters to pass to the callback function
			 * @param	{Object}		scope		An optional scope object, defaults to the collection
			 * @returns	{Collection}				The original Collection object
			 */
			reach:function(callback, params, scope)
			{
				if(params !== undefined && ! Utils.isArray(params))
				{
					throw new TypeError('TypeError: parameter "params" must be an Array in Collection.reach()');
				}
	
				params	= [null, null, this.elements].concat(params || []);
				scope	= scope || this;
				var i	= this.elements.length - 1, j = 0;
				while(i >= 0)
				{
					params[0] = this.elements[i];
					params[1] = j;
					callback.apply(scope, params);
					i--; j++;
				}
				return this;
			},
	
			/**
			 * Returns the first index at which a given element can be found in the array, or -1 if it is not present
			 * @param	{Object}		element		Element to locate in the array
			 * @param	{Number}		fromIndex 	Optional index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
			 * @returns	{Number}					The first index at which the element is found, or -1 if it is not present
			 */
			indexOf:function(element, fromIndex)
			{
				return this.elements.indexOf(element, fromIndex);
			},
			
			/**
			 * Gets an element from the collection
			 * @param	{Number}		index		Gets the nth object in the collection
			 * @returns	{Object}					An object
			 */
			get:function(index)
			{
				return this.elements[index];
			},
			
			/**
			 * Finds and returns elements (by name, or other property) within the collection
			 * @param	{String}		value		A String (wildcards allowed) name or property value
			 * @param	{RegExp}		value		A RegExp name or property value
			 * @param	{Value}			value		Any value
			 * @param	{String}		property	The name of a property to match against. Defaults to "name"
			 * @returns	{Array}						An array of matching elements
			 */
			find:function(value, property)
			{
				// parameters
					property		= property || 'name';
					
				// variables
					var elements	= [];
					var i			= -1;
					
				// determine value
					if(typeof value === 'string' && value.indexOf('*') !== -1)
					{
						value = Utils.makeWildcard(value, true);
					}
				
				// attempt to find the elements with properties matching the value
					if(value instanceof RegExp)
					{
						while(i++ < this.elements.length - 1)
						{
							if(value.test(String(this.elements[i][property])))
							{
								elements.push(this.elements[i]);
							}
						}
					}
					else
					{
						while(i++ < this.elements.length - 1)
						{
							if(this.elements[i][property] === value)
							{
								elements.push(this.elements[i]);
							}
						}
					}
					
				// return
					return elements;
			},
	
		// --------------------------------------------------------------------------------
		// # Manipulation methods
		
			/**
			 * Adds elements to the collection
			 * @param	{Array}			elements	An Array of elements
			 * @param	{Element}		elements	A single Element
			 * @param	{...rest}		elements	Multiple elements as function parameters
			 * @returns	{Collection}				The original Collection object
			 */
			add:function(elements)
			{
				if(arguments.length > 1)
				{
					elements		= Array.slice.call(this, arguments)
				}
				else if( ! Utils.isArray(elements) )
				{
					elements = [elements];
				}
	
				if(elements instanceof Array)
				{
					for(var i = 0; i < elements.length; i++)
					{
						if(this.elements.indexOf(elements[i]) == -1)
						{
							this.elements.push(elements[i]);
						}
					}
				}
	
				return this;
			},
	
			/**
			 * Removes elements from the collection
			 * @param	{Array}			elementsOrValue	An Array of elements
			 * @param	{String}		elementsOrValue		A String (wildcards allowed) name or property value to find elements by
			 * @param	{RegExp}		elementsOrValue		A RegExp name or property value to find elements by
			 * @param	{Value}			elementsOrValue		Any value
			 * @param	{String}		property			The name of a property to match against. Defaults to "name"
			 * @returns	{Collection}						The original Collection object
			 */
			remove:function(elementsOrValue, property)
			{
				var elements;
				
				if( ! Utils.isArray(elementsOrValue) )
				{
					elements = this.find(elementsOrValue);
				}
				else
				{
					elements = elementsOrValue;
				}
				
				if(elements && Utils.isArray(elements))
				{
					for (var i = this.elements.length - 1; i >= 0; i--)
					{
						if(elements.indexOf(this.elements[i]) !== -1)
						{
							this.elements.splice(i, 1);
						}
					}
				}
				return this;
			},
	
			/**
			 * Filters the collection using a callback function
			 * @param	{Function}		callback	A callback function to test each element of the array, of the format function(element, index, elements)
			 * @param	{Object}		thisObject	Object to use as this when executing callback
			 * @returns	{Collection}				The original Collection object
			 */
			filter:function(callback, thisObject)
			{
				//TODO Add the option to filter by selector (or is this find?)
				this.elements = this.elements.filter(callback, thisObject || this)
				return this;
			},
			
		// --------------------------------------------------------------------------------
		// # Editing functions
			
	
			/**
			 * Modifies a particular attribute on all items in the collection
			 * @param	{Object}		prop		An object containing name:value pairs of attribute to modify
			 * @param	{String}		prop		The name of the attribute to modify
			 * @param	{Value}			value		A value attribute value
			 * @param	{Function}		value		A callback function that returns a value, of the format function(element, index, elements);
			 * @returns	{Collection}				The current Collection
			 */
			attr:function(prop, value)
			{
				if(typeof prop === 'object')
				{
					for(var name in prop)
					{
						this.attr(name, prop[name]);
					}
				}
				else
				{
					var fn = typeof value === 'function' ? value : function(){ return value; };
					for(var i = 0; i < this.elements.length; i++)
					{
						this.elements[i][prop] = fn(this.elements[i], i, this.elements);
					}
				}
				return this;
			},
	
			/**
			 * A chainable utility function, that allows an external callback function to be called a single time
			 * @param	{Function}		callback	Function to call
			 * @params				 	...params	Optional arguments to be passed to the callback
			 * @returns	{Collection}				The original Collection object
			 */
			call:function(callback)
			{
				var params = Utils.getArguments(arguments, 1);
				callback.apply(this, params);
				return this;
			},
	
			/**
			 * A chainable utility function, that allows an external callback function to be called a single time
			 * @param	{Function}		callback	Function to call
			 * @param	{Array}			params		Optional arguments to be passed to the callback
			 * @param	{Object}		scope		An optional scope to run the function in, default to the collection
			 * @returns	{Collection}				The original Collection object
			 */
			apply:function(callback, params, scope)
			{
				callback.apply(scope || this, params);
				return this;
			},
			
			/**
			 * A chainable utility function, to invoke existing named methods on collection elements
			 * @param	{String}		name		The name of the method to call
			 * @params				 	...params	Optional arguments to be passed to the callback
			 * @returns	{Collection}				The original Collection object
			 */
			invoke:function(name)
			{
				var params = Utils.getArguments(arguments, 1);
				for each(var element in this.elements)
				{
					element[name](params);
				}
				return this;
			},

		// --------------------------------------------------------------------------------
		// # Utility methods
	
			/**
			 * Sort the internal elements
			 * @returns	{Collection}				The original Collection object
			 */
			sort:function()
			{
				this.elements.sort();
				return this;
			},
	
			/**
			 * Utility function to list the contents of the collection
			 * @param	{String}		label		An optional label to add to the inspect() output
			 * @returns	{Collection}				The original Collection object
			 */
			list:function(label)
			{
				Output.inspect(this.elements, label || this.toString(), 1);
				return this;
			},
	
			/**
			 * Return a string representation of the collection
			 * @returns	{String}					A string representation of the collection
			 */
			toString:function()
			{
				return '[object ' +this.className+ ' length=' + this.elements.length+ ']';
			}

	}

// ---------------------------------------------------------------------------------------------------------------------
// register classes with xjsfl

	Collection = Class.extend(Collection);
	Collection.toString = function()
	{
		return '[class Collection]';
	}

	xjsfl.classes.register('Collection', Collection);

