xjsfl.init(this);
clear();

function process(element, index, elements)
{
	trace('>' + element.shortName.toCamelCase(true))
}


var collection = $$(':selected');
trace(collection);

collection.each(process)