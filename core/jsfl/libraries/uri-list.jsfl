// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██████ ██ ██     ██        ██   
//  ██  ██ ██  ██ ██ ██               ██   
//  ██  ██ ██  ██ ██ ██     ██ █████ █████ 
//  ██  ██ ██████ ██ ██     ██ ██     ██   
//  ██  ██ ██ ██  ██ ██     ██ █████  ██   
//  ██  ██ ██  ██ ██ ██     ██    ██  ██   
//  ██████ ██  ██ ██ ██████ ██ █████  ████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// URIList -  A utility class to load, cache and filter lists of URIs

	// --------------------------------------------------------------------------------
	// Constructor

		/**
		 * URIList constructor
		 * @param	{String}	pathOrURI	A valid folder path or URI
		 * @param	{Boolean}	recursive	An optional flag to search the folder recursively
		 */
		function URIList(pathOrURI, recursive)
		{
			// variables
				var uris		= [];
				var folderURI;
				
			// parse Array
				if(Utils.isArray(pathOrURI))
				{
					uris = pathOrURI;
				}
				
			// string
				else
				{
					var folderURI	= new URI(pathOrURI).folder;
					FLfile.exists(folderURI)
					{
						if(recursive)
						{
							var uris	= Data.recurseFolder(folderURI, true);
						}
						else
						{
							var uris	= new Folder(folderURI).uris;
						}
					}
				}
			
			
			/**
			 * Returns the list of URIs
			 * @returns	{Array}		An Array of URIs
			 */
			this.getURIs = function(pattern, find)
			{
				if(pattern)
				{
					return (find ? this.find(pattern) : this.filter(pattern));
				}
				else
				{
					return uris;
				}
			}
			
			/**
			 * Returns the list of Paths
			 * @returns	{Array}		An Array of Paths
			 */
			this.getPaths = function(pattern, find)
			{
				var results = this.getURIs(pattern, find);
				if(find)
				{
					return URI.asPath(results);
				}
				else
				{
					for (var i = 0; i < results.length; i++)
					{
						results[i] = URI.asPath(results[i]);
					}
					return results;
				}
			}
			
			/**
			 * Filters the URIs according to a wildcard pattern or regular expression
			 * @param	{String}	pattern		A wildcard (*) pattern
			 * @param	{RegExp}	pattern		A regular expression
			 * @returns	{Array}					An Array of URIs
			 */
			this.filter = function(pattern)
			{
				var rx = pattern instanceof RegExp ? pattern : Utils.makeWildcard(pattern);
				return uris.filter(function(uri){ return rx.test(uri); });
			},
			
			/**
			 * Finds the first URI that matches a wildcard pattern or regular expression
			 * @param	{String}	pattern		A wildcard (*) pattern
			 * @param	{RegExp}	pattern		A regular expression
			 * @returns	{Array}					An Array of URIs
			 */
			this.find = function(pattern)
			{
				var uri;
				var rx = pattern instanceof RegExp ? pattern : Utils.makeWildcard(pattern);
				for (var i = 0; i < uris.length; i++)
				{
					uri = uris[i];
					if(rx.test(uri))
					{
						return uri;
					}
				}
				return null;
			},
			
			/**
			 * Updates the list in case the contents of the original folder have changed
			 * @returns	{URIList}		The original URIList
			 */
			this.update = function(pathOrURI)
			{
				uris = new URIList(pathOrURI || folderURI, recursive).getURIs();
				return this;
			}
			
			/**
			 * Returns a String representation of the URIList
			 * @returns	{Object}		Description
			 */
			this.toString = function()
			{
				return '[object URIList uris=' +uris.length+ ' folder="' +URI.asString(folderURI)+ '"]';
			}
		}

	// --------------------------------------------------------------------------------
	// Static properties

		URIList.toString = function()
		{
			return '[class URIList]';
		}

	// --------------------------------------------------------------------------------
	// Register class
	
		xjsfl.classes.register('URIList', URIList);


