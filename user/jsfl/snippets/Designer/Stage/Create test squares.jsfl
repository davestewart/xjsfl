/**
 * Create a set of test elememts you can play with
 * @icon {iconsURI}design/imaging/imaging_large_tiles.png
 */
function makeSquares(num, cols, gutter, style, setStage, clearStage)
{
	// benchmark
		var timer		= new Timer('Create squares').start();
	
	// variables
		num				= num || 9;
		cols			= cols || 3;
		var dom			= $dom;
		var lib			= $library;
		var context		= Context.create();

	// debug
		fl.enableImmediateUpdates(false);

	// clear stage
		if(clearStage)
		{
			dom.selectAll();
			if(dom.selection.length)
			{
				dom.deleteSelection();
			}
		}

	// make square
		var itemName = 'test square';
		if(lib.itemExists(itemName))
		{
			lib.deleteItem(itemName)
		}
		
	// make square
		lib.addNewItem('movie clip', itemName);
		lib.editItem(itemName);
		dom.addNewRectangle({left:-25, top:-25, right:25, bottom:25}, 0);
		
	// break apart (sometimes the new square is a primitive, sometimes not - weird)
		dom.selectAll();
		if($selection[0].elementType == 'shape' && $selection[0].isGroup)
		{
			$dom.breakApart();
		}

	// color
		switch(style)
		{
			case 'red':
				dom.setFillColor('#FF000066');
				dom.setStroke('#000000', 0.25, 'solid');
			break;
			case 'grey':
				dom.setFillColor('#777777');
				dom.setStroke('#7777777', 0.25, 'solid');
			break;
			case 'black':
				dom.setFillColor('#000000');
				dom.setStroke('#000000', 0.25, 'solid');
			break;
		}
		
	// switch back to original context
		context.goto();

	// variables
		var collection	= $('*');
		var px			= 0
		var py			= 0;
		var rows		= Math.ceil(num / cols);
		var x;
		var y;

	// update stage size
		if(setStage)
		{
			dom.width	= (Math.min(cols, num) * (50 + gutter)) + gutter;
			dom.height	= (rows * (50 + gutter)) + gutter;;
		}

	// add items to scene
		for(var i = 0; i < num; i++)
		{
			// coords
				px	= i % cols;
				py	= (i - px) / cols;

			// values
				x	= (px * 50) + (px * gutter) + (gutter + 25)
				y	= (py * 50) + (py * gutter) + (gutter + 25)

			// do it
				var name = 'item_' + Utils.pad(i + 1, 2);
				if(collection.find(name).length == 0)
				{
					lib.addItemToDocument({x:x, y:y}, itemName);
					dom.selection[0].name = name;
				}
		}
		collection = $('*').select();

	// debug
		fl.enableImmediateUpdates(true);
		
	// benchmark
		timer.stop(true);

}
xjsfl.init(this);
if(UI.dom)
{
	XUL.create('title:Create squares,columns:[100,120],numeric:Total=[10,0,100],numeric:Columns=[10,1,100],numeric:Gutter=[5,0,100],dropdown:Style={Transparent Red:red,Grey:grey,Black:black},checkbox:Set stage size=true,checkbox:Clear stage=true', makeSquares);
}