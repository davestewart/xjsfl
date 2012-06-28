// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * Flash examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.reload();
		xjsfl.init(this);
		clear();
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// Code

		
		/**
		 * Set the flash publish location
		 */
		function setPublishPath()
		{
			var profile					= new PublishProfile();
			var value					= prompt('Set the published Flash file location:', profile.file.flashPath);
			if(value)
			{
				profile.file.flashPath	= value;
				inspect(profile);
			}
		}
		
		/**
		 * Set image and sound quality
		 */
		function setAudioQuality()
		{
			var profile					= new PublishProfile();
			var values					= Utils.getKeys(PublishProfile.CONSTANTS.audioBitRate).join(',');
			var settings				= XUL.create('title:Set MP3 Format,dropdown:Quality=[Fast,Medium,Best],dropdown:Bitrate=[' +values+ '],checkbox:Stereo');
			
			if(settings)
			{
				inspect(settings);
				
				var formatString			= 'MP3' + settings.quality + (settings.stereo ? 'Stereo' : 'Mono');
				var format					= PublishProfile.CONSTANTS.audioFormat[formatString];
				
				profile.audio.streamFormat	= format;
				profile.audio.streamBitRate	= settings.bitrate;
				profile.audio.eventFormat	= format;
				profile.audio.eventBitRate	= settings.bitrate;
				
				inspect(profile);
			}
		}
		
		/**
		 * Set player and ActionScript version
		 */
		function setPlayerVersion()
		{
			var profile					= new PublishProfile();
			var values					= Utils.getValues(PublishProfile.CONSTANTS.player).join(',');
			var settings				= XUL.create('title:Set Player Version,dropdown:Player Version=[' +values+ '],dropdown:ActionScript Version=[1,2,3]');
			
			if(settings)
			{
				profile.as3.player			= settings.playerversion;
				profile.as3.version			= settings.actionscriptversion;
				
				inspect(profile);
			}
		}

		//setAudioQuality()
		var profile = new PublishProfile();
		inspect(profile)
		
