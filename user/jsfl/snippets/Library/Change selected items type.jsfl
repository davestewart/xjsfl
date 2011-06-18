/**
 * Change the selected items to movieclip, button or graphic
 * @icon {iconsURI}Office/book/book_edit.png
 */
(function(){

	// callback
		function accept(type)
		{
			items.attr('symbolType', type);
		}

	// grab items	
		var items = $$(':selected');
		
	// if items, do it!
		if(items.elements.length > 0)
		{
			var settings = XUL.create('dropdown:Type=[movie clip, graphic,button],title:Change selected item types', accept)
		}
		else
		{
			alert('You need to select some library items before running this script');
		}
	
})()