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
// Logger

	/**
	 * Logger
	 * @overview	Logs data to a text file
	 * @instance	logger
	 */

	xjsfl.init(this, ['File', 'SimpleTemplate', 'URI', 'Utils']);
		
	// ------------------------------------------------------------------------------------------------
	// Constructor

		/**
		 * Logger constructor
		 * @param	{String}	template	An optional input pattern
		 * @param	{String}	uriOrPath	An optional URI or path to which to save a log file
		 * @param	{URI}		uriOrPath	An optional URI instance to which to save a log file
		 * @param	{Boolean}	append		An optional Boolean to append (rather than clear) any existing file, defaults to false
		 */
		Logger = function(template, uriOrPath, append)
		{
			this.template = new SimpleTemplate(template || '{message}');
			if(uriOrPath)
			{
				var uri		= URI.toURI(uriOrPath, 1); // convert URI now, so relative paths are processed properly
				this.file	= new File(uri);
				if(append !== true)
				{
					this.clear();
				}
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
			// # Properties

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

				/**
				 * @type {Object}			A hash of triggers
				 * @ignore
				 */
				triggers:{},

			// ------------------------------------------------------------------------------------------------
			// # Logging methods

				/**
				 * Log a message (note that the order of $ arguments may be swapped)
				 * @param	{String}	message			The message to log
				 * @param	{String}	$type			An optional log type String that will be rendered into the {type} placeholders
				 * @param	{Object}	$params			An optional Object of name:value pairs that will be rendered into the user's custom placeholders
				 * @param	{Boolean}	$trace			An optional Boolean to additionally trace the result to the Output panel (File logging only)
				 * @returns	{Logger}					The current instance
				 */
				log:function(message, $type, $params, $trace)
				{
					// parameter shifting
						var type = '', info = '', params = {}, trace;
						for each(var arg in [$type, $params, $trace])
						{
							if(typeof arg === 'string' || typeof arg === 'number')
								type = arg;
							else if(typeof arg === 'object')
								params = arg;
							else if(typeof arg === 'boolean')
								trace = arg;
						}

					// data
						var date	= new Date();
						var time	= [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
						var data	=
						{
							message		:message, // message goes first, so its content can be populated by later variables
							type		:type,
							timestamp	:date.toUTCString(),
							time		:time,
							millitime	:time + ':' + date.getMilliseconds(),
							count		:this.count++
						}

					// user data
						data		= Utils.extend(data, params);

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

					// check in case this log message triggers a callback
						if(this.triggers[type])
						{
							this.triggers[type](this, message, data);
						}

					// return
						return this;
				},

				/**
				 * Add a callback function that should fire when a log with a certain type is logged
				 * @param	{String}	type		The message type to register a callback for
				 * @param	{Function}	callback	The function to call when a log of that type is called
				 * @returns	{Logger}				The current instance
				 */
				addTrigger:function(type, callback)
				{
					this.triggers[type] = callback;
					return this;
				},

			// ------------------------------------------------------------------------------------------------
			// # File-related methods

				/**
				 * Writes directly to the log file, if there is one
				 * @param	{String}	message			The message to log
				 * @param	{Boolean}	trace			An optional Boolean to additionally trace the result to the Output panel
				 * @returns	{Logger}					The current instance
				 */
				write:function(message, trace)
				{
					message = message || '';
					if(this.file)
					{
						this.file.contents += message + xjsfl.settings.newLine;
						if(trace)
						{
							fl.trace(message);
						}
					}
					else
					{
						fl.trace(message);
					}
					return this;
				},

				/**
				 * Clears the log file
				 * @returns	{Logger}		The current instance
				 */
				clear:function()
				{
					if(this.file.exists)
					{
						this.file.contents = '';
					}
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
			// # File-related accessors

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
			// # Utility methods

				/**
				 * Returns a String representation of the instance
				 * @returns	{String}		Description
				 */
				toString:function()
				{
					return '[object Logger template="' +(this.template ? this.template.input : '')+ '" path="' +(this.file ? URI.asPath(this.file.path, true) : '')+ '"]';
				}
		}

	// ------------------------------------------------------------------------------------------------
	// Register class with xjsfl

		xjsfl.classes.register('Logger', Logger);
