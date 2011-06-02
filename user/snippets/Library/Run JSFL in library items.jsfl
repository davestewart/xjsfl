
	var dom				= fl.getDocumentDOM();
	var lib				= dom.library;
	var trace			= fl.trace;
	
	
	var sel				= dom.library.getSelectedItems();
	var jsfl			= <jsfl><![CDATA[
			 
		fl.getDocumentDOM().selectAll();
		fl.getDocumentDOM().setFillColor('#4e4e3e');
		fl.getDocumentDOM().selectNone();
	
	]]></jsfl>
	
	function initCommands()
	{
		for(var i = 0; i < sel.length; i++)
		{
			lib.editItem(sel[i].name)
			eval(jsfl)
		}
	}
	
	init()
