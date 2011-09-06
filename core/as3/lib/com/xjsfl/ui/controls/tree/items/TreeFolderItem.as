package com.xjsfl.ui.controls.tree.items
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.InteractiveObject;
	import flash.display.MovieClip;
	import flash.display.SimpleButton;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;

	import com.xjsfl.utils.Output;
	import com.xjsfl.ui.controls.tree.items.TreeItem
	import com.xjsfl.ui.controls.tree.icons.TreeFolderItemIcon;
	import com.xjsfl.ui.controls.tree.events.*;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TreeFolderItem extends TreeItem
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				protected var button		:SimpleButton;
				protected var folderIcon	:TreeFolderItemIcon;
				
			// protected
				protected var _state		:Boolean;
				protected var _length		:int;
				
						
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TreeFolderItem(data:Object)
			{
				// super
					_type = TreeItem.FOLDER;
					super(data);
					
				// create
					initialize();
			}
			
			override protected function initialize():void
			{
				// super
					super.initialize();
					
				// button
					button				= foreground.addChild(new TreeFolderItemButton()) as SimpleButton;
					button.useHandCursor = false;
					button.x			= 9;
					button.y			= 9;
					
				// icon
					icon.y				= 1;
					folderIcon			= icon.addChild(new TreeFolderItemIcon()) as TreeFolderItemIcon;
					updateFolderIcon();
					
				// interaction
					button.addEventListener(MouseEvent.CLICK, onButtonClick);
					
				// start
					invalidate();
					
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
		
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			override public function set data(data:Object):void
			{
				_length	= data.length || 0;
				_state	= data.state || true;
				super.data = data;
			}
		
			public function get state():Boolean { return _state; }
			public function set state(state:Boolean):void
			{
				_state = state;
				updateFolderIcon();
			}
			
			public function get length():int { return _length; }
			public function set length(value:int):void
			{
				_length = value;
				updateFolderIcon();
			}
			
			override public function set filtered(value:Boolean):void
			{
				super.filtered = value;
				if (length)
				{
					button.visible = ! filtered;
				}
			}
			
			protected function updateFolderIcon():void
			{
				if (length == 0)
				{
					folderIcon.gotoAndStop(1);
				}
				else
				{
					folderIcon.gotoAndStop(state ? 3 : 2);
				}
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			override protected function onDoubleClick(event:MouseEvent):void
			{
				onButtonClick(event);
			}
		
			protected function onButtonClick(event:MouseEvent):void
			{
				if (!_filtered)
				{
					state = ! state;
					button.rotation = state ? 0 : -90;
					event.stopImmediatePropagation();
					dispatchEvent(new TreeItemEvent(TreeItemEvent.FOLDER_TOGGLE));
				}
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}