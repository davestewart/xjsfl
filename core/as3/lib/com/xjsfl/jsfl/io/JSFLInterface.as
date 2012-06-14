package com.xjsfl.jsfl.io
{
	import adobe.utils.MMExecute;
	import flash.utils.describeType;

	/**
	 * @author Matthew Tretter
	 * @author Modified by Dave Stewart
	 * @since  2008.04.24
	 */
	public class JSFLInterface
	{
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		


		// ---------------------------------------------------------------------------------------------------------------------
		// public methods

			/**
			 * Converts a serialized String from a JSFL function into an AS object.
			 * @param str	The serialized value.
			 * @returns		The object that the provided String represents.		 		 		 		 		 		 
			 */
			public static function deserialize(str:String):*
			{
				return xmlToObject(new XML(str));
			}

			/**
			 * Serializes an object so that it can be sent to a jsfl function.
			 * @param	obj	The object to serialize.
			 * @returns		The serialized form of the provided object.		 		 		 		 		 
			 */
			public static function serialize(obj:*, json:Boolean = true):String
			{
				var result:String;

				if (obj is String)
				{
					result = '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
				}
				else if (obj === null || obj === undefined || obj is int || obj is uint || obj is Number || obj is Boolean)
				{
					result = String(obj);
				}
				else
				{
					// Object and Array are not final classes so an "is" comparison isn't enough.
					var type:String = describeType(obj).@name;
					switch (type)
					{
						case 'Array':
							var values:Array = [];
							var i:int;
							for (i = 0; i < obj.length; i++)
							{
								values.push(serialize(obj[i], json));
							}
							result = '[ ' + values.join(', ') + ' ]';
						break;
							
						case 'Object':
							var props:Array = [];
							for (var prop:String in obj)
							{
								props.push( (json ? serialize(prop, json) : prop ) + ':' + serialize(obj[prop], json));
							}
							result = '{ ' + props.join(', ') + ' }';
						break
						
						default:
							throw new Error('Objects of type ' + type + ' cannot be passed to JSFL');
					}
				}

				return result;
			}

			 /**
			  * Creates an object based on an XML description.
			  * @param	xml		The XML representation of the object, as returned by the JSFL JSFLInterface.serialize() function
			  * @return
			  */
			public static function xmlToObject(xml:XML):*
			{
				var obj:*;
				var property:XML;
				switch (xml.localName())
				{
					case 'xml':
						obj = new XML(unescapeXML(xml.toString()));
					break;
					case 'string':
						obj = xml.toString();
					break;
					case 'undefined':
						obj = undefined;
					break;
					case 'number':
						obj = Number(xml.toString());
					break;
					case 'null':
						obj = null;
					break;
					case 'true':
						obj = true;
					break;
					case 'false':
						obj = false;
					break;
					case 'date':
						obj = new Date(Number(xml.toString()));
					break;
					case 'object':
						obj = {};
						for each (property in xml.property)
						{
							obj[property.@id] = xmlToObject(property.*[0]);
						}
					break;
					case 'array':
						obj = [];
						for each (property in xml.property)
						{
							obj[property.@id] = xmlToObject(property.*[0]);
						}
					break;
				}
				return obj;
			}
			
	}
}

function unescapeXML(xml)
{
	return xml
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'");
}


