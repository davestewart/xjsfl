// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██     ████ ██ ██       
//  ██     ██     ██      ██       
//  ██     ██     ██   ██ ██ █████ 
//  █████  ██     ████ ██ ██ ██ ██ 
//  ██     ██     ██   ██ ██ █████ 
//  ██     ██     ██   ██ ██ ██    
//  ██     ██████ ██   ██ ██ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// FLfile - Adds FLfile platform-to-URI conversion compatibility for pre-CS4 versions of Flash

	//TODO Check whether this 260 char limit is an FLfile issue, or a general filesystem issue. @see FileSystem
	
	if( ! FLfile['platformPathToURI'])
	{
	
		/**
		 * Converts a platform-specific path to a URI
		 * @param path	{String}	A string, expressed in a platform-specific format, specifying the filename you want to convert
		 * @returns		{String}	A string expressed as a file:/// URI.
		 */
		FLfile.platformPathToURI = function(path)
		{
			path = path
				.replace(/ /g, "%20")
				.replace(':/', "|/")
				.replace(/\\/g, "/");
				
			return "file:///" + path;
		}
		
		/**
		 * Converts a URI to a platform-specific path
		 * @param uri	{String}	A string, expressed as a file:/// URI, specifying the filename you want to convert
		 * @returns		{String}	A string representing a platform-specific path.
		 */
		FLfile.uriToPlatformPath = function(uri)
		{
			uri = uri
				.replace("file:///", "")
				.replace(/%20/g, " ");
				
			if (/win/i.test(fl.version))
			{
				uri = uri
					.replace(/^([A-Z])\|/i, "$1:")
					.replace(/\//g, "\\");
			}
			
			return uri;
		}
	}
		
