// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██             ██    
//  ██     ██             ██    
//  ██     ██ █████ █████ █████ 
//  █████  ██    ██ ██    ██ ██ 
//  ██     ██ █████ █████ ██ ██ 
//  ██     ██ ██ ██    ██ ██ ██ 
//  ██     ██ █████ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Flash - Miscellaneous methods and properties that should already be part of Flash (but aren't!)

	// includes
		xjsfl.init(this, ['Events']);
		
	// ----------------------------------------------------------------------------------------------------
	// Document
	
		// callback
			function addUpdate()
			{
				Document.prototype.update = function()
				{
					this.livePreview = true;
				}
			}

		// need to add using events, otherwise Flash errors on startup
			xjsfl.events.add(DocumentEvent.OPENED, addUpdate, 'update');
			xjsfl.events.add(DocumentEvent.NEW, addUpdate, 'update');
	
	// ----------------------------------------------------------------------------------------------------
	// Timeline
	
		/**
		 * Gets the selected layers of a Timeline
		 * @returns		{Array}						An Array of Layer instances
		 * @property	{String}	selectedLayers	Gets the selected layers of a Timeline
		 */
		Timeline.prototype.__defineGetter__
		(
			'selectedLayers',
			function ()
			{
				// variables
					var indices			= this.getSelectedLayers();
					var selectedLayers	= [];
					
				// get layers
					for each(var index in indices)
					{
						selectedLayers.push(this.layers[index]);
					}
					
				// return layers
					return	selectedLayers;
			}
		);

	// ----------------------------------------------------------------------------------------------------
	// Library
	
		/**
		 * Gets the short name of a Library Item
		 * @returns	{String}			The short name of an item
		 * @function
		 */
		LibraryItem.prototype.__defineGetter__
		(
			'shortName',
			function()
			{
				return this.name.split('/').pop();
			}
		);

