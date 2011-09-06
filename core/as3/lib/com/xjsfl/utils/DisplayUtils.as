package com.xjsfl.utils 
{
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.geom.ColorTransform;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class DisplayUtils
	{
		/**
		 * Draws a rectangle around the display object in case you can't see it on the stage
		 * @param	element
		 * @param	color
		 * @param	alpha
		 */
		public static function identify(element:DisplayObjectContainer, color:int = 0xFF0000, alpha:Number = 0.1):void
		{
			// remove prior rect  object
				var rect:Sprite = element.getChildByName('__rect') as Sprite;
				if (rect)
				{
					element.removeChild(rect);
				}
				
			// new bounds
				var bounds:Rectangle	= element.getBounds(element);
				
			// create rect
				rect				= new Sprite();
				rect.name			= '__rect';
				rect.mouseEnabled	= false;
				
				rect.graphics.lineStyle(2, color);
				rect.graphics.beginFill(color, alpha);
				rect.graphics.drawRect(bounds.x - 1, bounds.y - 1, bounds.width + 2, bounds.height + 2);
				
			// add rect
				element.alpha = 1;
				element.visible = true;
				element.addChild(rect);
				
			// make parents visible
				/*
				while (element.parent)
				{
					element.parent.visible	= true;
					element.parent.alpha	= 1;
					element					= element.parent;
				}
				*/
		}
		
		/**
		 * Lays out elements in a grid, regardless of their internal centerpoint offsets. Does not take into account object rotation though!
		 * @param	elements		An Array of display objects to be aligned
		 * @param	parent			A parent DisplayObject to attach and align to
		 * @param	useStage		A Boolean indicating whether to use the stage bounds (default) or the object bounds
		 * @param	vGutter			A Number specifying the vertical gutter between objects
		 * @param	hGutter			A Number specifying the horizontal gutter between rows
		 * @param	outsidePadding	A number specifying the padding 
		 */
		public static function layout(elements:Array, parent:DisplayObjectContainer, maxWidth:Number, vGutter:Number = 10, hGutter:Number = 10, outsidePadding:Number = 10):void 
		{
			// variables
				var point		:Point		= new Point(outsidePadding, outsidePadding);
				var offset		:Point		= new Point(0, 0);
				var height		:Number		= 0;
				var bounds		:Rectangle;
				
			// layout loop
				for each(var element:DisplayObject in elements) 
				{
					// if x > width, reset
						if (point.x + element.width + (outsidePadding * 2) > maxWidth)
						{
							point	= new Point(outsidePadding, point.y + height + hGutter);
							offset	= new Point(0, 0)
						}
						
					// add
						if(element.parent != parent)
						{
							parent.addChild(element);
						}
						
					// variables
						bounds		= element.getBounds(element);
					
					// debug
						//trace(element, local);
						
					// offset
						offset.x	= - bounds.x;
						offset.y	= - bounds.y;
						
					// move
						element.x	= point.x + offset.x;
						element.y	= point.y + offset.y;
						
					// max height of row
						if (bounds.height > height)
						{
							height = element.height;
						}
						
					// update
						point.x		+= element.width + vGutter;
				}
		}
		
		/**
		 * Gets the visible bounds of an object
		 * @see		http://blog.open-design.be/2010/01/26/getbounds-on-displayobject-not-functioning-properly/
		 * @param	displayObject
		 * @return
		 */
		public static function getRealBounds(displayObject:DisplayObject):Rectangle
		{
			// variables
				var bounds				:Rectangle;
				var boundsDispO			:Rectangle		= displayObject.getBounds( displayObject );
				var bitmapData			:BitmapData		= new BitmapData( int( boundsDispO.width + 0.5 ), int( boundsDispO.height + 0.5 ), true, 0 );
				var matrix				:Matrix			= new Matrix();
				
			// offset centerpoint
				matrix.translate( -boundsDispO.x, -boundsDispO.y);

			// draw bitmap of object's contents
				bitmapData.draw( displayObject, matrix, new ColorTransform( 1, 1, 1, 1, 255, -255, -255, 255 ) );

			// calculate bounds using bitmap color bounds
				bounds		= bitmapData.getColorBoundsRect( 0xFF000000, 0xFF000000 );
				bounds.x	+= boundsDispO.x;
				bounds.y	+= boundsDispO.y;
				bitmapData.dispose();
				
			// return
				return bounds;
		}
		
		/**
		 * Gets the string path to an item from the root
		 * @param	element
		 * @return
		 */
		public static function getPath(element:DisplayObject):String
		{
			var elements	:Array	= [element.name];
			while (element.parent)
			{
				element = element.parent;
				elements.push(element.name);
			}
			return elements.reverse().join('.');
		}

	}

}