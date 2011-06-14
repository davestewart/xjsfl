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
// Table - Outputs 2D Array/Object arrays to easily-readable ASCII tables

	// ---------------------------------------------------------------------------------------------------------------
	// Constructor
		
		/**
		 * Table constructor
		 * @param rows			{Array}		The input array
		 * @param keys			{Array}		An optional anything-delimted string, or array of columns to extract from the data, or a Table ORDER Constant to order all columns
		 * @param maxColWidth	{Number}	Max Column Height (returns)
		 * @param maxRowHeight	{Number}	Max Row Width (chars)
		 */
		function Table(rows, keys, maxColWidth, maxRowHeight)
		{
			if(rows instanceof Array && rows.length > 0)
			{
				// variables
					this.rows			= rows;
					this.cols			= [];
					this.colWidths		= [];
					this.rowHeights		= [];
					
				// widths and heights
					this.mW				= maxColWidth || this.mW;
					this.mH				= maxRowHeight || this.mH;
				
				// filter column data
					this.setKeys(keys);
				
				// set max widths
					for(var y = 0; y < this.rows.length; y++)
					{
						for(var x = 0; x < this.keys.length; x++)
						{
							this.setMax(y, x, this.rows[y][this.keys[x]]);
						}
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
		 * @param	rows	
		 * @param	showHeading	
		 * @param	maxColWidth	
		 */
		Table.print = function(rows, keys, maxColWidth)
		{
			new Table(rows, keys, maxColWidth).render(true);
		}
		
		/// Sort table columns in the order they are first found
		Table.ORDER_FOUND	= 0;
		
		/// Sort table columns in alphabetical order
		Table.ORDER_ALPHA	= 1;
		
		/// Sort table columns by the most popular keys first
		Table.ORDER_COUNT	= 2;
		
		/// Sort table columns by the most popular rows first
		Table.ORDER_GROUP	= 3;
		
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
				 * @var array The array for processing
				 */
				rows:		null,
			
				/** 
				 * @type	{Array}	An array of column {key, width, align} objects
				 */
				cols:		[
								{key:'', width:0, align:0}
							],
			
				/**
				 * @var int The Column index of keys
				 */
				keys:		[],
			
				/** 
				 * @var int The column width settings
				 */
				colWidths:	[],
			
				/** 
				 * @var int the column width settings
				 */
				colAligns:	[],
			
				/**
				 * @var int the row lines settings
				 */
				rowHeights:		[],
			
				/**
				 * @var int max row height (returns)
				 */
				mH:		2,
			
				/**
				 * @var int max column width (chars)
				 */
				mW:		100,
			
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
				 * Prints the data to a text table
				 *
				 * @param bool return Set to 'true' to return text rather than printing
				 * @return mixed
				 */
				render:function(output)
				{
					// header
						this.addLine();
						this.addHeading();
						
					// rows
						for(var y = 0; y < this.rows.length; y++)
						{
							this.addRow(y);
						}
						
					// footer
						this.addLine(false);
						
					// output
						if(output)
						{
							fl.trace(this.output);
						}
				
					// return
						return this.output;
				},
			
			// ---------------------------------------------------------------------------------------------------------------
			// set methods
			
				/**
				 * Filter the displayed row data by key (column)
				 * @param	keys	{Array|Number}
				 */
				setKeys:function(keys)
				{
					// default
						keys = keys || Table.ORDER_GROUP;
					
					// string - split into keys
						if(typeof keys == 'string')
						{
							keys = xjsfl.utils.trim(keys.replace(/\s*[^\w ]+\s*/g, ',')).split(/,/g);
						}
						
					// Sort keys according to a Table.ORDER Constant
						else if(typeof keys == 'number')
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
											temp = temp.concat(xjsfl.utils.getKeys(this.rows[y]));
										}
										temp = xjsfl.utils.unique(temp);
									
									// alphapetical-order
										if(keys === Table.ORDER_ALPHA)
										{
											temp = temp.sort();
										}
										
									// assign
										keys = temp;
								}
								
							// count-order
								else if(keys === Table.ORDER_COUNT)
								{
									// grab all keys individually
										for(var y = 0; y < this.rows.length; y++)
										{
											var props = xjsfl.utils.getKeys(this.rows[y]);
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
								else if(keys === Table.ORDER_GROUP)
								{
									// grab keys per entire row
										for(var y = 0; y < this.rows.length; y++)
										{
											var props = xjsfl.utils.getKeys(this.rows[y]).join(',');
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
									this.keys = xjsfl.utils.getKeys(this.rows[0]);
								}
						}
						
					// if keys are an array, set the keys property
						if(xjsfl.utils.isArray(keys))
						{
							this.keys = keys;
						}
						
				},
				
				/**
				 * Set the maximum width (number of characters) per column before truncating
				 * @param int maxWidth
				 */
				setMaxWidth:function(maxWidth)
				{
					this.mW = Math.floor(maxWidth);
				},
				
				/**
				 * Set the maximum height (number of lines) per row before truncating
				 * @param int maxHeight
				 */
				setMaxHeight:function(maxHeight)
				{
					this.mH = Math.floor(maxHeight);
				},
				
				setMax:function(y, x, value)
				{
					// variables
						var w	= String(value).length;
						var h	= 1;
						
					// constrain width and height to limits
						if(w > this.mW)
						{
							w	= this.mW;
							h	= Math.ceil(w % this.mW);
							if(h > this.mH)
							{
								h = this.mH;
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
				},
				
				setHeading:function()
				{
					// data
						data = [];
						
					// loop through columns
						for(var x = 0; x < this.keys.length; x++)
						{
							var value	= this.keys[x];
							data[x]		= value;
							this.setMax(-1, x, value);
						}
						
					// check data was provided
						if(xjsfl.utils.isArray(data))
						{
							this.head = data;
						}
				},
			
			// ---------------------------------------------------------------------------------------------------------------
			// output methods
			
				/**
				 * Adds a data row to the table output
				 */
				addRow:function(y)
				{
					// loop through each line of the row
						for(var line = 1; line <= this.rowHeights[y]; line++)
						{
							// output
								var output = this.chars.col;
								
							// loop through each column
								for(var x = 0; x < this.keys.length; x++)
								{
									var value	= this.rows[y][this.keys[x]];
									value		= value === undefined ? '' : value;
									var pad		= typeof value == 'number' ? true : false;
									output		+= " ";
									output		+= this.pad(String(value).substr(this.mW * (line-1), this.mW), this.colWidths[x], ' ', pad);
									output		+= " " + this.chars.col;
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
					if(xjsfl.utils.isArray(this.head))
					{
						// output
							var output = this.chars.col;
							
						// loop through columns
							for(var x = 0; x < this.colWidths.length; x++)
							{
								var key		= x;
								var val		= this.colWidths[x];
								var align	= typeof value == 'number';
								
								output += ' ' +
									this.pad(this.head[key], val, ' ', align) +
									' ' +
									this.chars.col;
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
							output += this.chars.row +
								this.pad('', this.colWidths[x], this.chars.row) +
								this.chars.row +
								this.chars.cen;
						}
						
					// add output
						this.output += output + '\n';;
				},
			
			// ---------------------------------------------------------------------------------------------------------------
			// utilities
			
				/**
				 * Pad a string with characters to a certain length
				 * @param	str		{String}	A string to be padded
				 * @param	length	{Number}	The length the string should be padded to
				 * @param	chr		{String}	An optional pad character (defaults to ' ')
				 * @param	left	{Boolean}	An optional switch to pad to the left, rather than right
				 * @returns			{String}	The padded string
				 */
				pad:function(str, length, chr, left)
				{
					chr = chr || ' ';
					while(str.length < length)
					{
						str = left ? chr + str : str + chr;
					}
					return str;
				},
				
				/**
				 * 
				 * @param	hash	
				 * @returns		
				 */
				getSortedKeys:function(hash)
				{
					// sort function
						function byCount(a, b, c)
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
						keys	= xjsfl.utils.unique(keys);
						
					// return
						return keys;
				}
		}
		
	// ---------------------------------------------------------------------------------------------------------------
	// register
	
		xjsfl.classes.register('Table', Table);
		
		
	// ---------------------------------------------------------------------------------------------------------------
	// test code
		
		if( ! xjsfl.file.loading)
		{
			xjsfl.init(this);
			clear();
			
			var data =
			[
				{name:'Folder 1', value:200, symbol:'folder'},
				{name:'Folder 1/Folder 2', value:50, symbol:'folder'},
				{age:'Folder 1/Folder 2/Movieclip 1', value:-7, symbol:'movie clip'},
			]
			
			Table.print(data, 'name              | value | symbol ');
		}
