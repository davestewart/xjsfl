package com.xjsfl.ui.controls.tooltip 
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.utils.clearTimeout;
	import flash.utils.setTimeout;
	
	import com.xjsfl.ui.controls.tooltip.ITooltippable;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TipManager	
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// elements
				protected static var tooltip			:Tooltip;
				protected static var root				:DisplayObjectContainer;
				protected static var currentElement		:DisplayObject;
				protected static var stack				:Array;
			
			// tooltip properties
				protected static var delay				:int			= 1;
				protected static var duration			:int			= 4;
				
			// timeout properties
				protected static var showTimeoutId		:int;
				protected static var hideTimeoutId		:int;
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 * 
			 * @param	root	The root timeline, from which all mouseover events can be monitored
			 * @param	options	An optional object containing parameters options for the tooltip. Valid names are: class, color, bgColor, size, padding, textFormat, shadow, delay, timeIn, timeOut
			 */
			public static function initialize(root:DisplayObjectContainer, params:Object = null)
			{
				// store variables
					TipManager.root			= root;
					TipManager.stack		= new Array();
					
				// tooltip
					tooltip					= params && params['class'] ? new (params['class'])() : new Tooltip();
					tooltip.mouseEnabled	= false;
					tooltip.mouseChildren	= false;
					TipManager.tooltip		= tooltip;
					root.addChild(tooltip);
					
				// delay
					if (params && params.delay)
					{
						delay = params.delay;
					}
					
				// tooltip options
					var allowableOptions	:Array = 'color,bgColor,size,padding,textFormat,shadow,timeIn,timeOut'.split(',');
					for (var option:String in params) 
					{
						if (allowableOptions.indexOf(option) != -1)
						{
							trace(option + ':' + params[option]);
							tooltip[option] = params[option];
						}
					}
					
				// listeners
					root.addEventListener(MouseEvent.MOUSE_OVER, onMouseOver);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			static protected function setDelayedTip(addListener:Boolean = false):void
			{
				clearDelayedTip();
				showTimeoutId = setTimeout(function() { tooltip.visible = true; setDelayedHide(); }, delay * 1000);
				if (addListener)
				{
					root.addEventListener(MouseEvent.MOUSE_DOWN, function() { clearDelayedTip(true) } );
				}
			}
			
			static protected function clearDelayedTip(clearListener:Boolean = false):void
			{
				clearTimeout(showTimeoutId);
				clearTimeout(hideTimeoutId);
				tooltip.visible = false;
				if (clearListener)
				{
					root.removeEventListener(MouseEvent.MOUSE_MOVE, setDelayedTip);
					root.removeEventListener(MouseEvent.MOUSE_DOWN, clearDelayedTip);
				}
			}
			
			static protected function setDelayedHide():void 
			{
				hideTimeoutId = setTimeout(function() { clearDelayedTip(true) }, duration * 1000);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected static function onMouseOver(event:MouseEvent)
			{
				// grab element
					var element:DisplayObject = event.target as DisplayObject;
					element = getContainer(event.target as DisplayObject);
					
				// text
					var text:String = '';
					
				// check if element is tooltippable
					if (element is ITooltippable)
					{
						// if the new element is not already active
							if (element != currentElement)
							{
								// show correct tip type
									if (element is IQuicktippable)
									{
										clearDelayedTip(true);
										setDelayedHide();
										text = (element as IQuicktippable).tooltip;
										if (text != '' && text != null)
										{
											tooltip.text = text;
											tooltip.visible		= true;
										}
									}
									else
									{
										text = (element as ITooltippable).tooltip;
										if (text != '' && text != null)
										{
											tooltip.text = text;
											setDelayedTip(true);
										}
									}
									
								// update current element
									currentElement = element;
							}
							
						// add element to the stack
							if (stack.indexOf(element) == -1)
							{
								stack.push(element);
								element.addEventListener(MouseEvent.ROLL_OUT, onRollOut);
							}
					}
			}
			
			protected static function onRollOut(event:MouseEvent):void 
			{
				
				(event.target as DisplayObject).removeEventListener(MouseEvent.ROLL_OUT, onRollOut);
				stack.pop();
				if (stack.length == 0)
				{
					currentElement = null;
					clearDelayedTip(true);
				}
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			protected static function getContainer(element:DisplayObject):DisplayObject
			{
				if (! (element is ITooltippable))
				{
					do
					{
						element = element.parent;
					}
					while(element != null && ! (element is ITooltippable))
				}
				return element;
			}

			

	}

}