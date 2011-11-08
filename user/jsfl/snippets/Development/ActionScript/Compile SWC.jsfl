xjsfl.init(this);

// http://help.adobe.com/en_US/flex/using/WS2db454920e96a9e51e63e3d11c0bf69084-7a80.html
// http://troyworks.com/blog/2010/03/04/how-to-create-swc-actionscript-libraries/

/*
	"C:\Program Files (x86)\Development\flex_sdk_4\bin\compc" -source-path "E:\05 - Commercial Projects\xJSFL\3 - development\dev\AS3\_classes" -include-sources "E:\05 - Commercial Projects\xJSFL\3 - development\xJSFL\core\assets\swc\src" -optimize -output "E:\05 - Commercial Projects\xJSFL\3 - development\xJSFL\core\assets\swc\xJSFL.swc"

	"{flex}" -source-path "{lib}" -include-sources "{src}" -optimize -output "{swc}"

*/

function onAccept(sources, file)
{
	Output.inspect([sources, file])
}

XUL
	.factory()
	.addTextbox('Text')
	.show(onAccept)