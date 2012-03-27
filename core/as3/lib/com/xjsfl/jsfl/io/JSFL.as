package com.xjsfl.jsfl.io
{

	import adobe.utils.MMExecute;
	import flash.utils.getTimer;
	
	import com.xjsfl.jsfl.io.JSFLInterface;
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
			public static const isPanel		:Boolean		= MMExecute('(function(){return 1})()') != false;
			
			/// A String specifying the Flash config URI
			public static const configURI	:String			= String(MMExecute('fl.configURI')).indexOf('file:') == 0 ? MMExecute('fl.configURI') : null;
		
			/// A String specifying the xJSFL URI
			public static const xjsflURI	:String			= String(MMExecute('xjsfl.uri')).indexOf('file:') == 0 ? MMExecute('xjsfl.uri') : null;
		
			/// A Boolean indicating to output debugging information as functions run
			public static var debug			:Boolean		= true;
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 *
			 * Calls a JSFL function, optionally passing arguments, and automatically resolving scope
			 * 
			 * @param functionName		The function or method to call
			 * @param arguments			Optional arguments to pass to the function.
			 * @param scope				The scope to call the function in. Defaults to the object the function is attached to
			 * @return					The response received from the jsfl function, or null if there is no such function or 
			 * 							if the interface is not available an error is thrown.
			 *     
			 * @see flash.external.ExternalInterface#call()		 		 
			 *
			 */		 		 		 		
			public static function call(functionName:String, args:Array = null, scope:String = null):*
			{
				// variables
					args		= args || [];
					scope		= scope || functionName.replace(/\.\w+$/, '');
					
				// serialize arguments
					for (var i:int = 0; i < args.length; i++) 
					{
						if (args[i] is RegExp) // don't serialize regexp - this is a cheat to treat them as unparsed strings
						{
							args[i] = args[i].source;
						}
						else
						{
							args[i] = JSFLInterface.serialize(args[i]);
						}
					}
					
				// build the JSFL call
					var jsfl:String
					if (scope == '')
					{
						jsfl = functionName + '(' +args.join(', ') + ')';
					}
					else
					{
						jsfl = functionName + '.apply(' +scope + ', [' + args.join(', ') + '])';
					}
					log('call', jsfl);

				// make the call
					var result:*;
					if (JSFL.isPanel)
					{
						// A load/scope bug with Flash/JSFL sometimes seems to prevent JSFLInterface from loading properly, then all calls fail :(
						var call	:String	= 'try{xjsfl.classes.cache.JSFLInterface.serialize(' + jsfl + ');}catch(err){xjsfl.debug.error(err);}';
						var value	:String	= MMExecute(call);
						result				= JSFLInterface.deserialize(value);
					}
					
				// return
					return result;
			}
			
			/**
			 * Grabs an atrbitrary property from the JSFL environment
			 * @param	property
			 * @return
			 */
			static public function grab(property:String):* 
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
			
			static public function get(property:String):*
			{
				if (JSFL.isPanel)
				{
					return JSFLInterface.deserialize(MMExecute('xjsfl.classes.cache.JSFLInterface.serialize(' + property + ')'));
				}
				else
				{
					log('get', property);
					return null;
				}
			}
			
			static public function set(property:String, value:*):void
			{
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
			public static function exec(jsfl:String):*
			{
				log('exec', jsfl);
				return MMExecute(jsfl);
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
		
			public static function prompt(message:String, prompt:String = '', authortimeDefault:String = ''):String 
			{
				if (!isPanel)
				{
					return authortimeDefault;
				}
				else
				{
					message	= message.replace(/"/, '\\"');
					prompt	= prompt.replace(/"/, '\\"');
					return MMExecute('prompt("' +message+ '", "' +prompt+ '");');
				}
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