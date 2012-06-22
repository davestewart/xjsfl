/**
 * Generates AS3 class declarations for stage instances
 *
 * @author      Dave Stewart
 */

// ----------------------------------------------------------------------------------------------------------------------
// class

	/**
	 * Callback to process selected items
	 * @param	{SymbolItem}	item	The symbol item
	 * @private
	 */
	function ItemExporter(item)
	{
		// variables
			this.item			= item;
			this.data			= {};
			this.imports		= {};
			this.elements		= [];

		// globals
			this.data.author	= author;

		// get the data

			// package & class name
				Utils.extend(this.data, getPackageParts(item.linkageClassName));

			// imports
				this.addImport(item.linkageBaseClass);
				//$library.editItem(item.name);

			// superclass & extends
				if(item.linkageBaseClass)
				{
					var parts			= getPackageParts(item.linkageBaseClass);
					this.data.super		= item.linkageBaseClass;
					this.data.extends	= 'extends ' + parts.name;
				}
				
			// date
				this.data.date			= (new Date()).format();

			// elements
				//var elements = item.timeline
				var elements = {clip:'flash.display.Sprite', text:'flash.text.TextField'};
				//TODO implement this


			// finally, get the imports
				for(var i in elements)
				{
					this.addElement(i, elements[i]);
				}
	}

	ItemExporter.prototype =
	{
		// --------------------------------------------------------------------------------
		// properties
		
			item:null,
	
			data:null,
	
			imports:null,
	
			elements:null,
	
		// --------------------------------------------------------------------------------
		// methods
		
			addImport:function(path)
			{
				if(path)
				{
					this.imports[path] = path;
				}
			},
	
			addElement:function(name, path)
			{
				var parts = getPackageParts(path);
				this.elements.push('public var ' + name + '\t\t:' + parts.name + ';');
				this.addImport(path);
			},
	
			getImports:function()
			{
				var arrIn		= Utils.getKeys(this.imports);
				var arrOut		= [];
				for each (var i in arrIn)
				{
					arrOut.push('import ' + i + ';');
				}
				return Utils.sort(arrOut, false, true).join('\n') + '\n';
			},
	
			save:function(folderURI, simulate)
			{
				// get imports
					this.data.imports	= this.getImports();
					this.data.elements	= this.elements.join('\n');
	
				// template
					var template		= new Template(templateURI, this.data);
	
				// variables
					var path			= this.data.package ? this.data.package.replace(/\./g, '/') + '/' : '';
					var uri				= new URI(folderURI + path + this.data.name+ '.as');
	
				// save
					trace('Exporting "' +uri.path+ '" ');
					if( simulate )
					{
						trace(template.render());
						trace('');
					}
					else
					{
						template.save(uri);
					}
					
			}

	}

// ----------------------------------------------------------------------------------------------------------------------
// utilties

	function getPackageParts(path)
	{
		var matches = path.match(/^(.*?)\.?(\w+)$/);
		if(matches)
		{
			return {'package':matches[1], name: matches[2]};
		}
	}

	function processItem(item, index, items, simulate)
	{
		var exporter = new ItemExporter(item);
		exporter.save(folderURI, simulate);
	}
	
	function processItems(names, path, author, open, simulate)
	{
		trace('Exporting ' +collection.elements.length+ ' items...')
		collection.each(processItem, [simulate]);
		if( ! simulate && open)
		{
			new Folder(folderURI).reveal();
		}
	}


// ----------------------------------------------------------------------------------------------------------------------
// main code

	//TODO
	/*
		Add in user pref functionality
		Test for custom templates
		Sprite.as.txt
		MovieClip.as.txt
	*/

	// main function
		function main()
		{
			// init
				xjsfl.init(this);
				clear();
		
			// grab exported elements
				if($library.getSelectedItems() == 0)
				{
					selectionType = 'all'
					collection = $$(':exported');
				}
				else
				{
					var selectionType = 'selected';
					collection = $$(':selected:exported'); //TODO check that this is working properly - looks like one selector result is overwriting the other!
					if(collection.elements.length == 0)
					{
						alert('None of the selected item(s) are set to export');
						return;
					}
				}
				
			// process items
				if(collection.elements.length)
				{
					var names	= Utils.sortOn(Utils.getValues(collection.elements, 'linkageClassName'), 'linkageClassName');
					var rows	= names.length < 10 ? 10 : names.length + 3;
					XUL
						.factory()
						.setTitle('Export ' +collection.elements.length+ ' classes (' +selectionType+ ')')
						.setColumns([100, 350])
						.addListbox('Items', 'items', names, {rows:rows, multiple:true})
						.addTextbox('Template path', 'template', {width:500, value:templateURI.path})
						.addTextbox('Output path', 'path', {width:500, value:path})
						.addTextbox('Author', 'author', {width:500, value:author, required:false})
						.addCheckbox('Open folder when done', 'openfolder', {checked:true})
						.addCheckbox('Simulate', 'simulate', {checked:false})
						.show(processItems)
				}
				else
				{
					alert('There are no exported items in the Library');
				}		
		}

	// init
		xjsfl.init(this);
	
	// global variables
		var collection;
		var author		= 'Dave Stewart';
		var templateURI	= new URI('//user/assets/templates/class.as');
		var folderURI	= new URI('//user/temp/src/');
		var path		= folderURI.path;

	// start
		main();
