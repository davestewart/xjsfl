/*
var uri = fl.scriptURI.replace(/[^\/]+$/, '') + 'class.jsfl';
fl.trace(uri)
fl.runScript(uri)
*/

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
// UtilityObject

	/**
	 * A base class which contains some utility methods for debugging and development productivity
	 */
	UtilityObject = function()
	{
		this.className = 'UtilityObject';
		this.call = function(a, b, c){};
		this.trace = function(){};
		this.prototypeChain = function(){};
		this.toString = function(){};
		
		UtilityObject.prototype.x = function()
		{
			alert('asa')
			this.x = function(){};
		}
	}
	
	var members =
	{
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
			return '[class ' +(this.hasOwnProperty('className') ? this.className : 'UnnamedClass!') + ']';
		}		
	}
	
	Class.extend(UtilityObject, members);
	
	
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
	Collection = function(elements)
	{
		
		// -----------------------------------------------------------------------------------------------
		// private variables

			/// private elements variable
			var _elements = [];
			
		// -----------------------------------------------------------------------------------------------
		// accessors

			/**
			 * Elements
			 * @param elements {Array} An array of elements
			 */
			this.__defineSetter__
			(
				'elements',
				function(elements)
				{
					if(elements instanceof Array)
					{
						_elements = elements;
					}
				}
			);
			this.__defineGetter__
			(
				'elements',
				function(elements)
				{
					return _elements;
				}
			);
					
			/**
			 * length
			 * @returns {Number} The number of elements in the collection
			 */
			this.__defineGetter__
			(
				'length',
				function(elements)
				{
					return _elements.length;
				}
			);
					
			
		// -----------------------------------------------------------------------------------------------
		// methods


			/**
			 * Calls a on = function each element in the collection in forward order (although internally, it's in reverse)
			 * @param callback {Function} A callback to = function fire on each iteraction
			 * @param arguments {Array} An optional array of arguments to pass to the callback function
			 * @returns {Collection} The original Collection object
			 */
			this.each = function(callback, arguments)
			{
				var i = this.length - 1, j = 0;;
				while(i >= 0)
				{
					callback.apply(this, [this.elements[i], j])
					i--; j++;
				}
				return this;
			}
			
			/**
			 * Calls a on = function each element in the collection in reverse (native) order
			 * @param callback {Function} A callback to = function fire on each iteraction
			 * @param arguments {Array} An optional array of arguments to pass to the callback function
			 * @returns {Collection} The original Collection object
			 */
			this.reach = function(callback, arguments)
			{
				var i = 0;
				while(i < this.length)
				{
					callback.apply(this, [this.elements[i], i])
					i++;
				}
				return this;
			}
			
			/**
			 * Adds elements to the collection
			 * @param elements {Array} Adds elements to the collection
			 * @returns {Collection} The original Collection object
			 */
			this.add = function(elements)
			{
				if(arguments.length == 1 && arguments[0] instanceof Array)
				{
					elements = elements.concat(elements)
				}
				else if(arguments.length > 1)
				{
					elements.concat.apply(this, arguments);
				}
				return this;
			}
			
			/**
			 * Gets an element from the collection
			 * @param index {Number} Gets the nth object in the collection
			 * @returns {Object} An object
			 */
			this.get = function(index)
			{
				return this.elements[elements.length - 1 - index];
			}
			
			/**
			 * Adds elements to the collection
			 * @param startIndex {Number} An integer that specifies at what position to remove elements
			 * @param deleteCount {Number} The number of elements to be removed
			 * @returns {Collection} The original Collection object
			 */
			this.remove = function(startIndex, deleteCount)
			{
				elements.splice(startIndex, deleteCount);
				return this;
			}
			
			/**
			 * Filters the collection using a callback function
			 * @param callback {Function} Function to test each element of the array
			 * @param thisObject {Object} Object to use as this when executing callback
			 * @returns {Collection} The original Collection object
			 */
			this.filter = function(callback, thisObject)
			{
				this.elements = elements.filter(callback, thisObject || this)
				
				trace('filtered:' + elements.length)
				
				this.elements = [];
	
				return this;
			}
			
			/**
			 * Returns the first index at which a given element can be found in the array, or -1 if it is not present
			 * @param element {Object} Element to locate in the array
			 * @param fromIndex {Number} Optional index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
			 * @returns {Number} The first index at which the element is found, or -1 if it is not present
			 */
			this.indexOf = function(element, fromIndex)
			{
				return this.elements.indexOf(element, fromIndex);
			}
			
			this.toString = function()
			{
				return '[Collection: ' + this.length+ ' elements]';
			}
			
			this.debug = function()
			{
				fl.trace('\n' + this.toString());
				this.elements.forEach(function(e, i){trace('  [' + i + '] => ' + e.name)})
			}
			
		// -----------------------------------------------------------------------------------------------
		// initialize

			// initialize elements
			this.elements = elements || [];
			

	}
	
	/**
	 * Extends the collection with new functionallity
	 * @param name {String} The name of the new method
	 * @param fn {Function} The to = function assign
	 * @returns {Collection} The original Collection object
	 */
	Collection.prototype.extend = function(name, fn)
	{
		if(this[name] == undefined)
		{
			this.prototype[name] = fn;
		}
		return this;
	}
	


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
//  ██████ ██                ██ ██             ██████       ██ ██              ██   ██             
//    ██                     ██                ██           ██ ██              ██                  
//    ██   ██ ████████ █████ ██ ██ █████ █████ ██     █████ ██ ██ █████ █████ █████ ██ █████ █████ 
//    ██   ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██     ██ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██ ██ ██ 
//    ██   ██ ██ ██ ██ █████ ██ ██ ██ ██ █████ ██     ██ ██ ██ ██ █████ ██     ██   ██ ██ ██ ██ ██ 
//    ██   ██ ██ ██ ██ ██    ██ ██ ██ ██ ██    ██     ██ ██ ██ ██ ██    ██     ██   ██ ██ ██ ██ ██ 
//    ██   ██ ██ ██ ██ █████ ██ ██ ██ ██ █████ ██████ █████ ██ ██ █████ █████  ████ ██ █████ ██ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// TimelineCollection

	// context = item?


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
	 * FrameCollection class
	 */
	ItemCollection = function()
	{
		
	}


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
	 * FrameCollection class
	 */
	LayerCollection = function()
	{
		
	}

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
	FrameCollection = function()
	{
		
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
	StageCollection = function()
	{
		
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

	ElementCollection = function(elements)
	{
		
		ElementCollection.prototype = new Collection;
		ElementCollection.prototype.constructor = ElementCollection;
		
		Collection.apply(this, arguments);

		this.toString = function()
		{
			return '[ElementCollection: ' + this.length+ ' elements]';
		}
		
		/**
		 * Select the elements within the collection
		 */
		this.select = function()
		{
			fl.getDocumentDOM().selectNone();
			fl.getDocumentDOM().selection = elements;
			return this;
		}
		
		/**
		 * Sets a single property on each element in the collection
		 * @param name {String} The property name
		 * @param value {Object} The property value. Can be any valid value, or a callback of = function the form fn(e,i){} that returns a value
		 * @returns {Collection} The original ElementCollection object
		 */
		this.attr = function (prop, value)
		{
			
			trace('attr:' + elements.length)
			
			var i = 0;
			if(typeof value == 'function')
			{
				elements.each(value);
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
							while(i < elements.length)
							{
								elements[i][prop[0]] = value[0];
								elements[i][prop[1]] = value[1];
								i++;
							}
					}
				
				// 1D properties
					else
					{
						while(i < elements.length)
						{
							elements[i][prop] = value;
							i++;
						}
					}
			}
			
			return this;
		}
		
		
		/**
		 * Reorder the elements om teh stage by an arbitrary property
		 * @param prop {String} The property to compare
		 * @param reverseOrder {Boolean} Optionally arrange in reverse order
		 * @returns {Collection} The original ElementCollection object
		 */

		// look up more efficient sort functions?
		
		
		this.orderBy = function(prop, reverseOrder)
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
					var arr = elements;
					arr = arr.sort(cmp);
					
				// reorder elements
					var dom = fl.getDocumentDOM();
					dom.selectNone();
					arr.forEach
					(
						function(e)
						{
							dom.selection = [e];
							dom.arrange(reverseOrder ? 'back' : 'front');
							/*
							dom.selection = [e];
							dom.clipCut();
							dom.clipPaste(true)
							*/
						}
					)
					dom.selection = elements;
			}
			return this;
		}
		
		
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
		this.arrange = 
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
								for(var i = 0; i < elements.length; i++)
								{
									elements[i].x = val;
									val += elements[i].width + space;
								}
							}
							else
							{
								this.orderBy('y');
								for(var i = 0; i < elements.length; i++)
								{
									elements[i].y = val;
									val += elements[i].height + space;
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
		}
		
		/**
		 * Repositions element positions to round multiples of numbers
		 * @param precision {Number|Array} What precision to reposition to - for example, 1 is every pixel, 10 is every 10 pixels. Pass in an array for different y and y values
		 * @param rounding {Number} Round down(-1), nearest(0), or up(1). Defaults to nearest(0)
		 * @returns {Collection} The original ElementCollection object
		 */
		this.toGrid = function(precision, rounding)
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
				for(var i = 0 ; i < elements.length; i++)
				{
					var element	= elements[i];
					
					var x		= element.x + offset.x;
					var y		= element.y + offset.y;
					
					x			-= x % precision.x;
					y			-= y % precision.y;
					
					element.x	= x;
					element.y	= y;
				}
				
			// return
				return this;
		}
		
		/**
		 * Randomizes properties of the elements
		 * @param properties {Object} An object containing property names and values
		 * @returns {Collection} The original ElementCollection object
		 */
		 
		 /*
		 
			Maye move the random methods to the NumberUtils class?
			
			from and to methods
			Number from and to methods
			
			Should they be on the class itself (Number.randomize(val)) or in a Utils class (NumberUtils.randomize(num, val))
		*/
		this.randomize = function(properties)
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
				for(var i = 0; i < elements.length; i++)
				{
					for(var prop in properties)
					{
						var element = elements[i];
						var value = randomizeValue(element[prop], properties[prop]);
						if(prop.match(/(x|y|width|height|rotation|scaleX|scaleY|transformX|transformY|skewX|skewY)/))
						{
							element[prop] = value;
						}
					}
				}
				
			// return
				return this;
			
		}
		
		
		/**
		 * Centers the transform points of the elements
		 * @param state {Boolean} Sets the transform point to the center (true) or the original pivot point (false). Defaults to true
		 * @returns {Collection} The original ElementCollection object
		 */
		this.centerTransformPoint = function(state)
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
		}
		
		/**
		 * Resets the transform of the elements
		 * @returns {Collection} The original ElementCollection object
		 */
		this.resetTransform = function()
		{
			var dom = fl.getDocumentDOM();
			var selection = dom.selection;
			dom.selectNone();
			dom.selection = elements;
			dom.resetTransformation();
			dom.selectNone();
			dom.selection = elements;
			return this;
		}
		
		/**
		 * Numerically renames elements in order
		 * @param baseName {String} The basename for your objects
		 * @param separator {String} An optional separator between the numeric part of the name. Defaults to '_'
		 * @returns {Collection} The original ElementCollection object
		 */
		this.rename = function (baseName, separator)
		{
			// need to add padding ### :)
			return this.each(function(e, i){e.name = baseName + (separator ? separator : '_') + i;})
		}
		
		/**
		 * Forces the a refreshes of the display after a series of operations
		 * @returns {Collection} The original ElementCollection object
		 */
		this.refresh = function()
		{
			fl.getDocumentDOM().livePreview = true
			return this;
		}
		
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
	
	/*
	if(xjsfl && xjsfl.classes)
	{
		xjsfl.classes.add('UtilityObject', UtilityObject);
		xjsfl.classes.add('Collection', Collection);
		xjsfl.classes.add('LayerCollection', LayerCollection);
		xjsfl.classes.add('StageCollection', StageCollection);
		//xjsfl.classes.add('ElementCollection', ElementCollection);
	}
	*/

if(false)
{
	
	// utilitiy functions
		trace = fl.trace;
		clear = fl.outputPanel.clear
		dom = fl.getDocumentDOM();
		
		
		clear();
		
		function Test()
		{
			UtilityObject.apply(this, arguments);
			this.className = 'Test';
		}
		Test.prototype = new UtilityObject;
		Test.prototype.constructor = Test;
		
		
		var test = new Test();
		test.prototypeChain()


		/*
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
					
		c
			/*
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


