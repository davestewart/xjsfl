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
// Point - Point object

	// ----------------------------------------------------------------------------------------------------
	// constructor
	
		function Point(x, y)
		{
			this.x = x || 0;
			this.y = y || 0;
		}
		
	// ----------------------------------------------------------------------------------------------------
	// prototype
	
		Point.prototype =
		{
			// --------------------------------------------------------------------------------
			// properties
			
				x:null,
				y:null,
				
				get length()
				{
					return Math.sqrt(this.x * this.x + this.y * this.y);
				},
				
				constructor:Point,
				
			// --------------------------------------------------------------------------------
			// manipulation
			
				add:function (pt)
				{
					return new Point(this.x + pt.x, this.y + pt.y);
				},
				
				subtract:function (pt)
				{
					return new Point(this.x - pt.x, this.y - pt.y);
				},
				
				equals:function (pt)
				{
					return this.x == pt.x && this.y == pt.y;
				},
				
				offset:function (dx, dy)
				{
					this.x += dx;
					this.y += dy;
					return this;
				},
				
				normalize:function (scalar)
				{
					var l	= this.length;
					scalar	= scalar || 1;
					this.x	= this.x / l * scalar;
					this.y	= this.y / l * scalar;
					return this;
				},
				
				orbit:function (pt, arcWidth, arcHeight, degrees)
				{
					var radians = degrees * (Math.PI / 180);
					this.x = pt.x + arcWidth * Math.cos(radians);
					this.y = pt.y + arcHeight * Math.sin(radians);
					return this;
				},
				
			// --------------------------------------------------------------------------------
			// calculation
			
				degreesTo:function (pt)
				{
					var dx = this.x - pt.x;
					var dy = this.y - pt.y;
					var angle = Math.atan2(dy, dx); // radians
					return angle * (180 / Math.PI); // degrees
				},
				
				distanceTo:function (pt)
				{
					var x = this.x - pt.x;
					var y = this.y - pt.y;
					return Math.sqrt(x * x + y * y);
				},
				
				interpolate:function (pt, f)
				{
					return new Point((this.x + pt.x) * f, (this.y + pt.y) * f);
				},
				
			// --------------------------------------------------------------------------------
			// utilities
			
				clone:function ()
				{
					return new Point(this.x, this.y);
				},
				
	
				toString:function ()
				{
					return '[object Point x=' +this.x+ ' y=' +this.y+ ']';
				},
		}
		
	// ----------------------------------------------------------------------------------------------------
	// static methods
	
		Point.interpolate = function(pt1, pt2, f)
		{
			return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
		};
		
		Point.polar = function(length, angle)
		{
			return new Point(length * Math.sin(angle), length * Math.cos(angle));
		};
		
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

