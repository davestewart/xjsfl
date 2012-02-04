// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                ██          ██████                      ██        ██
//  ██                       ██            ██                        ██        ██
//  ██     ██ ████████ █████ ██ █████      ██   █████ ████████ █████ ██ █████ █████ █████
//  ██████ ██ ██ ██ ██ ██ ██ ██ ██ ██      ██   ██ ██ ██ ██ ██ ██ ██ ██    ██  ██   ██ ██
//      ██ ██ ██ ██ ██ ██ ██ ██ █████      ██   █████ ██ ██ ██ ██ ██ ██ █████  ██   █████
//      ██ ██ ██ ██ ██ ██ ██ ██ ██         ██   ██    ██ ██ ██ ██ ██ ██ ██ ██  ██   ██
//  ██████ ██ ██ ██ ██ █████ ██ █████      ██   █████ ██ ██ ██ █████ ██ █████  ████ █████
//                     ██                                      ██
//                     ██                                      ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Simple Template - A simple templating class

	// ------------------------------------------------------------------------------------------------
	// Constructor

		/**
		 * SimpleTemplate constructor
		 * @param	{String}	input		The input template, including {placeholder} variables
		 * @param	{Object}	data		An optional Object of name:value pairs
		 */
		SimpleTemplate = function(input, data)
		{
			if(input)
			{
				this.input = input;
			}
			if(data)
			{
				this.populate(data);
			}
		}

	// ------------------------------------------------------------------------------------------------
	// Static properties

		SimpleTemplate.toString = function()
		{
			return '[class SimpleTemplate]';
		}

	// ------------------------------------------------------------------------------------------------
	// Prototype

		SimpleTemplate.prototype =
		{

			constructor:SimpleTemplate,

			/** @type {String}	The input template */
			input:'',

			/** @type {String}	The result of the populated input template */
			output:'',

			/** @type {Object}	The SimpleTemplate's data */
			data:null,

			/**
			 * Populates the input with data
			 * @param	{Object}			data	An Object of name:value pairs
			 * @returns	{SimpleTemplate}			The current instance
			 */
			populate:function(data)
			{
				// assign data
					this.data = data;

				// variables
					var rx, value;
					var text = this.input;

				// populate
					for(var i in this.data)
					{
						// skip numeric keys (i.e. Arrays) as it breaks the RegExp
							if( ! isNaN(parseInt(i)) )
							{
								continue;
							}

						// create variables
							rx		= new RegExp('{' +i+ '}', 'g');
							value	= this.data[i];

						// convert any nested SimpleTemplates
							if(value instanceof SimpleTemplate)
							{
								value = value.output;
							}

						// populate
							text	= text.replace(rx, value);
					}

				// update
					this.output = text;

				// return
					return this;
			},

			/**
			 * Updates the input template with a new value
			 * @param	{String}			input	A String input template
			 * @returns	{SimpleTemplate}			The current instance
			 */
			update:function(input)
			{
				this.input = input;
				this.populate(this.data);
				return this;
			},

			/**
			 * Prints the populated output of the input
			 * @param	{Boolean}			output	An optional flag to print the table table to the Output panel, defaults to true
			 * @returns	{String}					The populated output
			 * @returns	{SimpleTemplate}			The current instance
			 */
			render:function(trace)
			{
				if(trace === false)
				{
					return this.output;
				}
				fl.trace(this.output);
				return this;
			},

			/**
			 * Returns the String representation of the SimpleTemplate
			 * @returns
			 */
			toString:function()
			{
				return '[object SimpleTemplate input="' +this.input+ '"]';
			}


		}

	// ------------------------------------------------------------------------------------------------
	// Register class with xjsfl

		xjsfl.classes.register('SimpleTemplate', SimpleTemplate);