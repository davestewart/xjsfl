// ------------------------------------------------------------------------------------------------------------------------
//
//  ██
//  ██
//  ██     █████ █████ █████ █████ ████
//  ██     ██ ██ ██ ██ ██ ██ ██ ██ ██
//  ██     ██ ██ ██ ██ ██ ██ █████ ██
//  ██     ██ ██ ██ ██ ██ ██ ██    ██
//  ██████ █████ █████ █████ █████ ██
//                  ██    ██
//               █████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Logger - logs data to a text file

	// ------------------------------------------------------------------------------------------------
	// Constructor

	/**
	 * Logger constructor
	 * @param	{String}	pattern		An optional input pattern
	 * @param	{String}	uriOrPath	An optional URI or path to which to save a log file
	 */
	function Logger(pattern, uriOrPath)
	{
		this.template		= new SimpleTemplate(pattern || '{message}');
		if(uriOrPath)
		{
			uriOrPath		= uriOrPath.replace(/(\.txt)?$/, '.txt');
			this.file		= new File(uriOrPath);
		}
	}

	// ------------------------------------------------------------------------------------------------
	// Static properties

		Logger.toString = function()
		{
			return '[class Logger]';
		}

	// ------------------------------------------------------------------------------------------------
	// Prototype

		Logger.prototype =
		{

			// ------------------------------------------------------------------------------------------------
			// Properties

				/**
				 * @type {SimpleTemplate}	The SimpleTemplate the Logger uses to create the log
				 */
				template:null,

				/**
				 * @type {File}				The File object that contains the log data
				 */
				file:null,

				/**
				 * @type {Number}			An incremental count that can be used within the Template as {count}
				 */
				count:0,

			// ------------------------------------------------------------------------------------------------
			// Public methods

				/**
				 * Log a message (note that the order of $ arguments may be swapped)
				 * @param	{String}	message			The message to log
				 * @param	{Number}	$level			An optional Numbered log level that will rendered into {level} placeholders
				 * @param	{String}	$info			An optional String that will rendered into {info} placeholders
				 * @param	{Boolean}	$trace			An optional Boolean to additionally trace the result to the Output panel (File logging only)
				 * @returns	{Logger}					The current instance
				 */
				log:function(message, $level, $info, $trace)
				{
					// parameter shifting
						var level = '', info = '', trace;
						for each(var arg in [$level, $info, $trace])
						{
							if(typeof arg === 'number')
								level = arg;
							else if(typeof arg === 'string')
								info = arg;
							else if(typeof arg === 'boolean')
								trace = arg;
						}

					// data
						var date	= new Date();
						var time	= [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
						var data	=
						{
							message		:message, // message goes first, so its content can be populated by later variables
							info		:info,
							level		:level,
							timestamp	:date.toUTCString(),
							time		:time,
							millitime	:time + ':' + date.getMilliseconds(),
							count		:this.count++
						}

					// populate
						message		= message ? this.template.populate(data).output : '';

					// save
						if(this.file)
						{
							this.write(message);
							if(trace)
							{
								fl.trace(message);
							}
						}

					// trace
						else
						{
							fl.trace(message);
						}

					// return
						return this;
				},

			// ------------------------------------------------------------------------------------------------
			// Public file-only methods

				/**
				 * Writes directly to the log file, if there is one
				 * @param	{String}	message			The message to log
				 * @returns	{Logger}					The current instance
				 */
				write:function(message)
				{
					if(this.file)
					{
						this.file.contents += message + xjsfl.settings.newLine;
					}
					else
					{
						trace(message);
					}
					return this;
				},

				clear:function()
				{
					this.file.contents = '';
					return this;
				},

				/**
				 * Opens the log file in a text editor, if there is one
				 * @returns	{Logger}		The current instance
				 */
				open:function()
				{
					if(this.file)
					{
						this.file.open();
					}
					return this;
				},

				/**
				 * Reveals the log file in the Explorer / Finder, if there is one
				 * @returns	{Logger}		The current instance
				 */
				reveal:function()
				{
					if(this.file)
					{
						this.file.reveal();
					}
					return this;
				},

				/**
				 * Revoves the log file on disk, if there is one
				 * @returns	{Logger}		The current instance
				 */
				remove:function()
				{
					if(this.file)
					{
						this.file.remove();
					}
					return this;
				},

			// ------------------------------------------------------------------------------------------------
			// File-only accessors

				/**
				 * @type {String}			Get the contents of the log file
				 */
				get contents()
				{
					return this.file ? this.file.contents : null;
				},

				/**
				 * @type {String}			Directly set the contents of the log file
				 */
				set contents(value)
				{
					if(this.file)
					{
						this.file.contents = value;
					}
				},

			// ------------------------------------------------------------------------------------------------
			// Utility methods

				/**
				 * Returns a String representation of the instance
				 * @returns	{Object}		Description
				 */
				toString:function()
				{
					return '[object Logger template="' +this.template.template+ '" path="' +(this.file ? this.file.path : '')+ '"]';
				}
		}

	// ------------------------------------------------------------------------------------------------
	// Register class with xjsfl

		xjsfl.classes.register('Logger', Logger);
