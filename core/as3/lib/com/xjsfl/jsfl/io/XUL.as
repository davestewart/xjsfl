package com.xjsfl.jsfl.io
{
	import flash.events.Event;
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.net.URLRequest;
	import adobe.utils.MMExecute;
	import flash.events.EventDispatcher;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class XUL extends EventDispatcher 
	{
		/**
		 * Grabs the flash data from the currently-instantiated XUL dialog
		 */
		public static function getFlashData():*
		{
			return JSFL.call('xjsfl.ui.getFlashData');
		}
		
		/**
		 * Sets the flash data on the currently-instantiated XUL dialog
		 * @param	data
		 */
		public static function setFlashData(data:*):void
		{
			JSFL.call('xjsfl.ui.setFlashData', [data]);
		}
		
		/**
		 * Set a pre-defined property on the currently-instantiated XUL dialog
		 * @param	name
		 * @param	value
		 * @return
		 */
		public static function setValue(name:String, value:*):String
		{
			return MMExecute('fl.xmlui.set("' +name+ '", "' +value+ '");');
		}
		
	}

}
