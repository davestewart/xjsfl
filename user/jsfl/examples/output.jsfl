// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.reload(this);
		clear();
		try
		{
	
	// --------------------------------------------------------------------------------
	// Get properties of items
	
		// straight list, defaulting to the property "name"
			if(0)
			{
				var obj = {a:null, b:1, c:'Hello'};
				trace(Output.props(obj));
			}
			
	// --------------------------------------------------------------------------------
	// List items
	
		// straight list, defaulting to the property "name"
			if(0)
			{
				Output.list(dom.selection);
			}
			
		// using a custom property
			if(0)
			{
				Output.list(dom.library.items, 'itemType');
			}
			
		// supplying several properties
			if(0)
			{
				Output.list(dom.library.items, ['name', 'timeline', 'itemType']);
			}
		
		// listing a single object's properties
			if(0)
			{
				Output.list(dom.selection[0]);
			}
			
	// --------------------------------------------------------------------------------
	// Inspect items
	
		// an Array in hierchical format
			if(0)
			{
				var arr = [0,1,2,3,4, {hello:'hello'}];
				Output.inspect(arr);
			}
		
		// an Object in hierchical format
			if(0)
			{
				var obj = {a:1, b:2, c:[0,1,2,3,4, {hello:'hello'}]};
				Output.inspect(obj);
			}
		
		// in a hierarchical format, adding a custom label and recursion depth
			if(0)
			{
				Output.inspect(dom.library.items, 'Library items', 3); // 2nd + arguments can go in any order
			}
	
	// --------------------------------------------------------------------------------
	// Table format (this is just a shortcut to Table.print)
	
		// Selection
			if(0)
			{
				Output.inspect(dom.selection, 5);
			}
	
		// The preset panel
			if(0)
			{
				Output.table(app.presetPanel.items);
			}
	
	// --------------------------------------------------------------------------------
	// Inspect a hierarchy of folders
	
		// hierarchically
			if(0)
			{
				Timer.start();
				Output.folder('c:/temp', 8);
				Timer.stop();
			}
		
		// Output the user folder in hierarchical format, limiting to 3 levels deep
			if(0)
			{
				Output.folder('user', 3, true)
			}
	
	// catch
		}catch(err){xjsfl.debug.error(err);}
