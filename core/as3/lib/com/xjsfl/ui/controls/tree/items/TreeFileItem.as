package com.xjsfl.ui.controls.tree.items
{
	
	import flash.display.DisplayObject;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.net.URLRequest;
	import flash.text.TextField;
	
	import com.xjsfl.ui.controls.tree.items.TreeItem
	import com.xjsfl.ui.controls.tree.icons.TreeFileItemIcon;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TreeFileItem extends TreeItem
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				
			// properties
				protected var _desc		:String;

			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TreeFileItem(data:Object)
			{
				// super
					_type = TreeItem.FILE;
					super(data);
					
				// create
					initialize();
			}
			
			override protected function initialize():void
			{
				// super
					super.initialize();
				
				// icon
					icon.y				= 2;

				// default icon
					var fileIcon:TreeFileItemIcon = new TreeFileItemIcon();
					fileIcon.gotoAndStop(data.defaultIconIndex || 1);
					icon.addChild(fileIcon);
					
				// icon gfx
					if (data.icon)
					{
						var loader:Loader = new Loader();
						loader.mouseChildren = false;
						loader.mouseEnabled = false;
						loader.load(new URLRequest(data.icon));
						loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onIconLoad);
						loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onIconLoadError);
						icon.addChild(loader);
					}
					
				// start
					invalidate();
					
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			override public function set data(data:Object):void
			{
				super.data = data;
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onIconLoad(event:Event):void
			{
				// remove event listener and default icon
					event.target.removeEventListener(Event.COMPLETE, onIconLoad);
					icon.removeChildAt(0);
					
				// redraw
					invalidate();
			}

			protected function onIconLoadError(event:IOErrorEvent):void 
			{
				trace('Could not load icon "' + data.icon + '"');
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}