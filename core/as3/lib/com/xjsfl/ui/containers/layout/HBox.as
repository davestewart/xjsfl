package com.xjsfl.ui.containers.layout
{
	import com.xjsfl.geom.Geom;
	import com.xjsfl.ui.containers.layout.FlowContainer;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class HBox extends FlowContainer
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 * Customised Container that lays out items horizontally
			 * @param	spacing
			 * @param	padding
			 */
			public function HBox(spacing:Number = 5, padding:* = 5) 
			{
				super(0, 0, spacing, padding, Geom.HORIZONTAL, false);
			}
	}

}