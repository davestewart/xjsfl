
var collection = $$(':bitmap')

var items = Selectors.select(':bitmap', $library.items, $library);

trace('>' + items)

Selectors.item.find.children()


/**
 * nth('odd')
 */
function nthOdd()
{
	
}

var arr = [1,2,3,4,5,6,7,8,9,10];
trace(arr)

var arr = [1,2,3,4,5,6,7,8,9,10];
arr = Selectors.core.find.nth(arr, 'odd');
trace(arr)

var arr = [1,2,3,4,5,6,7,8,9,10];
arr = Selectors.core.find.nth(arr, 'even');
trace(arr)

var arr = [1,2,3,4,5,6,7,8,9,10];
arr = Selectors.core.find.nth(arr, 'random');
trace(arr)

var arr = [1,2,3,4,5,6,7,8,9,10];
arr = Selectors.core.find.nth(arr, '3');
trace(arr)

var arr = [1,2,3,4,5,6,7,8,9,10];
arr = Selectors.core.find.nth(arr, '3n');
trace(arr)

var arr = [1,2,3,4,5,6,7,8,9,10];
arr = Selectors.core.find.nth(arr, '3n+1');
trace(arr)

var arr = [1,2,3,4,5,6,7,8,9,10];
arr = Selectors.core.find.nth(arr, '3n-1');
trace(arr)
