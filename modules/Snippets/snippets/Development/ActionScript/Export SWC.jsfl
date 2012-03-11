/**
 * Export the SWC file from your publish profile, but immediately delete the SWF
 * @icon {iconsURI}Filesystem/file/file_flash.png
 */
(function()
{
	// setup
		xjsfl.init(this);
		load('../../_libraries/uri.jsfl', true);

	// variables
		var uri = getPublishURI();
		if(uri)
		{
			document.publish();
			var swc	= new File(String(uri).replace('.swf', '.swc'));
			if(swc.exists)
			{
				var swf = new File(uri);
				if(swf.exists)
				{
					swf.remove(true);
					trace('An .swc was exported to "' + swc.path + '"');
				}
			}
			else
			{
				trace('An .swc was not exported (check your publish profile settings)');
			}
		}
		else
		{
			trace('This document has not yet been saved');
		}
})()