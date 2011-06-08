/**
 * xJSFL Core Bootstrap
 * Sets up the framework, then load core classes and modules
 * 
 * @author	Dave Stewart
 */
try
{
	// output
		fl.outputPanel.clear();
		fl.trace(FLfile.read(fl.configURI + 'Tools/xJSFL Splash.txt').replace(/\r\n/g, '\n'));
		fl.trace('> xjsfl: running core bootstrap...');

	// core
		fl.trace('> xjsfl: loading "<xjsfl>/core/jsfl/libraries/xjsfl.jsfl"');
		fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');

	// libraries
		xjsfl.classes.load
		([
			// core
				'output',
				'class',
				'filesystem',
				
			// modules
				'config',
				'module',
				'jsfl',
				
			// design
				'collections',
				'library',
				//'stage',
				
			// utility
				'template',
				'simple-template',
				'timer',
				'table',
				'superdoc',
				
			// other
				/*
				'events',
				'data',
				'debug',
				'functions',
				'Prototype',
				'xml'
				*/
		]);
		
	// modules
		xjsfl.modules.load
		([
			'Snippets',
		]);
		
	// initialize
		xjsfl.init(this);
		
}
catch(err)
{
	fl.runScript(xjsfl.uri + 'core/jsfl/libraries/output.jsfl');
	Output.inspect(err, 'Error running bootstrap');
}
