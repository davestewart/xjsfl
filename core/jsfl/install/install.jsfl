// ------------------------------------------------------------------------------------------------------------------------
//
//  ██              ██         ██ ██
//  ██              ██         ██ ██
//  ██ █████ █████ █████ █████ ██ ██
//  ██ ██ ██ ██     ██      ██ ██ ██
//  ██ ██ ██ █████  ██   █████ ██ ██
//  ██ ██ ██    ██  ██   ██ ██ ██ ██
//  ██ ██ ██ █████  ████ █████ ██ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// xJSFL Installation file

	function install(window)
	{
		// ----------------------------------------------------------------------------------------
		// set up
		
			// variables
				xjsfl =
				{
					uri:String(fl.scriptURI).replace('core/jsfl/install/install.jsfl', '')
				}
			
			// Check for native E4X
				if( ! window.XMLList)
				{
					alert('xJSFL cannot be installed on this version of Flash.\n\nThe framework requires E4X, which is available only in Flash CS3 or newer.');
					return false;
				}
				
			// load bootstrap
				fl.runScript(xjsfl.uri + 'core/jsfl/bootstrap.jsfl');
				
			// load strap
				fl.outputPanel.clear();
				fl.trace(FLfile.read(xjsfl.uri + 'core/assets/misc/splash.txt').replace(/\r\n/g, '\n'));

			// feedback
				xjsfl.output.log('installing xjsfl', true);
				
		// ----------------------------------------------------------------------------------------
		// variables
		
			// function
				function copy(srcURI, trgURI)
				{
					var trgPath = URI.toPath(trgURI, true);
					if(URI.isFolder(trgURI))
					{
						if( ! FLfile.exists(trgURI))
						{
							xjsfl.output.log('creating folder "' +trgPath+ '"');
							FLfile.createFolder(trgURI);
						}
					}
					else
					{
						xjsfl.output.log('copying file to "' +trgPath+ '"');
						if(FLfile.exists(trgURI))
						{
							FLfile.remove(trgURI);
						}
						FLfile.copy(srcURI, trgURI);
					}
				}
		
			// variables
				var srcURI;
				var trgURI;
				var win				= fl.version.indexOf('WIN') !== -1;
				var installURI		= xjsfl.uri + 'core/assets/flash/';
				var uris			= Data.recurseFolder(installURI, true);
				
		// ----------------------------------------------------------------------------------------
		// OK, let's go!
		
			// copy files
				xjsfl.output.log('copying installation files', true);
				for each(var uri in uris)
				{
					// URIs
						srcURI		= new URI(uri);
						trgURI		= URI.reTarget(srcURI, installURI, fl.configURI);
						
					// libs
						if(srcURI.path.indexOf('External Libraries') !== -1)
						{
							if( (win && srcURI.name == 'xjsfl.dll') || (! win && srcURI.name == 'xjsfl.bundle') )
							{
								copy(srcURI, trgURI);
							}
						}
						else
						{
							copy(srcURI, trgURI);
						}
				}
				
			// write install URI
				xjsfl.output.log('writing xjsfl.uri file');
				save(fl.configURI + 'Tools/xjsfl.ini', 'xjsfl.uri = "' +xjsfl.uri+ '";');

			// we're done!
				xjsfl.output.log('installation complete\n', true);
				xjsfl.output.log('Restart Flash to start using xJSFL!');
				
			// so show the splash dialog :)
				var dom = fl.getDocumentDOM();
				if( ! dom )
				{
					dom = fl.createDocument();
				}
				dom.xmlPanel(xjsfl.uri + 'core/ui/install.xul')
	}

	install(this);