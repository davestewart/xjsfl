// ------------------------------------------------------------------------------------------------------------------------
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
// ------------------------------------------------------------------------------------------------------------------------
// FileSystemObject


	// -----------------------------------------------------------------------------------------------
	// constructor and inheritance

		/**
		 * FileSytemObject class
		 * @param pathOrUri {String} The uri or path to the object
		 */
		FileSystemObject = function(pathOrUri)
		{
			if(pathOrUri)
			{
				this.uri = this.getUri(pathOrUri);
			}
			if(this.uri)
			{
				this.name = this.uri.replace(/%20/g, ' ').match(/([^/]+)[/]*$/)[1];
			}
		}
		
	
	// -----------------------------------------------------------------------------------------------
	// properties

		/**
		 * @type {String} The uri-formatted string to the item
		 */
		FileSystemObject.prototype.uri = null;
		
				
	// -----------------------------------------------------------------------------------------------
	// methods

		/**
		 * Gets a uri-formatted string to the filesystem resource
		 * @param pathOrUri	Any valid path or uri-formatted pointer to a filsystem resource	
		 * @returns	{String} The uri-formatted string to the filesystem resource
		 */
		FileSystemObject.prototype.getUri = function(pathOrUri)
		{
			if(pathOrUri.indexOf('file:') == 0)
			{
				return pathOrUri;
			}
			return FLfile.platformPathToURI(pathOrUri);
		};
		
		/**
		 * Deletes the item from the filesystem
		 * @param skipConfirmation {Boolean} An optional boolean to skip the user-confirmation window
		 * @returns {Boolean} A Boolean indicating if the item was deleted or not
		 */
		FileSystemObject.prototype.remove = function(skipConfirmation)
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
		}
		
		/**
		 * Resolves an absolute path from a relative path - takes 1 or 2 arguments depending on the context
		 * @param source {String} If 2 arguments passed, the original absolute source path, such as 'c:/temp/file.txt'
		 * @param source {String} If 1 argument passed, a relative target path, such as '../../file.txt'
		 * @param target {String} A relative target path
		 */
		FileSystemObject.prototype.resolve = function(source, target)
		{
			
		}
		
	// -----------------------------------------------------------------------------------------------
	// accessors

		/**
		 * @type {String} The platform-specific path to the item
		 */
		FileSystemObject.prototype.__defineGetter__('path', function (){ return FLfile.uriToPlatformPath(this.uri).replace(/\\/g, '/') } );
		

		/**
		 * @type {Boolean} true if the file exists; false otherwise. 
		 */
		FileSystemObject.prototype.__defineGetter__('exists', function (){ return FLfile.exists(this.uri) } );
		

		/**
		 * @type {Number} The number of seconds that have elapsed between January 1, 1970 and the time the file or folder was created, or "00000000" if the file or folder doesn’t exist
		 */
		FileSystemObject.prototype.__defineGetter__('created', function (){ return parseInt(FLfile.getCreationDate(this.uri), 16) } );

		/**
		 * @type {Number} The number of seconds that have elapsed between January 1, 1970 and the time the file or folder was last modified, or "00000000" if the file or folder doesn’t exist
		 */
		FileSystemObject.prototype.__defineGetter__('modified', function (){ return parseInt(FLfile.getModificationDate(this.uri), 16) } );
		

		/**
		 * @type {Date} A JavaScript Date object that represents the date and time when the specified file or folder was created. If the file doesn’t exist, the object contains information indicating that the file or folder was created at midnight GMT on December 31, 1969.
		 */
		FileSystemObject.prototype.__defineGetter__('createdDate', function (){ return FLfile.getCreationDateObj(this.uri) } );

		/**
		 * @type {Date} A JavaScript Date object that represents the date and time when the specified file or folder was last modified. If the file or folder doesn’t exist, the object contains information indicating that the file or folder was created at midnight GMT on December 31, 1969.
		 */
		FileSystemObject.prototype.__defineGetter__('modifiedDate', function (){ return FLfile.getModificationDateObj(this.uri) } );
		

		/**
		 * @type {String} A string that represents the attributes of the specified file or folder.
		 */
		FileSystemObject.prototype.__defineGetter__('attributes', function (){ return FLfile.getAttributes(this.uri) } );

		/**
		 * @type {String} A string specifying values for the attribute(s) you want to set. N: No specific attribute, A: Ready for archiving (Windows only), R: Read-only (on the Macintosh, read-only means “locked”), W: Writable (overrides R), H: Hidden (Windows only), V: Visible (overrides H, Windows only)
		 */
		FileSystemObject.prototype.__defineSetter__('attributes', function (attributes){ return FLfile.setAttributes(this.uri, attributes) } );
		
		/**
		 * @type {Array} The object's parent folder, or the same folder if the root
		 */
		FileSystemObject.prototype.__defineGetter__
		(
			'parent',
			function ()
			{
				var uri = this.uri;
				return uri;
			}
		);

			
	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██    ██            
//  ██           ██    ██            
//  ██     █████ ██ █████ █████ ████ 
//  █████  ██ ██ ██ ██ ██ ██ ██ ██   
//  ██     ██ ██ ██ ██ ██ █████ ██   
//  ██     ██ ██ ██ ██ ██ ██    ██   
//  ██     █████ ██ █████ █████ ██   
//
// ------------------------------------------------------------------------------------------------------------------------
// Folder

	// -----------------------------------------------------------------------------------------------
	// constructor and inheritance

		/**
		 * Folder class
		 * @param pathOrUri {String} The uri or path to the object
		 */
		Folder = function(pathOrUri, create)
		{
			// remove trailing slash
				pathOrUri = pathOrUri.replace(/\/+$/, '');
				
			// constructor
				FileSystemObject.apply(this, [pathOrUri]);
				if(!this.exists && create)
				{
					FLfile.createFolder(this.uri);
				}
		}
		
		/**
		 * Inheritance
		 */
		Folder.prototype = new FileSystemObject;
		
	// -----------------------------------------------------------------------------------------------
	// methods


		/**
		 * Opens the folder in the Explorer / Finder
		 * @returns {File} The original file
		 */
		Folder.prototype.open = function()
		{
			var command = fl.version.indexOf('MAC') == -1 ? 'start' : 'open';
			var exec = command + " \"\" \"" +this.path+ "\""
			FLfile.runCommandLine(exec);
			return this;
		}
		
		/**
		 * Calls a function on each element in the collection
		 * @param callback {Function} A callback function to fire on each iteraction
		 * @param itemType {String} Optionally limit the iteration to files or folders. Leave blank for all content
		 * @returns {Array} An array of Files and/or Folders
		 */
		Folder.prototype.each = function(callback, scope, itemType)
		{
			scope = scope || window;
			itemType = itemType || 'contents';
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
				trace('Unknown FileSystemItem type!')
			}
		}
		
		/**
		 * A string representation of the folder name and number of items
		 * @returns {String} A string representation of the folder
		 */
		Folder.prototype.toString = function(path)
		{
			return '[object Folder "' +(path ? this.path : this.name)+ '" contains ' +this.contents.length+ ' items]';
		}
			
	// -----------------------------------------------------------------------------------------------
	// getters

		/**
		 * @type {Number} The number of items in the folder
		 */
		Folder.prototype.__defineGetter__('items', function (){ return FLfile.listFolder(this.uri).length; } );
			
		/**
		 * @type {Number} Synonym for items
		 */
		Folder.prototype.__defineGetter__('length', function (){ return this.items; } );
			
		/**
		 * @type {Array} The folder's files and folders
		 * @var {Array} The folder's files and folders
		 * @returns {Array} The folder's files and folders
		 */
		Folder.prototype.__defineGetter__
		(
			'contents',
			function ()
			{
				var uri;
				var items = FLfile.listFolder(this.uri);
				for(var i = 0; i < items.length; i++)
				{
					uri = this.uri + '/' + items[i].replace(/ /g, '%20');
					items[i] = items[i].match(/\.[^\/]+$/) ? new File(uri) : new Folder(uri);
				}
				return items;
			}
		);
		
		/**
		 * @type {Array} The folder's subfolders
		 */
		Folder.prototype.__defineGetter__
		(
			'folders',
			function ()
			{
				var items = FLfile.listFolder(this.uri, "directories");
				for(var i = 0; i < items.length; i++)
				{
					uri = this.uri + '/' + items[i].replace(/ /g, '%20');
					items[i] = new Folder(uri);
				}
				return items;
			}
		);
		
		/**
		 * @type {Array} The folder's files
		 */
		Folder.prototype.__defineGetter__
		(
			'files',
			function ()
			{
				var items = FLfile.listFolder(this.uri, "files");
				for(var i = 0; i < items.length; i++)
				{
					uri = this.uri + '/' + items[i].replace(/ /g, '%20');
					items[i] = new File(uri);
				}
				return items;
			}
		);
			
	// -----------------------------------------------------------------------------------------------
	// code


// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██ ██       
//  ██        ██       
//  ██     ██ ██ █████ 
//  █████  ██ ██ ██ ██ 
//  ██     ██ ██ █████ 
//  ██     ██ ██ ██    
//  ██     ██ ██ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// File


	// -----------------------------------------------------------------------------------------------
	// constructor and inheritance

		/**
		 * File class
		 * @param pathOrUri {String} The uri or path to the object
		 */
		File = function(pathOrUri, contents)
		{
			/// constructor
				FileSystemObject.apply(this, [pathOrUri]);
			
			// extension
				this.extension = this.uri.substr(this.uri.lastIndexOf('.') + 1);

			// if there's any data, save it
				if(contents)
				{
					this.contents = contents;
				}
				else if(this.extension == 'fla' && !this.exists)
				{
					this.save();
				}
			
		}
		
		/**
		 * Inheritance
		 */
		File.prototype = new FileSystemObject;
		
	// -----------------------------------------------------------------------------------------------
	// properties
	
		/** 
		 * @type {String} The file extension of the file
		 */
		File.prototype.extension = '';

	
	// -----------------------------------------------------------------------------------------------
	// methods
	
		/**
		 * Opens the file in the Flash authoring environment
		 * @returns {File} The original file
		 */
		File.prototype.open = function()
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
					var command = fl.version.indexOf('MAC') == -1 ? 'start' : 'open';
					var exec = command + " \"\" \"" +this.path+ "\""
					FLfile.runCommandLine(exec);

			}
			//fl[this.extension == 'fla' ? 'openDocument' : 'openScript'](this.uri);
			return this;
		}
		
		/**
		 * executes any JSFL file, or Attempts to run the file via the operating system command line if not
		 * @returns {File} The original file
		 */
		File.prototype.run = function()
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
		
		/**
		 * Copies the file to a new location
		 * @param uriCopy {String} The new uri to copy the file to
		 * @param overWrite {Boolean} Optional Boolean indicating whether the target file should be overwritten if it exists
		 * @returns {File} A new File object
		 */
		File.prototype.copy = function(uriCopy, overWrite)
		{
			if(overWrite)
			{
				FLfile.remove(uriCopy);
			}
			if(FLfile.copy(this.uri, this.getUri(uriCopy)))
			{
				return new File(uriCopy);
			}
			return this;
		}
		
		/**
		 * Append data to the file
		 * @param data {String} The data to append to the file
		 * @returns {File} The original file
		 */
		File.prototype.write = function(data, append)
		{
			FLfile.write(this.uri, data, append ? 'append' : null);
			return this;
		}
		
		/**
		 * Saves the file
		 * @returns {File} The original file
		 */
		File.prototype.save = function()
		{
			this.write('');
			return this;
		}
		
		/**
		 * Reveals the file, selected, in the Explorer or Finder
		 */
		File.prototype.reveal = function()
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
		}
		
		/**
		 * A string representation of the file
		 * @returns {File} A string containing the class and filename
		 */
		File.prototype.toString = function(path)
		{
			return '[object File "' +(path ? this.path : this.name)+ '"]';
		}
			
	// -----------------------------------------------------------------------------------------------
	// getters
	
		/** 
		 * @type {String} The file extension of the file
		 */
		File.prototype.__defineGetter__('size', function (){ return FLfile.getSize(this.uri) } );
		
		/** 
		 * @type {String} The file extension of the file
		 */
		File.prototype.__defineGetter__('contents', function (){ return FLfile.read(this.uri) } );
		
		/** 
		 * @type {String} The file extension of the file
		 */
		File.prototype.__defineSetter__('contents', function (data){ return FLfile.write(this.uri, data) } );
	
	
	
// ---------------------------------------------------------------------------------------------------------------------
// register classes with xjsfl
	
	if(window.xjsfl && xjsfl.classes)
	{
		xjsfl.classes.register('FileSystemObject', FileSystemObject);
		xjsfl.classes.register('Folder', Folder);
		xjsfl.classes.register('File', File);
	}

	
	//new File('c:/temp/temp.txt').exec()
	
if(false)
{
	
	fl.outputPanel.clear();
	trace = fl.trace	


	trace = fl.trace
	clear = fl.outputPanel.clear
	clear();
	
	//var folder = new Folder('c:/temp/a new folder');
	//var file = new File('c:/temp/some file.as', 'What\'s going on?!').open();
	
	
	var file = new File('z:/test.fla').open();
	/*
	var file = new File('z:/test.txt', 'Some content')
		.copy('z:/test2.as')
		.write(' and some more', true)
		.open();
		
	 */
	/*
	var indent = '';
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
	
	$.output.recurse(root, function(e){trace(e)}, function(e){return e instanceof Folder})
	
	var files = 0;
	var folders = 0;
	var d = new Date;
	
	var folder = new Folder('c:/temp');
	//folder = new Folder('C:/ProgramData/Adobe');
	list(folder)
	
	trace([folders, files, new Date - d])
	*/
	
	
	/*
	$$ =
	{
		output:
		{
			hier:indent = function(value, level)
			{
				fl.trace(Array(level + 1).join('\t') + value);
			}
		}
	}

	function list(e)
	{
		indent(e.name, i)
		if(e instanceof Folder)
		{
			i++;
			e.each(list);
			i--;
		}
	}
	
	var i = 0;
	list(new Folder('c:/temp'))

	//alert(folder.name)
	*/
				
	//function l(e){indent(e.name,i);if(e instanceof Folder){i++;e.each(l);i--}}var i=0;l(new Folder('c:/temp/'))
	//function l(e){$$.output.hier(e.name,i);if(e.isFolder){i++;e.each(l);i--}}i=0;l(new Folder('c:/temp'))
	
	/*
	var folder = new Folder('file:///c|/temp/hello/there/mr');
	
	//f.contents = 'Have a nice day!';
	//alert(folder.contents)
	//f.remove(true)
	
	file.open()
	*/


	//var n='\t';function l(e){trace(n+'/'+e.name);if(e instanceof Folder){ n+='\t';e.each(l);n=n.substr(1);}}var f=new Folder('c:/temp');l(f)
	
}

/*
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
	
	recurse(new Folder('c:/temp/'), function(e, i, l, indent){fl.trace(indent + '/' +  e.name)}, function(e){return e instanceof Folder})
	recurse(new Folder('c:/temp/'), function(e, i, l, indent){fl.trace(indent + '/' +  e.name)})
*/
	
/*	
var file = new File('c:/temp/document.doc');

file.open()
	
var n = '\t';function l(e){ trace(n+'/'+e.name); if(e instanceof Folder){ n+= '\t'; e.each(l); n = n.substr(1);} } var f = new Folder('E:/02 - Current Jobs/xJSFL/xJSFL/user/jsfl/scripts');l(f)

var f = new Folder('c:/temp/');
trace(f)

var f = new File('c:/temp/test.txt');
trace(f)
*/
