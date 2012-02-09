// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██              ██
//  ██           ██              ██
//  ██     █████ ██ █████ █████ █████ █████ ████
//  ██████ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██
//      ██ █████ ██ █████ ██     ██   ██ ██ ██
//      ██ ██    ██ ██    ██     ██   ██ ██ ██
//  ██████ █████ ██ █████ █████  ████ █████ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Selector - Class which holds JSFL rules (methods) and other parameters to compare against potentially-selected objects

	/**
	 * The Selector constructor
	 * @param	{String}	pattern		The CSS selector pattern
	 */
	function Selector(pattern)
	{
		// NOTE: Scope is no longer passed in, as we don't want it to be inspected when we debug
		this.pattern	= pattern;
		this.type		= '';
		this.name		= '';
	}

	Selector.toString = function()
	{
		return '[class Selector]';
	}

	/**
	 * Static method to expands patterns and ranges in String expressions, updates test with ranges, and creates a RegExp that can be tested against
	 * @param	{String}	expression	A String selector
	 * @param	{Boolean}	test		An optional test object with which to populate with range values
	 * @returns	{String}				A RegExp if wildcards or ranges were found
	 * @returns	{RegExp}				A String if only text and numbers were found
	 */
	Selector.makeRX = function(expression, selector)
	{
		// expand wildcards i.e. *
			expression		= expression.replace(/\*/g, '.*?');

		// match any ranges i.e. {-100|100}
			expression		= Selector.makeRange(expression, selector);

		// return
			return new RegExp('^' + expression.replace(/\//g, '\\/') + '$', 'i');
			//return /\.\*|\\d\+/.test(expression) ? new RegExp('^' + expression.replace(/\//g, '\\/') + '$', 'i') : expression;
	}

	/**
	 * Static utility function to set the range of values from a range-syntax fragment {min|max}
	 * @param	{String}	expression	A CSS selector pattern
	 * @param	{Selector}	selector	The selector to assign the range values to
	 * @returns	{String}				A new CSS expression
	 */
	Selector.makeRange = function(expression, selector)
	{
		// match any ranges i.e. {-100|100}
			var rxRange		= /{(-?[\d\.]+)\|(-?[\d\.]+)}/;
			var matches		= expression.match(rxRange);
			if(matches)
			{
				expression		= expression.replace(rxRange, '([\\d\\.]+)');
				selector.range	= {min:parseFloat(matches[1]), max:parseFloat(matches[2])};
			}

		// return
			return expression;
	}

	Selector.prototype =
	{
		/** @type {String}		The original pattern for the Selector */
		pattern		:'',

		/** @type {String}		The type, i.e. combo, filter, etc 	*/
		type		:'',

		/** @type {String}		The name of the Selector, i.e. "attribute" */
		name		:'',

		/** @type {Function}	A callback function with which to test items with */
		method		:null,

		/** @type {Array}		An Array of values to pass to the Selector's method */
		params		:null,

		/** @type {Object}		An object with .min and .max values */
		range		:null,

		/** @type {Boolean}		A Flag which decides whether items should be kept or discarded after a test() */
		keep		:true,

		/**
		 * Filters a list
		 * @param	{Array}		items	A list of Items or Elements
		 * @param	{Object}	scope	An object scope
		 * @returns	{Array}				A filtered list of Items or Elements
		 */
		find:function(items, scope)
		{
			var params	= [items].concat(this.params);
			var results	= this.method.apply(scope, params);

			//TODO Decide where in the process toUniqueArray() should be called
			results		= xjsfl.utils.toUniqueArray(results);

			return results;
		},

		/**
		 * Test a single item or element at time
		 * @param	{Object}	item	A valid Item or Element
		 * @param	{Object}	scope	An Object scope
		 * @returns	{Boolean}			true or false
		 */
		test:function(item, scope)
		{
			// assign the item as the first argument
				this.params[0]	= item;

			// get the result of the test
				var state		= this.method.apply(scope, this.params);

			// return the result
				return this.keep ? state : ! state;
		},

		toString:function()
		{
			return '[object Selector type="' +this.type+ '" pattern="' +this.pattern+ '"]';
		}
	}

	xjsfl.classes.register('Selector', Selector);
