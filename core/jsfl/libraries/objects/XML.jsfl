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
// XML

	/**
	 * XML
	 * @overview	XML extensions to work around Spidermonkey's buggy E4X declarate filtering
	 * @instance	xml
	 */

(function xml()
{
	// includes
		xjsfl.init(this, ['Utils']);

	// --------------------------------------------------------------------------------
	// RegExps
	
		/**
		 * Finds the full path
		 * @type {RegExp}	operator, node, index, filter, attribute, matchIndex
		 * @ignore
		 */
		var rxPath			= /(?:(\.{0,2})([\-*\w]+))?(?:\[(\d+)\])?(?:\.\((.+?)\))?(?:\.(@[\-\w]+))?/g;
		
		/**
		 *
		 * @type {RegExp}	type, attr, operator, value
		 * @ignore
		 */
		var rxFilter		= /([@#\.])([-\w_:]+)([\^\$!=<>]+)?([^"'\(\)]+)?/;
		
		/**
		 * 
		 * @type {RegExp}	.(type, attr, operator, value) / 
		 * @ignore
		 */
		var rxFilterOnly	= new RegExp('^\.?\\(' +rxFilter.source+ '\\)$');
		
		/**
		 * Matches an attribute
		 * @type {RegExp}	i.e. @name, @some-name, @some_name
		 * @ignore
		 */		
		var rxAttribute		= /^@[-\w_]+$/;
		
			
	// --------------------------------------------------------------------------------
	// Find
	
		/**
		 * Alternative syntax for get, which allows a single filter to be passed in
		 *
		 * @param	{String}	path		An xJSFL E4X Path expression to a node
		 * @param	{Boolean}	descendants	An optional Boolean to debug the path to the node
		 * @returns	{XMLList}				An XML list of targetted nodes
		 * @example							xml.find('#id');
		 * @example							xml.find('.class');
		 * @example							xml.find('@name=dave);
		 */
		function find(attribute, descendants)
		{
			var path = '';
			return this.get(path);
		}
		XML.prototype.function::find = find;
		
	// --------------------------------------------------------------------------------
	// Get
	
		/**
		 * Gets nodes according to an path or callback
		 *
		 * @param	{String}	path		An xJSFL E4X Path expression to a node
		 * @param	{Boolean}	debug		An optional Boolean to debug the path to the node
		 * @returns	{XMLList}				An XML list of targetted nodes
		 * @example							xml.get('#id');
		 * @example							xml.get('.class');
		 * @example							xml.get('a.b.c.(@name=dave)');
		 * @example							xml.get('a.b.c.(@name=dave).d.e.@attr');
		 * @see								http://www.connectedpixel.com/blog/e4x/callbackfilters
		 */
		function get(path, debug)
		{
			// if a single attribute is passed, return attribute matches
				if(rxAttribute.test(path))
				{
					return this[path];
				}
			
			// if a single filter is specified, filter the current node / XMLList
				if(rxFilterOnly.test(path))
				{
					return this.filter(path);
				}
				
			// process
				var parent		= this;
				var pathMatches	= Utils.match(path, rxPath, null, true);
				
				while(pathMatches.length)
				{
					// current match segment
						var pathMatch	= pathMatches.shift();
						
					// variables
						var operator		= pathMatch[1];
						var node			= pathMatch[2];
						var index			= pathMatch[3];
						var filter			= pathMatch[4];
						var attribute		= pathMatch[5];
						var matchIndex		= pathMatch[6];
						
					// debug
						var currentPath	= path.substr(0, matchIndex + pathMatch[0].length);
						if(debug)
						{
							inspect(Utils.combine('match,operator,node,index,filter,attribute,matchIndex', pathMatch), '\nXML > processing path "' + currentPath + '"');
						}
						
					// grab elements
						var nullList	= new XMLList();
						var elements	= operator == '..' ? parent.descendants(node) : parent.elements(node);
						
					// resolve index
						if(index !== '')
						{
							var length	= elements.length();
							var index	= parseInt(index);
							if(index >= length)
							{
								return nullList;
							}
							elements	= elements[index];
						}
						
					// resolve filter
						else if(filter !== '')
						{
							elements = elements.filter(filter);
						}
	
					// if there are still matches to process...
						if(pathMatches.length > 0)
						{
							// at this point, we should hopefully have a single node
								length = elements.length();
								if(length == 1)
								{
									parent = elements[0];
								}
							
							// if not, we can't go forward, so return an empty XMLList
								else if(length == 0)
								{
									if(debug)
									{
										throw new Error('The path "' + currentPath + '" doesn\'t contain any nodes');
									}
									return nullList;
								}
								else if(length > 1)
								{
									if(debug)
									{
										throw new Error('The path "' + currentPath + '" has more than one node');
									}
									return nullList;
								}
						}
				}
				
			// return
				//return elements.nodeKind() === 'attribute' ? Utils.parseValue(elements) : elements;
				
			// return
				if(attribute)
				{
					return elements[attribute];
				}
				else
				{
					return elements;
				}
		}
		XML.prototype.function::get = get;
		
		
	// --------------------------------------------------------------------------------
	// Set
		
		/**
		 * Sets a child node on the node via String path
		 *
		 * @param	{String}	path		An xJSFL E4X Path expression to a node
		 * @param	{Object}	value		A value to assign or append to the targetted node
		 * @param	{Boolean}	append		An optional Boolean to append rather than replace/update the targetted node
		 * @param	{Number}	append		An optional index to insert, rather than replace the current node.
		 * @param	{Boolean}	debug		An optional Boolean to debug the path to the node
		 * @returns	{XML}					The node the value was set on
		 */
		function set(path, value, append, debug)
		{
			//TODO add in support to create new nodes by adding an index a.b.c[1] = 'new node'
			//TODO Add shorthand for a.b.c[] meaning 'append node'
			//TODO move index after filter a.(@name=dave)[3], so filtered nodes can then be selected by index
			//TODO move config.set() functionality here
			
			// if a single attribute is passed, set the value
				if(rxAttribute.test(path))
				{
					if(this.length() == 1)
					{
						this[path] = value;
					}
					return this;
				}
			
			// pre-process any single filters
				if(rxFilterOnly.test(path))
				{
					path = '*.(' +path+ ')';
				}
				
			// process
				var child;
				var parent		= this;
				var pathMatches	= Utils.match(path, rxPath, null, true);
				while(pathMatches.length)
				{
					// current match segment
						var pathMatch		= pathMatches.shift();
						
					// variables
						var operator		= pathMatch[1];
						var node			= pathMatch[2];
						var index			= pathMatch[3];
						var filter			= pathMatch[4];
						var attribute		= pathMatch[5];
						var matchIndex		= pathMatch[6];
						
					// debug
						var currentPath	= path.substr(0, matchIndex + pathMatch[0].length);
						if(debug)
						{
							inspect(Utils.combine('match,operator,node,index,filter,attribute,matchIndex', pathMatch), '\nXML > processing path "' + currentPath + '"');
						}
						
					// grab elements
						var elements	= operator == '..' ? parent.descendants(node) : parent.elements(node);
						var length		= elements.length();
						
					// if there are children, attempt to walk down
						if(length > 0)
						{
							if(filter !== '')
							{
								var children = elements.filter(filter);
								if(children.length())
								{
									elements	= children;
								}
								//TODO if a filter is passed, and not found, we just use the original list, rather than failing. Do we want to do this?
								parent		= elements[0];
							}
							else
							{
								var index	= index && index < length ? parseInt(index) : length - 1;
								parent		= elements[index];
							}
						}
						
					// if no children were found, create the new node
						if(elements.length() == 0)
						{
							// debug
								if(debug)
								{
									trace('XML > No <' +node+ ' /> node on ' + parent.name() + ' for current path "' + currentPath + '"')
								}

							// create node
								parent.appendChild(<{node} />);
								parent = parent[node];
							
							// check if a filter was set, and if so, apply its properties
								if(filter)
								{
									var filterMatches = filter.match(rxFilter);
									if(filterMatches)
									{
										// variables
											var type		= filterMatches[1];
											var attr		= filterMatches[2];
											var operator	= filterMatches[3];
											var val			= filterMatches[4];
											
										// resolve id and class shortcuts
											var attrs = {'#':'id', '.':'class'};
											if(type in attrs)
											{
												val			= attr;
												attr		= attrs[type];
												operator	= '=';
											}
											
										// debug
											if(debug)
											{
												format('XML > Adding attribute: {attr}="{value}"', attr, val);
											}
											
										// assign
											if(operator == '=')
											{
												parent['@' + attr] = val;
											}
									}
								}
						}
						
				}
				
			// finally, assign the value
				if(attribute)
				{
					parent[attribute] = value;
				}
				else
				{
					if(typeof value === 'xml')
					{
						// update variables
							var child	= parent;
							var parent	= parent.parent();
							
						// add new value
							if(typeof append === 'number')
							{
								var child = parent.*[append];
								parent.insertChildBefore(child, value);
							}
							else
							{
								parent.appendChild(value);
							}
						
						// if not appending, remove the original
							if(append === undefined)
							{
								var index = child.childIndex();
								delete parent.*[index];
							}
					}
					else
					{
						//TODO Check that vanilla values work
						if(append)
						{
							//parent = parent.parent();
							trace(parent.toXMLString())
							parent.* += value;
						}
						else
						{
							var index	= parent.childIndex();
							parent.*[index] = value;
						}
					}
					/*
					if(length > 1)
					{
						trace('PARENT')
						parent.* += value;
					}
					else
					{
					}
					*/
				}
				
			// return
				return parent;
		}
		XML.prototype.function::set = set;
	

	// --------------------------------------------------------------------------------
	// Remove
		
		/**
		 * Remove the current node/attribute(s), or targeted node/attribute(s) from the current node
		 *
		 * @param	{String}	path		An optional xJSFL E4X Path expression to a node
		 * @returns	{Boolean}				True or false, depending on a sucessful deletion. false means the node has no parent, or has already been deleted
		 */
		function remove(path, debug)
		{
			// remove single attributes
				if(rxAttribute.test(path))
				{
					delete this[path];
				}
				
			// remove node(s) from parent
				else
				{
					var nodes = path ? this.get(path, debug) : this;
					if(nodes)
					{
						for (var i = nodes.length() - 1; i >= 0; i--)
						{
							var node	= nodes[i];
							var parent	= node.parent();
							if(node.nodeKind() === 'attribute')
							{
								var name = node.name();
								delete parent['@' + name];
							}
							else
							{
								var index = node.childIndex();
								delete parent.*[index];
							}
						}
					}
				}
		}
		XML.prototype.function::remove = remove;

		
	// --------------------------------------------------------------------------------
	// Filter
		
		/**
		 * Filters the existing nodeset using an xJSFL E4X callback expression
		 *
		 * @param	{String}	path		An xJSFL E4X Path expression to a node
		 * @returns	{XMLList}				An XML list of targetted nodes
		 */
		function filter(filter)
		{
			// debug
				//trace('FILTERING:' + filter)			
			
			// function
				function makeCallback(type, attr, operator, value)
				{
					// variables
						var callback;
						var attrs = {'#':'id', '.':'class'};
						if(type in attrs)
						{
							value		= attr;
							attr		= attrs[type];
							operator	= '=';
						}
						
					// callbacks
						switch(operator)
						{
							case '':	callback	= function(node){ return node.attribute(attr).length(); };		break;
							case '=':                                                                           	
							case '==':	callback	= function(node){ return node.attribute(attr) == value; };		break;
							case '!=':	callback	= function(node){ return node.attribute(attr) != value; };		break;
							case '<':	callback	= function(node){ return node.attribute(attr) < value; };		break;
							case '>':	callback	= function(node){ return node.attribute(attr) > value; };		break;
							case '<=':	callback	= function(node){ return node.attribute(attr) <= value; };		break;
							case '>=':	callback	= function(node){ return node.attribute(attr) >= value; };		break;
							case '^=':	
							case '$=':	var rxStr	= operator === '^=' ? '^' + value : value + '$';
										var rx		= new RegExp(rxStr);
										callback	= function(node){ return rx.test(String(node.attribute(attr))); };
							break;
							default:	callback	= function(node){ return false; }
						}
						
					// return
						return callback;
				}
				
			// variables
				var elements		= this;
				var filterMatches	= filter.match(rxFilter);
				
			// process
				if(filterMatches)
				{
					var params		= filterMatches.splice(1); // remove original match
					var callback	= makeCallback.apply(this, params);
					elements		= elements.(callback(function::valueOf()));
				}
				
			// return
				return elements;

		}
		// Should this be XMLList!?
		XML.prototype.function::filter = filter;
		
		
	// --------------------------------------------------------------------------------
	// PrettyPrint
		
		/**
		 * Returns a pretty-printed XML string with correct tabbing and linespacing
		 *
		 * @param	{Object}	useSystemNewline	An optional Boolean to 
		 * @returns	{String}						An XML String
		 */
		function prettyPrint(useSystemNewline)
		{
			return this.toXMLString().replace(/ {2}/g, '\t').replace(/\n/g, useSystemNewline ? xjsfl.settings.newLine : '\n');
		}
		XML.prototype.function::prettyPrint = prettyPrint;


	
})()

/*
	var xml =
		<xml>
			<path>
				<to>
					<node index="1" value="value1" id="ID"/>
					<node index="2" value="value2" />
					<node index="3" value="value3" class="green"/>
					<node index="4" value="value4" class="red">
						<target index="5" id="dummy"/>
						<target index="6" id="gateway" class="green">
							<node index="7" id="final" />
						</target>
					</node>
				</to>
				<node index="8" value="value1" id="ID"/>
			</path>
			<node index="9" value="value1" id="ID"/>
		</xml>
*/
		

/*
	//var path	= "xml.path.to.node.(.value4).target.(#gateway).node.(@value=Dave)";
	//var path	= "xml.path.to.node.(function::attribute('value') == 'value4').target.(function::attribute('id') == 'gateway')";
	//var path	= "xml.path.to.node.(function::attribute('value') == 'value4').target";
	//var node	= xml.path.to.node.(function::attribute('value') == 'value4').target.(function::attribute('id') == 'gateway')
	//var nodes	= eval(str);
	
	
	//var path	= "path.to.node.(.red).target.(#gateway).@class";
	
	//var path = 'path.to'
	//var path	= ".*.(.green)";
	//var path	= ".green";
	//var path	= "@class^=g";
	
	//var path	= "@index>1";
	//var path	= "path.to.node.(@index>2)";
	//var path	= "path.to.node.(@index)";
	//var path	= ".*.(#ID)";
	//var nodes	= findNode(xml, path, true, true);

	var nodes	= xml.get(path, true, true);
*/

//var nodes = xml.path.to.node.(@index == 3)

/*

	trace(nodes.length(), nodes.toXMLString())
	
	var state = xml.find('path.to.node').remove();
	trace(state)
	
	trace(xml.toXMLString())
	
	//var node = xml.path.to.node.(function::attribute('id') == 'ID').remove()
	//var node = xml.find('@id', true).remove()
	
	//var node = xml.find('node', true, true).remove()
	trace();
	
	var node = xml..*.(function::name() == 'node');
	var node = xml..*.(function::attribute('index') > 0);
	//var node = xml.find('@index>0', true, true);
	
	
	var node = xml.find('@index>0', false, true);
	var node = xml.find('*.(@index>0)', false, true);
	
	var node = xml.find('@index>0', true, true);
	var node = xml.find('*.(@index>0)', true, true);
	var node = xml.find('.*.(@index>0)', false, true);
	var node = xml.find('..*.(@index>0)', false, true);
	
	function callback(node, index)
	{
		return node.@index > 4;
	}
	
	var node = xml.find(callback, true)[0].remove()
	
	delete[0]//.remove()
	//inspect(node)
*/





/*
	
clear();
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
	

	//inspect(xml.get('a'));
	//inspect(xml.get('d.e.f'));
	//inspect(xml.get('*.(.test)'));
	inspect(xml.get('*.(@class=test)', true));
	
	//inspect(xml.get('#id'));
	//inspect(xml.get('.class'));
	//inspect(xml.get('a.b.c.(@name=dave)'));
	//inspect(xml.get('a.b.c.(@name=dave).d.e.@attr'));

	//xml.remove('*.(.test)', true)
	//xml.remove('a.@id', true)

	//delete xml.*.(function::attribute('@class') == 'test')
	
	
	//trace(xml.toXMLString());
*/
	
	

