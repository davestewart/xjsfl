function SetManager(module)
{
	// objects
		this.module		= module;
		this.config		= this.module.loadConfig('snippets');
		
	// load
		var set			= this.getCurrent();
		this.load(set.@name);
}
	
SetManager.prototype =
{

	// ------------------------------------------------------------------------------------------------
	// variables
	
		/** @type {Module}	A reference to the main module instance */
		module:null,
		
		/** @type {Config}	The Snippets config file */
		config:null,
	
		/** @type {Config}	The currently loaded snippet set's data */
		set:null,
	
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
				var dataURI		= this.module.uri + 'config/snippets/' + name + '.xml';
				var file		= new File(dataURI);
				
			// if the data file doesn't exist, create it
				if( ! file.exists || rebuild)
				{
					this.build(folderURI, dataURI);
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
					var file	= new File(this.module.uri + 'config/snippets/' +name+ '.xml');
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
							set = xul.values.set;
						break;
	
						case 'Add':
							var state = this.add(xul.controls.set.value);
							set = xul.controls.set.value
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
				//alert(state + ' > '  + xul.values.set)
				if(state)
				{
					var name = this.config.get('sets.@current');
					this.module.panel.call('loadSet', name);
				}
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
		},
		
		/**
		 * Builds the raw XML data for a set by analysing the cotents of a supplied folder URI
		 * @param	{String}	folderURI	The URI of a folder containing JSFL files
		 * @param	{String}	dataURI		The URI of a folder which the resulting XML should be saved to
		 * @returns	{XML}					The generated XML
		 */
		build:function(folderURI, dataURI)
		{
			/*
				Strategy
				
				1 - scan folders and collect URIs
				2 - process URIs
				3 - for folders, create a folder
				4 - for files
					5 - load the file and scan members
					6 - if no DocComment, create a file
					7 - if DocComment and no @snippets tag, create a file but add tooltip
					8 - if @snippets tag is found, create a folder
						 9 - for @snippets all, add all found methods, unless @ignore, @inner or @private is set
						10 - for @snippets some, add only methods which have a @snippet tag
			*/			
			
			// --------------------------------------------------------------------------------
			// functions
			
				function makeAttribute(value)
				{
					return value.replace(/[\r\n]+/g, '').replace(/\s*\/\s*/g, ' or ');
				}
			
				/**
				 * Adds a file or function item to the node list
				 */
				function addItem(item, properties, member)
				{
					// variables
						properties = properties || {};
						
					// if a member was passed, grab its properties
						if(member && member.getTag)
						{
							var text	= member.getText().toSentenceCase();
							var icon	= member.getTag('icon');
							var obj		=
							{
								tooltip		:makeAttribute(text),
								icon		:icon ? icon.text.replace(/{iconsURI}/g, iconsURI) : null,
							}
							Utils.extend(properties, obj);
						}
					
					// add properties
						for(var name in properties)
						{
							var value = properties[name];
							if(value != undefined)
							{
								item['@' + name] = value;
							}
						}
					
					// add node
						xml.appendChild(item);
				}
				
			// --------------------------------------------------------------------------------
			// variables
			
				// debug
					clear();
					Snippets.log('building set for "' + URI.asPath(folderURI, true)+ '"');
		
				// uris
					folderURI			= URI.toURI(folderURI);
					var uris			= Utils.getSearchableURIs(folderURI);
					uris.shift();
					
				// create data
					var iconsURI		= this.module.uri + 'assets/icons/16x16/';
					
				// load in old XML so we can copy folder open / closed states
					var xmlOld			= FLfile.exists(dataURI) ? xjsfl.file.load(dataURI) : null;
					
				// generate xml
					var xml				= <items uri={folderURI} />;
	
			// --------------------------------------------------------------------------------
			// create data
			
				// loop
					for each(var uri in uris)
					{
						// --------------------------------------------------------------------------------
						// get the URI's data
						
							// create URI
								uri				= new URI(uri);
								
							// variables
								var itemPath	= uri.uri.replace(/\.jsfl$/, '').substr(folderURI.length);
								var itemURI		= uri.uri;
								
							// create node
								var item		= <item path={itemPath} uri={itemURI} />
								
						// --------------------------------------------------------------------------------
						// process folder
						
							// folder
								if(uri.type === 'folder')
								{
									// grab the current open / closed state from the existing config file
										var node		= xmlOld ? xmlOld.find('@path=' + itemPath) : null;
										var closed		= node ? node.@closed : false;
										
									// add item
										addItem(item, {closed:closed});
								}
		
						// --------------------------------------------------------------------------------
						// process file
						
							// file properties
								else
								{
									// --------------------------------------------------------------------------------
									// get file details
									
										// skip non jsfl files.
											if( ! /\.jsfl$/.test(uri) )
											{
												continue;
											}
											
										// debug
											this.module.log('processing "' + uri.path + '"')
										
										// get source
											try
											{
												var members		= Source.parseFile(uri).getMembers();
											}
											catch(error)
											{
												debug(error);
												break;
											}
											
										// determine snippets instructions by checking leading DocComment
												var process		= 'file';
											var member		= members.shift();
											if(member instanceof Source.classes.DocComment)
											{
												var snippets	= member.getTag('snippets');
												var process		= snippets ? snippets.text : 'file';
											}
											
									// --------------------------------------------------------------------------------
									// decide what to do with contents
									
										if(process === 'file')
										{
											addItem(item, null, member);
										}
										
										else
										{
											// add group head
												item.@path	+= '/';
												
											// create base node String
												var strNode	= item.toXMLString();
												
											// add group head
												addItem(item);
												
											// add members
												for (var i = 0; i < members.length; i++)
												{
													// variables
														var member	= members[i];
														
													// skip if member is not a function or is private
														if(member.class !== 'Function' || member.getFlag('private') || member.getFlag('inner') || member.getFlag('ignore'))
														{
															continue;
														}
														
													// skip if processing is limited to "some" and function is not marked as a snippet
														if(process !== 'all' && ! member.getFlag('snippet'))
														{
															continue;
														}
														
													// update item
														var item	= new XML(strNode);
														item.@path	+= makeAttribute(member.getText()).toSentenceCase();
													
													// skip if node already exists
														if(xml.get('.(@path=' + item.@path + ')').length() > 0)
														{
															format('>Snippets: warning - skipped duplicate declaration of "{path}"', item.@path.toXMLString());
															continue;
														}
														
													// add item
														addItem(item, {func:member.name}, member);
											}
										}
								}
	
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