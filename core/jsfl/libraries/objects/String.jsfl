// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████  ██        ██             
//  ██      ██                       
//  ██     █████ ████ ██ █████ █████ 
//  ██████  ██   ██   ██ ██ ██ ██ ██ 
//      ██  ██   ██   ██ ██ ██ ██ ██ 
//      ██  ██   ██   ██ ██ ██ ██ ██ 
//  ██████  ████ ██   ██ ██ ██ █████ 
//                                ██ 
//                             █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// String

	// includes
		xjsfl.init(this, ['SimpleTemplate', 'Utils']);
		
	// ----------------------------------------------------------------------------------------------------
	// # Modify content 

		/**
		 * Trims the whitespace from both sides of a string
		 * @returns {String}
		 */
		String.prototype.trim = function()
		{
			return this.replace(/(^\s*|\s*$)/g, '');
		}
	
		/**
		 * Pads a value to a certain length with a specific character
		 * @param	{Number}	length		An optional length, defaults to 6
		 * @param	{String}	chr			An optional padding character, defaults to 0
		 * @param	{Boolean}	right		An optional flag to pad to the right, rather than the left
		 * @returns	{String}				The padded value
		 */
		String.prototype.pad = function(length, chr, right)
		{
			return Utils.pad(this, length, chr, right);
		}
	
		/**
		 * Repeat a string a specified number of times
		 * @param	{Number}	num			The number of times to repeat the string
		 * @returns {String}
		 */
		String.prototype.repeat = function(num)
		{
			return Array(num + 1).join(this);
		}
	
		/**
		 * Populates a template string with values
		 * @param	{Object}	properties	Any Object or instance of Class that with named properties
		 * @param	{Array}		properties	An Array of values, which replace named {placeholders} in the order they are found
		 * @param	{Mixed}		...rest		Instead of an Array, just a list of arguments, which replace named placeholders in the order they are found
		 * @returns {String}
		 */
		String.prototype.populate = function(properties)
		{
			/*
				Conditions where we derive the properties:
				- there are more than 2 arguments
				- properties is an Array
				- properties is a primitive datatype, string, number, boolean
			*/
			if( arguments.length > 1 || Utils.isArray(properties) || (typeof properties in {string:1, number:1, boolean:1, date:1}) )
			{
				var keys	= Utils.toUniqueArray(String(this.match(/{\w+}/g)).match(/\w+/g));
				var values	= Utils.isArray(properties) ? properties : Utils.getArguments(arguments, 0);
				properties	= Utils.combine(keys, values);
			}
			return new SimpleTemplate(this, properties).output;
		}
	
	// ----------------------------------------------------------------------------------------------------
	// # Change case 

		/**
		 * camelCase a string or variable name, separating on alpha-numeric characters
		 * @param	{Boolean}	capitalise	Capitalise the camelCased string
		 * @returns {String}
		 */
		String.prototype.toCamelCase = function(capitalise)
		{
			var part;
			var parts	= this.replace(/(^\W*|\W*$)/g, '').split(/[^0-9a-z]/i);
			var str		= '';
			
			while(parts.length)
			{
				if(str === '')
				{
					str += capitalise ? parts.shift().toSentenceCase() : parts.shift().toLowerCase();
				}
				else
				{
					str += parts.shift().toSentenceCase();
				}
			}
			return str;
		}
		
		/**
		 * Convert a value from "camelCase" to "separate words"
		 * @returns {String}
		 */
		String.prototype.fromCamelCase = function()
		{
			return this
				.replace(/_/, ' ')
				.replace(/([A-Z])([A-Z])([a-z])/g, '$1 $2$3')
				.replace(/([a-z])([A-Z0-9])/g, '$1 $2')
				.replace(/^ /g, '');
		}
		
		/**
		 * Converts a the string to sentense case, by capitalising the first letter
		 * @returns {String}
		 */
		String.prototype.toSentenceCase = function()
		{
			return this.replace(/^\s+/, '').substr(0, 1).toUpperCase() + this.substr(1);
		}
		
		/**
		 * Converts a string of words (separated by non-word characters, such as spaces or dashes) to underscore_case
		 * @returns {String}
		 */
		String.prototype.toUnderscore = function()
		{
			return this.toLowerCase().replace(/(^\W*|\W*$)/g, '').replace(/\W+/g, '_');
		}
		
	// ----------------------------------------------------------------------------------------------------
	// # Escape 

		/**
		 * Escapes an HTML string using HTML entities
		 * @returns {String}
		 */
		String.prototype.escapeHTML = function ()
		{
			return(
				this.replace(/&/g,'&amp;')
				.replace(/>/g,'&gt;')
				.replace(/</g,'&lt;')
				.replace(/'/g,'&apos;')
				.replace(/"/g,'&quot;')
			);                                                                     
		};
		
		/**
		 * Unescapes a string of HTML entities to a valid HTML string
		 * @returns {String}
		 */
		String.prototype.unescapeHTML = function ()
		{
			return(
				this.replace(/&amp;/g,'&')
				.replace(/&gt;/g,'>')
				.replace(/&lt;/g,'<')
				.replace(/&apos;/g,"'")
				.replace(/&quot;/g,'"')
			);                                                                     
		};

