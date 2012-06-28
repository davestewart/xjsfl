// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * filename examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// variables

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

	
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// XML functions

		/**
		 * Find nodes by name
		 */
		function xmlFindByName()
		{
			var nodes = xml.find('a')
			trace(nodes.toXMLString());
		}
		
		/**
		 * Find nodes by id
		 */
		function xmlFindById()
		{
			var nodes = xml.find('#b')
			trace(nodes.toXMLString());
		}
	
		/**
		 * Find nodes by class
		 */
		function xmlFindByClass()
		{
			var nodes = xml.find('.test')
			trace(nodes.toXMLString());
		}
	
		/**
		 * Find all nodes by class
		 */
		function xmlFindAllByClass()
		{
			var nodes = xml.find('.test', true)
			trace(nodes.toXMLString());
		}
	
		/**
		 * Find nodes by attribute
		 */
		function xmlFindAllByAttribute()
		{
			var nodes = xml.find('@vowel=true', true)
			trace(nodes.toXMLString());
		}
	
	
		/**
		 * Find nodes using a callback
		 */
		function xmlFindByCallback()
		{
			var nodes = xml.find( function(node, index, nodes){ return node.children().length() > 0; }, true );
			trace(nodes.toXMLString());
		}
	
		/**
		 * Remove nodes by class
		 */
		function xmlRemove()
		{
			xml.remove('.test', true)
			trace(xml.toXMLString());
		}
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// XMLList functions

		/**
		 * Filter an XMLList by 
		 */
		function xmlListFilter()
		{
			var nodes = xml..*;
			trace(nodes.toXMLString());
			
			var filtered = nodes.filter( function(node, index, nodes){ return index % 2 == 0; } );
			trace(filtered.toXMLString());
		}
