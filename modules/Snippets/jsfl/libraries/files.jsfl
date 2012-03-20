
function FileManager(module)
{
	this.module = module;
}

FileManager.prototype =
{
	
	// ------------------------------------------------------------------------------------------------
	// variables
	
		module:null,
		
	// ------------------------------------------------------------------------------------------------
	// methods
	
		createCommand:function(name, uri)
		{
			var jsfl	= 'fl.runScript("' +uri+ '");';
			var file	= new File(fl.configURI + 'Commands/' + name + '.jsfl', jsfl);
			file.save();
			if(file.exists)
			{
				alert('Command "' +name+ '" created OK.');
			}
			else
			{
				if(confirm('There was a problem creating the command "' +name+ '". Would you like to open the commands folder?'))
				{
					file.parent.open();
				};
			}
			return file.exists;
		},

		createFile:function(targetURI, contents, desc, icon, version)
		{
			// values
				targetURI			= URI.toURI(targetURI);
				var name			= URI.getName(targetURI, true);
				var user			= new Config('user').get('personal');
				
			// template file
				var templateURI		= xjsfl.file.find('template', 'snippet.jsfl');
			
			// debug
				this.module.log('creating file: ' + URI.toPath(targetURI, true));

			// default values
				var data =
				{
					contents	:contents || '',
					desc		:desc || name,
					icon		:icon || 'Filesystem/page/page_white.png',
					version		:version || '0.1',
					name		:name,
					date		:new Date().format(),
					author		:user.name,
					email		:user.email,
					url			:user.url
				}

			// update template
				var template = new Template(templateURI, data);
				template.save(targetURI);
		},
		
		createSet:function()
		{
			
		}

}