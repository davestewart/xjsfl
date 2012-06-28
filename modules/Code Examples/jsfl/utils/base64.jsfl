// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * filename examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();

	// -----------------------------------------------------------------------------------------------------------------------------------------
	// functions
	
		/**
		 * Encode and decode a URL
		 */
		function base64Encode()
		{
			var encoded = Base64.encode(fl.scriptURI)
			fl.trace(encoded)
			fl.trace(Base64.decode(encoded))
		}