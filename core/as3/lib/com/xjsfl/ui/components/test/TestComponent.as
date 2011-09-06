package com.xjsfl.ui.components.test
{ 

	import com.xjsfl.fonts.ReferenceSans;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class TestComponent extends MovieClip
	{ 

		// stage instances
			private var tf				:TextField;
			private var bg				:Sprite;
			
		// core component properties
			protected var _width			:Number			= super.width;
			protected var _height			:Number			= 30; 
			
		// properties
			protected var _color			:int				= 0xFF0000;
			
			public function TestComponent()
			{
				stop();
				init();
				createChildren();
				draw();
			} 

			private function init():void
			{ 

				// reset any scale
					scaleX = 1;
					scaleY = 1;
					
				// set getters
					_width = width;
					_height = height;

				// remove the avatar
					removeChildAt(0);
			} 

			private function createChildren():void
			{ 
				
				// set text field
					var font:ReferenceSans = new ReferenceSans();
					
					bg = new Sprite();
					tf = new TextField();
					tf.autoSize = "left"; 
					tf.embedFonts = true;
					tf.defaultTextFormat = new TextFormat(font.fontName, 9, 0x000000);
					
					/*
					addChild(s1)
					addChild(s2)
					*/

					addChild(bg);
					addChild(tf);
			} 
			
			protected function draw():void
			{ 

				scaleX = 1;
				scaleY = 1; 

				bg.graphics.clear();
				bg.graphics.beginFill(color, 1);
				bg.graphics.drawRoundRect(0, 0, _width, _height, 10, 10);
				bg.graphics.endFill(); 

				tf.text = "w: " + _width + ", h: " + _height;
				tf.x = Math.floor((_width - tf.width)/2);
				tf.y = Math.floor((_height - tf.height)/2); 

			} 

			public function setSize(w:Number, h:Number):void
			{
				_width = w;
				_height = 30;
				draw();
			}
			
			override public function get width():Number { return _width; }
			override public function set width(value:Number):void 
			{
				_width = value;
			}
			
			override public function get height():Number { return _height; }
			override public function set height(value:Number):void 
			{
				_height = value;
			}
			
			override public function get scaleX():Number { return 1; }
			override public function set scaleX(value:Number):void 
			{
				//
			}
			
			override public function get scaleY():Number { return 1; }
			override public function set scaleY(value:Number):void 
			{
				//
			}
			
			[Inspectable(category="Common", format="Color", defaultValue="0xFF0000")] 
			public function get color():int { return _color; }
			public function set color(value:int):void 
			{
				_color = value;
			}

	}
}