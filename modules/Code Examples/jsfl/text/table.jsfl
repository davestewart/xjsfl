// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * Table
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		//clear();
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// sample data
	
		var data =
		[
			{name:'Folder 1', value:200, symbol:'folder'},
			{name:'Folder 1/Folder 2', value:50, symbol:'folder'},
			{path:'Folder 1/Folder 2/Movieclip 1', value:-7, symbol:'movie clip'},
		]
	
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// functions

		/**
		 * Table instance of Library items
		 */
		function tableLibraryItems()
		{
			var table = new Table(dom.library.items);
			trace(table.render());
		}
		
	
		/**
		 * Static Table.print() method
		 */
		function tableStatic()
		{
			Table.print(data);
		}
		
	
		/**
		 * Different Table ORDER constants
		 */
		function tableOrders()
		{
			Table.print(data, Table.ORDER_FOUND);
			Table.print(data, Table.ORDER_ALPHA);
			Table.print(data, Table.ORDER_COLUMN);
			Table.print(data, Table.ORDER_ROW);
			Table.print(data, Table.ORDER_FIRST);
		}
	
	
		/**
		 * Limit column widths
		 */
		function tableLimitedColumnWidths()
		{
			Table.print(data, null, 10);
		}
		
		
		/**
		 * Selected library items
		 */
		function tableSelection()
		{
			Table.print($$(':selected').elements);
		}
	
	
		/**
		 * Animation presets
		 */
		function tablePresets()
		{
			Table.print(flash.presetPanel.items);
		}
