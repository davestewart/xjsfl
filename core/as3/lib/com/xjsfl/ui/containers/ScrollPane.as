package com.xjsfl.ui.containers
{
	import fl.controls.UIScrollBar;
	import fl.events.ScrollEvent;
	import flash.display.CapsStyle;
	import flash.display.DisplayObject;
	import flash.display.JointStyle;
	import flash.display.LineScaleMode;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	import com.greensock.easing.*;
	import com.greensock.TweenLite;
	
	import com.xjsfl.ui.Component;

	/**
	 * Scrollpane class that supports
	 * 
	 * - Vertical and horizontal scrolling
	 * - Smooth scrolling
	 * - Mouse wheel interaction
	 * - Invalidation of scrollbars if source content bubbles an Event.RESIZE event
	 * - A "tray" component (for placing icons or statis information to the left of the horizontal scrollbar)
	 * 
	 * Use standard (skinned) Flash UI Scrollbars
	 * 
	 * @author Dave Stewart
	 */
	public class ScrollPane extends Component
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var scrollbarV			:UIScrollBar;
				public var scrollbarH			:UIScrollBar;
				public var scrollarea			:Sprite;
				public var overlay				:Sprite;
				public var background			:Sprite;
			
			// added stage instances
				protected var _source		:DisplayObject;
				protected var _tray			:DisplayObject;
			
			// properties
				protected var _border		:Boolean		= true;
				protected var _borderColor	:int			= 0x3A3A3A;
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function ScrollPane() 
			{
				super();
				initialize();
			}
			
			override protected function initialize():void
			{
				// min size
					setMinSize(45, 45)
					
				// overlay
					overlay = new Sprite();
					addChild(overlay);


				// background
					background = new Sprite();
					background.name = 'background';
					background.graphics.beginFill(0xDDDDDD);
					background.graphics.drawRect(0, 0, 100, 100);
					addChildAt(background, 0)
					
				// scrolling
					scrollbarV.addEventListener(ScrollEvent.SCROLL, onScrollV);
					scrollbarH.addEventListener(ScrollEvent.SCROLL, onScrollH);
					scrollbarV.lineScrollSize	= 19;
					
				// stage listeners
					addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
					addEventListener(Event.REMOVED_FROM_STAGE, onRemovedFromStage);
					
				// set size
					setSize(_startSize.width, _startSize.height);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function setSize(width:Number, height:Number):void 
			{
				super.setSize(width, height);
				if (source)
				{
					source.x		= - scrollbarH.scrollPosition + scrollarea.x + 1;
					source.y		= - scrollbarV.scrollPosition + scrollarea.y + 1;
				}
				draw();
				invalidate();
			}
			
			override public function draw():void 
			{
				// super
					super.draw();
					
				// constants
					const SCROLLBAR_WIDTH:int = 15;
					
				// scrollbar visibility
					if (source != null)
					{
						
						scrollbarV.visible		= scrollbarV.maxScrollPosition > 0;
						scrollbarH.visible		= _tray != null || scrollbarH.maxScrollPosition > 0;
					}
					else
					{
						scrollbarV.visible		= true;
						scrollbarH.visible		= true;
					}

				// acrollarea
					scrollarea.width	= _width - (scrollbarV.visible ? SCROLLBAR_WIDTH : 0) - 2;
					scrollarea.height	= _height - (scrollbarH.visible ? SCROLLBAR_WIDTH : 0) - 2;
					
				// tray
					if (tray)
					{
						tray.x			= 0;
						tray.y			= _height - tray.height;
					}
					
				// horizontal scrollbar
					scrollbarH.height		= _width - (tray ? tray.width : 0) - (scrollbarV.visible ? SCROLLBAR_WIDTH : 0);
					scrollbarH.x			= tray ? tray.width : 0;
					scrollbarH.y			= _height// + SCROLLBAR_WIDTH;
					
				// vertical scrollbar
					scrollbarV.height		= _height - (scrollbarH.visible ? SCROLLBAR_WIDTH : 0);
					scrollbarV.x			= _width - SCROLLBAR_WIDTH;
					
				// border
					overlay.graphics.clear();
					if (_border)
					{
						overlay.graphics.lineStyle(1, borderColor, 1, true, LineScaleMode.NORMAL, CapsStyle.SQUARE, JointStyle.MITER);
						overlay.graphics.drawRect(0.5, 0.5, _width - 1, _height - 1);
					}
					
				// background
					background.width = _width;
					background.height = _height;
					
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			public function get border():Boolean { return _border; }
			public function set border(value:Boolean):void 
			{
				_border = value;
				invalidate();
			}
			
			public function get borderColor():int { return _borderColor; }
			public function set borderColor(value:int):void 
			{
				_borderColor = value;
				invalidate();
			}
			
			public function get source():DisplayObject { return _source; }
			public function set source(source:DisplayObject):void 
			{
				if (source != null)
				{
					source.addEventListener(Event.RESIZE, onSourceResize);
					addChildAt(source, numChildren - 2);
					source.mask = scrollarea;
				}
				else
				{
					_source.removeEventListener(Event.RESIZE, onSourceResize);
					removeChild(_source);
					source.mask = null;
				}
				_source = source;
				invalidateScrollbars();
				invalidate();
			}
			
			public function get tray():DisplayObject { return _tray; }
			public function set tray(tray:DisplayObject):void 
			{
				if (tray != null)
				{
					addChildAt(tray, numChildren - 2);
					setMinSize(tray.width + 45, 45);
				}
				else if(_tray)
				{
					removeChild(_tray);
					setMinSize(45, 45);
				}
				_tray = tray;
				invalidate();
			}
			
			public function set scrollV(position:int):void 
			{
				source.y = - position + scrollarea.y + 1;
				scrollbarV.scrollPosition = position;
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods

			override public function invalidate(callback:Function = null):void 
			{
				super.invalidate(callback);
				invalidateScrollbars();

			}
			
			protected function invalidateScrollbars():void 
			{
				if (source)
				{
					scrollbarH.setScrollProperties(scrollarea.width, 0, (source.width - scrollarea.width));
					scrollbarV.setScrollProperties(scrollarea.height, 0, (source.height - scrollarea.height));
				}
			}


		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		

			protected function onSourceResize(event:Event):void 
			{
				invalidateScrollbars();
			}
			
			function onScrollH(event:ScrollEvent):void
			{
				TweenLite.to(source, 0.3, { x: - event.position + scrollarea.x + 1, ease:Quint.easeOut } );
			}
			
			function onScrollV(event:ScrollEvent):void
			{
				dispatchEvent(event);
				TweenLite.to(source, 0.3, { y: - event.position + scrollarea.y + 1, ease:Quint.easeOut } );
			}

			protected function onMouseWheel(event:MouseEvent):void 
			{
				if (background.getBounds(this).contains(mouseX, mouseY))
				{
					var dir:int = event.delta > 1 ? 1 : -1;
					scrollbarV.scrollPosition -= event.delta * 19;
				}
			}
			
			protected function onAddedToStage(event:Event):void 
			{
				background.stage.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
			}
			
			protected function onRemovedFromStage(event:Event):void 
			{
				background.stage.removeEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}