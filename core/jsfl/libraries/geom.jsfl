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
		 * Bounds object. Args: 0=Document size, 1=Element, 1=radius, 2=width/weight, 4=x,y,width,height
		 * Useful for quickly creating objects on the stage
		 * @returns		{Object}
		 */
		function Bounds()
		{
			// variables
				var args = arguments;
			
			// switch
				switch(arguments.length)
				{
					// 0 arguments, use document ize
						case 0:
							this.left		= 0;
							this.top		= 0;
							this.right		= dom.width;
							this.bottom		= dom.height;
						break;
					
					// 1 argument - should be an element or a radius
						case 1:

						// Element (element bounds)
							if(args[0] instanceof Element || args[0] instanceof SymbolItem)
							{
								this.left		= args[0].left;
								this.top		= args[0].top;
								this.right		= args[0].left + args[0].width;
								this.bottom		= args[0].top + args[0].height;
							}
							
						// Number (radius)
							else if(typeof args[0] == 'number')
							{
								var value		= 
								this.left		= -args[0] / 2;
								this.top		= -args[0] / 2;
								this.right		= args[0] / 2;
								this.bottom		= args[0] / 2;
							}
							
						// Array - selection or list of elements
						//TODO Add
							
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
							this.left		= args[0];
							this.top		= args[1];
							this.right		= args[0] + args[2];
							this.bottom		= args[1] + args[3];
						break;
				}
				
			this.toString = function()
			{
				return '[object Bounds top="' +this.top+ '" right="' +this.right+ '" bottom="' +this.bottom+ '" left="' +this.left+ '"]';
			}
		}
		
		xjsfl.classes.register('Bounds', Bounds);
		
