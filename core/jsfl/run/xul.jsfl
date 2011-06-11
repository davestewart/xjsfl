// --------------------------------------------------------------------------------
// load XUL panel inside Flash

	// check for DOM
		var dom = xjsfl.dom
		
	// if a document is open...
		if(dom)
		{
			// grab uri 
				fl.runScript(fl.scriptURI.replace('/xul.jsfl', '/exec.jsfl'));
				
			// run the panel
				if(uri)
				{
					dom.xmlPanel(uri);
				}
				else
				{
					xjsfl.trace('Error reading XUL');
				}
		}
