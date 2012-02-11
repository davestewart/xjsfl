/**
 * Export the SWC file from your publish profile, but immediately delete the SWF
 */
(function()
{
	var xml		= new XML(document.exportPublishProfileString());
	var file	= xml.PublishFormatProperties.flashFileName;

	if(URI.isAbsolute(file))
	{
		var uri		= URI.toURI(file);
	}
	else
	{
		var uri		= URI.toURI(file, document.pathURI);
	}
	document.publish();
	var swf		= new File(uri);
	if(swf.exists)
	{
		swf.remove(true);
		trace('SWC Exported. Removed "' + URI.asPath(uri) + '"');
	}
})()