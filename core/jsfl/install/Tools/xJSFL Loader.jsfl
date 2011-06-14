// ------------------------------------------------------------------------------------------------------------------------
//
//           ██ ██████ ██████ ██          ██                    ██            
//           ██ ██     ██     ██          ██                    ██            
//  ██ ██    ██ ██     ██     ██          ██     █████ █████ █████ █████ ████ 
//  ██ ██    ██ ██████ █████  ██          ██     ██ ██    ██ ██ ██ ██ ██ ██   
//   ███     ██     ██ ██     ██          ██     ██ ██ █████ ██ ██ █████ ██   
//  ██ ██    ██     ██ ██     ██          ██     ██ ██ ██ ██ ██ ██ ██    ██   
//  ██ ██ █████ ██████ ██     ██████      ██████ █████ █████ █████ █████ ██   
//
// ------------------------------------------------------------------------------------------------------------------------
// xJSFL Loader

	try
	{
		if(xjsfl)
		{
			// set xJSFL URI
				xjsfl.uri = '{xjsfl}';
				
			// tidy up
				delete xjsfl.name;
				delete xjsfl.MM_path;
				delete xjsfl.MM_loaded;
		
			// load bootstraps
				fl.runScript(xjsfl.uri + 'core/jsfl/bootstrap.jsfl');
				fl.runScript(xjsfl.uri + 'user/jsfl/bootstrap.jsfl');
			
			// done!
				fl.trace('> xjsfl: ready!');
				fl.trace('\n=================================================================')
		}
	}
	catch(err)
	{
		if(err.message.indexOf('xjsfl is not defined') != -1)
		{
			fl.trace('> ' +err+ '. Check your "Configuration/External Libraries" folder');
		}
		else
		{
			fl.trace('> ' + err);
		}
	}