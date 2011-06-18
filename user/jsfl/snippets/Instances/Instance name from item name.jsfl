/**
 * Change the selected item's names to match their library item's name
 *
 */

var elements = dom.selection;

for each(var element in elements)
{
	var item = element.libraryItem;
	if(item)
	{
		element.name = item.name.split('/').pop().replace(/\W/g, '_');
	}
}
dom.livePreview = true;
dom.selction = elements;
