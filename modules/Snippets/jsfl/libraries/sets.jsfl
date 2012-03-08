
function SetManager(module)
{
	// objects
		this.module		= module;
		this.config		= this.module.loadConfig('snippets');
		
	// load sets
		this.set		= this.getCurrent();
		this.change(this.set.@name);
}

SetManager.prototype =
{

	// ------------------------------------------------------------------------------------------------
	// variables
	
		module:null,
		
		config:null,
	
		set:null,
	
		sets:[],
		
	// ------------------------------------------------------------------------------------------------
	// methods
	
		/**
		 * Change the current snippets set
		 * @param	name	{String}
		 * @returns
		 */
		change:function(name, force)
		{
			// grab config for set
				var dataURI		= this.module.uri + 'config/snippets/' + name + '.xml';
				var file		= new File(dataURI);
				var sets		= this.config.get('sets');
	
			// if the config file doesn't exist, create it
				if( ! file.exists || force)
				{
					var folderURI = sets.find(function(node){ return node.@name == name; }).@uri;
					trace('>' + folderURI)
					this.build(folderURI, dataURI);
				}
	
			// update and save settings
				this.config.set('sets.@current', name);
	
			// return
				return true;
		},
	
		/**
		 * Add a new Snippet set
		 * @returns
		 */
		add:function()
		{
			// UI
				var uri = fl.browseForFolderURL('Choose a folder');
				if(uri)
				{
					var folder	= new Folder(uri + '/');
					var name	= prompt('Choose a name for the new set', folder.name.substr(0, 1).toUpperCase() + folder.name.substr(1));
				}
	
			// create data
				if(uri && name)
				{
					// add settings
						this.config.xml.sets.set += new XML('<set name="' +name+ '" uri="' +URI.asPath(uri, true)+ '" />');
	
					// change set
						this.change(name);
	
					// return
						return true;
				}
				return false;
		},
	
		/**
		 *
		 * @param	name
		 * @returns
		 */
		remove:function(name)
		{
			if(confirm('Are you sure you want to remove set ' +name+ '?'))
			{
				// remove file
					var file = new File(this.module.uri + 'config/snippets/' +name+ '.xml');
					file.remove(true);
	
				// remove setting
					var sets	= this.config.get('sets');
					sets.remove('@name=' + name);
					this.config.save();
	
				// if setting is current, revert to first setting
					if(sets.@current == name)
					{
						name = sets.set[0].@name;
						this.change(name);
					}
	
				// return
					return true;
			}
	
			return false;
		},
	

		/**
		 *
		 * @param
		 * @returns
		 */
		getCurrent:function()
		{
			// grab current set
				var sets	= this.config.get('sets');
				var set		= sets.find('@name=' +sets.@current)[0];
	
			// if not defined, default to the first set, and re-save
				if( ! set)
				{
					set = sets.set[0];
					sets.@current = set.@name;
					this.config.save();
				}
	
			// return
				return set;
		},
	
		get:function(name)
		{
			// grab current set
				var sets	= this.config.get('sets');
				var set		= sets.find( function(node){ return node.@name == name; } )[0];
	
			// return
				return set;
		},
	
	// ------------------------------------------------------------------------------------------------
	// Flash methods
	
		/**
		 *
		 * @param
		 * @returns
		 */
		manage:function()
		{
			// grab set names
				var names		= [];
				var sets		= this.config.get('sets');
				var selected	= sets.@current;
				for each(var set in sets.set)
				{
					names.push(String(set.@name));
				}
	
			// create XUL dialog
				var xul = XUL.factory()
					.setTitle('Snippets')
					.addRadiogroup('Set', 'set', names)
					.addDropdown('Action', 'action', ['Load', 'Add', 'Remove'])
					.setValue('set', selected)
					.show();
	
			// take action
				if(xul.values.accept)
				{
					switch(xul.values.action)
					{
						case 'Load':
							var state = this.change(xul.values.set);
						break;
	
						case 'Add':
							var state = this.add(xul.controls.set.value);
						break;
	
						case 'Remove':
							var state = this.remove(xul.controls.set.value);
						break;
					}
				}
	
			// update
				/*
					This is a hack, as Flash appears to forget about the XUL dialog after
					a short while so the panel needs to be reminded to update manually.
					Ordinarily, we should return true or false.
				*/
				if(state)
				{
					this.module.panel.call('loadSet', xul.values.set);
				}
		},
		
	
	// ------------------------------------------------------------------------------------------------
	// methods
	
		rebuild:function()
		{
			var set = this.getCurrent();
			this.change(set.@name, true);
		},
	
		/**
		 *
		 * @param	name
		 * @param	uri
		 * @returns
		 */
		build:function(folderURI, dataURI)
		{
			// debug
				this.module.log('building set for "' + URI.asPath(folderURI, true)+ '"');
	
			// --------------------------------------------------------------------------------
			// get URIs
			
				folderURI			= URI.toURI(folderURI);
				var uris			= Utils.getSearchableURIs(folderURI);
					
			// --------------------------------------------------------------------------------
			// create data
			
				// generate xml
					var xml				= <items type="folder" label="Snippets" path={folderURI} />;
	
				// create data
					var iconsURI		= this.module.uri + 'assets/icons/16x16/';
					
				// loop
					for each(var uri in uris)
					{
						// create URI
							uri = new URI(uri);
						
						// create XML node
							var item		= <item />
	
						// set basic properties
							//item.@level	= level - 1;
							item.@type		= uri.type;
							item.@label		= uri.name.replace(/\.jsfl$/, '');
							item.@path		= uri.uri;
	
						// file properties
							if(uri.type == 'file')
							{
								// get comment
									var comment = Source.parseDocComment(uri);
									if(comment)
									{
										item.@desc	= comment.intro;
										var icon	= comment.getTag('icon');
										if(icon)
										{
											item.@icon	= icon.comment.replace(/{iconsURI}/g, iconsURI);
										}
									}
							}
	
						// folder properties
							else
							{
								item.@items = new Folder(uri).length;
							}
	
						// add child
							xml.appendChild(item);
					}
	
			// --------------------------------------------------------------------------------
			// save config
			
				if(dataURI)
				{
					save(dataURI, xml);
				}
				
				return xml;
		},

}