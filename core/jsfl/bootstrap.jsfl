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
				// core (these need to go first, as they are required by later classes)
					'class',
					'flfile',
					'filesystem',
					'xml',
				
				// data
					'config',
					'events',
					'jsfl',
					//'json', // removed as toJSON extends native objects - which adds unwanted values to for loops
					
				// utility
					'data',
					'geom',
					//'utils',
					'timer',
					
				// elements
					'superdoc',
					'context',
					'iterators',
					'collections',
					'library',
					'stage',
					
				// text
					'output',
					'template',
					'simple-template',
					'table',
					'source',
					
				// ui
					'xul',
					'module',
					'validate',
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
