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
	
	
/*
 
	//TODO Investigate function:: workaround more thoroughly
 
	var xml = <a id="dave">
		<b id="1" name="node">Hello
			<c id="2" name="node">Goodbye</c>
		</b>
		<d id="2" name="node">Goodbye</d>
	</a>
	
	var nodes = xml.*.(@id == '2');
	var nodes = xml..*.(function::attribute('name') == 'node');
	var nodes = xml.(function::hasOwnProperty('@id') && @id == 'dave');
	var nodes = xml..*.(attribute('name') == 'node');

	trace(nodes.toXMLString())
	

*/


// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.init(this);
			clear();
			try
			{
				
			var xml =
				<xml>
					<a id="a" vowel="true"/>
					<b id="b" />
					<c id="c" class="test" />
					<d id="d" class="test">
						<e id="e" vowel="true">
							<f id="f" class="test" />
						</e>
					</d>
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
		// Find nodes by class
		
			if(0)
			{
				var nodes = xml.find('.test')
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Find nodes by class
		
			if(0)
			{
				var nodes = xml.find('.test', true)
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Find nodes by attribute
		
			if(0)
			{
				var nodes = xml.find('@vowel=true', true)
				trace(nodes.toXMLString());
			}
		
		
		// --------------------------------------------------------------------------------
		// Find nodes using a callback
		
			if(0)
			{
				var nodes = xml.find( function(node, index, nodes){ return node.children().length() > 0; }, true );
				trace(nodes.toXMLString());
			}
		
		// --------------------------------------------------------------------------------
		// Remove nodes by class
		
			if(0)
			{
				xml.remove('.test', true)
				trace(xml.toXMLString());
			}
			
		// --------------------------------------------------------------------------------
		// Filter an XMLList by 
		
			if(0)
			{
				var nodes = xml..*;
				trace(nodes.toXMLString());
				
				var filtered = nodes.filter( function(node, index, nodes){ return index % 2 == 0; } );
				trace(filtered.toXMLString());
			}
			
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
		
