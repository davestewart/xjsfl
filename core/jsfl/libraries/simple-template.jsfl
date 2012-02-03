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
// Simple Template - A simpler version of the Template class

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

			/**
			 * Populates the input with data
			 * @param	{Object}	data		An Object of name:value pairs
			 * @returns	{SimpleTemplate}		The current instance
			 */
			populate:function(data)
			{
				// populate
					var rx;
					var text = this.input;
					for(var i in data)
					{
						rx		= new RegExp('{' +i+ '}', 'g')
						text	= text.replace(rx, data[i]);
					}

				// update
					this.output = text;

				// return
					return this;
			},

			/**
			 * Returns the populated output of the input
			 * @returns	{String}		The populated output
			 */
			render:function()
			{
				return this.output;
			},

			/**
			 * Returns the String representation of the SimpleTemplate
			 * @returns
			 */
			toString:function()
			{
				return '[object SimpleTemplate "' +this.input+ '"]';
			}


		}

	// ------------------------------------------------------------------------------------------------
	// Register class with xjsfl

		xjsfl.classes.register('SimpleTemplate', SimpleTemplate);