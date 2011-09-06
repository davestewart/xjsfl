package com.xjsfl.text  
{
	import flash.text.TextFieldAutoSize;
	import com.xjsfl.text.TextField;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TextArea extends TextField
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// constants
				
			
			// stage instances
				
			
			// properties
				
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function TextArea(size:Number = 11, color:Number = 0x000000)
			{
				super(size, color);
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
		
			override protected function initialize(size:Number, color:Number):void 
			{
				// super
					super.initialize(size, color);
					
				// set properties
					this.autoSize			= TextFieldAutoSize.NONE;
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}