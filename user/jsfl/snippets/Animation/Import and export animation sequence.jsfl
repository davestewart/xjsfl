xjsfl.init(this);

/**
 * Make animation
 * Imports a sequence of png files and exports an SWF
 * @author Dave Stewart
 * @see www.xjsfl.com
 */
function makeAnimation()
{
	var folder	= fl.browseForFolderURL();
	if(folder)
	{
		// create documnet
			fl.createDocument();

		// variables
			var dom		= $dom;
			var tl		= $timeline;
			var lib		= $library;
			var files	= FLfile.listFolder(folder, 'files');
			
		// ensure only png files
			files		= files.filter(function(file){ return /\.png$/.test(file); });

		// import loop
			for(var i = 0; i < files.length; i++)
			{
				var uri = folder + '/' +files[i];
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
			dom.exportSWF(fl.browseForFileURL('save'));
			fl.closeDocument(dom);
	}
}

XUL
	.factory()
	.add('title:Create Animation Sequence,openfile:Load')
	.addXML('<xml/>')
	.show()

//makeAnimation();
