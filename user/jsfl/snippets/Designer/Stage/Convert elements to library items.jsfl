/**
 * Converts elements on stage to items in the library
 * @icon {iconsURI}filesystem/folder/folder_page.png
 */
function convertElementsToItems(type, options, folder)
{
	// parameters
		type = type.toLowerCase();
		var ignoreSymbols		= options.indexOf('ignoreSymbols') > -1;
		var promptName			= options.indexOf('promptName') > -1;
	
	// variables
		var dom = document, timeline, element, names = [], name;
		
	// create a new movieclip in which to do our conversion
		dom.convertToSymbol('graphic', '__temp__', 'center');
		dom.enterEditMode('inPlace');
		dom.distributeToLayers();
		timeline = document.getTimeline();
		
	// loop through the layers, converting elements and propting for names
		for (var i = 1; i < timeline.layers.length; i++)
		{
			element = timeline.layers[i].frames[0].elements[0];
			if(element)
			{
				// skip symbols if selected
					if(element.elementType == 'instance' && ignoreSymbols)
					{
						continue;
					}
					
				// select
					dom.selectNone();
					dom.selection = [element];
					
				// name & convert
					name = 'Symbol ' + (names.length + 1);
					name = promptName ? prompt('Name this object, hit "Cancel" to skip', name) : name;
					if(name)
					{
						names.push(name)
						dom.convertToSymbol(type, name, 'center');
					}
					
				//TODO update the number index if the user changes the number
			}
		}
		
	// return to the parent timeline
		dom.exitEditMode();
		dom.breakApart();
		dom.library.deleteItem('__temp__');
		
	// name elements after their library items, and select items in library
		dom.library.selectNone();
		for each(element in dom.selection)
		{
			if(element.elementType == 'instance' && element.name == '')
			{
				name = element.libraryItem.name;
				dom.library.selectItem(name, false);
				element.name = name.replace(/ /g, '_').toLowerCase();
			}
		}
		
	// move items to new folder
		if(folder)
		{
			$library.newFolder(folder)
			$library.moveToFolder(folder);
		}
}

xjsfl.init(this);
clear();

function test(){inspect(Utils.getArguments(arguments))}

var xul = XUL
	//.factory('title:Create Library Items,radios:Process selected=[Elements, Layers],radios:Convert to=[Movie Clip,Graphic,Button],checkboxes:Options={Detect shapes:shapes,Prompt for names:prompt,Ignore existing symbols:ignore},text:Naming format=Symbol 01,text:Library folder=assets/new')
	.factory('title:Create Library Items,radios:radios:Convert to=[Movie Clip,Graphic,Button],checkboxes:Options={Prompt for names:promptName,Ignore existing symbols:ignoreSymbols},text:Library folder=assets/new')
	.setValue('options', [true,true,true])
	.show(convertElementsToItems);
