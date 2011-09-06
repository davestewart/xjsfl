package com.xjsfl.utils 
{

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class ObjectUtils
	{
		
		public static function extend(a:Object, b:Object):Object
		{
			for (var prop:String in b)
			{
				a[prop] = b[prop];
			}
			return a;
		}

	}

}