xjsfl.init(this);

var uri		= xjsfl.utils.makeURI('modules/Dev/jsfl/libraries/xul/test')
var folder	= new Folder(uri);
var files	= folder.contents;
var uris	= xjsfl.utils.collect(files, 'uri')

//Output.inspect(uris)

for each(var uri in uris)
{
	if(uri.indexOf('.xml') != -1)
	{
		var result = fl.getDocumentDOM().xmlPanel(uri);
		Output.inspect(result, uri)
	}
}
