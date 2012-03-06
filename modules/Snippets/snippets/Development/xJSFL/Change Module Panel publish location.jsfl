xjsfl.init(this, 'Snippets');
clear();

/**
 * Changes the publish location of the SWF to either the Flash WindowSWF folder, or the Module's UI folder
 * @icon {iconsURI}UI/application/application_go.png
  */
(function()
{
	// --------------------------------------------------------------------------------
	// setup

		// load libraries
			load('../../_libraries/uri.jsfl', true);
			
		// get publish path
			var publishURI	= getPublishURI();

	// --------------------------------------------------------------------------------
	// UI

		// XUL dialog
			var xul		= XUL
							.factory("title:Choose publish location,radios:Publish to={Flash:flash,Module:module}")
							.setValue('publishto', URI.findFolder(publishURI, '/xJSFL/') ? 'Module' : 'Flash')
							.show();

			var values	= xul.values;
			if( ! values || values.accept)
			{
				return;
			}

	// --------------------------------------------------------------------------------
	// update

		// update file depending on UI choice

			// new path variable
				var path;

			// flash folder
				if(values.publishto == 'flash')
				{
					var file		= new File('{flash}WindowSWF/' + publishURI.name)
					file.writable	= true;
					path			= file.path;
				}

			// local publish parameters
				else
				{
					var moduleURI = getModuleURI();
					if(moduleURI)
					{
						var targetURI	= new URI(moduleURI + 'flash/WindowSWF/' + publishURI.name);
						path			= new URI(document.pathURI).pathTo(targetURI);
					}
					else
					{
						alert('The publish path could not be set, as this .fla is not within an xJSFL module sub folder');
					}
				}

		// update publish profile
			if(path)
			{
				setPublishPath(path);
			}
})()