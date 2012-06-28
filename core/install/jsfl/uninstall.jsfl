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
				if( ! confirm('Are you sure you want to uninstall xJSFL?\n\nThis will remove all xJSFL (and module) commands, panels, scripts other installation files from the main Flash folder, but will leave your xJSFL folder and files intact.\n\nYou can reinstall xJSFL at any time by running "install.jsfl" in the main xJSFL folder.') )
				{
					return false;
				}
				
			// init
				xjsfl.init(this);
				clear();
				
			// variables
				var baseURI, trgURI, uris;
				var trgURIs			= [];
				
		// ----------------------------------------------------------------------------------------
		// variables
				
			// variables
				var baseURI, trgURI, uris;
				var trgURIs			= [];
				
			// get all flash folders that would have content copied to the main Flash folder
				var installURI		= xjsfl.uri + 'core/install/';
				var folderURIs		= xjsfl.settings.uris.get().concat([installURI]);
				
			// grab file and folder URIs
				for each(var folder in folderURIs)
				{
					var baseURI		= folder + 'flash/'
					var uris		= Utils.glob(baseURI + '**');
					for each(var uri in uris)
					{
						var trgURI	= URI.reTarget(uri, fl.configURI, baseURI);
						trgURIs.push(trgURI);
					}
				}
				trgURIs = Utils.toUniqueArray(trgURIs);
				
		// ----------------------------------------------------------------------------------------
		// OK, let's go!
		
			// confirm deleting all files
				if(confirm('Click OK to delete ' +trgURIs.length+ ' files/folders from the Flash configuration folder...'))
				{
					// load strap
						clear();
						fl.trace(FLfile.read(xjsfl.uri + 'core/assets/misc/uninstall.txt').replace(/\r\n/g, '\n'));
						xjsfl.output.trace('uninstalling xjsfl', true);

					// feedback
						xjsfl.output.trace('deleting files/folders', true);
						
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
									xjsfl.output.trace('deleting file "' +path+ '"');
									if( ! file.remove(true) )
									{
										xjsfl.output.warn('the file "' +path+ '" could not be removed!');
									}
								}
								
							// handle folder
								else
								{
									// variables
										var folder = new Folder(uri);
									
									// only delete empty folders that are not the first folder of the Flash config URI, i.e. WindowSWF, External Tools, etc
										if(folder.exists && folder.parent.uri !== fl.configDirectory && folder.uris.length == 0)
										{
											xjsfl.output.trace('deleting folder "' +path+ '"');
											if( ! folder.remove(true) )
											{
												xjsfl.output.warn('the folder "' +path+ '" could not be removed!');
											}
										}
								}
						}
						
					// warn user about xJSFL extension
						xjsfl.output.trace('One last thing...', true);
						xjsfl.output.trace('The xJSFL extension is currently in use, so you will need to remove it manually from:');
						xjsfl.output.trace(URI.asPath(fl.configURI + 'External Libraries/'));
				}
				else
				{
					return false;
				}

		// ----------------------------------------------------------------------------------------
		// show uninstallation spalsh
		
			var xul = XUL
				.factory()
				.load('//core/ui/uninstall.xul')
				.setFlashData({click:'http://www.xjsfl.com/support/feedback'})
				.setButtons('accept')
				.show();

			// open DLL folder
				new Folder(fl.configURI + 'External Libraries/').open();
				
			// sob!
				xjsfl.output.trace('uninstallation complete. sob :(', true);
				
			// delete values
				for(var name in xjsfl)
				{
					if(name !== 'uri')
					{
						delete xjsfl[name];
					}
				}
				
			// set "uninstalled" flag
				xjsfl.uninstalled = true;
				
			// return
				return true;
	}
	
	uninstall(this);