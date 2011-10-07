xjsfl.init(this);

/**
 * Changes the publish location of the SWF to either the Flash WindowSWF folder, or the Module's UI folder
 * @icon {iconsURI}UI/application/application_lightning.png
 */
(function()
{
	// --------------------------------------------------------------------------------
	// publish profile

		// publish profile information
			var xml		= new XML(Superdoc.settings.publishProfile.exportString());
			var nodes	= xml..flashFileName;

		// currently-publishing filename
			var path	= nodes.toString();
			var name	= path.split(/[\\\/]/).pop();

	// --------------------------------------------------------------------------------
	// UI

		// XUL dialog
			var xul		= XUL
							.factory("title:Choose publish location,radios:Publish to={Flash:flash,Module:module}")
							.setValue('publishto', path.indexOf('..')  != -1 ? 'Module' : 'Flash')
							.show();

			var values	= xul.values;
			if(values.accept == false)
			{
				return;
			}

	// --------------------------------------------------------------------------------
	// update

		// update file depending on UI choice

			// flash folder
				if(values.publishto == 'flash')
				{
					var file	= FLfile.uriToPlatformPath(fl.configURI + 'WindowSWF/' + name);
					FLfile.setAttributes(file, 'W');
				}

			// local publish parameters
				else
				{
					var src		= document.pathURI;
					var trg		= src.replace(/\/ui\/.*/, '/ui/');
					var diff	= src.split('/').length - trg.split('/').length;
					var file	= new Array(diff + 1).join('../') + name;
				}

		// update publush profile
			nodes[0]	= file;

		// assign to profile
			Superdoc.settings.publishProfile.importString(xml.toXMLString())

		// debug
			trace('Publish location changed to: ' + file)
})()