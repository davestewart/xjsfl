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

			// splash		
				fl.outputPanel.clear();
				fl.trace(FLfile.read(fl.configURI + 'Tools/xJSFL Splash.txt').replace(/\r\n/g, '\n'));
				
			// flags
				xjsfl.loading = true;

			// load core bootstrap
				fl.trace('> xjsfl: running core bootstrap...');
				fl.runScript(xjsfl.uri + 'core/jsfl/bootstrap.jsfl');
				
			// load user bootstrap
				fl.trace('> xjsfl: running user bootstrap...');
				fl.runScript(xjsfl.uri + 'user/jsfl/bootstrap.jsfl');
			
			// done!
				fl.trace('> xjsfl: ready!');
				fl.trace('\n=================================================================\n')
				
			// flags
				xjsfl.loading = false;
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