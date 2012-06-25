// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * Item Find examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		//clear();
		
	// ----------------------------------------------------------------------------------------------------
	// data

		var arr = [1,2,3,4,5,6,7,8,9,10];
		trace('\nin:  ' + arr);
		
	// ----------------------------------------------------------------------------------------------------
	// functions

		/**
		 * Select nth(odd)
		 */
		function selectorOdd()
		{
			trace('out: ' + Selectors.core.combo.nth(arr, 'odd'));
		}		
		
		/**
		 * Select nth(even)
		 */
		function selectorEven()
		{
			trace('out: ' + Selectors.core.combo.nth(arr, 'even'));
		}		
		
		/**
		 * Select nth(random)
		 */
		function selectorRandom()
		{
			trace('out: ' + Selectors.core.combo.nth(arr, 'random'));
		}		
		
		/**
		 * Select nth(3)
		 */
		function selector3()
		{
			trace('out: ' + Selectors.core.combo.nth(arr, '3'));
		}		
		
		/**
		 * Select nth(3n)
		 */
		function selector3n()
		{
			trace('out: ' + Selectors.core.combo.nth(arr, '3n'));
		}
				
		/**
		 * Select nth(3n+1)
		 */
		function selector3nplus1()
		{
			trace('out: ' + Selectors.core.combo.nth(arr, '3n+1'));
		}
				
		/**
		 * Select nth(3n-1)
		 */
		function selector3nminus1()
		{
			trace('out: ' + Selectors.core.combo.nth(arr, '3n-1'));
		}
