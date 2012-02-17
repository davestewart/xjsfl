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
		 * @param	{String} pathOrUri The uri or path to the object
		 */
		FileSystemObject = function(uri)
		{
			//BUG Errors when file URIs go beyond 260 chars. Need to implement fix (replace FLfile methods?) or workaround.

			if(uri)
			{
				this.uri = uri;
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
				 * @type {String} The URI-formatted string (file:///) to the item
				 */
				uri:null,

			// -------------------------------------------------------------------------------------------------------------------
			// methods

				/**
				 * reset constructor
				 */
				constructor:FileSystemObject,

				/**
				 * Deletes the item from the filesystem
				 * @param	{Boolean} skipConfirmation An optional boolean to skip the user-confirmation window
				 * @returns {Boolean} A Boolean indicating if the item was deleted or not
				 */
				remove:function(skipConfirmation)
				{
					state = false;
					if(skipConfirmation != true)
					{
						state = confirm('Do you want to delete "' +this.path+ '"') === true;
					}
					if(skipConfirmation == true || state)
					{
						return FLfile.remove(this.uri);
					}
					return this;
				},

			// -------------------------------------------------------------------------------------------------------------------
			// accessors

				/**
				 * @type {String} The platform-specific path to the item
				 */
				get path(){ return FLfile.uriToPlatformPath(this.uri).replace(/\\/g, '/'); },

				/**
				 * @type {Boolean} true if the file exists; false otherwise.
				 */
				get exists()
				{
					return this.uri && FLfile.exists(this.uri);
				},

				/**
				 * @type {Number} The number of seconds that have elapsed between January 1, 1970 and the time the file or folder was created, or "00000000" if the file or folder doesn’t exist
				 */
				get created()
				{
					var num = parseInt(FLfile.getCreationDate(this.uri), 16); return num ? num : null;
				},

				/**
				 * @type {Number} The number of seconds that have elapsed between January 1, 1970 and the time the file or folder was last modified, or "00000000" if the file or folder doesn’t exist
				 */
				get modified()
				{
					var num = parseInt(FLfile.getModificationDate(this.uri), 16); return num ? num : null;
				},

				/**
				 * @type {Date} A JavaScript Date object that represents the date and time when the specified file or folder was created. If the file doesn’t exist, the object contains information indicating that the file or folder was created at midnight GMT on December 31, 1969.
				 */
				get createdDate()
				{
					return this.exists ? FLfile.getCreationDateObj(this.uri) : null;
				},

				/**
				 * @type {Date} A JavaScript Date object that represents the date and time when the specified file or folder was last modified. If the file or folder doesn’t exist, the object contains information indicating that the file or folder was created at midnight GMT on December 31, 1969.
				 */
				get modifiedDate()
				{
					return this.exists ? FLfile.getModificationDateObj(this.uri) : null;
				},

				/**
				 * @type {String} A string that represents the attributes of the specified file or folder.
				 */
				get attributes()
				{
					return this.exists ? FLfile.getAttributes(this.uri) : null;
				},

				/**
				 * @type {String} A string specifying values for the attribute(s) you want to set. N: No specific attribute, A: Ready for archiving (Windows only), R: Read-only (on the Macintosh, read-only means “locked”), W: Writable (overrides R), H: Hidden (Windows only), V: Visible (overrides H, Windows only)
				 */
				set attributes(attributes)
				{
					return this.exists ? FLfile.setAttributes(this.uri, attributes) : null;
				},

				/**
				 * @type {Array} The object's parent folder, or the same folder if the root
				 */
				get parent ()
				{
					if(this.uri)
					{
						var uri = URI.getPath(this.uri);
						return new Folder(uri);
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
		 * @extends	{FileSystemObject}
		 * @param	{String}				pathOrUri	The uri or path to the object
		 * @param	{Boolean}				create		An optional Boolean flag on whether to create the folder or not, defaults to false
		 */
		Folder = function(pathOrUri, create)
		{
			// ensure a trailing slash //
				pathOrUri = pathOrUri.replace(/\/*$/, '/');

			// uri
				var uri = URI.getPath(URI.toURI(pathOrUri, 1));

			// constructor
				FileSystemObject.call(this, uri);
				if(create && ! this.exists)
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
				 * @returns {Folder}			The original folder
				 */
				open:function()
				{
					if(xjsfl.settings.app.platform === 'win')
					{
						var command		= xjsfl.settings.app.platform === 'win' ? 'start' : 'open';
						var exec		= command + " \"\" \"" +this.path+ "\""
					}
					else
					{
						var uri			= xjsfl.uri + 'core/assets/templates/mac/open folder.applescript';
						var command		= new Template(uri, {path:this.path}).render();
						var exec		= 'osascript -e "' +command+ '"';
					}
					FLfile.runCommandLine(exec);
					return this;
				},

				/**
				 * alias for open()
				 */
				reveal:function()
				{
					File.prototype.open.apply(this);
				},

				/**
				 * Copy the folder to a new uri
				 * @param	{String}		toUri		The URI to copy to
				 * @returns {Folder}					The original folder
				 */
				copy:function(toPathOrURI)
				{
					var src			= this.path;
					var trg			= URI.toPath(URI.toURI(toPathOrURI, 1));
					if(xjsfl.settings.app.platform === 'win')
					{
						var command = 'robocopy "' +src+ '" "' +trg+ '" /S /E';
					}
					else
					{
						var command = 'cp -R "' +src+ '" "' +trg+ '"';
					}
					FLfile.runCommandLine(command);
					return this;
				},

				/**
				 * Calls a function on each element in the collection
				 * @param	{Function}		callback	A callback function to fire on each iteraction. Return true at any point to cancel iteration
				 * @param	{String}		type		Optionally limit the iteration to files or folders. Leave blank for all content
				 * @param	{Scope}			type		An optional scope to call the function in
				 * @returns {Folder}					The original folder
				 */
				each:function(callback, type, scope)
				{
					type	= type || 'contents';
					scope	= scope || window;
					if(type.match(/(files|folders|contents)/))
					{
						var items = this[type];
						if(items && items.length)
						{
							var state;
							for(var i = 0; i < items.length; i++)
							{
								state = callback.apply(scope, [items[i], i]);
								if(state === true)
								{
									return this;
								}
							}
						}
					}
					else
					{
						throw new Error('Error in Folder.each(): Unknown content type "' +type+ '"')
					}
					return this;
				},

				/**
				 * Return a filtered array of the folder's contents, matching against the filenames
				 * @param	{RegExp}		pattern		A RegExp filename pattern
				 * @param	{String}		pattern		A String filename pattern, wildcards allowed
				 * @returns	{Array}						An array of Filesystem objects
				 */
				filter:function(pattern)
				{
					var rx = typeof pattern === 'string' ? new RegExp(pattern.replace(/\*/g, '.*')) : pattern;
					if(rx instanceof RegExp)
					{
						return this.contents.filter(function(e){ return rx.test(e.name); });
					}
					return [];
				},

				/**
				 * A string representation of the folder
				 * @param	{Boolean}		name		A flag to show the name, rather than the full path
				 * @returns	{String}					A string representation of the folder
				 */
				toString:function(name)
				{
					var items	= this.exists ? FLfile.listFolder(this.uri).length : 0;
					var label	= name ? 'name' : 'path';
					var value	= name ? this.name : this.path;
					return '[object Folder ' +label+ '="' +value+ '" items=' +items+ ' exists="' +this.exists+ '"]';
				},

			// -------------------------------------------------------------------------------------------------------------------
			// accessors

				/**
				 * @type {Number} The number of items in the folder
				 */
				get length (){ return this.exists ? FLfile.listFolder(this.uri).length : 0; },

				/**
				 * @type {Array} The folder's files and folders
				 */
				get contents ()
				{
					if(this.exists)
					{
						var uri;
						var items = this.uris;
						for(var i = 0; i < items.length; i++)
						{
							uri			= items[i];
							items[i]	= uri.substr(-1) === '/' ? new Folder(uri) : new File(uri);
						}
						return items;
					}
					return null;
				},

				/**
				 * @type {Array} The folder's subfolders
				 */
				get folders ()
				{
					if(this.exists)
					{
						var uri;
						var items = FLfile.listFolder(this.uri, 'directories');
						for(var i = 0; i < items.length; i++)
						{
							uri			= this.uri + encodeURI(items[i] + '/');
							items[i]	= new Folder(uri);
						}
						return items;
					}
					return null;
				},

				/**
				 * @type {Array} The folder's files
				 */
				get files ()
				{
					if(this.exists)
					{
						var uri;
						var items = FLfile.listFolder(this.uri, 'files');
						for(var i = 0; i < items.length; i++)
						{
							uri			= this.uri + encodeURI(items[i]);
							items[i]	= new File(uri);
						}
						return items;
					}
					return null;
				},

				/**
				 * @type {Array} The folder's contents as a list of absoulte uris
				 */
				get uris ()
				{
					if(this.exists)
					{
						var uri;
						var uris = FLfile.listFolder(this.uri);
						for (var i = 0; i < uris.length; i++)
						{
							uri = this.uri + encodeURI(uris[i]);
							if(uri.length > 260)
							{
								URI.throwURILengthError(uri);
							}
							if(FLfile.getAttributes(uri).indexOf('D') > -1)
							{
								 uri += '/';
							}
							uris[i] = uri;
						}
						return uris;
					}
					return null;
				}
		}

	// -------------------------------------------------------------------------------------------------------------------
	// inheritance & assign methods

		Folder.prototype = new FileSystemObject;
		Utils.extend(Folder.prototype, folder);
		delete folder;


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

	//BUG Fix File so it doesn't write when you access a setter by mistake. Iterating through files using Table.print(folder.contents) overwrote all files with garbage!

	// -------------------------------------------------------------------------------------------------------------------
	// constructor

		/**
		 * File class
		 * @extends	{FileSystemObject}
		 * @param	{String}				pathOrUri	The uri or path to the object
		 * @param	{String}				contents	An optional string contents of the file, or true to save a blank file
		 */
		File = function(pathOrUri, contents)
		{
			// uri
				var uri = URI.toURI(pathOrUri, 1);

			// constructor
				FileSystemObject.call(this, uri);

			// if there's any data, save it
				if(contents !== undefined)
				{
					this.write(String(contents === true ? '' : contents), false);
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
				 * Opens the file in the associated application
				 * @returns {File}			The original file
				 */
				open:function()
				{
					if(this.exists)
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
					}
					//fl[this.extension == 'fla' ? 'openDocument' : 'openScript'](this.uri);
					return this;
				},

				/**
				 * Executes any JSFL file, or attempts to run any other file type via the OS
				 * @returns {File}						The original file if it exists
				 * @returns {false} 					False if the file doesn't exist
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
						return false;
					}
				},

				/**
				 * Copies the file to a new location
				 * @param	{String}		uriOrPath	The new uri to copy the file to. Can be a folder or file.
				 * @param	{Boolean}		overWrite	Optional Boolean indicating whether the target file should be overwritten without warning
				 * @returns	{File}						A new File object
				 */
				copy:function(trgURIOrPath, overWrite)
				{
					//TODO Double-check overwriting read-only files

					// get target URI
						var trgURI = URI.toURI(trgURIOrPath, 1);

					//Output.inspect(this)
					// if the file exists, copy it
						if(this.exists)
						{
							// if the path doesn't have a filename (i.e. it's a folder) use the existing filename
								if(URI.isFolder(trgURI))
								{
									trgURI = trgURI + this.name;
								}

							// make sure the target folder exists
								var targetFolder = new Folder(URI.getPath(trgURI));
								if( ! targetFolder.exists )
								{
									targetFolder.create();
								}

							// test if the target file exists
								if(FLfile.exists(trgURI))
								{
									// variable for prompting
										var trgPath		= URI.toPath(trgURI);
										var prompt		= 'Copying: "' +this.path+ '"\n\nTo: "' +trgPath + '".\n\n';
										var readOnly	= FLfile.getAttributes(trgURI).indexOf('R');

									// if overwite was not expressly stated as true, ask the user
										if(overWrite !== true)
										{
											var str = prompt + 'The target file exists. Do you wish to overwrite?';
											overWrite = confirm(str);
										}

									// remove target if file should overwrite
										if(overWrite)
										{
											FLfile.setAttributes(trgURI, 'W');
											if( ! FLfile.remove(trgURI) )
											{
												throw new Error('The target file "' +trgPath+ '" exists, but could not be deleted');
											}
										}
										else
										{
											throw new Error('The file "' +this.path+ '" was not copied to "' +trgPath+ '" because the user cancelled');
										}
								}

							// take action on result
								if(FLfile.copy(this.uri, trgURI))
								{
									return new File(trgURI);
								}
								else
								{
									throw new Error('The file "' +this.path+ '" was not copied to "' +trgPath+ '" because of an unexpected condition');
								}
						}

					// if not, throw an error, or just save an empty file?
						else
						{
							throw new Error('The file "' +this.path+ '" cannot be copied as it hasn\'t been saved, or doesn\'t exist');
						}
						return this;
				},

				/**
				 * Write or append data to the file
				 * @param	{String}		data		The data to write to the file
				 * @param	{Boolean}		append		An optional flag to append, rather than overwrite the file
				 * @returns	{File}						The original file if successful
				 * @returns	{Boolean}					A Boolean false if the operation failed
				 */
				write:function(data, append)
				{
					// check that path exists
						if( ! this.exists )
						{
							var uri		= this.uri.replace(/\/[^\/]+$/, '');
							var folder	= new Folder(uri, true);
						}

					// write to the file
						var result = append ? FLfile.write(this.uri, data, 'append') : FLfile.write(this.uri, data);

					// return
						return result ? this : false;
				},

				/**
				 * Append data to the file
				 * @param	{String}		data		The data to append to the file
				 * @returns	{File}						The original file if successful
				 * @returns	{Boolean}					A Boolean false if the operation failed
				 */
				append:function(data)
				{
					return this.write(data, true);
				},

				/**
				 * Saves the file, optionally as UTF8
				 * @param	{Boolean}		utf8		An optional Boolean indicating to save the file as UTF8
				 * @returns {File}						The original file
				 */
				save:function(utf8)
				{
					/*
					if(utf8)
					{
						fl.outputPanel.clear();
						fl.outputPanel.trace(this.contents);
						fl.outputPanel.save(this.uri, false, false);
						fl.outputPanel.clear();
					}
					else
					{

					}
					*/
					this.write('', true);
					return this;
				},

				/**
				 * Reveals the file, selected, in the Explorer or Finder
				 * @returns {File}			The original file
				 */
				reveal:function()
				{
					if(this.exists)
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
					}
					return this;
				},

				/**
				 * Rename the file. You can optionally omit the name and just provide an extension to only rename the extension
				 * @param	{String}		name		The new name for the file (you can omit the extension)
				 * @param	{String}		extension	The new extension for the file
				 * @returns	{File}						The original file
				 */
				rename:function(name, extension)
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

					// return
						return this;
				},

				/**
				 * A string representation of the file
				 * @param	{Boolean}		name		A flag to show the name, rather than the full path
				 * @returns	{String}					A string representation of the file
				 */
				toString:function(name)
				{
					var label	= name ? 'name' : 'path';
					var value	= name ? this.name : this.path;
					return '[object File   ' +label+ '="' +value+ '" exists="' +this.exists+ '"]';
				},

			// -------------------------------------------------------------------------------------------------------------------
			// accessors

				/**
				 * @type {String} get the contents of the file
				 */
				get contents (){ return this.exists ? FLfile.read(this.uri).replace(/\r\n/g, '\n') : ''; },

				/**
				 * @type {String} Set the contents of the file
				 */
				set contents (data){ this.write(data); },
				/**
				 * @type {String} The file extension of the file
				 */

				get extension()
				{
					return this.uri ? this.uri.substr(this.uri.lastIndexOf('.') + 1) : '';
				},

				/**
				 * @type {Number} Get the size of the file
				 */
				get size (){ return FLfile.getSize(this.uri); },


				/**
				 * @type {Boolean} Set or get the read-only state of the file
				 */
				get readOnly (){ return this.exists && FLfile.getAttributes(this.uri).indexOf('R') !== -1; },
				set readOnly (state)
				{
					if(this.exists)
					{
						FLfile.setAttributes(this.uri, FLfile.getAttributes(this.uri) + 'W');
					}
				},

			// -------------------------------------------------------------------------------------------------------------------
			// properties

				saved:false

		}

	// -------------------------------------------------------------------------------------------------------------------
	// inheritance & assign methods

		File.prototype = new FileSystemObject;
		Utils.extend(File.prototype, file);
		delete file;

// -----------------------------------------------------------------------------------------------------------------------------------------
// register classes with xjsfl

	//xjsfl.classes.register('FileSystemObject', FileSystemObject);
	xjsfl.classes.register('Folder', Folder);
	xjsfl.classes.register('File', File);
