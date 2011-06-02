if( ! xjsfl.uri)
{
	// set xJSFL URI
		xjsfl.uri = '{xjsfl}';
		
	// tidy up
		delete xjsfl.name;
		delete xjsfl.MM_path;
		delete xjsfl.MM_loaded;

	// load core
		//fl.runScript(xjsfl.uri + 'core/jsfl/xjsfl.jsfl');
		
	// load bootstraps
		fl.runScript(xjsfl.uri + 'core/jsfl/bootstrap.jsfl');
		fl.runScript(xjsfl.uri + 'user/jsfl/bootstrap.jsfl');
	
	// done!
		fl.trace('> xjsfl: ready!');
		fl.trace('\n=================================================================')
}