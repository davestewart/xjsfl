/**
 * Export the SWC file from your publish profile, but immediately delete the SWF
 * @icon {iconsURI}filesystem/file/file_flash.png
 */
(function()
{
	// setup
		xjsfl.init(this);
		load('../../_lib/jsfl/uri.jsfl');
		if(UI.dom && $dom.pathURI)
		{
			// variables
				var uri = getPublishURI();
				if(uri)
				{
					// variables
						var profile		= new PublishProfile();
						var swf			= new File(uri);
						var swc			= new File(String(uri).replace('.swf', '.swc'));
						
					// flags
						var exportSWC	= profile.swf.exportSWC;
						var exportSWF	= swf.exists;
						
					// publish
						swc.writeable			= true;
						profile.swf.exportSWC	= true;
						document.publish();
						profile.swf.exportSWC	= exportSWC;
						
					// kill swf
						if(swc.exists && ! exportSWF)
						{
							swf.remove(true);
						}
						
					// feedback
						trace('An .swc was exported to "' + swc.path + '"');
				}
				else
				{
					trace('This document has not yet been saved');
				}
			
		}
})()


// http://help.adobe.com/en_US/flex/using/WS2db454920e96a9e51e63e3d11c0bf69084-7a80.html
// http://troyworks.com/blog/2010/03/04/how-to-create-swc-actionscript-libraries/

/*
	"C:\Program Files (x86)\Development\flex_sdk_4\bin\compc" -source-path "E:\05 - Commercial Projects\xJSFL\3 - development\dev\AS3\_classes" -include-sources "E:\05 - Commercial Projects\xJSFL\3 - development\xJSFL\core\assets\swc\src" -optimize -output "E:\05 - Commercial Projects\xJSFL\3 - development\xJSFL\core\assets\swc\xJSFL.swc"

	"{flexsdk}" -source-path "{lib}" -include-sources "{src}" -optimize -output "{swc}"

*/

/*

'"{flexsdk}" -source-path "E:\05 - Commercial Projects\xJSFL\3 - development\dev\AS3\_classes" -include-sources "E:\05 - Commercial Projects\xJSFL\3 - development\xJSFL\core\assets\swc\src" -optimize -output "E:\05 - Commercial Projects\xJSFL\3 - development\xJSFL\core\assets\swc\xJSFL.swc"'



var config		= new Config('flexsdk');
var flexPath	= config.get('path') || 'C:/Program Files (x86)/flex_sdk_4/bin/compc';

function onAccept(sources, file)
{
	Output.inspect(Utils.getArguments(arguments))
}

XUL
	.factory()
	.setTitle('Compile SWC')
	.setColumns(100, 400)
	.addTextbox('Flex SDK Path', null, {value:flexPath, width:600})
	.addTextbox('Document Class Path', null, {value:Superdoc.settings.as3.docClass, width:600})
	.addTextbox('Libraries Path', null, {value:flexPath, width:600})
	.addTextbox('Output Path', null, {value:flexPath, width:600})
	.show(onAccept)

*/

