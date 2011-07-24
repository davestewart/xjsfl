// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                    ██         
//  ██                        ██         
//  ██     ██ ██ █████ █████ █████ █████ 
//  █████  ██ ██ ██ ██ ██ ██  ██   ██    
//  ██     ██ ██ █████ ██ ██  ██   █████ 
//  ██      ███  ██    ██ ██  ██      ██ 
//  ██████  ███  █████ ██ ██  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Events - OO events

	/*
	 * IMPORTANT - unexpected results with Frame callbacks
	 *
	 * The JSAPI appears to fire a frameChanged callback *before* it has updated the document current
	 * document / timeline properties, which results in Events reporting the wrong information.
	 *
	 * At the moment, I don't know how to solve this. I've experimented with lastParam properties,
	 * comparing the Date of the callback, firing events in order with pre and post handlers,
	 * attempting to force a document update by calling flash or document methods first...
	 *
	 * ...but so far every route has been a dead end. It may just be that it's not possible.
	 *
	 * The other bug bummer is that frameChanged fires when you edit a new symbol, but again, the
	 * document properties do not update in time, so you get the wrong data fed into the Event.
	 *
	 * The system works great apart from that though, so is good for Document, Layer & Mouse callbacks
	 * 
	 */

	// --------------------------------------------------------------------------------
	// Event classes
	
		
		
			/**
			 * Base Event object
			 */
			Event = function()
			{
				
			}
			Event.prototype =
			{
				type			:null,
				document		:null,
				timeline		:null,
				frame			:null,
				toString		:function()
				{
					return '[object Event type="' +this.type+ '"]';
				}
			}
				
			/**
			 * An object representing a the JSFL Event that fires when a user interacts with a document
			 * @param type		{String}	The type of event, can be 'new,open,closed,changed' and in CS5 'published,saved'
			 * @param document	{Document}	The Document object the event occured in
			 * @param timeline	{Timeline}	The Timeline object the event occured on
			 * @param layer		{Layer}		The Layer object the event occured on
			 */
			DocumentEvent = function(type)
			{
				this.type		= type;
				this.document	= xjsfl.events.current.document;
			}
			DocumentEvent.prototype.toString	= function(){ return '[object DocumentEvent type="' +this.type+ '" name="' +this.document.name+ '" id="' +this.document.id+ '"]'; }
			
			/**
			 * An object representing a the JSFL Event that fires when a user changes a layer
			 * @param type		{String}	The type of event, which is always 'changed'
			 * @param document	{Document}	The Document object the event occured in
			 * @param timeline	{Timeline}	The Timeline object the event occured on
			 * @param layer		{Layer}		The Layer object the event occured on
			 */
			LayerEvent = function()
			{
				this.type		= 'changed';
				this.document	= xjsfl.events.current.document;
				this.timeline	= xjsfl.events.current.timeline;
				this.layer		= xjsfl.events.current.layer;
			}
			LayerEvent.prototype.toString	= function(){ return '[object LayerEvent timeline="' +this.timeline.name+ '" layer="' +this.layer.name+ '"]'; }
			
			/**
			 * An object representing a the JSFL Event that fires when a user changes a frame
			 * @param type		{String}	The type of event, which is always 'changed'
			 * @param document	{Document}	The Document object the event occured in
			 * @param timeline	{Timeline}	The Timeline object the event occured on
			 * @param layer		{Layer}		The Layer object the event occured on
			 * @param frame		{Frame}		The Frame object the event occured on
			 */
			FrameEvent = function()
			{
				this.type		= 'changed';
				this.document	= fl.getDocumentDOM();
				this.timeline	= xjsfl.events.current.timeline;
				this.layer		= xjsfl.events.current.layer;
				this.frame		= this.layer.frames[this.timeline.currentFrame];
			}
			FrameEvent.prototype.toString	= function(){ return '[object FrameEvent timeline="' +this.timeline.name+ '" layer="' +this.layer.name+ '" frame="' +this.timeline.currentFrame+ '"]'; }
			
			/**
			 * An object representing a the JSFL Event that fires when a user move the mouse
			 * @param type		{String}	The type of event, which is always 'move'
			 * @param shift		{Boolean}	A flag indicating if the SHIFT key is down
			 * @param ctrl		{Boolean}	A flag indicating if the CTRL key is down
			 * @param alt		{Boolean}	A flag indicating if the ALT key is down
			 * @param x			{Number}	The x location in pixels of the mouse on the Flash stage
			 * @param y			{Number}	The y location in pixels of the mouse on the Flash stage
			 */
			MouseEvent = function()
			{
				this.type		= 'move';
				this.shift		= fl.tools.shiftIsDown;
				this.ctrl		= fl.tools.ctlIsDown;
				this.alt		= fl.tools.altIsDown;
				this.x			= fl.tools.penLoc.x;
				this.y			= fl.tools.penLoc.y;
			}
			MouseEvent.prototype.toString	= function(){ return '[object MouseEvent x="' +this.x+ '" y="' +this.y+ '" shift="' +this.shift+ '" ctrl="' +this.ctrl+ '" alt="' +this.alt+ '"]'; }
		
	// --------------------------------------------------------------------------------
	// static Event constants
		
		// CS4
			Event.DOCUMENT_NEW			= 'documentNew';
			Event.DOCUMENT_OPENED		= 'documentOpened';
			Event.DOCUMENT_CLOSED		= 'documentClosed';
			Event.DOCUMENT_CHANGED		= 'documentChanged';
			Event.LAYER_CHANGED			= 'layerChanged';
			Event.FRAME_CHANGED			= 'frameChanged';
			Event.MOUSE_MOVE			= 'mouseMove';
			
		// CS5 only
			Event.DOCUMENT_PUBLISHED	= 'documentPublished';
			Event.DOCUMENT_SAVED		= 'documentSaved';
		
	// --------------------------------------------------------------------------------
	// Add pre-emptive events to catch all document and layer changes
	
		//TODO Double-check this is needed now that we know that JSAPI events are fatally-flawed anyway
	
		if( ! xjsfl.events )
		{
			// callback
				function onStateChange(type)
				{
					// variables
						var document	= fl.getDocumentDOM();
						var timeline	= document ? document.getTimeline() : null;
						var layer		= timeline ? timeline.layers[timeline.currentLayer] : null;

					// assign
						xjsfl.events.current.document	= document;
						xjsfl.events.current.timeline	= timeline;
						xjsfl.events.current.layer		= layer;
						
					// debug
						//fl.trace('\n' +type.toUpperCase()+ ' > "' + layer.name + '" ("' + document.name + '" )');
						
				}
				
			// debug
				//fl.trace('Adding event events...')
				
			// add events
				fl.addEventListener(Event.DOCUMENT_CHANGED, function(){ onStateChange(Event.DOCUMENT_CHANGED) } );
				fl.addEventListener(Event.LAYER_CHANGED, function(){ onStateChange(Event.LAYER_CHANGED) } );
				fl.addEventListener(Event.FRAME_CHANGED, function(){ onStateChange(Event.FRAME_CHANGED) } );
			
		}
		
	// --------------------------------------------------------------------------------
	// xjsfl events object
		
		xjsfl.events =
		{
			// --------------------------------------------------------------------------------
			// public functions
			
				/**
				 * Add an event handler function for a particular event type
				 * @param	type		{String}	A String Event constant
				 * @param	callback	{Function}	A callback function to be fired when the event happens
				 * @param	overwrite	{Boolean}	An optional Boolean indicating to overwrite any existing Events of that type
				 */
				add:function(type, callback, overwrite)
				{
					// check event type
					
						// CS5 only
							var rxCS5	= /^documentPublished|documentSaved$/;
							var rxAll	= /^documentPublished|documentSaved|documentNew|documentOpened|documentClosed|mouseMove|documentChanged|layerChanged|frameChanged$/;
							if(rxCS5.test(type) && xjsfl.settings.app.version < 11)
							{
								throw new Error('xjsfl.events:add(): CS5 or greater required for event type "' +type+ '"');
							}
							
						// CS4
							if( ! rxAll.test(type))
							{
								throw new Error('xjsfl.events:add(): Invalid event type "' +type+ '"');
							}
					
					// check callback
						if(callback instanceof Function)
						{
							var name = callback.toSource().match(/function (\w+)/)[1];
							if( (! this.get(type, name)) || overwrite)
							{
								// add Flash event handler if not already added
									if(this.objects[type].callbacks == null)
									{
										// all objects
											//trace('Adding handler for "' + type + '"')
											this.objects[type].callbacks	= {};
											var handler						= xjsfl.events.objects[type].handler;
											this.objects[type].id			= fl.addEventListener(type, handler);
									}
									
								// add callback
									//trace('Adding callback ' + name)
									this.objects[type].callbacks[name]		= callback;
			
							}
							else
							{
								//trace('Callback "' +type+ ':' +name+ '" already exists');
								return false; 
							}
						}
						else
						{
							throw new Error('xjsfl.events:add(): Parameter "callback" must be a Function');
						}
						
					// return
						return true;
				},
				
				/**
				 * Remove an event handler function for a single or all event types
				 * @param	type		{String}	A String Event constant
				 * @param	callback	{Function}	An optional reference to a previously-registered callback
				 * @param	callback	{String}	An optional name of a previously-registered callback
				 */
				remove:function(type, callback)
				{
					// remove callback for single type
						if(arguments.length == 2)
						{
							if(this.objects[type].callbacks != null)
							{
								// grab the name if a function was passed in
									var name = callback instanceof Function ? callback.toSource().match(/function (\w+)/)[1] : String(callback);
									
								// if the callback exists, delete it
									if(this.objects[type].callbacks[name])
									{
										// debug
											//trace('Deleting callback "' +type+ ':' +name+ '"');
											
										// delete the callback
											delete this.objects[type].callbacks[name];
											
										// if no callbacks left, remove event handler
											var keys = xjsfl.utils.getKeys(this.objects[type].callbacks);
											if(keys.length == 0)
											{
												var handler = xjsfl.events.objects[type].handler;
												var id		= xjsfl.events.objects[type].id;
												//trace('removing "' +type+ '" handler:' + id);
												id ? fl.removeEventListener(type, id) : fl.removeEventListener(type);
												this.objects[type].callbacks = null;
												this.objects[type].id = -1;
											}
									}
									else
									{
										//trace('Callback "' +type+ ':' +name+ '" does not exist');
									}
							}
							else
							{
								//trace('There are no callbacks registered for "' +type+ '"');
							}
						}
						
					// otherwise, remove named callback for all types
						else
						{
							var name = type;
							for(type in this.objects)
							{
								this.remove(type, name);
							}
						}
				},
				
				/**
				 * Remove all event handler functions for a single, or all event types
				 * @param	type	{String}	An optional String Event constant
				 */
				removeAll:function(type)
				{
					// remove all callbacks for a single event
						if(type != null)
						{
							for(var name in this.objects[type].callbacks)
							{
								this.remove(type, name);
							}
						}
						
					// otherwise, remove callbacks for all event types
						else
						{
							for(type in this.objects)
							{
								this.removeAll(type);
							}
						}
				},
				
				/**
				 * Get a refernece to an event handler function for an event type
				 * @param	type		{String}	A String Event constant
				 * @param	callback	{Function}	A reference to a previously-registered callback
				 * @param	callback	{String}	A name of a previously-registered callback
				 * @returns				{Function}	An event handler function or null if it doesn't exist
				 */
				get:function(type, callback)
				{
					// grab the name if a function was passed in
						var name = callback instanceof Function ? callback.toSource().match(/function (\w+)/)[1] : String(callback);
					
					// grab the event handler function	
						return this.objects[type] && this.objects[type].callbacks && this.objects[type].callbacks[name] ? this.objects[type].callbacks[name] : null;
				},
				
				toString:function()
				{
					return '[class Events]';
				},
				
			// --------------------------------------------------------------------------------
			// private functions
			
				fire:
				{
					user:function(type, event)
					{
						for each(var callback in xjsfl.events.objects[type].callbacks)
						{
							//trace('Firing "' +type+ '" event: ' + callback);
							callback(event);
						}
					}
					
				},
				
			// --------------------------------------------------------------------------------
			// properties
			
				current:
				{
					document:	null,
					timeline:	null,
					layer:		null
				},
			
				objects:
				{
					// CS5 document
					
						documentPublished:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'documentPublished', new DocumentEvent('published') ); },
							id:			-1
						},
						
						documentSaved:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'documentSaved', new DocumentEvent('saved') ); },
							id:			-1
						},
						
					// CS3, CS4 document
					
						documentNew:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'documentNew', new DocumentEvent('new') ); },
							id:			-1
						},
						
						documentOpened:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'documentOpened', new DocumentEvent('opened') ); },
							id:			-1
						},
						
						documentClosed:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'documentClosed', new DocumentEvent('closed') ); },
							id:			-1
						},
						
						documentChanged:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'documentChanged', new DocumentEvent('changed') ); },
							id:			-1
						},
						
					// stage
					
						layerChanged:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'layerChanged', new LayerEvent() ); },
							id:			-1
						},
						
						frameChanged:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'frameChanged', new FrameEvent() ); },
							id:			-1
						},
						
					// mouse
						
						mouseMove:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire.user( 'mouseMove', new MouseEvent() ); },
							id:			-1
						}

				}
		}

	
// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.init(this);
			//clear();
			try
			{
		
		// --------------------------------------------------------------------------------
		// Event handler
		
			function onEvent(event)
			{
				trace(event);
			}
				
		// --------------------------------------------------------------------------------
		// Document events
		
			if(0)
			{
				// CS4 events
					xjsfl.events.add(Event.DOCUMENT_CHANGED, onEvent);
					xjsfl.events.add(Event.DOCUMENT_CLOSED, onEvent);
					xjsfl.events.add(Event.DOCUMENT_NEW, onEvent);
					xjsfl.events.add(Event.DOCUMENT_OPENED, onEvent);
					
				// CS5 events
					if(xjsfl.settings.app.csVersion > 4)
					{
						xjsfl.events.add(Event.DOCUMENT_PUBLISHED, onEvent);
						xjsfl.events.add(Event.DOCUMENT_SAVED, onEvent);
					}
			}
		
		// --------------------------------------------------------------------------------
		// Stage events
		
			if(0)
			{
				xjsfl.events.add(Event.LAYER_CHANGED, onEvent);
				xjsfl.events.add(Event.FRAME_CHANGED, onEvent);
			}
		
		// --------------------------------------------------------------------------------
		// Mouse event
		
			if(0)
			{
				function onEvent(event)
				{
					trace(event);
				}
				
				xjsfl.events.add(Event.MOUSE_MOVE, onEvent);
			}
		

		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
		
