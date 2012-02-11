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
		try
		{
			if(xjsfl)
			{
				// load xJSFL uri
					fl.runScript(fl.configURI + 'Tools/xJSFL.ini');

				// load only if not yet initialized (otherwise fl.reloadTools() runs this file)
					if( ! xjsfl.initialized )
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
									if( ! FLfile.exists(xjsfl.uri) )
									{
										trace('> The xJSFL installation folder at "' +uriToPath(xjsfl.uri)+ '" appears to have been moved or deleted.');
										return;
									}

								// load framework settings
									var config = new XML(FLfile.read(xjsfl.uri + 'core/config/xjsfl.xml'));

								// don't load framework if disabled
									if(config && config.settings.@disabled == 1)
									{
										trace('> xJSFL is currently disabled. To enable, go to Commands > xJSFL > Change startup settings');
									}

								// otherwise load framework
									else
									{
										// load splash text
											fl.outputPanel.clear();
											trace(FLfile.read(fl.configURI + 'Tools/xJSFL Splash.txt').replace(/\r\n/g, '\n'));

										// set debug mode off (can't remember why now)
											if(typeof xjsfl.debug !== 'undefined')
											{
												xjsfl.debug.state = false;
											}

										// load core bootstrap
											trace('> xjsfl: install path: "' +uriToPath(xjsfl.uri)+ '"');
											fl.runScript(xjsfl.uri + 'core/jsfl/bootstrap.jsfl');

										// done!
											trace('> xjsfl: ready!');
											trace('\n=================================================================\n')
									}
							}

						// ------------------------------------------------------------------------------------------------------------------------
						// setup

							// tidy up
								delete xjsfl.name;
								delete xjsfl.MM_path;
								delete xjsfl.MM_loaded;

							// load framework
								xjsfl.reload();

							// set initialized
								xjsfl.initialized = true;
					}
			}
		}
		catch(error)
		{
			if(error.message.match('xjsfl is not defined'))
			{
				fl.trace('> ' +error+ '. Check your Flash "Configuration/External Libraries" folder for "xjsfl.dll"');
			}
			else
			{
				fl.trace('> ' + error);
			}
		}
	})()
