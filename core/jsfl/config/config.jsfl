// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████              ████ ██       
//  ██                  ██            
//  ██     █████ █████  ██   ██ █████ 
//  ██     ██ ██ ██ ██ █████ ██ ██ ██ 
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ 
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ 
//  ██████ █████ ██ ██  ██   ██ █████ 
//                                 ██ 
//                              █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Config

	// -----------------------------------------------------------------------------------------------------------
	// functions

		function getPath(uri)
		{
			return FLfile.uriToPlatformPath(uri).replace(/\\/g, '/');
		}

	// -----------------------------------------------------------------------------------------------------------
	// setup

		// config
			var configURI	= xjsfl.uri + 'core/config/xjsfl.xml';
			var configStr	= FLfile.read(configURI);
	
			if( ! configStr)
			{
				fl.trace('> xjsfl: The default xJSFL config could not be found. Rebuilding...');
				configStr = '<config><settings><enabled>1</enabled></settings></config>';
			}
			var config		= new XML(configStr);

		// enabled state
			if( ! xjsfl.settings)
			{
				xjsfl.settings = { };
			}
			xjsfl.settings.enabled = config.settings.enabled == 1;

		// show panel
			var results		= fl.xmlPanel(xjsfl.uri + 'core/ui/config.xul');
		
	// -----------------------------------------------------------------------------------------------------------
	// handle results
	
		if(results.dismiss == 'accept')
		{
			// ---------------------------------------------------------------------------------------------------
			// update installation folder
			
				var installURI = String(FLfile.platformPathToURI(results.installfolder)).replace(/\/*$/, '/');	
				if(FLfile.exists(installURI + 'core/jsfl/libraries/xjsfl.jsfl'))
				{
					installURI = installURI			
					if(xjsfl.uri != installURI)
					{
						var iniURI = fl.configURI + 'Tools/xJSFL.ini';
						FLfile.write(iniURI, installURI);
						alert('The xJSFL installation location has been changed to "' +getPath(installURI)+ '".\n\nRestart Flash for changes to take effect.');
					}
				}
				else
				{
					alert('The xJSFL installation location cannot be changed, as "' +getPath(installURI)+ '" is not an xJSFL installation folder.');
				}
				
			// ---------------------------------------------------------------------------------------------------
			// toggle enabled
			
				// update config
					results.enabled = parseInt(results.enabled);
					if(xjsfl.settings.enabled != results.enabled)
					{
						// values
							xjsfl.settings.enabled = config.settings.enabled = results.enabled;
							FLfile.write(configURI, config.toXMLString());
			
						// reload xJSFL if enabled was chosen
							if(results.enabled)
							{
								xjsfl.reload();
							}
							else
							{
								var str = 'xJSFL will be disabled the next time Flash starts';
								fl.trace('\n> xjsfl: ' + str);
								alert(str);
							}
						
					}
		}
