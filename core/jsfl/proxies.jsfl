// ------------------------------------------------------------------------------------------------------------------------
//
//           ██ ██████ ██████ ██
//           ██ ██     ██     ██
//  ██ ██    ██ ██     ██     ██
//  ██ ██    ██ ██████ █████  ██
//   ███     ██     ██ ██     ██
//  ██ ██    ██     ██ ██     ██
//  ██ ██ █████ ██████ ██     ██████
//
// ------------------------------------------------------------------------------------------------------------------------
// xJSFL Proxy - Initial code needed to get the framework up and running

	// --------------------------------------------------------------------------------
	// Log constants

		/**
		 * @type {Object}	A selection of constants that can be used with xjsfl.output.log
		 */
		Log =
		{
			// logged to main log
				INFO:'INFO',
				
			// logged to main log, output panel, and an alert box
				TRACE:'TRACE',
				
			// logged to main log, output panel, and an alert box
				WARN:'WARN',
				
			// logged to main log and file.log
				FILE:'FILE',
		};

	// --------------------------------------------------------------------------------
	// placeholder for settings
	
		xjsfl.settings = { };
	
	// --------------------------------------------------------------------------------
	// placeholder for file
	
		xjsfl.file =
		{
			stack:[]
		};
	
	
	// --------------------------------------------------------------------------------
	// output (this functinality is permanent)
	
		xjsfl.output =
		{
			/**
			 * Creates the text that will be traced or logged
			 * @param	{String}	prefix		The message prefix
			 * @param	{String}	message		The message to trace or log
			 * @param	{Number}	level		An optional Number to accentuate the message. 1 = capitals, 2 = horizontal rule & capitals
			 * @param	{Boolean}	addNewline	An optional Boolean to add a new line to the traced output
			 * @returns	{String}				The created message
			 */
			create:function(prefix, message, level, addNewline)
			{
				// new line
					var newLine	= fl.version.substr(0, 3).toLowerCase() === 'win' ? '\r\n' : '\n';
					var output	= '';
					
				// level
					if(level > 0)
					{
						if(level == 1 || level == 2)
						{
							message = message.toUpperCase();
						}
						if(level >= 2)
						{
							output = '----------------------------------------------------------------------------------------------------' + newLine;
						}
						if(level == 3)
						{
							message += ('----------------------------------------------------------------------------------------------------' + newLine);
						}
					}
					
				// trailing newline
					if(addNewline)
					{
						message += newLine;
					}
					
				// return
					return (level > 0 ? newLine : '') + output + prefix + '\t' + message;
			},
			
			/**
			 * Logs a message to the xjsfl or file log, and optionally traces it
			 * @param	{String}	message		The text of the log message
			 * @param	{String}	$type		An optional Log.CONSTANT type for the log message. Defaults to Log.INFO
			 * @param	{Boolean}	$level		An optional Boolean to accentuate the message with a new line and capitals
			 * @param	{Number}	$level		An optional Number to accentuate the message with a new line and: 1 = capitals, 2 = horizontal rule & capitals
			 */
			log:function(message, $type, $level)
			{
				// parameters
					var param, type, level;
					for each(param in [$type, $level])
					{
						if(typeof param === 'string')
							type = param;
						if(typeof param === 'number')
							level = param;
						if(typeof param === 'boolean')
							level = param === true ? 1 : 0;
					}
					type		= type || Log.INFO;
				
				// date
					var date	= new Date();
					var time	= date.toString().match(/\d{2}:\d{2}:\d{2}/) + ':' + (date.getMilliseconds() / 1000).toFixed(3).substr(2);

				// log to main
					var uri			= xjsfl.uri + 'core/logs/main.txt';
					var output		= this.create(time, type + '\t' + message, level, true);
					FLfile.write(uri, output, 'append');
					//trace(message);
					
				// extra logging for file
					if(type === Log.FILE)
					{
						var uri			= xjsfl.uri + 'core/logs/file.txt';
						var indent		= new Array(xjsfl.file.stack.length + 1).join('	');
						var output		= this.create(time, indent + message, level, true);
						FLfile.write(uri, output, 'append');
					}
			},
			
			/**
			 * Traces an "> xjsfl:" message to the Output panel
			 * @param	{String}	message		The message to log
			 * @param	{Number}	level		An optional Number to accentuate the message. 1 = capitals, 2 = horizontal rule & capitals
			 */
			trace:function(message, level)
			{
				var output = this.create('> xjsfl: ', message, level)
				fl.trace(output.replace(/[ \t]+/g, ' ').replace(/\r/g, ''));
				this.log(message, Log.TRACE, level);
			},
			
			warn:function(message)
			{
				trace('\n> xjsfl: WARNING - ' + message + '\n');
				this.log(message + '\n', Log.WARN, 3);
			},
			
			/**
			 * Clears a log file
			 * @param	{String}	type	The type of log file to reset
			 */
			reset:function(type)
			{
				var name = type == Log.FILE ? 'file' : 'main';
				FLfile.remove(xjsfl.uri + 'core/logs/' + name + '.txt');
				xjsfl.output.log(name + ' log created', type);
			},
			
		}
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██  ██   ██ ██
//  ██  ██  ██      ██
//  ██  ██ █████ ██ ██ █████
//  ██  ██  ██   ██ ██ ██
//  ██  ██  ██   ██ ██ █████
//  ██  ██  ██   ██ ██    ██
//  ██████  ████ ██ ██ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Utils - static library of utility functions

	Utils =
	{
		/**
		 * Checks if the object is a true Array or not
		 * @param	{Object}	obj			Any object that needs to be checked if it's a true Array
		 * @returns	{Boolean}				True or false
		 */
		isArray:function (obj)
		{
			return Object.prototype.toString.call(obj) === "[object Array]";
		},
		
		/**
		 * Returns a list of URIs for a given glob path, folder reference and optional condition
		 * @param	{String}	folder		An absolute or relative folder path or URI (wildcards allowed)
		 * @param	{Folder}	folder		A valid Folder instance
		 * @param	{URI}		folder		A valid URI instance
		 * @param	{Number}	$depth		An optional max depth to search to
		 * @param	{Boolean}	$filesOnly	An optional Boolean to get files only
		 * @param	{RegExp}	$filter		A RegExp to match each URI
		 * @returns	{Array}					An Array of URIs
		 */
		getURIs:function(folder, $depth, $filesOnly, $filter, $extensions)
		{
			function process(folderURI)
			{
				var items = FLfile.listFolder(folderURI);
				for each(var item in items)
				{
					var uri = folderURI + item;
					if(FLfile.getAttributes(uri).indexOf('D') > -1)
					{
						if( ! filesOnly )
						{
							uris.push(uri + '/');
						}
						process(uri + '/');
					}
					else
					{
						uris.push(uri);
					}
				}
			}
			
			var uris = [];
			process(folder);
			return uris;
		},

	}
		
		
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██████ ██
//  ██  ██ ██  ██ ██
//  ██  ██ ██  ██ ██
//  ██  ██ ██████ ██
//  ██  ██ ██ ██  ██
//  ██  ██ ██  ██ ██
//  ██████ ██  ██ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// URI - Handles URI and path conversion, including detection and resolution of relative paths
	
	URI =
	{
		/**
		 * Test if the supplied value is a URI-formatted string
		 * @param	{String}	pathOrURI	A valid path or URI
		 * @returns	{Boolean}				true or false, depending on the result
		 */
		isURI:function(pathOrURI)
		{
			return typeof pathOrURI === 'string' && pathOrURI.indexOf('file:///') === 0;
		},
		
		toURI:function(pathOrURI)
		{
			if( ! URI.isURI)
			{
				pathOrURI = FLfile.platformPathToURI(pathOrURI);
			}
			return pathOrURI;
		},
		
		toPath:function(pathOrURI, shorten)
		{
			if(URI.isURI)
			{
				pathOrURI = FLfile.uriToPlatformPath(pathOrURI);
			}
			if(shorten)
			{
				var core = FLfile.uriToPlatformPath(xjsfl.uri + 'core/');
				pathOrURI = pathOrURI.replace(core, '{core}');
			}
			return pathOrURI.replace(/\\/g, '/');
		},
		
		asPath:function(pathOrURI, shorten)
		{
			return URI.toPath(pathOrURI, shorten);
		},
		
		/**
		 * Returns the file extension
		 * @param	{String}	pathOrURI		A vald path or URI
		 * @returns	{String}					The file extensions
		 */
		getExtension:function(pathOrURI)
		{
			var match = String(pathOrURI).match(/\.(\w+)$/);
			return match ? match[1] : '';
		},
		
		/**
		 * Returns the current folder path of the item referenced by the path or URI
		 * @param	{String}	pathOrURI	A valid path or URI
		 * @returns	{String}				The folder of the path or URI
		 */
		getFolder:function(pathOrURI)
		{
			return String(pathOrURI).replace(/([^\/\\]+)$/, '');
		},
	}
	