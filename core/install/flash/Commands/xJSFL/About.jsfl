if(window.xjsfl && xjsfl.uri)
{
	xjsfl.init(this);
	if( ! $dom )
	{
		fl.createDocument();
	}
	fl.xmlPanel(xjsfl.uri + 'core/ui/about.xul');	
}
