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
		 * @type		{Array}
		 * @name		Timeline.selectedLayers
		 * @example		var layers = $timeline.selectedLayers;
		 */
		Timeline.prototype.__defineGetter__('selectedLayers',
			function ()
			{
				// variables
					var indices			= Utils.sort(this.getSelectedLayers());
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
		
		/**
		 * Gets the selected frames of a Timeline as an Array of Objects with 'index', 'start', 'end' and 'layer' properties
		 * @type		{Array}
		 * @name		Timeline.selectedFrames
		 * @example		var layers = $timeline.selectedFrames;
		 */
		Timeline.prototype.__defineGetter__('selectedFrames',
			function ()
			{
				// variables
					var values, index, layer, start, end;
					var frames	= [];
					var indices	= $timeline.getSelectedFrames();
					
				// 
					while(indices.length)
					{
						values	= indices.splice(0, 3);
						index	= values[0];
						start	= values[1];
						end		= values[2];
						layer	= $timeline.layers[index];
						frames.push({index:index, start:start, end:end, layer:layer});
					}
					
				// return frames
					return frames;
			}
		);
		
	// ----------------------------------------------------------------------------------------------------
	// Library
	
		/**
		 * Gets the name of an item only, minus the full library path
		 * @type		{String}
		 * @name		LibraryItem.itemName
		 * @example		if($library.items[20].itemName == 'Symbol 5')
		 */
		LibraryItem.prototype.__defineGetter__('itemName', function(){ return this.name.split('/').pop(); } );
		LibraryItem.prototype.__defineSetter__('itemName', function(value){ this.name = value; } );
		
		/**
		 * Gets all or optionally selected library items, but sorted by name
		 * @param	{Boolean}	selected	Optional boolean to return selected items only
		 * @returns	{Array}					An Array of LibraryItems
		 */
		Library.prototype.getItems = function(selected)
		{
			var items = selected ? this.getSelectedItems() : this.items;
			return Utils.sortOn(items, 'name', true);
		}

