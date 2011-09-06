package com.xjsfl.ui.controls.icon 
{

	import com.xjsfl.geom.Geom;
	import com.xjsfl.ui.controls.icon.Icon;
	import flash.geom.Rectangle;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class LargeIcon extends Icon
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				
			
			// properties
				
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function LargeIcon(icon:* = null, text:String = null, interactive:Boolean = false) 
			{
				super(icon, text, interactive);
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			override protected function updateIcon():void 
			{
				if (_icon)
				{
					_icon.x			= - (_icon.width / 2);
					_label.x		= 0;
					_label.align	= Geom.CENTER;
					_label.y		= _icon.height + _spacing;
				}
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}