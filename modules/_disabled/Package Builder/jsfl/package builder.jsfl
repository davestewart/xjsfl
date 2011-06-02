// ------------------------------------------------------------------------------------------------------------------------------------
// framework functionality

	// functions
		function trace()
		{
			var args = Array.slice.apply(this, [arguments]);
			fl.trace(args.join(', '));
		}
		
	// include function
		function include(path, root)
		{
			var folder		= root ? FLfile.platformPathToURI(root) : fl.scriptURI.replace(/[^\/]+$/, '');
			var uri 		= folder + path;
			var contents	= FLfile.read(uri);
			eval(contents);
		}
		
		
// ------------------------------------------------------------------------------------------------------------------------------------
// setup


	// clear output panel
		//fl.outputPanel.clear();
		
	// module path
		var xjsflPath	= FLfile.uriToPlatformPath(fl.scriptURI.substr(0, fl.scriptURI.lastIndexOf('xJSFL') + 6)).replace(/\\/g, '/');
		var modulePath	= FLfile.uriToPlatformPath(fl.scriptURI.replace(/jsfl\/[^/]+$/, '')).replace(/\\/g, '/');
		
		//fl.trace(xjsflPath)
		
	// includes
		include('core/jsfl/lib/output.jsfl', xjsflPath);
		include('core/jsfl/lib/filesystem.jsfl', xjsflPath);
				

// ------------------------------------------------------------------------------------------------------------------------------------
// grab template config for classes

	// grab templates
		var configPath			= modulePath + 'config/templates.ini';
		var configSource		= new File(configPath).contents;
		var lines				= configSource.split(/[\r\n]+/g);
		
	// variables
		var config				= {};
		var matches;
		var line;
		var name;
		
	// create template hash
		for(var i = 0; i < lines.length; i++)
		{
			// line
				line	= lines[i]
							.replace(/\/\/.+$/, '')			// trim comments
							.replace(/(^\s+|\s+$)/g, '');	// trim whitespace
							
			// process if not blank
				if(line != '')
				{
					// check if block
						matches	= line.match(/\[(.+)\]/);
						
					// template
						if(matches)
						{
							name = matches[1];
							config[name] = [];
						}
						
					// class
						else if(line.substr(0, 2) != '//')
						{
							// reformat line for regular expressions
								line = line
									.replace(/\./g, '\.')		// convert . to \.
									.replace(/\*/g, '.*');		// convert * to .*
					
							// add line
								config[name].push(new RegExp(line));									
						}
					
				}
		}
		
		
// ------------------------------------------------------------------------------------------------------------------------------------
// grab templates

	var files		= new Folder(modulePath + 'config/templates/').files;
	var templates	= {};
	
	files.forEach
	(
		function(file, i)
		{
			var name		= file.name.replace(/\.\w+$/, '');
			var path		= file.path;
			templates[name]	= file.contents;
		}
	)
	
	
// ------------------------------------------------------------------------------------------------------------------------------------
// utility functions

	/**
	 * Get the qualified superclass of a className
	 * @param superClass {String}
	 */
	function getQualifiedClassName(className)
	{
		for(var i = 0; i < imports.length; i++)
		{
			var rx = new RegExp(className + '$');
			if(rx.test(imports[i]))
			{
				return imports[i];
			}
		}
		return className;
	}
	

	/**
	 * Get the source template file
	 */
	function getTemplate(props)
	{
		// debug
			//Output.inspect(props, 'props')
			//trace('Looking for template for:' + props.superClass || props.name)
			
		// templates supplied
			if(props.template)
			{
				return templates[props.template];
			}
			
		// derive template from class name
			else
			{
				// grab the correct class name to test against
					var name = props.superClass || props.name;
					
				// loop through templates and stop when class RegExp is matched
					for(var template in config)
					{
						//trace('Current template is:' + template)
						for(var i = 0; i < config[template].length; i++)
						{
							var rx = config[template][i];
							if(rx.test(name))
							{
								//trace('FOUND: ' + template);
								return templates[template];
								break;
							}
						}
					}
			}
	
		// default
			return templates['default'];
	}
	
	/**
	 * Collect named properties from object in an Array
	 * @param arrIn	{Array}		An array of Objects
	 * @param name	{String}	The name of the preopty you want to capture
	 */
	function collect(arrIn, name)
	{
		var arrOut = [];
		for(var i = 0; i < arrIn.length; i++)
		{
			arrOut.push(arrIn[i][name]);
		}
		return arrOut;
	}
	
	/**
	 * Re-capture a global-capturing regular-expression, returning a multidimensional array
	 * @param matches	{Array}		The matches from the first capture
	 * @param rx		{RegExp}	The regular expression first used in the capture	
	 */
	function recaptureMatches(matches, rx)
	{
		rx = new RegExp(rx.source);
		for(var i = 0; i < matches.length; i++)
		{
			var m = matches[i].match(rx).slice(1);
			matches[i] = m.length == 1 ? m[0] : m;
		}
		return matches;
	}

// -----------------------------------------------------------------------------------------
// Objects

	function PropsItem(matches, stack)
	{
		// variables
			this.level			= matches[1].length + 1;
			this.name			= matches[2];
			
		// superClass
			var mSuperClass		= matches[3].match(/:([\w.~]+)/);
		
		// implements
			var mImplements		= matches[3].match(/\/([\w, ]+)/);
		
		// template
			var mTemplate		= matches[3].match(/=(\w+)/);
		
			this.superClass		= mSuperClass ? mSuperClass[1] : null;
			this.implements		= mImplements ? mImplements[1] : null
			this.template		= mTemplate	? mTemplate[1] : null;
			
			
		// extra properties
			this.type			= '';
			this.packagePath	= '';
			
		// determine type
		
			// file
				if(this.name.indexOf('.') > -1)
				{
					this.type		= 'file';
					this.superClass	= null;
				}
				
			// folder / class
				else
				{
					this.type		= this.name.substr(0, 1).match(/[A-Z]/) ? 'class' : 'folder';
				}
				
		// debug
			/*
			Output.inspect
			(
				{
					matches:		matches[3],
					superClass:		this.superClass,
					implements:		this.implements,
					template:		this.template
				},
			   '[' +this.type+ '] ' + this.name
			);
			*/
			
	}
	
	function Template(props)
	{
		// properties
			this.props = props;
			
		// template source
			this.source = getTemplate(props);
			
		// output
			this.output = '';
			
		// generate output
			var strImports		= props.superClass ? 'import ' + getQualifiedClassName(props.superClass) + ';\n' : '';
			var strExtends		= props.superClass ? 'extends ' + props.superClass.split('.').pop() : '';
			var strImplements	= props.implements ? 'implements ' + props.implements : '';
			
			this.output = this.source
				.replace(/\$\(package\)/g, props.packagePath)
				.replace(/\$\(imports\)/g, strImports)
				.replace(/\$\(extends\)/g, strExtends)
				.replace(/\$\(implements\)/g, strImplements)
				.replace(/\$\(className\)/g, props.name)
				;
			
		// outout
			this.toString = function()
			{
				return this.output;
			}
	}

// ------------------------------------------------------------------------------------------------------------------------------------
// structure

	// -----------------------------------------------------------------------------------------
	// TODO

		/*
			Definite:
				add package imports when traversing
				add full package path to name so template can be properly derived
				add indicator for src folders, such as >src or src!
				
				process package structure in 2 passes
					1 - get all info
					2 - apply all info
					
				process bootstrap
				
			Nie to have:
				generate global imports by traversing structure first to make simple array, then process the arrayafterwards to create files and folders
		*/

	

	// -----------------------------------------------------------------------------------------
	// user input
	
		var active				= false;
		var outputPath			= modulePath + 'demo/output/';
		var structurePath		= modulePath + 'demo/package-builder-demo.as';
		
		var outputPath			= xjsflPath + 'user/config/package builder/output/';
		var structurePath		= xjsflPath + 'user/config/package builder/map my summer.as';
		var srcPaths			= ['src/', 'lib/'];
		
	
	
	// -----------------------------------------------------------------------------------------
	// variables
	
		// regexps
			var rxImport			= /^[\t ]*import\s+([\w\.]+);?/gm	// imports at the top
			var rxClass				= /:([\w.~]+)/gm					// classes in the structure
			var rxProps				= /(\s*)([\w. ]+)(.*)/;				// folder|file :Class /Interface =template
			var rxSrcPaths			= new RegExp('^(' + srcPaths.join('|') + ')');
			
	
		// grab data
		
			// data
				var structureSource		= new File(structurePath).contents;
				
			// imports
				var imports				= structureSource.match(rxImport);
				imports					= imports ? recaptureMatches(imports.sort(), rxImport) : [];
				
			// classes
				var classes				= structureSource.match(rxClass);
				classes					= classes ? recaptureMatches(classes.sort(), rxClass) : [];
				
			// debug
				//Output.inspect({imports:imports, classes:classes}, true)
			
		// pre-process
		
			// clear comments
				structureSource			= structureSource.replace(/\/\/.+$/gm, '');
			
			// clear imports
				structureSource			= structureSource.replace(rxImport, '');
				
			// grab lines
				var lines				= structureSource.split(/\r\n/g);

			
		// traversal variables
			var currentPath			= outputPath;
			var itemPath			= '';
			var packagePath			= '';
			var stack				= [];
			var paths				= [];
			
		// create root folder
			var rootFolder			= new Folder(outputPath, active);
			
		
	// -----------------------------------------------------------------------------------------
	// create structure
	
		for(var i = 0; i < lines.length; i++)
		{
			var matches = lines[i].match(rxProps);
			
			//Output.inspect(matches, 'Matches')
			
			if(matches)
			{
				// -----------------------------------------------------------------------------------------
				// variables
				
					// folder/file : superclass variables
						var props = new PropsItem(matches, stack);
						
	
				// -----------------------------------------------------------------------------------------
				// create
				
					if(props.type == 'folder')
					{
						// get parent path
						
							// folder is lower / deeper
								if(props.level <= stack.length)
								{
									stack = stack.slice(0, props.level - 1);
								}
								
								
						// inherit from parent
						
							// inherit last superclass
								if( props.superClass === null && stack.length > 0)
								{
									props.superClass = stack[stack.length - 1].superClass;
								}
								
							// inherit last template
								if( props.template === null && stack.length > 0)
								{
									props.template = stack[stack.length - 1].template;
								}

								
						// update stack
							stack.push(props);
							
						// create current path
							var path		= collect(stack, 'name').join('/');
							currentPath		= outputPath + path + '/';
							packagePath		= path
								.replace(rxSrcPaths, '')
								.replace(/[\\/]/g, '.');

							
						// paths
							itemPath		= currentPath;
							paths.push(currentPath);
							
						// make folder
							if(active)
							{
								var folder = new Folder(currentPath, true);
							}
					}
					
					else if(props.type == 'class')
					{
						// item path
							itemPath			= currentPath + props.name + '.as';
							
						// superclass
						
							// resolve (inherited) superclass
								props.superClass	= props.superClass || stack[stack.length - 1].superClass;
								
							// correct ~ (no) super class
								if(props.superClass == '~')
								{
									props.superClass = null;
								}
								
						// template
							
							// test for interface
								if(props.name.match(/^I[A-Z]/))
								{
									props.template = 'interface';
									if(props.superClass && ! /I[A-Z]\w+$/.test(props.superClass))
									{
										props.superClass = null;
									}
								}
							
							// resolve (inherited) template
								else
								{
									props.template		= props.template || stack[stack.length - 1].template;
								}
							
							
						// add package pathee
							props.packagePath		= packagePath;
							
						// debug
							paths.push(itemPath + (props.superClass ? ' (' + props.superClass + ')' : ''));
							
							//Output.inspect(props, 'Checking FILE...');
								
						// template
							var template = new Template(props);
							
							//trace(template.toString().replace(/\r\n/g, '\n'))
							
						// make file
							if(active)
							{
								var file = new File(currentPath + props.name + '.as', template.toString());
							}
					}
					
					else
					{
						itemPath = currentPath + props.name;
						if(active)
						{
							var file = new File(itemPath).save();
						}
					}
					
					if(false)
					{
						Output.inspect
						(
							{
								path:			itemPath,
								package:		packagePath + (props.type == 'file' ? '.' + props.name : ''),
								superClass:		props.superClass,
								implements:		props.implements,
								template:		props.template
							},
							'[' + props.type.toUpperCase() + '] ' + props.name
						);
					}

					
			}
		}
		
	// debug
		paths.sort();
		//trace(paths.join('\n'));
