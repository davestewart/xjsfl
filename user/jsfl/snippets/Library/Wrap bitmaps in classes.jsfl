xjsfl.init(this);
clear();

function process(element, index, elements)
{
	trace('>' + element.shortName.toCamelCase(true))
}

trace('Sorry - this snippet is not yet implimented!');

var collection = $$(':selected');
trace(collection);

collection.each(process)