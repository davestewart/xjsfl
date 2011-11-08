xjsfl.init(this);

/**
 * Copies the
 * @icon {iconsURI}UI/application/application_lightning.png
 */
(function()
{
	// --------------------------------------------------------------------------------
	// preflight

		if( ! /\/ui\/.+/.test(document.pathURI))
		{
			alert('fla file is not within in a module /ui/ subfolder')
		}

	// --------------------------------------------------------------------------------
	// file names

		// publish profile information
			var xml			= new XML(Superdoc.settings.publishProfile.exportString());
			var nodes		= xml..flashFileName;

		// currently-publishing filename
			var path		= nodes.toString();
			var name		= path.split(/[\\\/]/).pop();

		// destination files
			var flashURI	= fl.configURI + 'WindowSWF/' + name;
			var moduleURI	= new File(document.pathURI).parent.uri.replace(/\/ui\/.+/, '/ui/') + name;

	// --------------------------------------------------------------------------------
	// copy files

		// debug
			trace('\nSynchronising module SWFs...');

		// copy function
			function copyFile(src, trg)
			{
				try
				{
					trace('Copying: "' +src.path+ '"\nOver:    "' +trg.path+ '"');
					src.readOnly = false;
					trg.readOnly = false;
					src.copy(trg.uri, true);
				}
				catch(err)
				{
					trace(err.message);
				}
			}

		// files
			var flashFile		= new File(flashURI);
			var moduleFile		= new File(moduleURI);

		// both files exist, copy newer over older
			if(flashFile.exists && moduleFile.exists)
			{
				if(flashFile.modified > moduleFile.modified)
				{
					copyFile(flashFile, moduleFile);
				}
				else if(flashFile.modified < moduleFile.modified)
				{
					copyFile(moduleFile, flashFile);
				}
				else
				{
					trace('The two files are already synchronised')
				}
			}
			else if(moduleFile.exists)
			{
				copyFile(moduleFile, flashFile);
			}
			else if(flashFile.exists)
			{
				copyFile(flashFile, moduleFile);
			}

		// debug
})()