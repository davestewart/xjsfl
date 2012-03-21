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
				
			// Check user is not installing into particular Flash folders
				if(fl.scriptURI.indexOf(fl.configURI) === 0)
				{
					alert('xJSFL cannot be installed in the Flash configuration folder, as this could create file-dependency loops.\n\nPlease move the xJSFL installation folder elsewhere and try again.');
					return false;
				}
				
			// load bootstrap
				//TODO - Add in checks in case bootstrap fails
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
				var installURI		= xjsfl.uri + 'core/assets/install/flash/';
				var uris			= Utils.walkFolder(installURI, true);
				
		// ----------------------------------------------------------------------------------------
		// OK, let's go!
		
			// copy files
				xjsfl.output.log('copying installation files', true);
				for each(var uri in uris)
				{
					// URIs
						srcURI		= new URI(uri);
						trgURI		= URI.reTarget(srcURI, fl.configURI, installURI);
						
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
				
		// ----------------------------------------------------------------------------------------
		// show installation spalsh, and set user info
		
			// callbacks
				function onAccept(name, email, url)
				{
					var params = ['name', 'email', 'url'];
					for (var i = 0; i < params.length; i++)
					{
						config.set('personal.' + params[i], arguments[i]);
					}
					onCancel();
				}
				
				function onCancel()
				{
					var str	= 'Thanks for installing xJSFL!'
							+ '\n\nTo update your user details in future, go to: Commands > xJSFL > Update User Info.'
							+ '\n\nTo start using xJSFL now, restart Flash, then go to: Window > Other Panels > xJSFL Snippets.'
							+ '\n\nGo to www.xjsfl.com/support for help, documentation & tutorials.'
					alert(str);
				}
				
			// get values and show splash
				var config	= new Config('user');
				var values	= config.get('personal');
				var xul = XUL
					.factory()
					.load('//core/ui/install.xul')
					.setValues(values)
					.show(onAccept, onCancel);
	}

	install(this);