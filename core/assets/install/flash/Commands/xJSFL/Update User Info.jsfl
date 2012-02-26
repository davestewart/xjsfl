if(window.xjsfl && xjsfl.uri)
{
	// callback
		function onAccept(name, email, url)
		{
			var params = ['name', 'email', 'url'];
			for (var i = 0; i < params.length; i++)
			{
				config.set('personal.' + params[i], arguments[i]);
			}
		}

	// init
		xjsfl.init(this);
		
	// get values and show splash
		var config	= new Config('user');
		var values	= config.get('personal')
		var xul = XUL
			.factory()
			.load(new URI('//core/ui/user.xul'))
			.setValues(values)
			.show(onAccept);
}