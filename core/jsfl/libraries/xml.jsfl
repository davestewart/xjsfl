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
	 * @param	callback	{String}		A CSS-style expression to match a node
	 * @param	callback	{Function}		A callback, that will be passed through
	 * @returns		
	 */
	XML.makeCallback = function(callback)
	{
		// variables
			var rxAttr	= /^@(\w+)=(.+)$/;
					
		// prepare callbacks
			if(typeof callback == 'string')
			{
				var value = callback;
				
				// class name (.class)
				if(/^\.\w+$/.test(callback))
				{
					callback = function(node, i){ return '.' + node.attribute('class') == value; }
				}
				
				// id ('#id)
				else if(/^#\w+$/.test(callback))
				{
					callback = function(node, i){ return '#' + node.attribute('id') == value; }
				}
				
				// attribute exists (@attr)
				else if(/^@\w+$/.test(callback))
				{
					callback = function(node, i){ return node.attribute(value) != null; }
				}
				
				// attribute matches (@attr=value)
				else if(rxAttr.test(callback))
				{
					var matches = callback.match(rxAttr);
					callback = function(node, i){ return node.attribute(matches[1]) == matches[2]; }
				}
				
				// node name (nodename)
				else
				{
					callback = function(node, i){ return node.name() == value; }
				}
			}
			
		// return
			return callback;
	}
	
	/**
	 * Find nodes according to a callback or expression
	 * @param	callback		{Function}		A callback function of the format function(node, index, array) that should return a Boolean
	 * @param	callback		{String}		A CSS-style expression to match a node
	 * @param	descendents		{Boolean}		An optional boolean to filter all desendant nodes
	 * @returns					{XMLList}		An XML list of the filtered nodes
	 * @example									xml.find('#root')
	 */
	XML.prototype.function::find = function(callback, descendents)
	{
		// variables
			var output	= new XMLList();
			var input	= descendents ? this..* : this.*;
			var length	= input.length();
			
		// defaults
			callback	= XML.makeCallback(callback);
			
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
	
	
	/**
	 * Remove nodes according to a callback or expression
	 * @param	callback		{Function}		A callback function of the format function(node, index, array) that should return a Boolean
	 * @param	callback		{String}		A CSS-style expression to match a node
	 * @param	descendents		{Boolean}		An optional boolean to filter all desendant nodes
	 * @returns					{XML}			The original node
	 * @example									xml.delete('@name=something')
	 */
	XML.prototype.function::remove = function(callback, descendents)
	{
		// variables
			var children	= descendents ? this..* : this.*;
			var last		= children.length() - 1;
			
		// defaults
			callback		= XML.makeCallback(callback);
			
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
	 * Filter an existing XMLList with a callback or expression
	 * @param	callback		{Function}		A callback function of the format function(node, index, array) that should return a Boolean
	 * @param	callback		{String}		A CSS-style expression to match a node
	 * @param	descendents		{Boolean}		An optional boolean to filter all desendant nodes
	 * @returns					{XML}			The original node
	 * @example									xml..person.filter(callback)
	 */
	XMLList.prototype.function::filter = function(callback)
	{
		// variables
			var output	= new XMLList();
			var input	= this;
			var length	= input.length();
			
		// defaults
			callback	= XML.makeCallback(callback);
			
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


// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.init(this);
			clear();
			try
			{
				
				var xml =	<xml>
								<a id="a" />
								<b id="b" />
								<c id="c" name="Cee" class="test" />
								<d id="d" name="Dee" class="test" />
								<e id="e">
									<f id="f" class="test" />
								</e>
							</xml>
		
		// --------------------------------------------------------------------------------
		// Find nodes by name
		
			if(0)
			{
				var nodes = xml.find('a')
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Find nodes by id
		
			if(0)
			{
				var nodes = xml.find('#b')
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Find nodes by attribute
		
			if(0)
			{
				var nodes = xml.find('@name=Cee')
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Find nodes by class
		
			if(0)
			{
				var nodes = xml.find('.test')
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Find all nodes by class
		
			if(0)
			{
				var nodes = xml.find('.test', true)
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Find nodes using a callback
		
			if(0)
			{
				var nodes = xml.find( function(node, index, nodes){ return index >= 1; } )
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Remove nodes by class
		
			if(0)
			{
				xml.remove('.test')
				trace(xml.toXMLString());
			}
			
		// --------------------------------------------------------------------------------
		// Remove all nodes by class
		
			if(0)
			{
				xml.remove('.test', true)
				trace(xml.toXMLString());
			}
			
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
		
