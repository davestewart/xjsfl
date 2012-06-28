// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code

	/**
	 * Events examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
	
	// --------------------------------------------------------------------------------
	// Event handler
	
		function onEvent(event)
		{
			trace(event);
		}
			
		/**
		 * Add all events
		 */
		function eventsAddAll()
		{
			// remove existing
				eventsRemoveAll();
				
			// CS4 events
				xjsfl.events.add(DocumentEvent.CHANGED, onEvent, 'onDocument');
				xjsfl.events.add(LayerEvent.CHANGED, onEvent, 'onLayer');
				xjsfl.events.add(FrameEvent.CHANGED, onEvent, 'onFrame');
				
			// CS5 events
				if(xjsfl.settings.app.csVersion > 4)
				{
					xjsfl.events.add(DocumentEvent.PUBLISHED, onEvent, 'onPublished');
					xjsfl.events.add(DocumentEvent.SAVED, onEvent, 'onSaved');
				}
		}
	
		/**
		 * Add stage events
		 */
		function eventsAddStage()
		{
			eventsRemoveAll();
			xjsfl.events.add(LayerEvent.CHANGED, onEvent);
			xjsfl.events.add(FrameEvent.CHANGED, onEvent);
		}
	
		/**
		 * Add mouse events
		 */
		function eventsAddMouse()
		{
			// remove existing
				eventsRemoveAll();
				
			// callback
				function onEvent(event)
				{
					trace(event);
				}
				
			// setup
				xjsfl.events.add(MouseEvent.MOVE, onEvent);
		}
	
		/**
		 * Remove all events
		 */
		function eventsRemoveAll()
		{
			// remove
				xjsfl.events.remove(DocumentEvent.CHANGED);
				xjsfl.events.remove(LayerEvent.CHANGED);
				xjsfl.events.remove(FrameEvent.CHANGED);
				xjsfl.events.remove(MouseEvent.MOVE);
				xjsfl.events.remove(DocumentEvent.PUBLISHED);
				xjsfl.events.remove(DocumentEvent.SAVED);
		}
	