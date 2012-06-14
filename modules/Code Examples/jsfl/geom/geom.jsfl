// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * Geom examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();
	
	// --------------------------------------------------------------------------------
	// Bounds
	
		/**
		 * create a document-sized rectangle
		 */
		function geomBoundsDocument()
		{
			$dom.addNewRectangle(new Bounds(), 0);
		}
		
		/**
		 * create some ovals on the current frame
		 */
		function geomBoundsSelection()
		{
			for(var i = 0; i < 200; i++)
			{
				var x = Math.random() * $dom.width;
				var y = Math.random() * $dom.height;
				var r = Math.random() * 50;
				$dom.addNewOval(new Bounds(x, y, r, r));
			}
		}

		/**
		 * create an element the same size as another element
		 */
		function geomBoundsElement()
		{
			// draw rectangle
				$dom.addNewRectangle(new Bounds(50, 50, 200, 100), 0);
				
			// create symbol
				$selection = Context.create().frame.elements;
				$dom.convertToSymbol('movie clip', '', 'center');
				
			// get bounds
				var bounds = new Bounds($selection.pop());
				
			// draw same-sized oval
				$timeline.addNewLayer();
				$dom.addNewOval(bounds);
		}
