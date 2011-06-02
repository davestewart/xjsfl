

var dom				= fl.getDocumentDOM();
var lib				= dom.library
var items			= lib.items

var type			= "graphic"

lib.selectNone();
for(var i = 0; i < items.length; i++)
{
	var item	= items[i];
	var name	= item.name;
	if(item.itemType == 'movie clip')
	{
		lib.selectItem(item.name, false, true)
		fl.trace([name, item.itemType]);
	}
}
lib.setItemProperty("symbolType", type); 
