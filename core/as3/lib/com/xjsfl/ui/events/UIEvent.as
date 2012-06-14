package com.xjsfl.ui.events 
{
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class UIEvent extends Event 
	{
		
		public static const RESIZE			:String			= 'UIEvent.RESIZE';
		public static const DRAW			:String			= 'UIEvent.DRAW';
		
		public function UIEvent(type:String, bubbles:Boolean=true, cancelable:Boolean=false) 
		{ 
			super(type, bubbles, cancelable);
			
		} 
		
		public override function clone():Event 
		{ 
			return new UIEvent(type, bubbles, cancelable);
		} 
		
		public override function toString():String 
		{ 
			return formatToString("UIEvent", "type", "bubbles", "cancelable", "eventPhase"); 
		}
		
	}
	
}