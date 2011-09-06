package com.xjsfl.ui.controls.rightclickmenu 
{
	import flash.display.InteractiveObject;
	import flash.events.Event;
	import flash.events.ContextMenuEvent;
	import flash.ui.ContextMenuItem;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class RightClickMenuEvent extends ContextMenuEvent 
	{
		
		public static const MENU_INIT			:String		= "RightClickMenuEvent.MENU_INIT";
		public static const MENU_ITEM_SELECT	:String		= "RightClickMenuEvent.MENU_ITEM_SELECT";
		
		public var node			:XML;
		public var menu			:RightClickMenu;
		public var menuitem		:ContextMenuItem;

		public function RightClickMenuEvent(type:String, node:XML = null, mouseTarget:InteractiveObject = null, contextMenuOwner:InteractiveObject = null) 
		{
			super(type, true, cancelable, mouseTarget, contextMenuOwner);
			this.node = node;
			
			if (target is RightClickMenu)
			{
				this.menu = target as RightClickMenu;
			}
			else if (target is ContextMenuItem)
			{
				this.menuitem = target as ContextMenuItem;
			}
		}

		public override function clone():Event 
		{ 
			return new RightClickMenuEvent(type, node);
		} 
		
		public override function toString():String 
		{ 
			return formatToString("RightClickMenuEvent", "type", "nodeXML", "mouseTarget", "contextMenuOwner", "eventPhase"); 
		}
		
		public function get nodeXML():String
		{
			return node ? node.toXMLString() : '';
		}
		
	}
	
}