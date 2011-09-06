package com.xjsfl.utils 
{
	import flash.system.Capabilities;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class NetUtils
	{
		public static function getURI(path:String)
		{
			if (Capabilities.version.indexOf('WIN') === 0)
			{
				path = path.replace(':', '|');
			}
			return "file:///" + path.replace(/ /g, "%20").replace(/\\/g, "/");
		}
		
	}
}