FileManager =
{
	
	// ------------------------------------------------------------------------------------------------
	// methods
	
		init:function()
		{
			// nothing happens yet
		},
	
		/**
		 * Creates a file in the Commands folder, which in turn calls the Snippets
		 * @param	{String}	name	The name of the Command file
		 * @param	{String}	uri		The URI of the Snippet to run when the Command is called
		 * @returns	{Boolean}			True or flase, depending on whether the file was created
		 */
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

		/**
		 * Creates a Snippet file on the hard disk
		 * @param	{String}	targetURI		The URI to save the newly-created file to
		 * @param	{String}	contents		The contents of the newly-created file
		 * @param	{String}	description		An optional description that will show up as a tooltip
		 * @param	{String}	icon			An optional icon URI or relative path to the icon file
		 * @param	{String}	version			An optional version number
		 * @returns	{Boolean}					True or false, depending on whether the file was saved
		 */
		createFile:function(targetURI, contents, description, icon, version)
		{
			// values
				targetURI			= URI.toURI(targetURI);
				var name			= URI.getName(targetURI, true);
				var user			= new Config('user').get('personal');
				
			// template file
				var templateURI		= xjsfl.file.find('template', 'snippet.jsfl');
			
			// debug
				Snippets.log('creating file: ' + URI.toPath(targetURI, true));

			// default values
				var data =
				{
					contents	:contents || '',
					description	:description || name,
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
				return template.save(targetURI);
		},
		
		/**
		 * Builds the raw XML data for a set by analysing the cotents of a supplied folder URI
		 * @param	{String}	folderURI	The URI of a folder containing JSFL files
		 * @param	{String}	dataURI		The URI of a folder which the resulting XML should be saved to
		 * @returns	{XML}					The generated XML
		 */
		createSet:function(folderURI, dataURI)
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
				
				function addFolder(item)
				{
					// grab the current open / closed state from the existing config file
						var path		= String(item.@path);
						var node		= xmlOld ? xmlOld.item.(function::attribute('path') == path) : null;
						var closed		= node ? node.@closed : false;

					// add item
						addItem(item, {closed:closed});
				}
				
			// --------------------------------------------------------------------------------
			// variables
			
				// debug
					Snippets.log('building set for "' + URI.asPath(folderURI, true)+ '"', true);
		
				// uris
					folderURI			= URI.toURI(folderURI);
					var uris			= Utils.getSearchableURIs(folderURI);
					uris.shift();		// remove root URI
					
				// create data
					var iconsURI		= Snippets.uri + 'assets/icons/16x16/';
					
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
								var itemPath	= uri.uri.substr(folderURI.length).replace(/%20/g, ' ').replace(/\.jsfl$/, '');
								var itemURI		= uri.uri;

							// create node
								var item		= <item path={itemPath} uri={itemURI} />
								
						// --------------------------------------------------------------------------------
						// process folder
						
							// folder
								if(uri.type === 'folder')
								{
									addFolder(item);
								}
		
						// --------------------------------------------------------------------------------
						// process file
						
							// file properties
								else
								{
									// --------------------------------------------------------------------------------
									// get file details
									
										// skip non jsfl files.
											if(uri.extension !== 'jsfl')
											{
												continue;
											}
											
										// debug
											// Snippets.log('processing "' + uri.path + '"')
										
										// get source
											try
											{
												var source = new Source();
												var members = source.parseFile(uri).getMembers();
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
												addFolder(item);
												
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
					//trace(xml);
				}
				
				return xml;
		}
}