document.addDataToDocument('animation', 'string', 'xjsfl.init(this);dom.selectAll();')


fl.addEventListener("documentOpened", checkAnimationData);

function checkAnimationData()
{
	var dom = fl.getDocumentDOM();
	var name = 'animation';
	
	if(dom.documentHasData(name))
	{
		if(confirm('The document has animation data. Do you want to animate now?'))
		{
			var data = document.getDataFromDocument(name);
			eval(data)
		}
	}
}

