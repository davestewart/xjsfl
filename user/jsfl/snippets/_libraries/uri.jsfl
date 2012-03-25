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
			uri				= uri || document.pathURI;
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
		if(document.pathURI)
		{
			// publish profile information
				var xml				= new XML(Superdoc.settings.publishProfile.exportString());
				var nodes			= xml..flashFileName;

			// currently-publishing filename, e.g. "../../Module Name.swf"
				var publishPath		= nodes.toString();
				var documentURI		= document.pathURI;
				var publishURI		= URI.isAbsolute(publishPath) ? new URI(publishPath) : new URI(publishPath, documentURI);

			// return
				return publishURI;
		}
	}

	/**
	 * Sets the publish URI of the current .fla
	 * @param	{String}		A path to set the publish profile to
	 */
	function setPublishPath(path)
	{
		// get node values
			var xml		= new XML(Superdoc.settings.publishProfile.exportString());
			var nodes	= xml..flashFileName;

		// set node values
			nodes[0]	= path;
			Superdoc.settings.publishProfile.importString(xml.toXMLString());

		// debug
			trace('Publish location changed to: "' + path + '"')
	}