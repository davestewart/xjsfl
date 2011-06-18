// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██ ██       ██████              ██                  ██████ ██    ██              ██   
//  ██        ██       ██                  ██                  ██  ██ ██                    ██   
//  ██     ██ ██ █████ ██     ██ ██ █████ █████ █████ ████████ ██  ██ █████ ██ █████ █████ █████ 
//  █████  ██ ██ ██ ██ ██████ ██ ██ ██     ██   ██ ██ ██ ██ ██ ██  ██ ██ ██ ██ ██ ██ ██     ██   
//  ██     ██ ██ █████     ██ ██ ██ █████  ██   █████ ██ ██ ██ ██  ██ ██ ██ ██ █████ ██     ██   
//  ██     ██ ██ ██        ██ ██ ██    ██  ██   ██    ██ ██ ██ ██  ██ ██ ██ ██ ██    ██     ██   
//  ██     ██ ██ █████ ██████ █████ █████  ████ █████ ██ ██ ██ ██████ █████ ██ █████ █████  ████ 
//                               ██                                         ██                   
//                            █████                                       ████                   
//
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// FileSystemObject - Base FileSystem class for Folder and File classes

	// -------------------------------------------------------------------------------------------------------------------
	// constructor and inheritance

		/**
		 * FileSytemObject class
		 * @param pathOrUri {String} The uri or path to the object
		 */
		FileSystemObject = function(pathOrUri)
		{
			if(pathOrUri)
			{
				this.uri = xjsfl.utils.makeURI(pathOrUri); // this.getUri(pathOrUri);
			}
			if(this.uri)
			{
				this.name = decodeURI(this.uri).match(/([^/]+)[/]*$/)[1];
			}
		}
		
		FileSystemObject.toString = function()
		{
			return '[class FileSystemObject]';
		}
		
	
	// -------------------------------------------------------------------------------------------------------------------
	// prototype

		FileSystemObject.prototype =
		{
			
			// -------------------------------------------------------------------------------------------------------------------
			// properties

				/**
				 * @type {String} The uri-formatted string to the item
				 */
				uri:null,
			
			// -------------------------------------------------------------------------------------------------------------------
			// methods
		
				/**
				 * reset constructor
				 */
				constructor:FileSystemObject,
			
				/**
				 * Gets a uri-formatted string to the filesystem resource
				 * @param pathOrUri	Any valid path or uri-formatted pointer to a filsystem resource	
				 * @returns	{String} The uri-formatted string to the filesystem resource
				 */
				getUri:function(pathOrUri)
				{
					if(pathOrUri.indexOf('file:') == 0)
					{
						return pathOrUri;
					}
					return FLfile.platformPathToURI(pathOrUri);
				},
				
				/**
				 * Deletes the item from the filesystem
				 * @param skipConfirmation {Boolean} An optional boolean to skip the user-confirmation window
				 * @returns {Boolean} A Boolean indicating if the item was deleted or not
				 */
				remove:function(skipConfirmation)
				{
					state = false;
					if(skipConfirmation != true)
					{
						var text = 'Do you want to delete "' +FLfile.uriToPlatformPath(this.uri)+ '"';
						state = confirm(text) === true;
					}
					if(skipConfirmation == true || state)
					{
						return FLfile.remove(this.uri);
					}
					return false;
				},
				
				/**
				 * Resolves an absolute path from a relative path - takes 1 or 2 arguments depending on the context
				 * @param source {String} If 2 arguments passed, the original absolute source path, such as 'c:/temp/file.txt'
				 * @param source {String} If 1 argument passed, a relative target path, such as '../../file.txt'
				 * @param target {String} A relative target path
				 */
				resolve:function(source, target)
				{
					
				},
				
				
			// -------------------------------------------------------------------------------------------------------------------
			// accessors
		
				/**
				 * @type {String} The platform-specific path to the item
				 */
				get path(){ return FLfile.uriToPlatformPath(this.uri).replace(/\\/g, '/') },
				
		
				/**
				 * @type {Boolean} true if the file exists; false otherwise. 
				 */
				get exists(){ return FLfile.exists(this.uri) },
				
		
				/**
				 * @type {Number} The number of seconds that have elapsed between January 1, 1970 and the time the file or folder was created, or "00000000" if the file or folder doesn’t exist
				 */
				get created(){ var num = parseInt(FLfile.getCreationDate(this.uri), 16); return num ? num : null; },
		
				/**
				 * @type {Number} The number of seconds that have elapsed between January 1, 1970 and the time the file or folder was last modified, or "00000000" if the file or folder doesn’t exist
				 */
				get modified(){ var num = parseInt(FLfile.getModificationDate(this.uri), 16); return num ? num : null; },
				
		
				/**
				 * @type {Date} A JavaScript Date object that represents the date and time when the specified file or folder was created. If the file doesn’t exist, the object contains information indicating that the file or folder was created at midnight GMT on December 31, 1969.
				 */
				get createdDate(){ return FLfile.getCreationDateObj(this.uri) },
		
				/**
				 * @type {Date} A JavaScript Date object that represents the date and time when the specified file or folder was last modified. If the file or folder doesn’t exist, the object contains information indicating that the file or folder was created at midnight GMT on December 31, 1969.
				 */
				get modifiedDate(){ return FLfile.getModificationDateObj(this.uri) },
				
		
				/**
				 * @type {String} A string that represents the attributes of the specified file or folder.
				 */
				get attributes(){ return FLfile.getAttributes(this.uri) },
		
				/**
				 * @type {String} A string specifying values for the attribute(s) you want to set. N: No specific attribute, A: Ready for archiving (Windows only), R: Read-only (on the Macintosh, read-only means “locked”), W: Writable (overrides R), H: Hidden (Windows only), V: Visible (overrides H, Windows only)
				 */
				set attributes(attributes){ return FLfile.setAttributes(this.uri, attributes) },
				
				/**
				 * @type {Array} The object's parent folder, or the same folder if the root
				 */
				get parent ()
				{
					if(this.uri)
					{
						var uri = this.uri.replace(/\/[^\/]+$/, '');
						return uri == 'file://' ? null : new Folder(uri);
					}
					return null;
				}
			
		}
				

		

			
	
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██    ██            
//  ██           ██    ██            
//  ██     █████ ██ █████ █████ ████ 
//  █████  ██ ██ ██ ██ ██ ██ ██ ██   
//  ██     ██ ██ ██ ██ ██ █████ ██   
//  ██     ██ ██ ██ ██ ██ ██    ██   
//  ██     █████ ██ █████ █████ ██   
//
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Folder - JSFL OO representation of operating system folders

	// -------------------------------------------------------------------------------------------------------------------
	// constructor

		/**
		 * Folder class
		 * @param pathOrUri {String} The uri or path to the object
		 */
		Folder = function(pathOrUri, create)
		{
			// remove trailing slash, otherwise it refers to the child folder ''
				pathOrUri = pathOrUri.replace(/\/+$/, '');
				
			// constructor
				FileSystemObject.apply(this, [pathOrUri]);
				if( ! this.exists && create)
				{
					this.create();
				}
		}
		
		Folder.toString = function()
		{
			return '[class Folder]';
		}
		
	// -------------------------------------------------------------------------------------------------------------------
	// prototype members

		folder =
		{
			
			// -------------------------------------------------------------------------------------------------------------------
			// methods
		
				/**
				 * reset constructor
				 */
				constructor:Folder,
				
				create:function()
				{
					FLfile.createFolder(this.uri);
					return this;
				},
			
				/**
				 * Opens the folder in the Explorer / Finder
				 * @returns {File} The original file
				 */
				open:function()
				{
					var command = fl.version.indexOf('MAC') == -1 ? 'start' : 'open';
					var exec = command + " \"\" \"" +this.path+ "\""
					FLfile.runCommandLine(exec);
					return this;
				},
				
				/**
				 * alias for open()
				 */
				reveal:Folder.prototype.open,
				
				/**
				 * Copy the folder to a new uri
				 * @param	toUri	{String}
				 * @returns		
				 */
				copy:function(toUri)
				{
					//TODO implemement xcopy on windows or the equivilent on a mac
				},
				
				/**
				 * Calls a function on each element in the collection
				 * @param callback	{Function}	A callback function to fire on each iteraction
				 * @param itemType	{String}	Optionally limit the iteration to files or folders. Leave blank for all content
				 * @returns			{Array}		An array of Files and/or Folders
				 */
				each:function(callback, scope, itemType)
				{
					scope		= scope || window;
					itemType	= itemType || 'contents';
					if(itemType.match(/(files|folders|contents)/))
					{
						var items = this[itemType];
						if(items)
						{
							for(var i = 0; i < items.length; i++)
							{
								callback.apply(scope, [items[i], i]);
							}
						}
					}
					else
					{
						fl.trace('Unknown FileSystemItem type!')
					}
				},
				
				/**
				 * Return a filtered array of the folder's contents, matching against the filenames
				 * @param	rx	{RegExp}	A Regular Expression or string, wildcards allowed
				 * @returns		{Array}		An array of Filesystem objects
				 */
				filter:function(rx)
				{
					if(typeof rx === 'string')
					{
						rx = new RegExp(rx.replace(/\*/g, '.*'));
					}
					if(rx instanceof RegExp)
					{
						return this.contents.filter(function(e){ return rx.test(e.name); });
					}
					return [];
				},
				
				/**
				 * A string representation of the folder name and number of items
				 * @returns {String} A string representation of the folder
				 */
				toString:function(path)
				{
					var num = this.contents.length;
					return '[object Folder "' +(path ? this.path : this.name)+ '" contains ' +num+ ' item' +(num == 1 ? '' : 's' )+ ']';
				},
					
			// -------------------------------------------------------------------------------------------------------------------
			// accessors
		
				/**
				 * @type {Number} The number of items in the folder
				 */
				get items (){ return FLfile.listFolder(this.uri).length; },
					
				/**
				 * @type {Number} Synonym for items
				 */
				get length (){ return this.items; },
					
				/**
				 * @type {Array} The folder's files and folders
				 */
				get contents ()
				{
					var uri;
					var items = FLfile.listFolder(this.uri);
					for(var i = 0; i < items.length; i++)
					{
						uri = this.uri + '/' + encodeURI(items[i]);
						items[i] = items[i].match(/\.[^\/]+$/) ? new File(uri) : new Folder(uri);
					}
					return items;
				},
				
				/**
				 * @type {Array} The folder's subfolders
				 */
				get folders ()
				{
					var items = FLfile.listFolder(this.uri, "directories");
					for(var i = 0; i < items.length; i++)
					{
						uri = this.uri + '/' + encodeURI(items[i]);
						items[i] = new Folder(uri);
					}
					return items;
				},
				
				/**
				 * @type {Array} The folder's files
				 */
				get files ()
				{
					var items = FLfile.listFolder(this.uri, "files");
					for(var i = 0; i < items.length; i++)
					{
						uri = this.uri + '/' + encodeURI(items[i]);
						items[i] = new File(uri);
					}
					return items;
				}
		}

	// -------------------------------------------------------------------------------------------------------------------
	// inheritance & assign methods

		Folder.prototype = new FileSystemObject;
		xjsfl.utils.extend(Folder.prototype, folder);
			

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██ ██       
//  ██        ██       
//  ██     ██ ██ █████ 
//  █████  ██ ██ ██ ██ 
//  ██     ██ ██ █████ 
//  ██     ██ ██ ██    
//  ██     ██ ██ █████ 
//
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// File - JSFL OO representation of operating system files


	// -------------------------------------------------------------------------------------------------------------------
	// constructor

		/**
		 * File class
		 * @param pathOrUri	{String}	The uri or path to the object
		 * @param contents	{String}	The string contents of the file
		 * @param create	{Boolean}	A flag to create the file immediately
		 */
		File = function(pathOrUri, contents, create)
		{
			// constructor
				FileSystemObject.apply(this, [pathOrUri]);
			
			// if create is specified, ensure the folder exists
				if(create)
				{
					var uri = this.uri.replace(/\/[^\/]+$/, '');
					var folder = new Folder(uri, true);
				}

			// if there's any data, save it
				if(contents)
				{
					this.contents = contents;
				}
				else if(this.extension == 'fla' && ! this.exists)
				{
					this.save();
				}
		}
		
		File.toString = function()
		{
			return '[class File]';
		}
		
		
	// -------------------------------------------------------------------------------------------------------------------
	// properties
	
		file =
		{
			
			// -------------------------------------------------------------------------------------------------------------------
			// methods
			
				/**
				 * reset constructor
				 */
				constructor:File,
			
				/**
				 * Opens the file in the Flash authoring environment
				 * @returns {File} The original file
				 */
				open:function()
				{
					switch(this.extension)
					{
						case 'fla':
							fl.openDocument(this.uri);
						break;
					
						case 'jsfl':
							fl.openScript(this.uri);
						break;
					
						default:
							// osascript -e 'tell application "flash" to open alias "Mac OS X:Users:user:myTestFile.jsfl" '
							var command = fl.version.indexOf('MAC') == -1 ? 'start' : 'open';
							var exec = command + " \"\" \"" +this.path+ "\""
							FLfile.runCommandLine(exec);
		
					}
					//fl[this.extension == 'fla' ? 'openDocument' : 'openScript'](this.uri);
					return this;
				},
				
				/**
				 * executes any JSFL file, or Attempts to run the file via the operating system command line if not
				 * @returns {File} The original file
				 */
				run:function()
				{
					if(this.exists)
					{
						if(this.extension == 'jsfl')
						{
							fl.runScript(this.uri);
						}
						else
						{
							var path = '"' + FLfile.uriToPlatformPath(this.uri) + '"';
							var exec = fl.version.match(/\bMAC\b/i) ? 'exec ' + path : path;
							FLfile.runCommandLine(exec);
						}
						return this;
					}
					else
					{
						return undefined;
					}
				},
				
				/**
				 * Copies the file to a new location
				 * @param uriCopy	{String}	The new uri to copy the file to. Can be a folder or file.
				 * @param overWrite	{Boolean}	Optional Boolean indicating whether the target file should be overwritten if it exists
				 * @returns			{File}		A new File object
				 */
				copy:function(uriCopy, overWrite)
				{
					// if the path doesn't have a filename, use the existing filename
						var rx			= /[^\/]+\.[a-z0-9]+$/i;
						var matches		= uriCopy.match(rx);
						var filename	= matches ? matches[0] : null;
						if(filename == null)
						{
							uriCopy = uriCopy.replace(/\/*$/, '/') + this.name;
						}
						uriCopy = this.getUri(uriCopy);
						
					// remove target if file should overwrite
						if(overWrite)
						{
							FLfile.remove(uriCopy);
						}
						
					// make sure the target folder exists
						var targetFolder = new Folder(uriCopy.replace(/[^\/]+$/, ''));
						if( ! targetFolder.exists )
						{
							targetFolder.create();
						}
						
					// if the file exists, copy it
						if(this.exists)
						{
							if(FLfile.copy(this.uri, uriCopy))
							{
								return new File(uriCopy);
							}
						}
						
					// if not, just write the contents of this file to the new file
						else
						{
							throw new Error('The file "' +this.name+ '" must be saved before copying');
						}
						return this;
				},
				
				/**
				 * Append data to the file
				 * @param data {String} The data to append to the file
				 * @returns {File} The original file
				 */
				write:function(data, append)
				{
					FLfile.write(this.uri, (data || ''), append ? 'append' : null);
					return this;
				},
				
				/**
				 * Saves the file
				 * @returns {File} The original file
				 */
				save:function()
				{
					this.write();
					return this;
				},
				
				/**
				 * Reveals the file, selected, in the Explorer or Finder
				 * @returns {File} The original file
				 */
				reveal:function()
				{
					if(fl.version.indexOf('WIN') != -1)
					{
						var exec	= 'start %SystemRoot%\\explorer.exe /select, "' +this.path.replace(/\//g, '\\') + '"'
					}
					else
					{
						var exec = 'reveal "' +this.path+ '"';
					}
					FLfile.runCommandLine(exec);
					return this;
				},
				
				/**
				 * Rename the file. You can optionally omit the name and just provide an extension to only rename the extension
				 * @param	name		{String}	The new name for the file (you can omit the extension)
				 * @param	extension	{String}	The new etension for the file
				 * @param	overwrite	{Boolean}	
				 * @returns				{File}		The original file
				 */
				rename:function(name, extension, overwrite)
				{
					// rename only the extension
						if(name == null && typeof extension == 'string')
						{
							name = this.name.replace(/\w+$/, extension);
						}
						
					// otherwise, rename the whole file
						else if(/\.\w+$/.test(name))
						{
							
						}
						
					// rename by making a copy, then deleting the original file
						if(name != this.name)
						{
							
						}
				},
				
				/**
				 * A string representation of the file
				 * @param	path	{Boolean}		A flag to show the full path, not just the name
				 * @returns {File} A string containing the class and filename
				 */
				toString:function(path)
				{
					return '[object File "' +(path ? this.path : this.name)+ '"]';
				},
				
			// -------------------------------------------------------------------------------------------------------------------
			// accessors
			
				/** 
				 * @type {Number} Get the size of the file
				 */
				get size (){ return FLfile.getSize(this.uri) },
				
				/** 
				 * @type {String} get the contents of the file
				 */
				get contents (){ return FLfile.read(this.uri).replace(/\r\n/g, '\n') },
				
				/** 
				 * @type {String} Set the contents of the file
				 */
				set contents (data){ return FLfile.write(this.uri, data) },
				/** 
				 * @type {String} The file extension of the file
				 */
				
				get extension()
				{
					return this.uri.substr(this.uri.lastIndexOf('.') + 1);
				},
		
				/** 
				 * @type {String} The file extension of the file
				 */
				set extension(value)
				{
					return this.uri.substr(this.uri.lastIndexOf('.') + 1);
				}
					
			}
	
	// -------------------------------------------------------------------------------------------------------------------
	// inheritance & assign methods

		File.prototype = new FileSystemObject;
		xjsfl.utils.extend(File.prototype, file);
	
	
// -----------------------------------------------------------------------------------------------------------------------------------------
// register classes with xjsfl
	
	xjsfl.classes.register('FileSystemObject', FileSystemObject);
	xjsfl.classes.register('Folder', Folder);
	xjsfl.classes.register('File', File);



// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code
	
	if( ! xjsfl.loading )
	{
		// initialize
		
			xjsfl.init(this);
			clear();
			
			var temp = 'c:/temp/';	// Mac users, change this!
		
		// --------------------------------------------------------------------------------
		// create a new file and inspect its properties
		
			if(0)
			{
				var file	= new File(temp + 'this/is/a/new/file.jsfl', 'Hello!', true)
				var folder	= file.parent;
				
				fl.trace('file: ' + file.toString(true))
				fl.trace('file contents: ' + file.contents)
				
				fl.trace('parent: ' + folder)
				fl.trace('grandparent: ' + folder.parent)
				
				//folder.remove();
				//fl.trace(folder.uri)
			}
		
		// --------------------------------------------------------------------------------
		// create a new file, copy it, and inspect creation dates
		
			if(0)
			{
				var file	= new File(temp + 'test.jsfl').save()
				var copy	= file.copy(temp + 'a/new/folder/')
				
				fl.trace('file: ' + file.createdDate);
				fl.trace('copy: ' + copy.createdDate);
			}
		
		// --------------------------------------------------------------------------------
		// create and open a new AS file
		
			if(0)
			{
				var file = new File(temp + 'test.fla').open();
				var file = new File(temp + 'some file.as', '// this is a new AS file').open();
			}
		
		// --------------------------------------------------------------------------------
		// create, copy, write to and open a text file
		
			if(0)
			{
				var file = new File(temp + 'test.txt', 'Some content')
					.copy(temp + 'test copy.txt')
					.write(' and some more', true)
					.open();
			}
		
		// --------------------------------------------------------------------------------
		// open / create a word document
		
			if(0)
			{
				var file = new File(temp + 'document.doc', 'Hello!', true).open();
			}
		
		// --------------------------------------------------------------------------------
		// list the contents of folder
		
			if(0)
			{
				var folder		= new Folder('c:/temp');
				for each(var item in folder.contents)
				{
					trace(item)
				}
			}
		
		// --------------------------------------------------------------------------------
		// list the filtered contents of folder
		
			if(0)
			{
				var files = new Folder('c:/temp').filter(/\.txt$/)
				for each(var item in files)
				{
					trace(item);
				}
			}
		
		// --------------------------------------------------------------------------------
		// iterate over the contents of a folder
		
			if(0)
			{
				new Folder('c:/temp').each(function(e, i){trace(i, e)});
			}
		
		// --------------------------------------------------------------------------------
		// Recursively list the contents of a folder
		
			if(0)
			{
				// variables
					var indent = '';
					
				// function
					function list(e, i)
					{
						trace(indent + '/' + e.name);
						if(e instanceof Folder)
						{
							folders ++;
							indent += '	';
							e.each(list);
							indent = indent.substring(1);
						}
						else
						{
							files ++;
						}
					}
					
				// do it!
			}
		
		// --------------------------------------------------------------------------------
		// recursively list the contents of a folder
		
			if(0)
			{
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
				
				recurse(new Folder(temp), function(e, i, l, indent){fl.trace(indent + '/' +  e.name)}, function(e){return e instanceof Folder})
			}
				
		// --------------------------------------------------------------------------------
		// Same function, but tweetable (136 characters)
		
			if(0)
			{
				var n='\t';function l(e){trace(n+'/'+e.name);if(e instanceof Folder){ n+='\t';e.each(l);n=n.substr(1);}}var f=new Folder('c:/temp');l(f)
			}

		// --------------------------------------------------------------------------------
		// Same function, but using the Data library
		
			//TODO - implemement Data.recurse properly!
		
			if(0)
			{
				var folder			= new Folder('c:/temp');
				var fileCallback	= function(e){ trace(e) };
				var folderCallback	= function(e){ return e instanceof Folder };
				
				Data.recurse(folder, fileCallback, folderCallback);
			}

			
	}