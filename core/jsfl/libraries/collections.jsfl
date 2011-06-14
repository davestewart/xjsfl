// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██  ██   ██ ██ ██  ██         ██████ ██    ██              ██   
//  ██  ██  ██      ██     ██         ██  ██ ██                    ██   
//  ██  ██ █████ ██ ██ ██ █████ ██ ██ ██  ██ █████ ██ █████ █████ █████ 
//  ██  ██  ██   ██ ██ ██  ██   ██ ██ ██  ██ ██ ██ ██ ██ ██ ██     ██   
//  ██  ██  ██   ██ ██ ██  ██   ██ ██ ██  ██ ██ ██ ██ █████ ██     ██   
//  ██  ██  ██   ██ ██ ██  ██   ██ ██ ██  ██ ██ ██ ██ ██    ██     ██   
//  ██████  ████ ██ ██ ██  ████ █████ ██████ █████ ██ █████ █████  ████ 
//                                 ██              ██                   
//                              █████            ████                   
//
// ------------------------------------------------------------------------------------------------------------------------
// UtilityObject - Base object for all Collection types

	if( ! xjsfl.file.loading)
	{
		xjsfl.init(this);
		xjsfl.classes.load('class');
	}

	/**
	 * A base class which contains some utility methods for debugging and development productivity
	 */
	var utilityObject =
	{
		className:'UtilityObject',
		
		/**
		 * A chainable utility function, that allows an external callback function to be called a single time
		 * @param callback {Function} Function to call
		 * @param params {Array} Optional arguments to be passed to the callback
		 * @returns {Collection} The original Collection object
		 */
		call:function(callback, params)
		{
			callback.apply(this, params);
			return this;
		},
		
		/**
		 * A chainable utility function, that allows an external callback function to be called a single time
		 * @param callback {Function} Function to call
		 * @param params {Array} Optional arguments to be passed to the callback
		 * @returns {Collection} The original Collection object
		 */
		trace:function(str)
		{
			fl.trace(str);
			return this;
		},
		
		/**
		 * A chainable utility function, that displays the prototype chain
		 * @param trace {Boolean} An optional switch to trace the result to the output panel
		 * @returns {Array} An array of the 
		 */
		prototypeChain:function(trace)
		{
			// variables
				var chain = [this];
				var proto = this.__proto__;
				var i = 0;
				
			// walk the prototype chain
				while(proto && proto != proto.__proto__ && i < 10)
				{
					//fl.trace('\n----------------------------------------------------------------------------------\n')
					fl.trace(proto.constructor)
					chain.push(proto);
					proto = proto.__proto__;
					i++;
				}
				
			// debug
				chain.pop();
				chain = chain.reverse();
				if(trace != false)
				{
					fl.trace(' > ' + chain.join(' > '));
				}
				
			// return
				return chain;
		},
		
		toString:function()
		{
			return '[object ' +(this.hasOwnProperty('className') ? this.className : 'UnnamedClass!') + ']';
		}		
	}
	
	UtilityObject = Class.extend(utilityObject);
	UtilityObject.toString = function()
	{
		return '[class UtilityObject]';
	}
	
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██ ██              ██   ██             
//  ██           ██ ██              ██                  
//  ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Collection

	/**
	 * Collection Class
	 * @param elements {Array} An array of elements
	 */
	collection =
	{
		
		elements:[],
			
		className:'Collection',
		
		constructor:function(elements)
		{
			this.add(elements);//elements = elements instanceof Array ? elements : [];
		},

		/**
		 * Calls a function on each element in the collection in forward order (although internally, it's in reverse)
		 * @param callback {Function} A callback to = function fire on each iteraction
		 * @param arguments {Array} An optional array of arguments to pass to the callback function
		 * @returns {Collection} The original Collection object
		 */
		each:function(callback, arguments)
		{
			var i = this.elements.length - 1, j = 0;
			while(i >= 0)
			{
				callback.apply(this, [this.elements[i], i, this.elements])
				i--; j++;
			}
			return this;
		},
		
		/**
		 * Calls a on = function each element in the collection in reverse (native) order
		 * @param callback {Function} A callback to = function fire on each iteraction
		 * @param arguments {Array} An optional array of arguments to pass to the callback function
		 * @returns {Collection} The original Collection object
		 */
		reach:function(callback, arguments)
		{
			var i = 0;
			while(i < this.elements.length)
			{
				callback.apply(this, [this.elements[i], i, this.elements])
				i++;
			}
			return this;
		},
		
		/**
		 * Adds elements to the collection
		 * @param elements {Array} Adds elements to the collection
		 * @returns {Collection} The original Collection object
		 */
		add:function(elements)
		{
			if(arguments.length == 1 && arguments[0] instanceof Array)
			{
				this.elements	= this.elements.concat(elements)
			}
			else
			{
				elements		= Array.slice.call(this, arguments)
				this.elements	= this.elements.concat(elements);
			}
			return this;
		},
		
		/**
		 * Gets an element from the collection
		 * @param index {Number} Gets the nth object in the collection
		 * @returns {Object} An object
		 */
		get:function(index)
		{
			return this.elements[this.elements.length - 1 - index];
		},
		
		/**
		 * Removes elements from the collection
		 * @param startIndex {Number} An integer that specifies at what position to remove elements
		 * @param deleteCount {Number} The number of elements to be removed
		 * @returns {Collection} The original Collection object
		 */
		remove:function(startIndex, deleteCount)
		{
			this.elements.splice(startIndex, deleteCount);
			return this;
		},
		
		/**
		 * Filters the collection using a callback function
		 * @param callback {Function} Function to test each element of the array
		 * @param thisObject {Object} Object to use as this when executing callback
		 * @returns {Collection} The original Collection object
		 */
		filter:function(callback, thisObject)
		{
			this.elements = this.elements.filter(callback, thisObject || this)
			
			trace('filtered:' + this.elements.length)
			
			//this.elements = [];

			return this;
		},
		
		/**
		 * Returns the first index at which a given element can be found in the array, or -1 if it is not present
		 * @param element {Object} Element to locate in the array
		 * @param fromIndex {Number} Optional index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
		 * @returns {Number} The first index at which the element is found, or -1 if it is not present
		 */
		indexOf:function(element, fromIndex)
		{
			return this.elements.indexOf(element, fromIndex);
		},
		
		attr:function(name, value)
		{
			for(var i = 0; i < this.elements.length; i++)
			{
				this.elements[i][name] = value;
			}
			return this;
		},
		
		toString:function()
		{
			return '[object ' +this.className+ ': ' + this.elements.length+ ' elements]';
		},
		
		debug:function()
		{
			fl.trace('\n' + this.toString());
			this.elements.forEach(function(e, i){fl.trace('  [' + i + '] => ' + e)})
		}
		
	}
	
	Collection = Class.extend(collection);
	Collection.toString = function()
	{
		return '[class Collection]';
	}

	
	/*
	var col = new Collection([1,2,3,4,5]);
	col.each(function(e, i, elements){elements[i] = i});
	col.debug()
	Output.inspect(collection.elements);
	*/
	


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██ ██       ██████       ██ ██              ██   ██             
//  ██        ██       ██           ██ ██              ██                  
//  ██     ██ ██ █████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  █████  ██ ██ ██ ██ ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ █████ ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ ██    ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ █████ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// FileCollection



// ------------------------------------------------------------------------------------------------------------------------
//
//  █████                                          ██   ██████       ██ ██              ██   ██             
//  ██  ██                                         ██   ██           ██ ██              ██                  
//  ██  ██ █████ █████ ██ ██ ████████ █████ █████ █████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  ██  ██ ██ ██ ██    ██ ██ ██ ██ ██ ██ ██ ██ ██  ██   ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██  ██ ██ ██ ██    ██ ██ ██ ██ ██ █████ ██ ██  ██   ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//  ██  ██ ██ ██ ██    ██ ██ ██ ██ ██ ██    ██ ██  ██   ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  █████  █████ █████ █████ ██ ██ ██ █████ ██ ██  ████ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// DocumentCollection

	/*
	
		Constructor can be
			a folder, for all documents (*.fla)
			a date selector?
			a file collection, which is then cast as a document collection
			empty for all current open documents
			
			exec() opens = function document, runs a callback, then optionally closes and saves
			
			processItem = function(item, i)
			{
				
			}
			
			processDoc = function(doc, i)
			{
				$lib(':movieclip').each(processItem);
			}
			
			$.documents('d:/projects/animation/*.fla').exec(processDoc, true);
	*/


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                         ██████       ██ ██              ██   ██             
//  ██                             ██           ██ ██              ██                  
//  ██     █████ █████ █████ █████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  ██████ ██    ██ ██ ██ ██ ██ ██ ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//      ██ ██    █████ ██ ██ █████ ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//      ██ ██    ██    ██ ██ ██    ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  ██████ █████ █████ ██ ██ █████ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// SceneCollection

	// context = document?

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
			function swap(arr, a, b)
			{
				var tmp = arr[a];
				arr[a] = arr[b];
				arr[b] = tmp;
			}
			
			function partition(array, begin, end, pivot)
			{
				var piv = array[pivot].name.toLowerCase();
				swap(array, pivot, end - 1);
				var store = begin;
				var ix;
				for(ix = begin; ix < end - 1; ++ix) {
					if(array[ix].name.toLowerCase() <= piv) {
						swap(array, store, ix);
						++store;
					}
				}
				swap(array, end - 1, store);
			
				return store;
			}
			
			function qsort(array, begin, end)
			{
				if(end - 1 > begin) {
					var pivot = begin + Math.floor(Math.random() * (end - begin));
			
					pivot = partition(array, begin, end, pivot);
			
					qsort(array, begin, pivot);
					qsort(array, pivot + 1, end);
				}
			}
			
			qsort(this.elements, 0, this.elements.length);
			
			return this;
		},
		
		/**
		 * Select the item in the library
		 * @param		
		 * @returns		
		 * @author	Dave Stewart	
		 */
		select:function()
		{
			this.library.selectNone();
			for(var i = 0; i < this.elements.length; i++)
			{
				this.library.selectItem(this.elements[i].name, false, true);
			}
			return this;
		},
		
		/**
		 * Updates the elements from the hard disk
		 * @author	Dave Stewart	
		 */
		update:function()
		{
			this.elements.forEach(function(e){ this.library.updateItem(e.name) }, this);
			return this;
		},
		
		/**
		 * 
		 * @param	state	
		 * @param	recurse	
		 * @returns		
		 * @author	Dave Stewart	
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
		 * Move collection elements to a folder
		 * @param	path		{String}	The path to move items to
		 * @param	replace		{Boolean}	Replace any items of the same name (set false to automatically rename)
		 * @param	expand		{Boolean}	Expand any newly-created folders
		 * @returns				{ItemCollection}
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
		 * Remove the item from the library
		 * @param		
		 * @returns		
		 */
		remove:function()
		{
			for(var i = this.elements.length - 1; i >= 0; i--)
			{
				this.library.deleteItem(this.elements[i].name);
			}
			return this;
		},
		
		/**
		 * Numerically rename the the items in the collection using a pattern or callback
		 * @param	baseName	{String}			A base name for numerical naming. Alternatively, pass a callback of the format function(name, index, item) which returns a custom name
		 * @returns	this		(ItemCollection)
		 */
		rename:function(baseName, padding)
		{
			// padding function
				function pad(num, length)
				{
					var str = String(num);
					while(str.length < length)
					{
						str = '0' + str;
					}
					return str;
				}
				
			// default callback function
				function callback(name, index, item)
				{
					return baseName + ' ' + pad(index + 1);
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
						name		= callback(name, i, this.elements[i]);
						var path	= parts.join('/') + '/' + name;
						this.elements[i].name = name;
				}
				
				return this;
		},
		
		/**
		 * Run a function in each item in the collection by entering edit mode, running the function, then moving onto the next item
		 * @param	callback		{Function}			A function with a signature matching function(element, index, ...params), with "this" referring to the original ItemCollection
		 * @param	params			{Array}				An array of optional parameters to pass to the callback
		 * @returns					{ItemCollection}	The original ItemCollection
		 * @author	Dave Stewart	
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
		
		invoke:function(method, params)
		{
			for(var i = this.elements.length - 1; i >= 0; i--)
			{
				this.library[method].apply(this, params);
			}
		},
		
		inspect:function()
		{
			fl.trace('\n' + this.toString());
			this.elements.forEach(function(e, i){fl.trace('  [' + i + '] => ' + e.name)})
			return this;
		}
		
	}
	
	ItemCollection = Collection.extend(itemCollection)
	ItemCollection.toString = function()
	{
		return '[class ItemCollection]';
	}
	
	
	/*
	var items = fl.getDocumentDOM().library.items.slice(1, 3);
	var items = fl.getDocumentDOM().library.items[1];

	var itemCollection = new ItemCollection(items);
	itemCollection.attr('allowSmoothing', true).select();

	fl.trace(itemCollection.elements.length)
	*/
	

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██                            ██████       ██ ██              ██   ██             
//  ██                            ██           ██ ██              ██                  
//  ██     █████ ██ ██ █████ ████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  ██        ██ ██ ██ ██ ██ ██   ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██     █████ ██ ██ █████ ██   ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██ ██ ██ ██    ██   ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  ██████ █████ █████ █████ ██   ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//                  ██                                                                     
//               █████                                                                     
//
// ------------------------------------------------------------------------------------------------------------------------
// Layer Collection

	// context = timeline / item?

	/**
	 * LayerCollection class
	 */
	layerCollection =
	{
		className:'LayerCollection'
	}
	
	LayerCollection = Collection.extend(layerCollection);

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                           ██████       ██ ██              ██   ██             
//  ██                               ██           ██ ██              ██                  
//  ██     ████ █████ ████████ █████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  █████  ██      ██ ██ ██ ██ ██ ██ ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██   █████ ██ ██ ██ █████ ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██   ██ ██ ██ ██ ██ ██    ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██   █████ ██ ██ ██ █████ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// FrameCollection

	// context = timeline / item?
	
	// second selector = layer(s)
	
	// $frames(':selected', [1,2,3])

	/**
	 * FrameCollection class
	 */
	frameCollection =
	{
		className:'FrameCollection'
	}
	
	FrameCollection = Collection.extend(frameCollection);
	FrameCollection.toString = function()
	{
		return '[class FrameCollection]';
	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████  ██                     ██████       ██ ██              ██   ██             
//  ██      ██                     ██           ██ ██              ██                  
//  ██     █████ █████ █████ █████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  ██████  ██      ██ ██ ██ ██ ██ ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//      ██  ██   █████ ██ ██ █████ ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//      ██  ██   ██ ██ ██ ██ ██    ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  ██████  ████ █████ █████ █████ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//                        ██                                                           
//                     █████                                                           
//
// ------------------------------------------------------------------------------------------------------------------------
// StageCollection

	// context = timeline / item?
	
	/**
	 * Collection that encloses both Element and Shape Collection subclasses
	 */
	stageCollection =
	{
		className:'StageCollection'
	}
	
	StageCollection = Collection.extend(stageCollection);
	StageCollection.toString = function()
	{
		return '[class StageCollection]';
	}

// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                             ██   ██████       ██ ██              ██   ██             
//  ██     ██                             ██   ██           ██ ██              ██                  
//  ██     ██ █████ ████████ █████ █████ █████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  █████  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██  ██   ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ █████ ██ ██ ██ █████ ██ ██  ██   ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//  ██     ██ ██    ██ ██ ██ ██    ██ ██  ██   ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  ██████ ██ █████ ██ ██ ██ █████ ██ ██  ████ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// ElementCollection

	// context = document / item / layer / frame?

	elementCollection =
	{
		className:'ElementCollection',
		
		dom:null,
		
		constructor:function(elements)
		{
			this.dom = fl.getDocumentDOM();
			if(!this.dom)
			{
				throw new Error('ElementCollection requires that a document be open before instantiation');
			}
			this.base(elements);
		},
		
		/**
		 * Select the elements within the collection
		 */
		select:function()
		{
			this.dom.selectNone();
			this.dom.selection = this.elements;
			return this;
		},
		
		/**
		 * Sets a single property on each element in the collection
		 * @param name {String} The property name
		 * @param value {Object} The property value. Can be any valid value, or a callback of = function the form fn(e,i){} that returns a value
		 * @returns {Collection} The original ElementCollection object
		 */
		attr:function (prop, value)
		{
			
			trace('attr:' + this.elements.length)
			
			var i = 0;
			if(typeof value == 'function')
			{
				this.elements.each(value);
			}
			else
			{
				// 2D properties
					if(prop.match(/(position|size|scale)/))
					{
						// convert values to array format
							if(typeof value === 'number')
							{
								value = [value, value];
							}
							else if(value.x != undefined && value.y != undefined)
							{
								value = [value.x, value.y];
							}
						
						// properties
							switch(prop)
							{
								case 'position':
									prop = ['x','y'];
								break;
							
								case 'size':
									prop = ['width','height'];
								break;
							
								case 'scale':
									prop = ['scaleX','scaleY'];
								break;
							}
							
						// assign
							while(i < this.elements.length)
							{
								this.elements[i][prop[0]] = value[0];
								this.elements[i][prop[1]] = value[1];
								i++;
							}
					}
				
				// 1D properties
					else
					{
						while(i < this.elements.length)
						{
							this.elements[i][prop] = value;
							i++;
						}
					}
			}
			
			return this;
		},
		
		
		/**
		 * Reorder the elements om teh stage by an arbitrary property
		 * @param prop {String} The property to compare
		 * @param reverseOrder {Boolean} Optionally arrange in reverse order
		 * @returns {Collection} The original ElementCollection object
		 */

		// look up more efficient sort functions?
		
		
		orderBy:function(prop, reverseOrder)
		{
			if(prop.match(/(name|elementType|x|y|width|height|size|rotation|scaleX|scaleY|transformX|transformY|skewX|skewY)/))
			{
				// helper functions
					getProperty = function(element, prop)
					{
						if(prop == 'size')
						{
							return element.width * element.height;
						}
						return element[prop];
					}
					
					cmp = function(a, b)
					{
						var aProp = getProperty(a, prop);
						var bProp = getProperty(b, prop);
						return aProp < bProp ? -1 : (aProp > bProp ? 1 : 0);
					}
					
				// grab the array and sort it
					var arr = this.elements;
					arr = arr.sort(cmp);
					
				// reorder elements
					this.dom.selectNone();
					arr.forEach
					(
						function(e)
						{
							this.dom.selection = [e];
							this.dom.arrange(reverseOrder ? 'back' : 'front');
							/*
							this.dom.selection = [e];
							this.dom.clipCut();
							this.dom.clipPaste(true)
							*/
						}
					)
					this.dom.selection = this.elements;
			}
			return this;
		},
		
		
		/**
		 * Align, distribute, space or match elements to one another
		 * @param type {String} align, distribute, space, size
		 * @param props {String} The specific arguments for the arrange type. Acceptable values are
		 * 						align:      left,right,top,bottom,top left,top right,bottom left,bottom right,vertical,horizontal,center
		 * 						distribute: 1 or 2 of left,horizontal,right,top,vertical,bottom
		 * 						space:      vertical,horizontal
		 * 						match:      width,height,size
		 * @param toStage {Boolean} Use the stage bounding box
		 */
		arrange:
		{
			dom:fl.getDocumentDOM(),
			
			align:function(type, props, toStage)
			{
				if(props.match(/\b(left|right|top|bottom|top left|top right|bottom left|bottom right|vertical|horizontal|center)\b/))
				{
					// special props
						if(props === 'center')
						{
							props = ['vertical center', 'horizontal center'];
						}
						else if(props.match(/(vertical|horizontal)/))
						{
							props = [props + ' center'];
						}
						else
						{
							props = props.split(' ');
						}
					
					// align
						for(var i = 0; i < props.length; i++)
						{
							this.dom.align(props[i], toStage);
						}
				};
				
				return this;
			},
			
			distribute:function(type, props, toStage)
			{
				props = props.split(' ');
				for(var i = 0; i < props.length; i++)
				{
					if(props[i].match(/(left|horizontal|right|top|vertical|bottom)/))
					{
						if(props[i].match(/(horizontal|vertical)/))
						{
							props[i] += ' center';
						}
						else
						{
							props[i] += ' edge';
						}
						this.dom.distribute(props[i], toStage);
					}
				}
				return this;
			},
			
			space:function(type, props, toStage)
			{
				if(props.match(/\b(vertical|horizontal)\b/))
				{
					// variables
						props = props.match(/(vertical|horizontal)(\s+(-?\d+))?/);
						var direction = props[1];
						var space = props[3];
						
					// custom spacing routine
						if(space)
						{
							var val = 0;
							space = parseInt(space);
							if(direction === 'horizontal')
							{
								this.orderBy('x');
								for(var i = 0; i < this.elements.length; i++)
								{
									this.elements[i].x = val;
									val += this.elements[i].width + space;
								}
							}
							else
							{
								this.orderBy('y');
								for(var i = 0; i < this.elements.length; i++)
								{
									this.elements[i].y = val;
									val += this.elements[i].height + space;
								}
							}
						}
					// standard spacing
						else
						{
							this.dom.space(props, toStage);
						}
				}
				return this;
			},
			
			match:function(type, props, toStage)
			{
				if(props.match(/(width|height|size)/))
				{
					this.dom.match(props.match(/(width|size)/), props.match(/(height|size)/), toStage);
				}
				return this;
			}
		},
		
		/**
		 * Repositions element positions to round multiples of numbers
		 * @param precision {Number|Array} What precision to reposition to - for example, 1 is every pixel, 10 is every 10 pixels. Pass in an array for different y and y values
		 * @param rounding {Number} Round down(-1), nearest(0), or up(1). Defaults to nearest(0)
		 * @returns {Collection} The original ElementCollection object
		 */
		toGrid:function(precision, rounding)
		{
			// get precision
				if(typeof precision == 'number')
				{
					precision = {x:precision, y:precision};
				}
				else if(precision && precsion instanceof Array)
				{
					precision = {x:precision[0], y:precision[1]};
				}
				else
				{
					precision = {x:1, y:1};
				}
				
			// rounding: down(-1), nearest(0), or up(1)
				rounding = rounding || 0;
				
			// offset
				if(rounding < 0)
				{
					var offset = {x:0.001, y:0.001};
				}
				else if(rounding > 0)
				{
					var offset = {x:precision.x -0.001, y:precision.y - 0.001};
				}
				else
				{
					var offset = {x:precision.x * 0.5, y:precision.y * 0.5};
				}
				
			// main code
				for(var i = 0 ; i < this.elements.length; i++)
				{
					var element	= this.elements[i];
					
					var x		= element.x + offset.x;
					var y		= element.y + offset.y;
					
					x			-= x % precision.x;
					y			-= y % precision.y;
					
					element.x	= x;
					element.y	= y;
				}
				
			// return
				return this;
		},
		
		/**
		 * Randomizes properties of the elements
		 * @param properties {Object} An object containing property names and values
		 * @returns {Collection} The original ElementCollection object
		 */
		 
		 /*
		 
			Maybe move the random methods to the NumberUtils class?
			
			from and to methods
			Number from and to methods
			
			Should they be on the class itself (Number.randomize(val)) or in a Utils class (NumberUtils.randomize(num, val))
		*/
		randomize:function(properties)
		{
			/**
			 * Return a random value or randomly modifiy a value by +, -, %
			 * @param value {Number} A value to modify
			 * @param modifier {Number|String} A modifier value. String values can have optional leading +/- and a trailing %
			 * @returns {Number} The modified value
			 */
			randomizeValue = function(value, modifier)
			{
				if(modifier != undefined)
				{
					if(modifier instanceof Array)
					{
						return modifier[0] + (modifier[1] - modifier[0]) * Math.random();
					}
					else if(typeof modifier == 'string')
					{
						// value
							var modifierValue =  Math.abs(parseInt(modifier));
							
							//trace(modifierValue)
							
						// percentage
							if(modifier.substring(-1,1) === '%')
							{
								modifierValue = value * (modifierValue / 100);
							}
							
						// multiplier
							if(modifier.substring(0,1) === '*')
							{
								return value * modifierValue * Math.random();
							}
							
						// more than
							else if(modifier.substring(0,1) === '+')
							{
								return value + modifierValue * Math.random();
							}
							
						// less than
							else if(modifier.substring(0,1) === '-')
							{
								return value - modifierValue * Math.random();
							}
							
						// either side of
							else
							{
								return value + (modifierValue * Math.random()) - (modifierValue / 2);
							}
					}
					else
					{
						return modifier * Math.random();
					}
				}
				else
				{
					return value * Math.random();
				}
				return value;
			}
				
			// update variables
				if(properties.position)
				{
					properties.x = properties.position.x;
					properties.y = properties.position.y;
				}
	
				if(properties.scale)
				{
					properties.scaleX = properties.scale.x;
					properties.scaleY = properties.scale.y;
				}
	
				if(properties.size)
				{
					properties.width = properties.size[0];
					properties.height = properties.size[1];
				}
	
			// loop
				for(var i = 0; i < this.elements.length; i++)
				{
					for(var prop in properties)
					{
						var element = this.elements[i];
						var value = randomizeValue(element[prop], properties[prop]);
						if(prop.match(/(x|y|width|height|rotation|scaleX|scaleY|transformX|transformY|skewX|skewY)/))
						{
							element[prop] = value;
						}
					}
				}
				
			// return
				return this;
			
		},
		
		
		/**
		 * Centers the transform points of the elements
		 * @param state {Boolean} Sets the transform point to the center (true) or the original pivot point (false). Defaults to true
		 * @returns {Collection} The original ElementCollection object
		 */
		centerTransformPoint:function(state)
		{
			// need to use matrix math on this one!
			
			function center(e, i)
			{
				if(false)
				{
					var rot = e.rotation;
					
					e.rotation
					var mat = e.matrix;
					var mat2 = fl.Math.invertMatrix(e.matrix)
					
					//$debug(e.matrix)
					
					
					//fl.Math.concatMatrix()
					mat2.tx = e.width/2;
					mat2.ty = e.height/2;
					
					trace(e.matrix)
					
					/*
					var cMat = {a:1, b:0, c:0, d:1, tx:e.width/2, ty:e.height/2};
					*/
					
					
					/*
					e.matrix = mat;
					*/
				}
					/*
					var invMat = fl.Math.invertMatrix(e.matrix)
					e.matrix = fl.Math.concatMatrix(mat, invMat);
					*/
					
					var mat = e.matrix
					var b = e.matrix.b;
					var c = e.matrix.c;
					
					var cMat = {a:mat.a, b:0, c:0, d:mat.d, tx:mat.tx, ty:mat.ty};
					
					e.matrix = cMat;
					e.setTransformationPoint( {x:(e.width/2) * (1/e.scaleX), y:(e.height/2) * (1/e.scaleY)} );
					e.matrix = mat;
					
							
				//e.setTransformationPoint( {x:e.width/2, y:e.height/2} );
				
				//e.setTransformationPoint( {x:e.width/2, y:e.height/2} );
			}
			this.each(center);
			return this;
		},
		
		/**
		 * Resets the transform of the elements
		 * @returns {Collection} The original ElementCollection object
		 */
		resetTransform:function()
		{
			var selection = this.dom.selection;
			this.dom.selectNone();
			this.dom.selection = this.elements;
			this.dom.resetTransformation();
			this.dom.selectNone();
			this.dom.selection = this.elements;
			return this;
		},
		
		/**
		 * Numerically renames elements in order
		 * @param baseName {String} The basename for your objects
		 * @param separator {String} An optional separator between the numeric part of the name. Defaults to '_'
		 * @returns {Collection} The original ElementCollection object
		 */
		rename:function (baseName, separator)
		{
			// need to add padding ### :)
			return this.each(function(e, i){e.name = baseName + (separator ? separator : '_') + i;})
		},
		
		/**
		 * Forces the a refreshes of the display after a series of operations
		 * @returns {Collection} The original ElementCollection object
		 */
		refresh:function()
		{
			this.dom.livePreview = true
			return this;
		}
		
	}
	
	ElementCollection = Collection.extend(elementCollection);
	ElementCollection.toString = function()
	{
		return '[class ElementCollection]';
	}

	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                      ██████       ██ ██              ██   ██             
//  ██     ██                      ██           ██ ██              ██                  
//  ██     █████ █████ █████ █████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//  ██████ ██ ██    ██ ██ ██ ██ ██ ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//      ██ ██ ██ █████ ██ ██ █████ ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//      ██ ██ ██ ██ ██ ██ ██ ██    ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//  ██████ ██ ██ █████ █████ █████ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//                     ██                                                              
//                     ██                                                              
//
// ------------------------------------------------------------------------------------------------------------------------
// ShapeCollection



// ------------------------------------------------------------------------------------------------------------------------
//
//  ██   ██       ██       
//  ███ ███                
//  ███████ █████ ██ █████ 
//  ██ █ ██    ██ ██ ██ ██ 
//  ██   ██ █████ ██ ██ ██ 
//  ██   ██ ██ ██ ██ ██ ██ 
//  ██   ██ █████ ██ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Main

// ---------------------------------------------------------------------------------------------------------------------
// register classes with xjsfl
	
	xjsfl.classes.register('UtilityObject', UtilityObject);
	xjsfl.classes.register('Collection', Collection);
	xjsfl.classes.register('LayerCollection', LayerCollection);
	//xjsfl.classes.register('StageCollection', StageCollection);
	xjsfl.classes.register('ItemCollection', ItemCollection);
	xjsfl.classes.register('ElementCollection', ElementCollection);





if( ! xjsfl.file.loading )
{
	
	// utilitiy functions
		trace = fl.trace;
		clear = fl.outputPanel.clear
		dom = fl.getDocumentDOM();
		
		
		clear();
		/*
		
		function Test()
		{
			UtilityObject.apply(this, arguments);
			this.className = 'Test';
		}
		Test.prototype = new UtilityObject;
		Test.prototype.constructor = Test;
		
		
		var test = new Test();
		test.prototypeChain(true)


		Object.prototype.is = function(classDef)
		{
			return this.constructor == classDef;
		}
	 */
			
	// functions	
		test = function(e, i)
		{
			trace([this, e.name, i].join(' | '));
			new Error()
		}
		
	// code
		dom.selectAll();
		var c = new ElementCollection(fl.getDocumentDOM().selection);
		
		
		
		c
			.each(test)
			//.rename('dave')
			//.resetTransform()
			
			
			.orderBy('x', true)
			//.distribute(true, true)
			.randomize({rotation:'360', position:{x:300, y:300}})
			.toGrid(100)
			//.randomize({width:[20, 100, 20], height:[20, 100, 20], x:800, y:400, rotation:360, tint:0}) //
	/*
			*/
					
			/*
		c
			.each(function(e, i){e.scaleX = e.scaleY = 1})
			.filter(function(){return Math.random() < 0.66})
			.each(function(e, i){e.scaleX = e.scaleY = 0.66})
			.filter(function(){return Math.random() < 0.5})
			.each(function(e, i){e.scaleX = e.scaleY = 0.33})
			*/
								
			/*
			.resetTransform()
			.attr('scale', 1)
			.filter(function(){return Math.random() < 0.66})
			.attr('scale', 0.66)
			.filter(function(){return Math.random() < 0.5})
			.attr('scale', 0.33)
			*/
					
			//.arrange.space('vertical -20')
			//.arrange('space', 'horizontal 10')
			//.arrange('align', 'top')

			
		
		/*
		try{
		}
		catch(e)
		{
			for(var i in e)
			{
				trace(i + ':' + e[i])
			}	
		}
		*/
}


