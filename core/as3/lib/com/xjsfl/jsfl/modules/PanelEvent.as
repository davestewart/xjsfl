package com.xjsfl.jsfl.modules 
{
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class PanelEvent extends Event 
	{

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			public static const	PANEL_ENTER			:String	= 'PanelEvent.PANEL_ENTER';
			public static const	PANEL_LEAVE			:String	= 'PanelEvent.PANEL_LEAVE';
			public static const	TIMELINE_CHANGED	:String	= 'PanelEvent.TIMELINE_CHANGED';
			public static const	DOCUMENT_CHANGED	:String	= 'PanelEvent.DOCUMENT_CHANGED';
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function PanelEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false) 
			{ 
				super(type, bubbles, cancelable);
			} 
			
			public override function clone():Event 
			{ 
				return new PanelEvent(type, bubbles, cancelable);
			} 
			
			public override function toString():String 
			{ 
				return formatToString("PanelEvent", "type", "bubbles", "cancelable", "eventPhase"); 
			}
			
	}
	
}