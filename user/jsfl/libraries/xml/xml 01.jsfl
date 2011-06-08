trace = fl.trace;
var node = new XML('<root a="hello" ><a>A</a><b>B</b></root>');

trace('>' + node.children().length());
trace(node.toXMLString())
trace(node.@a)