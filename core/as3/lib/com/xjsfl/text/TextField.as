package com.xjsfl.text 
{
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
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
		
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected methods
		
			protected function initialize(size:Number, color:Number):void 
			{
				// text format
					var fmt:TextFormat		= new TextFormat(ReferenceSans.name, size, color);
					fmt.align				= TextFormatAlign.LEFT;
					
				// set properties
					this.autoSize			= TextFieldAutoSize.LEFT;
					this.antiAliasType		= AntiAliasType.ADVANCED;
					this.thickness			= -50;
					this.sharpness			= 300;
					this.embedFonts			= true;
					this.selectable			= false;
					this.textColor			= color;
					this.defaultTextFormat	= fmt;
					this.setTextFormat(fmt);
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}