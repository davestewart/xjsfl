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

	(function()
	{
		//delete xjsfl.uri;
		
		try
		{
			if(xjsfl)
			{
				// load only if not yet initialized (otherwise fl.reloadTools() runs this file)
					if( ! xjsfl.uri )
					{
						// ------------------------------------------------------------------------------------------------------------------------
						// functions

							var trace = fl.trace;

							function uriToPath(uri)
							{
								uri = uri
									.replace("file:///", "")
									.replace(/%20/g, " ")
									.replace(/^([A-Z])\|/i, "$1:");
								return uri;
							}

						// ------------------------------------------------------------------------------------------------------------------------
						// reload function

							xjsfl.reload = function()
							{
								// check xjsfl folder exists
									if( ! FLfile.exists(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl') )
									{
										trace('> xjsfl: The folder "' +uriToPath(xjsfl.uri)+ '" does not appear to be an xJSFL installation folder, so xJSFL cannot load.');
										return;
									}

								// load framework settings
									var config = new XML(FLfile.read(xjsfl.uri + 'core/config/xjsfl.xml'));

								// don't load framework if disabled
									if(config && config.settings.enabled == 0)
									{
										trace('> xJSFL is currently disabled. To enable, see the Configuration dialog at Commands > xJSFL > Configuration');
									}

								// otherwise load framework
									else
									{
										// set debug mode off (can't remember why now)
											if(typeof xjsfl.debug !== 'undefined')
											{
												xjsfl.debug.state = false;
											}

										// load splash text
											fl.outputPanel.clear();
											trace(FLfile.read(xjsfl.uri + 'core/assets/misc/splash.txt').replace(/\r\n/g, '\n'));

										// load core bootstrap
											fl.runScript(xjsfl.uri + 'core/jsfl/bootstrap.jsfl');

										// done!
											trace('\n=================================================================\n')
									}
							}

						// ------------------------------------------------------------------------------------------------------------------------
						// setup

							// tidy up
								delete xjsfl.name;
								delete xjsfl.MM_path;
								delete xjsfl.MM_loaded;

							// set xJSFL uri
								xjsfl.uri = FLfile.read(fl.configURI + 'Tools/xJSFL.ini').replace(/\/*$/, '/');

							// load framework
								xjsfl.reload();
					}
			}
		}
		catch(error)
		{
			if(error.message.match('xjsfl is not defined'))
			{
				fl.trace('> ' +error+ '. Check your Flash "Configuration/External Libraries" folder for the xJSFL extension');
			}
			else
			{
				fl.trace('> ' + error);
			}
		}
	})()
