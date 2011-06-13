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
	 * Extend XML as E4X filtering is buggy in SpiderMonkey
	 * @param	callback		{Function}		A callback function of the format function(node, index, array) that should return a Boolean
	 * @param	descendents		{Boolean}		Am optional boolean to filter all desendant nodes
	 * @returns					{XMLList}		An XML list of the filtered nodes
	 */
	XML.prototype.function::filter = function(callback, descendents)
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