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
					this.createData(folderURI, dataURI);
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
					var folder	= new Folder(uri);
					var name	= prompt('Choose a name for the new set', folder.name.substr(0, 1).toUpperCase() + folder.name.substr(1));
				}

			// create data
				if(uri && name)
				{
					// add settings
						this.settings.xml.sets.set += new XML('<set name="' +name+ '" uri="' +xjsfl.file.makePath(uri, true)+ '" />');

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
		createData:function(folderURI, dataURI)
		{
			// callack for recusrsive function
				function callback(element, index, level, indent)
				{
					// always skip the first folder
						if(
							level == 0 ||
							(element.name.substr(0, 1) == '_') ||
							(element instanceof File && element.extension != 'jsfl')
						)
						{
							return;
						}

					// create XML node
						var item	= <item />

					// set basic properties
						//item.@level	= level - 1;
						item.@type	= (element instanceof Folder ? 'folder' : 'file');
						item.@label	= element.name.replace(/\.jsfl$/, '');
						item.@path	= element.uri + (item.@type == 'folder' ? '/' : '');

					// file properties
						if(element instanceof File)
						{
							//TODO use Source class instead
							//TODO also parse functions

							var contents	= element.contents || '';
							var comments	= contents.match(/\/\*(?:(?!\*\/|\/\*)[\s\S])*(?:\/\*(?:(?!\*\/|\/\*)[\s\S])*\*\/(?:(?!\*\/|\/\*)[\s\S])*)*[\s\S]*?\*\//);
							if(comments)
							{
								// desc
									var desc	= comments[0].match(/@desc\s+([^\r\n]+)/);
									if(desc == null)
									{
										var desc	= comments[0].match(/\* (\w[^\r\n]+)/);
									}

								// icon
									var icon	= comments[0].match(/@icon\s+([^\r\n]+)/);
									if(icon)
									{
										item.@icon = icon[1].replace(/{iconsURI}/g, iconsURI);
									}

								// desc ... again? TODO Tidy up
									if(desc)
									{
										item.@desc = desc[1].replace(/"/g, '\"');
									}
							}
						}

					// folder properties
						else if(element instanceof Folder)
						{
							item.@items = element.length;
						}

					// add child
						xml.appendChild(item);
				}

			// update folderURI
				folderURI			= xjsfl.file.makeURI(folderURI);
				var iconsURI		= this.uri + 'assets/icons/16x16/';

			// generate xml
				var xml				= <files type="folder" label="scripts" />;
				xml.@path			= folderURI;

			// debug
				trace('Building snippet set for "' + xjsfl.file.makePath(folderURI, true)+ '"');

			// process files
				Data.recurseFolder(folderURI, callback);

			// save config
				var file			= new File(dataURI, xml).save();
		},


	// ------------------------------------------------------------------------------------------------
	// public functions for Flash Panel

		runFile:function(uri)
		{
			new File(uri).run();
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
			//fl.trace('Creating folder: ' + uri)
			var folder = new Folder(uri, true);
			return folder.exists();
		},

		//TODO update to use Template class
		makeFile:function(uri, contents, desc, icon, version, author)
		{
			// debug
				fl.trace('Creating file: ' + FLfile.uriToPlatformPath(uri))

			// default values
				var date		= new Date();
				var name		= uri.match(/([^\/]+)\.jsfl$/)[1];
				desc			= desc || name;
				icon			= icon || 'Filesystem/page/page_white.png';
				version			= version || '1.0';
				author			= author || 'Dave Stewart (dave@xjsfl.com)'

			// read template file
				var template	= new File(xjsfl.uri + 'user/config/templates/template.jsfl').contents;

			// grab contents
				var docs		= '';
				var stub		= '';
				var matches		= template.match(/(\/\*\*[\s\S]+?\*\/)/i);

				if (matches != null)
				{
					docs		= matches[1];
					stub		= matches[0].substr(docs.length)
					docs		= docs
						.replace('{date}', date)
						.replace('{desc}', desc)
						.replace('{icon}', icon)
						.replace('{version}', version)
						.replace('{author}', author)
				}

			// update contents
				contents		= docs + '\n\n' + (contents || stub);

			// save file
				var file		= new File(path, contents)
				file.save()
		}


	}

// ------------------------------------------------------------------------------------------------
// create module

/**
 * @type {Module}
 */
Snippets = xjsfl.modules.create('Snippets', Snippets);
