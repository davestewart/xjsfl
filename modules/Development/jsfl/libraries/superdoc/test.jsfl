xjsfl.init(this);

clear();

var name = 'hello';
//Superdoc.appearance.properties.width = 40;
var signature	= 'addNewPrimitiveRectangle( boundingRectangle, roundness, [, bSuppressFill [, bSuppressStroke ]] )';
var signature	= 'addNewPrimitiveRectangle()';

var matches		= signature.match(/\w+\s*\((.*)\)/);
var params		= matches[1].match(/\w+/g);
signature		= name + '(' + (params || []).join(', ') + ')';

/*
var matches	= str.match(/\w+\s*\((.*)\)/)
var params	= matches[1].match(/\w+/g);
*/
Output.inspect(params)
trace(signature);