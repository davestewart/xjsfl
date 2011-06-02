/*
*  PNG2SWF_MULTIPLE JSFL v 1.0
*  by Matus Laco, http://www.YoFLA.com
*  product URL: http://www.yofla.com/flash/png2swf/
*  inspired by Mr.doob http://mrdoob.com/tools/jsfl/png2swf.jsfl
*
*  Description:
*  Converts multiple png files to multiple swf files.
*  Input: Select folder dialog box
*  Output: Same folder, same filename, swf extension
*/

png2swf();

function png2swf()
{
	var folderURI = fl.browseForFolderURL("Select a folder.");
	if (folderURI == null) { return; }
	var folderContents = FLfile.listFolder(folderURI);
		
	var jpeg_quality = prompt("JPEG Quality?", "85");

	var doc = fl.createDocument();
	doc.backgroundColor = '#00FF00';
	
	var imported = 0;

	/*
	 * Another block comment
	 */

		
	for(var i=0; i< folderContents.length; i++){
		
					
		var pngURI = folderURI + "/" +folderContents[i];
		if (pngURI.substr(pngURI.length-4) != ".png") continue;
		
		doc.importFile(pngURI);
		
		// get item		
		var bmp_lib = doc.library.items[imported];
		bmp_lib.quality = Number(jpeg_quality);		
		var bmp_tl = fl.getDocumentDOM().getTimeline().layers[0].frames[0].elements[0];
		
		// set doc size
		doc.width = Math.floor(bmp_tl.width);
		doc.height = Math.floor(bmp_tl.height);		

		// export	
		var swfURI = pngURI.substr(0,pngURI.lastIndexOf(".")+1)+"swf";
		doc.exportSWF(swfURI, true );
		
		// remove previous from timeline
		doc.selectAll();
		doc.deleteSelection();
		
		// increase imported count
		imported++;
	}
	
	doc.close(false);
	
	alert(imported + " files created.");
}			