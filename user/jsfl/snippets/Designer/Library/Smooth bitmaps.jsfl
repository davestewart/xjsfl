/**
 * Smooth all bitmaps in the library
 * @icon {iconsURI}design/image/image.png
 */
(function()
{
	// setup
		xjsfl.init(this);

	// callback
		function onAccept(smooth, selected)
		{
			selected = selected ? ':selected' : '';
			$$(':bitmap' + selected).attr('allowSmoothing', smooth);
		}

	// delete
		if(UI.items)
		{
			XUL.create('title:Smooth Library Bitmaps,checkbox:Smooth=true,checkbox:SelectedOnly=false', onAccept)
		}
})()
