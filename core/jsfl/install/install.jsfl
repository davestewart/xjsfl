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
		// checks
		
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
				
		// ----------------------------------------------------------------------------------------
		// set up
		
			// determine xJSFL URI
				xjsfl			= window['xjsfl'] || {};
				xjsfl.uri		= fl.scriptURI.replace('core/jsfl/install/install.jsfl', '');
				xjsfl.loading	= true;
				
			// load splash text
				fl.outputPanel.clear();
				fl.trace(FLfile.read(xjsfl.uri + 'core/assets/misc/splash.txt').replace(/\r\n/g, '\n'));

			// load proxy classes
				fl.trace('\n> xjsfl: INSTALLING xJSFL...');
				fl.trace('> xjsfl: loading proxy classes...');
				fl.runScript(xjsfl.uri + 'core/jsfl/proxies.jsfl');

			// logs
				xjsfl.output.reset(Log.INFO);
				xjsfl.output.reset(Log.FILE);
				
		// ----------------------------------------------------------------------------------------
		// load framework
		
			// load main xjsfl class
				xjsfl.output.trace('loading xjsfl...');
				fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');
				
			// load globals and key libraries
				xjsfl.output.trace('loading core classes...', 1);
				xjsfl.classes.load(xjsfl.uri + 'core/jsfl/libraries/framework/Globals.jsfl');
				xjsfl.classes.load(xjsfl.uri + 'core/jsfl/libraries/utils/Utils.jsfl');
				xjsfl.classes.load(xjsfl.uri + 'core/jsfl/libraries/file/URI.jsfl');
				xjsfl.classes.load(xjsfl.uri + 'core/jsfl/libraries/file/URIList.jsfl');
				
			// add search paths and load supporting libraries
				xjsfl.output.trace('loading supporting classes...', 1);
				xjsfl.settings.uris.add(xjsfl.uri + 'core/', 'core');
				xjsfl.classes.load(['JSFLInterface', 'XUL', 'Output', 'File', 'Folder']);

			// initialize
				xjsfl.init(this);
				
		// ----------------------------------------------------------------------------------------
		// install files
		
		if(true)
		{

			// debug
				xjsfl.output.trace('copying installation files...', true);
				
			// copy function
				function copy(srcURI, trgURI)
				{
					var trgPath = URI.toPath(trgURI, true);
					if(URI.isFolder(trgURI))
					{
						if( ! FLfile.exists(trgURI))
						{
							xjsfl.output.trace('creating folder "' +trgPath+ '"');
							FLfile.createFolder(trgURI);
						}
					}
					else
					{
						xjsfl.output.trace('copying file to "' +trgPath+ '"');
						if(FLfile.exists(trgURI))
						{
							FLfile.remove(trgURI);
						}
						FLfile.copy(srcURI, trgURI);
					}
				}
		
			// variables
				var win				= fl.version.indexOf('WIN') !== -1;
				var installURI		= xjsfl.uri + 'core/assets/install/flash/';
				var uris			= Utils.glob(installURI, '**/*');
				
			// copy files
				for each(var uri in uris)
				{
					// URIs
						var srcURI	= new URI(uri);
						var trgURI	= URI.reTarget(srcURI, fl.configURI, installURI);
						
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
				
			// initialize modules
				xjsfl.modules.find(xjsfl.uri + 'modules/', true);
				
			// write install URI
				xjsfl.output.trace('writing xjsfl.uri file');
				save(fl.configURI + 'Tools/xjsfl.ini', xjsfl.uri);

			// we're done!
				xjsfl.output.trace('installation complete!\n', true);
				xjsfl.output.trace('Restart Flash to start using xJSFL');
		}
				
		// ----------------------------------------------------------------------------------------
		// splash
		
			// set up environment
				xjsfl.loading = false;
				xjsfl.init(this);
				
			// splash
				var xul = XUL
					.factory()
					.load('//core/ui/install.xul')
					.setButtons('accept')
					.show();
	}

	install(this);


