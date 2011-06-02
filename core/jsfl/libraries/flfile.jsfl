/**
 * FLfile compatibility for pre-CS4 versions of Flash
 * Adds platform to URI conversion
 */

	if( ! FLfile['platformPathToURI'])
	{
		FLfile.platformPathToURI = function(path)
		{
			path = path
				.replace(/ /g, "%20")
				.replace(':/', "|/")
				.replace(/\\/g, "/");
				
			return "file:///" + path;
		}
		
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
