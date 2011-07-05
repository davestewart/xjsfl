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
	 * XML helper function to create find/delete/filter callbacks from a string expression
	 * @param	callback	
	 * @returns		
	 */
	XML.makecallback = function(callback)
	{
		// variables
			var rxAttr	= /^@(\w+)=(.+)$/;
					
		// prepare callbacks
			if(typeof callback == 'string')
			{
				var value = callback;
				
				// class name
				if(/^\.\w+$/.test(callback))
				{
					callback = function(node, i){ return '.' + node.attribute('class') == value; }
				}
				
				// id
				else if(/^#\w+$/.test(callback))
				{
					callback = function(node, i){ return '#' + node.attribute('id') == value; }
				}
				
				// attribute exists
				else if(/^@\w+$/.test(callback))
				{
					callback = function(node, i){ return node.attribute(value) != null; }
				}
				
				// attribute matches
				else if(rxAttr.test(callback))
				{
					var matches = callback.match(rxAttr);
					callback = function(node, i){ return node.attribute(matches[1]) == matches[2]; }
				}
				
				// node name
				else
				{
					callback = function(node, i){ return node.name() == value; }
				}
			}
			
		// return
			return callback;
	}
	
	/**
	 * Find nodes according to a callback
	 * @param	callback		{Function}		A callback function of the format function(node, index, array) that should return a Boolean
	 * @param	descendents		{Boolean}		Am optional boolean to filter all desendant nodes
	 * @returns					{XMLList}		An XML list of the filtered nodes
	 * @example									xml.find(callback)
	 */
	XML.prototype.function::find = function(callback, descendents)
	{
		// variables
			var output	= new XMLList();
			var input	= descendents ? this..* : this.*;
			var length	= input.length();
			
		// defaults
			callback	= XML.makecallback(callback);
			
		// filter
			for(var i = 0; i < length; i++)
			{
				if(callback(input[i], i, input))
				{
					output += input[i];
				}
			}
			return output;
	}
	
	
	XML.prototype.function::remove = function(callback, descendents)
	{
		// variables
			var children	= descendents ? this..* : this.*;
			var last		= children.length() - 1;
			
		// defaults
			callback		= XML.makecallback(callback);
			
		// remove
			for(var i = last; i >= 0; i--)
			{
				if(callback(children[i], i, children))
				{
					delete children[i];
				}
			}
			
		// return
			return this;
	}
	
	
	/**
	 * Filter an existing XMLList with a callback
	 * @param	callback		{Function}		A callback function of the format function(node, index, array) that should return a Boolean
	 * @returns					{XMLList}		An XML list of the filtered nodes
	 * @example									xml..person.filter(callback)
	 */
	XMLList.prototype.function::filter = function(callback)
	{
		// variables
			var output	= new XMLList();
			var input	= this;
			var length	= input.length();
			
		// defaults
			callback	= XML.makecallback(callback);
			
		// filter
			for(var i = 0; i < length; i++)
			{
				if(callback(input[i], i, input))
				{
					output += input[i];
				}
			}
			
		// return
			return output;
	}

	//TODO Add jQuery-style CSS-style filtering to XML and XMLList
	
	/*
		
		xml.find('#id');
		xml.find('.class');
		xml.find('@attribute');
		xml.find('[attribute=value]');
		
		xml..rows.row.filter('#id');
		xml..rows.row.filter('.class');
		xml..rows.row.filter('[attribute=value]');
		xml..rows.row.filter('@attribute');
		
		
	
	*/
