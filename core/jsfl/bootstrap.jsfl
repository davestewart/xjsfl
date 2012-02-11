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
		// --------------------------------------------------------------------------------
		// initialize

			// clear output

			// clear existing values, in case we need to reload during development
				for(var name in xjsfl)
				{
					if( ! /^(reload|uri|reset|loading|debugState)$/.test(name) )
					{
						delete xjsfl[name];
					}
				}

			/**
			 * Pre-initialization of the environment, extractinging key variables / functions to supplied scope
			 * @param	scope		{Object}	The scope into which the framework should be extracted
			 * @param	scopeName	{String}	An optional scopeName, which when supplied, traces a short message to the Output panel
			 * @returns
			 */
			xjsfl.initVars = function(scope, scopeName)
			{
				// initialize only if core $dom method is not yet defined
					if(typeof scope.$dom === 'undefined')
					{
						// debug
							if(scopeName)
							{
								fl.trace('> xjsfl: initializing [' +scopeName+ ']');
							}

						// placeholder variable for trace
							xjsfl.trace = null;

						// temp output object, needed before libraries are loaded
							if( ! xjsfl.settings )
							{
								xjsfl.output =
								{
									trace:function(message, newLine)
									{
										if(newLine)
										{
											trace('');
											message = message.toUpperCase();
										}
										fl.trace('> xjsfl: ' + message);
									},
									error: function(message){ fl.trace('> xjsfl: error "' + message + '"') }
								}
							}

						// methods
							xjsfl.trace			= xjsfl.output.trace;

						// global functions

							// output
								scope.trace		= function(){ fl.outputPanel.trace(Array.slice.call(this, arguments).join(', ')) };
								scope.clear		= fl.outputPanel.clear;
								scope.populate	= function(template, properties)
								{
									return new SimpleTemplate(template, properties).output;
								}

							// debugging
								scope.inspect	= function(){ fl.trace('inspect() not yet initialized'); };
								scope.list		= function(){ fl.trace('list() not yet initialized'); };

							// file
								scope.load		= function(pathOrURI)
								{
									return FLfile.read(URI.toURI(pathOrURI, 2));
									//return xjsfl.file.load(pathOrURI, 2);
								}
								scope.save		= function(pathOrURI, contents)
								{
									var uri			= URI.toURI(pathOrURI, 2)
									var file		= new File(uri);
									file.contents	= contents;
									return file.size > 0;
									//return xjsfl.file.load(pathOrURI, 2);
								}


						// global shortcuts

							// $dom
								if(typeof scope.$dom === 'undefined')
								{
									scope.__defineGetter__( '$dom', function(){ return fl.getDocumentDOM(); } );
								}

							// $timeline
								if(typeof scope.$timeline === 'undefined')
								{
									scope.__defineGetter__( '$timeline', function(){ var dom = $dom; return dom ? dom.getTimeline() : null; } );
								}

							// $library
								if(typeof scope.$library === 'undefined')
								{
									scope.__defineGetter__( '$library', function(){ var dom = $dom; return dom ? dom.library : null; } );
								}

							// $selection
								if(typeof scope.$selection === 'undefined')
								{
									//TODO Check why this doesn't work in all files
									scope.__defineGetter__( '$selection', function(){ var dom = $dom; return dom ? dom.selection : null; } );
									scope.__defineSetter__( '$selection', function(elements){ var dom = $dom; if(dom){dom.selectNone(); dom.selection = elements} } );
								}
					}
			}

			// initialize
				xjsfl.initVars(this, 'window');

		// --------------------------------------------------------------------------------
		// set up and load core

			// flags
				xjsfl.loading = true;

			// never debug the bootstrap!
				var debugState = false;
				if(xjsfl.debug)
				{
					debugState = xjsfl.debug.state;
					xjsfl.debug.state = false;
				}

			// need to load URI library first as core methods rely on it
				if( ! window['URI'] )
				{
					//xjsfl.trace('loading URI library...');
					fl.runScript(xjsfl.uri + 'core/jsfl/libraries/uri.jsfl');
				}

			// core
				xjsfl.trace('loading xJSFL...', true);
				fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');

			// now, once core has loaded, register URI library
				xjsfl.classes.register('URI', URI);

			// reset file debugging
				xjsfl.debug.state = false;

			// load key libraries
				xjsfl.trace('loading core libraries...');
				xjsfl.classes.load(['filesystem', 'uri', 'template', 'output', 'class']);

		// --------------------------------------------------------------------------------
		// load additional libraries and modules

			// load other libraries
				xjsfl.classes.load('libraries/*.jsfl');

			// modules
				xjsfl.trace('loading Modules...', true);
				xjsfl.modules.find();


			// user bootstrap
				xjsfl.trace('loading user bootstrap...', true);
				xjsfl.file.load('//user/jsfl/bootstrap.jsfl');

			// load user libraries
				xjsfl.trace('loading user libraries...');
				xjsfl.classes.load('//user/jsfl/libraries/*.jsfl');

			// flags
				xjsfl.loading = false;

			// reset any debugging
				xjsfl.debug.state = debugState;
	}
	catch(err)
	{
		xjsfl.output.trace('Error running core bootstrap');
		fl.runScript(xjsfl.uri + '//core/jsfl/libraries/output.jsfl');
		xjsfl.debug.error(err);
	}
