/**
 * Automatically set padded Slice-9 scaling guides based on the current selection or first-frame element
 * @icon {iconsURI}design/imaging/imaging_print_size.png
 */
// setup
	xjsfl.init(this);

// callback
	function setSlice9Guides(padding)
	{
		// variables
			var input		= $selection.length ? $selection : $('*').elements;
			var bounds		= new Bounds(input);
			var lib			= $library;
			var items		= $library.items;
			var timeline	= $timeline;

		// update bounds with padding
			if( ! bounds )
			{
				return;
			}
			bounds.left		+= padding;
			bounds.right	-= padding;
			bounds.top		+= padding;
			bounds.bottom	-= padding;

		// find item
			for each(var item in items)
			{
				if(item.timeline == timeline)
				{
					lib.selectItem(item.name);
					lib.setItemProperty('scalingGrid',  true);
					lib.setItemProperty('scalingGridRect', bounds);
				}
			}
	}

// UI
	XUL.create('title:Add 9-slice scaling,columns:[60, 60],numeric:Padding=5', setSlice9Guides)
