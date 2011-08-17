// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██                ██   
//  ██  ██        ██                ██   
//  ██  ██ ██ ██ █████ █████ ██ ██ █████ 
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██  ██ ██ ██  ██   ██ ██ ██ ██  ██   
//  ██████ █████  ████ █████ █████  ████ 
//                     ██                
//                     ██                
//
// ------------------------------------------------------------------------------------------------------------------------
// Output - provides logging functionality, object introspection, and a variety of printing and formatting methods

	
	/**
	 * Provides logging functionality, object introspection, and a variety of printing and formatting methods
	 */
	Output =
	{
		
		/**
		 * Converts a typical [object Object] string into an [object Class value="1" property="2"] string
		 * Should only be used on JavaScript Objects that already convert properly to String
		 * @param	obj		{Object}	Any object that can be converted to a String
		 * @param	output	{Boolean}	An optional Boolean idicating to output the result to the Output panel
		 * @returns			{String}	A String representation of the object and its properties
		 */
		props:function(obj, output)
		{
			// variables
				var props	= '';
				var str		= String(obj);
				
			// propertes
				for(var i in obj)
				{
					var value = obj[i];
					if(typeof value === 'function')
					{
						continue;
					}
					if(typeof value === 'string')
					{
						value = '"' +value+ '"';
					}
					props += ' ' + i + '=' + value;
				}
				
			// str
				str = str.replace(']', props + ']')
				
			// output
				if(output)
				{
					fl.trace(str);
				}
				
			// return
				return str;
		},
		
		/**
		 * Lists the properties of an object in a human-readable format
		 * @param arr			{Object}	An object whose properties you wish to list
		 * @param arr			{Array}		An Array of objects with selected properties you wish to list
		 * @param properties	{String}	An optional property to list, defaults to 'name'
		 * @param properties	{Array}		An optional Array of properties
		 * @param label			{String}	An optional String label, defaults to "List"
		 * @param output		{Boolean}	An optional boolean to indicate output type: true=debug, false=return, undefined=output
		 * @returns				{String}	A String list of the object's properties
		 */
		list:function(arr, properties, label, output)
		{
			// catch null values
				if( ! arr)
				{
					throw new ReferenceError('ReferenceError: Output.list(): parameter "arr" is undefined');
				}
				
			// defaults
				label			= label || 'List';
				properties		= properties || 'name';
				
			// variables
				var strOutput	= '';
				
			// if arr is an array, grab selected properties
				if(arr instanceof Array)
				{
					// collect object to string only
						if(properties == null)
						{
							arr			= arr.map(function(e){return String(e)});
						}
					// collect children's properties
						else
						{
							arr			= xjsfl.utils.getValues(arr, properties);
						}
						
					// trace
						strOutput = Output.inspect(arr, label, properties instanceof Array ? 2 : 1, output);
				}
				
			// if arr is an object, just output the top-level key/values
				else
				{
					 strOutput = Output.inspect(arr, label, 1, output, {'function':false});
				}
				
			// output
				return strOutput;
		},
		
		/**
		 * Output object in hierarchical format
		 * @param obj		{Object}		Any Object or value
		 * @param arg		{String}		An optional String label (defaults to "Inspect")
		 * @param arg		{Number}		An optional max depth to recurse to (defaults to 3)
		 * @param arg		{Boolean}		An optional boolean to indicate output type: true=debug, false=return, undefined=output
		 * @param arg		{Object}		An optional filter object to tell the outputter what to print, ie {'function':false, 'xml':false}. Allowed types: ['object', 'string', 'array', 'number', 'xml', 'object', 'boolean', 'function', 'undefined', 'null']
		 * @param arg		{Function}		An optional output function in case you want to do any custom processing of the data
		 * @returns			{String}		A String hierarchy of the object's properties
		 */
		inspect:function(obj, arg2, arg3, arg4, arg5)
		{
			//TODO Add option to skip underscore properties. If signature gets complex, use an {options} object
			//TODO Maybe just have an include object, which could be like {underscores:false, functions:false,strings:false}
			//TODO Refactor all iteration to the Data class
			//TODO For callback / debug, output to file in two separate passes - 1:key, 2:value, that way you get to see the actual key name who's value breaks the iteration
			//TODO Refactor {filter} argument to an {options} object so many parameters can be passed in
			
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
						// quit if max depth reached
							if (indent.length > maxDepth)
							{
								return false;
							}
							
						// skip prototypes (seems to cause silent errors. Not sure if this is an issue with prototypes, or just some classes)
							// trace(key);
							if(key == 'prototype')
							{
								//return false;
							}
							
						// variables
							key = key !== undefined ? key :  null;
					
						// get type
							var type		= getType(value[key]);
							
						// skip if filter is set to false
							//trace(value + ':' + type)
							if(filter[type] === false)
							{
								return false;
							}
							
						// if compound, recurse
							if (type === 'object' || type === 'array')
							{
								// TODO Check if we need the compound recursion check, and if a stack.indexOf(value[key]) would suffice
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
								output(' ' + key + ": [ SKIPPING! ]");
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
						// get output
							var output = indent.join('') + str
							strOutput += output + '\n';
							
						// if callback, call it
							if(callback)
							{
								callback(output);
							}
							
						// if debugging, output immediately
							if(debug)
							{
								trace('	' + output);
							}
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
								else if (value instanceof Array && value.constructor == Array)
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
			// setup
			
				/**
				 * Output object in hierarchical format
				 * @param obj		Object	Any Object
				 * @param label		String	An optional String labal, which will result in the output being immediately be printed to the Output panel
				 * @param maxDepth	uint	An optional uint specifying a max depth to recurse to (needed to limit recursive objects)
				 */
				
				// defaults
					var label		= 'Inspect';
					var maxDepth	= 4;
					var print		= null;
					var debug		= false;
					var print		= true;
					var callback	= null;
					var filter		= {};
					
				// parameter shifting
					for each(var arg in [arg2, arg3, arg4])
					{
						if(typeof arg === 'number')
							maxDepth = arg;
						else if(typeof arg === 'string')
							label = arg;
						else if(typeof arg === 'boolean')
						{
							if(arg === true)
								debug = true;
							else
								print = false;
						}
						else if(typeof arg === 'object')
							filter = arg;
						else if(typeof arg === 'function')
							callback = arg;
					}
					
				// recursion detection
					var stack			= [];
					
				// uncallable properties
					var illegal			= [
											'constructor', // class
											'tools|toolObjs|activeTool', // window
											'morphShape|hintsList|actionScriptOffsets', // shape
											'brightness|tintColor|tintPercent', // SymbolInstance
											]
				
				// init
					var rxIllegal		= new RegExp('^' + illegal.join('|') + '$');
					var indent			= [];
					var strOutput		= '';
					var type			= getType(obj);
					var className		= getType(obj, true);
					
				// reset stats
					var stats			= {objects:0, values:0, time:new Date};
					
			// ---------------------------------------------------------------------------------------------------------------------
			// output
			
				// if debug, start tracing now, as subsequent output will be traced directly to the listener
					if(debug === true)
					{
						if(label == 'Inspect')
						{
							label = 'Debug';
						}
						trace(Output._print('', label + ': ' + className, false).replace(/\s*$/, ''))
					}
					
				// initial outout
					if(type == 'object' || type == 'array')
					{
						output( type + ' => ' + className);
					}
					
				// process
					processValue(obj);
					
				// get final stats
					stats.time			= (((new Date) - stats.time) / 1000).toFixed(1) + ' seconds';
					stats				= ' (depth:' +maxDepth+ ', objects:' +stats.objects+ ', values:' +stats.values+ ', time:' +stats.time+')';
					
				// output
					if(debug === true)
					{
						trace('\n' + stats + '\n');
					}
					else if(print === true)
					{
						Output._print(strOutput, label + ': ' + className + stats);
					}
					
				// return
					return strOutput;
				
		},
		
		/**
		 * Convenience function to Table.print() to output value in tabular format
		 * @param	arr		{array}		An Array of values
		 * @returns			{String}	The output of the print() call
		 */
		table:function(arr)
		{
			return Table.print(arr);
		},		
			
		/**
		 * View the hierarchy of a folder
		 * @param value		{String}		A valid folder path
		 * @param value		{Folder}		An existing folder object
		 * @param depth		{Number}		An optional max depth to recurse to (defaults to 3)
		 * @param output	{Boolean}		An optional boolean to indicate outputting or not (defaults to true)
		 * @returns			{String}		The String hierarchy of the folder
		 */
		folder:function(folder, depth, output)
		{
			//BUG Errors when file URIs go beyond 260 chars. @see FileSystem for more info
			
			// output
				var _output = '';
				
			// callback
				function callback(element, index, level, indent)
				{
					_output += indent + '/' +  element.name + '\n';
					return element.uri.length < 250;
				}
			
			// process
				var files = Data.recurseFolder(folder, callback, depth);
				
			// print
				if(output !== false)
				{
					trace(_output);
				}
				
			// return
				return _output;
		},
		
		/**
		 * Print the content to the listener as a formatted list. Normally this is only called by the other Output functions!
		 * @param	content		The content to be output
		 * @param	title		The title of the print
		 * @param	output		An optional Boolean specifying whether to print to the Output Panel, defualts to true
		 * @return	The String result of the print
		 */
		_print:function(content, title, output)
		{
			// variables
				output		= output !== false;
				var result	= '';
				var border	= new Array(Math.max(title.length, 80) + 1).join('-');
				result		+= '\n' +title + '\n' +border+ '\n';
				result		+= '' + String(content);
				//result		= result.replace(/\n/g, '\n\t');
				
			// trace
				if (output)
				{
					fl.trace(result);
				}
				
			// return
				return result;
		},
		
		toString:function()
		{
			return '[class Output]';
		}
		
	}
	
		
	// ---------------------------------------------------------------------------------------------------------------------
	// register class with xjsfl
		
		xjsfl.classes.register('Output', Output);

	
// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code
	
	if( ! xjsfl.loading )
	{
		// initialize
			xjsfl.reload(this);
			clear();
			try
			{
		
		// --------------------------------------------------------------------------------
		// Get properties of items
		
			// straight list, defaulting to the property "name"
				if(0)
				{
					var obj = {a:null, b:1, c:'Hello'};
					trace(Output.props(obj));
				}
				
		// --------------------------------------------------------------------------------
		// List items
		
			// straight list, defaulting to the property "name"
				if(0)
				{
					Output.list(dom.selection);
				}
				
			// using a custom property
				if(0)
				{
					Output.list(dom.library.items, 'itemType');
				}
				
			// supplying several properties
				if(0)
				{
					Output.list(dom.library.items, ['name', 'timeline', 'itemType']);
				}
			
			// listing a single object's properties
				if(0)
				{
					Output.list(dom.selection[0]);
				}
				
		// --------------------------------------------------------------------------------
		// Inspect items
		
			// an Array in hierchical format
				if(0)
				{
					var arr = [0,1,2,3,4, {hello:'hello'}];
					Output.inspect(arr);
				}
			
			// an Object in hierchical format
				if(0)
				{
					var obj = {a:1, b:2, c:[0,1,2,3,4, {hello:'hello'}]};
					Output.inspect(obj);
				}
			
			// in a hierarchical format, adding a custom label and recursion depth
				if(0)
				{
					Output.inspect(dom.library.items, 'Library items', 3); // 2nd + arguments can go in any order
				}
		
		// --------------------------------------------------------------------------------
		// Table format (this is just a shortcut to Table.print)
		
			// Selection
				if(0)
				{
					Output.inspect(dom.selection, 5);
				}
		
			// The preset panel
				if(0)
				{
					Output.table(app.presetPanel.items);
				}
		
		// --------------------------------------------------------------------------------
		// Inspect a hierarchy of folders
		
			// hierarchically
				if(0)
				{
					Timer.start();
					Output.folder('c:/temp', 8);
					Timer.stop();
				}
			
			// Output the user folder in hierarchical format, limiting to 3 levels deep
				if(0)
				{
					Output.folder('user', 3, true)
				}
		
		// catch
			}catch(err){xjsfl.output.debug(err);}
	}
		

