// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██████ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// UI - Utility functions to ensure user has a document open, selection, etc, and alert if not


	// --------------------------------------------------------------------------------
	// Library

		/**
		 * A set of functions to return objects or selections in the UI, or issue standard warnings if not available
		 */
		UI =
		{
			/**
			 * Get the current Document DOM, or issue a standard warning if not available
			 * @returns	{Document}		A Document object
			 * @returns	{Boolean}		False if not available
			 */
			get dom()
			{
				var dom = fl.getDocumentDOM();
				if(dom)
				{
					return dom;
				}
				alert('Open a Flash document (FLA) before running this script');
				return false;
			},

			/**
			 * Get the current Timeline, or issue a standard warning if not available
			 * @returns	{Timeline}		A Timelineobject
			 * @returns	{Boolean}		False if not available
			 */
			get timeline()
			{
				if(UI.dom)
				{
					return fl.getDocumentDOM().getTimeline();
				}
				alert('Open a Flash document (FLA) before running this script');
				return false;
			},

			/**
			 * Get the currently selected library items, or issue a standard warning if not selected
			 * @returns	{Array}			An array of library items
			 * @returns	{Boolean}		False if not available
			 */
			get items()
			{
				if(UI.dom)
				{
					var items = fl.getDocumentDOM().library.getSelectedItems();
					if(items.length > 0)
					{
						return items;
					}
					alert('Select some library items before running this script');
					return false;
				}
				return false;
			},

			/**
			 * Get the current selection, or issue a standard warning if nothing is selected
			 * @returns	{Array}			An array of elements
			 * @returns	{Boolean}		False if no selection
			 */
			get selection()
			{
				if(UI.dom)
				{
					var selection = UI.dom.selection;
					if(selection.length > 0)
					{
						return selection;
					}
					alert('Make a selection before running this script');
					return false;
				}
				return false;
			},
			
			/**
			 * Lightweight function to return the current UI state
			 * @returns	{Object}
			 */
			get state()
			{
				//TODO Add in boolean to also get the selected elements
				var obj = {};
				var dom = fl.getDocumentDOM();
				if(dom)
				{
					//BUG CS5.5 won't allow you to get a timeline sometimes
					var timeline = dom.getTimeline();
					obj =
					{
						document:	dom.pathURI || dom.name,
						timeline:	timeline.name,
						layers:		String(timeline.getSelectedLayers()),
						frames:		String(timeline.getSelectedFrames()),
						numLayers:	timeline.layers.length,
						numFrames:	timeline.frameCount,
						selection:	null
					}
				}
				return obj;
			},

		}
		
	// ---------------------------------------------------------------------------------------------------------------------
	// register class with xjsfl

		xjsfl.classes.register('UI', UI);
