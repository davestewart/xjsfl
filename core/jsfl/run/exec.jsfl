run = function(uri)
{
	var result = null;
	
	for(x = 0; x < fl.swfPanels.length; x++)
	{ 
		if(fl.swfPanels[x].name == 'Run Script')
		{
			result = fl.swfPanels[x].call('run', uri);
		}
	}

	if(typeof result != 'string')
	{
		alert('The xJSFL panel needs to be open to run JSFL scripts');
	}
	else
	{
		//fl.trace(result);
	}
}

fl.runScript(fl.scriptURI.replace(/exec\.jsfl$/, '') + 'file.jsfl');