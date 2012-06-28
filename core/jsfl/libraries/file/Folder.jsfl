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
// Folder

	/**
	 * Folder
	 * @overview	JSFL OO representation of operating system folders
	 * @instance	folder
	 */

	xjsfl.init(this, ['Class', 'FileSystemObject', 'File', 'URI', 'Utils']);

	// -------------------------------------------------------------------------------------------------------------------
	// class

		Folder =
		{
				/**
				 * Folder class
				 * @constructor
				 * @name	Folder
				 * @extends	{FileSystemObject}
				 * @param	{String}				pathOrUri	The uri or path to the object
				 * @param	{Boolean}				create		An optional Boolean flag on whether to create the folder or not, defaults to false
				 */
				init:function(pathOrURI, create)
				{
					// error if pathOrURI is null
						if(typeof pathOrURI === 'undefined' || pathOrURI == null || pathOrURI === '')
						{
							pathOrURI = Utils.getStack()[5].path;
						}

					// ensure a trailing slash /
						pathOrURI = String(pathOrURI).replace(/\/*$/, '/');
		
					// uri
						var uri = URI.getFolder(URI.toURI(pathOrURI, 5));
		
					// constructor
						this._super(uri);
						if(create && ! this.exists)
						{
							this.create();
						}
				},

			// -------------------------------------------------------------------------------------------------------------------
			// # Properties

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
				},
				
			// -------------------------------------------------------------------------------------------------------------------
			// # Methods

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
					if(xjsfl.settings.app.os.win)
					{
						var command		= xjsfl.settings.app.os.win ? 'start' : 'open';
						var exec		= command + " \"\" \"" +this.path+ "\""
					}
					else
					{
						// load template if not already loaded
							include('Template');
						
						// create the command
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
				 * @returns {Folder}					The copied folder, or null if the copy failed
				 */
				copy:function(toPathOrURI)
				{
					var src			= this.path;
					var trg			= URI.toPath(URI.toURI(toPathOrURI, 1));
					if(xjsfl.settings.app.os.win)
					{
						var command = 'robocopy "' +src+ '" "' +trg+ '" /S /E';
					}
					else
					{
						var command = 'cp -R "' +src+ '" "' +trg+ '"';
					}
					FLfile.runCommandLine(command);
					var copy =  new Folder(trg);
					return copy.exists ? copy : null;
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


		}

	// -----------------------------------------------------------------------------------------------------------------------------------------
	// create
	
		Folder = FileSystemObject.extend(Folder);
		Folder.toString = function()
		{
			return '[class Folder]';
		}


	// -----------------------------------------------------------------------------------------------------------------------------------------
	// register classes with xjsfl
	
		xjsfl.classes.register('Folder', Folder);

