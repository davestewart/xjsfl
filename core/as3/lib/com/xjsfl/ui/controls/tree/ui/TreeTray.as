package com.xjsfl.ui.controls.tree.ui
{

	import flash.display.SimpleButton;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import com.xjsfl.ui.controls.tree.events.TreeEvent;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TreeTray extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		

			// stage instances
				public var btnNewFolder		:SimpleButton;
				public var btnNewItem		:SimpleButton;
				public var btnInfo			:SimpleButton;
				public var btnDelete		:SimpleButton;
				public var btnReload		:SimpleButton;
				
			// properties
				protected var _enabled		:Boolean;
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TreeTray() 
			{
				addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			}
			
			protected function onAddedToStage(event:Event):void 
			{
				removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
				for (var i:int = 0; i < numChildren; i++) 
				{
					var item:SimpleButton = this.getChildAt(i) as SimpleButton;
					if (item is SimpleButton)
					{
						item.addEventListener(MouseEvent.CLICK, onButtonClick);
						item.focusRect = false;
					}
				}
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			protected function onButtonClick(event:MouseEvent):void
			{
				var type:String;
				switch(event.target)
				{
					case btnNewFolder:		type = TreeEvent.NEW_FOLDER;			break;
					case btnNewItem:		type = TreeEvent.NEW_FILE;				break;
					case btnInfo:			type = TreeEvent.ITEM_INFO;				break;
					case btnDelete:			type = TreeEvent.ITEM_DELETE;			break;
					case btnReload:			type = TreeEvent.RELOAD;				break;
				}
				dispatchEvent(new TreeEvent(type));
			}
			
			public function get enabled():Boolean { return _enabled; }
			public function set enabled(state:Boolean):void 
			{
				_enabled		= state;
				mouseChildren	= state;
				mouseEnabled	= state;
				alpha			= state ? 1 : 0.5;
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}