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
		
			// check for native E4X
				if( ! window.XMLList)
				{
					alert('xJSFL cannot be installed on this version of Flash.\n\nThe framework requires E4X, which is available only in Flash CS3 or newer.');
					return false;
				}
				
			// check user is not installing into the Flash Configuration folder
				if(fl.scriptURI.indexOf(fl.configURI) === 0)
				{
					alert('xJSFL cannot be installed in the Flash configuration folder, as this could create file-dependency loops.\n\nPlease move the xJSFL installation folder elsewhere and try again.');
					return false;
				}
				
			// check that xJSFL is being installed into a folder called xJSFL (not necessary, but useful)
				if(! /\/xJSFL\/core\/install\/jsfl\/install.jsfl$/.test(fl.scriptURI))
				{
					alert('xJSFL should be installed in a folder called "xJSFL".\n\nPlease rename your current install folder, and try again');
					return false;
				}
				
			// check that another extension hasn't broken for..in or for..each loops
				var obj		= {};
				var arr		= [];
				var names	= [];
				for(var name in obj)names.push(obj[name]);
				for(var name in arr)names.push(arr[name]);
				if(names.length)
				{
					var str = 'It looks like another script or extension has broken for..each loops by adding one or more methods to the Object or Array prototypes.\n\nThese extension(s) will need to be uninstalled or disabled before installation can continue. Check the Output panel for details.';
					fl.trace('\nThe offending code is:\n\n\t' + names.join('\n\n').replace(/\n/g, '\n\t') + '\n\nPlease do a text search in your Flash configuration and Flash application folders for this \nJSFL code, and remove / disable their owning extensions for xJSFL installation to succeed.');
					alert(str);
					return false;
				}
				
			// check if user is using CS5, and if so, warn about empty error messages
				if(parseInt(fl.version.split(/[, ]/)[1]) >= 11)
				{
					var strs =
					[
						"It looks like you're using Flash CS5 or above.",
						"Unfortunately, CS5 (and higher) has a bug where JavaScript error messages are output empty, meaning that on this platform, any JSFL errors that are thrown will be difficult to impossible to debug.",
						"This issue doesn't affect the normal operation of xJSFL, but it *is* problematic during the everyday development of scripts (which invariably, will throw errors).",
						"Note that Flash CS4 (and below) does not exhibit this behaviour, so if possible, you might find it easier to develop on CS4 instead.",
						"Click OK to continue the installation."
					];
					var result = confirm(strs.join('\n\n'));
					if(result !== true)
					{
						return false;
					}
				}
				
		// ----------------------------------------------------------------------------------------
		// set up
		
			// determine xJSFL URI
				xjsfl			= window['xjsfl'] || {};
				xjsfl.uri		= fl.scriptURI.replace('core/install/jsfl/install.jsfl', '');
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
			// copy function
				function copy(srcURI, trgURI)
				{
					var trgPath = URI.toPath(trgURI);
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
							FLfile.setAttributes(trgURI, 'N');
							FLfile.remove(trgURI);
						}
						FLfile.copy(srcURI, trgURI);
						FLfile.setAttributes(trgURI, 'N');
					}
				}
				
				function remove(uri)
				{
					var path = URI.toPath(uri);
					xjsfl.output.trace('removing "' +path+ '"');
					FLfile.setAttributes(uri, 'N');
					FLfile.remove(uri);
				}
		
			// remove old commands
				var uris = Utils.glob(fl.configURI + 'Commands/xJSFL**');
				if(uris.length)
				{
					xjsfl.output.trace('removing old files...', true);
					for each(var uri in uris)
					{
						remove(uri);
					}
				}
				
			// debug
				xjsfl.output.trace('copying new files...', true);
				
			// variables
				var win				= fl.version.indexOf('WIN') !== -1;
				var installURI		= xjsfl.uri + 'core/install/flash/';
				
			// copy installation files
				var uris			= Utils.glob(installURI + '**');
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
				xjsfl.output.trace('finalizing install...', true);
				xjsfl.output.trace('writing xjsfl.uri file');
				save(fl.configURI + 'Tools/xjsfl.ini', xjsfl.uri);
				
			// copy user config
				xjsfl.output.trace('copying user config file');
				copy(xjsfl.uri + 'core/config/xjsfl.xml', xjsfl.uri + 'user/config/xjsfl.xml');

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

	try
	{
		install(this);
	}
	catch(error)
	{
		debug(error);
	}


