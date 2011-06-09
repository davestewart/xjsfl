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

	// ----------------------------------------------------------------------------------------
	// variables
	
		// folders
			var src, trg, file;
			var win = fl.version.indexOf('WIN') != -1;
			var uris =
			{
				install		:fl.scriptURI.replace(/[^\/]+$/, ''),
				xjsfl		:fl.scriptURI.replace(/core\/.+$/, ''),
				config		:fl.configURI,
				tools		:fl.configURI + 'Tools/',
				swf			:fl.configURI + 'WindowSWF/'
			};
			
	// ----------------------------------------------------------------------------------------
	// functions
	
		function populate(srcURI, obj, trgURI)
		{
			// read file
				var text = FLfile.read(srcURI);
				
			// populate
				var rx;
				for(var i in obj)
				{
					rx		= new RegExp('{' +i+ '}', 'g')
					text	= text.replace(rx, obj[i]);
				}
				
			// save
				if(trgURI)
				{
					FLfile.write(trgURI, text);
				}
		}
		
	// ----------------------------------------------------------------------------------------
	// copy files
	
		// dll
			file			= win ? 'xjsfl.dll' : 'xjsfl';
			src				= uris.install + 'External Libraries/' + file;
			trg				= uris.config + 'External Libraries/' + file;
			FLfile.copy(src, trg);
			
		// loader
			src				= uris.install + 'xJSFL Loader.jsfl';
			trg				= uris.tools + 'xJSFL Loader.jsfl';
			populate(src, uris, trg);
			
		// Splash
			src				= uris.install + 'xJSFL Splash.txt';
			trg				= uris.tools + 'xJSFL Splash.txt';
			populate(src, uris, trg);
			
		// Snippets
			src				= uris.xjsfl + 'modules/Snippets/ui/xJSFL Snippets.swf';
			trg				= uris.swf + 'xJSFL Snippets.swf';
			FLfile.copy(src, trg);
			
		// ini
			populate(uris.install + 'xJSFL.ini', uris, uris.tools + 'xJSFL.ini');
			
	// ----------------------------------------------------------------------------------------
	// finish
	
		alert('xJSFL has installed. Restart Flash and navigate to... \n\n        Window > Other Panels > xJSFL Snippets \n\n...to get started.');
