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
			if( ! xjsfl.uri ) // reload only if xjsfl.uri is unset
			{
				//TODO Add checks to make sure xjsfl.ui folder exists, and promt to reinstall if it doesn't
				
				// functions
					function uriToPlatformPath(uri)
					{
						uri = uri.replace("file:///", "").replace(/%20/g, " ");
						if (/win/i.test(fl.version))
						{
							uri = uri.replace(/^([A-Z])\|/i, "$1:");
						}
						return uri;
					}


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
					fl.trace('> xjsfl: install path: "' +uriToPlatformPath(xjsfl.uri)+ '"');
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