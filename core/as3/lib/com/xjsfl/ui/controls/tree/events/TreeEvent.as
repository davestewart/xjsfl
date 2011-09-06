package com.xjsfl.ui.controls.tree.events
{
	import com.xjsfl.ui.controls.tree.items.TreeItem;
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TreeEvent extends Event
	{
		
		// ---------------------------------------------------------------------------------------------------------------------
		// constants
		
			// item event constants - something needs to happen to an item
			
				// tree-only actions
					public static const ITEM_RENAME				:String		= 'TreeEvent.ITEM_RENAME';		// rename the file
					public static const ITEM_DELETE				:String		= 'TreeEvent.ITEM_DELETE';		// delete the item from the tree
					
				// tree and fileystem actions
					public static const ITEM_RUN				:String		= 'TreeEvent.ITEM_RUN';			// run the file
					public static const ITEM_EDIT				:String		= 'TreeEvent.ITEM_EDIT';		// open the file for editing
					
				// filesystem-dependant actions
					public static const ITEM_INFO				:String		= 'TreeEvent.ITEM_INFO';		// grab info inside the file manually
					public static const ITEM_UPDATE				:String		= 'TreeEvent.ITEM_UPDATE';		// update info inside the file manually
					public static const ITEM_BROWSE				:String		= 'TreeEvent.ITEM_BROWSE';		// browse the item on the physical filesystem
					public static const ITEM_COMMAND			:String		= 'TreeEvent.ITEM_COMMAND';		// create a command for the file
					public static const ITEM_PATH				:String		= 'TreeEvent.ITEM_PATH';		// copy the item path
				
			// new item event constants - indicate to the control that a new item needs to be created
			
				public static const NEW_FOLDER				:String		= 'TreeEvent.NEW_FOLDER';
				public static const NEW_FILE				:String		= 'TreeEvent.NEW_FILE';
				public static const NEW_ITEM_COMPLETE		:String		= 'TreeEvent.NEW_ITEM_COMPLETE';	// the item was created
				
			// tree event constants - items changed or need to be changed
			
				public static const CHANGE					:String		= 'TreeEvent.CHANGE';
				public static const RELOAD					:String		= 'TreeEvent.RELOAD';
				public static const FILTER					:String		= 'TreeEvent.FILTER';
				public static const ENABLED_STATE_CHANGED	:String		= 'TreeEvent.ENABLED_STATE_CHANGED';
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			public var item		:TreeItem;
		
		// ---------------------------------------------------------------------------------------------------------------------
		// methods
		
				public function TreeEvent(type:String, item:TreeItem = null)
				{
					super(type, true);
					this.item = item;
				}
				
				public override function clone():Event
				{
					return new TreeEvent(type, item);
				}
				
				public override function toString():String
				{
					return formatToString("TreeEvent", "type", "item", "bubbles", "cancelable", "eventPhase");
				}
		
	}
	
}