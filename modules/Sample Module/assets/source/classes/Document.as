package  
{
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.utils.setTimeout;
	import flash.external.ExternalInterface;
	
	import fl.controls.Button;
	
	import com.xjsfl.jsfl.modules.AbstractModule;
	
	import SampleModule;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Document extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var btnMethod		:Button;
				public var btnConfig		:Button;
				public var btnAssets		:Button;
				public var tfResults		:TextField;
			
			// properties
				protected var module		:SampleModule;
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function Document() 
			{
				// stage
					stage.align		= StageAlign.TOP_LEFT;
					visible			= false;
					
				// setup module
					module			= AbstractModule.create(SampleModule, this) as SampleModule;
					
				// assign handler to module, which is called when all assets have loaded
					module.addEventListener(Event.COMPLETE, onModuleLoaded);
					
				// generic resize handler
					addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);

				// register external function
					ExternalInterface.addCallback('externalFunction', externalFunction);
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
			 * Add button event listeners only when the module has loaded all its assets
			 * @param	event
			 */
			protected function onModuleLoaded(event:Event):void 
			{
				btnMethod.addEventListener(MouseEvent.CLICK, onButtonClick);
				btnConfig.addEventListener(MouseEvent.CLICK, onButtonClick);
				btnAssets.addEventListener(MouseEvent.CLICK, onButtonClick);
				visible = true;
			}
			
			/**
			 * Take action when the buttons are pressed: run a command, show config, and loaded assets
			 * @param	event
			 */
			protected function onButtonClick(event:MouseEvent):void 
			{
				switch (event.target) 
				{
					// call module method
						case btnMethod:
							tfResults.text = module.test();
						break;
					
					// trace module config (demonstrates accessing SampleModule using its static instance property)
						case btnConfig:
							tfResults.text = SampleModule.instance.settings.toXMLString();
						break;
					
					// add module asset
						case btnAssets:
							var item:DisplayObject = addChild(module.butterfly);
							item.x = (stage.stageWidth / 2) - 16;
							item.y = tfResults.y + (tfResults.height / 2) - 16;
						break;
				}
			}
			
			/**
			 * Generic onAddedToStage handler
			 * @param	event
			 */
			protected function onAddedToStage(event:Event):void 
			{
				removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
				stage.addEventListener(Event.RESIZE, onResize);
				onResize();
			}
			
			/**
			 * Generic onResize handler
			 * @param	event
			 */
			protected function onResize(event:Event = null):void 
			{
				// variables
					var x			:Number		= 5;
					var y			:Number		= 5;
					var children	:Array		= [btnMethod, btnConfig, btnAssets, tfResults];
					
				// layout
					for each(var child:DisplayObject in children) 
					{
						child.width		= stage.stageWidth - 10;
						child.x			= x;
						child.y			= y;
						y				+= 5 + child.height;
					}
					
				// textfield
					tfResults.height = stage.stageHeight - tfResults.y - 5;
			}

			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected methods
		
			protected function externalFunction(value):String
			{
				// feedback
					tfResults.text = 'External function called with value "' +value+ '"';
					
				// return
					return 'function called!';
			}


		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}