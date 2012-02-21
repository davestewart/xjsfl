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

	function install()
	{
		// ----------------------------------------------------------------------------------------
		// preflight checks...

			// Check for native E4X
				if( ! window.XMLList)
				{
					alert('xJSFL cannot be installed on this version of Flash.\n\nThe framework requires E4X, which is available only in Flash CS3 or newer.');
					return false;
				}

			// check that root folder is *only* named xJSFL
				var xjsflURI = String(fl.scriptURI).replace('core/install/install.jsfl', '');
				if( ! /\bxJSFL\/$/.test(xjsflURI))
				{
					alert('xJSFL installation issue.\n\nThe xJSFL root folder must only be named "xJSFL".\n\nPlease rename the folder and start the installation process again.');
					return false;
				}

			// check that there is only one xJSFL folder in the install path
				var matches = xjsflURI.match(/\bxJSFL\//g)
				if(matches.length > 2)
				{
					alert('xJSFL installation issue.\n\nThere must only be one folder named "xJSFL" in the installation path.\n\nPlease move the real xJSFL folder to a new location and start the installation process again.');
					return false;
				}


		// ----------------------------------------------------------------------------------------
		// OK, let's go!

			// variables
				var src, trg, file;
				var win		= fl.version.indexOf('WIN') != -1;
				var uris	=
				{
					xjsfl		:xjsflURI,
					install		:xjsflURI + 'core/install/',
					config		:fl.configURI,
					tools		:fl.configURI + 'Tools/',
					commands	:fl.configURI + 'Commands/',
					swf			:fl.configURI + 'WindowSWF/'
				};

			// functions
				function populate(obj, srcURI, trgURI)
				{
					// read file
						var text = FLfile.read(srcURI);

					// populate
						var rx;
						for(var name in obj)
						{
							rx		= new RegExp('{' +name+ '}', 'g')
							text	= text.replace(rx, obj[name]);
						}

					// save
						if(trgURI)
						{
							FLfile.write(trgURI, text);
						}
				}

				function copy(srcURI, trgURI)
				{
					if(FLfile.exists(trgURI))
					{
						FLfile.remove(trgURI);
					}
					FLfile.copy(srcURI, trgURI);
				}

		// ----------------------------------------------------------------------------------------
		// copy files

			// dll
				file			= win ? 'xjsfl.dll' : 'xjsfl.bundle';
				src				= uris.install + 'External Libraries/' + file;
				trg				= uris.config + 'External Libraries/' + file;
				copy(src, trg);

			// ini
				src				= uris.install + 'Tools/xJSFL.ini';
				trg				= uris.tools + 'xJSFL.ini';
				populate(uris, src, trg);

			// loader
				src				= uris.install + 'Tools/xJSFL Loader.jsfl';
				trg				= uris.tools + 'xJSFL Loader.jsfl';
				populate(uris, src, trg);

			// Splash
				src				= uris.install + 'Tools/xJSFL Splash.txt';
				trg				= uris.tools + 'xJSFL Splash.txt';
				populate(uris, src, trg);

			// Snippets
				src				= uris.xjsfl + 'modules/Snippets/ui/xJSFL Snippets.swf';
				trg				= uris.swf + 'xJSFL Snippets.swf';
				copy(src, trg);

			// Commands
				var commands = FLfile.listFolder(uris.install + 'Commands/*.jsfl');
				for each(var command in commands)
				{
					src			= uris.install + 'Commands/' + command;
					trg			= uris.commands + 'xJSFL/' + command;
					copy(src, trg);
				}

		// ----------------------------------------------------------------------------------------
		// initialize framework and show splash

			// xJSFL
				xjsfl.initialized = false;
				fl.runScript(uris.install + 'Tools/xJSFL Loader.jsfl');

			// splash
				var dom = fl.getDocumentDOM();
				if( ! dom )
				{
					dom = fl.createDocument();
				}
				dom.xmlPanel(xjsflURI + 'core/install/ui/install.xul')

		// ----------------------------------------------------------------------------------------
		// done

			return true;
	}

	install();