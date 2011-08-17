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

	xjsfl.classes.require(this, 'Class', 'class');

	/**
	 * A base class which contains some utility methods for debugging and development productivity
	 */
	var utilityObject =
	{
		className:'UtilityObject',
		
		/**
		 * A chainable utility function, that allows an external callback function to be called a single time
		 * @param callback	{Function}		Function to call
		 * @param params	{Array}			Optional arguments to be passed to the callback
		 * @returns			{Collection}	The original Collection object
		 */
		trace:function(str)
		{
			fl.trace(str);
			return this;
		},
		
		/**
		 * A chainable utility function, that displays the prototype chain
		 * @param trace		{Boolean}		An optional switch to trace the result to the output panel
		 * @returns			{Array}			An array of the 
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
	 * Base Collection class with core methods to iterate over and manipulate elements
	 */
	collection =
	{
		
		elements:[],
			
		className:'Collection',
		
		/**
		 * Collection Constructor
		 * @param	elements	{Array}			An array of values
		 * @returns				{Collection}
		 */
		constructor:function(elements)
		{
			this.add(elements);//elements = elements instanceof Array ? elements : [];
		},

		/**
		 * Calls a function on each element in the collection in forward order (although internally, it's in reverse)
		 * @param callback		{Function}		A callback function to fire on each iteraction
		 * @param params	 	{Array}			An optional array of parameters to pass to the callback function
		 * @param scope		 	{Object}		An optional scope object, defaults to the collection
		 * @returns				{Collection}	The original Collection object
		 */
		each:function(callback, params, scope)
		{
			if(params !== undefined && ! xjsfl.utils.isArray(params))
			{
				throw new TypeError('TypeError: parameter "params" must be an Array in Collection.each()');
			}
			
			params	= [null, null, this.elements].concat(params || []);
			scope	= scope || this;
			var i	= 0;
			while(i < this.elements.length)
			{
				params[0] = this.elements[i];
				params[1] = i;
				callback.apply(scope, params);
				i++;
			}
			return this;
		},
		
		/**
		 * Calls a function on each element in the collection in reverse (native) order
		 * @param callback		{Function}		A callback function to fire on each iteraction
		 * @param params	 	{Array}			An optional array of parameters to pass to the callback function
		 * @param scope		 	{Object}		An optional scope object, defaults to the collection
		 * @returns				{Collection}	The original Collection object
		 */
		reach:function(callback, params, scope)
		{
			if(params !== undefined && ! xjsfl.utils.isArray(params))
			{
				throw new TypeError('TypeError: parameter "params" must be an Array in Collection.reach()');
			}
			
			params	= [null, null, this.elements].concat(params || []);
			scope	= scope || this;
			var i	= this.elements.length - 1, j = 0;
			while(i >= 0)
			{
				params[0] = this.elements[i];
				params[1] = i;
				callback.apply(scope, params);
				i--; j++;
			}
			return this;
		},
		
		/**
		 * Adds elements to the collection
		 * @param elements		{Array}			Adds elements to the collection
		 * @returns				{Collection}	The original Collection object
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
		 * @param index			{Number}		Gets the nth object in the collection
		 * @returns				{Object}		An object
		 */
		get:function(index)
		{
			return this.elements[index];
		},
		
		/**
		 * Removes elements from the collection
		 * @param startIndex	{Number}		An integer that specifies at what position to remove elements
		 * @param deleteCount	{Number}		The number of elements to be removed
		 * @returns				{Collection}	The original Collection object
		 */
		remove:function(startIndex, deleteCount)
		{
			this.elements.splice(startIndex, deleteCount || 1);
			return this;
		},
		
		/**
		 * Filters the collection using a callback function
		 * @param callback		{Function}		A callback function to test each element of the array, of the format function(element, index, elements)
		 * @param thisObject	{Object}		Object to use as this when executing callback
		 * @returns				{Collection}	The original Collection object
		 */
		filter:function(callback, thisObject)
		{
			this.elements = this.elements.filter(callback, thisObject || this)
			return this;
		},
		
		/**
		 * Returns the first index at which a given element can be found in the array, or -1 if it is not present
		 * @param element		{Object}		Element to locate in the array
		 * @param fromIndex 	{Number}		Optional index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
		 * @returns				{Number}		The first index at which the element is found, or -1 if it is not present
		 */
		indexOf:function(element, fromIndex)
		{
			return this.elements.indexOf(element, fromIndex);
		},
		
		/**
		 * Modifies a particular attribute on all items in the collection
		 * @param	prop		{Object}		An object containing name:value pairs of attribute to modify
		 * @param	prop		{String}		The name of the attribute to modify
		 * @param	value		{Value}			A value attribute value
		 * @param	value		{Function}		A callback function that returns a value, of the format function(element, index, elements);
		 * @returns				{Collection}	The current Collection
		 */
		attr:function(prop, value)
		{
			if(typeof prop === 'object')
			{
				for(var name in prop)
				{
					this.attr(name, prop[name]);
				}
			}
			else
			{
				var fn = typeof value === 'function' ? value : function(){ return value; };
				for(var i = 0; i < this.elements.length; i++)
				{
					this.elements[i][prop] = fn(this.elements[i], i, this.elements);
				}
			}
			return this;
		},
		
		/**
		 * A chainable utility function, that allows an external callback function to be called a single time
		 * @param callback	{Function}		Function to call
		 * @param ...params					Optional arguments to be passed to the callback
		 * @returns			{Collection}	The original Collection object
		 */
		call:function(callback)
		{
			var params = xjsfl.utils.getArguments(arguments, 1);
			callback.apply(this, params);
			return this;
		},
		
		/**
		 * A chainable utility function, that allows an external callback function to be called a single time
		 * @param callback	{Function}		Function to call
		 * @param params	{Array}			Optional arguments to be passed to the callback
		 * @param scope		{Object}		An optional scope to run the function in, default to the collection
		 * @returns			{Collection}	The original Collection object
		 */
		apply:function(callback, params, scope)
		{
			callback.apply(scope || this, params);
			return this;
		},
		
		/**
		 * Utility function to list the contents of the collection
		 * @param		
		 * @returns		
		 */
		list:function()
		{
			Output.inspect(this.elements, this.toString(), 1);
			return this;
		},
		
		/**
		 * Return a string representation of the collection 
		 * @returns				{String}		A string representation of the collection
		 */
		toString:function()
		{
			return '[object ' +this.className+ ' length=' + this.elements.length+ ']';
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
					return baseName + ' ' + xjsfl.utils.pad(index + 1, '0', padding);
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
	 * LayerCollection class enacpsulates and modifies Arrays of Layers
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
	 * FrameCollection class enacpsulates and modifies Arrays of Layers
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

	
	/**
	 * ElementCollection class enacpsulates and modifies Arrays of stage Elements
	 */
	elementCollection =
	{
		className:'ElementCollection',
		
		dom:null,
		
		selection:null,
		
		/**
		 * Swap any existing selection for the collection
		 */
		_deselect:function(state)
		{
			this.selection = dom.selection || [];
			if(state !== false)
			{
				dom.selectNone();
				dom.selection = this.elements;
			}
		},
		
		/**
		 * Reselect any user selection
		 */
		_reselect:function()
		{
			dom.selectNone();
			dom.selection = this.selection;
		},
		
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
		 * Finds a single element or groups of elements within the collection
		 * @param	element		{Number}		The index of the element to find
		 * @param	element		{String}		The name of the element to find
		 * @param	element		{RegExp}		A RegExp to match agains the names of the elements (plural) to find
		 * @returns				{Element}		A single element
		 * @returns				{Array}			An array of elements (only if a RegExp is supplied)
		 */
		find:function(element)
		{
			if(element == null)
			{
				element = 0;
			}
			if(typeof element === 'number')
			{
				return this.elements[element];
			}
			else if(typeof element === 'string')
			{
				var i = -1;
				while(i++ < this.elements.length - 1)
				{
					if(this.elements[i].name === element)
					{
						return this.elements[i];
					}
				}
			}
			else if(element instanceof RegExp)
			{
				var i = 0;
				var elements = [];
				while(i++ < this.elements.length)
				{
					if(this.elements[i].name === element)
					{
						elements.push(this.elements[i]);
					}
				}
				return element;
			}
			else if(element instanceof Element)
			{
				return element;
			}
			return null;
		},
		
		/**
		 * Select one or all of the elements within the collection
		 * @param	element		{Boolean}			An optional true flag to select all elements (the default)
		 * @param	element		{Number}			An optional index of the element to select
		 * @param	element		{String}			An optional name of the element to select
		 * @param	element		{Element}			An optional reference to the element to select
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		select:function(element)
		{
			this.dom.selectNone();
			if(element === true || element == undefined)
			{
				this.dom.selection	= this.elements;
			}
			else
			{
				element				= this.find(element);
				this.dom.selection	= [element];
			}
			return this;
		},
		
		/**
		 * Move the collection on stage to, or by, x and y values
		 * @param	x			{Number}			The x pixel value to move to, or by
		 * @param	y			{Number}			The y pixel value to move to, or by
		 * @param	relative	{Boolean}			An optional flag to move the elements relative to their current position, defaults to false
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		move:function(x, y, relative)
		{
			// variables
				x = x || 0;
				y = y || 0;
				
			// move relative
				if(relative)
				{
					for(var i = 0; i < this.elements.length; i++)
					{
						var element = this.elements[i];
						element.x = element.x + x;
						element.y = element.y + y;
					}
				}
				
			// move absolute
				else
				{
					// get bounds
						this._deselect();
						var bounds = dom.getSelectionRect();
						
					// loop
						for(var i = 0; i < this.elements.length; i++)
						{
							var element	= this.elements[i];
							element.x	= (element.left - bounds.left) + (element.x - element.left) + x;
							element.y	= (element.top - bounds.top) + (element.y - element.top) + y;
						}
						
					// reselect
						this._reselect();
				}
				
			// refresh
				this.refresh();
				
			// return
				return this;
		},
		
		/**
		 * Duplicates and updates the current collection
		 * @param	add			{Boolean}			An optional flag to add the duplicated items to the current collection, defaulst to false
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		duplicate:function(add)
		{
			this._deselect();
			this.dom.duplicateSelection();
			this.elements = add ? this.elements.concat(this.dom.selection) : this.dom.selection;
			this.refresh();
			return this;
		},
		
		/**
		 * Sets a single property on each element in the collection
		 * @param	prop		{Object}			A hash of valid name:value properties
		 * @param	prop		{String}			The name of the property to modify
		 * @param	value		{Value}				A valid property value
		 * @param	value		{Array}				An array of property values
		 * @param	value		{Object}			An Object of x, y property values
		 * @param	value		{Function}			A callback function of the format function(element, index, elements), that returns a value
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		attr:function (prop, value)
		{
			//TODO Update to handle 3D properties
			//TDOD Update to handle alpha, brightness, tint, filters
			
			// if a hash is supplied, recurse the name:values
				if(typeof prop === 'object')
				{
					var props = prop;
					for(prop in props)
					{
						this.attr(prop, props[prop]);
					}
					return this;
				}
			
			// if 2D properties, recurse sub-properties
				if(/^(pos|position|size|scale)$/.test(String(prop)))
				{
					// convert values to array format
						if(typeof value === 'number')
						{
							var values = [value, value];
						}
						else if(value.x != undefined && value.y != undefined)
						{
							var values = [value.x, value.y];
						}
						else
						{
							values = undefined;
						}
					
					// get prop names
						switch(prop)
						{
							case 'position':
							case 'pos':
								var x = 'x';
								var y = 'y';
							break;
						
							case 'size':
								var x = 'width';
								var y = 'height';
							break;
						
							case 'scale':
								var x = 'scaleX';
								var y = 'scaleY';
							break;
						}
						
					// set properties
					
						//TODO modify width and height to update in object-space (rotate, resize, rotate back)
						//TODO Add screenwidth and screenheight properties
						
						for(var i = 0; i < this.elements.length; i++)
						{
							values				= typeof value === 'function' ? value.apply(this, [this.elements[i], i, this.elements]) : value;
							values				= xjsfl.utils.isArray(values) ? [values[0], values[1]] : [values, values];
							this.elements[i][x]	= values[0]
							this.elements[i][y]	= values[1]
						}
						
					// return
						return this;
				}
			
			// if 1D properties, assign
				else
				{
					var fn = typeof value === 'function' ? value : function(){ return value; };
					for(var i = 0; i < this.elements.length; i++)
					{
						this.elements[i][prop] = fn(this.elements[i], i, this.elements);
					}
				}
			
			return this;
		},
		
		/**
		 * Numerically renames elements in order
		 * @param baseName		{String}			The basename for your objects
		 * @param padding		{Number}			An optional length to pad the numbers to the elements are renamed
		 * @param padding		{Boolean}			An optional flag to pad the numbers as they are created
		 * @param startIndex	{Number}			An optional number to start renaming from. Defaults to 1
		 * @param separator		{String}			An optional separator between the numeric part of the name. Defaults to '_'
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		rename:function (baseName, padding, startIndex, separator)
		{
			// padding function
				function rename(element, index, elements)
				{
					var number		= padding > 0 ? xjsfl.utils.pad(startIndex + index, 0, padding) : index;
					element.name	= baseName + number;
				}
				
			// variables
				separator	= separator || '_';
				startIndex	= startIndex || 1;
				baseName	= baseName + separator;
				padding		= padding == undefined ? true : padding;
				padding		= padding === true ? String(this.elements.length).length : padding;
				
			// do it
				this.elements.forEach(rename);
				
			// return
				return this;
		},
		
		/**
		 * Removes all elements from the collection and the stage
		 * @returns		
		 */
		deleteElements:function()
		{
			this.dom.selectNone();
			this.dom.selection = this.elements;
			this.dom.deleteSelection;
			this.elements = [];
			return this;
		},
		

		/**
		 * Reorder the elements om the stage by an arbitrary property
		 * @param	prop			{String}			The property to compare. Available properties are 'name|elementType|x|y|width|height|size|rotation|scaleX|scaleY|transformX|transformY|skewX|skewY'
		 * @param	reverseOrder	{Boolean}			Optionally arrange in reverse order
		 * @returns 				{ElementCollection}	The original ElementCollection object
		 */
		orderBy:function(prop, reverseOrder)
		{
			
		// look up more efficient sort functions?
			if(prop.match(/(name|elementType|x|y|width|height|size|left|top|rotation|scaleX|scaleY|transformX|transformY|skewX|skewY)/))
			{
				// update selection
					this._deselect(false);
					
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
					var arr = [].concat(this.elements);
					arr = arr.sort(cmp);
					
				// reorder elements
					this.dom.selectNone();
					arr.forEach
					(
						function(element)
						{
							this.dom.selection = [element];
							this.dom.arrange(reverseOrder ? 'back' : 'front');
						}
					)
					
				// re-order
					this.elements = arr;
					
				// update selection
					this._reselect();
					
			}
			return this;
		},
		
		
		/**
		 * Align elements to one another
		 * @param props		{String}			The specific arguments for the arrange type. Acceptable values are 'left,right,top,bottom,top left,top right,bottom left,bottom right,vertical,horizontal,center'
		 * @param toStage	{Boolean}			Use the stage bounding box
		 * @returns 		{ElementCollection}	The original ElementCollection object
		 */
		align:function(props, element)
		{
			// return early if no elements
				if(this.elements.length == 0)
				{
					return this;
				}
				
			// align
				props = props || 'center';
				if(props.match(/\b(left|right|top|bottom|top left|top right|bottom left|bottom right|vertical|horizontal|center)\b/))
				{
					// update selection
						this._deselect();
						
					// variables
						var align, x, y;
						
					// special props
						if(props === 'center')
						{
							align	= ['vertical center', 'horizontal center'];
							//x		= element.x;
							//y		= element.y;
						}
						else if(/(vertical|horizontal)/.test(props))
						{
							align	= [props + ' center'];
							if(/horizontal/.test(props))
							{
								//x		= element['x'];
							}
							else
							{
								//y		= element['y'];
							}
						}
						else
						{
							align	= props.split(' ');
							//x		= element['x'];
							//y		= element['y'];
						}
					
					// reposition
						//this.attr('x', coords[0]);
						//this.attr('y', coords[1]);
							
					// align
						for(var i = 0; i < align.length; i++)
						{
							dom.align(align[i]);
						}
						
					// update selection
						this._reselect();
				};
			
			return this;
		},
		
		/**
		 * Distribute elements relative to one another from their transformation point
		 * @param props		{String}			1 or 2 of 'left,horizontal,right,top,vertical,bottom'
		 * @param toStage	{Boolean}			Use the stage bounding box
		 * @returns 		{ElementCollection}	The original ElementCollection object
		 */
		distribute:function(props, toStage)
		{
			// return early if no elements
				if(this.elements.length == 0)
				{
					return this;
				}
				
			// update selection
				this._deselect();
				
			// distribute
				props = xjsfl.utils.toArray(props);
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
						dom.distribute(props[i], toStage);
					}
				}
				
			// update selection
				this._reselect();
				
			// return
				return this;
		},
		
		/**
		 * Space elements relative to one another
		 * @param direction	{String}			The direction in which to space. Acceptable values are 'vertical,horizontal'
		 * @param type		{Number}			An optional amount of space to add or subtract between items
		 * @param type		{Boolean}			An optional flag to use the stage bounding box (only has an effect on the root)
		 * @returns 		{ElementCollection}	The original ElementCollection object
		 */
		space:function(direction, type)
		{
			if(/^(horizontal|vertical)$/.test(direction))
			{
				// return early if no elements
					if(this.elements.length == 0)
					{
						return this;
					}
					
				// custom spacing routine
					if(typeof type === 'number')
					{
						// variables
							var x, y, element, offset;
							gutter	= type || 0;
							
						// reorder
							this.orderBy(direction == 'horizontal' ? 'left' : 'top');
							
						// align
							for(var i = 0; i < this.elements.length; i++)
							{
								// element
									element	= this.elements[i];
									
								// move
									if(direction == 'horizontal')
									{
										offset = element.x - element.left;
										i === 0 ? x = element.x - offset : element.x = x + offset;
										x += element.width + gutter;
									}
									else if(direction == 'vertical')
									{
										offset = element.y - element.top;
										i === 0 ? y = element.y - offset : element.y = y + offset;
										y += element.height + gutter;
									}
							}
					}
					
				// standard spacing
					else
					{
						// update selection
							this._deselect();
							
						// make a selection
							dom.selectNone();
							dom.selection = this.elements;

						// space						
							dom.space(direction, !!type);
							
						// update selection
							this._reselect();
					}
			}
			return this;
		},
		
		/**
		 * match elements' dimensions relative to one another
		 * @param	props	{String}			The dimension in which to match. Acceptable values are'width,height,size'
		 * @param	element	{Boolean}			An optional flag (true=biggest, false=smallest) of the element whose dimension(s) you want to match. Defaults to true
		 * @param	element	{Number}			An optional index of the element whose dimension(s) you want to match
		 * @param	element	{String}			An optional name of the element whose dimension(s) you want to match
		 * @param	element	{Element}			An optional reference to the element whose dimension(s) you want to match
		 * @returns 		{ElementCollection}	The original ElementCollection object
		 */
		match:function(prop, element)
		{
			if(/^(width|height|size)$/.test(prop))
			{
				// return early if no elements
					if(this.elements.length == 0)
					{
						return this;
					}
					
				// test
					if(typeof element === 'undefined')
					{
						element = true;
					}
					
				// get element
					if(typeof element === 'boolean')
					{
						element =
						{
							width:	xjsfl.utils.getExtremeValue(this.elements, 'width', element),
							height:	xjsfl.utils.getExtremeValue(this.elements, 'height', element)
						};
					}
					
				// name or index
					else if(typeof element === 'string' || typeof element === 'number')
					{
						element = this.find(element);
					}
					
				// match
					if(element && element instanceof Element)
					{
						trace(element.name)
						if(/^(width|size)$/.test(prop))
						{
							this.attr('width', element.width);
						}
						if(/^(height|size)$/.test(prop))
						{
							this.attr('height', element.height);
						}
					}
					//this.dom.match(props.match(/(width|size)/), props.match(/(height|size)/), toStage);
			}
			return this;
		},
		
		/*
		match:function(props, toStage)
		{
			if(props.match(/(width|height|size)/))
			{
				this.dom.match(props.match(/(width|size)/), props.match(/(height|size)/), toStage);
			}
		},
		*/
		
		/**
		 * Repositions element positions to round multiples of numbers
		 * @param	precision	{Number}			The pixel-precision to reposition to, same for x and y values
		 * @param	precision	{Array}				The pixel-precision to reposition to, different for x and y values
		 * @param	rounding	{Number}			Round down(-1), nearest(0), or up(1). Defaults to nearest(0)
		 * @returns				{ElementCollection}	The original ElementCollection object
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
		
		layout:function(columns, gutter, spacing)
		{
			var element	= this.elements[0];
			var x		= element.x;
			var y		= element.y;
			
			for(var i = 0; i < this.elements.length; i++)
			{
				px			= i % cols;
				py			= (i - x) / cols;
				element		= this.elements[i];
			}
		},
		
		/**
		 * Randomizes any valid element properties
		 * @param	prop		{Object}			An object containing property name:value pairs
		 * @param	prop		{String}			A valid String property names
		 * @param	modifier	{Number}			A multiplier value
		 * @param	modifier	{String}			A valid modifier property: n%, +n, -n, *n
		 * @param	modifier	{Array}				A valid modifier range: [from, to]
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		randomize:function(prop, modifier)
		{
			// object
				if(typeof prop === 'object')
				{
					var props = prop;
					for(prop in props)
					{
						this.randomize(prop, props[prop]);
					}
					return this;
				}
				
			// variable
				var isArray	= xjsfl.utils.isArray(modifier);
				
			// handle single properties
				if(/^(x|y|width|height|rotation|scaleX|scaleY|transformX|transformY|skewX|skewY)$/.test(prop))
				{
					for(var i = 0; i < this.elements.length; i++)
					{
						this.elements[i][prop] = isArray
													? xjsfl.utils.randomValue(modifier)
													: xjsfl.utils.randomizeValue(this.elements[i][prop], modifier);
					}
				}
				
			// handle compound (Array) properties such as position, scale and size
				else if(/^(pos|position|scale|size)$/.test(prop))
				{
					// variables
						var values	= [];
						var element, px, py, value;
						if(prop === 'pos')
						{
							prop = 'position';
						}
						
					// attribute components
						var attrs =
						{
							position:	['x', 'y'],
							scale:		['scaleX', 'scaleY'],
							size:		['width', 'height']
						};
						
					// assign per compound type
						switch(prop)
						{
							case 'position':
								values = isArray ? modifier : [modifier[0],  modifier[1]];
								this.randomize({x:values[0], y:values[1]});
							break;
						
							case 'size':
							case 'scale':
								for(var i = 0; i < this.elements.length; i++)
								{
									// variables
										element			= this.elements[i];
										px				= attrs[prop][0];
										py				= attrs[prop][1];

									// get values
										if(isArray)
										{
											values[0]	= xjsfl.utils.randomizeValue(element[px], modifier[0]);
											values[1]	= xjsfl.utils.randomizeValue(element[py], modifier[1]);
										}
										else if(typeof modifier === 'string')
										{
											value		= xjsfl.utils.randomizeValue(element[px], modifier[0]);
											values		= [value, value];
											trace(element[px], value)
										}
										else
										{
											value		= xjsfl.utils.randomizeValue(Math.max(element[px], element[py]), modifier);
											values		= [value, value];
										}
										
									// assign values
										element[px]		= values[0];
										element[py]		= values[1];
								}
							break;
						}

				}
				
			// return
				return this;
		},
		
		
		/**
		 * Centers the transform points of the elements
		 * @param state		{Boolean}			Sets the transform point to the center (true) or the original pivot point (false). Defaults to true
		 * @returns			{ElementCollection}	The original ElementCollection object
		 */
		centerTransformPoint:function(state)
		{
			// need to use matrix math on this one!
			
			function center(e, i)
			{
				if(false)
				{
					var rot		= e.rotation;
					
					e.rotation
					var mat		= e.matrix;
					var mat2	= fl.Math.invertMatrix(e.matrix)
					
					//$debug(e.matrix)
					
					//fl.Math.concatMatrix()
					mat2.tx		= e.width/2;
					mat2.ty		= e.height/2;
					
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
					
					var mat		= e.matrix
					var b		= e.matrix.b;
					var c		= e.matrix.c;
					
					var cMat	= {a:mat.a, b:0, c:0, d:mat.d, tx:mat.tx, ty:mat.ty};
					
					e.matrix	= cMat;
					e.setTransformationPoint( {x:(e.width/2) * (1/e.scaleX), y:(e.height/2) * (1/e.scaleY)} );
					e.matrix	= mat;
					
							
				//e.setTransformationPoint( {x:e.width/2, y:e.height/2} );
				
				//e.setTransformationPoint( {x:e.width/2, y:e.height/2} );
			}
			this.each(center);
			return this;
		},
		
		/**
		 * Resets the transform of the elements
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		resetTransform:function()
		{
			this._deselect();
			dom.resetTransformation();
			this._reselect();
			return this;
		},
		
		/**
		 * Forces the a refreshes of the display after a series of operations
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		refresh:function()
		{
			this.dom.livePreview = true
			return this;
		},
		
		/**
		 * Utility function to list the contents of the collection
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		list:function()
		{
			Output.list(this.elements, 'name', this.toString());
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




// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.reload(this);
			clear();
			try
			{

		// grab some objects
			dom.selectAll();
			var c = new ElementCollection(fl.getDocumentDOM().selection);
			
		// --------------------------------------------------------------------------------
		// Test sorting
		
			if(1)
			{
				var items = $$(':selected').sort();
				Output.inspect(items.elements, 1);
				

			}
			
		// --------------------------------------------------------------------------------
		// Basic element selection
		
			if(0)
			{
				c
					.each(test)
					//.rename('dave')
					//.resetTransform()
					
					
					.orderBy('x', true)
					//.distribute(true, true)
					.randomize({rotation:'360', position:{x:300, y:300}})
					.toGrid(100)
					//.randomize({width:[20, 100, 20], height:[20, 100, 20], x:800, y:400, rotation:360, tint:0}) //

			}
		
		// --------------------------------------------------------------------------------
		// Basic element selection
		
			if(0)
			{
				c
					.each(function(e, i){e.scaleX = e.scaleY = 1})
					.filter(function(){return Math.random() < 0.66})
					.each(function(e, i){e.scaleX = e.scaleY = 0.66})
					.filter(function(){return Math.random() < 0.5})
					.each(function(e, i){e.scaleX = e.scaleY = 0.33})
										
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
			}
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
