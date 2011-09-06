package com.xjsfl.ui.components.test
{
	
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Rectangle;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	import com.xjsfl.fonts.ReferenceSans;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class RectComponent extends MovieClip
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				private var tf					:TextField;
				private var bg					:Sprite;
				
			// core component properties
				protected var _width			:Number			= super.width;
				protected var _height			:Number			= 30; 
				
			// properties
				protected var _color			:int				= 0xFF0000;
				protected var _radius			:int				= 5;
				
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function RectComponent() 
			{
				initialize();
			}
			
			public function initialize() 
			{
				init();
				createChildren();
				draw();
			}
			
			private function init():void
			{ 

				// reset any scale
					super.scaleX		= 1;
					super.scaleY		= 1;
					
				// set getters
					_width				= width;
					_height				= height;

				// remove the avatar
					removeChildAt(0);
					gotoAndStop(2);
			} 

		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods

			public function setSize(width:Number, height:Number):void
			{
				_width		= width;	// lock this to a number if required
				_height		= 30;		// lock this to a number if required
				draw();
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// component accessors

			override public function get width():Number { return _width; }
			override public function set width(value:Number):void 
			{
				_width = value;
				draw();
			}
			
			override public function get height():Number { return _height; }
			override public function set height(value:Number):void 
			{
				_height = 30;
				draw();
			}
			
			override public function get scaleX():Number { return 1; }
			override public function set scaleX(value:Number):void 
			{
				draw();
				// do nothing
			}
			
			override public function get scaleY():Number { return 1; }
			override public function set scaleY(value:Number):void 
			{
				draw();
				// do nothing
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			[Inspectable(category="Appearance", type="Color", defaultValue="FF0000")] 
			public function get color():int { return _color; }
			public function set color(value:int):void 
			{
				_color = value;
				draw();
			}
			
			[Inspectable(category="Appearance", type="Number", defaultValue="5")] 
			public function get radius():int { return _color; }
			public function set radius(value:int):void 
			{
				_radius = value;
				draw();
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			private function createChildren():void
			{ 
				// variables
					var font	:ReferenceSans	= new ReferenceSans();
					var fmt		:TextFormat		= new TextFormat(font.fontName, 9, 0x000000);
					
				// bg
					bg							= new Sprite();
					addChild(bg);
					
				// text
					tf							= new TextField();
					tf.autoSize					= TextFieldAutoSize.LEFT; 
					tf.embedFonts				= true;
					tf.defaultTextFormat		= fmt;
					addChild(tf);
			} 
			
			protected function draw():void
			{
				// bg
					bg.graphics.clear();
					bg.graphics.beginFill(_color);
					bg.graphics.drawRoundRect(0, 0, _width, _height, _radius, _radius);

				// text
					var bounds:Rectangle = this.getBounds(this);
					tf.text = "w: " + bounds.width + ", h: " + bounds.height;
					tf.x = Math.floor((_width - tf.width)/2);
					tf.y = Math.floor((_height - tf.height)/2); 
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}