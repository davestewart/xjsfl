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

	// --------------------------------------------------------------------------------
	// initialize

		(function()
		{
			// clear existing values, in case we need to reload during development
				for(var name in xjsfl)
				{
					if( ! /^(reload|uri|reset|loading|debugState)$/.test(name) )
					{
						delete xjsfl[name];
					}
				}

			// output needs to be created before main library is loaded
				xjsfl.output =
				{
					/**
					 * Traces an "> xjsfl:" message to the Output panel
					 * @param	{String}	message		The message to log
					 * @param	{Boolean}	newLine		An optional Boolean to highlight the message
					 */
					trace:function(message, newLine)
					{
						if(newLine)
						{
							fl.trace('');
							message = String(message).toUpperCase();
						}
						fl.trace('> xjsfl: ' + message);
					},

					/**
					 * Logs a message to the xjsfl log, and optionally traces it
					 * @param	{String}	message		The text of the log message
					 * @param	{Boolean}	newLine		An optional Boolean to highlight the message
					 * @param	{Boolean}	trace		An optional Boolean to trace the message, defaults to true
					 * @param	{Boolean}	clear		An optional Boolean to clear the log file, defaults to false
					 * @returns
					 */
					log:function(message, newLine, trace, clear)
					{
						// trace
							trace = typeof trace !== 'undefined' ? trace : true;
							if(trace)
							{
								this.trace(message, newLine);
							}

						// variables
							var uri		= xjsfl.uri + 'core/temp/xjsfl.log';
							if(newLine)
							{
								message = String(message).toUpperCase();
							}

						// clear
							if(clear)
							{
								FLfile.remove(uri);
								xjsfl.output.log('xjsfl log created');
							}

						// log
							var date	= new Date();
							var time	= date.toString().match(/\d{2}:\d{2}:\d{2}/) + ':' + (date.getMilliseconds() / 1000).toFixed(3).substr(2);
							FLfile.write(uri, (newLine ? '\n' : '') + time + '\t' + message + '\n', 'append');
					}

				}

			// init vars method

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
									xjsfl.output.log('initializing [' +scopeName+ ']');
								}

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
										return xjsfl.file.load(URI.toURI(pathOrURI, 1));
									}
									scope.save		= function(pathOrURI, contents)
									{
										return xjsfl.file.save(URI.toURI(pathOrURI, 1), contents);
									}

							// global shortcuts

								// $dom
									scope.__defineGetter__( '$dom', function(){ return fl.getDocumentDOM(); } );

								// $timeline
									scope.__defineGetter__( '$timeline', function(){ var dom = $dom; return dom ? dom.getTimeline() : null; } );

								// $library
									scope.__defineGetter__( '$library', function(){ var dom = $dom; return dom ? dom.library : null; } );

								// $selection
									scope.__defineGetter__( '$selection', function(){ var dom = $dom; return dom ? dom.selection : null; } );
									scope.__defineSetter__( '$selection', function(elements){ var dom = $dom; if(dom){dom.selectNone(); dom.selection = elements} } );
						}
				}
		})()

	// --------------------------------------------------------------------------------
	// attempt to load framework

		try
		{
			// --------------------------------------------------------------------------------
			// set up

				// log
					xjsfl.output.log('running core bootstrap...', true, true, true)

				// flags
					xjsfl.loading = true;

				// never debug the bootstrap!
					var debugState = false;
					if(xjsfl.debug)
					{
						debugState = xjsfl.debug.state;
						xjsfl.debug.state = false;
					}

				// log
					xjsfl.output.log('initializing variables...')

				// initialize core functions
					xjsfl.initVars(this, 'window');

				// need to load URI library first as core methods rely on it
					if( ! window['URI'] )
					{
						xjsfl.output.log('loading URI library...');
						fl.runScript(xjsfl.uri + 'core/jsfl/libraries/uri.jsfl');
					}

			// --------------------------------------------------------------------------------
			// load core

				// core
					xjsfl.output.log('loading xJSFL...', true);
					fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');

				// now, once core has loaded, register URI library
					xjsfl.classes.register('URI', URI);

				// reset file debugging
					//xjsfl.debug.state = false;

				// load key libraries
					xjsfl.output.log('loading core libraries...', true);
					xjsfl.classes.load(['filesystem', 'uri', 'template', 'output', 'class']);

			// --------------------------------------------------------------------------------
			// load additional libraries and modules

				// load other libraries
					xjsfl.classes.load('libraries/*.jsfl');

				// modules
					xjsfl.output.log('loading modules...', true);
					xjsfl.modules.find();

				// user bootstrap
					xjsfl.output.log('loading user bootstrap...', true);
					xjsfl.file.load('//user/jsfl/bootstrap.jsfl');

				// flags
					xjsfl.loading = false;

				// reset any debugging
					xjsfl.debug.state = debugState;
		}
		catch(error)
		{
			xjsfl.output.log('error running core bootstrap', true);
			fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');
			fl.runScript(xjsfl.uri + 'core/jsfl/libraries/output.jsfl');
			xjsfl.output.log(xjsfl.debug.error(error), false, false);
		}
