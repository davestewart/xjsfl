/**
 * Delete Empty folders
 * @icon {iconsURI}filesystem/folder/folder_delete.png
 */
(function()
{
	// setup
		xjsfl.init(this);

	// variables
		var total = 0;
		var collection;

	// delete
		do
		{
			collection = $$(':folder:empty');
			total += collection.elements.length;
			collection.deleteItems();
		}
		while( collection.elements.length );

	// report
		trace(total + ' folder(s) deleted.')
})()
