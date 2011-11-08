package com.xjsfl.text 
{
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	import flash.events.FocusEvent;
	import flash.events.MouseEvent;

	
	import com.xjsfl.text.fonts.ReferenceSans;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TextField extends flash.text.TextField
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// constants
				
			
			// stage instances
				
			
			// properties
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function TextField(size:Number = 11, color:Number = 0x000000)
			{
				initialize(size, color);
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Configuration
		
			protected function initialize(size:Number, color:Number):void 
			{
				// set properties
					width				= -1;
					antiAliasType		= AntiAliasType.ADVANCED;
					thickness			= -50;
					sharpness			= 300;
					embedFonts			= true;
					selectable			= false;
					textColor			= color;
					
				// text format
					var fmt:TextFormat		= new TextFormat(ReferenceSans.name, size, color);
					fmt.align				= TextFormatAlign.LEFT;
					defaultTextFormat	= fmt;
					setTextFormat(fmt);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			override public function get width():Number { return super.width; }
			override public function set width(value:Number):void 
			{
				super.width		= value;
				autoSize		= value < 0 ? TextFieldAutoSize.LEFT : TextFieldAutoSize.NONE;
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected methods
		

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}