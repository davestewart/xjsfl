package com.xjsfl.jsfl
{

	import adobe.utils.MMExecute;
	import flash.utils.getTimer;
	
	import com.xjsfl.jsfl.JSFLInterface;
	import com.xjsfl.utils.debugging.Output;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class JSFL
	{
		
		// ---------------------------------------------------------------------------------------------------------------------
		// constants
		
			/// A Boolean indicating if the currect environment is an SWFPanel (and can therefore run MMExecute() commands)
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
			 * Calls a JSFL function, passing zero or more arguments
			 * 
			 * @param functionName		The alphanumeric name of the jsfl function to call.
			 * @param arguments			The arguments to pass to the jsfl function.
			 * 							You can specify zero
			 *    						or more parameters, separating them with commas. They can be of
			 *    						any ActionScript data type, but the ActionScript types are
			 *    						automatically converted into JavaScript types.
			 * @return					The response received from the jsfl function. If the call failed–
			 *    						for example, if there is no such function or the interface is not
			 *    						available– null is returned and an error is thrown.
			 *     
			 * @see flash.external.ExternalInterface#call()		 		 
			 *
			 */		 		 		 		
			public static function call(functionName:String, args:Array = null, scope:String = null):*
			{
				// serialize arguments
					args = args || [];
					for (var i:int = 0; i < args.length; i++) 
					{
						if (args[i] is RegExp) // don't serialize regexp - treat them as unparsed strings
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
					if (scope)
					{
						jsfl = functionName + '.apply(' +scope + ', [' + args.join(', ') + '])';
					}
					else
					{
						jsfl = functionName + '(' +args.join(', ') + ')';
					}
						
				// make the call
					if (JSFL.isPanel)
					{
						return JSFLInterface.deserialize(MMExecute('JSFLInterface.serialize(' + jsfl + ')'));
					}
					else
					{
						log('call', jsfl);
						return false;
					}
			}
			
			static public function grab(property:String):* 
			{
				if (JSFL.isPanel)
				{
					return JSFLInterface.deserialize(MMExecute('JSFLInterface.serialize(' + property + ')'));
				}
				else
				{
					log('grab', property);
					return false;
				}
			}
			


			/**
			 * Executes arbitrary JSFL by wrapping the code in a function and, optionally returning the serialized results
			 * @param	jsfl	A String containing the JSFL to execute. To return a value, make sure the JSFL ends 
			 * 					with a valid return statement, such as "return fl.getDocumentDOM().selection.length;";
			 * @return	Mixed	The result of the executed JSFL call
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
				_trace('JSFL > ' +type + ': ' + message);
			}
		

	}
}

function _trace(...args):void
{
	trace(args);
}