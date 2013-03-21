/**
 * Imports a sequence of png files and exports an SWF
 * @icon		{iconsURI}design/picture/picture_go.png
 * @author		Dave Stewart
 * @snippet
 */
function makeAnimation(fileURI, exportSWF)
{
	if(fileURI)
	{
		// create documnet
			fl.createDocument();

		// variables
			var dom			= $dom;
			var tl			= $timeline;
			var lib			= $library;
			var folderURI	= URI.getFolder(fileURI);
			var files		= FLfile.listFolder(folderURI + '*.png', 'files');

		// debug
			trace('Importing: ' +files.length+ ' files...');

		// import loop
			for(var i = 0; i < files.length; i++)
			{
				var uri = folderURI + files[i];
				fl.trace('Importing: ' + FLfile.uriToPlatformPath(uri));
				tl.currentFrame++;
				document.importFile(uri);
				if(i < files.length - 1)
				{
					tl.insertBlankKeyframe();
				}
			}

		// adjust document size
			dom.selectAll();
			var size	= dom.getSelectionRect()
			dom.width	= parseInt(size.right);
			dom.height	= parseInt(size.bottom)

		// export and close
			if(exportSWF)
			{
				var uri = fl.browseForFileURL('save');
				dom.exportSWF(uri);
				fl.closeDocument(dom);
				trace('Animation exported to: "' +URI.asPath(uri)+ '"');
			}
	}
}

xjsfl.init(this);

XUL.create('title:PNG Sequence to SWF,file:PNGs folder,checkbox:Export when done=true', makeAnimation);
