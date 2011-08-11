// --------------------------------------------------------------------------------
// run script on selected library items

	// grab uri 
		fl.runScript(fl.scriptURI.replace('/lib.jsfl', '/exec.jsfl'));
		
	// check for DOM
		var dom = xjsfl.dom
		
	// if a document is open...
		if(dom)
		{
			// read JSFL
				var jsfl	= FLfile.read(uri);
				
			// grab library items
				var lib		= dom.library;
				var sel		= lib.getSelectedItems();
				
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
					fl.trace('Error running JSFL command');
				}
		}
		