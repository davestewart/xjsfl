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

	/**
	 * String
	 * @overview	Additional functionality for native String object
	 * @instance	'hello world'
	 */

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
		 * Append a value to the end of the string
		 * @param	{String}		value		The string to append
		 * @returns	{String}					The new string
		 */
		String.prototype.append = function(value)
		{
			return this + value;
		}
		
		/**
		 * Prepend a value to the start of the string
		 * @param	{String}		value		The string to prepend
		 * @returns	{String}					The new string
		 */
		String.prototype.prepend = function(value)
		{
			return value + this;
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
		 * Injects a template string with values
		 * @param	{Object}	obj			Any Object or instance of Class that with named properties
		 * @param	{Array}		obj			An Array of values, which replace named {placeholders} in the order they are found
		 * @param	{Mixed}		...rest		Instead of an Array, just a list of arguments, which replace named placeholders in the order they are found
		 * @returns {String}
		 */
		String.prototype.inject = function(obj)
		{
			// params
				var params	= Array.slice.call(this, arguments);
				var obj		= params.length > 1
								? params
								: typeof params[0] === 'object'
									? params[0]
									: [params];

			// variables
				var rx		= /{([a-z0-9]+)}/gi;
				var values	= {};
				var length	= 0;


			// replacement functions
				function arrMatch(match, key)
				{
					if(typeof values[key] === 'undefined')
					{
						values[key] = length++;
					}
					return obj[values[key]];
				}

				function objMatch(match, key)
				{
					if(typeof values[key] === 'undefined')
					{
						values[key] = key.indexOf('.') == -1 ? obj[key] : Utils.getDeepValue(obj, key);
					}
					return values[key];
				}

			// return
				return this.replace(rx, obj instanceof Array ? arrMatch : objMatch);
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
				.replace(/^ /g, '').toLowerCase();
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
		 * Converts a the string to sentense case, by capitalising the first letter
		 * @returns {String}
		 */
		String.prototype.toTitleCase = function()
		{
			return this.replace(/^\s+/, '').replace(/(^[a-z]|\s[a-z])/g, function(match){ return match.toUpperCase(); } );
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

	// ----------------------------------------------------------------------------------------------------
	// # Utility

		/**
		 * Converts the line endings of the string to the current system's line endings
		 * @returns	{String}					The new string
		 */
		String.prototype.toSystem = function()
		{
			return this.replace(/(\r\n|\r|\n)/g, xjsfl.settings.newLine)
		}
