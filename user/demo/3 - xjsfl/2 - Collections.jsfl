	// ------------------------------------------------------------------------------------------------------------------------
	//
	//  ██                    ██         ██ ██████ ██████ ██     
	//  ██                    ██         ██ ██     ██     ██     
	//  ██     █████ █████ █████         ██ ██     ██     ██     
	//  ██     ██ ██    ██ ██ ██         ██ ██████ █████  ██     
	//  ██     ██ ██ █████ ██ ██         ██     ██ ██     ██     
	//  ██     ██ ██ ██ ██ ██ ██         ██     ██ ██     ██     
	//  ██████ █████ █████ █████      █████ ██████ ██     ██████ 
	//
	// ------------------------------------------------------------------------------------------------------------------------
	// Load JSFL
	
		// run xjsfl
			if( ! window['xjsfl'])
			{
				fl.runScript(fl.scriptURI.substr(0, fl.scriptURI.lastIndexOf('/xJSFL/')) + '/xJSFL/system/jsfl/xjsfl.jsfl');
			}
	
		
	// ------------------------------------------------------------------------------------------------------------------------
	//
	//  ██   ██       ██       
	//  ███ ███                
	//  ███████ █████ ██ █████ 
	//  ██ █ ██    ██ ██ ██ ██ 
	//  ██   ██ █████ ██ ██ ██ 
	//  ██   ██ ██ ██ ██ ██ ██ 
	//  ██   ██ █████ ██ ██ ██ 
	//
	// ------------------------------------------------------------------------------------------------------------------------
	// Main
	
			function rename(e, i)
			{
				if(e.instanceType == 'symbol')
				{
					var name = e.libraryItem.name;
					e.name = name.replace(/ /g, '_');
				}
				//$debug(e)
			}
			
			$.selection()
				.rename('leaf_###')
				.randomize({width:[20, 100, 20], height:[20, 100, 20], x:800, y:400, rotation:360})
				//.toGrid(150, 150)
				
				
		
		
		

	
	
	//alert(xjsfl.settings.paths)
	//alert(fl.configDirectory)
	//alert(getURI('/temp/file.js'));
	
	//xjsfl.file.run('c:/temp/test.txt');
	
	//xjsfl.file.run('format.bat');
	
	//alert(xjsfl.settings.folder)
	
	//xjsfl.output.debug(fl.getDocumentDOM().getTimeline().layers, 'Timeline');

/*
	function traceHierachy(root, fnTrace, fnTest)
	{
		var indent = '';
		var level = 0;
		
		function list(e, i)
		{
			fl.trace(indent + fnTrace(e, level));
			if(fnTest(e))
			{
				level ++;
				indent += '	';
				e.each(list);
				indent = indent.substring(1);
				level--;
			}
		}
		
		list(root);
		
	}
	
	traceHierachy(new Folder('c:/temp/'), function(e, i){return e.name}, function(e){return e instanceof Folder})


	alert(colors)

*/

