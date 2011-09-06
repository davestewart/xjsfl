package com.xjsfl.ui.containers.layout
{
	import com.xjsfl.geom.Geom;
	import com.xjsfl.ui.containers.layout.FlowContainer;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class VBox extends FlowContainer
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 * Customised Container that lays out items vertically
			 * @param	spacing
			 * @param	padding
			 */
			public function VBox(spacing:Number = 5, padding:* = 5) 
			{
				super(0, 0, spacing, padding, Geom.VERTICAL, false);
			}
			
	}

}