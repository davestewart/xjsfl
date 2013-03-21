/**
 * Export library item classes
 * @icon {iconsURI}actions/disk/disk_multiple.png
 */
xjsfl.init(this);

function addPath(event)
{
	event.xul.controls.path.value = URI.asPath(fl.browseForFolderURL() || '');
}

function exportClasses(path, selected)
{
	// variables
		var collection	= $$(selected ? ':selected:exported' : ':exported').sort();
	
	// export
		/** @type {SymbolItem}	The symbol item */
		var item;
		for each(var item in collection.elements)
		{
			// variables
				var baseClass		= Utils.getAS3BaseClass(item);
				var packageParts	= item.linkageClassName.split('.');
				var pathOut			= path + '/' + item.linkageClassName.replace(/\./g, '/') + '.as';
			
			// data
				var data =
				{
					name			: packageParts.pop(),
					package			: packageParts.join('.')
				}
				if(baseClass)
				{
					data.imports	= baseClass ? 'import ' + baseClass + ';' : '';
					data.extends	= baseClass ? 'extends ' + baseClass.split('.').pop() : '';
				}
			
			// export
				new Template('//user/assets/templates/class.as', data).save(pathOut);
		}
	
	// done
		list(collection.elements, 'name', collection.elements.length + ' asset(s) exported');
}

XUL
	.factory('title:Export classes,text:Path,button:Pick,checkbox:Selected only')
	.addEvent('pick', 'click', addPath)
	.show(exportClasses);