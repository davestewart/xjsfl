package com.xjsfl.utils 
{

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class StringUtils
	{
		
		/**
		 * Pad a Number or String to a desired length with another character
		 * @param	value		The String to be padded
		 * @param	length		An optional Number specifying how long the padded string should be. Defaults to 3
		 * @param	char		An optional String specifying the character that should pad the original string. Defaults to '0'
		 * @param	right		An optional Boolean to set padding to occur on the right. Defaults to false (left)
		 * @return				The padded string
		 */
		public static function pad(value:*, length:int = 3, char:String = '0', right:Boolean = false):String
		{
			value = String(value);
			while (value.length < length)
			{
				value = right ? value + char : char + value;
			}
			return value;
		}
			

	}

}
