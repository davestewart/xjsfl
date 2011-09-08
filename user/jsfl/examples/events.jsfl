// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code

	// initialize
		xjsfl.init(this);
		//clear();
		try
		{
	
	// --------------------------------------------------------------------------------
	// Event handler
	
		function onEvent(event)
		{
			trace(event);
		}
			
	// --------------------------------------------------------------------------------
	// All events
	
		if(0)
		{
			// CS4 events
				xjsfl.events.add(DocumentEvent.CHANGED, onEvent, 'onDocument');
				xjsfl.events.add(LayerEvent.CHANGED, onEvent, 'onLayer');
				xjsfl.events.add(FrameEvent.CHANGED, onEvent, 'onFrame');
				//xjsfl.events.add(MouseEvent.MOVE, onEvent, 'onMouse');
				
			// CS5 events
				if(xjsfl.settings.app.csVersion > 4)
				{
					xjsfl.events.add(DocumentEvent.PUBLISHED, onEvent, 'onPublished');
					xjsfl.events.add(DocumentEvent.SAVED, onEvent, 'onSaved');
				}

			// remove
				/*
				xjsfl.events.remove(DocumentEvent.CHANGED, 'onDocument');
				xjsfl.events.remove(LayerEvent.CHANGED, 'onLayer');
				xjsfl.events.remove(FrameEvent.CHANGED, 'onFrame');
				xjsfl.events.remove(MouseEvent.MOVE, 'onMouse');
				*/
		}
	
	// --------------------------------------------------------------------------------
	// Stage events
	
		if(0)
		{
			xjsfl.events.removeAll(LayerEvent.CHANGED);
			xjsfl.events.removeAll(FrameEvent.CHANGED);
			xjsfl.events.add(LayerEvent.CHANGED, onEvent);
			xjsfl.events.add(FrameEvent.CHANGED, onEvent);
		}
	
	// --------------------------------------------------------------------------------
	// Mouse event
	
		if(0)
		{
			function onEvent(event)
			{
				trace(event);
			}
			
			xjsfl.events.add(MouseEvent.MOVE, onEvent);
		}
	

	// catch
		}catch(err){xjsfl.output.debug(err);}
