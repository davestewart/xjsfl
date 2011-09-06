package com.xjsfl.ui.containers
{
	import com.xjsfl.geom.Size;
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import flash.geom.Rectangle;
	
	import flash.utils.clearInterval;
	import flash.utils.setTimeout;
	
	import com.xjsfl.geom.Geom;
	import com.xjsfl.geom.Padding;
	import com.xjsfl.ui.Component;
	
	/**
	 * Base Container class that supports 
	 * 
	 *  - adding, removing, and clearing of child elements
	 *  - a maximum number of child elements
	 *  - filtering (but not removing) of child elements
	 *  - redrawing when child elements dispatch an Event.RESIZE event
	 *  - nested containers
	 * 
	 * @author Dave Stewart
	 */
	public class Container extends Component
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// properties
			
				// stage instances
					protected var container			:Sprite;
			
				// children
					protected var _children			:Array;
					protected var _maxChildren		:int;
					
				// child and container arrays
					protected var _containers		:Array;
					
				// filter
					protected var _filteredChildren	:Array;
					protected var _filter			:Function;
					
			// variables
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 *
			 * @param	width		A Number specifiying the width of the container
			 * @param	height		A Number specifying the height of the container
			 */
			public function Container(width:Number = 200, height:Number = 200)
			{
				// core variables
					_maxChildren		= -1;
					_children			= [];
					_filteredChildren	= [];
					
				// elements
					container			= new Sprite();
					super.addChild(container);
					
				// parameters
					setSize(width, height);
					
				// initialize
					//initialize();
			}
			
			override protected function initialize():void
			{
				
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 * Adds another child to the container and updates the internal properties of the Container
			 * @param	child	A DisplayObject to be added to the container's children array
			 * @return
			 */
			override public function addChild(child:DisplayObject):DisplayObject
			{
				if (_maxChildren < 0 || container.numChildren < _maxChildren)
				{
					_children.push(child);
					if (child is Container)
					{
						_containers.push(child);
						child.addEventListener(Event.RESIZE, onContainerResize)
					}
					container.addChild(child);
					invalidate();
				}
				else
				{
					trace('Could not add child: ' + child)
				}
				return child;
			}
			
			override public function getChildAt(index:int):DisplayObject
			{
				return _children[index] as DisplayObject;
			}
			
			override public function removeChild(child:DisplayObject):DisplayObject
			{
				var index:int = _children.indexOf(child);
				return removeChildAt(index);
			}
			
			override public function removeChildAt(index:int):DisplayObject
			{
				// grab child
					var child:DisplayObject = _children[index] as DisplayObject;
					
				// remove from array and container
					_children.splice(index, 1);
					if (child.parent && child.parent == container)
					{
						container.removeChild(child);
					}
					
				// update containers array
					if (_containers.indexOf(child) > -1)
					{
						_containers.splice(_containers.indexOf(child), 1)
					}
					
				// update filtered items
					if (_filteredChildren.indexOf(child) > -1)
					{
						_filteredChildren.splice(_filteredChildren.indexOf(child), 1)
					}
					
				// invalidate if the size has changed
					invalidate();
					
				// return
					return child;
			}
			
			public function clear():void
			{
				while (container.numChildren > 0)
				{
					container.removeChildAt(0);
				}
				_children			= [];
				_containers			= [];
				_filteredChildren	= [];
				invalidate();
			}
			
			/**
			 * Sets the size of the container, and recursively sets the size of subcontainers
			 * @param	width	The desired width
			 * @param	height	The desired height
			 */
			override public function setSize(width:Number, height:Number):void
			{
				// debug
					//trace('setting size: ' + [width, height])
				
				// variables
					super.setSize(width, height);
			}
			
			/**
			 * Gets the size of the container
			 * @param	width	The desired width
			 * @param	height	The desired height
			 */
			override public function getSize():Size
			{
				return new Size(container.width, container.height);
			}
			
			/**
			 * Force a redraw of the container, and optionally, its child containers
			 * @param	children	A Boolean indicating whether to redraw any child containers
			 */
			public function redraw(children:Boolean = false):void
			{
				if (children)
				{
					for each(var child:Container in _containers)
					{
						child.redraw(true);
					}
				}
				_invalid = true;
				draw();
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			// bounds
			
				/// set or get the width: the setter only has an effect if the flow is horizontal
				override public function get width():Number { return container.width }
				override public function set width(value:Number):void
				{
					if (width != value)
					{
						_width = value;
						invalidate();
					}
				}
				
				/// Set or get the height: the setter only has an effect if the flow is vertical
				override public function get height():Number { return container.height }
				override public function set height(value:Number):void
				{
					if (height != value)
					{
						_height = value;
						invalidate();
					}
				}
				
			// rendering
			
				// read-only accessor of container's chlidren
				public function get children():Array { return _children; }
			
				/// read-only accessor of container's filtered chlidren
				public function get filteredChildren():Array { return _filteredChildren; }
				
				/// set a filter function on whether to display the objects or not
				public function get filter():Function { return _filter; }
				public function set filter(func:Function):void
				{
					// variables
						_filter = func;
						_filteredChildren = [];
						
					// remove all children
						while (container.numChildren > 0)
						{
							container.removeChildAt(0);
						}
						
					// re-add chldren than test true on the filter callback
						var child:DisplayObject;
						for (var i:int = 0; i < children.length; i++)
						{
							child = children[i];
							if (func === null || func(child, i))
							{
								_filteredChildren.push(child);
								container.addChild(child);
							}
						}
						
					// redraw
						invalidate();
				}
				
				public function get maxChildren():int { return _maxChildren; }
				public function set maxChildren(value:int):void 
				{
					_maxChildren = value;
				}
				
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onContainerResize(event:Event):void
			{
				//trace(this.name + ' received RESIZE from ' + event.target.name);
				event.stopImmediatePropagation();
				//redraw(true);
				invalidate();
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// private methods
		

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}