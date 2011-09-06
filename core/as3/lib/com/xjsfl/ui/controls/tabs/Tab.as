package com.xjsfl.ui.controls.tabs
{
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.filters.BevelFilter;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	import com.xjsfl.ui.controls.base.Control;
	import com.xjsfl.utils.Utils;
	
	

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Tab extends Control
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var tf				:TextField;
				public var bg				:Sprite;
			
			// properties
				protected var label			:String;
				protected var _active		:Boolean;
				
			// colors
				protected var colorText		:int		= 0x2F2F2F
				protected var colorOut		:int		= 0x999999;
				protected var colorHover	:int		= 0xADADAD;
				protected var colorActive	:int		= 0xC5C5C5;
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function Tab(label:String)
			{
				trace('Tab label:' + label)
				this.label = label;
				initialize();
			}
			
			override public function initialize()
			{
				bg				= new Sprite();
				addChild(bg);
				
				tf				= new TextField();
				Utils.initText(tf, 10, 0x000000);
				tf.text			= label.toUpperCase();
				tf.thickness			= 150;
				addChild(tf);
				
				trace(label)
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function draw():void 
			{
				super.draw();
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onFocus(event:MouseEvent):void
			{
				
			}
			
			protected function onActivate(event:MouseEvent):void
			{
				
			}
			
			public function get active():Boolean { return _active; }
			public function set active(value:Boolean):void 
			{
				_active = value;
			}
			
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}