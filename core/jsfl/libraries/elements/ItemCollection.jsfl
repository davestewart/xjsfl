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

	// includes
		xjsfl.init(this, ['Collection', 'Context', 'ElementCollection', 'Output', 'Utils']);
		
	// context = lib or folder?

/*


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

	/**
	 * ItemCollection class enacpsulates and modifies Arrays of LibraryItems
	 */
	ItemCollection =
	{
		className:'ItemCollection',

		library:null,

		init:function(elements)
		{
			var dom = $dom;
			if(dom)
			{
				this.library = dom.library;
				this._super(elements);
			}
			else
			{
				throw new Error('ItemCollection requires that a document be open before instantiation');
			}
		},

		/**
		 * Fast sorting algorithm
		 * @returns
		 */
		sort:function()
		{
			Utils.sortOn(this.elements, 'name', true);
			return this;
		},

		/**
		 * Select the item in the library
		 * @returns	{ItemCollection}				The original ItemCollection
		 */
		select:function()
		{
			this.library.selectNone();
			for(var i = 0; i < this.elements.length; i++)
			{
				this.library.selectItem(this.elements[i].name, false, true);
			}
			this.reveal();
			return this;
		},

		/**
		 * Updates the elements from the hard disk
		 * @returns	{ItemCollection}				The original ItemCollection
		 */
		update:function()
		{
			this.elements.forEach(function(e){ this.library.updateItem(e.name) }, this);
			return this;
		},

		/**
		 * Delete the item from the library
		 * @returns	{ItemCollection}				The original ItemCollection
		 */
		deleteItems:function()
		{
			for(var i = this.elements.length - 1; i >= 0; i--)
			{
				this.library.deleteItem(this.elements[i].name);
			}
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
					this.library.expandFolder(state, recurse, item.name)
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
						this.library.expandFolder(true, false, path);
						cache.push(path)
					}
				}
				this.library.expandFolder(true, false, path);
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
				path	= path.replace(/[:\(\)\[\]\*\+]/g, '')
				expand	= expand === false ? false : true;

			// create folder if it doesn't exist
				if( ! this.library.itemExists(path))
				{
					this.library.addNewItem('folder', path);
				}

			// move items
				for(var i = 0; i < this.elements.length; i++)
				{
					this.library.moveToFolder(path, this.elements[i].name, Boolean(replace));
				}

			// expand folders
			//TODO double check that expandFolder IS actually buggy
				if(expand)
				{
					while(path != '')
					{
						path = path.replace(/\/?[^\/]+$/, '');
						this.library.expandFolder(true, true, path);
					}
				}

			// return
				return this;
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

			// function supplied as naseName argument
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
		 * Run a function in each item in the collection by entering edit mode, running the function, then moving onto the next item
		 * @param	{Function}			callback	A function with a signature matching function(element, index, ...params), with "this" referring to the original ItemCollection
		 * @param	{Array}				params		An array of optional parameters to pass to the callback
		 * @returns	{ItemCollection}				The original ItemCollection
		 */
		exec:function(callback, params)
		{
			var that = this;
			this.elements.forEach
			(
				function(element, index, array)
				{
					that.library.editItem(element.name);
					callback.apply(that, [element, index].concat(params));
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

		/**
		 * Debugging function to list the items in the collection
		 * @returns	{ItemCollection}				The original ItemCollection
		 */
		list:function()
		{
			Output.list(this.elements, 'name', this.toString());
			return this;
		}

	}

	ItemCollection = Collection.extend(ItemCollection)
	ItemCollection.toString = function()
	{
		return '[class ItemCollection]';
	}

	xjsfl.classes.register('ItemCollection', ItemCollection);
