// --------------------------------------------------------------------------------
// JavaScript class

	Test  = function(date)
	{
		this._date = date || new Date();
	}
	
	
	Test.prototype =
	{
		/**
		 * @type {Number}
		 */
		num:1,
		
		/**
		 * @returns {Date}
		 */
		getDate:function()
		{
			return this._date;
		},
		
		setDate:function(date)
		{
			this._date = date;
		},
		
		toString:function()
		{
			return '[class Test]';
		}
	};
	
	
var test = new Test()

var date = test.getDate().toLocaleString();

alert(date);

