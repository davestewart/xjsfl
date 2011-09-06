package com.xjsfl.ui.containers.layout
{
	import com.xjsfl.utils.DisplayUtils;
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
	import com.xjsfl.ui.containers.Container;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class FlowContainer extends Container
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// static variables
			
				// debugging
					public static var debug			:Boolean;
					
			// properties
			
				// layout
					protected var _flow				:String;
					protected var _wrap				:Boolean;
					protected var _spacing			:Number;
					protected var _padding			:Padding;
					
			// variables
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 *
			 * @param	width		A Number specifiying the width of the container
			 * @param	height		A Number specifying the height of the container
			 * @param	spacing		A Number specifying the amount of space between children
			 * @param	padding		A Padding object or a Number specifying the padding around the edge of the container
			 * @param	flow		A String constant speciifying the direction of flow within the container.
			 * @param	wrap		A Boolean specifying whether the children should wrap when they get too wide / high for the container
			 */
			public function FlowContainer(width:Number = 0, height:Number = 0, spacing:Number = 5, padding:* = 5, flow:String = Geom.HORIZONTAL, wrap:Boolean = true)
			{
				// core variables
					_containers			= [];
					
				// super
					super(width, height);
					
				// parameters
					this.padding	= padding;
					this.spacing	= spacing
					this.flow		= flow;
					this.wrap		= wrap;
					
				// initialize
					initialize();
			}
			
			override protected function initialize():void
			{
				
			}
			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 * Sets the size of the container, and recursively sets the size of subcontainers
			 * @param	width	The desired width
			 * @param	height	The desired height
			 * @return A boolean: false if no children, true if there are
			 */
			override public function setSize(width:Number, height:Number):void
			{
				// debug
					//trace('setting size: ' + [width, height])
				
				// variables
					super.setSize(width, height);
				
				// exit early if no children
					if (children.length > 0)
					{
						// variables
							var w			:Number;
							var h			:Number;
							var space		:Number;
							var spaceOrig	:Number;
							var axis		:String;
							
						// if wrapping is not set, we need to work out if there is available space for child containers.
						// So here we get available dimensions for child containers, and set them appropriately
							if (wrap == false)
							{
								// function
								
									/**
									 * Function to get the available space in one axis, which is the current width/height
									 * minus the cumulative width/height of all the child children that are not containers.
									 * @param	space		the existing available space
									 * @param	axis		the
									 * @return
									 */
									function getAvailableSpace(space:Number, axis:String):Number
									{
										// remove padding
											space -= (axis == Geom.WIDTH ? padding.horizontal : padding.vertical);
											
										// find, and remove width of all children
											var child:DisplayObject;
											for (var i:int = 0; i < children.length; i++)
											{
												child = children[i];
												
												if ( ! child is Container )
												{
													space -= child[axis];
												}
												space -= spacing;
											}
											space += spacing;
											
										// return
											return space;
									}
									
								// get measurements
									if (flow == Geom.HORIZONTAL)
									{
										axis		= Geom.WIDTH;
										spaceOrig	= width;
										space		= getAvailableSpace.apply(this, [width, axis]);
										w			= space / _containers.length;
										h			= height - padding.vertical;
									}
									else
									{
										axis		= Geom.HEIGHT;
										spaceOrig	= height;
										space		= getAvailableSpace.apply(this, [height, axis]);
										w			= width - padding.horizontal;
										h			= space / _containers.length;
									}
									
								/*
									*/
								
								// debug
									//trace(name);
									//trace(' > ' +axis+ ':' +spaceOrig + ' > '+axis+ 'Cont: ' + space + ' / ' + _containers.length + ' = ' + (space / _containers.length))
								
								// set size of child
									for each(var child:Container in _containers)
									{
										child.setSize(w, h);
									}
									
								// draw
									//redraw(true)
							}
							
					}
			}
			
			/**
			 * Draws the container contents
			 */
			override public function draw():void
			{
				// redraw children first, so sizes are correct
					for each(var subcontainer:Container in _containers)
					{
						subcontainer.draw();
					}
				
				// only draw if component is set as invalid
					if (_invalid) // _invalid
					{
						// draw variables
							var i				:int		= 0;
							var x				:Number		= 0;
							var y				:Number		= 0;
							var rowHeight		:Number		= 0;
							var colWidth		:Number		= 0;
							var wrapWidth		:Number		= _width - padding.horizontal;
							var wrapHeight		:Number		= _height - padding.vertical;
							var child			:DisplayObject;
							
						// debug
							var strDebug		:String		= '';
							
						// layout
							switch(_flow)
							{
								case Geom.HORIZONTAL:
								
									//TODO Think about using dependency injection here, or an alternative Layout class
									/*
										Grid
											- expend to the bigest cells
												- put in cols (sprites) first, then get the widest width, then local to local to get x's
												- then put in rows (sprites), then get the highest height, then local to local to get y's
												- then move all to parernt.parent clip to avoid parental issues after
												- then delete old sprites
												- would this be quicker than manually calculating things using arrays?
												
										Rows
										Columns
										Circle
										Etc
										
										Factor in 
										 - pivots
										 - rotation
										 - getNextPosition() function?
										 
										 - wrap
									
									*/
								
									//DisplayUtils.layout(children, container, wrapWidth, spacing, spacing, padding.horizontal);
								
									for (i = 0; i < children.length; i++)
									{
										child = children[i];
										if (child.stage)
										{
											// check wrap
												if (wrap && x > (wrapWidth - child.width))
												{
													x = 0;
													y += rowHeight;
													if (i > 0)
													{
														y += spacing;
													}
													rowHeight = 0;
												}
												
											// position
												child.x = x;
												child.y = y;
												x += child.width + spacing;

											// update row / column height
												if (child.height > rowHeight)
												{
													rowHeight = child.height;
												}
												
											// debug
												if (children.length < 10)
												{
													strDebug += ' > ' + child.name + ', height: ' + child.height + '\n';
												}
												
										}
									}
								break;
								
								case Geom.VERTICAL:
									for (i = 0; i < children.length; i++)
									{
										child = children[i];
										if (child.stage)
										{
											// check wrap
												if (wrap && y > wrapHeight - child.height)
												{
													y = 0;
													x += colWidth;
													if (i > 0)
													{
														x += spacing;
													}
													colWidth = 0;
												}
												
											// position
												child.x = x;
												child.y = y;
												y += child.height + spacing;
											
											// update row / column height
												if (child.width > colWidth)
												{
													colWidth = child.width;
												}
										}
									}
								break;
							}
							
						// debug
							if (FlowContainer.debug)
							{
								//trace('Drawing ' + this.name + ': ' + height + ', ' + this.name + ' container: ' + container.height + ' (v-padding: ' +padding.vertical + ')')
								//trace(strDebug);
							}
							
						// check if the size changed since the last redraw
							var sizeChanged:Boolean = width != _size.width || height != _size.height;
							
						// size
							_size.width = width;
							_size.height = height;
							
						// call super.draw to clear _invalid and dispatch a draw event
							super.draw();
							
						// if size has changed, bubble a resize event
							if (sizeChanged)
							{
								dispatchEvent(new Event(Event.RESIZE, true));
							}
							
						// if debugging, highlight the children' area
						
							//TODO Can this be moved to the display utils class, and packaged like identify?
						
							graphics.clear();
							if (FlowContainer.debug)
							{
								//trace('Drawing debug graphics on ' + this.name)
								
								graphics.beginFill(0x000000, 0.2);
								graphics.lineStyle(1, 0x00FF00, 1, true);
								graphics.drawRect(padding.left, padding.top, container.width - 1, container.height - 1);
								graphics.endFill();
								
								graphics.lineStyle(1, 0xFF0000, 1, true);
								graphics.drawRect(0, 0, width - 1, height - 1);
								
							}
						
					}
					
					
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			// bounds
			
				/// set or get the width: the setter only has an effect if the flow is horizontal
				override public function get width():Number { return container ? container.width + padding.horizontal : 0 }
				
				/// Set or get the height: the setter only has an effect if the flow is vertical
				override public function get height():Number { return container ? container.height + padding.vertical : 0 }
				
			// layout
			
				/// set or get the direction of flow: either horizontal, or vertical
				public function get flow():String { return _flow; }
				public function set flow(value:String):void
				{
					if (value != _flow)
					{
						if (value == Geom.HORIZONTAL || value == Geom.VERTICAL)
						{
							_flow = value;
							invalidate();
						}
						else
						{
							throw new Error('Flow needs to be a valid type; Geom.HORIZONTAL or Geom.VERTICAL');
						}
					}
				}
				
				/// set or get whether the child elements wrap or not
				public function get wrap():Boolean { return _wrap; }
				public function set wrap(value:Boolean):void
				{
					if (value != _wrap)
					{
						_wrap = value;
						invalidate();
					}
				}
			
				/// set or get the padding of the children
				public function get padding():Padding { return _padding; }
				public function set padding(padding:*):void
				{
					_padding	= padding is Padding ? padding : new Padding(padding);
					container.x = _padding.left;
					container.y = _padding.top;
					invalidate();
				}
				
				// set or get the spacing between the children
				public function get spacing():Number { return _spacing; }
				public function set spacing(value:Number):void
				{
					if (value != _spacing)
					{
						_spacing = value;
						invalidate();
					}
				}
				
			// rendering
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			
		// ---------------------------------------------------------------------------------------------------------------------
		// private methods
		

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}