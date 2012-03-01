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

	(function()
	{
		var methods =
		{
			/**
			 * Trims the whitespace from both sides of a string
			 */
			trim:function()
			{
				return this.replace(/(^\s*|\s*$)/g, '');
			},
		
			/**
			 * Repeat a string a specified number of times
			 * @param	{Number}	num			The number of times to repeat the string
			 */
			repeat:function(num)
			{
				return Array(num + 1).join(this);
			},
		
			/**
			 * Populates a template string with values
			 * @param	{Object}	properties	Any Object or instance of Class that with named properties
			 * @param	{Array}		properties	An Array of values, which replace named placeholders in the order they are found
			 * @param	{Mixed}		...rest		Any values, passed in as parameters, which replace named placeholders in the order they are found
			 */
			populate:function(properties)
			{
				/*
					Conditions where we derive the properties:
					- there are more than 2 arguments
					- properties is an Array
					- properties is a primitive datatype, string, number, boolean
				*/
				if( arguments.length > 1 || Utils.isArray(properties) || (typeof properties in {string:1, number:1, boolean:1, date:1}) )
				{
					var keys	= Utils.toUniqueArray(String(template.match(/{\w+}/g)).match(/\w+/g));
					var values	= Utils.isArray(properties) ? properties : Utils.getArguments(arguments, 1);
					properties	= Utils.combine(keys, values);
				}
				return new SimpleTemplate(this, properties).output;
			},
		
			/**
			 * camelCase a string or variable name, separating on alpha-numeric characters
			 */
			toCamelCase:function()
			{
				var part;
				var parts	= this.replace(/(^\W*|\W*$)/g, '').split(/[^0-9a-z]/i);
				var str		= parts.shift().toLowerCase();
				
				while(parts.length)
				{
					part = parts.shift();
					str += part[0].toUpperCase() + part.substr(1);
				}
				return str;
			},
			
			/**
			 * Convert a value from "camelCase" to "separate words"
			 */
			fromCamelCase:function()
			{
				return this
					.replace(/_/, ' ')
					.replace(/([A-Z])([A-Z])([a-z])/g, '$1 $2$3')
					.replace(/([a-z])([A-Z0-9])/g, '$1 $2')
					.replace(/^ /g, '');
			},
			
			/**
			 * Converts a the string to sentense case
			 */
			toSentenceCase:function()
			{
				return this.substr(0, 1).toUpperCase() + this.substr(1);
			},
			
			/**
			 * Converts a string of words to underscore_case
			 */
			toUnderscore:function()
			{
				return this.toLowerCase().replace(/(^\W*|\W*$)/g, '').replace(/\W+/g, '_');
			}
			
		}
		
		for(var name in methods)
		{
			String.prototype[name] = methods[name];
		}
	})()
