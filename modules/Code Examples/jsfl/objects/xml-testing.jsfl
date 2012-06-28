

	// --------------------------------------------------------------------------------
	// test code
	/*
	*/
		trace = fl.trace;
		clear = fl.outputPanel.clear;
		
		clear()
	
		//TODO Investigate function:: workaround more thoroughly
	
		var xml =
			<xml id="0">
				<a id="1:a" class="mixed" >
					<b id="2:b" class="red">Node 2</b>
					<b id="3:b" class="green">Node 3</b>
					<b id="4:b" class="red">Node 4</b>
					<b id="5:b" class="green">
						<c id="6:c" class="red">Node 5</c>
					</b>
				</a>
				<c id="7:c" class="yellow">Node 6</c>
			</xml>
	
		fl.trace(xml.toXMLString());
		trace('');
	
	// --------------------------------------------------------------------------------
	// finding
	
		// children, works
			var nodes = xml.*.(@id == '2');
			
		// ancestors, breaks as it processes text nodes which don't have @id properties
			//var nodes = xml..*.(@id == '2');
			
		// need to first check existance of property using hasOwnProperty()
			var nodes = xml..*.(function::hasOwnProperty('@id') && @id == '1');
			
		// better alternative is to use attribute() which doesn't error (note the use of function:: to resolve E4X scope bug)
			var nodes = xml..*.(function::attribute('id') == '1');
			
		// "this" resolves to window
			//var nodes = xml..*.(fl.trace(this));
			trace('');
			
		// valueOf() resolves to the current node (again, function:: is needed to get round the scope bug)
			//var nodes = xml..*.(fl.trace(function::valueOf()));
			trace('');
			
	// --------------------------------------------------------------------------------
	// processing
	
		// nodes can be passed to a callback
			function callback(node, index)
			{
				trace('>> ' + node.toXMLString());
				return node.@id == 2;
			}
			//var nodes = xml..*.(callback(function::valueOf()));
			trace('');
			
	// --------------------------------------------------------------------------------
	// deleting
	
		// delete single/multiple nodes by targetting them manually
			//delete xml.a.b;
			//delete xml..c;
			//delete xml.a['b'];
			
		// delete attributes
			delete xml.a.@id;
			
		// delete doesn't seem to work like selcting does
			delete xml.a.b.(function::attribute('class') == 'red');
			
		// not even with a callback
			delete xml.a.b.(callback(function::valueOf()));
		
		// this doesn't work
			/*
			var nodes = xml..*.(function::attribute('class') == 'red');
			for (var i = nodes.length() - 1; i >= 0; i--)
			{
				var node 	= nodes[i];
				var parent	= node.parent();
				var index	= parent.childIndex(node); // the index here is incorrect
				delete parent.*[index];
			}
			*/
			
			/*
		// delete a single found node using a callback
			//delete xml.a.b.(function::attribute('class') == 'sad')[0];
			
		// delete multiple nodes using information from the node itself, you need to target them from the parent
		
			// using an index
				var attr		= 'class';
				var parent		= xml.a;
				var children	= parent.children();
				var length		= children.length() - 1;
				for (var i = length; i >= 0; i--)
				{
					if(children[i]['@' + attr] == 'red')
					{
						delete children[i];
					}
				}
				
		// delete multple nodes recursively
		
			// --------------------------------------------------------------------------------
			// fast version, hand coded
	
				// grab all nodes
					var nodes = xml..*.(function::attribute('class') == 'red');
					
				// now, process each node individually, in reverse order
					for each(var node in nodes)
					{
						// grab the parent
							var parent = node.parent();
							
						// skip processing if it's already been deleted
							if( ! parent )
							{
								continue;
							}
							
						// get the children which match the original selector
							var children = parent.*.(function::attribute('class') == 'red');
							
						// delete child from parent
							for (var j = children.length() - 1; j >= 0; j--)
							{
								if(children[j].@class == 'red')
								{
									delete children[j];
								}
							}
					}
				
			// --------------------------------------------------------------------------------
			// flexible (but slower) version
	
				// callback with comparison function	
					function callback(node)
					{
						return node.@class == 'red';
					}
		
				// grab all nodes
					var root	= xml;
					var nodes	= root..*.(callback(function::valueOf()));
					
				// now, process each node individually, in reverse order
					for each(var node in nodes)
					{
						// grab the parent
							var parent = node.parent();
							
						// skip processing if it's already been deleted
							if( ! parent )
							{
								continue;
							}
							
						// get ALL children
							var children = parent.children();
							
						// delete child from parent
							for (var j = children.length() - 1; j >= 0; j--)
							{
								if(select(children[j]))
								{
									delete children[j];
								}
							}
					}
					*/
				
		// using the XML class & and expression
			//var state = xml.a.remove('.red');
			//trace(state)
		
					
	// --------------------------------------------------------------------------------
	// deleting
	

		//fl.trace(nodes.toXMLString())
		fl.trace(xml.toXMLString())
		
		//trace(nodes.indexOf())
		//trace(nodes.a.b.indexOf())
	
