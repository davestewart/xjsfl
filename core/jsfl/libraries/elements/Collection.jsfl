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

	// includes
		xjsfl.init(this, ['Class', 'Output', 'Utils']);
		
	/**
	 * Base Collection class with core methods to iterate over and manipulate elements
	 */
	Collection =
	{

		elements:[],

		className:'Collection',

		/**
		 * Collection Constructor
		 * @param	{Array}			elements	An array of values
		 * @returns	{Collection}				A new Collection
		 */
		init:function(elements)
		{
			this.elements = [];
			this.add(elements);//elements = elements instanceof Array ? elements : [];
		},

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
		 * Adds elements to the collection
		 * @param	{Array}			elements	Adds elements to the collection
		 * @returns	{Collection}				The original Collection object
		 */
		add:function(elements)
		{
			if(arguments.length > 1)
			{
				elements		= Array.slice.call(this, arguments)
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
		 * Gets an element from the collection
		 * @param	{Number}		index		Gets the nth object in the collection
		 * @returns	{Object}					An object
		 */
		get:function(index)
		{
			return this.elements[index];
		},

		/**
		 * Removes elements from the collection
		 * @param	{Number}		startIndex	An integer that specifies at what position to remove elements
		 * @param	{Number}		deleteCount	The number of elements to be removed
		 * @returns	{Collection}				The original Collection object
		 */
		remove:function(startIndex, deleteCount)
		{
			this.elements.splice(startIndex, deleteCount || 1);
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
		 * Utility function to list the contents of the collection
		 * @param
		 * @returns
		 */
		list:function()
		{
			Output.inspect(this.elements, this.toString(), 1);
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

