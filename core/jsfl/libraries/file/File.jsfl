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
// File

	/**
	 * File
	 * @overview	JSFL OO representation of operating system files
	 * @instance	file
	 */

	xjsfl.init(this, ['Class', 'FileSystemObject', 'Folder', 'URI', 'Utils']);
		
	//BUG Fix File so it doesn't write when you access a setter by mistake. Iterating through files using Table.print(folder.contents) overwrote all files with garbage!

	// -------------------------------------------------------------------------------------------------------------------
	// class

		File =
		{

				/**
				 * File class
				 * @extends	{FileSystemObject}
				 * @constructor
				 * @name	File
				 * @param	{String}		pathOrUri	The uri or path to the object
				 * @param	{String}		contents	An optional string contents of the file, or true to save a blank file
				 * @paramx	{Boolean}		force		An optional flag to force the file to be overwritten, if its already read-only
				 * @param	{Boolean}		utf8		An optional flag to create a UTF8 file
				 */
				init:function(pathOrURI, contents, force)
				{
					// error if pathOrURI is null
						if(typeof pathOrURI === 'undefined' || pathOrURI == null)
						{
							pathOrURI = Utils.getStack()[5].uri;
						}
						else if(pathOrURI === '')
						{
							throw new ReferenceError('ReferenceError in new File(): the parameter pathOrURI cannot be empty, null or undefined');
						}
					
					// uri
						var uri = URI.toURI(pathOrURI, 5);
		
					// constructor
						this._super(uri);
						
					// if UTF8, copy the existing template over, and write to this new file
					// this doesn't seem to work, as extra chars are saved: Â© when it should be ©
						/*
						if(utf8)
						{
							var source = xjsfl.uri + 'assets/misc/utf8.txt';
							if(this.exists && force)
							{
								this.remove(true);
							}
							FLfile.copy(source, uri);
						}
						*/
		
					// if there's any data, save it
						if(contents !== undefined)
						{
							this.write(String(contents === true ? '' : contents), false, force);
						}
				},

			// -------------------------------------------------------------------------------------------------------------------
			// # Properties

				/**
				 * @type {String} Get the contents of the file
				 */
				get contents (){ return this.exists ? FLfile.read(this.uri).replace(/\r\n/g, '\n') : ''; },

				/**
				 * @type {String} Set the contents of the file
				 */
				set contents (data){ this.write(data); },
				
				/**
				 * @type {String} The file extension of the file
				 */
				get ext()
				{
					return this.uri ? this.uri.substr(this.uri.lastIndexOf('.') + 1) : '';
				},

				/**
				 * @type {String} The file extension of the file (Synonym for ext)
				 */
				get extension()
				{
					return this.ext;
				},

				/**
				 * @type {Number} Get the size of the file
				 */
				get size (){ return FLfile.getSize(this.uri); },
				
				/**
				 * @type {Boolean} Set or get the read-only state of the filesystem object
				 */
				get writable (){ return this.exists && FLfile.getAttributes(this.uri).indexOf('R') === -1; },
				set writable (state)
				{
					if(this.exists)
					{
						var attributes = FLfile.getAttributes(this.uri);
						if(state)
						{
							attributes += 'W';
						}
						else
						{
							attributes = attributes.replace('W', '') + 'R';
						}
						FLfile.setAttributes(this.uri,  attributes);
					}
				},

				/** @type {Boolean} Flag if the file has been saved */
				saved:false,

			// -------------------------------------------------------------------------------------------------------------------
			// # Methods

				/**
				 * Opens the file in the associated application
				 * @returns {File}			The original file
				 */
				open:function()
				{
					if(this.exists)
					{
						switch(this.extension.toLowerCase())
						{
							case 'fla':
							case 'xfl':
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

					//inspect(this)
					// if the file exists, copy it
						if(this.exists)
						{
							// if the path doesn't have a filename (i.e. it's a folder) use the existing filename
								if(URI.isFolder(trgURI))
								{
									trgURI = trgURI + this.name;
								}

							// make sure the target folder exists
								var targetFolder = new Folder(trgURI);
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
				 * @param	{Boolean}		force		An optional flag to force the write, if writable is set to false
				 * @returns	{File}						The original file if successful
				 * @returns	{Boolean}					A Boolean false if the operation failed
				 */
				write:function(data, append, force)
				{
					// check that path exists
						if( ! this.exists )
						{
							var uri		= this.uri.replace(/\/[^\/]+$/, '');
							var folder	= new Folder(uri, true);
						}

					// write to the file
						if(force)
						{
							this.writable = true;
						}
						var result = append ? FLfile.write(this.uri, data, 'append') : FLfile.write(this.uri, data);
						if(result)
						{
							this.saved = true;
						}

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
				 * Saves the file
				 * @returns {File}						The original file
				 */
				save:function()
				{
					// this doesn't seem to work, as extra chars are saved: Â© when it should be ©
					/*
					if(utf8)
					{
						fl.outputPanel.clear();
						fl.outputPanel.trace(this.contents);
						fl.outputPanel.save(this.uri, false, false);
						fl.outputPanel.clear();
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
				 * @returns	{Boolean}					True or false depending on the result
				 */
				rename:function(name, extension)
				{
					// rename only the extension
						if(name == undefined && typeof extension === 'string')
						{
							name = this.name.replace(/\.\w+$/, '.' + extension.replace('.', ''));
						}

					// otherwise, rename the whole file
						else if(extension == undefined && ! /\.\w+$/.test(name))
						{
							name += '.' + this.extension.replace('.', '');
						}
						
					// rename by making a copy, then deleting the original file
						var state = false;
						if(name !== this.name)
						{
							// variables
								var uri = URI.getFolder(this.uri) + name;
								
							// test if filename is only different by case
								if(name.toLowerCase() === this.name.toLowerCase())
								{
									/*
									The only way to rename a file is to make a renamed copy, however,
									this fails if the filename is the same, but a different case, as the
									OS sees it as an existing file, so can't do the copy.
									
									So, for case differences only, we need to do 2 copies: 1 which
									names to a temp name, we then delete the original, then copy again,
									then delete the original copy					
									*/
									var temp = uri + '.temp';
									state = FLfile.copy(this.uri, temp) &&
											FLfile.remove(this.uri) &&
											FLfile.copy(temp, uri) &&
											FLfile.remove(temp);
								}
							
							// normal rename
								else
								{
									state = FLfile.copy(this.uri, uri) &&
											FLfile.remove(this.uri);
								}
						}

					// return
						if(state)
						{
							this.uri = uri;
						}
						return state;
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

		}

	// -----------------------------------------------------------------------------------------------------------------------------------------
	// create
	
		File = FileSystemObject.extend(File);
		File.toString = function()
		{
			return '[class File]';
		}


	// -----------------------------------------------------------------------------------------------------------------------------------------
	// register classes with xjsfl
	
		xjsfl.classes.register('File', File);

	