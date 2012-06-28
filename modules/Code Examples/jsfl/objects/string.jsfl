

var str = 'I am "{name}" and I like "{thing.a}". My name, "{name}" is nothing to do with "{stuff}" or "{thing.a}"';
var obj	= {name:'one', thing:{a:'two', b:'three'}, stuff:'four'}



trace(str.inject(['one', 'two', 'three', 'four']))
trace(str.inject('one', 'two', 'three', 'four'))
trace(str.inject(obj))
trace(str.inject('one'))

/*


var str = 'I am "{name}" and I like "{thing.a}". My name, "{name}" is nothing to do with "{stuff}" or "{thing.a}"';
var obj	= {name:'one', thing:{a:'two', b:'three'}, stuff:'four'}

format(str, ['one', 'two', 'three', 'four']);
format(str, 'one', 'two', 'three', 'four');
format(str, obj);

*/
