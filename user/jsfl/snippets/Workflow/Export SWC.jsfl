/**
 * Export the SWC file from your publish profile, but immediately delete the SWF
 */
(function()
{
	var xml		= new XML(document.exportPublishProfileString());
	var file	= xml.PublishFormatProperties.flashFileName;
	
	if(xjsfl.file.isAbsolutePath(file))
	{
		var uri		= xjsfl.file.makeURI(file);
	}
	else
	{
		var uri		= xjsfl.file.makeURI(file, document.pathURI);
	}
	document.publish();
	var swf		= new File(uri);
	if(swf.exists)
	{
		swf.remove(true);
		trace('SWC Exported. Removed "' + FLfile.uriToPlatformPath(uri) + '"');
	}
})()