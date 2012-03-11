// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██       ██              ██         ██ ██ 
//  ██  ██                       ██         ██ ██ 
//  ██  ██ █████ ██ █████ █████ █████ █████ ██ ██ 
//  ██  ██ ██ ██ ██ ██ ██ ██     ██      ██ ██ ██ 
//  ██  ██ ██ ██ ██ ██ ██ █████  ██   █████ ██ ██ 
//  ██  ██ ██ ██ ██ ██ ██    ██  ██   ██ ██ ██ ██ 
//  ██████ ██ ██ ██ ██ ██ █████  ████ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// xJSFL Uninstallation file

	function uninstall(window)
	{
		// ----------------------------------------------------------------------------------------
		// set up
		
			// quit if not installed
				if( ! (window.xjsfl && xjsfl.uri) )
				{
					alert('xJSFL is not installed');
					return false;
				}
				
			// confirm uninstallation
				if( ! confirm('Are you sure you want to uninstall xJSFL?\n\nThis will remove all xJSFL (and module) commands, panels, scripts other installation files from the main Flash folder, but will leave your xJSFL folder files intact.\n\nYou can reinstall xJSFL at any time by running "install.jsfl" in the main xJSFL folder.') )
				{
					return false;
				}
				
			// init
				xjsfl.init(window);
				
		// ----------------------------------------------------------------------------------------
		// variables
				
			// variables
				var baseURI, trgURI, uris;
				var trgURIs			= [];
				var xulURI			= xjsfl.uri + 'core/ui/uninstall.xul';
				var installURI		= xjsfl.uri + 'core/assets/install/';
				var folderURIs		= xjsfl.settings.uris.all.concat([installURI]);
				
			// collate URIs
				for each(var uri in folderURIs)
				{
					baseURI			= uri + 'flash/'
					uris			= Utils.walkFolder(baseURI, true);
					for each(uri in uris)
					{
						trgURI = URI.reTarget(uri, fl.configURI, baseURI);
						trgURIs.push(trgURI);
					}
				}
				trgURIs = Utils.toUniqueArray(trgURIs).sort();
				
		// ----------------------------------------------------------------------------------------
		// OK, let's go!
		
			// confirm deleting all files
				if(confirm('Click OK to delete ' +trgURIs.length+ ' files from the Flash configuration folder...'))
				{
					// load strap
						clear();
						fl.trace(FLfile.read(xjsfl.uri + 'core/assets/misc/uninstall.txt').replace(/\r\n/g, '\n'));
						xjsfl.output.log('uninstalling xjsfl', true);
				
					// feedback
						xjsfl.output.log('deleting files/folders', true);
						
					// delete files
						for (var i = trgURIs.length - 1; i > 0; i--)
						{
							// variables
								var uri		= new URI(trgURIs[i]);
								var path	= URI.toPath(uri, true);
								
							// handle file
								if(uri.type == 'file')
								{
									var file = new File(uri);
									xjsfl.output.log('deleting file "' +path+ '"');
									if( ! file.remove(true) )
									{
										xjsfl.output.log('WARNING: the file "' +path+ '" could not be removed!');
									}
								}
								
							// handle folder
								else
								{
									var folder = new Folder(uri);
									if(folder.exists && folder.parent.uri !== fl.configDirectory && folder.uris.length == 0)
									{
										xjsfl.output.log('deleting folder "' +path+ '"');
										if( ! folder.remove(true) )
										{
											xjsfl.output.log('WARNING: the folder "' +path+ '" could not be removed!');
										}
									}
								}
						}
						
					// warn user about xJSFL extension
						xjsfl.output.log('One last thing...', true);
						xjsfl.output.log('The xJSFL extension is currently in use, so you will need to remove it manually from:');
						xjsfl.output.log(URI.asPath(fl.configURI + 'External Libraries/'));
				}
				else
				{
					return;
				}

			// we're done! so show the splash dialog :)
				if( ! $dom )
				{
					fl.createDocument();
				}
				$dom.xmlPanel(xulURI);
				
			// sob!
				xjsfl.output.log('uninstallation complete. sob :(', true);
				
			// delete values
				for(var name in xjsfl)
				{
					delete xjsfl[name];
				}
	}

	uninstall(this);