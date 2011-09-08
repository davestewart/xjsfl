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

	function Selector(pattern)
	{
		this.type		= '';
		this.name		= '';
		this.pattern	= pattern;
	}
	
	Selector.toString = function()
	{
		return '[class Selector]';
	}
	
	/**
	 * Static method to expands patterns and ranges in String expressions, updates test with ranges, and creates a RegExp that can be tested against
	 * @param	expression	{String}	A String selector 
	 * @param	test		{Boolean}	An optional test object with which to populate with range values
	 * @returns				{String}	A RegExp if wildcards or ranges were found
	 * @returns				{RegExp}	A String if only text and numbers were found
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
		type:'',
		
		name:'',
		
		pattern:'',
		
		method:null,
		
		params:null,
		
		range:null,
		
		keep:true,
		
		find:function(items, scope)
		{
			//TODO Decide where in the process toUniqueArray() should be called
			var params	= [items].concat(this.params);
			var results	= this.method.apply(scope, params);
			results		= xjsfl.utils.toUniqueArray(results);
			return results;
		},
		
		test:function(item, scope)
		{
			this.params[0]	= item;
			var state		= this.method.apply(scope, this.params);
			return this.keep ? state : ! state;
		},
		
		toString:function()
		{
			return '[object Selector type="' +this.type+ '" pattern="' +this.pattern+ '"]';
		}
	}
	
	xjsfl.classes.register('Selector', Selector);
