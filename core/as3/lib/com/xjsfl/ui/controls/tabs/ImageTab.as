package com.xjsfl.ui.controls.tabs
{
	import flash.display.DisplayObject;
	import flash.display.Loader;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class ImageTab extends Tab
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var icon		:Loader;
			
			// properties
				
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function ImageTab(labelText:String, icon:Object)
			{
				super(labelText);
				initialize();
			}
			
			override public function initialize()
			{
				tf.x = - int(tf.width / 2);
				tf.y = 34;
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function draw():void 
			{
				super.draw();
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}