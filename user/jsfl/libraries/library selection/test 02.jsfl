
xjsfl.init(this);
clear();

//var items = $$('Folder 1:movieclip');
var items = $$(':movieclip');


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

$$('*1:parent').select();

Timer.stop(true)
