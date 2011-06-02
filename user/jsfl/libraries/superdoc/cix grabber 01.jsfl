xjsfl.init(this);
clear();


var cix = 'file:///F|/Users/Dave%20Stewart/AppData/Local/ActiveState/KomodoEdit/6.1/apicatalogs/jsfl.cix';


var str = xjsfl.file.load(cix).replace('<?xml version="1.0" encoding="UTF-8"?>', '');

//var xxml = new XML();
					 
//trace(doc.children().length())
var xml = eval(str)


var doc			= xml..scope.(@name == 'Document');
var children	= doc.children();
for each(var child in children)
{
	trace(child.@name)
}


