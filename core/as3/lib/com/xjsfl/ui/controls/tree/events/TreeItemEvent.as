package com.xjsfl.ui.controls.tree.events
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TreeItemEvent extends Event
	{
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// mouseover event constants
			
				public static const ROLL_OVER			:String		= 'TreeItemEvent.ROLL_OVER';
				public static const ROLL_OUT			:String		= 'TreeItemEvent.ROLL_OUT';
				
			// click event constants
			
				public static const CLICK				:String		= 'TreeItemEvent.CLICK';
				public static const DOUBLE_CLICK		:String		= 'TreeItemEvent.DOUBLE_CLICK';
				
			// item edit event constants
				
				public static const LABEL_EDIT			:String		= 'TreeItemEvent.LABEL_EDIT';
				public static const LABEL_EDIT_COMPLETE	:String		= 'TreeItemEvent.LABEL_EDIT_COMPLETE';
				public static const LABEL_EDIT_CANCEL	:String		= 'TreeItemEvent.LABEL_EDIT_CANCEL';

			// item action constants
				
				public static const SELECT				:String		= 'TreeItemEvent.SELECT';
				public static const FOLDER_TOGGLE		:String		= 'TreeItemEvent.FOLDER_TOGGLE';
				
			// properties
			
				public var mouseEvent					:MouseEvent;
				
		// ---------------------------------------------------------------------------------------------------------------------
		// methods
		
				public function TreeItemEvent(type:String, mouseEvent:MouseEvent = null)
				{
					super(type, true);
					this.mouseEvent = mouseEvent;
				}
				
				public override function clone():Event
				{
					return new TreeItemEvent(type, mouseEvent);
				}
				
				public override function toString():String
				{
					return formatToString("TreeItemEvent", "type", "mouseEvent", "bubbles", "cancelable", "eventPhase");
				}
		
	}
	
}