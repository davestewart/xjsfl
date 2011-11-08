/**
 * Change the selected item's names to match their library item's name
 *
 */

for each(var element in $selection)
{
	var item = element.libraryItem;
	if(item)
	{
		element.name = item.name.split('/').pop().replace(/\W/g, '_');
	}
}
$dom.selction = elements;
$dom.livePreview = true;
