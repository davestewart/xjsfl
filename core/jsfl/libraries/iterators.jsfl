// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██                     ██                    
//  ██  ██                     ██                    
//  ██ █████ █████ ████ █████ █████ █████ ████ █████ 
//  ██  ██   ██ ██ ██      ██  ██   ██ ██ ██   ██    
//  ██  ██   █████ ██   █████  ██   ██ ██ ██   █████ 
//  ██  ██   ██    ██   ██ ██  ██   ██ ██ ██      ██ 
//  ██  ████ █████ ██   █████  ████ █████ ██   █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Iterators - Iterate thorugh documents, items, timelines, layers, frames and elements
	
	//TODO Create global find() method
	/*
		Iterates through every item, layer, frame, element, and in the callback
		add the context to the a global array. Then afterwards, the user can jump
		to each object with contexts[i].goto();
	*/
	
	Iterators =
	{
		/**
		 * Iterates through an array of Document Items, optionally processing each one with a callback, and optionally processing each of its layers with a callback
		 * 
		 * @param	documents		{Boolean}		Pass true to use all documents
		 * @param	documents		{null}			Pass null to use all documents
		 * @param	documents		{Array}			An optional Array of Document objects
		 * @param	itemCallback	{Function}		An optional callback of the format function(item, index, items)
		 * @param	layerCallback	{Function}		An optional callback of the format function(layer, index, layers)
		 * @param	frameCallback	{Function}		An optional callback of the format function(frame, index, frames)
		 * @param	elementCallback	{Function}		An optional callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		documents:function(documents, documentCallback, itemCallback, layerCallback, frameCallback, elementCallback)
		{
			// create a Context object that callbacks can reference
				if(documents == null || documents === true)
				{
					documents = fl.documents;
				}
				
			// iterate
				for(var i = 0; i < documents.length; i++)
				{
					// debug
						//trace('Document:' + i);
						
						// TODO Should the DOM iterator swap the active window, or should the callback handle this?
						
					// context
						var context = new Context(documents[i]);
						
					// callback
						if(documentCallback instanceof Function)
						{
							var result =  documentCallback(documents[i], i, documents, context);
							if(result === true)return true;
							if(result === false)continue
						}
						
					// layers
						if((itemCallback || layerCallback || frameCallback || elementCallback))
						{
							if(this.items(context, itemCallback, layerCallback, frameCallback, elementCallback) === true)
							{
								return true;
							}
						}
				}
				return false;			
		},
		
		/**
		 * Iterates through an array of Symbol or Library Items, optionally processing each one with a callback, and optionally processing each of its layers with a callback
		 * 
		 * @param	context			{Array}			An Array of Symbol Items or Instances
		 * @param	context			{Context}		A Context object, with a valid dom reference
		 * @param	itemCallback	{Function}		An optional callback of the format function(item, index, items)
		 * @param	layerCallback	{Function}		An optional callback of the format function(layer, index, layers)
		 * @param	frameCallback	{Function}		An optional callback of the format function(frame, index, frames)
		 * @param	elementCallback	{Function}		An optional callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		items:function(context, itemCallback, layerCallback, frameCallback, elementCallback)
		{
			//TODO	instead of callbacks, allow any valid context arguments to be sent through
			/*
			 	Then the function can skip the loop and go straight to that context
			 	i.e. xjsf.iterators.items(true, true, 'actionscript', addStopFrame)
			 	
			 	So true would skip the callback and just iterate, but 'actionscript'
			 	would only process the actionscript layer
			 	
			*/
			//TODO Document callback returns
			/*
				false	  - to skip current iteration
				true	  - to stop all processing
				undefined - do nothing
			*/
			
			// variables
				var items;
				
			// create a Context object that callbacks can reference
				if(context != null)
				{
					if(context instanceof Context && context.dom)
					{
						context = context.clone();
						items	= context.dom.library.items;
						// sort
						xjsfl.utils.sortOn(items);
					}
					else if(context instanceof Array)
					{
						items	= context;
						context	= Context.create(true, false, false, false);
					}
				}
				else
				{
					context	= Context.create(true, false, false, false);
					items	= context.dom.library.items;
				}
				
			// final check for items
				if( ! items )
				{
					throw new TypeError('xjsfl.iterators.items(): context param expects an Array or Context object');
				}

			// iterate
				for(var i = 0; i < items.length; i++)
				{
					// debug
						//trace('Item:' + i);
						
					// skip if item doens't have a timeline
						if( ! items[i]['timeline'] )
							continue

					// context
						context = context.setTimeline(items[i]);
						
					// callback
						if(itemCallback instanceof Function)
						{
							var result =  itemCallback(items[i], i, items, context.clone());
							if(result === true)return true;
							if(result === false)continue
						}
						
					// layers
						if(items[i]['timeline'] && (layerCallback || frameCallback || elementCallback))
						{
							if(this.layers(context, layerCallback, frameCallback, elementCallback) === true)
							{
								return true;
							}
						}
				}
				return false;			
		},
		
		/**
		 * Iterates through a timeline's layers, optionally processing each one with a callback, and optionally processing each of its frames with a callback
		 * 
		 * @param	context			{SymbolInstance}A SymbolItem object
		 * @param	context			{SymbolItem}	A SymbolInstance object
		 * @param	context			{Array}			An Array of layers
		 * @param	context			{Context}		A Context object, with a valid item reference
		 * @param	layerCallback	{Function}		An optional callback of the format function(layer, index, layers)
		 * @param	frameCallback	{Function}		An optional callback of the format function(frame, index, frames)
		 * @param	elementCallback	{Function}		An optional callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		layers:function(context, layerCallback, frameCallback, elementCallback)
		{
			// create a Context object that callbacks can reference
				if(context instanceof Context && context.timeline)
				{
					context = context.clone();
				}
				else
				{
					context = Context.create(false, context, false, false);
				}
				
			// if a timeline was found, process its layers
				if(context.timeline)
				{
					//Output.inspect(context, 'Context')
					
					for(var i = 0; i < context.timeline.layers.length; i++)
					{
						// debug
							//trace('Layer:' + i)
							
						// set context
							context.setLayer(i);
							
						// callback
							if(layerCallback instanceof Function)
							{
								var result =  layerCallback(context.timeline.layers[i], i, context.timeline, context.clone());
								if(result === true)return true;
								if(result === false)continue
							}
							
						// frames
							if(frameCallback || elementCallback)
							{
								if(this.frames(context, frameCallback, elementCallback) === true)
								{
									return true;
								}
							}
					}
				}
				return false;			
		},
		
		/**
		 * Iterates through a Layer's frames, optionally processing each one with a callback, and optionally processing each of its elements with a callback
		 * 
		 * @param	context			{Layer}			A Layer
		 * @param	context			{Number}		A valid index of the current timeline
		 * @param	context			{String}		A valid layer name of the current timeline
		 * @param	context			{Context}		A Context object with a valid timeline reference
		 * @param	frameCallback	{Function}		An optional callback of the format function(frame, index, frames)
		 * @param	elementCallback	{Function}		An optional callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		frames:function(context, frameCallback, elementCallback)
		{
			// create a Context object that callbacks can reference
				if(context instanceof Context && context.layer)
				{
					context = context.clone();
				}
				else
				{
					context	= Context.create(false, false, context, false);
				}
				
			// if a layer object was found
				if(context.layer)
				{
					for(var i = 0; i < context.layer.frames.length; i++)
					{
						// debug
							//trace('Frame:' + i)
						
						// process keyframes only
							if(i == context.layer.frames[i].startFrame)
							{
								// context
									context.setFrame(i);
									
								// callback
									if(frameCallback instanceof Function)
									{
										var result =  frameCallback(context.layer.frames[i], i, context.layer, context.clone());
										if(result === true)return true;
										if(result === false)continue
									}
									
								// elements
									if(elementCallback)
									{
										if(this.elements(context, elementCallback) === true)
										{
											return true;
										}
									}
							}
							
					}
				}
				return false;			
		},
		
		/**
		 * Iterates through a frame's elements, processing each one with a callback
		 * 
		 * @param	context			{Frame}			A frame object in the current Timeline
		 * @param	context			{Context}		A Context object with a valid Frame reference
		 * @param	elementCallback	{Function}		A callback of the format function(element, index, elements)
		 * @returns					{Boolean}		true as soon as the callback returns true, if not false
		 */
		elements:function(context, elementCallback)
		{
			// create a Context object that callbacks can reference
				if(context instanceof Context && context.frame instanceof Frame)
				{
					context = context.clone();
				}
				else
				{
					context = Context.create(false, false, false, context);
				}
				
			// if a frame context exists
				if(context.frame)
				{
					for(var i = 0; i < context.frame.elements.length; i++)
					{
						// set context
							context.setElement(i);
							
						// callback
							// in case of deletes, use a custom frame callback which iterates in reverse, rather than this method: for(var i = context.frame.elements.length - 1; i >= 0 ; i--)
							if(elementCallback instanceof Function)
							{
								var result =  elementCallback(context.frame.elements[i], i, context.frame.elements, context);
								if(result === true)return true;
							}
					}
				}
				
			// done!
				return false;			
		}
	}
	
// register class
	xjsfl.classes.register('Iterators', Iterators);
