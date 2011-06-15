// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██                      ██████              ██          ██                    
//  ██  ██                      ██  ██              ██          ██                    
//  ██  ██ █████ █████ ████     ██  ██ █████ █████ █████ █████ █████ ████ █████ █████ 
//  ██  ██ ██    ██ ██ ██       █████  ██ ██ ██ ██  ██   ██     ██   ██      ██ ██ ██ 
//  ██  ██ █████ █████ ██       ██  ██ ██ ██ ██ ██  ██   █████  ██   ██   █████ ██ ██ 
//  ██  ██    ██ ██    ██       ██  ██ ██ ██ ██ ██  ██      ██  ██   ██   ██ ██ ██ ██ 
//  ██████ █████ █████ ██       ██████ █████ █████  ████ █████  ████ ██   █████ █████ 
//                                                                              ██    
//                                                                              ██    
//
// ------------------------------------------------------------------------------------------------------------------------
// User Bootstrap - Load custom libraries and set custom settings here

	try
	{
		// add user paths
			//xjsfl.settings.paths.add('z:/temp/user/');
			//xjsfl.settings.paths.add('console', 'module');
			
		// load optional libraries
		
			
		// add user settings here

	}
	catch(err)
	{
		fl.runScript(xjsfl.uri + 'core/jsfl/libraries/output.jsfl');
		Output.inspect(err, 'Error running user bootstrap');
	}