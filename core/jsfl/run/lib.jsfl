// run script to read command into variable as a string
	fl.runScript(fl.scriptURI.replace(/lib\.jsfl$/, '') + 'file.jsfl');
	
// grab librray items
	var dom = fl.getDocumentDOM()
	var lib = dom.library
	var sel	= lib.getSelectedItems();
	
// declare global variables
	var timeline, layers;
	
// loop
	if(jsfl)
	{
		for(var i = 0; i < sel.length; i++)
		{
			// open librray item
				fl.trace("> xjsfl: Updating item '" + sel[i].name + "'")
				lib.editItem(sel[i].name);
				
			// update globals
				timeline	= dom.getTimeline();
				layers		= timeline.layers;
				
			// execute script
				eval(jsfl);
		}
	}
	else
	{
		fl.trace('Error reading JSFL command');
	}
