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

	/**
	 * ElementCollection class enacpsulates and modifies Arrays of stage Elements
	 */
	ElementCollection =
	{
		className:'ElementCollection',

		dom:null,

		selection:null,

		constructor:function(elements)
		{
			this.dom = $dom;
			if(!this.dom)
			{
				throw new Error('ElementCollection requires that a document be open before instantiation');
			}
			this.base(elements);
		},

		/**
		 * Swap any existing selection for the collection
		 */
		_deselect:function(state)
		{
			this.selection = $selection || [];
			if(state !== false)
			{
				this.dom.selectNone();
				this.dom.selection = this.elements;
			}
		},

		/**
		 * Reselect any user selection
		 */
		_reselect:function()
		{
			this.dom.selectNone();
			this.dom.selection = this.selection;
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
						var bounds = this.dom.getSelectionRect();
						this._deselect();

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
			// deselect existing items
				this._deselect();

			// duplicate
				//alert('before:' + [this.elements.length, this.dom.selection.length])
				this.dom.duplicateSelection();
				var elements	= this.dom.selection;

			// rename elements

				// function
					function parseNames(element)
					{
						var matches = element.name.match(/(.+?)_(\d+$)/);
						if(matches)
						{
							var _name	= matches[1];
							var _pad	= matches[2].length;
							var _num	= parseInt(matches[2]);
							if(_num > num)
							{
								name	= _name;
								num		= _num;
								pad		= _pad;
							}
						}
					}

				// generate data for new names
					var name	= '';
					var num		= 0;
					var pad		= 0;

					this.elements.forEach(parseNames);
					name	= name || 'Item';
					num		= num == 0 ? 1 : num + 1;

				// rename elements
					new ElementCollection(elements).rename(name, pad, num)

			// add / replace elements
				this.elements = add ? this.elements.concat(elements) : elements;

			// reselect
				//alert('after:' + [this.elements.length, this.dom.selection.length])
				this.refresh();
				return this;
		},

		/**
		 * Removes all elements from the collection and the stage
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		deleteElements:function()
		{
			if(this.elements.length)
			{
				this.dom.selectNone();
				this.dom.selection = this.elements;
				this.dom.deleteSelection();
				this.elements = [];
			}
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
		 * Sequentially rename the the items in the collection using an alphanumeric pattern, a callback, or parameters
		 * @param baseName		{String}			The basename for your objects
		 * @param baseName		{String}			A single "name_###" name/number pattern string
		 * @param padding		{Number}			An optional length to pad the numbers to the elements are renamed
		 * @param padding		{Boolean}			An optional flag to pad the numbers as they are created
		 * @param startIndex	{Number}			An optional number to start renaming from. Defaults to 1
		 * @param separator		{String}			An optional separator between the numeric part of the name. Defaults to '_'
		 * @returns				{ElementCollection}	The original ElementCollection object
		 */
		rename:function (baseName, padding, startIndex, separator)
		{
			// function supplied as naseName argument
				if(typeof baseName === 'function')
				{
					callback = baseName;
				}

			// string supplied
				else
				{
					// padding function
						function rename(element, index, elements)
						{
							var num			= index + startIndex;
							var str			= padding > 0 ? xjsfl.utils.pad(num, padding) : num;
							return baseName + str;
						}

					// assign default callback
						callback = rename;

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
							baseName	= baseName || 'clip';
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
					this.elements[i].name = callback(this.elements[i], i, this.elements);
				}

			// return
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
							this.dom.align(align[i]);
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
						this.dom.distribute(props[i], toStage);
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
							this.dom.selectNone();
							this.dom.selection = this.elements;

						// space
							this.dom.space(direction, !!type);

						// update selection
							this._reselect();
					}
			}
			return this;
		},

		/**
		 * match elements' dimensions relative to one another
		 * @param	props	{String}			The dimension in which to match. Acceptable values are'width,height,size'
		 * @param	element	{Element}			An optional reference to the element whose dimension(s) you want to match
		 * @param	element	{String}			An optional name of the element whose dimension(s) you want to match
		 * @param	element	{Number}			An optional index of the element whose dimension(s) you want to match
		 * @param	element	{Boolean}			An optional flag (true=biggest, false=smallest) of the element whose dimension(s) you want to match. Defaults to true
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
						var widths	= xjsfl.utils.getExtremeValues(this.elements, 'width', element);
						var heights	= xjsfl.utils.getExtremeValues(this.elements, 'height', element);

						element =
						{
							width:	element ? widths[1] : widths[0],
							height:	element ? heights[1] : heights[0]
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
						//trace(element.name)
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
			if(this.elements.length)
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
											if(values[2] === true)
											{
												values[0]	= xjsfl.utils.randomValue(modifier[0], modifier[1]);
												values[1]	= values[0];
											}
											else
											{
												values[0]	= xjsfl.utils.randomizeValue(element[px], modifier[0]);
												values[1]	= xjsfl.utils.randomizeValue(element[py], modifier[1]);
											}
										}
										else if(typeof modifier === 'string')
										{
											value		= xjsfl.utils.randomizeValue(element[px], modifier[0]);
											values		= [value, value];
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
			this.dom.resetTransformation();
			this._reselect();
			return this;
		},

		/**
		 * Run a function in each item in the collection by entering edit mode, running the function, then moving onto the next item
		 * @param	callback	{Function}			A function with a signature matching function(element, index, ...params), with "this" referring to the original ItemCollection
		 * @param	params		{Array}				An array of optional parameters to pass to the callback
		 * @param	scope		{Object}			An optional scope to call the method in
		 * @returns				{ItemCollection}	The original ItemCollection
		 */
		exec:function(callback, params, scope)
		{
			var that = this;
			this.elements.forEach
			(
				function(element, index, array)
				{
					if(element.symbolType)
					{
						this.dom.library.editItem(element.libraryItem.name);
						callback.apply(scope || that, [element, index].concat(params));
					}
				}
			)
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
			function getName(element)
			{
				return element.name ? 'name: ' + element.name : (element.libraryItem ? 'item: ' + element.libraryItem.name : 'type: ' + element.elementType);
			}

			Output.list(this.elements, getName, this.toString());
			return this;
		}

	}

	ElementCollection = Collection.extend(ElementCollection);
	ElementCollection.toString = function()
	{
		return '[class ElementCollection]';
	}

	xjsfl.classes.register('ElementCollection', ElementCollection);
