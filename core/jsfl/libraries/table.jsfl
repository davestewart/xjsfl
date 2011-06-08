// ---------------------------------------------------------------------------------------------------------------
// constructor
	
	/**
	 * Table constructor
	 * @param rows		{Array}		The input array
	 * @param head		{Boolean}	Show heading
	 * @param maxWidth	{Number}	Max Column Height (returns)
	 * @param maxHeight	{Number}	Max Row Width (chars)
	 */
	function Table(rows, showHeading, maxColWidth, maxRowHeight)
	{
		// return early
			if(rows.length == 0)
			{
				return false;
			}
			
		// variables
			this.rows			= rows;
			this.cols			= [];
			this.colWidths		= [];
			this.rowHeights		= [];
			this.keys			= xjsfl.utils.keys(this.rows[0]);
			
		// widths and heights
			this.mW				= maxColWidth || this.mW;
			this.mH				= maxRowHeight || this.mH;
		
		// set max widths
			for(var y = 0; y < rows.length; y++)
			{
				for(var x = 0; x < this.keys.length; x++)
				{
					this.setMax(y, x, this.rows[y][this.keys[x]]);
				}
			}
			
		// set headers
			this.showHeading(showHeading);
			
			return true;
		
	}

	/**
	 * Static table method to print a table
	 * @param	rows	
	 * @param	showHeading	
	 * @param	maxColWidth	
	 */
	Table.print = function(rows, showHeading, maxColWidth)
	{
		new Table(rows, showHeading, maxColWidth).render(true);
	}
			

// ---------------------------------------------------------------------------------------------------------------
// prototype
	
	Table.prototype =
	{
		// ---------------------------------------------------------------------------------------------------------------
		// variables
		
			/** 
			 * @var array The array for processing
			 */
			rows:		null,
		
			/**
			 * @var int The Column index of keys
			 */
			keys:		[],
		
			/** 
			 * @var int The column width settings
			 */
			colWidths:	[],
		
			/** 
			 * @type	{Array}	An array of column {key, width, align} objects
			 */
			cols:		[],
		
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
		
			head:	false,
			output:	'',
			
			chars:
			{
				cen:	"+",
				row:	"-",
				col:	"|"
			},
			
			
		// ---------------------------------------------------------------------------------------------------------------
		// instantiation
		
			
			/**
			 * Show the headers using the key values of the array for the titles
			 * 
			 * @param bool bool
			 */
			showHeading:function(bool)
			{
				if(bool)
				{
					this.setHeading();
				}
			},
			
			/**
			 * Set the maximum width (number of characters) per column before truncating
			 * 
			 * @param int maxWidth
			 */
			setMaxWidth:function(maxWidth)
			{
				this.mW = Math.floor(maxWidth);
			},
			
			/**
			 * Set the maximum height (number of lines) per row before truncating
			 * 
			 * @param int maxHeight
			 */
			setMaxHeight:function(maxHeight)
			{
				this.mH = Math.floor(maxHeight);
			},
			
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
		// private methods
		
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
					if(y !== false && (this.rowHeights[y] == undefined || this.rowHeights[y] < h))
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
						this.setMax(false, x, value);
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
			 * Adds a data row to the table
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
			 * Adds the heading row to the table
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
			 * Adds a line to the table
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
		
			pad:function(str, length, chr, right)
			{
				chr = chr || ' ';
				while(str.length < length)
				{
					str = right ? chr + str : str + chr;
				}
				return str;
			}
	}
	
// ---------------------------------------------------------------------------------------------------------------
// register

	xjsfl.classes.register('Table', Table);
	
	
// ---------------------------------------------------------------------------------------------------------------
// test code
	
	if(false)
	{
		xjsfl.init(this);
		clear();
		
		var data =
		[
			{name:'Folder 1', value:200, symbol:'folder'},
			{name:'Folder 1/Folder 2', value:50, symbol:'folder'},
			{name:'Folder 1/Folder 2/Movieclip 1', value:-7, symbol:'movie clip'},
		]
		
		Table.print(data, true);
	}
