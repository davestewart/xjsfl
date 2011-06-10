
/**
 * Settings object for saving settings to disk
 * @param	obj	
 * @author	Dave Stewart	
 */
Settings = function(src)
{
	if(src instanceof String)
	{
		//this.data = this.load(src);
	}
	else
	{
		alert(src)
		this.data = src || {};
	}
}

Settings.prototype =
{
	data:{},
	
	/**
	 * return object setting as savable text
	 */
	get text()
	{
		alert(this.data)
		var str = '';
		for(var i in this.data)
		{
			if(! (typeof this[data][i] == 'function'))
			{
				var value = String(this.data[i]);
				value = value.split(/[\r\n]/);
				value = value[0]
				str += i + '=' + value + xjsfl.settings.newLine;
			}
			/*
			*/
		}
		return str;
	},
	
	/**
	 * Loads settings from disk and return as an object
	 */
	load:function(uri)
	{
		// variables
			var obj			= {};
			var file		= new File(uri);
			var contents	= xjsfl.utils.trim(file.contents);
			var lines		= contents.split(/[\r\n]+/g);
			
		// loop through lines and create obj
			for (var i = 0; i <lines.length; i++)
			{
				var pair = xjsfl.utils.trim(lines[i]).split(/\s*=\s*/);
				if(pair[0] != '')
				{
					obj[pair[0]] = pair[1];
				}
			}
			
		// return
			return obj;
	}
	
}

DataStore = function(module, type)
{
	
	var uri = getUri(module, type, filename)
	
	this.load = function()
	{
		
	}
	
	this.save = function()
	{
		
	}
	
	this.text = get()
	{
		
	}
	
	this.load();
	
}


function createDataStore(module, type)
{
	if(type == 'settings')
	{
		return new SettingsDataStore();
	}
	else
	{
		return new SettingsDataStore();
	}
	
	var uri		= getUri(module, type);
	var store	= new DataStore();
	var obj = 
	{
		load:function()
		{
			if(type == 'settings')
			{
				var settings = new Settings(uri);
				xjsfl.utils.extend(this, settings.data);
			}
			else if(type == 'data')
			{
				var text = new File(uri).contents;
				this.data = new XML(text);
			}
		},
		save:function()
		{
			var file = new File(uri, '', true);
			if(type == 'settings')
			{
				var settings = new Settings(module.settings);
				file.contents = settings.text;
			}
			else if(type == 'data')
			{
				var xml = this.data.toXMLString();
				file.contents = xml;
			}
			
			file.save();
		}
	}
	return obj;
}

*/
