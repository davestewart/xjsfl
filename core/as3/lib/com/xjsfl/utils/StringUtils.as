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
		
		public static function trim(value:String):String
		{
			return value.replace(/(^\s+|\s+$)/, '')
		}
			
		/**
		 * Parse any string into a real datatype. Supports Number, Boolean, hex (0x or #), XML, XMLList, Array notation, Object notation, JSON, Date, undefined, null
		 * @param	{String}	value		An input string
		 * @param	{Boolean}	trim		An optional flag to trim the string, on by default
		 * @return	{Mixed}					The parsed value of the original value
		 */
		public static function parseValue(value:String, trim:Boolean = true):*
		{
			// trim
				value = trim !== false ? StringUtils.trim(String(value)) : String(value);

			// undefined
				if(value === 'undefined')
					return undefined;

			// null - note that empty strings will be returned as null
				if(value === 'null' || value === '')
					return null;

			// Number
				if(/^(\d+|\d+\.\d+|\.\d+)$/.test(value))
					return parseFloat(value);

			// Boolean
				if(/^true|false$/i.test(value))
					return value.toLowerCase() === 'true' ? true : false;

			// Hexadecimal String / Number
				if(/^(#|0x)[0-9A-F]{6}$/i.test(value))
					return parseInt(value[0] === '#' ? value.substr(1) : value, 16);

			// XML
				if(/^<(\w+)\b[\s\S]*(<\/\1>|\/>)$/.test(value))
				{
					// attempt XML
						try
						{
							var xml:XML = new XML(value);
							return xml;
						}
						
					// attempt XMLList
						catch(err)
						{
							// attempt XMLList
								try
								{
									var xmlList:XMLList = new XMLList(value);
									return xmlList;
								}
							// return as text
								catch (err)
								{
									// do nothing
								}
								
						};
				}

				/*
			// Array notation
				if(/^\[.+\]$/.test(value))
					return eval(value);

			// Object notation
				if(/^{[a-z]\w*:.+}$/i.test(value))
					return eval('(' + value + ')');

			// JSON
				if(/^{"[a-z]\w*":.+}$/i.test(value))
					return JSON.parse(value);
				*/

			// Date
				if( ! isNaN(Date.parse(value)))
					return new Date(value);

			// String
				return value;
		}


	}

}
