// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * Iterators examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();

		function frameCallback(frame, index, layer)
		{
			var collection = $(':text', frame.elements);
			collection.attr('y', function(element, index, elements){ return element.y - element.getTextAttr("size")/8; } )
		}
		
		var context = Context.create();
		Iterators.layers(context, null, frameCallback);
		
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// Code

