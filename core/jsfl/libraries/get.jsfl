// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██
//  ██            ██
//  ██     █████ █████
//  ██ ███ ██ ██  ██
//  ██  ██ █████  ██
//  ██  ██ ██     ██
//  ██████ █████  ████
//
// ------------------------------------------------------------------------------------------------------------------------
// Get - Utility functions to ensure user has a document open, selection, etc, and alert if not


	// --------------------------------------------------------------------------------
	// Library

		/**
		 * A set of functions to return objects or selections in the UI, or issue standard warnings if not available
		 */
		Get =
		{
			/**
			 * Get the current Document DOM, or issue a standard warning if not available
			 * @returns	{Document}		A Document object
			 * @returns	{Boolean}		False if not available
			 */
			dom:function()
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
			timeline:function()
			{
				if(Get.dom())
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
			items:function()
			{
				if(Get.dom())
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
			selection:function()
			{
				if(Get.dom())
				{
					if($selection.length > 0)
					{
						return $selection;
					}
					alert('Make a selection before running this script');
					return false;
				}
				return false;
			}

		}

	// ---------------------------------------------------------------------------------------------------------------------
	// register class with xjsfl

		xjsfl.classes.register('Get', Get);
