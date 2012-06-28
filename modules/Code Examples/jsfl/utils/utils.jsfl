// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * filename examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();
	
	// ----------------------------------------------------------------------------------------------------
	// Helper methods
	
	// ----------------------------------------------------------------------------------------------------
	// variables
	
		
	// ----------------------------------------------------------------------------------------------------
	// Code methods
	
		/**
		 * Compare typeof against Utils.isObject
		 */
		function isObject()
		{
			var data = [];
			var values =
			{
				'undefined': undefined,
				'null':      null,
				'number':    1,
				'boolean':   true,
				'string':   'hello',
				'array':    [1, 2, 3],
				'object':   {a:1, b:2, c:3},
				'date':     new Date(),
				'template': new Template()	
			};
			
			for(var name in values)
			{
				data.push({name:name, 'typeof':typeof values[name], 'isObject':Utils.isObject(values[name])});
			}
			
			Table.print(data);
		}
		
		/**
		 * Get the keys of a single object
		 */
		function getKeysObject()
		{
			if(UI.items)Utils.getKeys($library.items[0]);
		}
		
		/**
		 * Get the unique keys of an array of objects object
		 */
		function getKeysArray()
		{
			if(UI.items)Utils.getKeys($library.items);
		}
		
		
		/**
		 * Clone an object
		 */
		function clone()
		{
			var obj1 = {a:1, b:2, c:3};
			var obj2 = obj1
			var obj3 = Utils.clone(obj1);
			
			obj1.a = 100;
			
			inspect([obj1, obj2, obj3])
		}
		
		/**
		 * Extend an Object with new values
		 */
		function extendObject()
		{
			Utils.extend({a:1, b:2, c:3}, {d:4, e:5, f:6});
		}
		
		/**
		 * Extend an Array with new values
		 */
		function extendArray()
		{
			Utils.extend([1,2,3], [4,5,6]);
		}
		
		/**
		 * Combines keys and values to make a new populated Object 
		 */
		function combine()
		{
			var keys = 'one, two, three';
			var values = [1, 2, 3];
			inspect(Utils.combine(keys, values))
		}
		
		/**
		 * Creates a hash object from an array or keys or an existing object
		 */
		function makeHash()
		{
			var hash = Utils.makeHash(new LibraryItem(), null);
			inspect(hash)
		}
		
		function columnizeText()
		{

			clear();
			
			var xml = <xml>
				a	a	a
				aa	a	a
				aaa	a	a
				aaaa	a	a
				aaaaa	a	a
				aaaaaa	a	a
				aaaaaaa	a	a
				aaaaaaaa	a	a
				aaaaaaaaa	a	a
			</xml>
			
			var lines = String(xml).trim().split(/[\r\n]+/);
			for (var i = 1; i < lines.length; i++)
			{
				var str = lines.slice(0, i).join('\n');
				trace(Utils.columnizeText(str));
				trace('');
			}
		}