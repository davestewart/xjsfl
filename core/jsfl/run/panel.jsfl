// --------------------------------------------------------------------------------
// run script from inside xJFSL Panel

	// grab uri 
		fl.runScript(fl.scriptURI.replace('/panel.jsfl', '/exec.jsfl'));
		
	// variables
		var result = null;
		
	// loop through panels to locate xJSFL panel
		for(x = 0; x < fl.swfPanels.length; x++)
		{
			//TODO Add run command to Snippets panel
			if(fl.swfPanels[x].name == 'Snippets')
			{
				//fl.trace('Running script: ' + uri)
				result = fl.swfPanels[x].call('run', uri);
			}
		}
	
	// check if panel was called successfully
		if(typeof result != 'string')
		{
			alert('The xJSFL Snippets panel needs to be open to run JSFL scripts');
		}
		else
		{
			//fl.trace(result);
		}
	

