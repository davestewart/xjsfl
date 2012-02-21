package _archive
{
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	
	import flash.events.Event;
	
	import flash.text.TextField;
	
	import com.xjsfl.ui.controls.icon.Icon;
	import com.xjsfl.utils.Utils;
	
	import data.IconModel;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class IconGroup extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var iconCanvas		:Sprite;
				public var label			:TextField;
			
			// properties
				public var groupName		:String;
				protected var icons			:Array;
				protected var spacing		:Number;
			
				protected var _width		:Number;
				
			// variables
				protected var iconsLoaded	:Number	= 0;
				protected var iconsFailed	:Number	= 0;
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function IconGroup(group:Object, spacing:Number)
			{
				// variables
					this.groupName		= group.name;
					this.icons			= group.icons;
					this.spacing		= spacing;
					
				// initialize
					initialize()
			}
			
			public function initialize()
			{
				// add text
					label					= new TextField();
					label.x					= 5;
					label.y					= 5;
					label.text				= groupName + ' (' + icons.length + ')';
					label.selectable		= false;
					//label.visible			= false;
					Utils.initText(label);
					addChild(label);
					
				// canvasses
					iconCanvas				= new Sprite();
					iconCanvas.x			= 100;
					iconCanvas.y			= 7;
					addChild(iconCanvas);
					
				// add icons
					var icon:Icon;
					for (var i:int = 0; i < icons.length; i++)
					{
						// path
							var filepath = 'file:///' + IconModel.path + icons[i].filename;
							
						// load icon
							icon = new Icon(filepath, groupName, icons[i].type);
							icon.addEventListener(Event.COMPLETE, onIconComplete);
							iconCanvas.addChild(icon);
					}
					
				// update layout
					draw();
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			public function destroy():void
			{
				while (iconCanvas.numChildren > 0)
				{
					var icon:Icon = iconCanvas.getChildAt(0) as Icon;
					icon.destroy();
					iconCanvas.removeChild(icon);
				}
				icons = null;
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			public function draw():void
			{
				// variables
					var ix			:int		= 0;
					var iy			:int		= 0;
					var h			:int;
					var maxWidth	:Number		= _width - iconCanvas.x - 16 - spacing - 8;
				
				// lay icons out in a grid
					for (var i:int = 0, n:int = 0; i < iconCanvas.numChildren; i++, ix++)
					{
						// icon
							var icon:DisplayObject = iconCanvas.getChildAt(i);
							
							if (icon.visible)
							{
								// position
									icon.x = ix * spacing;
									icon.y = iy * spacing;
									
								// check
									if (icon.x > maxWidth)
									{
										ix = -1;
										iy ++;
									}
							}
					}
				
				// graphics
					h = iconCanvas.height;
					graphics.clear();
					graphics.beginFill(0xE6E6E6, 1)
					graphics.beginFill(0xF0F0F0, 1)
					graphics.drawRect(0, 0, _width || super.width, h + 4);
					

				// top and bottom lines
					if (parent)
					{
						if (parent.getChildIndex(this) != 0)
						{
							graphics.beginFill(0xF3F3F3);
							graphics.drawRect(0, 0, super.width, 1);
						}
						
						if (parent.getChildIndex(this) != parent.numChildren - 1)
						{
							graphics.beginFill(0xDDDDDD);
							graphics.drawRect(0, h + 3, super.width, 1);
						}
					}

					
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onIconComplete(event:Event):void
			{
				iconsLoaded++;
				event.stopImmediatePropagation();
				event.target.removeEventListener(Event.COMPLETE, onIconComplete);
				if (iconsLoaded == icons.length)
				{
					dispatchEvent(event.clone());
					label.visible = true;
				}
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
		
			override public function set width(value:Number):void
			{
				_width = value;
				draw()
			}
		
			override public function get width():Number
			{
				return _width;
			}
		
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}