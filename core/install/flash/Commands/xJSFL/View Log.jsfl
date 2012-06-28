if(window.xjsfl && xjsfl.uri)
{
	var contents = FLfile.read(xjsfl.uri + 'core/logs/main.txt');
	fl.trace(contents.replace(/\r/g, ''));
}
