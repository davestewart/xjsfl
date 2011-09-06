package display.ui.tree
{

	import flash.display.SimpleButton;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TreeTray extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		

			// stage instances
				public var btnNewFolder		:SimpleButton;
				public var btnNewItem		:SimpleButton;
				public var btnInfo			:SimpleButton;
				public var btnDelete		:SimpleButton;
				public var btnReload		:SimpleButton;

			// properties
				protected var _enabled		:Boolean;
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TreeTray() 
			{
				initialize();
			}
			
			public function initialize() 
			{
				btnNewFolder.addEventListener(MouseEvent.CLICK, onButtonClick);
				btnNewItem.addEventListener(MouseEvent.CLICK, onButtonClick);
				btnInfo.addEventListener(MouseEvent.CLICK, onButtonClick);
				btnDelete.addEventListener(MouseEvent.CLICK, onButtonClick);
				btnReload.addEventListener(MouseEvent.CLICK, onButtonClick);
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			protected function onButtonClick(event:MouseEvent):void
			{
				var eventType:String;
				switch(event.target)
				{
					case btnNewFolder:	eventType = TreeEvent.ACTION_NEW_FOLDER;		break;
					case btnNewItem:	eventType = TreeEvent.ACTION_NEW_ITEM;			break;
					case btnInfo:		eventType = TreeEvent.ACTION_PROPERTIES;		break;
					case btnDelete:		eventType = TreeEvent.ACTION_DELETE;			break;
					case btnReload:		eventType = TreeEvent.ACTION_RELOAD;			break;
				}
				dispatchEvent(new TreeEvent(eventType, true));
			}
			
			public function get enabled():Boolean { return _enabled; }
			public function set enabled(state:Boolean):void 
			{
				_enabled		= state;
				mouseChildren	= state;
				mouseEnabled	= state;
				alpha			= state ? 1 : 0.5;
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}