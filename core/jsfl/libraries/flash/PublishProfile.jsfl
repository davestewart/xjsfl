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
// PublishProfile - OO interface to Flash's publish settings

	// --------------------------------------------------------------------------------
	// # Instantiation
	
		function PublishProfile(dom, autoSave)
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
			},
			
			audioFormat:
			{
				// looks like it's impossible to set some of the audio formats using XML only
				'Disabled'			:-1, // bitrate also needs to be 0
				'ADPCM'				:-2, // this appears to work only by luck
				'MP3FastStereo'		:-1,
				'MP3FastMono'		:0,
				'MP3MediumStereo'	:1,
				'MP3MediumMono'		:2,
				'MP3BestStereo'		:3,
				'MP3BestMono'		:4,
			},
			
			audioBitRate:
			{
				'none'				:0,
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
			
			hardwareAccelleration:
			{
				'none'				:0,
				'direct'			:1,
				'cpu'				:2,
			}
		}
		
	// --------------------------------------------------------------------------------
	// # Prototype
	
		PublishProfile.prototype =
		{
			
			// --------------------------------------------------------------------------------
			// # Methods
			
				load:function()
				{
					var xml =  new XML(this.getDOM().exportPublishProfileString())
					this.getXML = function(parentNodeName)
					{
						return parentNodeName ? xml[parentNodeName] : xml;
					};
				},
				
				save:function()
				{
					this.getDOM().importPublishProfileString(this.getXML());
				},
				
				getXML:function(parentNodeName)
				{
					// dummy function - defined by load()
				},
				
				setXML:function(parentNodeName, childNodeName, value)
				{
					// dummy function - defined in constructor
				},
				
			// --------------------------------------------------------------------------------
			// # File
			
				file:
				{
					/** @type {Boolean}	Get and set the value for PublishFormatProperties.defaultNames */
					get defaultNames(){ return this.parent().getXML().PublishFormatProperties.defaultNames == 1; },
					set defaultNames(value){ this.parent().setXML('PublishFormatProperties', 'defaultNames', !! value ? 1 : 0); },
					
					/** @type {String}	Get and set the value for PublishFormatProperties.flashFileName */
					get flashPath(){ return String(this.parent().getXML().PublishFormatProperties.flashFileName); },
					set flashPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'flashDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'flashFileName', value);
					},
					
					/** @type {Boolean}	Get and set the value for PublishFormatProperties.flash */
					get flash(){ return this.parent().getXML().PublishFormatProperties.flash == 1; },
					set flash(value){ this.parent().setXML('PublishFormatProperties', 'flash', !! value ? 1 : 0); },
			
					/** @type {String}	Get and set the value for PublishFormatProperties.htmlFileName */
					get htmlPath(){ return String(this.parent().getXML().PublishFormatProperties.htmlFileName); },
					set htmlPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'htmlDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'htmlFileName', value);
					},
					
					/** @type {Boolean}	Get and set the value for PublishFormatProperties.html */
					get html(){ return this.parent().getXML().PublishFormatProperties.html == 1; },
					set html(value){ this.parent().setXML('PublishFormatProperties', 'html', !! value ? 1 : 0); },
			
					/** @type {String}	Get and set the value for PublishFormatProperties.pngFileName */
					get pngPath(){ return String(this.parent().getXML().PublishFormatProperties.pngFileName); },
					set pngPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'pngDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'pngFileName', value);
					},
					
					/** @type {Boolean}	Get and set the value for PublishFormatProperties.png */
					get png(){ return this.parent().getXML().PublishFormatProperties.png == 1; },
					set png(value){ this.parent().setXML('PublishFormatProperties', 'png', !! value ? 1 : 0); },
			
					/** @type {String}	Get and set the value for PublishFormatProperties.jpegFileName */
					get jpegPath(){ return String(this.parent().getXML().PublishFormatProperties.jpegFileName); },
					set jpegPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'jpegDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'jpegFileName', value);
					},
					
					/** @type {Boolean}	Get and set the value for PublishFormatProperties.jpeg */
					get jpeg(){ return this.parent().getXML().PublishFormatProperties.jpeg == 1; },
					set jpeg(value){ this.parent().setXML('PublishFormatProperties', 'jpeg', !! value ? 1 : 0); },
			
					/** @type {String}	Get and set the value for PublishFormatProperties.gifFileName */
					get gifPath(){ return String(this.parent().getXML().PublishFormatProperties.gifFileName); },
					set gifPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'gifDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'gifFileName', value);
					},
					
					/** @type {Boolean}	Get and set the value for PublishFormatProperties.gif */
					get gif(){ return this.parent().getXML().PublishFormatProperties.gif == 1; },
					set gif(value){ this.parent().setXML('PublishFormatProperties', 'gif', !! value ? 1 : 0); },
			
					/** @type {String}	Get and set the value for PublishFormatProperties.projectorWinFileName */
					get projectorWinPath(){ return String(this.parent().getXML().PublishFormatProperties.projectorWinFileName); },
					set projectorWinPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'projectorWinDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'projectorWinFileName', value);
					},
					
					/** @type {Boolean}	Get and set the value for PublishFormatProperties.projectorWin */
					get projectorWin(){ return this.parent().getXML().PublishFormatProperties.projectorWin == 1; },
					set projectorWin(value){ this.parent().setXML('PublishFormatProperties', 'projectorWin', !! value ? 1 : 0); },
			
					/** @type {String}	Get and set the value for PublishFormatProperties.projectorMacFileName */
					get projectorMacPath(){ return String(this.parent().getXML().PublishFormatProperties.projectorMacFileName); },
					set projectorMacPath(value)
					{
						this.defaultNames = false;
						this.parent().setXML('PublishFormatProperties', 'projectorMacDefaultName', 0);
						this.parent().setXML('PublishFormatProperties', 'projectorMacFileName', value);
					},
					
					/** @type {Boolean}	Get and set the value for PublishFormatProperties.projectorMac */
					get projectorMac(){ return this.parent().getXML().PublishFormatProperties.projectorMac == 1; },
					set projectorMac(value){ this.parent().setXML('PublishFormatProperties', 'projectorMac', !! value ? 1 : 0); },
			
				},
				
			// --------------------------------------------------------------------------------
			// # ActionScript
			
				as3:
				{
					/** @type {Number}	Get and set the value for ActionScriptVersion */
					get version(){ return parseInt(this.parent().getXML().PublishFlashProperties.ActionScriptVersion); },
					set version(value){ this.parent().setXML('PublishFlashProperties', 'ActionScriptVersion', value); },
					
					/** @type {String}	Get and set the value for ExternalPlayer and Version */
					get player(){ return String(this.parent().getXML().PublishFlashProperties.ExternalPlayer); },
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
						};
						this.parent().setXML('PublishFlashProperties', 'ExternalPlayer', value);
						this.parent().setXML('PublishFlashProperties', 'Version', version[value]);
					},
					
					/** @type {String}	Get and set the value for DocumentClass */
					get documentClass(){ return String(this.parent().getXML().PublishFlashProperties.DocumentClass); },
					set documentClass(value){ this.parent().setXML('PublishFlashProperties', 'DocumentClass', value); },
					
					/** @type {String}	Get and set the value for AS3PackagePaths */
					get packagePaths(){ return String(this.parent().getXML().PublishFlashProperties.AS3PackagePaths); },
					set packagePaths(value){ this.parent().setXML('PublishFlashProperties', 'AS3PackagePaths', value); },
					
					/** @type {Number}	Get and set the value for PackageExportFrame */
					get packageExportFrame(){ return parseInt(this.parent().getXML().PublishFlashProperties.PackageExportFrame); },
					set packageExportFrame(value){ this.parent().setXML('PublishFlashProperties', 'PackageExportFrame', value); },
					
					/** @type {String}	Get and set the value for AS3LibraryPaths */
					get libraryPaths(){ return String(this.parent().getXML().PublishFlashProperties.AS3LibraryPaths); },
					set libraryPaths(value){ this.parent().setXML('PublishFlashProperties', 'AS3LibraryPaths', value); },
					
					/** @type {String}	Get and set the value for AS3ExternalLibraryPaths */
					get externalLibraryPaths(){ return String(this.parent().getXML().PublishFlashProperties.AS3ExternalLibraryPaths); },
					set externalLibraryPaths(value){ this.parent().setXML('PublishFlashProperties', 'AS3ExternalLibraryPaths', value); },
					
					/** @type {String}	Get and set the value for AS3ConfigConst */
					get configConst(){ return String(this.parent().getXML().PublishFlashProperties.AS3ConfigConst); },
					set configConst(value){ this.parent().setXML('PublishFlashProperties', 'AS3ConfigConst', value); },
					
					/** @type {Boolean}	Get and set the value for AS3Strict */
					get strict(){ return this.parent().getXML().PublishFlashProperties.AS3Strict == 1; },
					set strict(value){ this.parent().setXML('PublishFlashProperties', 'AS3Strict', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for AS3Coach (warnings) */
					get warnings(){ return this.parent().getXML().PublishFlashProperties.AS3Coach == 1; },
					set warnings(value){ this.parent().setXML('PublishFlashProperties', 'AS3Coach', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for AS3AutoDeclare */
					get autoDeclare(){ return this.parent().getXML().PublishFlashProperties.AS3AutoDeclare == 1; },
					set autoDeclare(value){ this.parent().setXML('PublishFlashProperties', 'AS3AutoDeclare', !! value ? 1 : 0); },
					
					/** @type {String}	Get and set the value for AS3Dialect (ES|AS3) */
					get dialect(){ return String(this.parent().getXML().PublishFlashProperties.AS3Dialect); },
					set dialect(value){ this.parent().setXML('PublishFlashProperties', 'AS3Dialect', value); },
					
					/** @type {Number}	Get and set the value for AS3ExportFrame */
					get exportFrame(){ return parseInt(this.parent().getXML().PublishFlashProperties.AS3ExportFrame); },
					set exportFrame(value){ this.parent().setXML('PublishFlashProperties', 'AS3ExportFrame', value); },
					
					/** @type {Boolean}	Get and set the value for AS3Optimize */
					get optimize(){ return this.parent().getXML().PublishFlashProperties.AS3Optimize == 1; },
					set optimize(value){ this.parent().setXML('PublishFlashProperties', 'AS3Optimize', !! value ? 1 : 0); },
					
				},
				
			// --------------------------------------------------------------------------------
			// # SWF
			
				swf:
				{
					/** @type {Boolean}	Get and set the value for CompressMovie */
					get compressMovie(){ return this.parent().getXML().PublishFlashProperties.CompressMovie == 1; },
					set compressMovie(value){ this.parent().setXML('PublishFlashProperties', 'CompressMovie', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for InvisibleLayer */
					get includeHiddenLayers(){ return this.parent().getXML().PublishFlashProperties.InvisibleLayer == 1; },
					set includeHiddenLayers(value){ this.parent().setXML('PublishFlashProperties', 'InvisibleLayer', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for ExportSwc */
					get exportSWC(){ return this.parent().getXML().PublishFlashProperties.ExportSwc == 1; },
					set exportSWC(value){ this.parent().setXML('PublishFlashProperties', 'ExportSwc', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for IncludeXMP */
					get includeMetaData(){ return this.parent().getXML().PublishFlashProperties.IncludeXMP == 1; },
					set includeMetaData(value){ this.parent().setXML('PublishFlashProperties', 'IncludeXMP', !! value ? 1 : 0); },
					
					
				},
				
			// --------------------------------------------------------------------------------
			// # Image
			
				image:
				{
					/** @type {Number}	Get and set the value for Quality */
					get quality(){ return parseInt(this.parent().getXML().PublishFlashProperties.Quality); },
					set quality(value){ this.parent().setXML('PublishFlashProperties', 'Quality', value); },
					
					/** @type {Boolean}	Get and set the value for DeblockingFilter */
					get deblockingFilter(){ return this.parent().getXML().PublishFlashProperties.DeblockingFilter == 1; },
					set deblockingFilter(value){ this.parent().setXML('PublishFlashProperties', 'DeblockingFilter', !! value ? 1 : 0); },
					
					
				},
				
			// --------------------------------------------------------------------------------
			// # Sound
			
				audio:
				{
					/** @type {Number}	Get and set the value for StreamFormat */
					get streamFormat(){ return parseInt(this.parent().getXML().PublishFlashProperties.StreamFormat); },
					set streamFormat(value){ this.parent().setXML('PublishFlashProperties', 'StreamFormat', value); },
					
					/** @type {Number}	Get and set the value for StreamCompress */
					get streamBitRate()
					{
						//TODO decide if this should be set using a constant, or real bitrate values
						// 6 - 17
						var kbs		= [8, 16, 20, 24, 32, 48, 56, 64, 80, 112, 128, 160];
						var index	= parseInt(String(this.parent().getXML().PublishFlashProperties.StreamCompress)) - 6;
						return kbs[index];
					},
					set streamBitRate(value)
					{
						var kbs		= [8, 16, 20, 24, 32, 48, 56, 64, 80, 112, 128, 160];
						var value	= Utils.getNearestValue(kbs, value, true) + 6;
						this.parent().setXML('PublishFlashProperties', 'StreamCompress', index)
					},
					
					/** @type {Number}	Get and set the value for EventFormat */
					get eventFormat(){ return parseInt(this.parent().getXML().PublishFlashProperties.EventFormat); },
					set eventFormat(value){ this.parent().setXML('PublishFlashProperties', 'EventFormat', value); },
					
					/** @type {Number}	Get and set the value for EventCompress */
					get eventBitRate(){ return parseInt(this.parent().getXML().PublishFlashProperties.EventCompress); },
					set eventBitRate(value){ this.parent().setXML('PublishFlashProperties', 'EventCompress', value); },
					
					/** @type {Boolean}	Get and set the value for OverrideSounds */
					get overrideSounds(){ return this.parent().getXML().PublishFlashProperties.OverrideSounds == 1; },
					set overrideSounds(value){ this.parent().setXML('PublishFlashProperties', 'OverrideSounds', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for DeviceSound */
					get deviceSound(){ return this.parent().getXML().PublishFlashProperties.DeviceSound == 1; },
					set deviceSound(value){ this.parent().setXML('PublishFlashProperties', 'DeviceSound', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for StreamUse8kSampleRate */
					get streamUse8kSampleRate(){ return this.parent().getXML().PublishFlashProperties.StreamUse8kSampleRate == 1; },
					set streamUse8kSampleRate(value){ this.parent().setXML('PublishFlashProperties', 'StreamUse8kSampleRate', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for EventUse8kSampleRate */
					get eventUse8kSampleRate(){ return this.parent().getXML().PublishFlashProperties.EventUse8kSampleRate == 1; },
					set eventUse8kSampleRate(value){ this.parent().setXML('PublishFlashProperties', 'EventUse8kSampleRate', !! value ? 1 : 0); },
					
					
				},
				
			// --------------------------------------------------------------------------------
			// # Advanced Settings
			
				advanced:
				{
					/** @type {Boolean}	Get and set the value for Report */
					get generateSizeReport(){ return this.parent().getXML().PublishFlashProperties.Report == 1; },
					set generateSizeReport(value){ this.parent().setXML('PublishFlashProperties', 'Report', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for Protect */
					get protectFromImport(){ return this.parent().getXML().PublishFlashProperties.Protect == 1; },
					set protectFromImport(value){ this.parent().setXML('PublishFlashProperties', 'Protect', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for OmitTraceActions */
					get omitTraceActions(){ return this.parent().getXML().PublishFlashProperties.OmitTraceActions == 1; },
					set omitTraceActions(value){ this.parent().setXML('PublishFlashProperties', 'OmitTraceActions', !! value ? 1 : 0); },
					
					/** @type {Boolean}	Get and set the value for DebuggingPermitted */
					get permitDebugging(){ return this.parent().getXML().PublishFlashProperties.DebuggingPermitted == 1; },
					set permitDebugging(value){ this.parent().setXML('PublishFlashProperties', 'DebuggingPermitted', !! value ? 1 : 0); },
					
					/** @type {String}	Get and set the value for DebuggingPassword */
					get debuggingPassword(){ return String(this.parent().getXML().PublishFlashProperties.DebuggingPassword); },
					set debuggingPassword(value){ this.parent().setXML('PublishFlashProperties', 'DebuggingPassword', value); },
					
					/** @type {Boolean}	Get and set the value for UseNetwork (Playback security)  */
					get useNetwork(){ return this.parent().getXML().PublishFlashProperties.UseNetwork == 1; },
					set useNetwork(value){ this.parent().setXML('PublishFlashProperties', 'UseNetwork', !! value ? 1 : 0); },
					
					/** @type {Number}	Get and set the value for HardwareAcceleration */
					get hardwareAcceleration(){ return parseInt(this.parent().getXML().PublishFlashProperties.HardwareAcceleration); },
					set hardwareAcceleration(value){ this.parent().setXML('PublishFlashProperties', 'HardwareAcceleration', value); },
					
					/** @type {Number}	Get and set the value for ScriptStuckDelay */
					get scriptTimeLimit(){ return parseInt(this.parent().getXML().PublishFlashProperties.ScriptStuckDelay); },
					set scriptTimeLimit(value){ this.parent().setXML('PublishFlashProperties', 'ScriptStuckDelay', value); },
					
					
				},
				
			// --------------------------------------------------------------------------------
			// # Top
			
				top:
				{
					/** @type {object}	Get and set the value for TopDown */
					get topDown(){ return this.parent().getXML().PublishFlashProperties.TopDown == 1; },
					set topDown(value){ this.parent().setXML('PublishFlashProperties', 'TopDown', !! value ? 1 : 0); },
					
					/** @type {object}	Get and set the value for FireFox */
					get fireFox(){ return Utils.parseValue(String(this.parent().getXML().PublishFlashProperties.FireFox)); },
					set fireFox(value){ this.parent().setXML('PublishFlashProperties', 'FireFox', value); },
				},
				
			// --------------------------------------------------------------------------------
			// # Utilities
			
				toString:function()
				{
					return '[object PublishProfile]';
				}
		}
		
	// --------------------------------------------------------------------------------
	// Register class

		xjsfl.classes.register('PublishProfile', PublishProfile);
		
