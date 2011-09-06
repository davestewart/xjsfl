package com.xjsfl.ui.controls 
{
	import fl.controls.UIScrollBar;
	

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class ScrollBar extends fl.controls.UIScrollBar
	{
		public function ScrollBar() 
		{
			super();
			trace('New scorollbar')
		}
			
		override protected function draw():void 
		{
			//super.draw();
			trace(getChildAt(0))
		}


	}

}