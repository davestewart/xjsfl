/**
 * Automatically set padded Slice-9 scaling guides based on the current selection or first-frame element
 */
function setSlice9Guides(padding)
{
	// variables
		var bounds		= new Bounds($selection[0] || $timeline.layers[0].frames[0].elements[0]);
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

XUL.create('numeric:Padding=5', setSlice9Guides)