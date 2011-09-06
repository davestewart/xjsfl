package com.xjsfl.ui.controls.icon
{
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class IconEvent extends Event
	{
		public static const ROLL_OVER	:String = 'IconEvent.ROLL_OVER';
		public static const ROLL_OUT	:String = 'IconEvent.ROLL_OUT';
		public static const CLICK		:String = 'IconEvent.CLICK';
		
		public function IconEvent(type:String, bubbles:Boolean=true, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
			
		}
		
		public override function clone():Event
		{
			return new IconEvent(type, bubbles, cancelable);
		}
		
		public override function toString():String
		{
			return formatToString("IconEvent", "type", "bubbles", "cancelable", "eventPhase");
		}
		
	}
	
}