package com.xjsfl.utils.debugging 
{
	import com.xjsfl.utils.debugging.Output;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Debug
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			protected static var maxDepth		:int		= 5;
			protected static var indent			:Array		= [];
			protected static var strOutput		:String		= '';
		
		// ---------------------------------------------------------------------------------------------------------------------
		// constructor
		
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 * Output object in hierarchical format
			 * @param obj		Object	Any Object
			 * @param label		String	An optional String labal, which will result in the output being immediately be printed to the Output panel
			 * @param maxDepth	uint	An optional uint specifying a max depth to recurse to (needed to limit recursive objects)
			 */
			public static function process(obj:Object, label:String = null, maxDepth:uint = 5):String
			{
				// reset
					Debug.maxDepth	= maxDepth;
					Debug.strOutput	= '';
					Debug.indent	= [];
				
				// init
					var type:String	= getType(obj);
					strOutput		= (type == 'Object' || type == 'Array') ? type + ' => \n' : '';
					
				// initialize
					processValue(obj);
					
				// return
					if(label != null)
					{
						Output.print(strOutput, 'Debug: ' + label);
					}
					return strOutput;
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			// -------------------------------------------------------------------------------------------------------
			// traversal functions
			
				protected static function processValue(obj:*):void
				{
					// get type
						var type:String = getType(obj);
						
					// compound
						if (type == 'Object')
						{
							processObject(obj);
						}
						else if (type == 'Array')
						{
							processArray(obj);
						}
					// simple
						else
						{
							output(getValue(obj));
						}
				}
				
				protected static function processLeaf(value:*, key:* = null):Boolean
				{
					// quit if max depth reached
						if (indent.length > maxDepth)
						{
							return false;
						}
						
					// get type
						var type:String = getType(value[key]);
						
					// if compound, recurse
						if (type == 'Object' || type == 'Array')
						{
							output("[" + key + "] => " +type);
							type == 'Object' ? processObject(value[key]) : processArray(value[key]);
						}
						
					// if simple, output
						else
						{
							output(' ' + key + ": " + getValue(value[key]));
						}
						
					// return
						return true;
				}
				
				protected static function processObject(obj:Object):void
				{
					// remember to reverse object when in plain JavaScript!

					// process object
						down();
						for (var i:String in obj)
						{
							processLeaf(obj, i);
						}
						up();
				}
					
				protected static function processArray(arr:Array):void
				{
					down();
					for (var i:int = 0; i < arr.length; i++)
					{
						processLeaf(arr, i);
					}
					up();
				}
					
				
				
			// -------------------------------------------------------------------------------------------------------
			// output functions
				
				protected static function output(str:String):void
				{
					strOutput += indent.join('') + str + '\n';
				}
				
				protected static function down():void
				{
					indent.push('\t');
				}
				
				protected static function up():void
				{
					indent.pop();
				}
				
				
			// -------------------------------------------------------------------------------------------------------
			// inspector functions
				
				protected static function getType(value:*):String 
				{
					var type:String = typeof value;
					switch(type)
					{
						case 'object':
							if(value == null)
							{
								type = 'null';
							}
							else if (value is Array)
							{
								type = 'Array';
							}
							else if (value is Date)
							{
								type = 'Date';
							}
							else
							{
								var matches:Array = String(value).match(/^\[object (\w+)/);
								type = matches ? matches[1] : 'unknown';
							}
						break;
						
						case 'xml':
						case 'string':
						case 'boolean':
						case 'undefined':
						case 'number':
						default:
					}
					return type;
				}
				
				protected static function getValue(obj:*):* 
				{
					var value	:*;
					var type	:String = getType(obj);
					switch(type)
					{
						case 'Array':
						case 'Object':
							value = obj;
						break;
						
						case 'string':
							value = '"' + obj.replace(/"/g, '\"') + '"';
						break;
						
						case 'xml':
							value = (obj as XML).toXMLString();
						break;
						
						case 'Date':
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
				


	}

}
