var curr_doc = fl.getDocumentDOM();
var result = curr_doc.xmlPanel(fl.scriptURI.replace(/[^\/]+$/, '') + "Rename MovieClips.xml");

if(result.dismiss == "accept")
{
	var items_array = curr_doc.library.getSelectedItems();
	var items_num = items_array.length;
	
	var names_array = result.names.split(",");
	var names_num = names_array.length;
	
	var movieClips_array = new Array();
	
	var itemsAreMovieClips = true;
	
	fl.outputPanel.clear();
	
	
	for(var i = 0; i < items_num; i++)
	{
		var itemType_str = items_array[i].symbolType;
		
		if(itemType_str != "movie clip")
		{
			itemsAreMovieClips = false;
		}
		else
		{
			movieClips_array.push(items_array[i]);
		}
	}
	
	var movieClips_num = movieClips_array.length;
	
	fl.trace("mc " + movieClips_num + "     name : " +  names_num)
	
	if(itemsAreMovieClips == false)
	{
		alert("All library items selected must be of the type 'MovieClip'")
	}
	else if(movieClips_num != names_num)
	{
		alert("The number of names provided must be equal to the number of MovieClip items selected")
	}
	else
	{
		for(var i = 0; i < movieClips_num; i++)
		{
			movieClips_array[i].name = names_array[i];
				
			if(result.exportForAS == "true")
			{	
				movieClips_array[i].linkageExportForAS = true;
				movieClips_array[i].linkageExportInFirstFrame = true;
				movieClips_array[i].linkageIdentifier = names_array[i];
			}
			else
			{
				movieClips_array[i].linkageExportForAS = false;
				movieClips_array[i].linkageExportInFirstFrame = false;
			}
		}
	}
}
