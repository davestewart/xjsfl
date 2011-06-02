

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

		/*
			Checks:
			document open		true
			selection			true, 2, 1-3
			elements can be tweened
			library selection	true, 2,
			library selection is folder
			layer is selected
			layers are selected
			custom				fn(callback, failureMessage)
		
			if(check){ ... }
		*/
	
	
	$ = function(selector, frameContext)
	{
		if(selector == null && frameContext == null)
		{
			return fl.getDocumentDOM();
		}
		else
		{
			return Selection(selector, frameContext);
		}
	}
	
	$.toString = function()
	{
		return '[class Selector]';
	}
	
	/**
	 * The context object provides access to, and keeps track of the current document,
	 * timeline, frame, etc that Collection classes need in order to successfully run
	 */
	$.context =
	{
		get:
		{
			document:function()
			{
				var dom = fl.getDocumentDOM();
				if(dom == null)
				{
					xjsfl.output.warn("A document (.fla file) needs to be open");
				}
				$.context.dom = dom;
				return dom;
			},
			
			selection:function(fn)
			{
				if(this.document())
				{
					var dom = $.context.dom;
					var sel = dom.selection;
					if(sel == null)
					{
						xjsfl.output.warn("You need to make a selection first");
					}
				}
				return sel;
			},
			
			itemSelection:function(fn)
			{
				var dom = this.document();
				if(dom)
				{
					var sel = dom.library.getSelectedItems();
					if(sel == null)
					{
						xjsfl.output.warn("You need to make a selection in the library first");
					}
				}
				return sel;
			},
			
			layerSelection:function(fn)
			{
				if(this.document())
				{
					var timeline = this.dom.getTimeline();
					var indices = timeline.getSelectedLayers();
					return indices.map(function(index){return timeline.layers[index]}) || null;
				}
				return null;
			},
			
			frameSelection:function(fn)
			{
				if(this.document())
				{
					return this.dom.getTimeline().getSelectedFrames() || null;
				}
				return null;
			},
			
			elementsCanBeTweened:function(elements)
			{
				return null;
			}

		},
		
		set:function(type, value)
		{
			
		},
		
		clear:function()
		{
			for(var i in this)
			{
				if(typeof this[i] != 'function')
				{
					this[i] = null;
				}
			}
		},
		
		dom:		null,
		item:		null,
		layer:		null,
		frame:		null,
		element:	null
	}
	
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                ██                ██         
//  ██     ██                ██                ██         
//  ██     █████ █████ ████ █████ █████ ██ ██ █████ █████ 
//  ██████ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██   ██    
//      ██ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██   █████ 
//      ██ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██      ██ 
//  ██████ ██ ██ █████ ██    ████ █████ █████  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Shortcuts

	// element selection
	
		var shortcuts =
		{
			/**
			 * Selects elements on the stage
			 * @param selector {Mixed}
			 * @returns {Array} An array of elements
			 */
			elements:function(selector, frameContext)
			{
				var dom = $.context.get.document(2);
				if(dom)
				{
					dom.selectAll();
					return new ElementCollection($.context.get.selection(true));
				}
				return null;
			},
			
			/**
			 * Selects elements on the stage
			 * @param selector {Mixed}
			 * @returns {Array} An array of elements
			 */
			selection:function()
			{
				//return $.context.get.selection();
				return new ElementCollection(document.selection);
			},
			
			/**
			 * Selects frames within the document
			 * @param selector {Mixed}
			 * @returns {Array} An array of (key)frames
			 */
			frames:function(selector, layerContext)
			{
				var frames = $.context.get.frameSelection(true);
				if(frames)
				{
					return frames;
				}
				return null;
			}, 
			
			/**
			 * Selects layers within the document
			 * @param selector {Mixed}
			 * @returns {Array} An array of layers
			 */
			layers:function(selector, timelineContext)
			{
				try
				{
					var dom = $.context.get.document(true);
					if(dom)
					{
						timelineContext = timelineContext || dom.getCurrentTimeline();
						return timelineContext.getSelectedLayers();
					}
					return null;
				}
				catch(err)
				{
					xjsfl.output.error(err);
					return null;
				}
			},
			
			/**
			 * Selects items within the Library
			 * @param selector {Mixed}
			 * @returns {Array} An array of library items
			 */
			items:function(selector, folderContext)
			{
				var dom = $.context.get.document(true);
				if(dom)
				{
					return dom.library.items;
				}
				return null;
			},
			
			documents:function(selector)
			{
				return fl.documents;
			}
			
		}
		
		
	// extend xjsfl with shortcut methods
		xjsfl.utils.extend($, shortcuts);

	// reguster		
		xjsfl.classes.register('$', $);
		
		xjsfl.init(this);

		
