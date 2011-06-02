/**
 * File-include function that resolves relative paths to the xJSFL root directory
 * @param file {String} The path to the file you want loaded and run
 */
function include(filename, testObject)
{
	if(filename instanceof Array)
	{
		for(var i = 0; i < filename.length; i++)
		{
			include(filename[i], testObject);
		}
	}
	else
	{
		if(testObject === undefined)
		{
			var folders = ['system', 'user'];
			for each(var folder in folders)
			{
				var root = fl.scriptURI.substr(0, fl.scriptURI.lastIndexOf('/xJSFL')) + '/xJSFL/' +folder+ '/jsfl/lib/';
				var file = (root + filename).replace(/(\.jsfl$)?/, '.jsfl');
				if(FLfile.exists(file))
				{
					fl.trace('Loading "' + FLfile.uriToPlatformPath(file).replace(/\\/g, '/') + '"');
					fl.runScript(file);
				}
			}
		}
		else
		{
			fl.trace('Script "' +filename+ '.jsfl" already loaded');
		}
	}
}
