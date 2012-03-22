if(window.xjsfl && xjsfl.uri)
{
	xjsfl.init(this);
	XUL.create('title:Open Folder,radio:Folder={Flash:/,Flash/Commands:commands,Flash/WindowSWF:WindowSWF,xJSFL:xjsfl,xJSFL/User:xjsfl/user,xJSFL/Modules:xjsfl/modules}', function(folder) { new xjsfl.classes.cache.Folder(folder.indexOf('xjsfl') != -1 ? folder.replace('xjsfl', xjsfl.uri) : fl.configURI + folder).open(); }  )
}
