// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.reload();
		clear();
		try
		{
	
	// --------------------------------------------------------------------------------
	// Bounds
	
		// create a document-sized rectangle
			if(0)
			{
				dom.addNewRectangle(new Bounds(), 0);
			}
			
		// create some ovals on the current frame
			if(0)
			{
				for(var i = 0; i < 200; i++)
				{
					var x = Math.random() * dom.width;
					var y = Math.random() * dom.height;
					var r = Math.random() * 50;
					dom.addNewOval(new Bounds(x, y, r, r));
				}
			}
	
		// create an element the same size as another element
			if(0)
			{
				// grab a context to reference items
					var context = Context.create();
				
				// draw rectangle
					context.dom.addNewRectangle(new Bounds(50, 50, 200, 100), 0);
					
				// create symbol
					context.dom.selection = context.frame.elements;
					context.dom.convertToSymbol('movie clip', '', 'center');
					
				// get bounds
					var bounds = new Bounds(context.dom.selection.pop());
					
				// draw same-sized oval
					context.timeline.addNewLayer();
					context.dom.addNewOval(bounds);
			}
	
	// catch
		}catch(err){xjsfl.output.debug(err);}
