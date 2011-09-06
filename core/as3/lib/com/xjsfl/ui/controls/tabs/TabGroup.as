package com.xjsfl.ui.controls.tabs
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	
	import com.xjsfl.ui.controls.base.Container;
	import com.xjsfl.ui.controls.tabs.Tab;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TabGroup extends Container
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var contentContainer		:Sprite;
		
			// parameters
				protected var _transition		:Function;
			
			// variables
			
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TabGroup()
			{
				itemRenderer		= Tab;
				layout				= Container.HORIZONTAL;
				initialize();
			}
			
			override public function initialize()
			{
				super.initialize();
				contentContainer = new Sprite();
				addChild(contentContainer);
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			public function addTab(label:String, contentRef:Object, props:Object = null):void
			{
				// content (item)
					var content:DisplayObject;
					if (contentRef is Class)
					{
						content = new contentRef();
					}
					else if (content is DisplayObject)
					{
						content = contentRef as DisplayObject;
					}
					
				// debug
					trace(content)
							
				// content
					if (content)
					{
						// debug
							trace('itemRenderer:' + itemRenderer)
							trace('label:' + label)
						
						// tab
							trace('About to make tab')
							var tab:Tab		= new itemRenderer(label);
							trace('Made tab')
							tab.active		= itemsContainer.numChildren == 0;
							itemsContainer.addChild(tab);
							
						// content
							contentContainer.addChild(content);
							content.visible = contentContainer.numChildren == 0;
							/*
							*/
							
					}
					
				// draw
					draw();
			}
		
			public function activate(index:int):void
			{
				
			}
			
			public function focus(index:int):void
			{
				
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			override protected function draw():void
			{
				super.draw()
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}