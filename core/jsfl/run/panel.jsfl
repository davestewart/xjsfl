// --------------------------------------------------------------------------------
// run script from inside xJFSL Panel

	// grab uri 
		fl.runScript(fl.scriptURI.replace('/panel.jsfl', '/exec.jsfl'));
		
	// grab and call the panel
		var panel	= xjsfl.utils.getPanel('Snippets');
		var result	= panel ? panel.call('run', uri) : null;
	
	// check if panel was called successfully
		if(typeof result != 'string')
		{
			alert('The xJSFL Snippets panel needs to be open to run JSFL scripts');
		}
	

