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

	// temp init
		xjsfl.init(this, 'filesystem');
		xjsfl.classes.load('utils', 'uri');

	// -------------------------------------------------------------------------------------------------------------------
	// constructor and inheritance

		/**
		 * FileSytemObject class
		 * @param	{String} pathOrUri The uri or path to the object
		 */
		FileSystemObject = function(uri)
		{
			if(uri)
			{
				this.uri = uri;
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
						FLfile.setAttributes(this.uri, 'W');
						return FLfile.remove(this.uri);
					}
					return this;
				},

			// -------------------------------------------------------------------------------------------------------------------
			// accessors
			
				/**
				 * @type {String}	The name of the file or folder
				 */
				get name(){ return decodeURI(this.uri).match(/([^/]*)[/]*$/)[1]; },

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

				/**
				 * @type {Array} The object's parent folder, or the same folder if the root
				 */
				get parent ()
				{
					if(this.uri)
					{
						var uri = URI.getParent(this.uri);
						return new Folder(uri);
					}
					return null;
				}

		}

// -----------------------------------------------------------------------------------------------------------------------------------------
// register classes with xjsfl

	xjsfl.classes.register('FileSystemObject', FileSystemObject);

