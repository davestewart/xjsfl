package ui.controls 
{
	import com.xjsfl.ui.controls.tooltip.ITooltippable;
	import flash.display.SimpleButton;
	

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class EditSetButton extends SimpleButton implements ITooltippable
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// constants
				
			
			// stage instances
				
			
			// properties
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function EditSetButton() 
			{
				this.useHandCursor = false;
			}
			
			public function initialize():void 
			{
				
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Configuration
		
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			public function get tooltip():String 
			{
				return 'Load or add alternative snippet sets';
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}