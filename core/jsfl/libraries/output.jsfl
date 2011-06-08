/**
 * The Output class contains a selection of methods to make it easy to output
 * data to the Flash Ooutput Panel
 * 
 * It also provides logging functionality, object introspection, and a variety
 * of printing and formatting methods
 * 
 * @author Dave Stewart
 */

//xjsfl.init(this);

Output =
{
	
	/**
	 * Shortcut to fl.trace which takes multiple arguments
	 */
	trace:function()
	{
		var values = Array.slice.call(this, arguments).join(', ')
		fl.trace(values);
	},
	
	/**
	 * Print the content to the listener as a formatted list
	 * @param	content		The content to be output
	 * @param	title		The title of the print
	 * @param	output		An optional Boolean specifying whether to print to the Output Panel, defualts to true
	 * @return	The String result of the print
	 */
	print:function(content, title, output)
	{
		// variables
			output		= output == undefined ? true : false;
			var result	= '';
			result		+= '\n\t' +title + '\n\t--------------------------------------------------------------------------\n';
			result		+= '\t' + String(content).replace(/\n/g, '\n\t') + '\n';
			
		// trace
			if (output)
			{
				Output.trace(result);
			}
			
		// return
			return result;
	},
	
	list:function(arrIn, property, label, output)
	{
		// variables
			property	= property || 'name';
			label		= label || 'List'
			
		// parse
			var arrOut = [];
			for(var i = 0; i < arrIn.length; i++)
			{
				arrOut[i] = arrIn[i][property];
			}
			
		// trace
			return Output.inspect(arrOut, label, 1, output)
	},
	
	/**
	 * Output object in hierarchical format
	 * @param obj		Object	Any Object
	 * @param label		String	If an optional is passed, the result will immediately be printed to the Output panel
	 * @param maxDepth	uint	An optional uint specifying a max depth to recurse to. Needed to limit recursive objects
	 */
	inspect:function(obj, label, maxDepth, print)
	{
			
		// ---------------------------------------------------------------------------------------------------------------------
		// methods
		
			// -------------------------------------------------------------------------------------------------------
			// traversal functions
			
				function processValue(obj)
				{
					// get type
						var type = getType(obj);
						
					// compound
						if (type === 'object')
						{
							processObject(obj);
						}
						else if (type === 'array')
						{
							processArray(obj);
						}

					// simple
						else
						{
							output(getValue(obj));
						}
				}
				
				function processLeaf(value, key)
				{
					// variables
						key = key !== undefined ? key :  null;
				
					// quit if max depth reached
						if (indent.length > maxDepth)
						{
							return false;
						}
						
					// get type
						var type		= getType(value[key]);
						
						//trace(value + ':' + type)
						
					// if compound, recurse
						if (type === 'object' || type === 'array')
						{
							if(checkRecursion())
							{
								stats.objects++;
								var className = getType(value[key], true);
								output("[" + key + "] => " +className);
								type == 'object' ? processObject(value[key]) : processArray(value[key]);
							}
							else
							{
								output(' ' + key + ": [ RECURSION! ]");
							}
						}
						
					// if simple, output
						else
						{
							stats.values++;
							output(' ' + key + ": " + getValue(value[key]));
						}
						
					// return
						return true;
				}
				
				function processObject(obj)
				{
					down(obj);
					for (var key in obj)
					{
						//fl.trace('~' + key)
						if( ! key.match(rxIllegal))// && obj.hasOwnProperty(i)
						{
							processLeaf(obj, key);
						}
						else
						{
							output(' ' + key + ": [ TRANSIENT! ]");
						}
					}
					up();
				}
					
				function processArray(arr)
				{
					down(arr);
					for (var i = 0; i < arr.length; i++)
					{
						processLeaf(arr, i);
					}
					up();
				}
					
				
			// -------------------------------------------------------------------------------------------------------
			// output functions
				
				function output(str)
				{
					var output = indent.join('') + str
					strOutput += output + '\n';
				}
				
				function down(obj)
				{
					stack.push(obj);
					indent.push('\t');
					//fl.trace('\n>>>>>' + stack.length + '\n')
				}
				
				function up()
				{
					stack.pop();
					indent.pop();
					//fl.trace('\n>>>>>' + stack.length + '\n')
				}
				
				
			// -------------------------------------------------------------------------------------------------------
			// utility functions
			
				function checkRecursion()
				{
					for (var i = 0; i < stack.length - 1; i++)
					{
						for (var j = i + 1; j < stack.length; j++)
						{
							if(stack[i] === stack[j])
							{
								return false;
							}
						}
					}
					return true;
				}
				
			// -------------------------------------------------------------------------------------------------------
			// inspector functions
				
				/**
				 * Get the type of an object
				 * @param	value			mixed		Any value or object
				 * @param	getClassName	boolean		return the class name rather than the type if possible
				 * @returns	The type of classname of a value
				 */
				function getType(value, getClassName) 
				{
					var type		= typeof value;
					var className	= type.substr(0,1).toUpperCase() + type.substr(1);
					
					//fl.trace('type:' + type)
					//fl.trace('value:' + value)
					
					switch(type)
					{
						
						case 'object':
							if(value == null)
							{
								type		= 'null';
								className	= '';
							}
							/*
							else if (value.toString() == '[object Parameter]')
							{
								type = 'Parameter';
							}
							else if (/^(\[object Parameter\],?){1,}$/im.test(value))
							{
								type = 'Object';
							}
							*/
							else if (value instanceof Array)
							{
								type		= 'array';
								className	= 'Array';
							}
							else if (value instanceof Date)
							{
								type		= 'date';
								className	= 'Date';
							}
							/*
							else if(value.constructor)
							{
								fl.trace(value.toSource())
								type		= 'class';
								className	= String(value.constructor).match(/function (\w+)/)[1];
							}
							*/
							else
							{
								var matches = String(value).match(/^\[(object|class) ([_\w]+)/);
								//type		= matches[1];
								className	= matches ? matches[2] : 'Unknown';
							}
						break;
						
						case 'undefined':
							className = '';
						break;
					
						case 'xml':
							className = 'XML';
						break;
					
						case 'function': // loop through properties to see if it's a class
							for(var i in value)
							{
								if(i != 'prototype')
								{
									type = 'object';
									className = 'Class';
									break;
								}
							}
						break;
					
						case 'string':
						case 'boolean':
						case 'number':
						default:
						//fl.trace('--' + value)
					}
					return getClassName ? className : type;
				}
				
				function getValue(obj) 
				{
					var value;
					var type	 = getType(obj);
					switch(type)
					{
						case 'array':
						case 'object':
							value = obj;
						break;
						
						case 'string':
							value = '"' + obj.replace(/"/g, '\"') + '"';
						break;
						
						case 'xml':
							var ind = indent.join('\t').replace('\t', '')
							value = obj.toXMLString();
							value = value.replace(/ {2}/g, '\t').replace(/^/gm, ind).replace(/^\s*/, '');
						break;
						/*
						*/
						case 'function':
							obj = obj.toString();
							value = obj.substr(0, obj.indexOf('{'));
						break;
					
						case 'boolean':
						case 'undefined':
						case 'number':
						case 'null':
						case 'undefined':
						default:
							value = String(obj);
					}
					return value;
				}
				
	
		// ---------------------------------------------------------------------------------------------------------------------
		// constructor
		
			/**
			 * Output object in hierarchical format
			 * @param obj		Object	Any Object
			 * @param label		String	An optional String labal, which will result in the output being immediately be printed to the Output panel
			 * @param maxDepth	uint	An optional uint specifying a max depth to recurse to (needed to limit recursive objects)
			 */
			
			// reset
				label				= label || null;
				maxDepth			= maxDepth < 0 ? 100 : maxDepth || 4;
				print				= typeof print == 'undefined' ? 2 : print;
				
			// recursion detection
				var stack			= [];
				
			// uncallable properties
				var illegal			= [
										'tools|toolObjs|activeTool', // window
										'morphShape|hintsList|actionScriptOffsets', // shape?
										'brightness|tintColor|tintPercent', // SymbolInstance
										]
			
			// init
				var rxIllegal		= new RegExp('\b' + illegal.join('|') + '\b');
				var indent			= [];
				var strOutput		= '';
				var type			= getType(obj);
				var className		= getType(obj, true);
				
			// reset stats
				var stats			= {objects:0, values:0, time:new Date};
				
			// initial outout
				if(type == 'object' || type == 'array')
				{
					output( type + ' => ' + className);
				}
				
			// process
				processValue(obj);
				
			// stats
				stats.time			= (((new Date) - stats.time) / 1000).toFixed(1) + ' seconds';
				
			// output
				if(print == 0 || print == false)
				{
					// do nothing
				}
				else if(print == 1)
				{
					Output.print('objects:  ' +stats.objects+ '\nvalues: ' +stats.values + '\ntime:   ' + stats.time, 'Inspect: ' + (label || className));
				}
				else
				{
					Output.print(strOutput, 'Inspect: ' + (label || className) + ' (objects:' +stats.objects+ ', values:' +stats.values+ ', time:' +stats.time+')');
				}
				
			// return
				return strOutput;
			
	},
	
		
	/**
	 * Trace hierarchy function... utility for Filesystem?
	 */
	traceHierarchy:function(rootElement)
	{
		//var values = Array.slice.call(this, arguments).join(', ')
		//fl.trace(values);
	},
	
	toString:function()
	{
		return '[class Output]';
	}
	
}

	
// ---------------------------------------------------------------------------------------------------------------------
// register class with xjsfl
	
	xjsfl.classes.register('Output', Output);

	//Output.inspect(window.app.presetPanel, null, 4);



// ---------------------------------------------------------------------------------------------------------------------
// code
	
	if(false)
	{
		
		
		xjsfl.classes.restore('Folder', this)
		
		Output.inspect(<xml>This is a <a>node</a></xml>, 'Window', 5, 2);
	
		
		var folder = new Folder('c:/temp/fiaw');
		
		Output.inspect(folder, null, 3, 1);
		
		
		//Output.inspect(folder, 'Folder');
		
		fl.trace(folder)
		/*

		*/
	
		fl.outputPanel.clear()
		var obj = {a:1, b:2, c:[0,1,2,3,4, {hello:'hello'}]}
		
		//var selection = fl.getDocumentDOM().selection;
		//Output.inspect(selection[0], 'Symbol Instance');
		
		Output.inspect(obj, 'Some Array');
	
	}

