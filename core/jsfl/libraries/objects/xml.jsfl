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

(function xml()
{
	// --------------------------------------------------------------------------------
	// XML prototype functions
	
		/**
		 * Find nodes according to an path or callback
		 * @param	path			{String}		An xJSFL E4X Path expression to a node
		 * @param	debug			{Boolean}		An optional Boolean to view generated expression
		 * @returns					{XMLList}		An XML list of the filtered nodes
		 * @example									xml.find('#id');
		 * @example									xml.find('.class');
		 * @example									xml.find('a.b.c.(@name=dave)');
		 * @example									xml.find('a.b.c.(@name=dave).d.e.@attr');
		 */
		get = function(path, debug)
		{
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
	
			// setup
				var rxPath			= /(?:(\.{0,2})([\-*\w]+))?(?:\[(\d+)\])?(?:\.\((.+?)\))?(?:\.(@[\-\w]+))?/g;
				var rxFilter		= /([@#\.])([\w_-:]+)([\^\$!=<>]+)?(.+)?/;
				var rxFilterOnly	= new RegExp('^' +rxFilter.source+ '$');
				
			// pre-process any single filters
				if(rxFilterOnly.test(path))
				{
					path = '*.(' +path+ ')';
				}
				
			// process
				var parent		= this;
				var pathMatches	= Utils.match(path, rxPath, null, true);
				while(pathMatches.length)
				{
					// current match segment
						var pathMatch	= pathMatches.shift();
						
					// variables
						var operator	= pathMatch[1];
						var node		= pathMatch[2];
						var index		= pathMatch[3];
						var filter		= pathMatch[4];
						var attribute	= pathMatch[5];
						
					// debug
						var currentPath	= path.substr(0, pathMatch.matchIndex + pathMatch[0].length);
						if(debug)
						{
							inspect(Utils.combine('match,operator,node,index,filter,attribute', pathMatch), '\nXML > processing path "' + currentPath + '"');
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
							var filterMatches = filter.match(rxFilter);
							if(filterMatches)
							{
								var params		= filterMatches.splice(1);
								var callback	= makeCallback.apply(this, params);
								elements		= elements.(callback(function::valueOf()));
							}
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
		
		/**
		 * Sets a child node on the node via String path
		 * @param	{String}	path	Description
		 * @param	{Object}	value	Description
		 * @returns	{XML}				Description
		 */
		function set(path, value, debug)
		{
			//TODO add in support to create new nodes by adding an index a.b.c[1] = 'new node'
			//TODO Add shorthand for a.b.c[] meaning 'append node'
			//TODO move index after filter a.(@name=dave)[3], so filtered nodes can then be selected by index
			//TODO move config.set() functionality here
			
			// setup
				var rxPath			= /(?:(\.{0,2})([\-*\w]+))?(?:\[(\d+)\])?(?:\.\((.+?)\))?(?:\.(@[\-\w]+))?/g;
				var rxFilter		= /([@#\.])([\w_-:]+)([\^\$!=<>]+)?(.+)?/;
				var rxFilterOnly	= new RegExp('^' +rxFilter.source+ '$');
				
			// pre-process any single filters
				if(rxFilterOnly.test(path))
				{
					path = '*.(' +path+ ')';
				}
				
			// process
				var parent		= this;
				var pathMatches	= Utils.match(path, rxPath, null, true);
				while(pathMatches.length)
				{
					// current match segment
						var pathMatch	= pathMatches.shift();
						
					// variables
						var operator	= pathMatch[1];
						var node		= pathMatch[2];
						var index		= pathMatch[3];
						var filter		= pathMatch[4];
						var attribute	= pathMatch[5];
						
					// debug
						var currentPath	= path.substr(0, pathMatch.matchIndex + pathMatch[0].length);
						if(debug)
						{
							inspect(Utils.combine('match,operator,node,index,filter,attribute', pathMatch), '\nXML > processing path "' + currentPath + '"');
						}
						
					// grab elements
						var elements	= operator == '..' ? parent.descendants(node) : parent.elements(node);
						var length		= elements.length();
						
					// if there are children, attempt to walk down
						if(length > 0)
						{
							if(filter !== '')
							{
								elements	= parent.get(filter);
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
							// create node
								parent[node]	= '';
								parent			= parent[node];
							
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
					parent.* += value
				}
				
			// return
				return parent;
		}
		XML.prototype.function::set = set;
	
		/**
		 * Remove the targeted node from the parent
		 * @returns			{Boolean}		True or false, depending on a sucessful deletion. false means the node has no parent, or has already been deleted
		 */
		function remove()
		{
			trace('XML::delete() = ' + this.name())
			// grab the parent
				var parent = this.parent();
				
			// skip processing if it's already been deleted
				if( ! parent )
				{
					return false;
				}
				
			// get the children
				var children = parent.children();
				
			// delete child from parent
				for (var i = children.length() - 1; i >= 0; i--)
				{
					if(children[i] == this)
					{
						delete children[i];
						return true;
					}
				}

			// return
				return false;
		}
		XML.prototype.function::remove = remove;
	

	
		/**
		 * Returns a pretty-printed XML string with correct tabbing and linespacing
		 * @param	{Object}	useSystemNewline	An optional Boolean to 
		 * @returns	{String}						An XML String
		 */
		function prettyPrint(useSystemNewline)
		{
			return this.toXMLString().replace(/ {2}/g, '\t').replace(/\n/g, useSystemNewline ? xjsfl.settings.newLine : '\n');
		}
		XML.prototype.function::prettyPrint = prettyPrint;
		
})();

(function xmllist()
{
	// --------------------------------------------------------------------------------
	// XMLList prototype functions
	
		/**
		 * Remove targeted nodes from the parent
		 * @returns			{Boolean}		True or false, depending on a sucessful deletion. false means the node has no parent, or has already been deleted
		 */
		function remove()
		{
			/*
				Assuming that the nodes in the XMLList are collected in order, we don't
				need a double-loop
				
				We just iterate over the parent.children in reverse order, and compare
				to the last node in the list.
				
				As soon as a node == child, then delete, get the next child, and continue
				the -- loop
				
				if, at the end of the loop there are still nodes left, we just recursively
				call remove() again, althogh it might be worth adding a recursion check
			*/
			
			//TODO add support for node[0].remove()
			
			//trace('XMLList::delete() = ' + this.length())
			//trace('XMLList::delete() = ' + this.parent())
			
			var state = false;
			for each(var node in this)
			{
				// grab the parent
					var parent = node.parent();
					
				// skip processing if it's already been deleted
					if( ! parent )
					{
						return false;
					}
					
				// get the children
					var children = parent.children();
					
				// delete child from parent
					for (var i = children.length() - 1; i >= 0; i--)
					{
						if(children[i] == node)
						{
							delete children[i];
							state = true;
							break;
						}
					}
			}
			return state;
		}
		
		XMLList.prototype.function::remove = remove;
	
	
})();
