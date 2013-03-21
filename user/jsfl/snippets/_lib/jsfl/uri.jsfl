xjsfl.init(this);

// ----------------------------------------------------------------------------------------------------
// functions

	/**
	 * Gets the module URI of the current .fla
	 * @param	{String}		An optional URI to pass in, defaults to the current document's URI
	 * @returns	{URI}			A URI instance pointing to module root, or null if not
	 */
	function getModuleURI(uri)
	{
		// variables
			uri				= uri || $dom.pathURI;
			var folderURI	= new URI(uri).getParent();
			var moduleURI;

		// walk up folder structure and test for manifest.xml + module
			while( ! moduleURI && ! URI.isRoot(folderURI) )
			{
				var file = new File(folderURI + 'manifest.xml');
				if(file.exists)
				{
					var xml = load(file.uri);
					if(xml.module.length())
					{
						moduleURI = new URI(file.uri).folder;
						break;
					}
				}
				folderURI = folderURI.getParent();
			}

		// return
			return moduleURI;
	}

	/**
	 * Gets the publish URI of the current .fla
	 * @returns	{URI}			A URI instance pointing to the current publish location
	 */
	function getPublishURI()
	{
		// publish profile information
			var profile			= new PublishProfile();
			var publishPath		= profile.file.flashPath;
			var publishURI		= URI.isAbsolute(publishPath) ? new URI(publishPath) : new URI(publishPath, $dom.pathURI);

		// return
			return publishURI;
	}