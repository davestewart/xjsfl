package com.xjsfl.geom
{
	import flash.geom.Rectangle;

	/**
	 * An object-oriented bounds object that can be used in place of anonymous objects
	 * @author Dave Stewart
	 */
	public class Bounds
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			public var top		:Number		= 0;
			public var right	:Number		= 0;
			public var bottom	:Number		= 0;
			public var left		:Number		= 0;
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 * An object whose values represent visual padding
			 * @param	...values
			 * 			1, 2, or 4 arguments, supplying 
			 * 			1: all values, 
			 * 			2: top & bottom values, 
			 * 			3: top, right, bottom & left values.
			 */
			public function Bounds(top:Number, right:Number, bottom:Number, right:Number) 
			{
				if (values.length == 1)
				{
					this.values = values[0];
				}
				else
				{
					this.values = values;
				}
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			public function get horizontal():Number
			{
				return left + right;
			}

			public function get vertical():Number
			{
				return top + bottom;
			}
			
			public function set values(values:*):void
			{
				if (values is Number)
				{
					top		= values;
					right	= values;
					bottom	= values;
					left	= values;
				}
				else if(values is Array)
				{
					if (values.length == 2)
					{
						top		= values[0];
						right	= values[1];
						bottom	= values[0];
						left	= values[1];
					}
					else if (values.length == 4)
					{
						top		= values[0];
						right	= values[1];
						bottom	= values[2];
						left	= values[3];
					}
				}
			}
			
			public function toString():String
			{
				if (top == bottom == left == right)
				{
					return '[Bounds {all: ' +top+ '} ]'
				}
				else if (top == bottom && left == right)
				{
					return '[Bounds {vertical:' +top+ ', horizontal:' +left+ '} ]'
				}
				else
				{
					return '[Bounds {top:' +top+ ', right:' +right+ ', bottom:' +bottom+ ', left:' +left+ '} ]'
				}
			}

	}

}