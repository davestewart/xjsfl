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
			
		// load optional libraries
			xjsfl.classes.load
			([
				// this should be a list of {String} file names residing in the user/jsfl/libraries folder, without the .jsfl extension
			]);
			
		// modules
			xjsfl.modules.load
			([
				// this should be a list of {String} module folders residing in the modules folder
			]);
			
		// add user settings here

	}
	catch(err)
	{
		fl.runScript(xjsfl.uri + 'core/jsfl/libraries/output.jsfl');
		Output.inspect(err, 'Error running user bootstrap');
	}