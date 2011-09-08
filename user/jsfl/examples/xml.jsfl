// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

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
