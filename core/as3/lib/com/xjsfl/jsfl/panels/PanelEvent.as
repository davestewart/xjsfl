package com.xjsfl.jsfl.panels 
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
			
			public static const	INTERVAL			:String	= 'PanelEvent.INTERVAL';
			
			public static const	DOCUMENT_CHANGED	:String	= 'PanelEvent.DOCUMENT_CHANGED';
			public static const	TIMELINE_CHANGED	:String	= 'PanelEvent.TIMELINE_CHANGED';
			public static const	LAYER_CHANGED		:String	= 'PanelEvent.LAYER_CHANGED';
			public static const	FRAME_CHANGED		:String	= 'PanelEvent.FRAME_CHANGED';
			
			public static const	NUM_LAYERS_CHANGED	:String	= 'PanelEvent.NUM_LAYERS_CHANGED';
			public static const	NUM_FRAMES_CHANGED	:String	= 'PanelEvent.NUM_FRAMES_CHANGED';
			
			public static const	SELECTION_CHANGED	:String	= 'PanelEvent.SELECTION_CHANGED';
		
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