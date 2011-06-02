// ------------------------------------------------------------------------------------------------------------------
// variables

	var trace			= fl.trace
	var dom				= fl.getDocumentDOM();
	var lib				= dom.library

	var items			= []
	var folders			= {};
	
	var itemPath, index, item, itemName, itemType, parentFolderPath, lastFolder, segments

// ------------------------------------------------------------------------------------------------------------------
// get all library items and their types into an array we can sort

	// items
		for(var i = 0; i < lib.items.length; i++)
		{
			items.push({path:lib.items[i].name, type:lib.items[i].itemType, index:i});
		}
		
	// sort
		function comparePaths(a, b)
		{
			a = a.path.toLowerCase();
			b = b.path.toLowerCase();
			if (a < b)return -1;
			if (a > b)return 1;
			return 0;
		}
		items.sort(comparePaths);

// ------------------------------------------------------------------------------------------------------------------
// utility functions

	function getParentFolders(path)
	{
		var folders		= path.split('/');
		var path		= '';
		var paths		= [path];
		var segment;
		var arr			= [];
		
		while(folders.length > 0)
		{
			segment = folders.shift();
			if(segment != '')
			{
				arr.push(segment)
				paths.push(arr.join('/'));
			}
		}
		return paths;
	}
	
	function setParentsFoldersFull(parentFolders)
	{
		for(var i = 0; i < parentFolders.length; i++)
		{
			folders[parentFolders[i]] = true;
		}
	}

// ------------------------------------------------------------------------------------------------------------------
// loop through the folders

	lib.selectNone();
	for(var i = 0; i < items.length; i++)
	{
		// variables
			itemPath			= items[i].path;
			itemType			= items[i].type;

		// item name and parent folder path
			segments			= itemPath.split('/')
			itemName			= segments.pop();
			parentFolderPath	= segments.join('/');
			
		// folder
			if(itemType == 'folder')
			{
				if(folders[itemPath] === undefined)
				{
					folders[itemPath] = false;
				}
			}
		// item
			else
			{
				if(folders[parentFolderPath] == false)
				{
					var parentFolders = getParentFolders(parentFolderPath);
					setParentsFoldersFull(parentFolders);
				}
				else
				{
					continue;
				}
			}
	}

// ------------------------------------------------------------------------------------------------------------------
// delete empty folders

	// get empty folders
		var emptyFolders = [];
		for(var f in folders)
		{
			if(folders[f] == false)
			{
				emptyFolders.push(f);
			}
		}
		emptyFolders.sort();
		
	// delete empty folders
		if(emptyFolders.length > 0)
		{
			trace('\nDeleting ' +emptyFolders.length+ ' empty folders...')
			while(emptyFolders.length > 0)
			{
				var folder = emptyFolders.pop()
				trace('	/' + folder)
				lib.deleteItem(folder);
			}
		}
		else
		{
			trace('\nThere are no empty folder to delete!')
		}
		