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

	xjsfl.init(this);
		
	/**
	 * ActionScript
	 * @overview	Provides ActionScript 3 related utilities
	 * @instance	ActionScript
	 */
	ActionScript =
	{
		
		types:
		{
			'movie clip'		: 'flash.display.MovieClip',
			'sprite'			: 'flash.display.Sprite',
			'button'			: 'flash.display.SimpleButton',
			'bitmap'			: 'flash.display.Bitmap',
			'sound'				: 'flash.media.Sound',
			'video'				: 'flash.media.Video',
			'font'				: 'flash.text.Font',
			'text'				: 'flash.text.TextField',
			'tlfText'			: 'fl.text.TLFTextField',
		},

		/**
		 * Gets the AS3 class of an element or item
		 * @param		{Element}		item		A stage element
		 * @param		{LibraryItem}	item		A library item
		 * @param		{Boolean}		nameOnly	An optional Boolean to return only the Class name
		 * @returns		{String}					The String class of the object
		 */
		getClass:function(element, nameOnly)
		{
			var classPath = '';
			
			if(element instanceof Element)
			{
				// ignore graphic elements
					if(element.symbolType !== 'graphic')
					{
						// element is text
							if(element.textType && element.elementType in ActionScript.types)
							{
								classPath = ActionScript.types[element.elementType];
							}
							
						// element is an instance
							if(element.instanceType)
							{
								// variables
									var item		= element.libraryItem;
								
								// exported types
									if(item.linkageExportForAS)
									{
										var itemClass	= item.linkageClassName;
										var baseClass	= ActionScript.getBaseClass(item);
										classPath		= itemClass || baseClass;
									}
									
								// non-exported, including video
									else
									{
										var itemClass	= ActionScript.types[item.itemType];
										var baseClass	= ActionScript.types[element.symbolType];
										classPath		= itemClass || baseClass;
									}
								
								// finalize
									if(classPath === ActionScript.types['movie clip'] && item.timeline.frameCount === 1)
									{
										classPath = ActionScript.types.sprite;
									}
							}
					}
				
			}
			
			else if(element instanceof LibraryItem)
			{
				classPath = element.linkageClassName || ActionScript.getBaseClass(element);
			}
			
			return nameOnly ? classPath.split('.').pop() : classPath;
		},		
		
		/**
		 * Gets the AS3 base class of an item or element
		 * @param		{LibraryItem}	item		A library item
		 * @param		{Element}		item		A stage element
		 * @param		{Boolean}		nameOnly	An optional Boolean to return only the Class name
		 * @returns		{String}					The String class of the object
		 */
		getBaseClass:function(item, nameOnly)
		{
			var classPath = '';
			
			if(item instanceof Element)
			{
				item = item.libraryItem;
			}
			
			if(item instanceof LibraryItem)
			{
				if(item.linkageExportForAS)
				{
					// custom class
						if(item.linkageBaseClass)
						{
							classPath = item.linkageBaseClass
						}
						
					// native class
						else
						{
							if(item.itemType === 'movie clip')
							{
								classPath = item.timeline.frameCount === 1 ? ActionScript.types.sprite : ActionScript.types['movie clip'];
							}
							else
							{
								classPath = ActionScript.types[item.itemType] || '';
							}
						}
				}

			}
			return nameOnly ? classPath.split('.').pop() : classPath;
		},
		
		compileSWC:function()
		{
			
		},
	
	}

	xjsfl.classes.register('ActionScript', ActionScript);
		
		
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