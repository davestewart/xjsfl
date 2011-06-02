// --------------------------------------------------------------------------------
// setters and getters

	/**
	 * @see https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Working_with_Objects#Defining_Getters_and_Setters
	 * @see http://whereswalden.com/2010/04/16/more-spidermonkey-changes-ancient-esoteric-very-rarely-used-syntax-for-creating-getters-and-setters-is-being-removed/
	 */


	Test  = function(date)
	{
		this._date = date || new Date();
	}
	
	
	Test.prototype =
	{
		/**
		 * @type {Date}
		 */
		get date() { return this._date },
		
		
		/**
		 * @type {Date}
		 */
		set date(date)
		{
			if(date instanceof Date)
			{
				this._date = date;
			}
			else
			{
				alert('That is not a valid Date object!');
			}
		},
		
		toString:function()
		{
			return '[class Test]';
		}
	};
	
	


var test = new Test()

alert(test);
alert(test.date)

test.date = 'Today';


