//xjsfl.init(this);

/**
 * Create a set of test elememts you can play with
 */
function makeSquares(num, cols, gutter, setStage, clearStage)
{
	// variables
		num				= num || 9;
		cols			= cols || 3;
		var dom			= window.dom;
		var lib			= dom.library;
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
		if( ! lib.itemExists('square'))
		{
			lib.addNewItem('movie clip', 'square');
			lib.editItem('square');
			dom.addNewRectangle({left:-25, top:-25, right:25, bottom:25}, 0);
			dom.selectAll();
			dom.setFillColor('#FF000066');
			dom.setStroke('#000000', 0.5, 'solid')
			context.goto();
		}
		
	// variables
		var collection = $('*');
		var px		= 0
		var py		= 0;
		var rows	= Math.ceil(num / cols);
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
				var name = 'Item_' + xjsfl.utils.pad(i + 1, 2);
				if( ! collection.find(name))
				{
					lib.addItemToDocument({x:x, y:y}, 'square');
					dom.selection[0].name = name;
				}
		}
		dom.selectNone();
		
	// debug
		fl.enableImmediateUpdates(true);

}

XUL.create('title:Create squares,numeric:Total=[10,0,100],numeric:Columns=[5,1,100],numeric:Gutter=[5,0,100],checkbox:Set stage size=true,checkbox:Clear stage=true', makeSquares);

