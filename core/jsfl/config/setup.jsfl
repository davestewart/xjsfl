// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██               
//  ██            ██               
//  ██     █████ █████ ██ ██ █████ 
//  ██████ ██ ██  ██   ██ ██ ██ ██ 
//      ██ █████  ██   ██ ██ ██ ██ 
//      ██ ██     ██   ██ ██ ██ ██ 
//  ██████ █████  ████ █████ █████ 
//                           ██    
//                           ██    
//
// ------------------------------------------------------------------------------------------------------------------------
// Setup - sets up user information the first time the framework is run

	// --------------------------------------------------------------------------------
	// functions
	
		// handlers
			function onChange(event)
			{
				var value	= event.control.value;
				var index	= value.indexOf('@');
				if(index > -1)
				{
					var domain	= value.substr(index + 1);
					if(domain)
					{
						this.controls.url.value = 'www.' + domain;
					}
				}
			}
			
			function onComplete(name, email, url)
			{
				var params = Utils.combine('name, email, url', arguments);
				for(var name in params)
				{
					config.xml.user[name] = params[name];
				}
				trace('Saving user information to ' + URI.toPath(config.uri, true));
				config.save();
			}
			
		// setup
			function setup()
			{
				XUL
					.factory()
					.load('//core/ui/user.xul')
					.setFlashData({click:'http://www.xjsfl.com/support/setup/quick-start/getting-started'})
					.addEvent('email', 'change', onChange)
					.setButtons('accept')
					.setValues(config.xml.user.*)
					.show(onComplete);
			}
	
	// --------------------------------------------------------------------------------
	// code

		// initialise
			xjsfl.init(this);

		// variables
			var config = new Config('xjsfl.xml');
			
		// run
			setup();
