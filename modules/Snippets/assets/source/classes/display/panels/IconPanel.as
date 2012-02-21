package display.panels
{
	import flash.display.Sprite;
	import flash.display.DisplayObject;
	import flash.events.Event;
	
	import com.xjsfl.geom.Geom;
	import com.xjsfl.ui.containers.Container;
	import com.xjsfl.ui.containers.ScrollPane;
	import com.xjsfl.ui.controls.icon.Icon;
	import com.xjsfl.ui.controls.icon.LargeIcon;
	
	//import com.xjsfl.external.io.TransportFacade;
	import com.xjsfl.utils.debugging.Output;
	

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class IconPanel extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				
			
			// properties
				protected var container		:Container;
				protected var scrollpane	:ScrollPane;
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function IconPanel() 
			{
				
			}
			
			override public function initialize() 
			{
				
				scrollpane = new SmoothScrollPane();
				addChild(scrollpane);
				
				container = new Container(500, 500, 5, 5, Geom.VERTICAL);
				addChild(container);
				
				
				stage.addEventListener(Event.RESIZE, onResize)
				
				transport = TransportFacade.instance;
				transport.logLevel = 3;
				
				Output.log('Loading icon data...');
				
				transport.loadData('icons.xml', onIconsResult);
				
				
			}
			
			protected function onResize(event:Event):void 
			{
				container.setSize(stage.stageWidth, stage.stageHeight)
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onIconsResult(event:TransportEvent):void
			{
				Output.trace('Icons loaded!')
				var size	:String		= '32x32';
				var xml		:XML		= new XML(event.target.data);
				var icons	:XMLList	= xml..icon;
				
				for each(var iconNode:XML in icons)
				{
					var url		:String		= 'icons/' + size + '/' + iconNode.@file.toXMLString();
					var text	:String		= url.split('/').pop().replace(/_/g, ' ').replace(/\.\w+$/, '');
					var icon	:Icon		= new LargeIcon(transport.loadAsset(url, onIconLoaded, onIconFailed), text, true);
					//transport.loadAsset(url, onIconLoaded, onIconFailed);
					container.addChild(icon)
					icon.visible			= false;
				}
				
				//container.visible = false;
				
				
			}
			
			protected function onIconLoaded(event:TransportEvent):void 
			{
				//container.addChild(new LargeIcon(event.target as DisplayObject, event.path.split('/').pop().replace(/_/g, ' ').replace(/\.\w+$/, ''), true))
				var icon:Icon = event.target.parent as Icon;
				icon.invalidate();
				//icon.visible = true;
				icon.invalidate(function() {icon.visible = true } )
				//icon.visible = true;
				container.invalidate

			}
			
			protected function onIconFailed(event:TransportEvent):void
			{
				trace('ICON FAILED:' + event.uri)
			}
			
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}