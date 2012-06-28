// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                    ██   ██             
//  ██                        ██                  
//  ██     ██ ██ █████ █████ █████ ██ █████ █████ 
//  █████  ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██     █████ ██ ██ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Function 

	/**
	 * Function
	 * @overview	Additional functionality for native Function object
	 * @instance	
	 */

	// ------------------------------------------------------------------------------------------------------------------------
	// override Function.toString()

		/**
		 * get the signature only, or full source of the function
		 * @param	{Boolean}	verbose		An optional Boolean to return the function source
		 * @returns	{String}				The signature or the source of the function
		 */
		/*
		Function.prototype.toString = function(verbose)
		{
			return verbose ? Function.prototype.toSource.call(this, this) : this.toSource().match(/function.+?\)/) + ' { ... }';
		}
		*/
