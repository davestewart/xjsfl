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
		/**
		 * Pre-initialization of the environment, extractinging key variables / functions to global scope
		 * @param	scope	{Object}	The scope into which the framework should be extracted
		 * @param	id		{String}	An optional id, which when supplied, traces a short message to the Output panel 
		 * @returns		
		 */
		xjsfl.initVars = function(scope, id)
		{
			// initialize only if scriptDir method is not yet defined
				if(typeof scope.scriptDir === 'undefined')
				{
					// debug
						if(id)
						{
							fl.trace('> xjsfl: copying variables to ' +id);
						}
						
					// palceholder variables
						xjsfl.trace = null;
						
					// temp output object, needed before libraries are loaded
						if( ! xjsfl.settings )
						{
							xjsfl.settings	= {debugLevel:(window['debugLevel'] != undefined ? debugLevel : 1)};
							xjsfl.output =
							{
								trace: function(message){ if(xjsfl.settings.debugLevel > 0){ fl.trace('> xjsfl: ' + message) } },
								error: function(message){ fl.trace('> xjsfl: error "' + message + '"') }
							}
						}

					// functions
						scope.trace		= function(){fl.outputPanel.trace(Array.slice.call(this, arguments).join(', '))};
						scope.clear		= fl.outputPanel.clear;
						
					// dom getter
						scope.__defineGetter__( 'dom', function(){ return fl.getDocumentDOM(); } );
						
					// script dir
						scope.__defineGetter__
						(
							'scriptDir',
							function()
							{
								var stack = xjsfl.utils.getStack();
								return xjsfl.file.makeURI(stack[3].path);
							}
						);
						
					// methods
						xjsfl.trace = xjsfl.output.trace;
				}
		}
	
		// initialize
			xjsfl.initVars(this, 'window');
	
		// core
			xjsfl.trace('loading "xJSFL/core/jsfl/libraries/xjsfl.jsfl"');
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
					
				// flash
					'superdoc',
					'context',
					'iterators',
					'collection',
					'element-collection',
					'item-collection',
					'selector',
					'selectors',
					'item-selector',
					'element-selector',
					
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
			xjsfl.init(this, 'window');
			
	}
	catch(err)
	{
		fl.runScript(xjsfl.uri + 'core/jsfl/libraries/output.jsfl');
		Output.inspect(err, 'Error running core bootstrap');
	}
