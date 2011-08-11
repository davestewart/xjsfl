// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                              
//  ██                                  
//  ██     █████ ██ ██ ████ █████ █████ 
//  ██████ ██ ██ ██ ██ ██   ██    ██ ██ 
//      ██ ██ ██ ██ ██ ██   ██    █████ 
//      ██ ██ ██ ██ ██ ██   ██    ██    
//  ██████ █████ █████ ██   █████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Source - examine and manipulate source code

	// ------------------------------------------------------------------------------------------------------------------------
	// Source

		Source =
		{
			parseDocComment:function(source)
			{
				// derive content
				
					// file
						if(source instanceof File)
						{
							source = source.contents;
						}
					// uri
						else if(typeof source == 'string' && source.indexOf('file:') == 0)
						{
							source = new File(source).contents;
						}
				
				// grab comment
					var comments	= source.match(/\/\*(?:(?!\*\/|\/\*)[\s\S])*(?:\/\*(?:(?!\*\/|\/\*)[\s\S])*\*\/(?:(?!\*\/|\/\*)[\s\S])*)*[\s\S]*?\*\//);
					
				// parse comment
					if(comments)
					{
						// property object
							var obj = {};
							
						// intro text
						
						
						// params
							var desc	= comments[0].match(/@(\w+)\s+([^\r\n]+)/);
							if(desc == null)
							{
								var desc	= comments[0].match(/\* (\w[^\r\n]+)/);
							}
							var icon	= comments[0].match(/@icon\s+([^\r\n]+)/);
							
							if(icon)
							{
								//item.@icon = icon[1];
							}
							if(desc)
							{
								//item.@desc = desc[1].replace(/"/g, '\"');
							}
							
						// return
							return obj;
					}
					
				// return
					return null;
			},
			
			parseFunction:function(fn)
			{
				var matches = fn.toSource().match(/function (\w+)\(([^\)]*)\)/);
				if(matches && matches[2])
				{
					var params = matches[2].match(/(\w+)/g);
					return {name:matches[1], params:params};
				}
				return {name:null, params:[]};
			}
		
		}
		
	// register class
		xjsfl.classes.register('Source', Source);
		
		

		