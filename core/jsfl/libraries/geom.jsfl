// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                             ██
//  ██                                 ██
//  ██     █████ █████ ████████ █████ █████ ████ ██ ██
//  ██ ███ ██ ██ ██ ██ ██ ██ ██ ██ ██  ██   ██   ██ ██
//  ██  ██ █████ ██ ██ ██ ██ ██ █████  ██   ██   ██ ██
//  ██  ██ ██    ██ ██ ██ ██ ██ ██     ██   ██   ██ ██
//  ██████ █████ █████ ██ ██ ██ █████  ████ ██   █████
//                                                  ██
//                                               █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Geometry

	// --------------------------------------------------------------------------------
	// Bounds object

		/**
		 * Bounds object. Args: 0=Document size, 1=Element, 1=radius, 1=Array, 2=width,height, 4=width,height,x,y
		 * Useful for quickly creating objects on the stage
		 * @param	{Element}	element		A stage element
		 * @param	{Number}	element		A radius
		 * @param	{Array}		element		A selection
		 * @param	{Number}	width		The bounds width
		 * @param	{Number}	height		The bounds height
		 * @param	{Number}	x			The bounds x position
		 * @param	{Number}	y			The bounds y position
		 * @returns	{Object}    			A Bounds object
		 */
		function Bounds()
		{
			// variables
				var args = arguments;

			// switch
				switch(args.length)
				{
					// 0 arguments, use document size
						case 0:
							this.left		= 0;
							this.top		= 0;
							this.right		= $dom.width;
							this.bottom		= $dom.height;
						break;

					// 1 argument - should be a document, element, radius, or an Array of Elements (such as a selection)
						case 1:

						// Bounds
							if(args[0] instanceof Bounds)
							{
								var bounds		= new Bounds();
								bounds.top		= this.top;
								bounds.left		= this.left;
								bounds.right	= this.right;
								bounds.bottom	= this.bottom;
								return bounds;
							}

						// Document
							else if(args[0] instanceof Document)
							{
								return new Bounds();
							}

						// Element (element bounds)
							else if(args[0] instanceof Element || args[0] instanceof SymbolItem)
							{
								this.left		= args[0].left;
								this.top		= args[0].top;
								this.right		= args[0].left + args[0].width;
								this.bottom		= args[0].top + args[0].height;
							}

						// Number (radius)
							else if(typeof args[0] == 'number')
							{
								this.left		= -args[0] / 2;
								this.top		= -args[0] / 2;
								this.right		= args[0] / 2;
								this.bottom		= args[0] / 2;
							}

						// Array - selection or list of elements
							else if(args[0] instanceof Array)
							{
								var top, left, right, bottom, element = args[0][0]
								this.top		= element.top;
								this.left		= element.left;
								this.right		= element.left + element.width;
								this.bottom		= element.top + element.height;

								for(var i = 1; i < args[0].length; i++)
								{
									element		= args[0][i]
									top			= element.top;
									left		= element.left;
									right		= element.left + element.width;
									bottom		= element.top + element.height;

									if(top < this.top)			this.top	= top;
									if(left < this.left)		this.left	= left;
									if(right > this.right)		this.right	= right;
									if(bottom > this.bottom)	this.bottom	= bottom;
								}
							}

						break;

					// width, height
						case 2:
							this.left		= 0;
							this.top		= 0;
							this.right		= args[0];
							this.bottom		= args[1];
						break;

					// left, top, width, height
						case 4:
							this.left		= args[2];
							this.top		= args[3];
							this.right		= args[2] + args[0];
							this.bottom		= args[3] + args[1];
						break;
				}
				
		}
		
		Bounds.prototype =
		{
			get width()
			{
				return this.right - this.left;
			},
			
			get height()
			{
				return this.bottom - this.top;
			},
			
			get center()
			{
				var x = this.left + (this.width / 2);
				var y = this.top + (this.height / 2);
				return {x:x, y:y};
			},
			
			toString:function()
			{
				return '[object Bounds top="' +this.top+ '" right="' +this.right+ '" bottom="' +this.bottom+ '" left="' +this.left+ '"]';
			},

			clone:function()
			{
				return new Bounds(this);
			}
		}

		Bounds.toString = function()
		{
			return '[class Bounds]';
		}

		xjsfl.classes.register('Bounds', Bounds);
		
		
	// --------------------------------------------------------------------------------
	// Other objects...

