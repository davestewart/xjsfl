xjsfl.init(this)
var Snippets =
{
	// ------------------------------------------------------------------------------------------------
	// constructor,
	
		init:function()
		{
			// load settings
				this.settings	= this.loadConfig('snippets');

			// setup
				var set			= this.getCurrentSet();
				this.changeSet(set.@name);
		},

	// ------------------------------------------------------------------------------------------------
	// public functions for Flash Panel

		/**
		 * Change the current snippets set
		 * @param	name	{String}
		 * @returns
		 */
		changeSet:function(name, force)
		{
			// grab config for set
				var dataURI		= this.uri + 'config/data/' + name + '.xml';
				var file		= new File(dataURI);
				var sets		= this.settings.get('sets');

			// if the config file doesn't exist, create it
				if( ! file.exists || force)
				{
					var folderURI = sets.find(function(node){ return node.@name == name; }).@uri;
					this.makeSet(folderURI, dataURI);
				}

			// update and save settings
				this.settings.set('sets.@current', name);

			// return
				return true;
		},

		/**
		 * Add a new Snippet set
		 * @returns
		 */
		addSet:function()
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
						this.settings.xml.sets.set += new XML('<set name="' +name+ '" uri="' +URI.asPath(uri, true)+ '" />');

					// change set
						this.changeSet(name);

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
		removeSet:function(name)
		{
			if(confirm('Are you sure you want to remove set ' +name+ '?'))
			{
				// remove file
					var file = new File(this.uri + 'config/data/' +name+ '.xml');
					file.remove(true);

				// remove setting
					var sets	= this.settings.get('sets');
					sets.remove('@name=' + name);
					this.settings.save();

				// if setting is current, revert to first setting
					if(sets.@current == name)
					{
						name = sets.set[0].@name;
						this.changeSet(name);
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
		manageSets:function()
		{
			// grab set names
				var names		= [];
				var sets		= this.settings.get('sets');
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
							var state = this.changeSet(xul.values.set);
						break;

						case 'Add':
							var state = this.addSet(xul.controls.set.value);
						break;

						case 'Remove':
							var state = this.removeSet(xul.controls.set.value);
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
					this.panel.call('loadSet', xul.values.set);
				}
		},

		/**
		 *
		 * @param
		 * @returns
		 */
		getCurrentSet:function()
		{
			// grab current set
				var sets	= this.settings.get('sets');
				var set		= sets.find('@name=' +sets.@current)[0];

			// if not defined, default to the first set, and re-save
				if( ! set)
				{
					set = sets.set[0];
					sets.@current = set.@name;
					this.settings.save();
				}

			// return
				return set;
		},

		getSet:function(name)
		{
			// grab current set
				var sets	= this.settings.get('sets');
				var set		= sets.find( function(node){ return node.@name == name; } )[0];

			// return
				return set;
		},



		rebuild:function()
		{
			var set = this.getCurrentSet();
			this.changeSet(set.@name, true);
			this.panel.call('update');
		},

	// ------------------------------------------------------------------------------------------------
	// make the config file that stores the user's scripts

		/**
		 *
		 * @param	name
		 * @param	uri
		 * @returns
		 */
		makeSet:function(folderURI, dataURI)
		{
			// debug
				this.log('building set for "' + URI.asPath(folderURI, true)+ '"');

			// --------------------------------------------------------------------------------
			// get URIs
			
				folderURI			= URI.toURI(folderURI);
				var uris			= Utils.getSearchableURIs(folderURI);
					
			// --------------------------------------------------------------------------------
			// create data
			
				// generate xml
					var xml				= <items type="folder" label="Snippets" path={folderURI} />;
	
				// create data
					var iconsURI		= this.uri + 'assets/icons/16x16/';
					
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


	// ------------------------------------------------------------------------------------------------
	// public functions for Flash Panel

		runFile:function(uri)
		{
			fl.runScript(uri);
		},

		runFunction:function(uri, name)
		{
			fl.runScript(uri, name);
		},

		openFile:function(uri)
		{
			new File(uri).open();
		},

		browseFile:function(uri)
		{
			new File(uri).reveal();
		},

		browseFolder:function(uri)
		{
			new Folder(uri).open();
		},

		deleteFile:function(uri)
		{
			var file = new File(uri);
			file.remove();
			return ! file.exists;
		},

		deleteFolder:function(uri)
		{
			var folder = new Folder(uri);
			folder.remove()
			return ! folder.exists;
		},

		createCommand:function(name, uri)
		{
			var jsfl	= 'fl.runScript("' +uri+ '");';
			var file	= new File(fl.configURI + 'Commands/' + name + '.jsfl', jsfl);
			file.save();
			if(file.exists)
			{
				alert('Command "' +name+ '" created OK.');
			}
			else
			{
				if(confirm('There was a problem creating the command "' +name+ '". Would you like to open the commands folder?'))
				{
					file.parent.open();
				};
			}
			return file.exists;
		},

		makeFolder:function(uri)
		{
			return new Folder(uri, true).exists;
		},

		makeFile:function(targetURI, contents, desc, icon, version)
		{
			// values
				targetURI			= URI.toURI(targetURI);
				var name			= URI.getName(targetURI, true);
				var user			= new Config('user').get('personal');
				var templateURI		= this.settings.get('template.@uri');
			
			// debug
				this.log('creating file: ' + URI.toPath(targetURI))

			// default values
				var data =
				{
					contents	:contents || '',
					desc		:desc || name,
					icon		:icon || 'Filesystem/page/page_white.png',
					version		:version || '0.1',
					name		:name,
					date		:new Date().format(),
					author		:user.name,
					email		:user.email,
					url			:user.url
				}

			// update template
				var template = new Template(templateURI, data);
				template.save(targetURI);
		}


	}

// ------------------------------------------------------------------------------------------------
// create module

/**
 * @type {Module}
 */
Snippets = xjsfl.modules.create('Snippets', Snippets, this);