package _archive
{
	
	import fl.containers.ScrollPane;
	import flash.display.DisplayObject;
	
	import flash.display.Loader;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	
	import flash.events.*;
	
	import flash.net.URLRequest;
	
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	
	import com.greensock.TweenLite;
	import adobe.utils.XMLUI;

	import com.xjsfl.ui.containers.SmoothScrollPane;
	
	import com.xjsfl.ui.controls.search.SearchBox;
	import com.xjsfl.ui.controls.tooltip.TipManager
	
	import com.xjsfl.ui.controls.icon.Icon;
	import com.xjsfl.ui.controls.icon.IconEvent
	
	import models.IconModel;

	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class IconPanel extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var scrollpane		:SmoothScrollPane;
				public var searchBox		:SearchBox;
				public var iconCanvas		:Sprite;
			
			// properties
				protected var model			:IconModel;
				
			// icon
				protected var selectedIcon	:Icon;
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function IconPanel ()
			{
				// iconPanel
					scrollpane						= new SmoothScrollPane();
					scrollpane.setSize(500, 400)
					addChild(scrollpane);
					
				// canvases
					iconCanvas						= new Sprite();
					addChild(iconCanvas)
					//scrollpane.source				= iconCanvas;
					
				// initialize
					initialize();
			}
			
			public function initialize()
			{
				// get icons
					model = new IconModel();
					
				// tooltip
					TipManager.initialize(this, { timeIn:0 } );
					
					/*
				// events
					iconPanel.source = iconCanvas;
					iconPanel.addEventListener(Event.COMPLETE, onIconComplete);
					iconPanel.addEventListener(IconEvent.CLICK, onIconClick);
					
					trace(iconPanel.stage)
					
				// update layout
					stage.addEventListener(Event.RESIZE, onStageResize)
					onStageResize();
					
					var groups = model.getIcons();
					
				// loop through icon groups
					for (var i:int = 0; i < groups.length; i++)
					{
						var iconGroup:IconGroup = new IconGroup(groups[i], spacing);
						iconCanvas.addChild(iconGroup);
						iconGroup.draw()
					}
					*/
					
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
		/*
			protected function draw(event:Event = null):void
			{
				// variables
					var iconGroup	:IconGroup
					var y			:Number			= 0;
					
				// loop through and order panels
					for (var i:int = 0; i < iconCanvas.numChildren; i++)
					{
						// variable
							iconGroup		= iconCanvas.getChildAt(i) as IconGroup;
							
						// width
							iconGroup.width = stage.stageWidth - iconPanel.verticalScrollBar.width;
						
						// y
							iconGroup.y		= y;
							y				+= iconGroup.height;
					}
					
				// draw invisible iconCanvas bg so iconPanel updates correctly
					iconCanvas.graphics.clear();
					iconCanvas.graphics.beginFill(0xFFFFFF);
					iconCanvas.graphics.drawRect(0, 0, iconCanvas.width + (margin * 2), iconCanvas.height);
					
				// update iconPanel
					var top:Number = 110;
					iconPanel.width = stage.stageWidth
					iconPanel.height = stage.stageHeight - top - 10;// - propertyPanel.height;
					iconPanel.y = top;// propertyPanel.height;
					iconPanel.update();
					
				// other elements
					searchBox.width = stage.stageWidth - 5;
			}
			
			public function destroy(event:MouseEvent = null):void
			{
				// kill panels
					while (iconCanvas.numChildren > 0)
					{
						var iconGroup:IconGroup = iconCanvas.getChildAt(0) as IconGroup;
						iconGroup.destroy();
						iconCanvas.removeChild(iconGroup)
					}
					
				// kill listeners
					stage.removeEventListener(Event.RESIZE, onStageResize)
					iconPanel.removeEventListener(Event.COMPLETE, onIconComplete);
					iconPanel.removeEventListener(IconEvent.CLICK, onIconClick);
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onStageResize(event:Event = null):void
			{
				draw();
			}
			

			protected function onIconComplete(event:Event):void
			{
				iconPanel.visible = true;
				iconPanel.alpha = 0;
				TweenLite.to(iconPanel, 1, { autoAlpha:1 } );
				
				draw();
			}
			
			protected function onIconClick(event:IconEvent):void
			{
				var icon:Icon = event.target as Icon;
				
				if (selectedIcon)
				{
					selectedIcon.selected = false;
				}
				selectedIcon = icon;
				
				XMLUI.setProperty('filepath', icon.filepath);
				XMLUI.setProperty('iconpath', icon.iconpath);
				
				XMLUI.accept();
				
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
		
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			protected function toObjString(obj:Object)
			{
				// variables
					var str		:String = '';
					var pairs	:Array = [];
					
				// values
					for (var name in obj)
					{
						var value:* = obj[name];
						if (typeof value == 'string')
						{
							value = '"' +value + '"';
						}
						pairs.push(name +':' + value);
					}
					
				// return
					return '{ ' +pairs.join(', ')+ ' }';
			}
			*/

	}

}