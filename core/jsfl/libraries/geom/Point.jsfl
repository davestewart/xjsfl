// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██        ██   
//  ██  ██                 ██   
//  ██  ██ █████ ██ █████ █████ 
//  ██████ ██ ██ ██ ██ ██  ██   
//  ██     ██ ██ ██ ██ ██  ██   
//  ██     ██ ██ ██ ██ ██  ██   
//  ██     █████ ██ ██ ██  ████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Point

	/**
	 * Point
	 * @overview	Point object which represents and manipulates 2D points
	 * @instance	point
	 */

	// ----------------------------------------------------------------------------------------------------
	// constructor
	
		/**
		 * The Point constructor
		 * @param	{Number}	x	The x coordinate in pixels
		 * @param	{Number}	yx	The y coordinate in pixels
		 */
		Point = function(x, y)
		{
			this.x = x || 0;
			this.y = y || 0;
		}
		
	// ----------------------------------------------------------------------------------------------------
	// prototype
	
		Point.prototype =
		{
			// --------------------------------------------------------------------------------
			// # Properties

				/** @type {Number}	The x coordinate of the Point */			
				x:null,
				
				/** @type {Number}	The y coordinate of the Point */
				y:null,
				
				/** @type {Number}	The length of the Point from [0,0] */
				get length()
				{
					return Math.sqrt(this.x * this.x + this.y * this.y);
				},
				
				constructor:Point,
				
			// --------------------------------------------------------------------------------
			// # Manipulation methods
			
				/**
				 * Adds the coordinates of another Point to the existing point, and returns a new Point
				 * @param	{Point}		pt			A Point object
				 * @returns	{Point}					A new Point object
				 */
				add:function (pt)
				{
					return new Point(this.x + pt.x, this.y + pt.y);
				},
				
				/**
				 * Subtracts the coordinates of another Point from the existing point, and returns a new Point
				 * @param	{Point}		pt			A Point object
				 * @returns	{Point}					A new Point object
				 */
				subtract:function (pt)
				{
					return new Point(this.x - pt.x, this.y - pt.y);
				},
				
				/**
				 * Tests whether two points share the same position
				 * @param	{Point}		pt			A Point object
				 * @returns	{Point}					A new Point object
				 */
				equals:function (pt)
				{
					return this.x == pt.x && this.y == pt.y;
				},
				
				/**
				 * Offsets the Point by specified x and y amounts
				 * @param	{Number}	dx			A value to offset the Point in x by
				 * @param	{Number}	dy			A value to offset the Point in y by
				 * @returns	{Point}					The current Point
				 */
				offset:function (dx, dy)
				{
					this.x += dx;
					this.y += dy;
					return this;
				},
				
				/**
				 * Normalises the Point's x and y values (based on the length from the origin)
				 * @param	{Object}	scalar		Description
				 * @returns	{Object}				Description
				 */
				normalize:function (scalar)
				{
					var l	= this.length;
					scalar	= scalar || 1;
					this.x	= this.x / l * scalar;
					this.y	= this.y / l * scalar;
					return this;
				},
				
				/**
				 * Orbits the Point around another Point
				 * @param	{Point}		pt			The Point to orbit around
				 * @param	{Number}	arcWidth	The width of the orbit
				 * @param	{Number}	arcHeight	The height of the orbit
				 * @param	{Number}	degrees		The degrees of the orbit (0 - 360)
				 * @returns	{Point}					The existing Point
				 */
				orbit:function (pt, arcWidth, arcHeight, degrees)
				{
					var radians = degrees * (Math.PI / 180);
					this.x = pt.x + arcWidth * Math.cos(radians);
					this.y = pt.y + arcHeight * Math.sin(radians);
					return this;
				},
				
			// --------------------------------------------------------------------------------
			// # Calculation methods
			
				/**
				 * Gets the angle in degrees from this Point to another Point
				 * @param	{Point}		pt			The target Point
				 * @returns	{Number}				The number of degrees
				 */
				degreesTo:function (pt)
				{
					var dx = this.x - pt.x;
					var dy = this.y - pt.y;
					var angle = Math.atan2(dy, dx); // radians
					return angle * (180 / Math.PI); // degrees
				},
				
				/**
				 * Gets the distance in pixels from this Point to another Point
				 * @param	{Point}		pt			The target Point
				 * @returns	{Number}				The distance in pixels
				 */
				distanceTo:function (pt)
				{
					var x = this.x - pt.x;
					var y = this.y - pt.y;
					return Math.sqrt(x * x + y * y);
				},
				
				/**
				 * Gets the interpolated distance in pixels from this Point to another Point
				 * @param	{Point}		pt			The target Point
				 * @param	{Number}	f			A number from 0 to 1 
				 * @returns	{Point}					The point object interpolated between the two points
				 */
				interpolate:function (pt, f)
				{
					f = typeof f === 'undefined' ? 1 : f;
					return new Point((this.x + pt.x) * f, (this.y + pt.y) * f);
				},
				
			// --------------------------------------------------------------------------------
			// # Utility methods
			
				/**
				 * Returns a copy of the current Point
				 * @returns	{Point}					A new Point
				 */
				clone:function ()
				{
					return new Point(this.x, this.y);
				},
	
				/**
				 * Returns a String representation of the Point
				 * @returns	{String}				The String representation of the Point
				 */
				toString:function ()
				{
					return '[object Point x=' +this.x+ ' y=' +this.y+ ']';
				},
		}
		
	// ----------------------------------------------------------------------------------------------------
	// # Static methods
	
		/**
		 * Gets the interpolated distance in pixels from a source Point a target Point
		 * @param	{Point}		pt1			The source Point
		 * @param	{Point}		pt2			The target Point
		 * @param	{Number}	f			A number from 0 to 1 
		 * @returns	{Number}				The distance in pixels
		 */
		Point.interpolate = function(pt1, pt2, f)
		{
			f = typeof f === 'undefined' ? 1 : f;
			return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
		};
		
		/**
		 * Returns a new Point, based on an angle around and length from the Origin (0, 0)
		 * @param	{Number}	length		The length from the Origin
		 * @param	{Number}	angle		The angle in degrees to rotate around the origin
		 * @returns	{Point}					A new Point object
		 */
		Point.polar = function(length, angle)
		{
			return new Point(length * Math.sin(angle), length * Math.cos(angle));
		};
		
		/**
		 * Gets the distance in pixels from a source Point a target Point
		 * @param	{Point}		pt1			The source Point
		 * @param	{Point}		pt2			The target Point
		 * @returns	{Number}				The distance in pixels
		 */
		Point.distance = function(pt1, pt2)
		{
			var x = pt1.x - pt2.x;
			var y = pt1.y - pt2.y;
			return Math.sqrt(x * x + y * y);
		};
		
		Point.toString = function()
		{
			return '[class Point]';
		}
		
	// --------------------------------------------------------------------------------
	// Register class

		xjsfl.classes.register('Point', Point);

