package com.xjsfl.utils.debugging
{

	import flash.utils.getTimer;
	import com.xjsfl.jsfl.io.JSFL;
	import com.xjsfl.utils.debugging.Debug;
	import com.xjsfl.utils.StringUtils;

	/**
	 * The Output class is designed to output data to the listener whether the SWF 
	 * is running in a Flash Panel, or the authoring environment.
	 * 
	 * It also provides logging functionality, object introspection, and a variety
	 * of printing and formatting methods
	 * 
	 * @author Dave Stewart
	 */
	public class Output
	{
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 * Log an action to the internal log at the time it happened
			 * @param	message	A String containing the information to be logged
			 */
			public static function log(message:String):void 
			{
				var now:int = getTimer();
				_log.push( { time:now, message:message } );
			}
			
			/**
			 * Shortcut to JSFL.trace, which prints the content to the listener
			 */
			public static function trace(...args):void
			{
				JSFL.trace(args);
			}
			
			/**
			 * Print the content to the listener as a formatted list
			 * @param	content		The content to be output
			 * @param	title		The title of the print
			 * @param	output		An optional Boolean specifying whether to print to the Output Panel, defualts to true
			 * @return	The String result of the print
			 */
			public static function print(content:String, title:String, output:Boolean = true):String
			{
				var result:String = '';
				result		+= '\n\t' +title + '\n\t--------------------------------------------------------------------------\n';
				result		+= '\t' + String(content).replace(/\n/g, '\n\t') + '\n';
				if (output)
				{
					JSFL.trace(result);
				}
				return result;
			}
			
			/**
			 * Dump the contents of the log to the output panel
			 * @param	output	An optional Boolean specifying whether to print to the Output Panel, defualts to true
			 * @return	The String result of the dump
			 */
			public static function dump(output:Boolean = true):String
			{
				var result:String = print(messages, 'JSFL Message Log', output);
				return result;
			}
			
			/**
			 * Output object in hierarchical format
			 * @param obj		Object	Any Object
			 * @param label		String	If an optional is passed, the result will immediately be printed to the Output panel
			 * @param maxDepth	uint	An optional uint specifying a max depth to recurse to. Needed to limit recursive objects
			 */
			public static function debug(obj:Object, label:String = null, maxDepth:uint = 5):String
			{
				return Debug.process(obj, label, maxDepth);
			}
		
			/**
			 * Clear the log and reset the timer
			 */
			public static function clear():void
			{
				_time	= getTimer();
				_log	= [];
			}
			

		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			protected static var _time	:int	= getTimer();
			protected static var _log	:Array	= [];
			
			/**
			 * returns a human-readable version of the log
			 */
			protected static function get messages():String
			{
				var str:String = '';
				for (var i:int = 0; i < _log.length; i++) 
				{
					var entry	:Object = _log[i];
					
					var min		:String	= StringUtils.pad(Math.floor(entry.time / 1000 / 60), 2);
					var sec		:String	= StringUtils.pad(Math.floor(entry.time / 1000), 2);
					var ms		:String	= StringUtils.pad(Math.floor(entry.time % 1000), 3) ;
					var time	:String	= [min, sec, ms].join(':')
					str					+= time + ' > ' + entry.message + '\n';
				}
				return str;
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// static initializer
		
		{
			//JSFL.clear();
			log('Log initialized');
			if (!JSFL.isPanel)
			{
				log('WARNING! Authoring Environment: JSFL functionality is disabled');
			}
		}
		
	}

}


// ---------------------------------------------------------------------------------------------------------------------
// helper functions
	

	function _trace(str:*):void
	{
		trace(str);
	}
	

