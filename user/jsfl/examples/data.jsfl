// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	// initialize
		xjsfl.reload(this);
		clear();
		try
		{

	// --------------------------------------------------------------------------------
	// Default iteration returns the array of iterated paths

		if(1)
		{
			var paths = Data.recurseFolder('c:/temp/');
			list(paths);
		}


	// --------------------------------------------------------------------------------
	// Call a callback function on each of the iterated items

		if(0)
		{
			function callback(element, index, level, indent)
			{
				trace (indent + '/' + element.name);
			}

			Data.recurseFolder('c:/temp/test/', callback);
		}

	// --------------------------------------------------------------------------------
	// Skip subfolders with the letter a in them

		if(0)
		{
			function callback(element, index, level, indent)
			{
				return element.name.indexOf('a') == -1;
			}

			var paths = Data.recurseFolder('c:/temp/test/', callback);
			trace(paths.join('\n'));
		}


	// --------------------------------------------------------------------------------
	// Test

		if(0)
		{
			// stuff
				//Data.recurse (new Folder('c:/temp/'))

				function traceElement(element, index, level)
				{
					var indent = Array(level).join('\t')
					fl.trace (indent + '/' + element.name);
				}

				function testFolder(element)
				{
					return element instanceof Folder;
				}


				Data.recurse ('c:/temp/', traceElement, testFolder)


			/*
			*/

			/*
				// object & scope example

				fl.outputPanel.clear();

				var obj =
				{
					str:'',

					arr:[1,2,3,4,[1,2,3,4,[1,2,3,4],5,6,7,8],4,5,6,7],

					traceElement:function(element, index, level)
					{
						var indent = new Array(level + 1).join('\t');
						var str = indent + level + ' : ' + element + '\n';
						this.str += str;
					},

					testElement:function(element, level, index)
					{
						return element instanceof Array;
					},

					start:function()
					{
						Data.recurse(this.arr, this.traceElement, this.testElement, this)
					}

				}

				//obj.start();
				//fl.trace(obj.str);
			*/

			/*
				// function example

				function traceElement(element, index, level)
				{
					var indent = new Array(level + 1).join('\t');
					fl.trace (indent + level + ' : ' + element);
				}

				function testElement(element, level, index)
				{
					return element instanceof Array;
				}

				fl.outputPanel.clear();

				var arr = [1,2,3,4,[1,2,3,4,[1,2,3,4],5,6,7,8],4,5,6,7];

				Data.recurse(arr, traceElement, testElement)


			*/
		}

	// catch
		}catch(err){xjsfl.debug.error(err);}
