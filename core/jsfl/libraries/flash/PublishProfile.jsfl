function PublishProfile(dom)
{
	// parameters
		dom = dom || fl.getDocumentDOM();
	
	// assign objects
		var parent = this;
		this.top.getParent = 
		this.player.getParent = 
		this.image.getParent = 
		this.sound.getParent = 
		this.swf.getParent = 
		this.advanced.getParent = 
		this.as3.getParent = function(){ return parent; };
		
	// methods
		this.getDOM = function()
		{
			return dom;
		}
		
	// grab XML
		this.load();
}

PublishProfile.prototype =
{
	xml:null,
	
	load:function()
	{
		var xml		=  new XML(this.getDOM().exportPublishProfileString())
		this.xml	= xml.PublishFlashProperties;
	},
	
	save:function()
	{
		var xml		=  new XML(this.getDOM().exportPublishProfileString())
		delete xml.PublishFlashProperties;
		xml.*		+= this.xml;
		this.getDOM().importPublishProfileString(xml);

	},
	
	set:function(name, value)
	{
		this.xml[name] = value;
		return this;
	},
	
	get:function(name)
	{
		return Utils.parseValue(String(this.xml[name]));
	},
	
	top:
	{
		getParent:function(){return {} },
		
		/** @type {object}	Get and set the value for TopDown */
		get topDown(){ return Utils.parseValue(String(this.getParent().xml.TopDown)); },
		set topDown(value){ this.getParent().xml.TopDown = value; },
		
		/** @type {object}	Get and set the value for FireFox */
		get fireFox(){ return Utils.parseValue(String(this.getParent().xml.FireFox)); },
		set fireFox(value){ this.getParent().xml.FireFox = value; },
		
		
	},
	player:
	{
		getParent:function(){return {} },
		
		/** @type {Number}	Get and set the value for Version */
		/*
			1, null
			5, null
			10, null
			10, FlashPlayer10
			9, AdobeAIR1_1
			4, FlashLite
			4, FlashLite11
			7, FlashLite2
			7, FlashLite21
			8, FlashLite3
		*/
		get version(){ return Utils.parseValue(String(this.getParent().xml.Version)); },
		set version(value){ this.getParent().xml.Version = value; },
		
		/** @type {String}	Get and set the value for ExternalPlayer */
		get externalPlayer(){ return Utils.parseValue(String(this.getParent().xml.ExternalPlayer)); },
		set externalPlayer(value){ this.getParent().xml.ExternalPlayer = value; },
		
		
	},
	image:
	{
		getParent:function(){return {} },
		
		/** @type {Number}	Get and set the value for Quality */
		get quality(){ return Utils.parseValue(String(this.getParent().xml.Quality)); },
		set quality(value){ this.getParent().xml.Quality = value; },
		
		/** @type {Boolean}	Get and set the value for DeblockingFilter */
		get deblockingFilter(){ return !! Utils.parseValue(String(this.getParent().xml.DeblockingFilter)); },
		set deblockingFilter(value){ this.getParent().xml.DeblockingFilter = !! value ? 1 : 0; },
		
		
	},
	sound:
	{
		getParent:function(){return {} },
		
		/*
			-1: Disabled
			4:	ADPCM
			0:	MP3
			4:	Raw
			4:	Speech
		
		*/
		
		/** @type {Number}	Get and set the value for StreamFormat */
		get streamFormat(){ return Utils.parseValue(String(this.getParent().xml.StreamFormat)); },
		set streamFormat(value){ this.getParent().xml.StreamFormat = value; },
		
		/** @type {Number}	Get and set the value for StreamCompress */
		get streamCompress()
		{
			// 6 - 17
			var kbs		= [8, 16, 20, 24, 32, 48, 56, 64, 80, 112, 128, 160];
			var index	= parseInt(String(this.getParent().xml.StreamCompress)) - 6;
			return kbs[index];
		},
		set streamCompress(value)
		{
			var kbs		= [8, 16, 20, 24, 32, 48, 56, 64, 80, 112, 128, 160];
			var value	= Utils.getNearestValue(kbs, value, true) + 6;
			this.getParent().xml.StreamCompress = index;
		},
		
		/** @type {Number}	Get and set the value for EventFormat */
		get eventFormat(){ return Utils.parseValue(String(this.getParent().xml.EventFormat)); },
		set eventFormat(value){ this.getParent().xml.EventFormat = value; },
		
		/** @type {Number}	Get and set the value for EventCompress */
		get eventCompress(){ return Utils.parseValue(String(this.getParent().xml.EventCompress)); },
		set eventCompress(value){ this.getParent().xml.EventCompress = value; },
		
		/** @type {Boolean}	Get and set the value for OverrideSounds */
		get overrideSounds(){ return !! Utils.parseValue(String(this.getParent().xml.OverrideSounds)); },
		set overrideSounds(value){ this.getParent().xml.OverrideSounds = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for DeviceSound */
		get deviceSound(){ return !! Utils.parseValue(String(this.getParent().xml.DeviceSound)); },
		set deviceSound(value){ this.getParent().xml.DeviceSound = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for StreamUse8kSampleRate */
		get streamUse8kSampleRate(){ return !! Utils.parseValue(String(this.getParent().xml.StreamUse8kSampleRate)); },
		set streamUse8kSampleRate(value){ this.getParent().xml.StreamUse8kSampleRate = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for EventUse8kSampleRate */
		get eventUse8kSampleRate(){ return !! Utils.parseValue(String(this.getParent().xml.EventUse8kSampleRate)); },
		set eventUse8kSampleRate(value){ this.getParent().xml.EventUse8kSampleRate = !! value ? 1 : 0; },
		
		
	},
	swf:
	{
		getParent:function(){return {} },
		
		/** @type {Boolean}	Get and set the value for CompressMovie */
		get compressMovie(){ return !! Utils.parseValue(String(this.getParent().xml.CompressMovie)); },
		set compressMovie(value){ this.getParent().xml.CompressMovie = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for InvisibleLayer */
		get invisibleLayer(){ return !! Utils.parseValue(String(this.getParent().xml.InvisibleLayer)); },
		set invisibleLayer(value){ this.getParent().xml.InvisibleLayer = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for ExportSwc */
		get exportSWC(){ return !! Utils.parseValue(String(this.getParent().xml.ExportSwc)); },
		set exportSWC(value){ this.getParent().xml.ExportSwc = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for IncludeXMP */
		get includeXMP(){ return !! Utils.parseValue(String(this.getParent().xml.IncludeXMP)); },
		set includeXMP(value){ this.getParent().xml.IncludeXMP = !! value ? 1 : 0; },
		
		
	},
	advanced:
	{
		getParent:function(){return {} },
		
		/** @type {Boolean}	Get and set the value for Report */
		get report(){ return !! Utils.parseValue(String(this.getParent().xml.Report)); },
		set report(value){ this.getParent().xml.Report = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for Protect */
		get protect(){ return !! Utils.parseValue(String(this.getParent().xml.Protect)); },
		set protect(value){ this.getParent().xml.Protect = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for OmitTraceActions */
		get omitTraceActions(){ return !! Utils.parseValue(String(this.getParent().xml.OmitTraceActions)); },
		set omitTraceActions(value){ this.getParent().xml.OmitTraceActions = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for DebuggingPermitted */
		get debuggingPermitted(){ return !! Utils.parseValue(String(this.getParent().xml.DebuggingPermitted)); },
		set debuggingPermitted(value){ this.getParent().xml.DebuggingPermitted = !! value ? 1 : 0; },
		
		/** @type {String}	Get and set the value for DebuggingPassword */
		get debuggingPassword(){ return String(this.getParent().xml.DebuggingPassword); },
		set debuggingPassword(value){ this.getParent().xml.DebuggingPassword = value; },
		
		/** @type {Boolean}	Get and set the value for UseNetwork */
		get useNetwork(){ return !! Utils.parseValue(String(this.getParent().xml.UseNetwork)); },
		set useNetwork(value){ this.getParent().xml.UseNetwork = !! value ? 1 : 0; },
		
		/** @type {Number}	Get and set the value for HardwareAcceleration */
		get hardwareAcceleration(){ return Utils.parseValue(String(this.getParent().xml.HardwareAcceleration)); },
		set hardwareAcceleration(value){ this.getParent().xml.HardwareAcceleration = value; },
		
		/** @type {Number}	Get and set the value for ScriptStuckDelay */
		get scriptStuckDelay(){ return Utils.parseValue(String(this.getParent().xml.ScriptStuckDelay)); },
		set scriptStuckDelay(value){ this.getParent().xml.ScriptStuckDelay = value; },
		
		
	},
	as3:
	{
		getParent:function(){return {} },
		
		/** @type {String}	Get and set the value for DocumentClass */
		get documentClass(){ return Utils.parseValue(String(this.getParent().xml.DocumentClass)); },
		set documentClass(value){ this.getParent().xml.DocumentClass = value; },
		
		/** @type {String}	Get and set the value for AS3PackagePaths */
		get packagePaths(){ return Utils.parseValue(String(this.getParent().xml.AS3PackagePaths)); },
		set packagePaths(value){ this.getParent().xml.AS3PackagePaths = value; },
		
		/** @type {String}	Get and set the value for AS3LibraryPaths */
		get libraryPaths(){ return Utils.parseValue(String(this.getParent().xml.AS3LibraryPaths)); },
		set libraryPaths(value){ this.getParent().xml.AS3LibraryPaths = value; },
		
		/** @type {String}	Get and set the value for AS3ExternalLibraryPaths */
		get externalLibraryPaths(){ return Utils.parseValue(String(this.getParent().xml.AS3ExternalLibraryPaths)); },
		set externalLibraryPaths(value){ this.getParent().xml.AS3ExternalLibraryPaths = value; },
		
		/** @type {String}	Get and set the value for AS3ConfigConst */
		get configConst(){ return Utils.parseValue(String(this.getParent().xml.AS3ConfigConst)); },
		set configConst(value){ this.getParent().xml.AS3ConfigConst = value; },
		
		/** @type {Boolean}	Get and set the value for AS3Strict */
		get strict(){ return !! Utils.parseValue(String(this.getParent().xml.AS3Strict)); },
		set strict(value){ this.getParent().xml.AS3Strict = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for AS3Coach (warnings) */
		get warnings(){ return !! Utils.parseValue(String(this.getParent().xml.AS3Coach)); },
		set warnings(value){ this.getParent().xml.AS3Coach = !! value ? 1 : 0; },
		
		/** @type {Boolean}	Get and set the value for AS3AutoDeclare */
		get autoDeclare(){ return !! Utils.parseValue(String(this.getParent().xml.AS3AutoDeclare)); },
		set autoDeclare(value){ this.getParent().xml.AS3AutoDeclare = !! value ? 1 : 0; },
		
		/** @type {String}	Get and set the value for AS3Dialect */
		get dialect(){ return Utils.parseValue(String(this.getParent().xml.AS3Dialect)); },
		set dialect(value){ this.getParent().xml.AS3Dialect = value; },
		
		/** @type {Number}	Get and set the value for AS3ExportFrame */
		get exportFrame(){ return Utils.parseValue(String(this.getParent().xml.AS3ExportFrame)); },
		set exportFrame(value){ this.getParent().xml.AS3ExportFrame = value; },
		
		/** @type {Number}	Get and set the value for AS3Optimize */
		get optimize(){ return Utils.parseValue(String(this.getParent().xml.AS3Optimize)); },
		set optimize(value){ this.getParent().xml.AS3Optimize = value; },
		
		/** @type {Number}	Get and set the value for ActionScriptVersion */
		get actionScriptVersion(){ return Utils.parseValue(String(this.getParent().xml.ActionScriptVersion)); },
		set actionScriptVersion(value){ this.getParent().xml.ActionScriptVersion = value; },
		
		/** @type {Number}	Get and set the value for PackageExportFrame */
		get packageExportFrame(){ return Utils.parseValue(String(this.getParent().xml.PackageExportFrame)); },
		set packageExportFrame(value){ this.getParent().xml.PackageExportFrame = value; },
		
		
	},
	
	toString:function()
	{
		return '[object PublishProfile]';
	}
	
}
/*

xjsfl.init(this);
clear();

var profile = new PublishProfile();

inspect(profile)

profile.image.quality = 20;
profile.sound.streamUse8kSampleRate = true;

trace(profile.xml)
profile.save();

//trace($dom.exportPublishProfileString())
trace(profile.xml)
*/

