xjsfl.init(this);

/**
 * Changes the publish location of the SWF to either the Flash WindowSWF folder, or the Module's UI folder
 * @icon {iconsURI}ui/application/application_go.png
  */
(function()
{
	// --------------------------------------------------------------------------------
	// setup

		// load libraries
			load('../../_lib/jsfl/uri.jsfl');
			
		// get URIs
			var publishURI	= getPublishURI();
			var moduleURI	= getModuleURI($dom.pathURI);
			
		// bail if settings aren't right
			if( ! publishURI)
			{
				alert('The publish location can\'t be set until the document has been saved');
				return;
			}

			if( ! moduleURI)
			{
				alert('This .fla doesn\'t appear to be within a module folder.\n\nThis snippet is designed to change the publish location of module .fla\'s from the Flash folder, to the Module folder.');
				return;
			}

	// --------------------------------------------------------------------------------
	// UI

		// XUL dialog
			var xul		= XUL
							.factory("title:Choose publish location,radios:Publish to={Flash:flash,Module:module}")
							.setValue('publishto', URI.findFolder(publishURI, '/xJSFL/') ? 'Module' : 'Flash')
							.show();

			var values	= xul.values;
			if( ! xul.accepted)
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
					var targetURI	= new URI(moduleURI + 'flash/WindowSWF/' + publishURI.name);
					path			= new URI(document.pathURI).pathTo(targetURI);
				}

		// update publish profile
			var profile				= new PublishProfile();
			profile.file.flashPath	= path;
			
		// feedback
			trace('Publish location changed to: "' + path + '"')
})()