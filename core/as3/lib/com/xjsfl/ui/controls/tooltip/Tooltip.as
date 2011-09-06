package com.xjsfl.ui.controls.tooltip
{
	import com.xjsfl.ui.controls.Control;
	import flash.display.BlendMode;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.DropShadowFilter;
	import flash.geom.Rectangle;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	import com.greensock.TweenLite;
	

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Tooltip extends Control
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var tooltip			:Sprite;
				public var tf				:TextField;
			
			// appearance
				protected var _color		:Number			= 0xFFFFFF;
				protected var _bgcolor		:Number			= 0x000000;
				protected var _fontSize		:Number			= 9;
				protected var _padding		:Number			= 3;
				protected var _shadow		:Boolean		= true;
				protected var _textFormat	:TextFormat;
				
			// text
				protected var _text			:String			= '';
				
			// animation
				public var timeIn			:Number			= 0.2;
				public var timeOut			:Number			= 0.3;

				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function Tooltip(text:String = '')
			{
				initialize();
				this.text = text;
			}
			
			override protected function initialize():void
			{
				// objects
					tooltip			 = new Sprite();
					addChild(tooltip)
					
				// text
					tf				= new TextField();
					tf.x			= _padding / 2;
					tf.y			= _padding / 2;
					tooltip.addChild(tf);
					
				// text format
					_textFormat		= initializeText(tf, _fontSize, _color);
					
				// appearance
					this.blendMode	= BlendMode.LAYER;
					this.shadow		= true;
					
				// init
					hide();
			}
			

		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			public function show():void
			{
				TweenLite.killTweensOf(this);
				super.visible = true;
				alpha = 1;
				moveToMouse();
			}
		
			public function hide():void
			{
				super.visible = false;
				alpha = 0;
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			public function get text():String { return tf.text; }
			public function set text(value:String):void
			{
				if (value != '' && value != null)
				{
					_text = value;
				}
			}
			
			override public function get visible():Boolean { return super.visible; }
			override public function set visible(state:Boolean):void
			{
				if (state)
				{
					draw();
					moveToMouse();
					if (timeIn > 0)
					{
						super.visible = true;
						TweenLite.to(this, timeIn, { alpha:1 } );
					}
					else
					{
						show();
					}
				}
				else
				{
					if (timeOut > 0)
					{
						TweenLite.to(this, timeOut, { alpha:0, onComplete:hide } );
					}
					else
					{
						hide();
					}
				}
			}
			
			public function get color():Number { return _textFormat.color as Number; }
			public function set color(value:Number):void
			{
				_textFormat.color = value;
				tf.defaultTextFormat = _textFormat
			}
			
			public function get bgColor():Number { return _bgcolor; }
			public function set bgColor(value:Number):void
			{
				_bgcolor = value;
			}
			
			public function get textFormat():TextFormat { return _textFormat; }
			public function set textFormat(value:TextFormat):void
			{
				_textFormat = value;
			}
			
			public function get fontSize():Number { return (_textFormat.size || -1) as Number; }
			public function set fontSize(value:Number):void
			{
				_textFormat.size = value;
				tf.defaultTextFormat = _textFormat
			}
			
			public function get shadow():Boolean { return _shadow; }
			public function set shadow(state:Boolean):void
			{
				if (state)
				{
					this.filters = [ new DropShadowFilter(2, 90, 0, 0.4, 6, 6, 1, 3) ];
				}
				else
				{
					this.filters = [];
				}
			}
			
			public function get padding():Number { return _padding; }
			public function set padding(value:Number):void
			{
				_padding = value;
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			override public function draw():void
			{
				// text
					tf.text = _text;
					
				// content
					tooltip.graphics.clear();
					tooltip.graphics.beginFill(_bgcolor);
					tooltip.graphics.drawRoundRect(0, 0, tf.width + (_padding * 2), tf.height + _padding, _padding * 2, _padding * 2);
					
				// text position
					tf.x = (width - tf.width) / 2;
					tf.y = (height - tf.height) / 2;
					
				// position
					moveToMouse();
					
			}
			
			protected function moveToMouse():void
			{
				if (stage)
				{
					x				= stage.mouseX + 9;
					y				= stage.mouseY + 20;
					
					var right		= x + width;
					var bottom		= y + height;
					
					var rightMax	= stage.stageWidth;
					var bottomMax	= stage.stageHeight;
					
					if (right > rightMax)
					{
						x -= (right - rightMax + 5);
					}
					
					if (bottom > bottomMax)
					{
						y -= (bottom - bottomMax + 5);
					}
				}
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}