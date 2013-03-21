/**
 * Export layers one by one to PNG files
 * @icon		{iconsURI}design/image/image_multiple.png
 * @author		Dave Stewart
 * @snippet
 */
(function()
{
	
	// --------------------------------------------------------------------------------
	// variables	
		
		/** @type {Layer}	The layer */
		var layer;
		
		/** @type {Array}	The layers */
		var layers		= $timeline.layers;
		
		/** @type {Array}	The layer visibilities */
		var states		= [];
		
		var name, uri, folder, filename, filenames = [];
		
	// --------------------------------------------------------------------------------
	// code
	
		// grab the export folder
			folder = Folder.pick();
			
		// store layer visibilities
			if(folder)
			{
				for (var i = 0; i < layers.length; i++)
				{
					layer			= layers[i];
					states[i]		= layer.visible;
					layer.visible	= false;
				}
			}
			else
			{
				return;
			}
			
		// export
			for (var i = 0; i < layers.length; i++)
			{
				// variables
					layer			= layers[i];
					filename		= layer.name + '.png';
					uri				= folder + filename;
					filenames.push(filename);
					
				// export
					layer.visible	= true;
					$dom.exportPNG(uri, i > 0, true);
					layer.visible	= false;
			}
			
		// reset layer visibilities
			for (var i = 0; i < layers.length; i++)
			{
				layers[i].visible = states[i];
			}
			
		// trace exported files as a JavaScript Array
			format("var folder = '{uri}';", URI.asPath(folder));
			format("var files = \n[\n\t'{filenames}'\n];", filenames.join("',\n\t'"));
})();

 
 
//XUL.create('title:Layers to PNGs,radios:Naming format=[Folder/Layer,Folder/File-Layer,File-Layer]')