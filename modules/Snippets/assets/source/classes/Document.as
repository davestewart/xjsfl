package  
{
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.events.Event;
	
	import com.xjsfl.jsfl.io.JSFL;
	import com.xjsfl.jsfl.modules.AbstractModule;
	
	import jsfl.SnippetsModule;
	import display.panels.SnippetsPanel;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Document extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				protected var panel			:SnippetsPanel;
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function Document() 
			{
				// stage
					stage.align		= StageAlign.TOP_LEFT;
					
				// setup module
					AbstractModule.create(SnippetsModule, this);
					
				// assign handler to module, which is called when all assets have loaded
					SnippetsModule.instance.addEventListener(Event.COMPLETE, onModuleComplete);
					
				// generic resize handler
					stage.addEventListener(Event.RESIZE, onResize);
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Configuration
		
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			/**
			 * 
			 * @param	event
			 */
			protected function onModuleComplete(event:Event):void 
			{
				SnippetsModule.instance.removeEventListener(Event.COMPLETE, onModuleComplete);
				panel = addChild(new SnippetsPanel()) as SnippetsPanel;
				panel.initialize(SnippetsModule.instance);
				onResize();
			}
			
			/**
			 * Generic onResize handler
			 * @param	event
			 */
			protected function onResize(event:Event = null):void 
			{
				if (panel)
				{
					panel.setSize(stage.stageWidth, stage.stageHeight);
				}
			}

			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}