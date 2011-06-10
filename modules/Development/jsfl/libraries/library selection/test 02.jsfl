
xjsfl.init(this);
//clear();

//var items = $$('Folder 1:movieclip');


/**
 * Item renaming callback
 * @param	name	{String}
 * @param	index	{Number}
 * @param	item	{Item}
 * @returns			{String}
 */
function rename(name, index, item)
{
	return item.linkageClassName + ' ' + (index + 1);
}


Timer.start();

/*
items
	.sort()
	//.inspect()
	.select()
	.rename()
	.rename(rename)
	.move('clips')

*/
	
/*
	
var folders = $$(':folder');
	
// organise library items
[':bitmap',':graphic',':button',':movieclip', '=Sprite'].forEach
(
    function(item, index)
    {
        $$(item).move('assets/' + item + 's');
    }
);

//folders.select().remove();
$$(':folder').expand();

*/

//var items = $$('*o').select();
var items	= $$(':movieclip')
//var data	= xjsfl.utils.collect(items.elements, ['name','itemType','linkageExportForAS'], true);

//Output.inspect(items.elements[0], '', 6)
//Table.print(items.elements, null, 500);
//Table.print(items.elements, 'symbolType,name,linkageClassName,linkageBaseClass');

//Timer.stop(true)

function rename(name, index, item){
    return item.linkageClassName.split('.').pop();
}
$$(':exported').rename(rename).select()