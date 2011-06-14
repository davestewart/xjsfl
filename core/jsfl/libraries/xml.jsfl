// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██   ██ ██     
//  ██  ██ ███ ███ ██     
//  ██  ██ ███████ ██     
//   ████  ██ █ ██ ██     
//  ██  ██ ██   ██ ██     
//  ██  ██ ██   ██ ██     
//  ██  ██ ██   ██ ██████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// XML - extensions to XML to workaround Spidermonkey's buggy E4X declarate filtering

	/**
	 * Find nodes according to a callback
	 * @param	callback		{Function}		A callback function of the format function(node, index, array) that should return a Boolean
	 * @param	descendents		{Boolean}		Am optional boolean to filter all desendant nodes
	 * @returns					{XMLList}		An XML list of the filtered nodes
	 * @example									xml.find(callback)
	 */
	XML.prototype.function::find = function(callback, descendents)
	{
		var output	= new XMLList();
		var input	= descendents ? this..* : this.*;
		var length	= input.length();
		for(var i = 0; i < length; i++)
		{
			if(callback(input[i], i, input))
			{
				output += input[i];
			}
		}
		return output;
	}
	
	/**
	 * Filter an existing XMLList with a callback
	 * @param	callback		{Function}		A callback function of the format function(node, index, array) that should return a Boolean
	 * @returns					{XMLList}		An XML list of the filtered nodes
	 * @example									xml..person.filter(callback)
	 */
	XMLList.prototype.function::filter = function(callback)
	{
		var output	= new XMLList();
		var input	= this;
		var length	= input.length();
		for(var i = 0; i < length; i++)
		{
			if(callback(input[i], i, input))
			{
				output += input[i];
			}
		}
		return output;
	}

	//TODO Add jQuery-style CSS-style filtering to XML and XMLList
	
	/*
		
		xml.find('#id');
		xml.find('.class');
		xml.find('[attribute=value]');
		
		xml..rows.row.filter('#id');
		xml..rows.row.filter('.class');
		xml..rows.row.filter('[attribute=value]');
		
		
	
	*/