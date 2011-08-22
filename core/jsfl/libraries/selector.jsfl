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
// Selector - Selector class for CSS-style selections

	function Selector(pattern, scope)
	{
		this.pattern = pattern;
		//this.scope = scope;
	}
	
	Selector.toString = function()
	{
		return '[class Selector]';
	}

	
	Selector.prototype =
	{
		type:'',
		
		pattern:'',
		
		params:null,
		
		rx:null,
		
		range:null,
		
		method:null,
		
		scope:null,
		
		context:null,
		
		/**
		 * Expands patterns and ranges in String expressions, updates test with ranges, and creates a RegExp that can be tested against
		 * @param	expression	{String}	A String selector 
		 * @param	test		{Boolean}	An optional test object with which to populate with range values
		 * @returns				{String}	A RegExp if wildcards or ranges were found
		 * @returns				{RegExp}	A String if only text and numbers were found
		 */
		makeRX:function(expression)
		{
			// expand wildcards i.e. *
				expression		= expression.replace(/\*/g, '.*');
				
			// match any ranges i.e. {-100|100}
				var rxRange		= /{(-?[\d\.]+)\|(-?[\d\.]+)}/;
				var matches		= expression.match(rxRange);
				if(matches)
				{
					expression	= expression.replace(rxRange, '\\d+');
					this.range	= {min:parseFloat(matches[1]), max:parseFloat(matches[2])};
				}
				
			// return
				return new RegExp('^' + expression.replace(/\//g, '\\/') + '$');
				return /\.\*|\\d\+/.test(expression) ? new RegExp('^' + expression.replace(/\//g, '\\/') + '$') : expression;
		},
		
		/**
		 * Tests
		 * @param	items	
		 * @returns		
		 */
		test:function(items)
		{
			// variables
				var params, temp, state;
				
			// filter items as a group, with any extra processing taking place in the testing function
				if(this.type === 'find')
				{
					params		= [items].concat(this.params);
					items		= this.method.apply(this.scope, params);
					items		= xjsfl.utils.toUniqueArray(items);
				}
				
			// filter items with one test per item
				else
				{
					// variables
						temp	= [];
						params	= [null].concat(this.params);
						
					// process
						for each(var item in items)
						{
							params[0]	= item;
							state		= this.method.apply(this.scope, params);
							if(this.not)
							{
								state = ! state;
							}
							if(state)
							{
								temp.push(item);
							}
						}
						
					// update items
						items = temp;
				}
				
			// return
				return items;
		},

		toString:function()
		{
			return '[object Selector type="' +this.type+ '" pattern="' +this.pattern+ '"]';
		}
	}
	
	xjsfl.classes.register('Selector', Selector);
