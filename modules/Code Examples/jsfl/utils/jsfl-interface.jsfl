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

		var data =
		{
			a:1,
			b:'Hello',
			c:true,
			d:new Date(),
			e:[1,2,3],
			f:undefined,
			g:null
		}
		
		/**
		 * Serialize a variety of data types
		 */
		function jsflSerialize()
		{
			var xml = JSFLInterface.serialize(data);
			trace(new XML(xml).toXMLString())
		}
	
