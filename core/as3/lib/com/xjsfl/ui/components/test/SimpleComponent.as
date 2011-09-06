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
	public class SimpleComponent extends MovieClip
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// core component properties
				protected var _width			:Number			= super.width;
				protected var _height			:Number			= 30; 
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function SimpleComponent() 
			{
				init();
				draw();
			}
			
			private function init():void
			{ 
				// reset any scale
					super.scaleX		= 1;
					super.scaleY		= 1;

				// remove the avatar
					removeChildAt(0);
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

			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			protected function draw():void
			{
				graphics.clear();
				graphics.beginFill(0xFF0000);
				graphics.drawRoundRect(0, 0, _width, _height, 5, 5);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}