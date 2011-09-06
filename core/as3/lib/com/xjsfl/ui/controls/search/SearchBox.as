package com.xjsfl.ui.controls.search
{
	
	import flash.display.DisplayObject;
	import flash.display.InteractiveObject;
	import flash.display.SimpleButton;
	import flash.display.Sprite;
	
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	
	import flash.text.TextField;
	
	import flash.events.TextEvent;
	import flash.events.FocusEvent;
	
	import com.xjsfl.ui.controls.Control;
	import com.xjsfl.ui.controls.tooltip.ITooltippable;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class SearchBox extends Control implements ITooltippable
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances

				// stage instances
					public var tfItems					:TextField;
					public var tfSearch					:TextField;
					
				// backgrounds
					public var bg_left					:Sprite;
					public var bg_middle				:Sprite;
					public var bg_right					:Sprite;
					public var bg_left_over				:Sprite;
					public var bg_middle_over			:Sprite;
					public var bg_right_over			:Sprite;
					public var bg						:Sprite;
					
				// button
					public var btnClear					:SimpleButton;
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function SearchBox()
			{
				initialize();
			}
			
			override protected function initialize():void
			{
				// size
					setFocus(false);
				
				// text
					tfSearch.addEventListener(FocusEvent.FOCUS_IN, onFocus);
					tfSearch.addEventListener(FocusEvent.FOCUS_OUT, onFocus);
					
				// interaction
					tfSearch.addEventListener(Event.CHANGE, onChange);
					btnClear.addEventListener(MouseEvent.CLICK, onClear);
					
				// button
					btnClear.visible = false;
					
				// draw invisible background
					bg = new Sprite();
					addChildAt(bg, 0);
					bg.graphics.beginFill(0xFF0000, 0);
					bg.graphics.drawRect(0, 0, 100, 23);
					bg.mouseEnabled = false;
					
				// tooltips
					for each(var element:InteractiveObject in [bg_left, bg_middle, bg_right, tfItems])
					{
						element.mouseEnabled = false;
					}
					
				// if scaled, reset scale and size appropriately
					height = bg.height;
					
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
		
			public function get text():String
			{
				return tfSearch.text;
			}
			
			public function set results(value:Number):void
			{
				tfItems.text = value + ' item' + (value != 1 ? 's' : '');
				if (tfSearch.length > 0)
				{
					tfItems.appendText(' found');
				}
			}
			
			override public function set width(value:Number):void
			{
				// variables
					var leftWidth	:Number = bg_left.x + bg_left.width;
					var rightWidth	:Number	= bg_right.width;
					var midWidth	:Number = value - leftWidth - rightWidth;
					
				// positions
					if (midWidth > 0)
					{
						bg_middle.width			= midWidth;
						bg_middle_over.width	= midWidth;
						tfSearch.width			= midWidth;
						bg_right.x				= value;
						bg_right_over.x			= value;
						btnClear.x				= value - 11.5;
					}
					
				// bg
					bg.width = value;
			}
			
			override public function setSize(width:Number, height:Number):void 
			{
				super.setSize(width, height);
				this.width = width;
			}
		
			public function get tooltip():String
			{
				return 'Enter text here to filter the icon list';
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			protected function onFocus(event:FocusEvent):void
			{
				setFocus(event.type == FocusEvent.FOCUS_IN);
			}
		
			protected function onChange(event:Event):void
			{
				btnClear.visible = tfSearch.text.length > 0;
				dispatchEvent(new Event(Event.CHANGE));
			}
			
			protected function onClear(event:MouseEvent):void
			{
				tfSearch.text = '';
				stage.focus = null;
				onChange(null);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function setFocus(state:Boolean):void
			{
				for each(var element:Sprite in [bg_left_over, bg_middle_over, bg_right_over])
				{
					element.visible = state;
				}
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}