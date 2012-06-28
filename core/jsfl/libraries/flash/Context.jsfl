// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████              ██                ██
//  ██                  ██                ██
//  ██     █████ █████ █████ █████ ██ ██ █████
//  ██     ██ ██ ██ ██  ██   ██ ██ ██ ██  ██
//  ██     ██ ██ ██ ██  ██   █████  ███   ██
//  ██     ██ ██ ██ ██  ██   ██    ██ ██  ██
//  ██████ █████ ██ ██  ████ █████ ██ ██  ████
//
// ------------------------------------------------------------------------------------------------------------------------
// Context

	/**
	 * Context
	 * @overview	Provides a convenient access to the major DOM elements
	 * @instance	context
	 */

	xjsfl.init(this, ['File', 'URI', 'Utils']);
		
	// --------------------------------------------------------------------------------
	// Constructor

		/**
		 * Context object supplies the "this" context for all iterative operations' callbacks
		 *
		 * @param	{Context}			dom			A Context object with a valid dom property
		 * @param	{Boolean}			dom			Pass true to grab the current Document DOM
 		 * @param	{Number}			dom			The 0-based index of the Document
		 * @param	{String}			dom			The name of the Document
		 * @param	{File}				dom			A valid .fla file
		 * @param	{Document}			dom			A Document
		 *
		 * @param	{Context}			timeline	A Context object with a valid timeline property
		 * @param	{Boolean}			timeline	Pass true to grab the current timeline
		 * @param	{String}			timeline	The name of (path to) an item in the library
		 * @param	{Number}			timeline	The 0-based index of an item in the library
		 * @param	{SymbolInstance}	timeline	A Symbol Instance
		 * @param	{SymbolItem}		timeline	A SymbolItem
		 * @param	{Timeline}			timeline	A Symbol Item's timeline reference
		 *
		 * @param	{Context}			layer		A Context object with a valid layer property
		 * @param	{Boolean}			layer		Pass true to grab the current layer
		 * @param	{String}			layer		The name of the layer
		 * @param	{Number}			layer		The 0-based index of the layer
		 * @param	{Layer}				layer		A Layer
		 *
		 * @param	{Context}			frame		A Context object with a valid frame property
		 * @param	{Boolean}			frame		Pass true to grab the current frame
		 * @param	{String}			frame		The name of the frame
		 * @param	{Number}			frame		The 0-based index of the frame
		 * @param	{RegExp}			frame		The keyframe index of the frame, i.e. /2/
		 * @param	{Frame}				frame		A Frame
		 *
		 * @param	{Context}			element		A Context object with a valid element property
		 * @param	{String}			element		The name of the element
		 * @param	{Number}			element		The 0-based index of the element
		 * @param	{Element}			element		An element
		 */
		Context = function(dom, timeline, layer, frame, element)
		{
			if(dom)this.setDOM(dom);
			if(this.dom)
			{
				if(timeline)this.setTimeline(timeline);
				if(this.timeline)
				{
					if(layer)this.setLayer(layer);
					if(this.layer && this.layer.layerType !== 'folder')
					{
						this.setFrame(frame);
						if(this.frame)
						{
							if(element)this.setElement(element);
						}
					}
				}
			}
			return this;
		}

	// --------------------------------------------------------------------------------
	// # Static methods

		//TODO consider modifying Context.create() to just take a single argument
		// That way you pass in any object, and the context is worked out automatically

		/**
		 * Factory method provides the quickest way to get the current context
		 * @param	{Boolean}	dom			An optional flag to not create a dom context
		 * @param	{Boolean}	timeline	An optional flag to not create a timeline context
		 * @param	{Boolean}	layer		An optional flag to not create a layer context
		 * @param	{Boolean}	frame		An optional flag to not create a frame context
		 * @returns	{Context}				A new Context instance
		 */
		Context.create = function(dom, timeline, layer, frame, element)
		{
			// create a new context
				var context = new Context
				(
					dom === false ? false : true,
					timeline === false ? false : true,
					layer === false ? false : true,
					frame === false ? false : true,
					element === false ? false : true
				);

			// update the stage & return
				if(context.dom)
				{
					context.dom.livePreview = true;
				}
				return context;
		}

		/**
		 * Creates a context from a supplied element
		 * @param	value
		 * @returns
		 */
		Context.from = function(value)
		{

			//TODO Create context using shorthand string
			Context.create('file:///c|path/to.fla>path/to/item~layer name@frame number or name:element name');

			Context.create('file:///c|path/to.fla');
			Context.create('/path/to/item');
			Context.create('~layer name or index');
			Context.create('~[layer name,layer name,layer name,layer name]');
			Context.create('@frame number or name');
			Context.create('element name');
			Context.create(URI.toURI());

			switch(Utils.getClass(value))
			{

			}
		}

	// --------------------------------------------------------------------------------
	// Prototype

		Context.prototype =
		{
			// --------------------------------------------------------------------------------
			// # Properties

			//TODO add layers and frames properties on timeline and layer changes

				/**
				 * @type {Document}	A Document Object
				 */
				dom:null,

				/**
				 * @type {Item}		A Library Item
				 */
				item:null,

				/**
				 * @type {Timeline}	A Timeline
				 */
				timeline:null,

				/**
				 * @type {Layer}	A Layer
				 */
				layer:null,

				/**
				 * The layer's keyframes
				 * Using a getter here, not setting them when the layer context changes, in case keyframes are added or deleted in between
				 * @type {Array}
				 */
				get keyframes()
				{
					if(this.layer)
					{
						var index		= 0;
						var keyIndex	= 0;
						var keyframes	= [];
						while(index < this.layer.frameCount)
						{
							if(this.layer.frames[index].startFrame === index)
							{
								keyframes[keyIndex++] = this.layer.frames[index];
							}
							index++;
						}
						return keyframes;
					}
					return [];
				},

				/**
				 * @type {Frame}	A Frame
				 */
				frame:null,

				/**
				 * @type {Element}	An element
				 */
				element:null,

			// --------------------------------------------------------------------------------
			// getters

				/**
				 * @type {String}
				 */
				context:'',

				/**
				 * The current layer index
				 * @type {Number}
				 */
				get layerIndex()
				{
					if(this.timeline && this.layer)
					{
						var name			= this.layer.name;
						this.layer.name		= '__Context__';
						var index			= this.timeline.findLayerIndex(this.layer.name)[0];
						this.layer.name		= name;
						return index;
					}
					else
					{
						return -1;
					}
				},

			// --------------------------------------------------------------------------------
			// # Setter methods

				/**
				 * Set the DOM of the Context object
				 * @param	{Context}	value	A Context object with a valid dom property
				 * @param	{Boolean}	value	Pass true to grab the current Document DOM
				 * @param	{Number}	value	The 0-based index of an open Document
				 * @param	{String}	value	The name of an open Document, or the path or URI to an existing .fla file
				 * @param	{File}		value	An existing .fla file
				 * @param	{Document}	value	A Document
				 * @returns	{Context}			Itself
				 */
				setDOM:function(value)
				{
					// variables
						var dom;

					// true
						if(value === true || value === undefined)
						{
							dom = fl.getDocumentDOM();
						}
					// Document
						else if(value instanceof Document)
						{
							dom = value;
						}
					// Document index
						else if(typeof value === 'number')
						{
							dom = fl.documents[value];
						}
					// Document name
						if(typeof value === 'string')
						{
							if(/\.fla$/.test(value))
							{
								return(this.setDOM(new File(value)));
							}
							else
							{
								dom = fl.documents.filter(function(e){ return e.name == value; })[0];
							}
						}
					// File
						else if(value instanceof File)
						{
							if(value.exists)
							{
								dom = fl.documents.filter(function(doc){ return doc.pathURI == value.uri; })[0]
								if(dom == undefined)
								{
									dom = fl.openDocument(value.uri);
								}
							}
						}
					// Context
						else if(value instanceof Context)
						{
							dom = value.dom;
						}
					// context
						if(dom)
						{
							// nullify related elements if timeline changes
								if(this.dom != dom)
								{
									this.item		= null;
									this.timeline	= null;
									this.layer		= null;
									this.frame		= null;
								}
							// properties
								this.context	= 'dom';
								this.dom		= dom;
						}
					// return
						return this;
				},


				/**
				 * Set the Timeline of the Context object
				 * @param	{Context}			value	A Context object with a valid timeline property
				 * @param	{Boolean}			value	Pass true to grab the current timeline
				 * @param	{String}			value	The name of (path to) an item in the library
				 * @param	{Number}			value	The 0-based Scene index
				 * @param	{SymbolItem}		value	A SymbolItem
				 * @param	{SymbolInstance}	value	A Symbol Instance
				 * @param	{Timeline}			value	A Symbol's timeline reference
				 * @param	{null}				value	The document root
				 * @returns	{Context}					Itself
				 */
				setTimeline:function(value)
				{
					// exit early if no dom for some data types
						var state = value instanceof Timeline || value === true || value === undefined || typeof value === 'string' || typeof value === 'number' || value === null;
						if(state && ! this.dom )
						{
							this.setDOM(true);
							//throw new ReferenceError('ReferenceError: Cannot set Timeline as Context has no DOM');
							//return this;
						}

					// variables
						var timeline, item;

					// Timeline or true
						if(value instanceof Timeline || value === true || value === undefined)
						{
							timeline = value === true ? this.dom.getTimeline() : value;
							for each(var _item in this.dom.library.items)
							{
								if(_item instanceof SymbolItem && _item.timeline === timeline)
								{
									item = _item;
									break;
								}
							}
						}
					// Library item
						else if(value instanceof SymbolItem)
						{
							item		= value;
							timeline	= item.timeline;
						}
					// Stage instace
						else if(value instanceof SymbolInstance)
						{
							item		= value.libraryItem;
							timeline	= item.timeline;
						}
					// Context
						else if(value instanceof Context)
						{
							item		= value.item;
							timeline	= value.timeline;
						}
					// Library item path
						else if(typeof value == 'string')
						{
							var index = parseInt(this.dom.library.findItemIndex(value));
							if( ! isNaN(index))
							{
								item		= this.dom.library.items[index];
								timeline	= this.item.timeline;
							}
						}
					// Scene index (set null or 0 for document root)
						else if(typeof value === 'number' || value === null)
						{
							value = Number(value);
							item = value >= 0 && value < this.dom.timelines.length ? value : undefined;
							if(item != undefined)
							{
								timeline	= this.dom.timelines[value];
							}
						}

					// context
						if(timeline)
						{
							// nullify related elements if timeline changes
								if(this.timeline != timeline)
								{
									this.layer		= null;
									this.frame		= null;
								}

							// properties
								this.item		= item;
								this.timeline	= timeline;
								this.context	= 'timeline';
						}
					// return
						return this;
				},

				/**
				 * Set the Layer of the Context object
				 * @param	{Context}	value	A Context object with a valid layer property
				 * @param	{Boolean}	value	Pass true to grab the current layer
				 * @param	{String}	value	The name of the layer
				 * @param	{Number}	value	The 0-based index of the layer
				 * @param	{Layer}		value	A Layer
				 * @returns	{Context}			Itself
				 */
				setLayer:function(value)
				{
					// exit early if no timeline
						var state = value === true || value === undefined || typeof value === 'string' || typeof value === 'number' || value === null;
						if(state && ! this.timeline )
						{
							this.setTimeline(true);
							//throw new ReferenceError('ReferenceError: Cannot set Layer as Context has no Timeline');
							//return this;
						}

					// variables
						var layer;

					// true
						if(value === true || value === undefined)
						{
							layer = this.timeline.layers[this.timeline.currentLayer];
							//this.layerIndex = this.timeline.currentLayer;
						}
					// Layer index or Layer name
						if(typeof value === 'string' || typeof value === 'number')
						{
							// variables
								var _layer;
								var index	= typeof value === 'string' ? this.timeline.findLayerIndex(value): value;
								if(index !== undefined)
								{
									_layer	= this.timeline.layers[index];
								}

							// grab layer
								if(_layer)
								{
									layer		= _layer;
									//this.layerIndex	= index;
								}
								else
								{
									throw new ReferenceError('ReferenceError: "' +value+ '" is not a valid layer in Context.setLayer()');
								}
						}
					// Layer
						else if(value instanceof Layer)
						{
							layer		= value;
							//this.layerIndex	= Number(this.timeline.findLayerIndex(value)) || -1;
						}
					// Context
						else if(value instanceof Context)
						{
							layer		= value.layer;
							//this.layerIndex = value.layerIndex;
						}

					// context
						if(layer)
						{
							// nullify related elements if timeline changes
								if(this.layer != layer)
								{
									this.frame	= null;
								}

							// properties
								this.layer		= layer;
								this.context	= 'layer';
						}

					// return
						return this;
				},

				/**
				 * Set the Frame of the Context object
				 * @param	{Context}	value		A Context object with a valid frame property
				 * @param	{Boolean}	value		Pass true to grab the current frame
				 * @param	{String}	value		The name of the frame
				 * @param	{Number}	value		The 0-based index of the frame
				 * @param	{RegExp}	value		A numeric RegExp indicating the keyframe index, i.e. /2/
				 * @param	{Frame}		value		A Frame
				 * @param	{Boolean}	allLayers	Optionally search all layers, when specifying a named frame
				 * @returns	{Context}				Itself
				 */
				setFrame:function(value)
				{
					// exit early if no layer
						if( ! this.layer )
						{
							throw new ReferenceError('ReferenceError: Cannot set Frame as Context has no Layer');
							return this;
						}

					// variables
						var frame;

					// Frame index
						if(typeof value === 'number')
						{
							if(value >= 0 && value < this.layer.frameCount)
							{
								frame = this.layer.frames[value];
							}
						}
					// true
						else if(value === true || value === undefined)
						{
							frame = this.layer.frames[this.timeline.currentFrame];
						}
					// Frame
						else if(value instanceof Frame)
						{
							frame = value;
						}
					// Keyframe index (RegExp, i.e. /2/)
						else if(value instanceof RegExp)
						{
							var keyframeIndex = parseInt(value.toSource().substr(1));
							frame = this.keyframes[keyframeIndex];
						}
					// Context
						else if(value instanceof Context)
						{
							frame = value.frame;
						}
					// Frame name - search all layers and frames
						else if(typeof value === 'string')
						{
							var _layer, _frame;
							for(var i = 0; i < this.timeline.layers.length; i++)
							{
								_layer = this.timeline.layers[i];
								for(var j = 0; j < _layer.frames.length; j++)
								{
									_frame = _layer.frames[j];
									if(_frame.name === value)
									{
										this.layer	= _layer;
										frame		= _frame;
										break;
									}
								}
								if(frame)
								{
									break;
								}
							}
						}

					// context
						if(frame)
						{
							this.frame		= frame;
							this.context	= 'frame';
						}
					// return
						return this;
				},

				/**
				 * Set the Keyframe of the Context object
				 * @param	{Number}		keyframeIndex	The 0-based index of the keyframe you want to target (i.e. passing 1 would select the 2nd keyframe, which might be on frame 12)
				 * @param	{Context}		layer			A Context object with a valid layer property
				 * @param	{Boolean}		layer			Pass true to grab the current layer
				 * @param	{String}		layer			The name of the layer
				 * @param	{Number}		layer			The 0-based index of the layer
				 * @param	{Layer}			layer			A Layer
				 * @returns	{Context}						Itself
				 */
				setKeyframe:function(keyframeIndex, layer)
				{
					// update the layer, if supplied
						if(layer)
						{
							this.setLayer(layer);
						}

					// exit early if no timeline
						if( ! this.timeline )
						{
							throw new ReferenceError('ReferenceError: Cannot set Keyframe as Context has no Timeline');
							return this;
						}

					// find the keyframe
						var keyframe = this.keyframes[keyframeIndex];
						if(keyframe)
						{
							this.setFrame(keyframe);
						}

					// return
						return this;
				},

				/**
				 * Set the Element of the Context object
				 * @param	{Context}		value	A Context object with a valid element property
				 * @param	{Boolean}		value	Pass true to grab the first element
				 * @param	{String}		value	The name of the element
				 * @param	{Number}		value	The 0-based index of the element
				 * @param	{Element}		value	An element
				 * @returns	{Context}				Itself
				 */
				setElement:function(value)
				{
					// exit early if no frame
						if( ! this.frame )
						{
							trace(this)
							throw new ReferenceError('ReferenceError: Cannot set Element as Context has no Frame');
							return this;
						}

					// Element
						if(value instanceof Element)
						{
							if(this.frame.elements.indexOf(value) != -1)
							{
								this.element = value;
							}
						}

					// Boolean
						else if(value === true)
						{
							this.element = this.frame.elements[0];
						}

					// Element index
						else if(typeof value === 'number')
						{
							this.element = this.frame.elements[value];
						}

					// Element name
						if(typeof value === 'string')
						{
							var i = 0;
							this.element = null;
							while(i < this.frame.elements.length)
							{
								if(this.frame.elements[i]['name'] == value)
								{
									this.element = this.frame.elements[i];
									break;
								}
							}
						}

					// context
						if(this.element)
						{
							this.context = 'element';
						}
					// return
						return this;
				},

			// --------------------------------------------------------------------------------
			// # State methods

				/**
				 * Updates the timeline playhead to the correct frame
				 * @returns	{Context}					Itself
				 */
				goto:function()
				{
					// current context
						var dom			= fl.getDocumentDOM();
						var timeline	= dom.getTimeline();

					// debug
						//trace('');

					// document
						if(dom != this.dom)
						{
							//trace('Changing DOM: ' + this.dom.name)
							fl.setActiveWindow(this.dom);
						}

					// check timeline
						if(this.timeline != undefined)
						{
							// change timelines
								if(timeline != this.timeline)
								{
									if(typeof this.item === 'number')
									{
										//trace('Changing Scene: ' + this.timeline.name)
										this.dom.editScene(this.item);
									}
									else
									{
										//trace('Changing Item: ' + this.item.name)
										this.item ? this.dom.library.editItem(this.item.name) : this.dom.editScene(0);
									}
								}

							// layer and frame
								if(this.layer)
								{
									// go
										this.timeline.currentLayer = this.layerIndex;

									// frame
										if(this.frame)
										{
											//trace('Changing Frame: ' + this.frame.startFrame)
											this.timeline.currentFrame = this.frame.startFrame;
										}
								}
						}

					// return
						return this;

				},


				/**
				 * Updates all parameters of the Context Object with the current IDE state
				 * @param	{Boolean}	dom			An optional flag to not update the dom context
				 * @param	{Boolean}	timeline	An optional flag to not update the timeline context
				 * @param	{Boolean}	layer		An optional flag to not update the layer context
				 * @param	{Boolean}	frame		An optional flag to not update the frame context
				 * @returns	{Context}				Itself
				 */
				update:function(dom, timeline, layer, frame)
				{
					if(dom !== false)
						this.setDOM(true);
					if(timeline !== false)
						this.setTimeline(true);
					if(layer !== false)
						this.setLayer(true);
					if(frame !== false)
						this.setFrame(true);
					//if(element !== false)
					//	this.setElement(true);
					//Context.apply(this, [true, true, true, true, 0]);
				},



			// --------------------------------------------------------------------------------
			// # Selection methods

				/**
				 * Select the current context of the Context object
				 * @returns	{Context}			Itself
				 */
				select:function()
				{
					this.goto();

					switch(this.context)
					{
						case 'layer':		this.selectLayer.apply(this, arguments);	break;
						case 'frame':		this.selectFrame.apply(this, arguments);	break;
						case 'keyframe':	this.selectFrame.apply(this, arguments);	break;
						case 'element':		this.selectElement.apply(this, arguments);	break;
					}

					return this;
				},

				/**
				 * Select the current Layer of the Context object
				 * @param	{Boolean}	addToSelection	An optional Boolean to add to, rather than replace the current layer selection
				 * @returns	{Context}					Itself
				 */
				selectLayer:function(addToSelection)
				{
					//BUG Flash's select layers appears to toggle, not add to already selected layers
					//TODO Work out a decent workaround for already selected layers

					/*
					 * The following code is a WIP!
					 */

					if(this.timeline && this.layer)
					{
						// set the current frame
							var currentFrame	= this.timeline.currentFrame;

						// if null is passed in as the only argument, deselect everything
							if(addToSelection === null)
							{
								// variables
									var currentLayer		= this.timeline.currentLayer;

								// deselect - HACK: bReplace is actually a toggle, so we need to check the toggled state
									this.timeline.currentLayer = 0;
									this.timeline.setSelectedFrames(0, 0);
									if(this.timeline.getSelectedFrames().length > 0)
									{
										this.timeline.setSelectedFrames(0, 0, false);
									}

								// reset current layer and frame
									this.timeline.currentLayer	= currentLayer;
							}
						// otherwise, select layers - need to select layers using frames, or else layer-togglng might occur
							else
							{
								// variables
									var layerIndex = this.layerIndex;

								// do the selection if the later index is valid
									if(layerIndex != -1)
									{
										if(addToSelection)
										{
											// if adding, don't toggle currently selected layers!
												var selectedLayers	= this.timeline.getSelectedLayers();


												trace('selectedLayers 2:' + selectedLayers)
												if(selectedLayers.indexOf(layerIndex) == -1)
												{
													trace('Selecting > ' + layerIndex)
													this.timeline.setSelectedLayers(layerIndex, false);
												}
												else
												{
													trace('NOT Selecting > ' + layerIndex)
													var selectedFrames	= this.timeline.getSelectedFrames();
													if(selectedFrames[0] == 0 && selectedFrames[1] == 0)
													{
														trace('OK, SELECTING!')
														this.timeline.setSelectedLayers(layerIndex, true);
													}
													trace('Sel frames > ' + this.timeline.getSelectedFrames())
												}
										}
										else
										{
											this.timeline.setSelectedLayers(layerIndex, true);
										}
										/*
										*/
										//trace(this.layerIndex, 0, this.layer.frameCount)
										//this.timeline.currentLayer = this.layerIndex;
										//this.timeline.setSelectedFrames(0, this.layer.frameCount, ! addToSelection);
									}
							}
						// reset the current frame
							this.timeline.currentFrame	= currentFrame;
					}
					return this;
				},

				/**
				 * Select the current Frame of the Context object
				 * @param	{Boolean}	addToSelection	An optional Boolean to add to, rather than replace the current frame selection
				 * @returns	{Context}					Itself
				 */
				selectFrame:function(addToSelection)
				{
					if(this.timeline && this.layer && this.frame)
					{
						// if null is passed in as the only argument, deselect everything
							if(addToSelection === null)
							{
								this.timeline.setSelectedFrames(0,0);
							}
						// otherwise, select frames
							else
							{
								var layerIndex	= Number(this.timeline.findLayerIndex(this.layer.name) || -1);
								if(layerIndex != -1)
								{
									this.timeline.currentLayer = layerIndex;
									this.timeline.setSelectedFrames(this.frame.startFrame, this.frame.startFrame + this.frame.duration, ! addToSelection);
									this.timeline.currentFrame = this.frame.startFrame;
								}
							}
					}
					return this;
				},

				/**
				 * Selects the current element, if there is one
				 * @param	{Boolean}	addToSelection	An optional Boolean to add to, rather than replace the current element selection
				 * @returns	{Context}					Itself
				 */
				selectElement:function(addToSelection)
				{
					if(this.element)
					{
						if( ! addToSelection)
						{
							this.dom.selectNone();
						}
						this.dom.selection = [this.element];
					}
					return this;
				},

			// --------------------------------------------------------------------------------
			// # Utility methods

				/**
				 * Returns a copy of the Context object
				 * @returns	{Context}	A new Context instance
				 */
				clone:function()
				{
					return new Context(this.dom, this.timeline, this.layer, this.frame);
				},

				/**
				 * Return a String representation of the Context object
				 * @returns	{String}		The String representation of the Conext object
				 */
				toString:function()
				{
					var str = '[object Context';
					if(this.dom)
						str += ' dom="' +this.dom.name+ '"';
					if(this.timeline)
						str += ' timeline="' + (this.timeline.name) + '"';
					if(this.layer)
						str += ' layer[' +this.layerIndex+ ']="' +this.layer.name+ '"';
					if(this.frame)
					{
						var index	= this.keyframes.indexOf(this.frame);
						str += ' keyframe[' +index+ ']=' +this.frame.startFrame;
					}
					if(this.element)
					{
						var name = '';
						if(this.element.name)
						{
							name = '"' +this.element.name+ '"';
						}
						else
						{
							if(this.element.elementType == 'instance')
							{
								name = '<unnamed ' +this.element.elementType+ '>';
							}
							else
							{
								name = '<' +this.element.elementType+ '>';
							}
						}
						str += ' element="' +name+ '"';
					}
					/*
					*/
					return str + ']'
				}
		}

	// ------------------------------------------------------------------------------------------------
	// Static methods

		Context.toString = function()
		{
			return '[class Context]';
		}

	// --------------------------------------------------------------------------------
	// Register class

		xjsfl.classes.register('Context', Context);