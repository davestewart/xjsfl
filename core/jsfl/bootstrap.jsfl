// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                       ██████              ██          ██                    
//  ██                           ██  ██              ██          ██                    
//  ██     █████ ████ █████      ██  ██ █████ █████ █████ █████ █████ ████ █████ █████ 
//  ██     ██ ██ ██   ██ ██      █████  ██ ██ ██ ██  ██   ██     ██   ██      ██ ██ ██ 
//  ██     ██ ██ ██   █████      ██  ██ ██ ██ ██ ██  ██   █████  ██   ██   █████ ██ ██ 
//  ██     ██ ██ ██   ██         ██  ██ ██ ██ ██ ██  ██      ██  ██   ██   ██ ██ ██ ██ 
//  ██████ █████ ██   █████      ██████ █████ █████  ████ █████  ████ ██   █████ █████ 
//                                                                               ██    
//                                                                               ██    
//
// ------------------------------------------------------------------------------------------------------------------------
// Core Bootstrap - Sets up the framework, then loads core classes and modules

	try
	{
		// core
			fl.trace('> xjsfl: loading "xJSFL/core/jsfl/libraries/xjsfl.jsfl"');
			fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');

		// libraries
			xjsfl.classes.load
			([
				// core
					'output',
					'class',
					'filesystem',
					
				// datatypes
					'xml',
					//'json',
					'geom',
					
				// elements
					'context',
					'collections',
					'library',
					'stage',
					
				// utility
					'data',
					'events',
					'template',
					'simple-template',
					'timer',
					'table',
					'superdoc',
					
				// ui
					'xul',
					'validate',
					
				// modules
					'config',
					'module',
					'jsfl'
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
		Output.inspect(err, 'Error running core bootstrap');
	}
