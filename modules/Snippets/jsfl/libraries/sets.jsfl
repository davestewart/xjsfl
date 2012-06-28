SetManager =
{
	
	// ------------------------------------------------------------------------------------------------
	// variables
	
		/** @type {Config}	The Snippets config file */
		config:null,
	
		/** @type {Config}	The currently loaded snippet set's data */
		set:null,
	
	// ------------------------------------------------------------------------------------------------
	// Init
	
		init:function()
		{
			// objects
				this.config		= Snippets.loadConfig('snippets');
				
			// load
				var set			= this.getCurrent();
				this.load(set.@name);
		},
	
	// ------------------------------------------------------------------------------------------------
	// Get
	
		/**
		 * Returns a named snippet set
		 * @param	{String}				The name of an existing snippet set
		 * @return	{XML}					The XML of the named snippet set
		 */
		get:function(name)
		{
			return this.config.get('sets.set.(@name=' + name + ')');
		},
	
		/**
		 * Returns the current snippet set node
		 * @return	{XML}					The XML of the current Snippet set
		 */
		getCurrent:function()
		{
			// grab current set
				var sets	= this.config.get('sets');
				var set		= sets.get('set.(@name=' +sets.@current+ ')');
		
			// if not defined, default to the first set, and re-save
				if(set.length() == 0)
				{
					set = sets.set[0];
					sets.@current = set.@name;
				}
				
			// return
				return set;
		},
	
	// ------------------------------------------------------------------------------------------------
	// Add / remove
	
		/**
		 * Change the current snippets set
		 * @param	{String}	name		The name of the snippet set to change to
		 * @param	{Boolean}	rebuild		An optional Boolean to rebuild the new set at the same time as changing to it
		 * @returns	{Boolean}				True
		 */
		load:function(name, rebuild)
		{
			// grab config set node			
				var node		= this.config.get('sets.set.(@name=' +name+ ')');
				
			// grab data for set
				var folderURI	= URI.toURI(node.@uri);
				var dataURI		= Snippets.uri + 'config/snippets/' + name + '.xml';
				var file		= new File(dataURI);
				
			// if the data file doesn't exist, create it
				if( ! file.exists || rebuild)
				{
					FileManager.createSet(folderURI, dataURI);
				}
	
			// update and save settings
				this.set = new Config(dataURI);
				this.config.set('sets.@current', name);
				
			// return
				return true;
		},
	
		/**
		 * Add a new Snippet set
		 * @return	{Boolean}				True if a set was added, false otherwise
		 */
		add:function()
		{
			// UI
				var uri = fl.browseForFolderURL('Choose a folder');
				if(uri)
				{
					uri += '/';
					var folder	= new Folder(uri);
					var name	= prompt('Choose a name for the new set', folder.name.toSentenceCase());
				}
	
			// create data
				if(uri && name)
				{
					this.config
						.remove('sets.set.(@name=' +name+ ')')
						.set('sets.set', <set name={name} uri={uri} />, true)
						.set('sets.@current', name);
					this.load(name);
					return true;
				}
				return false;
		},
	
		/**
		 * Remove an existing snippet set
		 * @param	{String}		name	The String name of the set to remove
		 * @return	{Boolean}				True if the set was added, false otherwise
		 */
		remove:function(name)
		{
			if(confirm('Are you sure you want to remove set ' +name+ '?'))
			{
				// remove file
					var file	= new File(Snippets.uri + 'config/snippets/' +name+ '.xml');
					Snippets.log('removing "' + file.uri + '"');
					var state	= file.remove(true);
					//TODO Check why files aren't being removed
	
				// remove setting
					var sets	= this.config.get('sets');
					this.config.remove('sets.set.(@name=' +name+ ')');
					
				// if setting is current, revert to first setting
					if(sets.@current == name)
					{
						name = sets.set[0].@name;
						this.load(name);
					}
					this.config.save();
					
				// return
					return true;
			}
	
			return false;
		},
	

	// ------------------------------------------------------------------------------------------------
	// UI methods
	
		/**
		 * Pops up a XUL dialog to switch between, add or remove snippet sets
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
				var set;
				if(xul.accepted)
				{
					switch(xul.values.action)
					{
						case 'Load':
							var state = this.load(xul.values.set);
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
					var name = this.config.get('sets.@current');
					Snippets.panel.call('loadSet', name);
				}
				
			// return
				return state;
		},
		
	
	// ------------------------------------------------------------------------------------------------
	// data methods
	
		/**
		 * Sets (saves) the open or closed state of a folder in the current snippet set to config
		 * @param	{String}	path		The path to the folder in the snippet set
		 * @param	{Boolean}	state		The state of the folder - true = open, false = closed
		 */
		setFolderState:function(path, state)
		{
			var node = this.set.xml.get('item.(@path=' +path+')');
			if(node)
			{
				node.@closed = ! state;
				this.set.save();
			}
		},

		/**
		 * Sets (saves) the scroll position of the tree to config
		 * @param	{Number}	position		The scroll position of the tree
		 */
		setScrollPosition:function(position)
		{
			var node = this.set.set('@scrollPosition', position);
		},

		
		/**
		 * Rebuilds the current snippet set
		 */
		rebuild:function()
		{
			var set = this.getCurrent();
			this.load(set.@name, true);
		}

}