package com.xjsfl.ui.containers 
{
	import flash.display.DisplayObject;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class StateContainer extends Container
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// properties
				protected var _state:*;
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function StateContainer(width:Number = 200, height:Number = 200) 
			{
				super(width, height)
				initialize();
			}
			
	
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function addChild(child:DisplayObject):DisplayObject 
			{
				var child = super.addChild(child);
				if (child.parent == container)
				{
					if (container.numChildren > 1)
					{
						container.removeChild(child);
					}
				}
				return child;
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			public function get state():* { return _state; }
			public function set state(state:*):void 
			{
				if (state is Number)
				{
					state = Math.round(state);
					filter = function(child:DisplayObject, index:int){ return _children.indexOf(child) == state }
				}
				else if (state is String)
				{
					filter = function(child:DisplayObject, index:int){ return child.name == state}
				}
				else if (state is Class)
				{
					filter = function(child:DisplayObject, index:int){ return child is state }
				}
				else if (state is Function)
				{
					filter = state
				}
				_state = state;
			}
			
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}