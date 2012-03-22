if(window.xjsfl && xjsfl.uri)
{
	var uri = xjsfl.uri + 'core/temp/xjsfl.log';
	var contents = FLfile.read(uri);
	//fl.outputPanel.clear()
	fl.trace(contents.replace(/\r/g, ''));
}
