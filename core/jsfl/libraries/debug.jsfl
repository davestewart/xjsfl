// ------------------------------------------------------------------------------------------------------------------------
//
//  █████        ██
//  ██  ██       ██
//  ██  ██ █████ █████ ██ ██ █████
//  ██  ██ ██ ██ ██ ██ ██ ██ ██ ██
//  ██  ██ █████ ██ ██ ██ ██ ██ ██
//  ██  ██ ██    ██ ██ ██ ██ ██ ██
//  █████  █████ █████ █████ █████
//                              ██
//                           █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Debug - Static library for testing and debugging code

	// ---------------------------------------------------------------------------------------------------------------
	// class

		Debug =
		{
			/**
			 * Debugs script files by loading and eval-ing them
			 * @param	{String}	uriOrPath	The URI or path of the file to load
			 */
			file:function(uriOrPath)
			{
				// make uri
					var uri = URI.toURI(uriOrPath, 1);

				if(FLfile.exists(uri))
				{
					// Turn on file debugging if not yet set
						var state = false;
						if( ! this.state )
						{
							xjsfl.debug._error	= false;
							state				= true;
							this['state'] = true; // brackets used, otherwise Komodo puts state above func in the code outliner
						}

					// debug
						xjsfl.output.trace('Debugging "' + FLfile.uriToPlatformPath(uri) + '"...');

					// test the new file
						var jsfl = FLfile.read(uri).replace(/\r\n/g, '\n');
						try
						{
							// test file
								eval(jsfl);

							// turn off file debugging if this load was the initial load
								if(state)
								{
									this['state'] = false;
								}

							// return
								return true;
						}

					// log errors if there are any
						catch(err)
						{
							//Output.inspect(err)

							// create a new error object the first time an error is trapped
								if( ! xjsfl.debug._error)
								{
									// flag
										xjsfl.debug._error = true;

									// variables
										var evalLine	= 49;	// this needs to be the actual line number of the eval(jsfl) line above
										var line		= parseInt(err.lineNumber) - (evalLine) + 1;

									// turn off debugging
										this['state'] = false;

									// create a new "fake" error
										var error			= new Error(err.name + ': ' + err.message);
										error.name			= err.name;
										error.lineNumber	= line;
										error.fileName		= uri;

									// log the "fake" error
										xjsfl.debug.log(error);

									// throw the new error so further script execution is halted
										throw(error)
								}

							// re-throw the fake error (this only occurs in higher catches)
								else
								{
									throw(err);
								}
						}
				}
				else
				{
					throw(new URIError('URIError: The uri "' +uri+ '" does not exist'));
				}

			},

			/**
			 * Tests a callback and outputs the error stack if the call fails. Add additional parameters after the callback reference
			 * @param	{Function}	fn			The function to test
			 * @param	{Array}		params		An array or arguments to pass to the function
			 * @param	{Object}	scope		An alternative scope to run the function in
			 * @returns	{Value}					The result of the function if successful
			 */
			func:function(fn, params, scope)
			{
				// feedback
					xjsfl.output.trace('testing function: "' + Source.parseFunction(fn).signature + '"');

				// test!
					try
					{
						return fn.apply(scope || this, params);
					}
					catch(err)
					{
						this.error(err, true);
					}
			},

			/**
			 * Traces a human-readable error stack to the Output Panel
			 *
			 * @param	{Error}		error		A javaScript Error object
			 * @param	{Boolean}	testing		Internal use only. Removes test() stack items
			 */
			error:function(error, testing)
			{
				// variables
					var stack;
					if(error instanceof Error)
					{
						stack	= Utils.getStack(error, true);
						if(testing)
						{
							stack.splice(stack.length - 3, 2);
						}
					}
					else
					{
						error	= new Error(error);
						stack	= Utils.getStack(error, true);
						stack	= stack.slice(1);
					}

				// template uris
					var uriErrors	= xjsfl.uri + 'core/assets/templates/errors/errors.txt';
					var uriError	= xjsfl.uri + 'core/assets/templates/errors/error.txt';

				// reload template if not defined (caused by some kind of bug normally)
					if( ! xjsfl.classes.Template )
					{
						fl.runScript(xjsfl.uri + 'core/jsfl/libraries/uri.jsfl');
						fl.runScript(xjsfl.uri + 'core/jsfl/libraries/filesystem.jsfl');
						fl.runScript(xjsfl.uri + 'core/jsfl/libraries/template.jsfl');
					}

				// build errors
					var content = '';
					for(var i = 0; i < stack.length; i++)
					{
						stack[i].index = i;
						content += new xjsfl.classes.Template(uriError, stack[i]).render(); // reference Template class directly
					}

				// build output
					var data		= { error:error.toString(), content:content };
					var output		= new xjsfl.classes.Template(uriErrors, data).render();

				// set loading to false
					delete xjsfl.loading;

				// trace and return
					fl.trace(output);
					return output;
			},

			toString:function()
			{
				return '[class Debug]';
			}

		}

	// ---------------------------------------------------------------------------------------------------------------
	// register

		if(xjsfl && xjsfl.classes)
		{
			xjsfl.classes.register('Debug', Debug);
		}
