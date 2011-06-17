
var snippets =
{
	
	// ------------------------------------------------------------------------------------------------
	// constructor, 
	
		init:function()
		{
			// always refresh when instantiating
			this.saveData();
		},
		
	// ------------------------------------------------------------------------------------------------
	// variables

		iconUri:this.uri + 'assets/icons/16x16/',
		
	// ------------------------------------------------------------------------------------------------
	// make the config file that stores the user's scripts

		saveData:function()
		{
			// recursive function to iterate through folders and list all user scripts
				function recurse(root, fnChild, fnTestChildren)
				{
					var indent = '';
					var level = 0;
					
					function list(e, i)
					{
						fnChild(e, i, level, indent);
						if(fnTestChildren ? fnTestChildren(e, level) : e.length)
						{
							level ++;
							indent += '	';
							e.each(list);
							indent = indent.substring(1);
							level--;
						}
					}
					
					list(root);
					
				}
				
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
						item.@path	= element.path + (item.@type == 'folder' ? '/' : '');
						
					// file properties
						if(element instanceof File)
						{
							var contents	= element.contents || '';
							var comments	= contents.match(/\/\*(?:(?!\*\/|\/\*)[\s\S])*(?:\/\*(?:(?!\*\/|\/\*)[\s\S])*\*\/(?:(?!\*\/|\/\*)[\s\S])*)*[\s\S]*?\*\//);
							if(comments)
							{
								var desc	= comments[0].match(/@desc\s+([^\r\n]+)/);
								if(desc == null)
								{
									var desc	= comments[0].match(/\* (\w[^\r\n]+)/);
								}
								var icon	= comments[0].match(/@icon\s+([^\r\n]+)/);
								
								if(icon)
								{
									item.@icon = icon[1];
								}
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
						items.appendChild(item);
				}
				
			// path
				var path		= new Folder(xjsfl.uri + 'user/jsfl/snippets').path + '/';
				
			// debug
				//fl.trace('Saving from "' +path+ '"');
				//fl.trace('Saving from to "' +this.data.uri+ '"');
				
			// generate xml
				var items		= new XML('<files type="folder" label="scripts" />');
				
			// icon url
				items.@path		= path;
				//items.@iconsURI	= xjsfl.uri + 'modules/Snippets/assets/icons/16x16/';
				
			// grab files
				recurse(new Folder(path), callback, function(e){return e instanceof Folder && e.name.substr(0, 1) != '_'})
				
			// trace
				this.data.xml = items;
				this.data.save();
		},
	
	// ------------------------------------------------------------------------------------------------
	// public functions for Flash Panel
	
		runFile:function(path)
		{
			new File(path).run();
		},
	
		openFile:function(path)
		{
			new File(path).open();
		},
	
		browseFile:function(path)
		{
			new File(path).reveal();
		},
	
		browseFolder:function(path)
		{
			new Folder(path).open();
		},
	
		deleteFile:function(path)
		{
			var file = new File(path);
			file.remove();
			return ! file.exists;
		},
	
		deleteFolder:function(path)
		{
			var folder = new Folder(path);
			folder.remove()
			return ! folder.exists;
		},
		
		createCommand:function(name, path)
		{
			var jsfl	= 'fl.runScript("' +FLfile.platformPathToURI(path)+ '");';
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
		
		makeFolder:function(path)
		{
			//fl.trace('Creating folder: ' + path)
			var folder = new Folder(path, true);
			return folder.exists();
		},
		
		//TODO update to use Template class
		makeFile:function(path, contents, desc, icon, version, author)
		{
			// debug
				fl.trace('Creating file: ' + path)
				
			// default values
				var date		= new Date();
				var name		= path.match(/([^\/]+)\.jsfl$/)[1];
				desc			= desc || name;
				icon			= icon || 'Filesystem/page/page_white.png';
				version			= version || '1.0';
				author			= author || 'Dave Stewart (dave@xjsfl.com)'
				
			// read template file
				var template	= new File(this.xjsflPath + 'user/config/templates/template.jsfl').contents;
				
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
		},
		
		toString:function()
		{
			return '[module Snippets]';
		}

		
	}

// ------------------------------------------------------------------------------------------------
// create module
	
	//xjsfl.reload();
	//xjsfl.init(this);
	var module = new Module('Snippets', snippets);
	
	//module.createCommand('test', 'this is a test');
	
	/*
	module.settings.xml.author = 'Dave Stewart';
	module.settings.xml.url = 'www.xjsfl.com';
	module.settings.xml.icon= 'Filesystem/page/page_white.png';
	
	module.settings.save();
	*/

/*
	xjsfl.init(this);
	
	
	var nodes	= module.data.xml.children()
	var path	= nodes[4].@path;
	alert(path)
	module.browseFile(path);

	//module.saveData();

	//Output.inspect(module)
*/
// ------------------------------------------------------------------------------------------------
// main

//fl.outputPanel.clear();
//snippets.makeXML();
//fl.trace(snippets.getXML())
//snippets.makeFolder(xjsfl.uri + 'user/temp/test/')
//makeFile('E:/02 - Current Jobs/xJSFL/xJSFL/user/jsfl/scripts/test/new file.jsfl', "alert('HELLO!');")





