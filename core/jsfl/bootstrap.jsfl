/**
 * xJSFL Core Bootstrap
 * Sets up the framework, then load core classes and modules
 * 
 * @author	Dave Stewart
 */
try
{
	// feedback
		fl.outputPanel.clear();
		fl.trace(FLfile.read(fl.configURI + 'Tools/xJSFL Splash.txt').replace(/\r\n/g, '\n'));
		fl.trace('> xjsfl: running core bootstrap...');

	// core
		fl.trace('> xjsfl: loading "<xjsfl>/core/jsfl/libraries/xjsfl.jsfl"');
		fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');

	// libraries
		xjsfl.classes.load
		([
			'output',
			'class',
			'filesystem',
			'template',
			'simple-template',
			'collections',
			'config',
			'module',
			'jsfl',
			//'events',
			/*,
			'data',
			'debug',
			'functions',
			'Prototype',
			'xml'
			*/
			//'selectors',
			'superdoc',
		]);
		
	// modules
		xjsfl.modules.load
		([
			'Snippets',
		]);
		
}
catch(err)
{
	fl.runScript(xjsfl.uri + 'core/jsfl/libraries/output.jsfl');
	Output.inspect(err, 'Error running bootstrap');
}