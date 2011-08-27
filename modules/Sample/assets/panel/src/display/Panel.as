package display
{
	import com.xjsfl.external.jsfl.JSFL;
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import fl.controls.Button;
	
	import xjsfl.Module;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Panel extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// constants
				
			
			// stage instances
				public var btnTest					:Button;

				
			// properties
				
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function Panel()
			{
				addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			}
			
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Configuration
		
			protected function initialize():void 
			{
				// create elements
					btnTest			= new Button();
					btnTest.label	= 'Test';
					btnTest.addEventListener(MouseEvent.CLICK, onTestClick);
					addChild(btnTest);

				// stage resize handlers
					stage.addEventListener(Event.RESIZE, onResize);
					onResize();
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		

		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: UI Handlers
		
			protected function onTestClick(event:MouseEvent):void 
			{
				Module.instance.test();
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utility Handlers
		
			protected function onAddedToStage(event:Event):void 
			{
				removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
				initialize();
			}
			
			protected function onResize(event:Event = null):void 
			{
				// variables
					var x		:Number = 5;
					var y		:Number = 5;
					var child	:DisplayObject;
					
				// layout
					for (var i:int = 0; i < numChildren; i++) 
					{
						child			= getChildAt(i);
						child.width		= stage.stageWidth - 10;
						child.x			= x;
						child.y			= y;
						y				+= 5 + child.height;
					}
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}