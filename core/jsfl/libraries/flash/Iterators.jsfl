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
// Iterators

	/**
	 * Iterators
	 * @overview	Iterate thorugh documents, items, timelines, layers, frames and elements
	 * @instance	Iterators
	 */

	xjsfl.init(this, ['Context', 'Utils']);
		
	/*
		Iterates through every item, layer, frame, element, and in the callback
		add the context to the a global array. Then afterwards, the user can jump
		to each object with contexts[i].goto();
	*/
	Iterators =
	{
		/**
		 * Iterates through Documents, and optionally Items, Layers, Frames and Elements, processing each one with a callback if supplied
		 *
		 * @param	{Boolean}		documents			Pass true to use all documents
		 * @param	{null}			documents			Pass null to use all documents
		 * @param	{Array}			documents			An optional Array of Document objects
		 * @param	{Function}		itemCallback		An optional callback of the format function(item, index, items, context)
		 * @param	{Function}		layerCallback		An optional callback of the format function(layer, index, layers, context)
		 * @param	{Function}		frameCallback		An optional callback of the format function(frame, index, frames, context)
		 * @param	{Function}		elementCallback		An optional callback of the format function(element, index, elements, context)
		 * @returns	{Boolean}							true as soon as the callback returns true, if not false
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
		 * Iterates through Symbol or Library Items, and optionally Layers, Frames and Elements, processing each one with a callback if supplied
		 *
		 * @param	{Array}			context				An Array of Symbol Items or Instances
		 * @param	{Context}		context				A Context object, with a valid dom reference
		 * @param	{Boolean}		context				All items in the current document
		 * @param	{null}			context				All items in the current document
		 * @param	{Function}		itemCallback		An optional callback of the format function(item, index, items, context)
		 * @param	{Function}		layerCallback		An optional callback of the format function(layer, index, layers, context)
		 * @param	{Function}		frameCallback		An optional callback of the format function(frame, index, frames, context)
		 * @param	{Function}		elementCallback		An optional callback of the format function(element, index, elements, context)
		 * @returns	{Boolean}							true as soon as the callback returns true, if not false
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

			// variables
				var items;

			// create a Context object that callbacks can reference
				if(context != null && context !== true)
				{
					if(context instanceof Context && context.dom)
					{
						context = context.clone();
						items	= context.dom.library.items;
						// sort
					}
					else if(context instanceof Array)
					{
						items	= context;
						context	= Context.create(true, false, false, false);
					}
				}
				else
				{
					context	= Context.create(true, false, false, false, false);
					items	= context.dom.library.items;
				}

			// final check for items
				if( ! items )
				{
					throw new TypeError('Iterators.items(): context param expects an Array or Context object');
				}

			// iterate
				Utils.sortOn(items);
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
						if(items[i]['timeline'] != null && (layerCallback || frameCallback || elementCallback))
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
		 * Iterates through a Timeline's layers, and optionally Frames and Elements, processing each one with a callback if supplied
		 *
		 * @param	{SymbolInstance}context				A SymbolItem object
		 * @param	{SymbolItem}	context				A SymbolInstance object
		 * @param	{Array}			context				An Array of layers
		 * @param	{Boolean}		context				Pass true to use the current timeline's layers
		 * @param	{Context}		context				A Context object, with a valid item reference
		 * @param	{Function}		layerCallback		An optional callback of the format function(layer, index, layers, context)
		 * @param	{Function}		frameCallback		An optional callback of the format function(frame, index, frames, context)
		 * @param	{Function}		elementCallback		An optional callback of the format function(element, index, elements, context)
		 * @returns	{Boolean}							true as soon as the callback returns true, if not false
		 */
		layers:function(context, layerCallback, frameCallback, elementCallback)
		{
			// create a Context object that callbacks can reference
				if(context instanceof Context && context.timeline)
				{
					//trace('> cloning existing context')
					context = context.clone();
				}
				else if(typeof context !== 'undefined')
				{
					//trace('> creating new context:' + context.name)
					//inspect(context, 1, 'Timeline')
					context = new Context(true, context, false, false, false);
					//inspect(context, 1, 'Context')
				}
				else
				{
					//trace(' > timeline - no timeline supplied');
					context = new Context(true, true, false, false, false);
				}
				
			// if a timeline was found, process its layers
				if(context.timeline)
				{
					// update function
						function update()
						{
							context.timeline.getSelectedLayers();
						}
						
					//inspect(context, 'Context')

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
								if(result === true)
								{
									update();
									return true;
								}
								if(result === false)continue
							}

						// frames
							if(frameCallback || elementCallback)
							{
								if(this.frames(context, frameCallback, elementCallback) === true)
								{
									update();
									return true;
								}
							}
					}
					update();
				}
				else
				{
					throw new ReferenceError('ReferenceError: Invalid Context supplied to Iterators.layers (no timeline)');;
				}
				return false;
		},

		/**
		 * Iterates through a Layer's Frames, and optionally Elements, processing each one with a callback if supplied
		 *
		 * @param	{Layer}			context				A Layer
		 * @param	{Number}		context				A valid index of the current timeline
		 * @param	{String}		context				A valid layer name of the current timeline
		 * @param	{Context}		context				A Context object with a valid timeline reference
		 * @param	{Function}		frameCallback		An optional callback of the format function(frame, index, frames, context)
		 * @param	{Function}		elementCallback		An optional callback of the format function(element, index, elements, context)
		 * @returns	{Boolean}							true as soon as the callback returns true, if not false
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
					context	= new Context(false, false, context, false, false);
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
				else
				{
					throw new ReferenceError('ReferenceError: Invalid Context supplied to Iterators.frames (no layer)');;
				}
				return false;
		},

		/**
		 * Iterates through a Frame's elements, processing each one with a callback if supplied
		 *
		 * @param	{Frame}			context				A frame object in the current Timeline
		 * @param	{Context}		context				A Context object with a valid Frame reference
		 * @param	{Function}		elementCallback		A callback of the format function(element, index, elements, context)
		 * @returns	{Boolean}							true as soon as the callback returns true, if not false
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
					context = new Context(false, false, false, context, false);
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
				else
				{
					throw new ReferenceError('ReferenceError: Invalid Context supplied to Iterators.elements (no frame)');;
				}

			// done!
				return false;
		},

		toString:function()
		{
			return '[class Iterators]';
		}
	}

// register class
	xjsfl.classes.register('Iterators', Iterators);
