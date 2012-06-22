/**
 * Export the SWC file from your publish profile, but immediately delete the SWF
 * @icon {iconsURI}Filesystem/file/file_flash.png
 */
(function()
{
	// setup
		xjsfl.init(this);
		load('../../_libraries/uri.jsfl');
		if(UI.dom && $dom.pathURI)
		{
			// variables
				var uri = getPublishURI();
				if(uri)
				{
					// variables
						var profile		= new PublishProfile();
						var swf			= new File(uri);
						var swc			= new File(String(uri).replace('.swf', '.swc'));
						
					// flags
						var exportSWC	= profile.swf.exportSWC;
						var exportSWF	= swf.exists;
						
					// publish
						swc.writeable			= true;
						profile.swf.exportSWC	= true;
						document.publish();
						profile.swf.exportSWC	= exportSWC;
						
					// kill swf
						if(swc.exists && ! exportSWF)
						{
							swf.remove(true);
						}
						
					// feedback
						trace('An .swc was exported to "' + swc.path + '"');
				}
				else
				{
					trace('This document has not yet been saved');
				}
			
		}
})()