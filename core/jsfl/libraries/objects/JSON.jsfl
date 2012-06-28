// ------------------------------------------------------------------------------------------------------------------------
//
//     ██ ██████ ██████ ██   ██ 
//     ██ ██     ██  ██ ███  ██ 
//     ██ ██     ██  ██ ████ ██ 
//     ██ ██████ ██  ██ ██ ████ 
//     ██     ██ ██  ██ ██  ███ 
//     ██     ██ ██  ██ ██   ██ 
//  █████ ██████ ██████ ██   ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// JSON 

	/**
	 * JSON
	 * @overview	JSON functionality for JSFL
	 *
	 * jQuery JSON Plugin v2.3-edge (2011-09-25)
	 *
	 * @author		Brantley Harris, 2009-2011
	 * @author		Timo Tijhof, 2011
	 * @source		This plugin is heavily influenced by MochiKit's serializeJSON, which is
	 *				copyrighted 2005 by Bob Ippolito.
	 * @source		Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
	 *				website's http://www.json.org/json2.js, which proclaims:
	 *				"NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
	 *				I uphold.
	 * @license		MIT License <http://www.opensource.org/licenses/mit-license.php>
	 */

(function(){
	
	// ----------------------------------------------------------------------------------------------------
	// local variables

		var hasOwn = Object.prototype.hasOwnProperty;
		var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
		var meta =
		{
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};
	
		/**
		 * Helper function to correctly quote nested strings
		 * @ignore
		 */
		function quoteString( string )
		{
			if ( string.match( escapeable ) )
			{
				return '"' + string.replace( escapeable, function( a ) {
					var c = meta[a];
					if ( typeof c === 'string' ) {
						return c;
					}
					c = a.charCodeAt();
					return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
				}) + '"';
			}
			return '"' + string + '"';
		};

	// ----------------------------------------------------------------------------------------------------
	// class

		JSON =
		{
			/**
			 * Encodes an Object as a JSON String
			 * Non-integer/string keys are skipped in the object, as are keys that point to a function.
			 *
			 * @name	JSON.encode
			 * @param	{Object} 	obj		The json-serializble *thing* to be converted
			 * @returns	{String}			A JSON String
			 */
			encode:function(obj)
			{
				if ( obj === null ) {
					return 'null';
				}
	
				var type = typeof obj;
	
				if ( type === 'undefined' )
				{
					return undefined;
				}
				if ( type === 'number' || type === 'boolean' )
				{
					return '' + obj;
				}
				if ( type === 'string') {
					return quoteString( obj );
				}
				if ( type === 'object' )
				{
					if ( obj.constructor === Date )
					{
						var	month = obj.getUTCMonth() + 1,
							day = obj.getUTCDate(),
							year = obj.getUTCFullYear(),
							hours = obj.getUTCHours(),
							minutes = obj.getUTCMinutes(),
							seconds = obj.getUTCSeconds(),
							milli = obj.getUTCMilliseconds();
	
						if ( month < 10 ) {
							month = '0' + month;
						}
						if ( day < 10 ) {
							day = '0' + day;
						}
						if ( hours < 10 ) {
							hours = '0' + hours;
						}
						if ( minutes < 10 ) {
							minutes = '0' + minutes;
						}
						if ( seconds < 10 ) {
							seconds = '0' + seconds;
						}
						if ( milli < 100 ) {
							milli = '0' + milli;
						}
						if ( milli < 10 ) {
							milli = '0' + milli;
						}
						return '"' + year + '-' + month + '-' + day + 'T' +
							hours + ':' + minutes + ':' + seconds +
							'.' + milli + 'Z"';
					}
					if ( obj.constructor === Array ) {
						var ret = [];
						for ( var i = 0; i < obj.length; i++ ) {
							ret.push( JSON.encode( obj[i] ) || 'null' );
						}
						return '[' + ret.join(',') + ']';
					}
					var	name,
						val,
						pairs = [];
	
					for ( var k in obj ) {
						// Only include own properties,
						// Filter out inherited prototypes
						if ( !hasOwn.call( obj, k ) ) {
							continue;
						}
	
						// Keys must be numerical or string. Skip others
						type = typeof k;
						if ( type === 'number' ) {
							name = '"' + k + '"';
						} else if (type === 'string') {
							name = quoteString(k);
						} else {
							continue;
						}
						type = typeof obj[k];
	
						// Invalid values like these return undefined
						// from toJSON, however those object members
						// shouldn't be included in the JSON string at all.
						if ( type === 'function' || type === 'undefined' ) {
							continue;
						}
						val = JSON.encode( obj[k] );
						pairs.push( name + ':' + val );
					}
					return '{' + pairs.join( ',' ) + '}';
				};
		
			},
		
			/**
			 * Evaluates a given piece of json source.
			 * @param	{String}	src
			 * @name	JSON.decode
			 */
			decode:function(src)
			{
				if(src != null && src != '' && src != undefined)
				{
					return eval('(' + src + ')');
				}
				return null;
			},
		
			toString:function()
			{
				return '[class JSON]';
			}
		
		};
		
})()

	// ----------------------------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('JSON', JSON);
		