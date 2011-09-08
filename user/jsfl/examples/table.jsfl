// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.init(this);
		clear();
		try
		{
			
	// sample data
		var data =
		[
			{name:'Folder 1', value:200, symbol:'folder'},
			{name:'Folder 1/Folder 2', value:50, symbol:'folder'},
			{path:'Folder 1/Folder 2/Movieclip 1', value:-7, symbol:'movie clip'},
		]
	
	// --------------------------------------------------------------------------------
	// Table instance
	
		if(0)
		{
			var table = new Table(dom.library.items);
			trace(table.render());
		}
		
	
	// --------------------------------------------------------------------------------
	// Static Table.print() method
	
		if(0)
		{
			Table.print(data);
		}
		
	
	// --------------------------------------------------------------------------------
	// Different Table ORDER constants
	
		if(1)
		{
			Table.print(data, Table.ORDER_FOUND);
			Table.print(data, Table.ORDER_ALPHA);
			Table.print(data, Table.ORDER_COLUMN);
			Table.print(data, Table.ORDER_ROW);
			Table.print(data, Table.ORDER_FIRST);
		}
	
	
	// --------------------------------------------------------------------------------
	// Limit column widths
	
		if(0)
		{
			Table.print(data, null, 10);
		}
		
		
	// --------------------------------------------------------------------------------
	// Selected library items
	
		if(0)
		{
			Table.print($$(':selected').elements);
		}
	
	
	// --------------------------------------------------------------------------------
	// Animation presets
	
		if(0)
		{
			Table.print(flash.presetPanel.items);
		}
	
	
	// catch
		}catch(err){xjsfl.output.debug(err);}
