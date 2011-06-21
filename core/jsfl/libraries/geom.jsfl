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
				var a = arguments;
			
			// switch
				switch(arguments.length)
				{
					// 0 arguments, use document ize
						case 0:
							var dom			= xjsfl.dom;
							this.left		= 0;
							this.top		= 0;
							this.right		= dom.width;
							this.bottom		= dom.height;
						break;
					
					// 1 argument - should be an element or a radius
						case 1:

						// Element (element bounds)
							if(a[0] instanceof Element || a[0] instanceof SymbolItem)
							{
								this.left		= a[0].left;
								this.top		= a[0].top;
								this.right		= a[0].left + a[0].width;
								this.bottom		= a[0].top + a[0].height;
							}
							
						// Number (radius)
							else if(typeof a[0] == 'number')
							{
								var value		= 
								this.left		= -a[0] / 2;
								this.top		= -a[0] / 2;
								this.right		= a[0] / 2;
								this.bottom		= a[0] / 2;
							}
							
						break;
					
					// width, height
						case 2:
							this.left		= 0;
							this.top		= 0;
							this.right		= a[0];
							this.bottom		= a[1];
						break;
					
					// left, top, width, height
						case 4:
							this.left		= a[0];
							this.top		= a[1];
							this.right		= a[0] + a[2];
							this.bottom		= a[1] + a[3];
						break;
				}
				
			this.toString = function()
			{
				return '[object Bounds top="' +this.top+ '" right="' +this.right+ '" bottom="' +this.bottom+ '" left="' +this.left+ '"]';
			}
		}
		
		xjsfl.classes.register('Bounds', Bounds);
		
// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.reload();
			clear();
			try
			{
		
		// --------------------------------------------------------------------------------
		// Bounds
		
			// create a document-sized rectangle
				if(0)
				{
					dom.addNewRectangle(new Bounds(), 0);
				}
				
			// create some ovals on the current frame
				if(0)
				{
					for(var i = 0; i < 200; i++)
					{
						var x = Math.random() * dom.width;
						var y = Math.random() * dom.height;
						var r = Math.random() * 50;
						dom.addNewOval(new Bounds(x, y, r, r));
					}
				}
		
			// create an element the same size as another element
				if(0)
				{
					// grab a context to reference items
						var context = Context.create();
					
					// draw rectangle
						context.dom.addNewRectangle(new Bounds(50, 50, 200, 100), 0);
						
					// create symbol
						context.dom.selection = Context.create().frame.elements;
						context.dom.convertToSymbol('movie clip', '', 'center');
						
					// get bounds
						var bounds = new Bounds(context.dom.selection.pop());
						
					// draw same-sized oval
						context.timeline.addNewLayer();
						context.dom.addNewOval(bounds);
				}
		
		// catch
			}catch(err){xjsfl.output.error(err);}
	}
		
