/**
 * Enabled or disable the xJSFL framework from loading at startup
 * @author	Dave Stewart
 */

	// config
		var configURI	= xjsfl.uri + 'core/config/xjsfl.xml';
		var configStr	= FLfile.read(configURI);

		if( ! configStr)
		{
			fl.trace('> xjsfl: The default xJSFL config could not be found. Rebuilding...');
			configStr = '<config><settings disabled="0" /></config>';
		}
		var config		= new XML(configStr);

	// variables
		if(config.settings.@disabled == 1)
		{
			var prompt		= 'xJSFL is currently disabled.\n\nAre you sure you want to enable (and load) xJSFL?';
			var disabled	= 0;
		}
		else
		{
			var prompt		= 'xJSFL is currently enabled.\n\nAre you sure you want to disable xJSFL (the next time Flash starts) ?';
			var disabled	= 1;
		}

	// take action
		if(confirm(prompt))
		{
			// update config
				config.settings.@disabled = disabled;
				FLfile.write(configURI, config.toXMLString());

			// reload xJSFL if enabled was chosen
				if(disabled == 0)
				{
					xjsfl.reload();
				}
				else
				{
					fl.trace('> xjsfl: xJSFL will be disabled the next time Flash starts');
				}
		}
