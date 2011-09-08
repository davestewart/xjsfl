// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.init(this);
		clear();
		try
		{
			
		var data =
		{
			a:1,
			b:'Hello',
			c:true,
			d:new Date(),
			e:[1,2,3],
			f:undefined,
			g:null
		}
		
	// --------------------------------------------------------------------------------
	// serialize the data
	
		if(1)
		{
			var xml = JSFLInterface.serialize(data);
			trace(new XML(xml).toXMLString())
		}
	

		
	// catch
		}catch(err){xjsfl.output.debug(err);}
