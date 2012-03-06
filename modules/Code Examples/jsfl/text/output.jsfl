// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.reload(this);
		clear();
		
	// --------------------------------------------------------------------------------
	// Properties
	
		/**
		 * straight list, defaulting to the property "name"
		 */
		function outputProps()
		{
			var obj = {a:null, b:1, c:'Hello'};
			trace(Output.props(obj));
		}
			
	// --------------------------------------------------------------------------------
	// List
	
		/**
		 * straight list, defaulting to the property "name"
		 */
		function outputList()
		{
			Output.list(dom.selection);
		}
		
		/**
		 * using a custom property
		 */
		function outputCustomList()
		{
			Output.list(dom.library.items, 'itemType');
		}
		
		/**
		 * supplying several properties
		 */
		function outputMultipleCustomList()
		{
			Output.list(dom.library.items, ['name', 'timeline', 'itemType']);
		}
	
		/**
		 * listing a single object's properties
		 */
		function outputSelection()
		{
			Output.list(dom.selection[0]);
		}
			
	// --------------------------------------------------------------------------------
	// Inspect
	
		/**
		 * Inspect Array
		 */
		function outputInspectArray()
		{
			var arr = [0,1,2,3,4, {hello:'hello'}];
			Output.inspect(arr);
		}
	
		/**
		 * Inspect Object
		 */
		function outputInspectObject()
		{
			var obj = {a:1, b:2, c:[0,1,2,3,4, {hello:'hello'}]};
			Output.inspect(obj);
		}
	
		/**
		 * Inspect selection
		 */
		function outputInspectSelection()
		{
			Output.inspect($selection, 5);
		}

		/**
		 * Inspect library items, adding a custom label and a recursion depth of 3
		 */
		function outputInspectLibraryItems()
		{
			Output.inspect($library.items, 'Library items', 3); // 2nd + arguments can go in any order
		}

	// --------------------------------------------------------------------------------
	// Table

		/**
		 * Output the selection as a table
		 */
		function outputTableSelection()
		{
			Output.table($selection);
		}

		/**
		 * Output the Preset panel as a table
		 */
		function outputTablePresets()
		{
			Output.table(app.presetPanel.items);
		}
	
	// --------------------------------------------------------------------------------
	// Folders
	
		/**
		 * List all folder URIs
		 */
		function outputFolderURIs()
		{
			Timer.start();
			Output.folder('c:/temp', 8);
			Timer.stop();
		}
	
		/**
		 * Output the user folder in hierarchical format, limiting to 3 levels deep
		 */
		function outputFolderTree()
		{
			Output.folder('user', 3, true)
		}
