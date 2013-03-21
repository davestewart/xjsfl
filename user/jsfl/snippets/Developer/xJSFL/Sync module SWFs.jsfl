/**  
 * Copies the most up-to-date version of the current module FLA's SWF over the published WindowSWF version (or vice versa)
 * @icon {iconsURI}ui/application/application_double.png
 */
(function()
{
	// --------------------------------------------------------------------------------
	// preflight

		// setup and load
			xjsfl.init(this);
			load('../../_lib/jsfl/uri.jsfl');
			
		// check this is a module .fla
			var moduleURI = getModuleURI();
			if( ! moduleURI )
			{
				alert('This .fla is not within in an xJSFL module sub folder');
				return;
			}

	// --------------------------------------------------------------------------------
	// file names

		// publish profile information
			var filename		= getPublishURI().name;
			var flashURI		= fl.configURI + 'WindowSWF/' + filename;
			var moduleURI		= moduleURI + 'flash/WindowSWF/' + filename;

	// --------------------------------------------------------------------------------
	// copy files

		// copy function
			/**
			 * Copy one file to another
			 * @param	{File}	src		The source file
			 * @param	{File}	trg		The target file
			 * @private
			 */
			function copyFile(src, trg)
			{
				try
				{
					trace(' > copying: "' +src.path+ '"\n > over:    "' +trg.path+ '"');
					trg.writable = true;
					src.copy(trg.uri, true);
				}
				catch(err)
				{
					trace(err.message);
				}
			}

		// files
			var flashFile		= new File(flashURI);
			var moduleFile		= new File(moduleURI);

		// do it
			if(flashFile.exists || moduleFile.exists)
			{
				// debug
					trace('\nSynchronising "' +filename+ '" panels...');
					
				// both files exist, copy newer over older
					if(flashFile.exists && moduleFile.exists)
					{
						if(flashFile.modified > moduleFile.modified)
						{
							trace('Copying Flash .swf over module .swf...');
							copyFile(flashFile, moduleFile);
						}
						else if(flashFile.modified < moduleFile.modified)
						{
							trace('Copying module .swf over Flash .swf...');
							copyFile(moduleFile, flashFile);
						}
						else
						{
							trace('The two files are already synchronised!');
						}
					}
					else if(moduleFile.exists)
					{
						trace('Copying module .swf to Flash folder...');
						copyFile(moduleFile, flashFile);
					}
					else if(flashFile.exists)
					{
						trace('Copying Flash .swf to module folder...');
						copyFile(flashFile, moduleFile);
					}				
			}
			else
			{
				alert('This document is not an xJSFL module .fla!');
			}
			

})()