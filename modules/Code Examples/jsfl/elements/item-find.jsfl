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
		trace('\n' + arr);
		
	// ----------------------------------------------------------------------------------------------------
	// functions

		/**
		 * Select nth(odd)
		 */
		function selectorOdd()
		{
			trace(Selectors.core.combo.nth(arr, 'odd'));
		}		
		
		/**
		 * Select nth(even)
		 */
		function selectorEven()
		{
			trace(Selectors.core.combo.nth(arr, 'even'));
		}		
		
		/**
		 * Select nth(random)
		 */
		function selectorRandom()
		{
			trace(Selectors.core.combo.nth(arr, 'random'));
		}		
		
		/**
		 * Select nth(3)
		 */
		function selector3()
		{
			trace(Selectors.core.combo.nth(arr, '3'));
		}		
		
		/**
		 * Select nth(3n)
		 */
		function selector3n()
		{
			trace(Selectors.core.combo.nth(arr, '3n'));
		}
				
		/**
		 * Select nth(3n+1)
		 */
		function selector3nplus1()
		{
			trace(Selectors.core.combo.nth(arr, '3n+1'));
		}
				
		/**
		 * Select nth(3n-1)
		 */
		function selector3nminus1()
		{
			trace(Selectors.core.combo.nth(arr, '3n-1'));
		}
