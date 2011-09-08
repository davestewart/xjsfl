// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code

	// initialize
		xjsfl.init(this);
		clear();
		try
		{

	// --------------------------------------------------------------------------------
	// Ecode and decode a URL
	
		if(0)
		{
			var encoded = Base64.encode(fl.scriptURI)
			fl.trace(encoded)
			fl.trace(Base64.decode(encoded))
		}
	
	
	// catch
		}catch(err){xjsfl.output.debug(err);}

