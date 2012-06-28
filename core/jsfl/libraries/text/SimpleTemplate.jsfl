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
// Simple Template

	/**
	 * Simple Template
	 * @overview	A simple templating class
	 * @instance	template
	 */

	xjsfl.init(this, ['Utils']);
		
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

			// ------------------------------------------------------------------------------------------------
			// # Properties

				constructor:SimpleTemplate,
	
				/** @type {String}	The input template */
				input:'',
	
				/** @type {String}	The result of the populated input template */
				output:'',
	
				/** @type {Object}	The SimpleTemplate's data */
				data:null,
	
			// ------------------------------------------------------------------------------------------------
			// # Methods

				/**
				 * Populates the input template with data
				 * @param	{Object}			data	An Object of name:value pairs
				 * @returns	{SimpleTemplate}			The current instance
				 */
				populate:function(data)
				{
					// assign data
						this.data = data;
	
					// variables
						var rx, prop, value, placeholder;
						var output			= this.input;
						var matches			= this.input.match(/{([^}]+)}/g);
						
					// if matches, populate
						if(matches)
						{
							// get placeholders
								var placeholders	= Utils.toUniqueArray(matches);
			
							// loop over placeholders and populate
								for each(placeholder in placeholders)
								{
									// current prop name
										prop		= placeholder.substring(1, placeholder.length - 1);
			
									// skip numeric properties (i.e. {1}) as it breaks the RegExp
										if( ! isNaN(parseInt(prop)) )
										{
											continue;
										}
			
									// current value
										if(prop.indexOf('.') != -1)
										{
											value = Utils.getDeepValue(data, prop) || placeholder;
										}
										else
										{
											value = prop in data ? data[prop] : placeholder;
										}
			
									// convert any nested SimpleTemplates
										if(value instanceof SimpleTemplate)
										{
											value = value.output;
										}
			
									// populate
										rx			= new RegExp(placeholder, 'g');
										output		= output.replace(rx, value);
								}
						}
	
					// update
						this.output = output;
						
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