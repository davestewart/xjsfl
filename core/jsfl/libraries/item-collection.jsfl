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
	var itemCollection =
	{
		className:'ItemCollection',
		
		library:null,
		
		constructor:function(elements)
		{
			var dom = fl.getDocumentDOM();
			if(dom)
			{
				this.library = dom.library;
				this.base(elements);
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
			xjsfl.utils.sortOn(this.elements, 'name', true);
			return this;
		},
		
		/**
		 * Select the item in the library
		 * @returns				{ItemCollection}	The original ItemCollection
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
		 * @returns				{ItemCollection}	The original ItemCollection
		 */
		update:function()
		{
			this.elements.forEach(function(e){ this.library.updateItem(e.name) }, this);
			return this;
		},
		
		/**
		 * Delete the item from the library
		 * @returns				{ItemCollection}	The original ItemCollection
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
		 * @param	state		{Boolean}		
		 * @param	recurse		{Boolean}
		 * @returns				{ItemCollection}	The original ItemCollection
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
		 * @returns				{ItemCollection}	The original ItemCollection
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
		 * @param	path		{String}			The path to move items to
		 * @param	replace		{Boolean}			Replace any items of the same name (set false to automatically rename)
		 * @param	expand		{Boolean}			Expand any newly-created folders
		 * @returns				{ItemCollection}	The original ItemCollection
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
		 * Rename the the items in the collection using a numerical pattern or callback
		 * @param	baseName	{Function}			A callback of the format function(name, index, item) which should return a custom name
		 * @param	baseName	{String}			A optinoal base name for numerical naming.
		 * @param	padding		{Number}			An optional length to pad the numeric part of the new name to
		 * @returns				{ItemCollection}	The original ItemCollection
		 */
		rename:function(baseName, padding)
		{
			// default callback function
				function callback(item, name, index)
				{
					return baseName + ' ' + xjsfl.utils.pad(index + 1, padding);
				}
				
			// default pattern
				if(typeof baseName === 'function')
				{
					callback = baseName;
				}
				else
				{
					baseName	= baseName || 'Item';
					padding		= padding || String(this.elements.length).length + 1;
				}
				
			// start
				for(var i = 0; i < this.elements.length; i++)
				{
					// get item path and name
						var parts	= this.elements[i].name.split('/');
						var name	= parts.pop();
						
					// run via renaming callback
						name		= callback(this.elements[i], name, i);
						//var path	= parts.join('/') + '/' + name;
						this.elements[i].name = name;
				}
				
				return this;
		},
		
		/**
		 * Run a function in each item in the collection by entering edit mode, running the function, then moving onto the next item
		 * @param	callback	{Function}			A function with a signature matching function(element, index, ...params), with "this" referring to the original ItemCollection
		 * @param	params		{Array}				An array of optional parameters to pass to the callback
		 * @returns				{ItemCollection}	The original ItemCollection
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
		 * @param	context		{Context}			An optional context object of where to add the items
		 * @param	x			{Number}			An optional x position to add the items at
		 * @param	y			{Number}			An optional y position to add the items at
		 * @returns				{ElementCollection} A new ElementCollection
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
		 * @returns				{ItemCollection}	The original ItemCollection
		 */
		list:function()
		{
			Output.list(this.elements, 'name', this.toString());
			return this;
		}
		
	}
	
	ItemCollection = Collection.extend(itemCollection)
	ItemCollection.toString = function()
	{
		return '[class ItemCollection]';
	}
	
	xjsfl.classes.register('ItemCollection', ItemCollection);
