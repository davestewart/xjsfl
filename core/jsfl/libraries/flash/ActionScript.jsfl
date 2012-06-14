// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██   ██             ██████            ██        ██   
//  ██  ██        ██                  ██                          ██   
//  ██  ██ █████ █████ ██ █████ █████ ██     █████ ████ ██ █████ █████ 
//  ██████ ██     ██   ██ ██ ██ ██ ██ ██████ ██    ██   ██ ██ ██  ██   
//  ██  ██ ██     ██   ██ ██ ██ ██ ██     ██ ██    ██   ██ ██ ██  ██   
//  ██  ██ ██     ██   ██ ██ ██ ██ ██     ██ ██    ██   ██ ██ ██  ██   
//  ██  ██ █████  ████ ██ █████ ██ ██ ██████ █████ ██   ██ █████  ████ 
//                                                         ██          
//                                                         ██          
//
// ------------------------------------------------------------------------------------------------------------------------
// ActionScript

	/**
	 * ActionScript
	 * @overview	Provides ActionScript 3 related utilities
	 * @instance	ActionScript
	 */

ActionScript =
{
	/**
	 * Gets the AS3 base class of an item or element
	 * @param		{LibraryItem}	item		A library item
	 * @param		{Element}		item		A library item
	 * @returns		{String}					The String class of the object
	 */
	getBaseClass:function(item)
	{
		if(item instanceof Element)
		{
			item = item.libraryItem;
		}
		
		if(item instanceof LibraryItem)
		{
			if(item.linkageBaseClass)
			{
				return item.linkageBaseClass
			}
			else
			{
				var types =
				{
					'movie clip'		: 'flash.display.MovieClip',
					'button'			: 'flash.display.SimpleButton',
					'bitmap'			: 'flash.display.Bitmap',
					'sound'				: 'flash.media.Sound',
					'video'				: 'flash.media.Video',
					'font'				: 'flash.text.Font',
				};
				
				if(item.itemType === 'movie clip')
				{
					return item.timeline.frameCount === 1 ? 'flash.display.Sprite' : types['movie clip'];
				}
				else
				{
					return types[item.itemType] || null;
				}
			}
		}
		return null;
	},
	
	compileSWC:function()
	{
		
	},

}



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