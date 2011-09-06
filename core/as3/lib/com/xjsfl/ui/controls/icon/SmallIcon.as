package com.xjsfl.ui.controls.icon 
{
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.geom.Rectangle;
	import flash.net.URLRequest;
	
	import com.xjsfl.geom.Geom;
	import com.xjsfl.ui.controls.Control;
	import com.xjsfl.ui.controls.text.Label;
	

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class SmallIcon extends Icon
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				protected var _icon			:DisplayObject;
				protected var _label		:Label;
				protected var _loader		:Loader;
				protected var _bg			:Sprite;
			
			// layout
				protected var _text			:String		= '';
				protected var _spacing		:int		= 5;
				protected var _padding		:int		= 5;
				
			// appearance
				protected var _bgColor		:int		= 0xDDDDDD;
				protected var _bgAlpha		:int		= 1;
				

				
			// interactivity
				protected var _interactive	:Boolean;
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function SmallIcon(icon:* = null, text:String = null, interactive:Boolean = false) 
			{
				// label
					_label		= new Label();
					
				// initialize
					this.icon		= icon;
					this.interactive = interactive;
					if (text)
					{
						this.text	= text;
					}
					
				// debug
					/*
					useHandCursor = true;
					buttonMode = true;
					_label.border = true;
					*/
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			/**
			 * Directly sets the image of the icon by passing in a DisplayObject instance
			 * @param	icon	Either a DisplayObject instance, or a String path to the icon source
			 */
			public function set icon(icon:*):void 
			{
				if (icon is DisplayObject)
				{
					setIcon(icon);
				}
				else if (icon is String)
				{
					if (_loader == null)
					{
						_loader = new Loader();
					}
					_loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoadComplete);
					_loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
					_loader.load(new URLRequest(icon));
				}
				else if (icon is Class)
				{
					var bmp:Bitmap = new Bitmap(new icon(0, 0));
					setIcon(bmp);
				}
			}

			/// gets and sets the text of the icon
			public function get text():String { return _text; }
			public function set text(value:String):void 
			{
				_text			= value;
				_label.text		= value;
				label			= value != null ? true : false;
				invalidate();
			}
			
			/// Gets or sets the visiblity of the label
			public function get label():Boolean { return _label; }
			public function set label(state:Boolean):void 
			{
				if (state)
				{
					addChild(_label);
				}
				else if(_label.stage)
				{
					removeChild(_label);
				}
				invalidate();
			}

			/*
			/// Gets or sets the maximum width of the icon
			override public function get width():Number { return _label.x + _label.width; }
			override public function set width(value:Number):void 
			{
				_width = value;
				super.width = value;
			}
			*/
			
			public function get interactive():Boolean { return _interactive; }
			public function set interactive(state:Boolean):void 
			{
				_interactive = state;
				if (state)
				{
					updateBg();
					addEventListener(MouseEvent.ROLL_OVER, onRollOver);
					addEventListener(MouseEvent.ROLL_OUT, onRollOut);
				}
				else
				{
					removeChild(_bg);
					removeEventListener(MouseEvent.ROLL_OVER, onRollOver);
					removeEventListener(MouseEvent.ROLL_OUT, onRollOut);
				}
				invalidate();
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function draw():void 
			{
				updateIcon();
				updateBg()
				super.draw();
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			/**
			 * Updates the icon layout
			 */
			protected function updateIcon():void
			{
				if (_icon)
				{
					_icon.x = 0;
					_label.x = _icon.width + _spacing;
					_label.y = (_icon.height - _label.height) / 2;
				}
			}
		
			/**
			 * Draws the background shape
			 */
			protected function updateBg():void
			{
				// sprite
					if (_bg == null)
					{
						_bg	= new Sprite();
					}
					
				// graphics
					var rect:Rectangle = getRect(this);
					rect.inflate(_padding, _padding);
					_bg.graphics.clear();
					_bg.graphics.beginFill(_bgColor, _bgAlpha);
					_bg.graphics.drawRoundRect(rect.x, rect.y, rect.width, rect.height, _padding * 2, _padding * 2);
			}
			
			/**
			 * Replaces any existing icon and sets the new one
			 * @param	icon
			 */
			protected function setIcon(icon:DisplayObject):void 
			{
				if (_icon != null && _icon.stage)
				{
					removeChild(_icon);
				}
				_icon = icon;
				addChild(icon);
				invalidate();
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			// mouse
			
				protected function onRollOver(event:MouseEvent):void 
				{
					addChildAt(_bg, 0)
				}
				
				protected function onRollOut(event:MouseEvent):void 
				{
					removeChild(_bg);
				}
				
			// loading
			
				protected function onLoadComplete(event:Event):void 
				{
					setIcon(_loader);
					dispatchEvent(event.clone());
					removeListeners();
					updateBg();
					invalidate();
				}
				
				protected function onLoadError(event:IOErrorEvent):void 
				{
					dispatchEvent(event.clone());
					removeListeners();
				}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			/**
			 * Removes load listeners
			 */
			protected function removeListeners():void 
			{
				removeEventListener(Event.COMPLETE, onLoadComplete);
				removeEventListener(IOErrorEvent.IO_ERROR, onLoadError);
			}
		
			

	}

}