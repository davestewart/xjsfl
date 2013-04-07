// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██    ██ ██       ██    ██████             ████ ██ ██       
//  ██  ██       ██    ██          ██    ██  ██             ██      ██       
//  ██  ██ ██ ██ █████ ██ ██ █████ █████ ██  ██ ████ █████  ██   ██ ██ █████ 
//  ██████ ██ ██ ██ ██ ██ ██ ██    ██ ██ ██████ ██   ██ ██ █████ ██ ██ ██ ██ 
//  ██     ██ ██ ██ ██ ██ ██ █████ ██ ██ ██     ██   ██ ██  ██   ██ ██ █████ 
//  ██     ██ ██ ██ ██ ██ ██    ██ ██ ██ ██     ██   ██ ██  ██   ██ ██ ██    
//  ██     █████ █████ ██ ██ █████ ██ ██ ██     ██   █████  ██   ██ ██ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// PublishProfile

	/**
	 * PublishProfile
	 * @overview	OO interface to Flash's publish settings
	 * @instance	profile
	 */

	// --------------------------------------------------------------------------------
	// # Instantiation
	
		/**
		 * PublishProfile constuctor - creates a new Profile based on the current or supplied Document
		 * @constructor
		 * @param		{Document}		dom				An optional Document instance; defaults to the currently open Document
		 * @param		{Boolean}		autoSave		An optional Boolean to resave the profile immediately when properties are set; defaults to true
		 */
		PublishProfile = function(dom, autoSave)
		{
			// parameters
				dom			= dom || fl.getDocumentDOM();
				autoSave	= autoSave !== false;
			
			// methods
				this.getDOM = function()
				{
					return dom;
				}
				
			// get XML
				var parent		= this;
				this.top.parent = 
				this.image.parent = 
				this.audio.parent = 
				this.swf.parent = 
				this.advanced.parent = 
				this.file.parent = 
				this.as3.parent = function(){ return parent; };
	
			// set XML
				this.setXML = function(parentNodeName, childNodeName, value)
				{
					this.getXML()[parentNodeName][childNodeName] = value;
					if(autoSave)
					{
						this.save();
					}
				}
				
			// grab XML
				this.load();
		}
		
	// --------------------------------------------------------------------------------
	// # Constants
	
		PublishProfile.CONSTANTS =
		{
			player:
			{
				'FlashLite'			:'FlashLite',
				'FlashLite11'		:'FlashLite11',
				'FlashLite2'		:'FlashLite2',
				'FlashLite21'		:'FlashLite21',
				'FlashLite3'		:'FlashLite3',
				'AdobeAIR1_1'		:'AdobeAIR1_1',
				'FlashPlayer10'		:'FlashPlayer10',
				'FlashPlayer11'		:'FlashPlayer11',
				'FlashPlayer11.2'	:'FlashPlayer11.2',
				'FlashPlayer11.3'	:'FlashPlayer11.3',
				'FlashPlayer11.4'	:'FlashPlayer11.4',
				'FlashPlayer11.5'	:'FlashPlayer11.5',
				'FlashPlayer11.6'	:'FlashPlayer11.6',
				'FlashPlayer11.7'	:'FlashPlayer11.7',
				
			},
			
			version:
			{
				'FlashLite'			:4,
				'FlashLite11'		:4,
				'FlashLite2'		:7,
				'FlashLite21'		:7,
				'FlashLite3'		:8,
				'AdobeAIR1_1'		:9,
				'FlashPlayer10'		:10,
				'FlashPlayer11'		:11,
				'FlashPlayer11.2'	:15,
				'FlashPlayer11.3'	:16,
				'FlashPlayer11.4'	:17,
				'FlashPlayer11.5'	:18,
				'FlashPlayer11.6'	:19,
				'FlashPlayer11.7'	:20,
			},
			
			versionLookup:
			{
				4					:'FlashLite',
				4					:'FlashLite11',
				7					:'FlashLite20',
				7					:'FlashLite21',
				8					:'FlashLite30',
				9					:'AdobeAIR1_1',
				10					:'FlashPlayer10',
				11					:'FlashPlayer11',
				15					:'FlashPlayer11.2',
				16					:'FlashPlayer11.3',
				17					:'FlashPlayer11.4',
				18					:'FlashPlayer11.5',
				19					:'FlashPlayer11.6',
				20					:'FlashPlayer11.7',
			},
			
			audioFormat:
			{
				// looks like it's impossible to set some of the audio formats using XML only
				
				// these appear to work only by chance
				'Disabled'			:-1, // bitrate also needs to be 0
				'ADPCM'				:-2, 
				
				// these appear to be the default (settable) formats
				'MP3FastStereo'		:-1,
				'MP3FastMono'		:0,
				'MP3MediumStereo'	:1,
				'MP3MediumMono'		:2,
				'MP3BestStereo'		:3,
				'MP3BestMono'		:4,
			},
			
			/*
			audioBitRate:
			{
				'8'					:6,
				'16'				:7,
				'20'				:8,
				'24'				:9,
				'32'				:10,
				'48'				:11,
				'56'				:12,
				'64'				:13,
				'80'				:14,
				'112'				:15,
				'128'				:16,
				'160'				:17,
			},
			*/
				
			hardwareAccelleration:
			{
				'none'				:0,
				'direct'			:1,
				'cpu'				:2,
			}
		}
		
		PublishProfile.utils =
		{
			getKbsValue:function(index)
			{
				var kbs		= [8, 16, 20, 24, 32, 48, 56, 64, 80, 112, 128, 160];
				return kbs[index - 6];
			},
			
			getKbsIndex:function(kbs)
			{
				var kbs		= [8, 16, 20, 24, 32, 48, 56, 64, 80, 112, 128, 160];
				var index	= Utils.getNearestValue(kbs, value, true) + 6;
				return index;
			}
		}
		
	// --------------------------------------------------------------------------------
	// # Prototype
	
		PublishProfile.prototype =
		{
			
			// --------------------------------------------------------------------------------
			// # Methods
			
				/**
				 * Loads the current Publish Profile XML
				 */
				load:function()
				{
					var xml =  new XML(this.getDOM().exportPublishProfileString())
					this.getXML = function(parentNodeName)
					{
						return parentNodeName ? xml[parentNodeName] : xml;
					};
				},
				
				/**
				 * Saves and reimports the current settings
				 */
				save:function()
				{
					this.getDOM().importPublishProfileString(this.getXML());
				},
				
				/**
				 * Grabs all or some of the XML for the Publish Profile, 
				 * @param		{String}		parentNodeName		An optional String, which should be the node name of one of the main nodes, such as "PublishFlashProperties"
				 * @returns		{XML}								An XML object
				 */
				getXML:function(parentNodeName)
				{
					// dummy function - defined by load()
				},

				/**
				 * Sets the value of an XML node in the main XML
				 * @param		{String}		parentNodeName		The name of a top-level XML PublishProperties node, such as "PublishFlashProperties"
				 * @param		{String}		childNodeName		The name of a child-level property, such as "version"
				 * @param		{Object}		value				The value to set the node
				 */
				setXML:function(parentNodeName, childNodeName, value)
				{
					// dummy function - defined in constructor
				},
				
			// --------------------------------------------------------------------------------
			// # File
			
				file:
				{
					/**
					 * @type {Boolean}	Get and set the value for PublishFormatProperties.defaultNames
					 * @name			file.defaultNames
					 */
					get defaultNames(){ return this.parent && this.parent().getXML().PublishFormatProperties.defaultNames == 1; },
					set defaultNames(value){ this.parent().setXML('PublishFormatProperties', 'defaultNames', !! value ? 1 : 0); },
					
					/**
					 * @type {String}	Get and set the value for PublishFormatProperties.flashFileName
					 * @name			file.flashPath
					 */
					get flashPath(){ return this.parent && String(this.parent().getXML().PublishFormatProperties.flashFileName); },
					set flashPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'flashDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'flashFileName', value);
					},
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFormatProperties.flash
					 * @name			file.flash
					 */
					get flash(){ return this.parent && this.parent().getXML().PublishFormatProperties.flash == 1; },
					set flash(value){ this.parent().setXML('PublishFormatProperties', 'flash', !! value ? 1 : 0); },
			
					/**
					 * @type {String}	Get and set the value for PublishFormatProperties.htmlFileName
					 * @name			file.htmlPath
					 */
					get htmlPath(){ return this.parent && String(this.parent().getXML().PublishFormatProperties.htmlFileName); },
					set htmlPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'htmlDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'htmlFileName', value);
					},
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFormatProperties.html
					 * @name			file.html
					 */
					get html(){ return this.parent && this.parent().getXML().PublishFormatProperties.html == 1; },
					set html(value){ this.parent().setXML('PublishFormatProperties', 'html', !! value ? 1 : 0); },
			
					/**
					 * @type {String}	Get and set the value for PublishFormatProperties.pngFileName
					 * @name			file.pngPath
					 */
					get pngPath(){ return this.parent && String(this.parent().getXML().PublishFormatProperties.pngFileName); },
					set pngPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'pngDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'pngFileName', value);
					},
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFormatProperties.png
					 * @name			file.png
					 */
					get png(){ return this.parent && this.parent().getXML().PublishFormatProperties.png == 1; },
					set png(value){ this.parent().setXML('PublishFormatProperties', 'png', !! value ? 1 : 0); },
			
					/**
					 * @type {String}	Get and set the value for PublishFormatProperties.jpegFileName
					 * @name			file.jpegPath
					 */
					get jpegPath(){ return this.parent && String(this.parent().getXML().PublishFormatProperties.jpegFileName); },
					set jpegPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'jpegDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'jpegFileName', value);
					},
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFormatProperties.jpeg
					 * @name			file.jpeg
					 */
					get jpeg(){ return this.parent && this.parent().getXML().PublishFormatProperties.jpeg == 1; },
					set jpeg(value){ this.parent().setXML('PublishFormatProperties', 'jpeg', !! value ? 1 : 0); },
			
					/**
					 * @type {String}	Get and set the value for PublishFormatProperties.gifFileName
					 * @name			file.gifPath
					 */
					get gifPath(){ return this.parent && String(this.parent().getXML().PublishFormatProperties.gifFileName); },
					set gifPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'gifDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'gifFileName', value);
					},
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFormatProperties.gif
					 * @name			file.gif
					 */
					get gif(){ return this.parent && this.parent().getXML().PublishFormatProperties.gif == 1; },
					set gif(value){ this.parent().setXML('PublishFormatProperties', 'gif', !! value ? 1 : 0); },
			
					/**
					 * @type {String}	Get and set the value for PublishFormatProperties.projectorWinFileName
					 * @name			file.projectorWinPath
					 */
					get projectorWinPath(){ return this.parent && String(this.parent().getXML().PublishFormatProperties.projectorWinFileName); },
					set projectorWinPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'projectorWinDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'projectorWinFileName', value);
					},
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFormatProperties.projectorWin
					 * @name			file.projectorWin
					 */
					get projectorWin(){ return this.parent && this.parent().getXML().PublishFormatProperties.projectorWin == 1; },
					set projectorWin(value){ this.parent().setXML('PublishFormatProperties', 'projectorWin', !! value ? 1 : 0); },
			
					/**
					 * @type {String}	Get and set the value for PublishFormatProperties.projectorMacFileName
					 * @name			file.projectorMacPath
					 */
					get projectorMacPath(){ return this.parent && String(this.parent().getXML().PublishFormatProperties.projectorMacFileName); },
					set projectorMacPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'projectorMacDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'projectorMacFileName', value);
					},
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFormatProperties.projectorMac
					 * @name			file.projectorMac
					 */
					get projectorMac(){ return this.parent && this.parent().getXML().PublishFormatProperties.projectorMac == 1; },
					set projectorMac(value){ this.parent().setXML('PublishFormatProperties', 'projectorMac', !! value ? 1 : 0); },
			
				},
				
			// --------------------------------------------------------------------------------
			// # ActionScript
			
				as3:
				{
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.ActionScriptVersion
					 * @name			as3.version
					 */
					get version(){ return this.parent && parseInt(this.parent().getXML().PublishFlashProperties.ActionScriptVersion); },
					set version(value){ this.parent().setXML('PublishFlashProperties', 'ActionScriptVersion', value); },
					
					/**
					 * @type {String}	Get and set the value for PublishFlashProperties.ExternalPlayer and Version
					 * @name			as3.player
					 */
					get player(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.ExternalPlayer); },
					set player(value)
					{
						var version =
						{
							'FlashLite'			:4,
							'FlashLite11'		:4,
							'FlashLite2'		:7,
							'FlashLite21'		:7,
							'FlashLite3'		:8,
							'AdobeAIR1_1'		:9,
							'FlashPlayer10'		:10,
							'FlashPlayer11'		:11,
							'FlashPlayer11.2'	:15,
							'FlashPlayer11.3'	:16,
							'FlashPlayer11.4'	:17,
							'FlashPlayer11.5'	:18,
							'FlashPlayer11.6'	:19,
							'FlashPlayer11.7'	:20,
						};
						this.parent().setXML('PublishFlashProperties', 'ExternalPlayer', value);
						this.parent().setXML('PublishFlashProperties', 'Version', version[value]);
					},
					
					/**
					 * @type {String}	Get and set the value for PublishFlashProperties.DocumentClass
					 * @name			as3.documentClass
					 */
					get documentClass(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.DocumentClass); },
					set documentClass(value){ this.parent().setXML('PublishFlashProperties', 'DocumentClass', value); },
					
					/**
					 * @type {String}	Get and set the value for PublishFlashProperties.AS3PackagePaths
					 * @name			as3.packagePaths
					 */
					get packagePaths(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.AS3PackagePaths); },
					set packagePaths(value){ this.parent().setXML('PublishFlashProperties', 'AS3PackagePaths', value); },
					
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.PackageExportFrame
					 * @name			as3.packageExportFrame
					 */
					get packageExportFrame(){ return this.parent && parseInt(this.parent().getXML().PublishFlashProperties.PackageExportFrame); },
					set packageExportFrame(value){ this.parent().setXML('PublishFlashProperties', 'PackageExportFrame', value); },
					
					/**
					 * @type {String}	Get and set the value for PublishFlashProperties.AS3LibraryPaths
					 * @name			as3.libraryPaths
					 */
					get libraryPaths(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.AS3LibraryPaths); },
					set libraryPaths(value){ this.parent().setXML('PublishFlashProperties', 'AS3LibraryPaths', value); },
					
					/**
					 * @type {String}	Get and set the value for PublishFlashProperties.AS3ExternalLibraryPaths
					 * @name			as3.externalLibraryPaths
					 */
					get externalLibraryPaths(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.AS3ExternalLibraryPaths); },
					set externalLibraryPaths(value){ this.parent().setXML('PublishFlashProperties', 'AS3ExternalLibraryPaths', value); },
					
					/**
					 * @type {String}	Get and set the value for PublishFlashProperties.AS3ConfigConst
					 * @name			as3.configConst
					 */
					get configConst(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.AS3ConfigConst); },
					set configConst(value){ this.parent().setXML('PublishFlashProperties', 'AS3ConfigConst', value); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.AS3Strict
					 * @name			as3.strict
					 */
					get strict(){ return this.parent && this.parent().getXML().PublishFlashProperties.AS3Strict == 1; },
					set strict(value){ this.parent().setXML('PublishFlashProperties', 'AS3Strict', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.AS3Coach (warnings)
					 * @name			as3.warnings
					 */
					get warnings(){ return this.parent && this.parent().getXML().PublishFlashProperties.AS3Coach == 1; },
					set warnings(value){ this.parent().setXML('PublishFlashProperties', 'AS3Coach', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.AS3AutoDeclare
					 * @name			as3.autoDeclare
					 */
					get autoDeclare(){ return this.parent && this.parent().getXML().PublishFlashProperties.AS3AutoDeclare == 1; },
					set autoDeclare(value){ this.parent().setXML('PublishFlashProperties', 'AS3AutoDeclare', !! value ? 1 : 0); },
					
					/**
					 * @type {String}	Get and set the value for PublishFlashProperties.AS3Dialect (ES|AS3)
					 * @name			as3.dialect
					 */
					get dialect(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.AS3Dialect); },
					set dialect(value){ this.parent().setXML('PublishFlashProperties', 'AS3Dialect', value); },
					
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.AS3ExportFrame
					 * @name			as3.exportFrame
					 */
					get exportFrame(){ return this.parent && parseInt(this.parent().getXML().PublishFlashProperties.AS3ExportFrame); },
					set exportFrame(value){ this.parent().setXML('PublishFlashProperties', 'AS3ExportFrame', value); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.AS3Optimize
					 * @name			as3.optimize
					 */
					get optimize(){ return this.parent && this.parent().getXML().PublishFlashProperties.AS3Optimize == 1; },
					set optimize(value){ this.parent().setXML('PublishFlashProperties', 'AS3Optimize', !! value ? 1 : 0); },
					
				},
				
			// --------------------------------------------------------------------------------
			// # Image
			
				image:
				{
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.Quality
					 * @name			image.quality
					 */
					get quality(){ return this.parent && parseInt(this.parent().getXML().PublishFlashProperties.Quality); },
					set quality(value){ this.parent().setXML('PublishFlashProperties', 'Quality', value); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.DeblockingFilter
					 * @name			image.deblockingFilter
					 */
					get deblockingFilter(){ return this.parent && this.parent().getXML().PublishFlashProperties.DeblockingFilter == 1; },
					set deblockingFilter(value){ this.parent().setXML('PublishFlashProperties', 'DeblockingFilter', !! value ? 1 : 0); },
					
					
				},
				
			// --------------------------------------------------------------------------------
			// # Sound
			
				audio:
				{
					
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.StreamFormat (Pass in a PublishProfile.CONSTANTS.audioFormat value)
					 * @name			image.streamFormat
					 */
					get streamFormat(){ return this.parent && parseInt(this.parent().getXML().PublishFlashProperties.StreamFormat); },
					set streamFormat(value){ this.parent().setXML('PublishFlashProperties', 'StreamFormat', value); },
					
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.StreamCompress (Pass in a value from 8 to 160)
					 * @name			image.streamBitRate
					 */
					get streamBitRate()
					{
						var index	= this.parent && parseInt(String(this.parent().getXML().PublishFlashProperties.StreamCompress));
						var value	= PublishProfile.utils.getKbsValue(index);
						return value;
					},
					set streamBitRate(value)
					{
						var index	= PublishProfile.utils.getKbsIndex(value);
						this.parent().setXML('PublishFlashProperties', 'StreamCompress', index)
					},
					
					
					
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.EventFormat (Pass in a PublishProfile.CONSTANTS.audioFormat value)
					 * @name			image.eventFormat
					 */
					get eventFormat(){ return this.parent && parseInt(this.parent().getXML().PublishFlashProperties.EventFormat); },
					set eventFormat(value)
					{
						//BUG - for some reason can't seem to set eventFormat. Used to work, but now it doesn't
						if(value in {0:1, 2:1, 4:1} && this.eventBitRate < 9)
						{
							// try resetting minimum bitrate
							this.eventBitRate = 9;
						}
						this.parent().setXML('PublishFlashProperties', 'EventFormat', value);
					},
					
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.EventCompress (Pass in a value from 8 to 160)
					 * @name			image.eventBitRate
					 */
					get eventBitRate()
					{
						var index	= this.parent && parseInt(String(this.parent().getXML().PublishFlashProperties.EventCompress));
						var value	= PublishProfile.utils.getKbsValue(index);
						return value;
					},
					set eventBitRate(value)
					{
						var index	= PublishProfile.utils.getKbsIndex(value);
						this.parent().setXML('PublishFlashProperties', 'EventCompress', index)
					},
					
					
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.OverrideSounds
					 * @name			image.overrideSounds
					 */
					get overrideSounds(){ return this.parent && this.parent().getXML().PublishFlashProperties.OverrideSounds == 1; },
					set overrideSounds(value){ this.parent().setXML('PublishFlashProperties', 'OverrideSounds', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.DeviceSound
					 * @name			image.deviceSound
					 */
					get deviceSound(){ return this.parent && this.parent().getXML().PublishFlashProperties.DeviceSound == 1; },
					set deviceSound(value){ this.parent().setXML('PublishFlashProperties', 'DeviceSound', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.StreamUse8kSampleRate
					 * @name			image.streamUse8kSampleRate
					 */
					get streamUse8kSampleRate(){ return this.parent && this.parent().getXML().PublishFlashProperties.StreamUse8kSampleRate == 1; },
					set streamUse8kSampleRate(value){ this.parent().setXML('PublishFlashProperties', 'StreamUse8kSampleRate', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.EventUse8kSampleRate
					 * @name			image.eventUse8kSampleRate
					 */
					get eventUse8kSampleRate(){ return this.parent && this.parent().getXML().PublishFlashProperties.EventUse8kSampleRate == 1; },
					set eventUse8kSampleRate(value){ this.parent().setXML('PublishFlashProperties', 'EventUse8kSampleRate', !! value ? 1 : 0); },
					
					
				},
				
			// --------------------------------------------------------------------------------
			// # SWF
			
				swf:
				{
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.CompressMovie
					 * @name			swf.compressMovie
					 */
					get compressMovie(){ return this.parent && this.parent().getXML().PublishFlashProperties.CompressMovie == 1; },
					set compressMovie(value){ this.parent().setXML('PublishFlashProperties', 'CompressMovie', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.InvisibleLayer
					 * @name			swf.includeHiddenLayers
					 */
					get includeHiddenLayers(){ return this.parent && this.parent().getXML().PublishFlashProperties.InvisibleLayer == 1; },
					set includeHiddenLayers(value){ this.parent().setXML('PublishFlashProperties', 'InvisibleLayer', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.ExportSwc
					 * @name			swf.exportSWC
					 */
					get exportSWC(){ return this.parent && this.parent().getXML().PublishFlashProperties.ExportSwc == 1; },
					set exportSWC(value){ this.parent().setXML('PublishFlashProperties', 'ExportSwc', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.IncludeXMP
					 * @name			swf.includeMetaData
					 */
					get includeMetaData(){ return this.parent && this.parent().getXML().PublishFlashProperties.IncludeXMP == 1; },
					set includeMetaData(value){ this.parent().setXML('PublishFlashProperties', 'IncludeXMP', !! value ? 1 : 0); },
					
					
				},
				
			// --------------------------------------------------------------------------------
			// # Advanced Settings
			
				advanced:
				{
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.Report
					 * @name			advanced.generateSizeReport
					 */
					get generateSizeReport(){ return this.parent && this.parent().getXML().PublishFlashProperties.Report == 1; },
					set generateSizeReport(value){ this.parent().setXML('PublishFlashProperties', 'Report', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.Protect
					 * @name			advanced.protectFromImport
					 */
					get protectFromImport(){ return this.parent && this.parent().getXML().PublishFlashProperties.Protect == 1; },
					set protectFromImport(value){ this.parent().setXML('PublishFlashProperties', 'Protect', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.OmitTraceActions
					 * @name			advanced.omitTraceActions
					 */
					get omitTraceActions(){ return this.parent && this.parent().getXML().PublishFlashProperties.OmitTraceActions == 1; },
					set omitTraceActions(value){ this.parent().setXML('PublishFlashProperties', 'OmitTraceActions', !! value ? 1 : 0); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.DebuggingPermitted
					 * @name			advanced.permitDebugging
					 */
					get permitDebugging(){ return this.parent && this.parent().getXML().PublishFlashProperties.DebuggingPermitted == 1; },
					set permitDebugging(value){ this.parent().setXML('PublishFlashProperties', 'DebuggingPermitted', !! value ? 1 : 0); },
					
					/**
					 * @type {String}	Get and set the value for PublishFlashProperties.DebuggingPassword
					 * @name			advanced.debuggingPassword
					 */
					get debuggingPassword(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.DebuggingPassword); },
					set debuggingPassword(value){ this.parent().setXML('PublishFlashProperties', 'DebuggingPassword', value); },
					
					/**
					 * @type {Boolean}	Get and set the value for PublishFlashProperties.UseNetwork (Playback security)
					 * @name			advanced.useNetwork
					 */
					get useNetwork(){ return this.parent && this.parent().getXML().PublishFlashProperties.UseNetwork == 1; },
					set useNetwork(value){ this.parent().setXML('PublishFlashProperties', 'UseNetwork', !! value ? 1 : 0); },
					
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.HardwareAcceleration
					 * @name			advanced.hardwareAcceleration
					 */
					get hardwareAcceleration(){ return this.parent && parseInt(this.parent().getXML().PublishFlashProperties.HardwareAcceleration); },
					set hardwareAcceleration(value){ this.parent().setXML('PublishFlashProperties', 'HardwareAcceleration', value); },
					
					/**
					 * @type {Number}	Get and set the value for PublishFlashProperties.ScriptStuckDelay
					 * @name			advanced.scriptTimeLimit
					 */
					get scriptTimeLimit(){ return this.parent && parseInt(this.parent().getXML().PublishFlashProperties.ScriptStuckDelay); },
					set scriptTimeLimit(value){ this.parent().setXML('PublishFlashProperties', 'ScriptStuckDelay', value); },
					
					
				},
				
			// --------------------------------------------------------------------------------
			// # Top
			
				top:
				{
					/**
					 * @type {object}	Get and set the value for PublishFlashProperties.TopDown
					 * @name			top.topDown
					 */
					get topDown(){ return this.parent && this.parent().getXML().PublishFlashProperties.TopDown == 1; },
					set topDown(value){ this.parent().setXML('PublishFlashProperties', 'TopDown', !! value ? 1 : 0); },
					
					/**
					 * @type {object}	Get and set the value for PublishFlashProperties.FireFox
					 * @name			top.fireFox
					 */
					get fireFox(){ return this.parent && String(this.parent().getXML().PublishFlashProperties.FireFox); },
					set fireFox(value){ this.parent().setXML('PublishFlashProperties', 'FireFox', value); },
				},
				
			// --------------------------------------------------------------------------------
			// # Utilities
			
				toString:function()
				{
					var name = this.getDOM ? this.getDOM().name : '';
					return '[object PublishProfile dom="' +name+ '"]';
				}
		}
		
	// --------------------------------------------------------------------------------
	// Register class

		xjsfl.classes.register('PublishProfile', PublishProfile);
		
