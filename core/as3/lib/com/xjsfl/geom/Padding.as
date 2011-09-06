package com.xjsfl.geom
{

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Padding
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
			 * An object whose values represent visual padding. Takes 1, 2, or 4 arguments:
			 * @param	...values
			 * 			1 argument:  all values
			 * 			2 arguments: vertical & horizontal values
			 * 			4 arguments: top, right, bottom & left values (clockwise order)
			 */
			public function Padding(...values) 
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
					return '[Padding {all: ' +top+ '} ]'
				}
				else if (top == bottom && left == right)
				{
					return '[Padding {vertical:' +top+ ', horizontal:' +left+ '} ]'
				}
				else
				{
					return '[Padding {top:' +top+ ', right:' +right+ ', bottom:' +bottom+ ', left:' +left+ '} ]'
				}
			}

	}

}