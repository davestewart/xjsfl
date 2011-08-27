package  
{
	import com.xjsfl.external.jsfl.AbstractModule;
	import com.xjsfl.ui.controls.rightclickmenu.RightClickMenu;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.events.Event;
	
	import xjsfl.Module;
	import display.Panel;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Document extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// constants
				public var panel:Panel;
			
			// stage instances
				
			
			// properties
				
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function Document() 
			{
				initialize();
			}
			
			public function initialize():void 
			{
				// setup module
					AbstractModule.create(Module, this);
					
				// stage
					stage.align		= StageAlign.TOP_LEFT;
					
				// ui
					panel			= new Panel();
					addChild(panel);
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
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}