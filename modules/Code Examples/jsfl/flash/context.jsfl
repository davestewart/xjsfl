// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code

	/**
	 * Context examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();

	// -----------------------------------------------------------------------------------------------------------------------------------------
	// functions
	
		/**
		 * Create a default Context
		 */
		function contextCreate()
		{
			var context = Context.create();
			trace(context);
		}
	
		/**
		 * Create a context, then change one element
		 */
		function contextUpdate()
		{
			var context = Context
							.create()
							.setLayer(2);
			trace(context);
		}
	
		/**
		 * Create a context, then clone it change one element
		 */
		function contextClone()
		{
			var context = Context
							.create()
							.clone()
							.setKeyframe(2, 'Layer 5')
							.selectFrame();
			trace(context);
		}
	
		/**
		 * Change contexts
		 */
		function contextCreateMultiple()
		{
			
			// --------------------------------------------------------------------------------
			// contexts
			
				// file
					var file		= new File('file:///E|/05%20-%20Commercial%20Projects/xJSFL/3%20-%20development/dev/JSFL/assets/fla/frames%20and%20shapes.fla');
				
				// create Contexts
					var contexts =
					[
						new Context(0, 'folder/static text', 'Layer 2', 2),
						new Context(0, 'folder/static text', 'Layer 3', /2/),
						new Context(0, 'folder/dynamic text', 0, 4),
						new Context(file, 0, 'Layer 4', /1/),
						new Context(file, 1, 0, 0),
						new Context(file, 'oval', 0, 0)
					];
					
				// debug
					Output.list(contexts);
				
			// --------------------------------------------------------------------------------
			// callback function to switch contexts
			
				/**
				 * @param	event	{XULEvent}
				 */
				function updateContext(event)
				{
					var index	= parseInt(event.control.id.substr(6,1));
					var context	= contexts[index];
					trace(context);
					context.goto();
				}
				
			// --------------------------------------------------------------------------------
			// UI
			
				// setup
					var xul	= XUL.factory();
					var i	= 0;
					
				// add buttons
					for each(var context in contexts)
					{
						var id		= 'button' + (i++);
						var label	= context.toString().substr(21).replace(/\s*\]$/, '').replace(/\s*\S*=|"/g, '~').replace(/~+$/, '').replace(/~+/g, ' > ');
						xul
							.addButton(label, id)
							.addEvent(id, 'command', updateContext);
					}
					
				// finish
					xul
						.addButton('Clear', 'clear', null, {command:fl.outputPanel.clear})
						.show();
		}
		
		/**
		 * Performance test
		 */
		function contextBenchmark()
		{
			// Context create
				Timer.start('10000 iterations of Context.create()');
				var context;
				for(var i = 0; i < 10000; i++)
				{
					context = Context.create();
				}
				Timer.stop();
				trace(context + '\n');
			
			// Context update
				Timer.start('10000 iterations of Context.update()');
				var context = Context.create();
				for(var i = 0; i < 10000; i++)
				{
					context.update();
				}
				Timer.stop();
				trace(context + '\n');
			
			// Context clone
				Timer.start('10000 iterations of Context.clone()');
				var clone, context = Context.create();
				for(var i = 0; i < 10000; i++)
				{
					clone = context.clone();
				}
				Timer.stop();
				trace(clone + '\n');
		}
	
		/**
		 * Select a layer
		 */
		function contextSelectLayer()
		{
			var context = new Context(true,true,true,true);
			context
				.selectLayer();
			trace(context);
		}
	
		/**
		 * Select an element
		 */
		function contextSelectElement()
		{
			var context = Context.create();
			context
				.select(true); // element is the last context in Context, after Context.create() has run
			trace(context);
		}
	
		/**
		 * Select a keyframe
		 */
		function contextSelectKeyframe()
		{
			var context = Context.create();
			context
				.setLayer(2)
				.setKeyframe(1)
				.select();
			trace(context);
		}
	
		/**
		 * Process a layer's keyframes
		 */
		function contextProcessKeyframe()
		{
			//TODO check that frame selection isn't suffering the same toggle bug that layers are
			var context		= Context.create();
			var keyframes	= context.keyframes;
			for(var k in keyframes)
			{
				context.setFrame(keyframes[k]).select();
				context.frame.name = 'Frame ' + k;
				alert('Keyframe ' +k+ ' selected: ' + context);
			}
		}
	
		/**
		 * Select multiple layers
		 */
		function contextSelectLayers()
		{
			var timeline = dom.getTimeline();
			for each(var index in [0,1,2,3,4,5,6])
			{
				timeline.setSelectedLayers(index, false)
			}
		}
	
		/**
		 * Select multiple layers - BUG TESTING!
		 */
		function contextSelectLayers2()
		{
			var context = Context.create();
			context.selectLayer(null);
			//for each(var index in [1,3,5])
			//for each(var index in [0])
			for each(var index in [0,0,2,4,6]) // selecting the same layer twice seems to deselect it
			{
				context.setLayer(index);
				trace(context.keyframes)
				context.selectLayer(true);
				trace(context);
			}
		}
		//dom.getTimeline().setSelectedLayers(1, 0)
	
		/**
		 * Select every other layer
		 */
		function contextSelectAlternateLayers()
		{
			var context = Context.create();
			for(var i = 0; i < context.timeline.layerCount; i+=2)
			{
				context.setLayer(i).select(true)
				trace(context)
			}
		}
		