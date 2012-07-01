// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██                  ██████       ██ ██              ██   ██
//  ██  ██                  ██           ██ ██              ██
//  ██ █████ █████ ████████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████
//  ██  ██   ██ ██ ██ ██ ██ ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██
//  ██  ██   █████ ██ ██ ██ ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██
//  ██  ██   ██    ██ ██ ██ ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██
//  ██  ████ █████ ██ ██ ██ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// ItemCollection

	/**
	 * ItemCollection
	 * @overview	ItemCollection class enacpsulates and modifies Arrays of LibraryItems
	 * @instance	collection
	 */

	xjsfl.init(this, ['Collection', 'Context', 'ElementCollection', 'Output', 'Utils']);
		
/*

	// context = lib or folder?

	//fl.getDocumentDOM().library.moveToFolder("new", "Symbol 1", true);

	var lib = fl.getDocumentDOM().library;
	var items = lib.items

	cmp = function(a, b)
	{
		return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
	}

	items = items.sort(cmp)

	for(var i = 0; i < items.length; i++)
	{
		fl.trace(items[i].name)
	}

	pass in parent folder or library to callback?

*/

	ItemCollection =
	{
		className:'ItemCollection',

		getLibrary:function()
		{
			// placeholder function
		},

		/**
		 * ItemCollection constructor
		 * @constructor
		 * @name ItemCollection
		 * @param		{Array}		elements		An array of items
		 */
		init:function(elements, dom)
		{
			dom = dom || $dom;
			if( ! dom)
			{
				throw new Error('ItemCollection requires that a document be open before instantiation');
			}
			this.className = ItemCollection;
			this.getLibrary = function()
			{
				return dom.library;
			}
			this._super(elements instanceof Array ? elements : [elements]);
		},
	
		// --------------------------------------------------------------------------------
		// # Standard methods		
			
			/**
			 * Delete the item from the library
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			deleteItems:function()
			{
				for(var i = this.elements.length - 1; i >= 0; i--)
				{
					this.getLibrary().deleteItem(this.elements[i].name);
				}
				return this;
			},
			
		// --------------------------------------------------------------------------------
		// # UI methods			
	
			/**
			 * Select the item in the library
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			select:function()
			{
				this.getLibrary().selectNone();
				for(var i = 0; i < this.elements.length; i++)
				{
					this.getLibrary().selectItem(this.elements[i].name, false, true);
				}
				this.reveal();
				return this;
			},
			
			/**
			 * Visually expands or collapses folders in the library panel
			 * @param	{Boolean}state
			 * @param	{Boolean}recurse
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			expand:function(state, recurse)
			{
				state = state == undefined ? true : state;
				for(var i = 0; i < this.elements.length; i++)
				{
					var item = this.elements[i];
					if(item.itemType == 'folder')
					{
						this.getLibrary().expandFolder(state, recurse, item.name)
					}
				}
				return this;
			},
	
			/**
			 * Reveals the items in the library panel by expanding contaiing folders
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			reveal:function()
			{
				var cache = [];
				for(var i = 0; i < this.elements.length; i++)
				{
					var path = this.elements[i].name;
					while(/\//.test(path))
					{
						path = path.replace(/\/[^\/]*$/, '');
						if(cache.indexOf(path) == -1)
						{
							this.getLibrary().expandFolder(true, false, path);
							cache.push(path)
						}
					}
					this.getLibrary().expandFolder(true, false, path);
				}
				return this;
			},
			
		// --------------------------------------------------------------------------------
		// # Attribute methods
		
			/**
			 * Modifies a particular attribute on all items in the collection
			 * @param	{Object}		prop		An object containing name:value pairs of attribute to modify
			 * @param	{String}		prop		The name of the attribute to modify
			 * @param	{Value}			value		A value attribute value
			 * @param	{Function}		value		A callback function that returns a value, of the format function(element, index, elements);
			 * @returns	{ItemCollection}				The current Collection
			 */
			attr:function(prop, value)
			{
				this._super(prop, value);
				return this.update();
			},
			
			/**
			 * Sequentially rename the the items in the collection using an alphanumeric pattern, a callback, or parameters
			 * @param	{Function}			baseName	A callback of the format function(name, index, item) which should return a custom name
			 * @param	{String}			baseName	A single "name_###" name/number pattern string
			 * @param	{String}			baseName	The basename for your objects
			 * @param	{Number}			padding		An optional padding length for the numeric part of the name
			 * @param	{Boolean}			padding		An optional flag to automatically pad the numeric part of the name to the correct length
			 * @param	{Number}			startIndex	An optional number to start renaming from. Defaults to 1
			 * @param	{String}			separator	An optional separator between the numeric part of the name. Defaults to '_'
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			rename:function(baseName, padding, startIndex, separator)
			{
				// padding function
					function rename(element, index, elements, name)
					{
						var num			= index + startIndex;
						var str			= padding > 0 ? Utils.pad(num, padding) : num;
						return baseName + str;
					}
	
				// function supplied as baseName argument
					if(typeof baseName === 'function')
					{
						callback = baseName;
					}
	
				// string supplied
					else
					{
						// assign default callback
							callback	= rename;
							baseName	= baseName || 'clip';
	
						// determine if baseName is a pattern
							var matches = baseName.match(/(.+?)(#+|\d+)$/)
							if(matches)
							{
								baseName	= matches[1];
								padding		= matches[2].length;
								startIndex	= parseInt(matches[2], 10);
								startIndex	= isNaN(startIndex) ? 1 : startIndex;
							}
							
						// if there's only 1 element, just name it as-is
							else if(this.elements.length === 1)
							{
								callback = function()
								{
									return baseName;
								}
							}

						// variables
							else
							{
								separator	= separator || '_';
								startIndex	= startIndex || 1;
								baseName	= baseName + separator;
								padding		= padding == undefined ? true : padding;
								padding		= padding === true ? String(this.elements.length).length : padding;
							}
					}
	
				// do it
					for(var i = 0; i < this.elements.length; i++)
					{
						this.elements[i].name = callback(this.elements[i], i, this.elements, this.elements[i].name.split('/').pop());
					}
	
					return this;
			},
			
			/**
			 * Move collection elements to a folder
			 * @param	{String}			path		The path to move items to
			 * @param	{Boolean}			replace		Replace any items of the same name (set false to automatically rename)
			 * @param	{Boolean}			expand		Expand any newly-created folders
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			move:function(path, replace, expand)
			{
				// varaibles
					path	= path
								.replace(/[:\(\)\[\]\*\+]/g, '')
								.replace(/(^\/+|\/+$)/g, '');
					expand	= expand === false ? false : true;
	
				// create folder if it doesn't exist
					if( ! this.getLibrary().itemExists(path))
					{
						this.getLibrary().addNewItem('folder', path);
					}
	
				// move items
					for(var i = 0; i < this.elements.length; i++)
					{
						this.getLibrary().moveToFolder(path, this.elements[i].name, Boolean(replace));
					}
	
				// expand folders
				//TODO double check that expandFolder IS actually buggy
					if(expand)
					{
						/*
						while(path != '')
						{
							path = path.replace(/\/?[^\/]+$/, '');
							//this.getLibrary().expandFolder(true, true, path);
						}
						*/
					}
	
				// return
					return this;
			},
	
		// --------------------------------------------------------------------------------
		// # Editing methods
	
			/**
			 * Run a function in each item in the collection by entering edit mode, running the function, then moving onto the next item
			 * @param	{Function}			callback	A function with a signature matching function(element, index, ...params), with "this" referring to the original ItemCollection
			 * @param	{Array}				params		An array of optional parameters to pass to the callback
			 * @param	{Object}			scope		An optional scope to call the method in
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			exec:function(callback, params, scope)
			{
				var that = this;
				this.elements.forEach
				(
					function(element, index, array)
					{
						that.getLibrary().editItem(element.name);
						callback.apply(scope || that, [element, index].concat(params));
					}
				)
				return this;
			},

			/**
			 * Adds the items in the collection to the stage, returning an ElementCollection of the newly-added elements
			 * @param	{Context}			context		An optional context object of where to add the items
			 * @param	{Number}			x			An optional x position to add the items at
			 * @param	{Number}			y			An optional y position to add the items at
			 * @returns	{ElementCollection} 			A new ElementCollection
			 */
			addToStage:function(context, x, y)
			{
				var elements	= [];
				context			= context || Context.create();
				x				= x || 0;
				y				= y || 0;
				context.goto();
				for each(var element in this.elements)
				{
					if(/^movie clip|graphic|button|bitmap|component|compiled clip|video|linked video|embedded video$/.test(element.itemType))
					{
						context.dom.addItem({x:x,y:y}, element);
						elements.push(context.dom.selection[0]);
					}
				}
				return new ElementCollection(elements).select();
			},
	
		// --------------------------------------------------------------------------------
		// # Utility methods
		
			/**
			 * Sort the elements by path
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			sort:function()
			{
				Utils.sortOn(this.elements, 'name', true);
				return this;
			},
	
			/**
			 * Updates the elements from the hard disk
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			update:function()
			{
				var library = this.getLibrary();
				this.elements.forEach(function(e){ library.updateItem(e.name) }, this);
				return this;
			},
	
			/**
			 * Debugging function to list the items in the collection
			 * @param	{String}			label		An optional label to add to the inspect() output
			 * @returns	{ItemCollection}				The original ItemCollection
			 */
			list:function(label)
			{
				Output.list(this.elements, 'name', label || this.toString());
				return this;
			}
		
	}

	ItemCollection = Collection.extend(ItemCollection)
	ItemCollection.toString = function()
	{
		return '[class ItemCollection]';
	}

	xjsfl.classes.register('ItemCollection', ItemCollection);
