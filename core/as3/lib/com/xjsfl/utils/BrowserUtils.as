package com.xjsfl.utils 
{
	import flash.external.ExternalInterface;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class BrowserUtils
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				
			
			// properties
				
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			/**
			 * Get a single URL search param if live - if not return a default value
			 * @param	name
			 * @param	defaultValue
			 * @return
			 */
			public static function param(name:String, defaultValue:String = ''):String 
			{
				// grab params
					var params	:Object		= params();
					
				// get actual value
					if (params[name])
					{
						return params[name];
					}
				
				// default
					return defaultValue;
			}
			
			/**
			 * Get the URL search params if live - if not return an empty object
			 * @return
			 */
			public static function params():Object 
			{
				// try
					try
					{
						// debug
							trace('Getting external parameters...')
						
						// get external params
							var str		:String		= ExternalInterface.call('eval', 'window.location.search').replace('?', '');
							
						// parse
							var arr		:Array		= str.split('&');
							var params	:Object		= {};
							for each (var pair:String in arr)
							{
								var values:Array = pair.split(':');
								if (values.length == 2)
								{
									params[values[0]] = values[1];
								}
							}
							
						// return
							return params;
					}
					catch (error:Error)
					{
						trace('Could not get external parameters!')
					}
				
				// return
					return {};
			}
			
			/**
			 * Get the URL host if live - if not return a default value
			 * @param	defaultValue
			 * @return
			 */
			public static function host(defaultValue:String = ''):String
			{
				try
				{
					return ExternalInterface.call('eval', 'window.location.host');
				}
				catch (error:Error)
				{
					
				}
				return defaultValue;
			}
			
			/**
			 * Get the URL hash if live - if not return a default value
			 * @param	defaultValue
			 * @return
			 */
			public static function hash(defaultValue:String = ''):String
			{
				try
				{
					return ExternalInterface.call('eval', 'window.location.hash').replace('#', '');
				}
				catch (error:Error)
				{
					
				}
				return defaultValue;
			}
			
			/**
			 * Get the URL root if live - if not return a default value
			 * @param	defaultValue
			 * @return
			 */
			public static function root(defaultValue:String = ''):String
			{
				try
				{
					var protocol	:String		= ExternalInterface.call('eval', 'window.location.protocol');
					var host		:String		= ExternalInterface.call('eval', 'window.location.host');
					return protocol + '//' + host + '/';
				}
				catch (error:Error)
				{
					
				}
				return defaultValue;
			}
			
			
			
			/**
			 * Log data to the Firebug console
			 * @param	data
			 * @param	label
			 */
			public static function log(data:*, label:String = 'Flash log output'):void 
			{
				try
				{
					ExternalInterface.call('console.log', label, data);
				}
				catch (error:Error)
				{
					
				}
				trace(label + ': ' + data);
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			protected static function external(object:String, ...rest):void 
			{
				try
				{
					//ExternalInterface.call.apply(this, object, rest);
				}
				catch (error:Error)
				{
					
				}
			}

	}

}