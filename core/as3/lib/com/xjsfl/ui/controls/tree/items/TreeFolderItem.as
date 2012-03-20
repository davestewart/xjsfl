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

	import com.xjsfl.utils.debugging.Output;
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
				protected var _isOpen		:Boolean;
				protected var _length		:int;
				
						
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TreeFolderItem(data:Object)
			{
				// super
					_type		= TreeItem.FOLDER;
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
					updateIcon();
					
				// interaction
					button.addEventListener(MouseEvent.CLICK, onButtonClick);
					
				// start
					invalidate();
					
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			public function open():void
			{
				if (!_filtered && ! isOpen)
				{
					toggle();
				}
			}
			
			public function close():void 
			{
				if (!_filtered && isOpen)
				{
					toggle();
				}
			}
			
			public function toggle():void 
			{
				if (!_filtered)
				{
					isOpen = ! isOpen;
					dispatchEvent(new TreeItemEvent(TreeItemEvent.FOLDER_TOGGLE));
				}
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			override public function set data(data:Object):void
			{
				super.data		= data;
				isOpen			=  ! data.closed;
				_length			= data.length || 0;
			}
		
			public function get isOpen():Boolean { return _isOpen; }
			public function set isOpen(value:Boolean):void
			{
				_isOpen = value;
				updateIcon();
			}
			
			public function get length():int { return _length; }
			public function set length(value:int):void
			{
				_length = value;
				updateIcon();
			}
			
			override public function set filtered(value:Boolean):void
			{
				super.filtered = value;
				if (length)
				{
					button.visible = ! filtered;
				}
			}
			
			protected function updateIcon():void
			{
				if (button)
				{
					button.visible = length > 0;
					button.rotation = isOpen ? 0 : -90;
					if (length == 0)
					{
						folderIcon.gotoAndStop(1);
					}
					else
					{
						folderIcon.gotoAndStop(_isOpen ? 3 : 2);
					}
				}
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			override protected function onDoubleClick(event:MouseEvent):void
			{
				event.stopImmediatePropagation();
				toggle();
			}
		
			protected function onButtonClick(event:MouseEvent):void
			{
				event.stopImmediatePropagation();
				toggle()
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}