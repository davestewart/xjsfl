var Snippets =
{
	// ------------------------------------------------------------------------------------------------
	// constructor,
	
		init:function()
		{
			this.sets		= new SetManager(this);
			this.files		= new FileManager(this);
		},

	// ------------------------------------------------------------------------------------------------
	// properties
	
		/**
		 * @type {SetManager}	The SetManager object
		 */
		sets:null,

		/**
		 * @type {FileManager}	The FileManager object
		 */
		files:null,

		
	// ------------------------------------------------------------------------------------------------
	// public set management functions

		manageSets:function()
		{
			this.sets.manage();
		},
		
		rebuildSet:function()
		{
			this.sets.rebuild();
			this.panel.call('update');
		},

	// ------------------------------------------------------------------------------------------------
	// public functions for Flash Panel

		runFile:function(uri)
		{
			if(FLfile.exists(uri))
			{
				fl.runScript(uri);
			}
			else
			{
				this.log('The file "' +URI.asPath(uri)+ '" does not exist');
			}
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

		createFolder:function(uri)
		{
			return new Folder(uri, true).exists;
		},

		deleteFolder:function(uri)
		{
			var folder = new Folder(uri);
			folder.remove()
			return ! folder.exists;
		},

		createCommand:function(name, uri)
		{
			return this.files.createCommand(name, uri);
		},

		createFile:function(targetURI, contents, desc, icon, version)
		{
			return this.files.createFile(targetURI, contents, desc, icon, version);
		}


	}

// ------------------------------------------------------------------------------------------------
// create module

	/**
	 * @type {Module}
	 */
	Snippets = xjsfl.modules.create('Snippets', Snippets, this);