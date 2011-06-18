// ------------------------------------------------------------------------------------------
// Library

	// ------------------------------------------------------------------------------------------
	// setup
	
		// this is a test! 
		
		trace		= fl.trace;
		library		= dom.library
		
	// ------------------------------------------------------------------------------------------
	// code
		var max			= 16;
		var root		= Math.sqrt(max);
		for(var i = 0; i < max; i++)
		{
			var path = 'test/test sprite ' + i;
			
			if(!library.itemExists(path))
			{
				library.addNewItem('movieclip', path);
				
				library.setItemProperty('linkageExportForAS', true);
				library.setItemProperty('linkageBaseClass', 'flash.display.Sprite');
				library.setItemProperty('linkageClassName', 'TestSprite' + i);
				library.editItem();
				
				dom.addNewRectangle({left:-50,top:-50,right:50,bottom:50}, Math.floor((i / max) * 50));
				dom.selectAll();
				dom.setFillColor(0xFFFFFF * Math.random());
				
				dom.editScene(0);
				var x = i % root;
				var y = Math.floor(i /root);
				library.addItemToDocument({x:(x * 100) + 50, y:(y * 100) + 50});
			}
			else
			{
				trace('The item ' + path + ' exists');
			}
			
		}
		
