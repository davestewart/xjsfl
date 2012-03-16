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

	// --------------------------------------------------------------------------------
	// XML prototype functions
	
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
		 * @param	descendents		{Boolean}		An optional boolean to remove all desendant nodes, rather than the actual node
		 * @returns					{XML}			The original node
		 * @example									xml.delete('@name=something')
		 */
		XML.prototype.function::remove = function(callback, descendents)
		{
			// delete the node itself if no callback supplied
				if(typeof callback === 'undefined')
				{
					var name = this.length() == 1 ? this.name() : this[0].name();
					delete this.parent()[name];
					return true;
				}
				
			// variables
				var children	= descendents ? this..* : this.*;
				var last		= children.length() - 1;
				
			// defaults
				callback		= XML.makeCallback(callback);
	
			// remove
				var state = false;
				for(var i = last; i >= 0; i--)
				{
					if(callback(children[i], i, children))
					{
						state = true;
						delete children[i];
					}
				}
	
			// return
				return state;
		}
	
		/**
		 * Returns a pretty-printed XML string with correct tabbing and linespacing
		 * @param	{Object}		useSystemNewline	An optional Boolean to 
		 * @returns					{String}			An XML String
		 */
		XML.prototype.function::prettyPrint = function(useSystemNewline)
		{
			return this.toXMLString().replace(/ {2}/g, '\t').replace(/\n/g, useSystemNewline ? xjsfl.settings.newLine : '\n');
		}	
		
		/**
		 * Remove nodes according to a callback or expression
		 * @returns					{String}		The XML converted to a string
		 */
		/*
		XML.prototype.function::toString = function()
		{
			return this.toXMLString();
		}
		*/

	// --------------------------------------------------------------------------------
	// XMLList prototype functions
	
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
			// callback
				var callback = XML.makeCallback(callback);
	
			// filter
				return this.(callback(function::valueOf()));
		}
	
	// --------------------------------------------------------------------------------
	// XML static function
	
		/**
		 * XML helper function to create find/delete/filter callbacks from a string expression
		 * @param	callback	{String}		A CSS-style expression to match a node
		 * @param	callback	{Function}		A callback, that will be passed through
		 * @returns
		 */
		XML.makeCallback = function(callback)
		{
			// function
				if(typeof callback === 'function')
				{
					return callback;
				}
	
			// prepare callbacks
				else if(typeof callback == 'string')
				{
					var value	= callback;
					var rxAttr	= /^@(\w+)=(.+)$/;
					
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
						var matches	= callback.match(rxAttr);
						var attr	= matches[1];
						var value	= matches[2];
						callback	= function(node, i){ return node.attribute(attr) == value; }
					}
	
					// wildcard (*)
					else if(callback == '*')
					{
						callback = function(node, i){ return true; }
					}
	
					// node name (nodename)
					else
					{
						callback = function(node, i){ return node.name() == value; }
					}
				}
	
			// if not, fail!
				else
				{
					throw new ReferenceError('ReferenceError in XML: callback "' +callback+ '" is not a valid pattern or function');
				}
	
			// return
				return callback;
		}
	
	
	
