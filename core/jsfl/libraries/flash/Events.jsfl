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
// Events

	/**
	 * Events
	 * @overview	An OO event class to handle JSFL events
	 * @instance	event
	 */

	xjsfl.init(this, ['Utils']);
		
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
	// # Event classes

			Event = function(type, subtype)
			{
				this.type		= type;
				this.subtype	= subtype;
				this.time		= new Date();
			}
			Event.prototype =
			{
				type:null,
				subtype:null,
				time:null
			}

			/**
			 * An object representing a the JSFL Event that fires when a user interacts with a document
			 * @param	{String}	type		The type of event, can be 'new,open,closed,changed' and in CS5 'published,saved'
			 * @param	{Document}	document	The Document object the event occured in
			 */
			DocumentEvent = function(type, subtype)
			{
				Event.call(this, type, subtype);
				this.document	= fl.getDocumentDOM();
			}
			DocumentEvent.prototype = new Event;
			DocumentEvent.prototype.constructor = DocumentEvent;
			DocumentEvent.prototype.toString = function(){ return '[object DocumentEvent type="' +this.type+ '" name="' +(this.document ? this.document.name : '')+ '" id="' +(this.document ? this.document.id : '')+ '"]'; }
			DocumentEvent.toString = function(){ return '[class DocumentEvent]'; }

			/**
			 * An object representing a the JSFL Event that fires when a user changes a layer
			 * @param	{String}	type		The type of event, which is always 'changed'
			 * @param	{Document}	document	The Document object the event occured in
			 * @param	{Timeline}	timeline	The Timeline object the event occured on
			 * @param	{Layer}		layer		The Layer object the event occured on
			 */
			LayerEvent = function()
			{
				Event.call(this, LayerEvent.CHANGED, 'changed');
				this.document	= fl.getDocumentDOM();
				this.timeline	= this.document.getTimeline();
				this.layer		= this.timeline.layers[this.timeline.currentLayer];
			}
			LayerEvent.prototype = new Event;
			LayerEvent.prototype.constructor = LayerEvent;
			LayerEvent.prototype.toString = function(){ return '[object LayerEvent timeline="' +(this.timeline ? this.timeline.name : '')+ '" layer="' +(this.layer ? this.layer.name : '')+ '"]'; }
			LayerEvent.toString = function(){ return '[class LayerEvent]'; }

			/**
			 * An object representing a the JSFL Event that fires when a user changes a frame
			 * @param	{String}	type		The type of event, which is always 'changed'
			 * @param	{Document}	document	The Document object the event occured in
			 * @param	{Timeline}	timeline	The Timeline object the event occured on
			 * @param	{Layer}		layer		The Layer object the event occured on
			 * @param	{Frame}		frame		The Frame object the event occured on
			 */
			FrameEvent = function()
			{
				Event.call(this, FrameEvent.CHANGED, 'changed');
				this.document	= fl.getDocumentDOM();
				this.timeline	= this.document.getTimeline();
				this.layer		= this.timeline.layers[this.timeline.currentLayer];
				this.frame		= this.layer.frames[this.timeline.currentFrame];
			}
			FrameEvent.prototype = new Event;
			FrameEvent.prototype.constructor = FrameEvent;
			FrameEvent.prototype.toString = function(){ return '[object FrameEvent timeline="' +(this.timeline ? this.timeline.name : '')+ '" layer="' +(this.layer ? this.layer.name : '')+ '" frame="' +(this.timeline ? this.timeline.currentFrame : '')+ '"]'; }
			FrameEvent.toString = function(){ return '[class FrameEvent]'; }

			/**
			 * An object representing a the JSFL Event that fires when a user moves the mouse
			 * @param	{String}	type		The type of event, which is always 'move'
			 * @param	{Boolean}	shift		A flag indicating if the SHIFT key is down
			 * @param	{Boolean}	ctrl		A flag indicating if the CTRL key is down
			 * @param	{Boolean}	alt			A flag indicating if the ALT key is down
			 * @param	{Number}	x			The x location in pixels of the mouse on the Flash stage
			 * @param	{Number}	y			The y location in pixels of the mouse on the Flash stage
			 */
			MouseEvent = function()
			{
				Event.call(this, MouseEvent.MOVE, 'move');
				this.shift		= fl.tools.shiftIsDown;
				this.ctrl		= fl.tools.ctlIsDown;
				this.alt		= fl.tools.altIsDown;
				this.x			= fl.tools.penLoc.x;
				this.y			= fl.tools.penLoc.y;
			}
			MouseEvent.prototype = new Event;
			MouseEvent.prototype.constructor = MouseEvent;
			MouseEvent.prototype.toString = function(){ return '[object MouseEvent x="' +this.x+ '" y="' +this.y+ '" shift="' +this.shift+ '" ctrl="' +this.ctrl+ '" alt="' +this.alt+ '"]'; }
			MouseEvent.toString = function(){ return '[class MouseEvent]'; }

	// --------------------------------------------------------------------------------
	// # Constants

		// CS5.5+ only
			DocumentEvent.PUBLISH		= 'prePublish';
			DocumentEvent.PUBLISHED		= 'postPublish';
			DocumentEvent.SAVED			= 'documentSaved';

		// CS4+
			DocumentEvent.NEW			= 'documentNew';
			DocumentEvent.OPENED		= 'documentOpened';
			DocumentEvent.CLOSED		= 'documentClosed';
			DocumentEvent.CHANGED		= 'documentChanged';
			LayerEvent.CHANGED			= 'layerChanged';
			FrameEvent.CHANGED			= 'frameChanged';
			MouseEvent.MOVE				= 'mouseMove';

	// --------------------------------------------------------------------------------
	// Add pre-emptive events to catch all document and layer changes

		//TODO Double-check this is needed now that we know that JSAPI events are fatally-flawed anyway

/*
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
				fl.addEventListener(DocumentEvent.CHANGED, function(){ onStateChange(DocumentEvent.CHANGED) } );
				fl.addEventListener(LayerEvent.CHANGED, function(){ onStateChange(LayerEvent.CHANGED) } );
				fl.addEventListener(FrameEvent.CHANGED, function(){ onStateChange(FrameEvent.CHANGED) } );

*/

	// --------------------------------------------------------------------------------
	// # Events object

		var events =
		{
			// --------------------------------------------------------------------------------
			// # Methods

				/**
				 * Add an event handler function for a particular event type
				 * @param	{String}	type		A String Event constant
				 * @param	{Function}	callback	A callback function to be fired when the event happens
				 * @param	{String}	name		A named id with which to get, delete or overwrite the callback
				 * @param	{Object}	scope		An optional scope in which to call the callback function
				 */
				add:function(type, callback, name, scope)
				{
					// check event type

						// CS5 only
							var rxCS5	= /^prePublish|postPublish|documentSaved$/;
							var rxAll	= /^prePublish|postPublish|documentSaved|documentNew|documentOpened|documentClosed|mouseMove|documentChanged|layerChanged|frameChanged$/;
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
							/**
							 * So, this is now the events class works:
							 *
							 * Instead of registering a Flash event handler per callback, the Events library
							 * just registers a SINGLE "gateway" event handler per event type, i.e.
							 * documentChanged, layerChanged, frameChanged, etc, and stores the individual
							 * callback functions in an internal hash of named callbacks, per event type.
							 *
							 * When the gateway handler fires, it grabs the current document, timeline, layer
							 * or frame settings, creates the appropriate Event instance, then loops over the
							 * registered callbacks for that event type, passing each one the Event instance.
							 *
							 * The advantages to this system are:
							 *
							 * Pre-supplying named callback ids makes it possible to reuse the same callback
							 * slot from external scripts, whereas before it would be impossible to store the
							 * event id that Flash doles out per event registration to delete the previously-
							 * added event handler.
							 *
							 * As well, having only a single gateway event fire means that we only need to grab
							 * document, timeline, layer and frame references once, before all callbacks are
							 * then fired.
							 */
							
							// add gateway event handler if not already added
								if(this.handlers[type].callbacks == null)
								{
									// all handlers
										//trace('Adding handler for "' + type + '"')
										this.handlers[type].callbacks	= {};
										var handler						= xjsfl.events.handlers[type].handler;
										this.handlers[type].id			= fl.addEventListener(type, handler);
								}

							// add callback
								//trace('Adding callback ' + type, name);

							// if a scope is supplied, wrap the handler
								var fn = scope ? function(event){ callback.call(scope, event); } : callback;

							// assign the handler
								this.handlers[type].callbacks[name]		= fn;

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
				 * @param	{String}	type		A String Event constant
				 * @param	{String}	name		The supplied name of a previously-registered callback
				 */
				remove:function(type, name)
				{
					// remove callback for single type
						if(arguments.length == 2)
						{
							if(this.handlers[type].callbacks != null)
							{
								if(this.handlers[type].callbacks[name])
								{
									// debug
										//trace('Deleting callback "' +type+ ':' +name+ '"');

									// delete the callback
										delete this.handlers[type].callbacks[name];

									// if no callbacks left, remove event handler
										var keys = Utils.getKeys(this.handlers[type].callbacks);
										if(keys.length == 0)
										{
											var handler = xjsfl.events.handlers[type].handler;
											var id		= xjsfl.events.handlers[type].id;
											//trace('removing "' +type+ '" handler:' + id);
											id ? fl.removeEventListener(type, id) : fl.removeEventListener(type);
											this.handlers[type].callbacks = null;
											this.handlers[type].id = -1;
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
							name = type;
							for(type in this.handlers)
							{
								this.remove(type, name);
							}
						}
				},

				/**
				 * Remove all event handler functions for a single, or all event types
				 * @param	{String}	type	An optional String Event constant
				 */
				removeAll:function(type)
				{
					// remove all callbacks for a single event
						if(type != null)
						{
							for(var name in this.handlers[type].callbacks)
							{
								this.remove(type, name);
							}
						}

					// otherwise, remove callbacks for all event types
						else
						{
							for(type in this.handlers)
							{
								this.removeAll(type);
							}
						}
				},

				/**
				 * Get a reference to an event handler function for an event type
				 * @param	{String}	type		A String Event constant
				 * @param	{String}	name		A name of a previously-registered callback
				 * @returns	{Function}				An event handler function or null if it doesn't exist
				 */
				get:function(type, name)
				{
					return this.handlers[type] && this.handlers[type].callbacks && this.handlers[type].callbacks[name] ? this.handlers[type].callbacks[name] : null;
				},

				toString:function()
				{
					return '[class Events]';
				},

			// --------------------------------------------------------------------------------
			// private functions

				fire:function(event)
				{
					for each(var callback in xjsfl.events.handlers[event.type].callbacks)
					{
						//trace('Firing "' +type+ '" event: ' + callback);
						callback(event);
					}
				},

			// --------------------------------------------------------------------------------
			// properties

				handlers:
				{
					// CS5+ document

						prePublish:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new DocumentEvent(DocumentEvent.PUBLISH, 'publish') ); },
							id:			-1
						},

						postPublish:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new DocumentEvent(DocumentEvent.PUBLISHED, 'published') ); },
							id:			-1
						},

						documentSaved:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new DocumentEvent(DocumentEvent.SAVED, 'saved') ); },
							id:			-1
						},

					// CS3, CS4 document

						documentNew:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new DocumentEvent(DocumentEvent.NEW, 'new') ); },
							id:			-1
						},

						documentOpened:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new DocumentEvent(DocumentEvent.OPENED, 'opened') ); },
							id:			-1
						},

						documentClosed:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new DocumentEvent(DocumentEvent.CLOSED, 'closed') ); },
							id:			-1
						},

						documentChanged:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new DocumentEvent(DocumentEvent.CHANGED, 'changed') ); },
							id:			-1
						},

					// stage

						layerChanged:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new LayerEvent() ); },
							id:			-1
						},

						frameChanged:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new FrameEvent() ); },
							id:			-1
						},

					// mouse

						mouseMove:
						{
							callbacks:	null,
							handler:	function(){ xjsfl.events.fire( new MouseEvent() ); },
							id:			-1
						}

				}
		}

	// -----------------------------------------------------------------------------------------------------------------------------------------
	// register classes

		xjsfl.classes.register('DocumentEvent', DocumentEvent);
		xjsfl.classes.register('LayerEvent', LayerEvent);
		xjsfl.classes.register('FrameEvent', FrameEvent);
		xjsfl.classes.register('MouseEvent', MouseEvent);

	// -----------------------------------------------------------------------------------------------------------------------------------------
	// assign event code to xjsfl.events

		(function()
		{

			for(var name in events)
			{
				// add all properties...
					if(name !== 'handlers')
					{
						xjsfl.events[name] = events[name];
					}

				// ...but don't overwrite existing event handlers (so on reloading the framework, they survive)
					else
					{
						if( ! xjsfl.events.handlers )
						{
							xjsfl.events.handlers = events.handlers;
						}
					}
			}

		})()
