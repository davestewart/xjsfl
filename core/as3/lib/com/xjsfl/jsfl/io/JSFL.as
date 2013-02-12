package com.xjsfl.jsfl.io
{

	import adobe.utils.MMExecute;
	import flash.utils.getTimer;
	
	import com.xjsfl.jsfl.io.JSFLInterface;
	import com.xjsfl.jsfl.io.JSFLConnector;
	import com.xjsfl.utils.debugging.Output;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class JSFL
	{
		
		// ---------------------------------------------------------------------------------------------------------------------
		// constants
		
			/// A Boolean indicating if the current environment is an SWFPanel (and can therefore run MMExecute() commands)
			public static const isPanel		:Boolean			= (function(){ try{ return MMExecute('1') == '1'; } catch (error:Error) { return false; } })();
			
			/// A String specifying the Flash config URI
			public static const configURI	:String				= JSFL.isPanel ? MMExecute('fl.configURI') : '';
		
			/// A String specifying the xJSFL URI
			public static const xjsflURI	:String				= JSFL.isPanel ? MMExecute('xjsfl.uri') : '';;
		
			/// JSFLConnector instance to connect to JSFL via LocalConnection at authoring time
			public static var connector		:JSFLConnector		= null;
			
			/// A Boolean indicating to output debugging information as functions run
			public static var debug			:Boolean			= true;
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 *
			 * Calls a JSFL function, optionally passing arguments, and automatically resolving scope
			 * 
			 * @param functionName		The function or method to call
			 * @param params			Optional arguments to pass to the function.
			 * @param scope				The scope to call the function in. Defaults to the object the function is attached to
			 * @return					The response received from the jsfl function, or null if there is no such function or 
			 * 							if the interface is not available an error is thrown.
			 *     
			 * @see flash.external.ExternalInterface#call()		 		 
			 *
			 */		 		 		 		
			public static function call(functionName:String, params:Array = null, scope:String = null, callback:Function = null):*
			{
				// make the call
					var result:*;
					
				// if we're in a panel, build and execute JSFL
					if (JSFL.isPanel)
					{
						//return;
						
						// variables
							params		= params || [];
							scope		= scope || functionName.replace(/\.\w+$/, '');
							
						// serialize arguments
							for (var i:int = 0; i < params.length; i++) 
							{
								if (params[i] is RegExp) // don't serialize regexp - this is a trick to treat them as unparsed strings
								{
									params[i] = params[i].source;
								}
								else
								{
									// BUG - is there a bug in authoring here?
									params[i] = JSFLInterface.serialize(params[i]);
								}
							}
							
						// build the JSFL call
							var jsfl:String
							if (scope == '')
							{
								jsfl = functionName + '(' +params.join(', ') + ')';
							}
							else
							{
								jsfl = functionName + '.apply(' +scope + ', [' + params.join(', ') + '])';
							}
							log('call', jsfl);
							
						// execute JSFL
							//JSFL.trace('>>> ' + jsfl);
							// A load/scope bug with Flash/JSFL sometimes seems to prevent JSFLInterface from loading properly, then all calls fail :(
							var call	:String	= 'try{xjsfl.classes.cache.JSFLInterface.serialize(' + jsfl + ');}catch(err){xjsfl.debug.error(err);}';
							JSFL.trace(call);
							var value	:String	= MMExecute(call);
							//JSFL.trace('>>> ' + value);
							result				= JSFLInterface.deserialize(value);
							
						// fire callback if supplied
							if (callback !== null)
							{
								callback(result);
							}
					}
					
				// if not in panel, and there's an active JSFLConnection, forward all parameters
					else if (connector)
					{
						connector.send('call', [functionName, params, scope, callback], callback);
					}
					
				// return
					return result;
					
			}
			
			/**
			 * Grabs an atrbitrary property from the JSFL environment
			 * @param	property
			 * @return
			 */
			static public function grab(property:String, callback:Function = null):* 
			{
				if (JSFL.isPanel)
				{
					return JSFLInterface.deserialize(MMExecute('xjsfl.classes.cache.JSFLInterface.serialize(' + property + ')'));
				}
				else
				{
					log('grab', property);
					return null;
				}
			}
			
			static public function get(property:String, callback:Function = null):*
			{
				var value:*;
				if (JSFL.isPanel)
				{
					value = JSFLInterface.deserialize(MMExecute('xjsfl.classes.cache.JSFLInterface.serialize(' + property + ')'));
					if (callback !== null)
					{
						callback(value);
					}
				}
				else if (connector)
				{
					connector.send('get', [property, callback], callback);
				}
				else
				{
					log('get', property);
				}
				return value;
			}
			
			static public function set(property:String, value:*):void
			{
				if (typeof value == 'string')
				{
					value = '"' + value.replace(/"/g, '\\"') + '"';
				}
				var jsfl:String = property + ' = ' + value;
				if (JSFL.isPanel)
				{
					MMExecute(jsfl);
				}
				else
				{
					log('set', jsfl);
				}
			}
			


			/**
			 * Executes a JSFL string
			 * @param	jsfl	A valid fragment of JSFL
			 * @return	mixed	The result of the executed JSFL call
			 */
			public static function exec(jsfl:String, callback:Function = null):*
			{
				var value:*;
				if (isPanel)
				{
					value = MMExecute(jsfl);
					if (callback !== null)
					{
						callback(value);
					}
				}
				else if (connector)
				{
					connector.send('exec', [jsfl, callback], callback);
				}
				else
				{
					log('exec', jsfl);
				}
				return value;
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// utility methods
		

			
			

			
		// ---------------------------------------------------------------------------------------------------------------------
		// interaction methods
		
			/**
			 * Outputs supplied arguments to the Output Panel in both an SWFPanel and the Flash IDE
			 * @param	...args
			 */
			public static function trace(...args):void 
			{
				// variables
					var message		:String = args.join(' ');// .replace("'", "\\'");
					
				// authoring-environment trace
					_trace(message);

				// panel-environment trace
					// This function operates in a loop, as opposed to sending one string to MMExecute, because 
					// if any illegal characters do sneak in, such as unescaped linebreaks it's easier to debug
					// as it will break on the line with the suspect code
					var lines	:Array	= message.replace(/"/g, '\\"').split(/[\r\n]+/g);
					for (var i:int = 0; i < lines.length; i++)
					{
						MMExecute('fl.trace("' + lines[i] + '")');
					}
					//var lines	:String	= str.replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n');
					//MMExecute('fl.trace("' + lines + '")');
			}

			/**
			 * Clears the output panel in both an SWFPanel and the Flash IDE
			 */
			public static function clear():void 
			{
				MMExecute('fl.outputPanel.clear();');
			}
		
			public static function alert(message:String):void 
			{
				if (!isPanel)
				{
					log('alert', message);
				}
				else
				{
					MMExecute('alert("' +message.replace(/"/, '\\"')+ '");');
				}
			}
		
			public static function confirm(message:String, authortimeDefault:Boolean = false):Boolean 
			{
				if (!isPanel)
				{
					log('confirm', message);
					return authortimeDefault;
				}
				else
				{
					message = message.replace(/"/g, '\\"');
					return MMExecute('confirm("' +message+ '");') === 'true';
				}
			}
		
			public static function prompt(message:String, prompt:String = '', authoringDefault:String = ''):String 
			{
				if (!isPanel)
				{
					return authoringDefault;
				}
				else
				{
					message	= message.replace(/"/g, '\\"');
					prompt	= prompt.replace(/"/g, '\\"');
					return MMExecute('prompt("' +message+ '", "' +prompt+ '");');
				}
			}
			
			public static function connect(id:String):JSFLConnector
			{
				connector = new JSFLConnector(id, JSFL);
				return connector;
			}
			
			private static function log(type:String, message:*):void
			{
				if ( ! JSFL.isPanel)
				{
					_trace('JSFL > ' +type + ': ' + message);
				}
			}
		

	}
}

function _trace(...args):void
{
	trace('> JSFL:' +args);
}