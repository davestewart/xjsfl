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
// Flash

	/**
	 * Flash
	 * @overview	Miscellaneous methods and properties that should already be part of Flash (but aren't!)
	 */

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
		 * @type		{String}
		 * @name		Timeline.selectedLayers
		 * @example		var layers = $timeline.selectedLayers;
		 */
		Timeline.prototype.__defineGetter__('selectedLayers',
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
		 * The short name of an item
		 * @type		{String}
		 * @name		LibraryItem.shortname
		 * @example		$library.items[20].shortName = 'Symbol 5'
		 */
		LibraryItem.prototype.__defineGetter__('shortName',
			function()
			{
				return this.name.split('/').pop();
			}
		);

