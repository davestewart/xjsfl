// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██    ██
//    ██         ██    ██
//    ██   █████ █████ ██ █████
//    ██      ██ ██ ██ ██ ██ ██
//    ██   █████ ██ ██ ██ █████
//    ██   ██ ██ ██ ██ ██ ██
//    ██   █████ █████ ██ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Table

	/**
	 * Table
	 * @overview	Outputs 2D Array/Object arrays to easily-readable ASCII tables
	 * @instance	table
	 */

	xjsfl.init(this, ['PropertyResolver', 'Utils']);
		
	// ---------------------------------------------------------------------------------------------------------------
	// Constructor

		/**
		 * Table constructor
		 * @param	{Array}		rows			An input Array of objects
		 * @param	{Object}	rows			An input Object, the properties & values of which will become rows
		 * @param	{String}	caption			An optional String caption that is shown at the top of the table
		 * @param	{Array}		keys			An optional array of columns to extract from the data
		 * @param	{String}	keys			An optional anything-delimted string to extract from the data
		 * @param	{Number}	keys			An optional Table ORDER Constant to order the columns
		 * @param	{Number}	maxColWidth		Max Row Width (chars)
		 * @param	{Number}	maxRowHeight	Max Column Height (carriage returns)
		 */
		Table = function(rows, caption, keys, maxColWidth, maxRowHeight)
		{
			//TODO Add option to automatically skip functions, including constructors

			// if a single, (non-Array) object is passed, transpose properties and values
			// into two columns and only pull out the keys that are specified in keys
				if( ! (rows instanceof Array) )
				{
					// filter column data
						if( ! Utils.isArray(keys) )
						{
							if(typeof keys === 'string')
							{
								keys = Utils.toArray(keys);
							}
							else
							{
								keys = undefined;
							}
						}

					// grab properties
						var obj	= rows;
						var arr = [];
						var row;
						for (var prop in obj)
						{
							if(keys === undefined || keys.indexOf(prop) !== -1)
							{
								var value = PropertyResolver.resolve(obj, prop);
								arr.push({Property:prop, Value:value});
							}
						}

					// values
						this.setMaxWidth(1000);
						this.colAlignOverride	= true;
						rows					= arr;
						keys					= undefined;
				}

			// otherwise, start processing the rows of the Array
				if(rows instanceof Array)
				{
					// variables
						this.rows			= rows;
						this.cols			= [];
						this.colWidths		= [];
						this.rowHeights		= [];

					// widths and heights
						this.maxWidth		= maxColWidth || this.maxWidth;
						this.maxHeight		= maxRowHeight || this.maxHeight;

					// filter column data
						this.setKeys(keys);

					// set max widths
						for(var y = 0; y < this.rows.length; y++)
						{
							for(var x = 0; x < this.keys.length; x++)
							{
								// get element and property name
									var element = this.rows[y];
									var name	= this.keys[x];

								// skip if properties might be unreachable
									if(PropertyResolver.testProperty(name))
									{
										continue;
									}

								// get value
									var value	= this.getCellText(element[name]);

								// set widths
									this.setMax(y, x, value);

							}
						}

					// set caption
						if(caption)
						{
							this.setCaption(caption);
						}

					// add headings
						this.setHeading();
				}
				else
				{
					throw new Error('Table constructor requires that the first argument be an Array, with at least one element');
				}
		}

	// ---------------------------------------------------------------------------------------------------------------
	// static properties

		/**
		 * Static table method to print a table
		 * @param	{Array}		rows			An input Array of objects
		 * @param	{Object}	rows			An input Object, the properties & values of which will become rows
		 * @param	{String}	caption			An optional String caption that is shown at the top of the table
		 * @param	{Array}		keys			An optional array of columns to extract from the data
		 * @param	{String}	keys			An optional anything-delimted string to extract from the data
		 * @param	{Number}	keys			An optional Table ORDER Constant to order the columns
		 * @param	{Number}	maxColWidth		Max Row Width (chars)
		 * @param	{Number}	maxRowHeight	Max Column Height (carriage returns)
		 * @return 	{String}					The String output of the table
		 */
		Table.print = function(rows, caption, keys, maxColWidth, maxRowHeight)
		{
			return new Table(rows, caption, keys, maxColWidth, maxRowHeight).render(true);
		}

		/// Sort table columns in the order they are first found
		Table.ORDER_FOUND	= 0;

		/// Sort table columns in alphabetical order
		Table.ORDER_ALPHA	= 1;

		/// Sort table columns by the most popular keys first
		Table.ORDER_COLUMN	= 2;

		/// Sort table columns by the most popular rows first
		Table.ORDER_ROW		= 3;

		/// Sort table columns by the first row's keys only (this will hide data for some objects!)
		Table.ORDER_FIRST	= 4;


	// ---------------------------------------------------------------------------------------------------------------
	// prototype

		Table.toString = function()
		{
			return '[class Table]';
		}

		Table.prototype =
		{
			// ---------------------------------------------------------------------------------------------------------------
			// variables

				/**
				 * reset constructor
				 */
				constructor:Table,

				/**
				 * @var {Array} The array for processing
				 */
				rows:		null,

				/**
				 * @type {Array} An array of column {key, width, align} objects
				 */
				cols:		[ { key:'', width:0, align:0 } ],

				/**
				 * @var {Number} The Column index of keys
				 */
				keys:		[],

				/**
				 * @type {String} The table's caption
				 */
				caption:	null,

				/**
				 * @var {Number} The column width settings
				 */
				colWidths:	[],

				/**
				 * @var {Number} the column width settings
				 */
				colAligns:	[],


				/**
				 * @type {Number}
				 */
				colAlignOverride:null,

				/**
				 * @var {Number} the row lines settings
				 */
				rowHeights:		[],

				/**
				 * @var {Number} max row height (returns)
				 */
				maxHeight:		2,

				/**
				 * @var {Number} max column width (chars)
				 */
				maxWidth:		100,

				head:	null,

				output:	'',

				chars:
				{
					cen:	"+",
					row:	"-",
					col:	"|"
				},


			// ---------------------------------------------------------------------------------------------------------------
			// public methods

				/**
				 * Renders the data as an ASCII table
				 * @param	{Boolean}	output		An optional flag to print the table table to the Output panel, defaults to true
				 * @return 	{String}				The String output of the table
				 */
				render:function(output)
				{
					// header
						if(this.caption !== null)
						{
							this.addCaption();
						}
						this.addLine();
						this.addHeading();

					// rows
						for(var y = 0; y < this.rows.length; y++)
						{
							this.addRow(y);
						}

					// footer
						this.addLine(false);

					// print
						if(output !== false)
						{
							fl.trace(this.output);
						}

					// return
						return this.output;
				},

				toString:function()
				{
					return '[object Table caption="' +(this.caption || '')+ '" rows="' +(this.rows ? this.rows.length : 0)+ '"]';
				},

			// ---------------------------------------------------------------------------------------------------------------
			// set methods

				/**
				 * Filter the displayed row data by key (column)
				 * @param	{Number}	keys			A Table ORDER constant
				 * @param	{Array}		keys			An array of column names
				 * @param	{String}	keys			An anything-delimited string of key names
				 * @return	{Table}						The current instance
				 */
				setKeys:function(keys)
				{
					// default
						keys = keys || Table.ORDER_ROW;

					// string - split into keys
						if(typeof keys === 'string')
						{
							keys = Utils.toArray(keys);
						}

					// Sort keys according to a Table.ORDER Constant
						else if(typeof keys === 'number')
						{
							if(this.rows)
							{
								// variables
									var temp	= [];
									var hash	= {};

								// found-order or alphapetical-order
									if(keys === Table.ORDER_FOUND || keys === Table.ORDER_ALPHA)
									{
										// found-order
											for(var y = 0; y < this.rows.length; y++)
											{
												temp = temp.concat(Utils.getKeys(this.rows[y]));
											}
											temp = Utils.toUniqueArray(temp);

										// alphapetical-order
											if(keys === Table.ORDER_ALPHA)
											{
												temp = temp.sort();
											}

										// assign
											keys = temp;
									}

								// count-order
									else if(keys === Table.ORDER_COLUMN)
									{
										// grab all keys individually
											for(var y = 0; y < this.rows.length; y++)
											{
												var props = Utils.getKeys(this.rows[y]);
												for each(var prop in props)
												{
													if( ! hash[prop])
													{
														hash[prop] = 0;
													}
													hash[prop] ++;
												}
											}

										// add key values to an array
											keys = this.getSortedKeys(hash);
									}

								// group-order
									else if(keys === Table.ORDER_ROW)
									{
										// grab keys per entire row
											for(var y = 0; y < this.rows.length; y++)
											{
												var props = Utils.getKeys(this.rows[y]).join(',');
												if( ! hash[props])
												{
													hash[props] = 0;
												}
												hash[props] ++;
											}

										// add key values to an array
											keys = this.getSortedKeys(hash);
									}
								// otherwise, just grab the keys from the first row
									else
									{
										this.keys = Utils.getKeys(this.rows[0]);
									}
							}

						}

					// if keys are an array, set the keys property
						if(Utils.isArray(keys))
						{
							this.keys = keys;
						}

					// return
						return this;
				},

				/**
				 * Set the maximum width (number of characters) per column before truncating
				 * @param	{Number}	 maxWidth		The width of the widest column
				 * @return	{Table}						The current instance
				 */
				setMaxWidth:function(maxWidth)
				{
					this.maxWidth = Math.floor(maxWidth);
					return this;
				},

				/**
				 * Set the maximum height (number of lines) per row before truncating
				 * @param	{Number}	maxHeight		The maximum number of lines a row show be
				 * @return	{Table}						The current instance
				 */
				setMaxHeight:function(maxHeight)
				{
					this.maxHeight = Math.floor(maxHeight);
					return this;
				},

				setMax:function(y, x, value)
				{
					// variables
						var w	= this.getCellText(value).length;
						var h	= 1;

					// constrain width and height to limits
						if(w > this.maxWidth)
						{
							w	= this.maxWidth;
							h	= Math.ceil(w % this.maxWidth);
							if(h > this.maxHeight)
							{
								h = this.maxHeight;
							}
						}

					// update col widths
						if(this.colWidths[x] == undefined || this.colWidths[x] < w)
						{
							this.colWidths[x] = w;
						}

					// update row heights
						if(y > -1 && (this.rowHeights[y] == undefined || this.rowHeights[y] < h))
						{
							this.rowHeights[y] = h;
						}

					// return
						return this;
				},

				setHeading:function()
				{
					// data
						var data = [];

					// loop through columns
						for(var x = 0; x < this.keys.length; x++)
						{
							var value	= this.keys[x];
							data[x]		= value;
							this.setMax(-1, x, value);
						}

					// check data was provided
						if(Utils.isArray(data))
						{
							this.head = data;
						}

					// return
						return this;
				},

				/**
				 * Sets the table caption
				 * @param	{String}	caption		A caption that is shown at the top of the table
				 * @returns	{Table}					The current instance
				 */
				setCaption:function(caption)
				{
					this.caption = caption;
					return this;
				},

			// ---------------------------------------------------------------------------------------------------------------
			// output methods

				/**
				 * Adds a data row to the table output
				 */
				addRow:function(y)
				{
					// loop through each line of the row
						for(var i = 0; i < this.rowHeights[y]; i++)
						{
							// output
								var output = this.chars.col;

							// loop through each column
								for(var x = 0; x < this.keys.length; x++)
								{
									// get element and property name
										var element = this.rows[y];
										var name	= this.keys[x];

									// get and format value (need to use PropertyResolver in case Symbols are passed in)
										var value	= PropertyResolver.resolve(element, name);
										var text	= this.getCellText(value).substr(0, this.colWidths[x]);
										var pad		= this.colAlignOverride ? false : (typeof value == 'number' ? true : false);

									// create output
										output		+= " "
													+ this.pad(text.substr(this.maxWidth * i, this.maxWidth), this.colWidths[x], ' ', pad)
													+ " " + this.chars.col;
								}

							// add output
								this.output += output + '\n';;
						}
				},

				/**
				 * Adds the heading row to the table output
				 */
				addHeading:function()
				{
					if(Utils.isArray(this.head))
					{
						// output
							var output = this.chars.col;

						// loop through columns
							for(var x = 0; x < this.colWidths.length; x++)
							{
								var key		= x;
								var val		= this.colWidths[x];
								var align	= typeof value == 'number';

								output += ' '
									+ this.pad(this.head[key], val, ' ', align)
									+ ' '
									+ this.chars.col;
							}

						// add output
							this.output += output + '\n';;

						// border
							this.addLine();
					}
				},

				/**
				 * Adds a line to the table output
				 */
				addLine:function()
				{
					// variables
						var output	= this.chars.cen;

					// loop through columns
						for(var x = 0; x < this.colWidths.length; x++)
						{
							output += this.chars.row
								+ this.pad('', this.colWidths[x], this.chars.row)
								+ this.chars.row
								+ this.chars.cen;
						}

					// add output
						this.output += output + '\n';;
				},

				addCaption:function()
				{
					this.addLine();
					this.output = this.output.replace(/\-\+\-/g, '---');
					this.output += this.chars.col
							+ ' '
							+ this.pad(this.caption, this.output.length - 4)
							+ this.chars.col
							+ '\n';

				},

			// ---------------------------------------------------------------------------------------------------------------
			// utilities

				getCellText:function(value)
				{
					if(typeof value === 'undefined')
					{
						return '';
					}
					else
					{
						value = String(value);
						if(/[\r\n]/.test(value))
						{
							value = value.split(/[\r\n]/).shift().trim() + '...'
						}
					}

					return value;
				},

				/**
				 * Pad a string with characters to a certain length
				 * @param	{String}	str			A string to be padded
				 * @param	{Number}	length		The length the string should be padded to
				 * @param	{String}	chr			An optional pad character (defaults to ' ')
				 * @param	{Boolean}	left		An optional switch to pad to the left, rather than right
				 * @returns	{String}				The padded string
				 */
				pad:function(str, length, chr, left)
				{
					chr = chr || ' ';
					str = String(str);
					while(str.length < length)
					{
						str = left ? chr + str : str + chr;
					}
					return str;
				},

				/**
				 * Utility function to sort keys
				 * @param	{Object}	hash	A hash of keys/counts
				 * @returns	{Array}				A new Array of keys
				 */
				getSortedKeys:function(hash)
				{
					// sort function
						function byCount(a, b)
						{
							var v1 = a.count;
							var v2 = b.count;
							return v1 < v2 ? 1 : (v1 > v2 ? -1 : 0);
						}

					// loop through hash, and create sortable array
						var arr = [];
						for(var key in hash)
						{
							arr.push({key:key, count:hash[key]})
						}

					// sort the array
						arr.sort(byCount)

					// add hash-keys in order to a keys array
						var keys = [];
						for(var i = 0; i < arr.length; i++)
						{
							keys.push(arr[i].key);
						}

					// convert the the array to a string, then to an array, then make unique
						keys	= keys.join(',').split(',');
						keys	= Utils.toUniqueArray(keys);

					// return
						return keys;
				}
		}

	// ---------------------------------------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('Table', Table);
