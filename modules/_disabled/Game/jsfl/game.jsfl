/**
 * set Animator property
 *
 * Use toSource() to get source?
 * Or have button in the panel
 *
 * Have an xJSFL tool
 * Use extension as a global score between the 
 */

var game =
{
	init:function()
	{
		// add the event listener to see if game data is loaded
			if( ! xjsfl.modules['game'])
			{
				fl.addEventListener('documentOpened', this.loadData)
			}
	},
	
	loadData:function()
	{
		if(document.documentHasData('gamedata'))
		{
			var jsfl = document.getDataFromDocument('gamedata');
			if(confirm('This document has game data saved with it. Would you like to play now!?'))
			{
				eval(jsfl);
			}
		}
	},
	
	saveData:function(jsfl)
	{
		fl.trace("Saving game data...")
		document.addDataToDocument('gamedata', 'string', jsfl);
		fl.trace("Data saved OK")
	},
	
	
}

new Module('Game', game);