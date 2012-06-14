package com.xjsfl.ui
{
	import com.xjsfl.geom.Size;
	import com.xjsfl.ui.events.UIEvent;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	
	import flash.events.Event;
	import flash.geom.Rectangle;
	import flash.text.Font;

	import com.xjsfl.text.fonts.ReferenceSans;
	

	/**
	 * Basic component 
	 */
	public class Component extends Sprite
	{
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// properties
			
				// layout
					protected var _width				:Number;
					protected var _height				:Number;
					
					protected var _size					:Size;
					protected var _minSize				:Size;
					protected var _startSize			:Size;
					
				// visible
					protected var _enabled				:Boolean;
					protected var _invalid				:Boolean;
					protected var _invalidationCallback	:Function;
					
				// font
					protected var font					:Font;

			// variables
			
				// none
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation

			/**
			 * Constructor
			 * @param parent The parent DisplayObjectContainer on which to add this component.
			 * @param xpos The x position to place this component.
			 * @param ypos The y position to place this component.
			 */
			public function Component()
			{
				// move component to nearest pixel if on stage
					x				= Math.round(x);
					y				= Math.round(y);
					
				// reset scale
					super.scaleX	= 1;
					super.scaleY	= 1;
					
				// set basic size properties
					_width			= width;
					_height			= height;
					
					_size			= new Size(width, height);
					_minSize		= new Size();
					_startSize		= new Size(width, height);

				// enabled
					_enabled		= true;
					
				// font
					font			= ReferenceSans.instance;
			}
			
			/**
			 * Initilizes the component.
			 */
			protected function initialize():void
			{
				//resetScale(true, true);
			}
			
			protected function build():void 
			{
				
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 * Moves the component to the specified position.
			 * @param x	the x position to move the component
			 * @param y	the y position to move the component
			 */
			public function move(x:Number, y:Number):void
			{
				this.x = x;
				this.y = y;
			}
			
			/**
			 * Sets the size of the component
			 * @param width The width of the component
			 * @param height The height of the component
			 */
			public function setSize(width:Number, height:Number):void
			{
				if (width >= _minSize.width)
				{
					_width			= width;
					_size.width		= width;
				}
				if (height >= _minSize.height)
				{
					_height			= height;
					_size.height	= height;
				}
				invalidate();
			}
			
			/**
			 * Gets the size of the component
			 * @return Rectange
			 */
			public function getSize():Size
			{
				return _size;
			}
			
			/**
			 * Sets the minimum size of the component
			 * @param width The min width of the component
			 * @param height The min height of the component
			 */
			public function setMinSize(width:Number, height:Number):void
			{
				_minSize.width		= width;
				_minSize.height		= height;
			}
			
			protected function checkResize(newWidth:Number, newHeight:Number):void 
			{
				if (newWidth != _width || newHeight != _height)
				{
					dispatchEvent(new UIEvent(UIEvent.RESIZE));
					_width = newWidth;
					_height = newHeight;
				}
			}
			
			/**
			 * Clear invalidation and draws the component
			 */
			public function draw():void
			{
				_invalid = false;
				if (_invalidationCallback is Function)
				{
					_invalidationCallback();
				}
				removeEventListener(Event.ENTER_FRAME, onInvalidate);
				dispatchEvent(new UIEvent(UIEvent.DRAW));
			}	

			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
			
			/// set the parent
			override public function get parent():DisplayObjectContainer { return super.parent; }
			public function set parent(parent:DisplayObjectContainer)
			{
				if (parent == null)
				{
					super.parent.removeChild(this);
				}
				else if(super.parent)
				{
					parent.addChild(this);
				}
			}
			
			/// Override setter to place on whole pixel
			override public function set x(value:Number):void
			{
				super.x = Math.round(value);
			}
			
			/// Override setter to place on whole pixel
			override public function set y(value:Number):void
			{
				super.y = Math.round(value);
			}

			/// make scale read-only - or, set it so that it sets the width?
			override public function set scaleX(value:Number):void { }
			override public function set scaleY(value:Number):void { }
			
			
			/// Sets/gets whether this component is enabled or not
			public function get enabled():Boolean{ return _enabled; }
			public function set enabled(value:Boolean):void
			{
				_enabled		= value;
				mouseEnabled	= mouseChildren = _enabled;
				alpha			= _enabled ? 1 : 0.5;
			}
			

			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			/**
			 * Marks the component to be redrawn on the next frame.
			 */
			public function invalidate(callback:Function = null):void
			{
				_invalid = true;
				if (callback is Function)
				{
					_invalidationCallback = callback;
				}
				addEventListener(Event.ENTER_FRAME, onInvalidate);
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// private methods
		

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			/**
			 * Called one frame after invalidate is called.
			 */
			protected function onInvalidate(event:Event):void
			{
				//trace('onInvalidate: [' + this.name + '] @ ' + getTimer());
				removeEventListener(Event.ENTER_FRAME, onInvalidate);
				draw();
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities



	}
}