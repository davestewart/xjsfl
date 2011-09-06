package com.xjsfl.utils
{

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class ClassUtils
	{
		/**
		 * Returns a formatted class signature
		 * @param	className
		 * @param	names
		 * @return
		 */
		public static function formatToString(instance:*, className:String, names:String):String
		{
			// trim and split names list on non-word characters
				var props	:Array	= names.replace(/(^\W+|\W+$)/g, '').split(/\W+/g);
				
			// loop through supplied properties and create outout
				var pairs	:Array	= [];
				for each(var prop:String in props)
				{
					var value	:*			= instance[prop];
					var str		:String		= value is String ? '"' + value.replace('"', '\"') + '"' : value;
					pairs.push(prop + '=' + str);
				}
				
			// return
				return '[' + className + ' ' + pairs.join(' ') + ']';
		}			



	}

}