// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██  ██ ██     
//  ██  ██ ██  ██ ██     
//  ██  ██ ██  ██ ██     
//   ████  ██  ██ ██     
//  ██  ██ ██  ██ ██     
//  ██  ██ ██  ██ ██     
//  ██  ██ ██████ ██████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// XUL - OO library for creating and managing XUL dialogs

	// --------------------------------------------------------------------------------
	// constructor

		/**
		 * XUL constructor
		 * @param	title	{String}	
		 * @returns		
		 */
		function XUL(title)
		{
			//TODO Allow a file: uri to be passed into the constructor
			
			//TODO Consider making XUL driver-based, so basic controls are constructed using the core, but can be wrapped with additional markup using driver-based methods
			//TODO Alternatively, have an additional XULBuilder class, so code and presentation are kept separate
			
			//TODO Add functionality for basic arithmetic to be performed inside textboxes
			
			// check for dom
				var dom = fl.getDocumentDOM();
				if( ! dom)
				{
					xjsfl.trace('A document (.fla file) needs to be open before a XUL dialog box can be shown');
					return null;
				}
				
			// initialize and build
				else
				{
					// load dialog
						this.xml		= xjsfl.file.load('template', 'xul/dialog.xml');
						
					// load controls
						var xml			= xjsfl.file.load('template', 'xul/controls.xml');
						for each(var node in xml.grid.rows.*)
						{
							XUL.templates[node.@template.toString()] = node.copy();
						}
						
					// properties
						this.controls	= {};
						this.settings	= {};
						this.events		= {};
						this.rules		= {};
						this.columns	= [80, 150], 
						this.error		= null;
						this.id			= -1;
						
						//TODO columns flex properly, and ensure appropriate elements flex to fill
						
					// set title if provided
						this.setTitle(title || 'xJSFL');
				}
				
			// return
				return this;
		
		}
		
		
	// ------------------------------------------------------------------------------------------------
	// XUL static methods & properties
	
		/**
		 * Static convenience method to instantiate and return a new chainable XUL instance
		 * @param	props	{String}	An optional shorthand String
		 * @param	props	{Function}	An optional Function
		 * @returns			{XUL}		
		 */
		XUL.factory = function(props)
		{
			/*
				Arguments:
				String, accept, fail	- get controls, labels and values from string @see XUL.add()
				accept, fail			- build controls from function params
				Object, accept, fail	- build controls from object (not yet implemented)
				//TODO implement building from Object
			*/
		
			// build new XUL
				var xul = new XUL();
				
			// populate
				if(xul.xml && props)
				{
					// if props is a function, set the dialog title to the function name, and create textfields per function argument
						if(typeof props == 'function')
						{
							// assign properties
								cancel = accept;
								accept = props;
								
							// parse and assign controls
								props = this._parseFunction(props);
								for each(var prop in props.params)
								{
									xul.addTextbox(prop);
								}
								
							// title
								xul.setTitle('Dialog for "' + props.name + '"');
						}
						
					// props is a string, use shorthand notation to create controls
						else if(typeof props == 'string')
						{
							xul.add(props);
						}
						
					// return
						return xul;				
				}
				
			// return
				return xul;
		}
		
		/**
		 * Static convenience method to create and show interface in one call, returning any submitted values
		 * @param	props	{String}	
		 * @param	props	{Function}	
		 * @param	props	{Object}	
		 * @param	accept	{Function}	
		 * @param	cancel	{Function}	
		 * @returns			{Object}	
		 */
		XUL.create = function(props, accept, cancel)
		{
			// build new XUL
				var xul = XUL.factory(props);
				
			// show
				if(xul && xjsfl.utils.getKeys(xul.controls).length > 0)
				{
					xul.show(accept, cancel);
					return xul.values;
				}

			// return
				return null;
		}
		
		XUL.toString = function()
		{
			return '[class XUL]';
		}
		
		/**
		 * Static control store
		 */
		XUL.templates = {};
		
		
	// ------------------------------------------------------------------------------------------------
	// XUL prototype
	
		XUL.prototype =
		{
			// --------------------------------------------------------------------------------
			// properties
			
				// settings
					id:			null,
					xml:		null,
					
				// properties
					controls:	{},
					settings:	{},
					events:		{},
					rules:		{},
					columns:	[100, 200],
					
				// template
					content:	'',
					separator:	'</rows></grid><separator /><grid><columns><column flex="1" /><column flex="2" /></columns><rows>',
					
				// properties
					title:		'',
					error:		null,
					
				// flags
					built:		false,
					open:		false,
					
			// --------------------------------------------------------------------------------
			// accessors
			
					/**
					 * values getter
					 */
					get values()
					{
						var values = {};
						for(var id in this.controls)
						{
							var control = this.controls[id];
							if(control.enumerable)
							{
								values[id] = control.value;
							}
						}
						return values;
					},
					
			// --------------------------------------------------------------------------------
			// methods
			
				/**
				 * reset constructor
				 */
				constructor:XUL,
				
				
			// --------------------------------------------------------------------------------
			// control methods
			
				// misc
					/**
					 * (private) Main add control method
					 * @param	type		{String}	
					 * @param	id			{String}	
					 * @param	label		{String}	
					 * @param	xml			{XML}		
					 * @param	attributes	{Object}	
					 * @param	validation	{Object}	
					 * @param	events		{Object}	
					 * @returns		
					 */
					_addControl:function(type, id, label, xml, attributes, validation, events)
					{
						// element
							var element			= xml[type][0];
							
						// label
							id					= id || label.split(/[^\d\w ]/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
							if(xml.label.length())
							{
								xml.label.@value = label ? label + ':' : '';
							}
							
						// check id is not already defined
							if(this.controls[id])
							{
								throw new Error('XUL.addControl(): Cannot add <' +type+ '> control - duplicate id "' +id+ '"');
							}

						// id & attributes
							if(element)
							{
								element.@id = id;
								for(var name in attributes)
								{
									if(name == 'value')
									{
										// need to add / set values using JavaScript (rather than in XML) or else the field will always show initial values when being re-shown
										this.settings[id] = attributes[name];
									}
									else
									{
										element['@' + name] = attributes[name];
									}
								}
							}
							
						// setup validation
							if(validation)
							{
								this._addValidation(id, validation);
							}
							
						// setup events
							if(events)
							{
								this._addEvents(id, events);
							}
							
						// add handler proxies
							xml = this._addHandlers(type, xml);
								
						// set control
							this.controls[id] = new XULControl(id, type, this, xml); // attributes ? attributes.value : ''
							this.addXML(xml, false, true);
							
						// debug
							//trace(xml)
							
						// return
							return this;
					},
					
					/**
					 * Updates supplied XML with new child items parent
					 * @param	parent	{XML}		An XML parent node. Child items are updated by reference
					 * @param	values	{Array}		The values (values, or {label:'',value:''} Objects) of each of the new elements you want to add
					 * @param	id		{String}	The id of the new control
					 * @returns			{XML}		The XML of the new children (altough the original parent is altered by reference anyway)
					 */
					_addChildren:function(parent, values, id)
					{
						// grab the first item in the list to use as a template for the others
							var items			= parent.*;
							var itemTemplate	= items[0].copy();

						// delete old child nodes
							while(items.length())
							{
								delete items[0];
							}
							
						// add new child nodes
							var i = 0;
							for each(var value in values)
							{
								var item 			= itemTemplate.copy();
								if(value.label) // value is an object
								{
									item.@value		= value.value;
									item.@label		= value.label;
								}
								else
								{
									item.@value		= value;
									item.@label		= value;
								}
								if(id)
								{
									item.@id		= id + '[' + i + ']';
								}
								items[i++]			= item;
							}
							
						// return parent
							return parent;
					},
					
					_addValidation:function(id, validation)
					{
						if(this.rules[id] == null)
						{
							this.rules[id] = {};
						}
						for(var rule in validation)
						{
							this.rules[id][rule] = validation[rule];
						}
					},
					
					_addEvents:function(id, events)
					{
						for(var name in events)
						{
							this.addEvent(id, name, events[name]);
						}
					},
					
					_addHandlers:function(type, xml)
					{
						// type
							type = type.replace('group', '');
						
						// events
							var types =
							{
								button:			'create command',
								//checkbox:		'create',
								//radio:			'create',
								//choosefile:		'create',
								colorchip:		'create change',
								//expression:		'create change',
								flash:			'create',
								listbox:		'create change setfocus',
								menulist:		'create change setfocus',
								//popupslider:	'create',
								//targetlist:		'create',
								textbox:		'create change',
								property:		'create'
							};
							
						// return early if type not registered for events
							if( ! types[type])
							{
								return xml;
							}
							
						// add xml under a temp root node, so we can find any top-level control nodes passed in
							xml = new XML('<temp>' + xml.toXMLString() + '</temp>');
							
						// variables
							var events		= types[type].split(/ /g);
							var nodes		= xml.find(type, true);
							
						// for each node
							for each(var node in nodes)
							{
								// id
									var id = node.@id;
									
								// assign handler. Note that the xulid will be assigned and the {xulid} placeholder replaced during xjsfl.ui.show()
									for each(var event in events)
									{
										node.@['on' + event] = "xjsfl.ui.dialogs[{xulid}].handleEvent('" +event+ "', '" +id+ "')";
									}
							}
							
						// return the original node
							return xml.children();
					},
					
					_parseUserXML:function(xml)
					{
						// add xml under a temp root node, so we can find any top-level control nodes passed in
							xml = new XML('<temp>' + xml.toXMLString() + '</temp>');
							
						// loop through control types, and attempt to find and add to controls array
							var types	= 'button,checkbox,colorchip,choosefile,listbox,menulist,popupslider,targetlist,textbox'.split(',');
							for each(var type in types)
							{
								var controls = xml.find(type, true);
								
								if(controls.length() > 0)
								{
									for each(var control in controls)
									{
										// variables
											var id				= control.@id.toString();
											var value			= control.@value.toString();
											var controlXML		= control.toXMLString();
											
										// check that id is not already in use
											if(this.controls[id])
											{
												throw new Error('XUL.addControl(): Cannot add <' +type+ '> control - duplicate id "' +id+ '"');
											}
											
										// store then clear value, otherwise it will always re-appear when the textbox is reshown
											this.settings[id]	= value.toString();
											control.@value		= '';
											
										// add control
											this.controls[id]	= new XULControl(id, type, value, controlXML);
										
										// add any event handlers
											xml					= this._addHandlers(type, xml);
									}
								}
							}
							
						// xml
							return xml.children();

					},
					
				// --------------------------------------------------------------------------------
				// single controls
				
					/**
					 * Add a Button control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addButton:function(label, id, attributes, events)
					{
						// build xml
							var xml				= XUL.templates.button.copy();
							attributes			= attributes || {};
							attributes.label	= label;
							id					= id || label.split(/[^\d\w ]/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
						
						// add control
							return this._addControl('button', id, '', xml, attributes, null, events);
					},

					/**
					 * Add a Checkbox control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addCheckbox:function(label, id, attributes, validation)
					{
						// build xml
							var xml				= XUL.templates.checkbox.copy();
							xml.checkbox.@label = label;
							id					= label.toLowerCase();
							label				= '';
						
						// add control
							return this._addControl('checkbox', id, label, xml, attributes, validation);
					},

					/**
					 * Add a Colorchip control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addColorchip:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.colorchip.copy();
							
						// values
							var value = attributes.value;
							if(value)
							{
								if(value.substr(0, 2) == '0x')
								{
									attributes.format = 'hex';
								}
								else if(value.substr(0, 1) == '#')
								{
									attributes.format = 'string';
								}
								else
								{
									attributes.format = 'string';
									attributes.value = '#' + value;
								}
							}
							//Output.inspect(attributes)
						
						// add control
							return this._addControl('colorchip', id, label, xml, attributes, validation, events);
					},

					/**
					 * Add a Choosefile control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addChoosefile:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.choosefile.copy();
							//Output.inspect(attributes, 'Attributes')
							
						// add control
							return this._addControl('choosefile', id, label, xml, attributes, validation, events);
					},

					/**
					 * Add a Expression control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addExpression:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.expression.copy();
							//trace('ADD EXPRESSION:' + attributes.value);
						
						// add control
							return this._addControl('expression', id, label, xml, attributes, validation, events);
					},

					/**
					 * Add a Flash control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	source		{String}	Source path to the SWF, relative to the XML saved location
					 * @param	properties	{Array}		An array of property names to be created
					 * @param	attributes	{Object}	Optional attributes
					 * @returns				{XUL}		
					 */
					addFlash:function(label, id, src, properties, attributes)
					{
						// build xml
							var xml			= XUL.templates.flash.copy();
							var uri			= xjsfl.utils.makeURI(src);
							xml..flash.@src	= src;
							
						// properties
							for each(var property in properties)
							{
								this.addProperty(property);
							}
						
						// add control
							return this._addControl('flash', id, label, xml, attributes);
					},

					/**
					 * Add a Popupslider control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	values		{Array}		An optional Array of values [default, min, max]
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addPopupslider:function(label, id, values, attributes, validation, events)
					{
						// check values
							if(! (values instanceof Array))
							{
								values = [values || 0, 0, 100];
							}
							
						// attributes
							attributes					= attributes || {};
							attributes.value			= values[0];
							
						// build xml
							var xml						= XUL.templates.popupslider.copy();
							xml..popupslider.@value		= values[0];
							xml..popupslider.@minvalue	= values[1];
							xml..popupslider.@maxvalue	= values[2];
							
						// add control
							return this._addControl('popupslider', id, label, xml, attributes, validation, events);
					},

					/**
					 * Add a Targetlist control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addTargetlist:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.targetlist.copy();
						
						// add control
							return this._addControl('targetlist', id, label, xml, attributes, validation, events);
					},

					/**
					 * Add a Textbox control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addTextbox:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.textbox.copy();
						
						// add control
							return this._addControl('textbox', id, label, xml, attributes, validation, events);
					},
					
				// --------------------------------------------------------------------------------
				// compound controls
				
					/**
					 * Add a CheckboxGroup to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addCheckboxgroup:function(label, id, values, attributes, validation)
					{
						// build xml
							var xml				= XUL.templates.checkboxgroup.copy();
						
						// add child items
							var parent			= xml..vbox;
							this._addChildren(parent, values, id || label.toLowerCase());
						
						// add control
							return this._addControl('checkboxgroup', id, label, xml, attributes, validation);
					},

					/**
					 * Add a RadioGroup to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addRadiogroup:function(label, id, values, attributes)
					{
						// build xml
							var xml				= XUL.templates.radiogroup.copy();
							
						// add child items
							var parent			= xml..radiogroup;
							this._addChildren(parent, values);
						
						// add control
							return this._addControl('radiogroup', id, label, xml, attributes);
					},
					
					/**
					 * Add a Listbox control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addListbox:function(label, id, values, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.listbox.copy();
							
						// add child items
							var parent			= xml..listbox;
							this._addChildren(parent, values);
							
						// add control
							return this._addControl('listbox', id, label, xml, attributes, validation, events);
					},

					/**
					 * Add a Menulist control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		
					 */
					addDropdown:function(label, id, values, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.menulist.copy();
							var parent			= xml..menupop;
						
						// add child items
							this._addChildren(parent, values);
							
						// add control
							return this._addControl('menulist', id, label, xml, attributes, validation, events);
					},
					
				// --------------------------------------------------------------------------------
				// other elemnts methods
				
					/**
					 * Add a Property control to the UI
					 * @param	id	
					 * @returns		
					 */
					addProperty:function(id)
					{
						// build xml
							var xml		= XUL.templates.property.copy();
							xml.@id		= id;
							
						// add xml
							//this.addXML(xml);
							return this._addControl('property', id, id, xml);
							
						// return
							return this;
					},
					
					//FIX Work out why separators don't make it into the final XUL.
					// Is this because the non-controls are being added to a separate XML buffer? Compare to _addControl()
					addSeparator:function(label)
					{
						// build xml
							var xml		= XUL.templates.separator.copy();
							if(label)
							{
								xml.@label = label;
							}
							
						// add xml
							this.addXML(xml);

						// return
							return this;
					},
				
					addSpacer:function()
					{
						// build xml
							var xml				= XUL.templates.spacer.copy();
							
						// add xml
							this.addXML(xml);
							
						// return
							return this;
					},
				
					/**
					 * Add a Label control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @returns				{XUL}		
					 */
					addLabel:function(label, id)
					{
						// build xml
							var xml				= XUL.templates.label.copy();
							var sum				= 0; this.columns.forEach( function(e){sum += e} );
							xml.@width			= sum;
							
						// add xml
							this.addXML(xml);
							
						// return
							return this;
					},

					/**
					 * Adds a script source to the interface
					 * @param	script	{Function}
					 * @returns		
					 */
					addScript:function(script)
					{
						// add
							if(typeof script == 'function')
							{
								script = script.toSource();
							}
							var xml = new XML('<script>' + script + '</script>');
							
						// add xml
							this.addXML(xml);
							
						// return
							return this;
					},
					
					/**
					 * Adds XML to the rows tag of the UI xml. If the XML, XMLList, or String doesn't contain a row, it will be created automatically
					 * @param	xml				{XML}		An XML <row>
					 * @param	xml				{XMLList}	An XMLList of <row>s
					 * @param	xml				{String}	A String of XML
					 * @param	breakOutOfRows	{String}	An optional Boolean to break out of rows, and just add vanilla XML to the dialog
					 * @param	dontParse		{Boolean}	Internal flag to indicate to the function not to process the XML for control info
					 * @returns	this
					 */
					addXML:function(xml, breakOutOfRows, dontParse)
					{
						// parse argument
							if(typeof xml === 'string')
							{
								xml = new XMLList(xml);
							}
							
						// Parse XML for new controls, and if found, add event handlers, and add to control hash for validation
							if(dontParse !== true)
							{
								xml = this._parseUserXML(xml);
							}
						
						// handle non-row XML
							if(xml[0].name() != 'row')
							{
								// break out of, then back into rows
									if(breakOutOfRows)
									{
										xml = this.separator.replace('<separator />', xml.toXMLString());
									}
									
								// wrap in a row tag
									else
									{
										xml = '<row>' + xml.toXMLString() + '</row>';
									}
							}
							
						// add XML
							this.content += xml.toString();
							
						// return
							return this;
					},
					
					/**
					 * Add (or actually, set) a event callback for an id
					 * @param	ids			{String}	The id(s) of the element to register the callback for
					 * @param	types		{String}	The type(s) of callback. Values can be create, change, setfocus, command. Separate multiple types with spaces or commas if required
					 * @param	callback	{Function}	The callback to call. Format must be function(xmlui, xul, object, value, type, id){ ... }
					 * @returns		
					 */
					addEvent:function(ids, types, callback)
					{
						// xul-level events
							if(arguments.length == 2 && typeof types == 'function')
							{
								// variables
									callback	= types;
									var type	= ids;
								
								// check types are valid
									if( ! /^initialize|prevalidate|postvalidate$/.test(type))
									{
										throw new Error('XUL.addEvent(): invalid event type "' +type+ '"');
									}
								
								// build hash if not yet exists
									if(this.events[type] == null)
									{
										this.events[type] = {};
									}
									
								// assign command
									this.events[type] = callback;								
								
							}
						
						// control events
							else
							{
								// convert ids and types to Arrays
									ids		= xjsfl.utils.trim(ids).split(/\W+/g);
									types	= xjsfl.utils.trim(types).split(/\W+/g);
								
								// add events
									for each(var id in ids)
									{
										for each(var type in types)
										{
											// check types are valid
												if( ! /^command|change|setfocus|create$/.test(type))
												{
													throw new Error('XUL.addEvent(): invalid event type "' +type+ '"');
												}
											
											// build hash if not yet exists
												if(this.events[type] == null)
												{
													this.events[type] = {};
												}
												
											// assign command
												this.events[type][id] = callback;								
										}
									}								
							}
							
						// return
							return this;
					},


				// --------------------------------------------------------------------------------
				// custom methods
				
					/**
					 * Add a control using shorthand notation
					 * @param	str	{String}	A string of the format "type:Label=values,type:Label=values, ..."
					 * @returns		
					 */
					add:function(str)
					{
						//TODO Add xml:<xml attr="value"> functionality
						
						// variables
							var chunker		= /\s*(\||\w*:)?([^,=]+)=?(\[[^\]]+\]|{[^}]+}|[^,]*)/g
							var rxObj		= /([^:,]+):([^,]+)/;
							var exec, matches, rx, mats;
							
						// parse
							while(matches = chunker.exec(str))
							{
								// debug
									var match = xjsfl.utils.trim(matches[0])
									//Output.inspect(matches);
									
								// spacer
									if(match == '')
									{
										this.addSpacer();
									}
									
								// control
									else
									{
										// variables
											var control = xjsfl.utils.trim(matches[1]);
											var label	= xjsfl.utils.trim(matches[2]);
											var value	= xjsfl.utils.trim(matches[3]);
											
										// control
											if(label == '|') // small hack, as the RegExp doesn't catch \| as a control
											{
												control = 'separator';
												label = '';
											}
											else if(control == '|')
											{
												control = 'separator';
											}
											else if(control == '')
											{
												control = 'textbox';
											}
											else
											{
												control = control.substring(0, matches[1].length - 1);
											}
											
										//TODO update this to work with xjsfl.utils.parseValue
											
											// Output.inspect([control, label, value])
											
										// compound value
											if(/^[\[{]/.test(value))
											{
												// variables
													var isObject	= value[0] == '{';
													var values		= value.substring(1, value.length - 1).split(',');
												
												// loop through the array and convert elements to values / objects
													for(var i = 0; i < values.length; i++)
													{
														if(isObject)
														{
															mats = values[i].match(rxObj)
															if(mats)
															{
																var lab		= xjsfl.utils.trim(mats[1]);
																var val		= xjsfl.utils.trim(mats[2]);
																values[i]	= {label:lab, value:val};
															}
														}
														else
														{
															var val		= xjsfl.utils.trim(values[i]);
															values[i]	= /^popupslider|slider|numeric$/.test(control) ? val : {label:val, value:val};
														}
													}
													
												// update control type
													if(control == 'textbox')
													{
														control = 'dropdown';
													}
													
												// re-assign values
													value = values;
											}
											
											//Output.list([label, control)
											
										// add control
											switch(control)
											{
												// single controls
												
													case 'button':
														this.addButton(label);
													break;
	
													case 'checkbox':
														this.addCheckbox(label, null, {value:value});
													break;
	
													case 'color':
													case 'colorchip':
													case 'colorpicker':
														this.addColorchip(label, null, {value:value});
													break;
												
													case 'expression':
														this.addExpression(label, null, {value:value});
													break;
	
													case 'choosefile':
													case 'openfile':
													case 'file':
														this.addChoosefile(label, null);
													break;
	
													case 'savefile':
													case 'save':
														this.addChoosefile(label, null, {value:'', type:'save'});
													break;
	
													case 'flash':
														this.addFlash(label, control, value);
													break;
	
													case 'numeric':
													case 'slider':
													case 'popupslider':
														this.addPopupslider(label, null, value);
													break;
	
													case 'targetlist':
														this.addTargetlist(label, null, {value:value});
													break;
	
													case 'text':
													case 'textbox':
													case 'textfield':
														this.addTextbox(label, null, {value:value});
													break;
												
												// compound controls
												
													case 'checkboxgroup':
														this.addCheckboxgroup(label, null, value);
													break;
	
													case 'radiogroup':
														this.addRadiogroup(label, null, value);
													break;
	
													case 'list':
													case 'listbox':
														this.addListbox(label, null, value);
													break;
	
													case 'menulist':
													case 'dropdown':
														this.addDropdown(label, null, value);
													break;
												
												// other
												
													case 'xml':
														this.addXML(label);
													break;
												
													case 'label':
														this.addLabel(label, null, {value:label});
													break;
												
													case 'separator':
														this.addSeparator(label);
													break;
												
													case 'property':
														this.addProperty(label);
													break;
												
												// properties
												
													case 'title':
														this.setTitle(label);
													break;
											
													case 'width':
														this.setWidths(parseInt(label));
													break;
											
													case 'columns':
														this.setColumns(xjsfl.utils.parseValue(label));
													break;
											
											default:
												xjsfl.output.error('XUL.add(): Undefined control type "' +control+ '"');
											}
									}
									
								// output
									//Output.inspect([xjsfl.utils.trim(matches[0]), control, label, value], 'Add');
									
									
							}
							
						// return
							return this;
					},
					
			// --------------------------------------------------------------------------------
			// Set methods
			
				setXML:function(xml)
				{
					delete this.xml..content.*
					this.xml..content.@id = 'controls'
					this.content = this._parseUserXML(new XMLList(xml));
					return this;
				},
			
				setTitle:function(title)
				{
					if(this.xml)
					{
						this.xml.@title = ' ' + title;
						this.title = title;
					}
					return this;
				},
				
				/**
				 * 
				 * @param	columns	
				 * @returns		
				 */
				setColumns:function(columns)
				{
					this.columns = columns;
					return this;
				},
				
				/**
				 * 
				 * @param	columns	
				 * @returns		
				 */
				setButtons:function(str)
				{
					this.xml.@buttons = str;
					return this;
				},
				
				setEventScope:function(scope)
				{
					this.scope = scope;
					return this;
				},
				
				/**
				 * Assign values from a miscellaneous property object
				 * @param	props	
				 */
				setProperties:function(props)
				{
					for(var name in props)
					{
						var value = props[name];
						switch(name)
						{
							case 'title':
								this.xml.@title = value;
							break;
						}
					}
					return this;
				},
				
				/**
				 * Save the dialog in a particular location so custom Flash controls can reference the src attribute properly
				 * @param	uri	{String}	
				 * @returns		
				 */
				saveAs:function(uri)
				{
					// check file is an XML file
						if( ! /\/[^\/]+\.xml/.test(uri))
						{
							throw new Error('XUL.saveAs(): dialog uri must end with an .xml extension');
						}
						
					// make URI
						uri			= xjsfl.utils.makeURI(uri);
						this.uri	= uri;
						
					// return
						return this;
				},
				
			// --------------------------------------------------------------------------------
			// event handling
			
				handleEvent:function (type, id)
				{
					// variables
						var object;
						var value;
						
					// debug
						//trace('Event:' + [id, type])
						
					// handle event
						switch(type)
						{
							// xul-level
								case 'initialize':
								case 'prevalidate':
								case 'postvalidate':
									if(this.events[type])
									{
										var callback = this.events[type];
										if(typeof callback == 'function')
										{
											var event = new XULEvent(type, null, this, fl.xmlui);
											callback.apply(this.scope || window, [event]);
										}
									}
								break;
							
							// create
								case 'create':
									
									//TODO If list items have no setting, set the first item as selected
									//TODO Make sure checkbox reselection works
									
									// assign element to original control on creation
										var control = this.controls[id];
										if(control.element == null)
										{
											control.element = fl.xmlui.getControlItemElement(id);
										}

									// set default / restore last value
										if(this.settings)
										{
											var value = this.settings[id];
											if(value !== undefined)
											{
												control.value = value;
												//fl.xmlui.set(id, value);
											}
										}
							
							// change, command, setfocus
								case 'change':
								case 'command':
								case 'setfocus':
									if(this.events[type] && this.events[type][id])
									{
										var callback = this.events[type][id];
										if(typeof callback == 'function')
										{
											//FIX Fix problem of colors disappearing when these commands are outside of this if() & check if adding callbacks screws it up too
											
											// xul control
												var control = this.controls[id];
												var event	= new XULEvent(type, control, this, fl.xmlui);
												
											// xmlui element
												var object	= fl.xmlui.getControlItemElement(id);
												var value	= fl.xmlui.get(id);
												
											// dispatch event
												//callback(control, this, fl.xmlui, type) // control, xul, xmlui, type
												callback.apply(this.scope || window, [event]);
										}
									}
								break;
						}
						
					// debug
						//trace('Event:' + [fl.xmlui, this, object, value, id, type])
					
				},
				
			// --------------------------------------------------------------------------------
			// show
			
				show:function(accept, cancel)
				{
					if(xjsfl.get.dom())
					{
						// --------------------------------------------------------------------------------
						// build panel
						
							// old checkbox code
								/*
								var checkboxes = this.xml..checkbox;
								for each(var checkbox in checkboxes)
								{
									var id				= checkbox.@id.toString();
									var value			= this.settings[id];
									if(value != null)
									{
										checkbox.@checked	= value;
									}
								}
								*/
								
								/*
							// update colorchips
								var colorchips			= this.xml..colorchip;
								for each(var colorchip in colorchips)
								{
									var id				= colorchip.@id.toString();
									var value			= this.settings[id];
									trace(id, value)
									if(value != null)
									{
										colorchip.@color = value;
									}
								}
								*/
								
						// --------------------------------------------------------------------------------
						// build and show panel
						
							// build XML
								if(this.built == false)
								{
									this.build();
								}
								
							// clear settings
								this.settings	= null;
								
							// show panel
								this.settings	= xjsfl.ui.show(this);
								
						// --------------------------------------------------------------------------------
						// process result
								
								//Output.inspect(this.settings)
								
							// get control values and convert to array for callbacks
								if(accept || cancel)
								{
									var args = xjsfl.utils.getValues(this.values);
								}
	
							// test for validation
								if(this.settings && this.settings.dismiss == 'accept')
								{
									// validate
									
										//FIX I seem to have broken validation somewhere!
									
										// reset last error message
											this.error = null;
											
										// loop over controls and request validation
											for each(var control in this.controls)
											{
												var error = control.validate();
												if(error != null)
												{
													this.error = error;
													break;
												}
											}
											
									// didn't validate - alert error and show again
										if(this.error)
										{
											alert(this.error);
											this.show(accept, cancel);
										}
										
									// validated - update settings and call accept callback
										else
										{
											if(accept)
											{
												accept.apply(this, args);
											}
										}
								}
								
							// cancel
								else if(cancel)
								{
									cancel.apply(this, args);
									this.settings = null;
								}
					}
						
					return this;
				},
				
				/**
				 * 
				 * @returns		
				 */
				build:function()
				{
					// find #controls node and add content
						if(true)
						{
							var controls	= this.xml.find('#controls', true);
							var content		= new XMLList(this.content);
							controls.row	+= content;
						}
						else
						{
							var xml			= this.xml.toXMLString();
							xml				= xml.replace(/<(\w+) id="controls"(>\/\\1>|\/>)/, '<$1 id="controls">' +this.content+ '</$1>');
							this.xml		= new XML(xml);
						}
						
					// set column widths
						for each(var label in this.xml..row.label)
						{
							label.@width = this.columns[0];
						}

					// replace separators
						var str		= this.xml.toXMLString().replace(/<row template="separator"\/>/g, this.separator);
						this.xml	= new XML(str);
						
					// add xulid, so we can test for existance of dialog boxes in future
						this.xml.*	+= new XML('<textbox id="xulid" value="{xulid}" visible="false" />');
						
					// debug
						//trace(this.xml.toXMLString())
				
					// flag as built
						this.built = true;
						
					// return
						return this;

				},
				
			// --------------------------------------------------------------------------------
			// utilities
			
				/**
				 * Parses a function source into an info object: {name:name, params:['param1','param2','param3']}
				 * @param	fn	
				 * @returns		
				 */
				_parseFunction:function(fn)
				{
					var matches = fn.toSource().match(/function (\w+)\(([^\)]*)\)/);
					if(matches && matches[2])
					{
						var params = matches[2].match(/(\w+)/g);
						return {name:matches[1], params:params};
					}
					return null;
				},
				
				/**
				 * Returns a String representation of the dialog
				 * @returns		
				 * @author	Dave Stewart	
				 */
				toString:function()
				{
					return '[object XUL id="' +this.id+ '" title="' +xjsfl.utils.trim(this.xml.@title)+ '" controls:' +xjsfl.utils.getKeys(this.controls).length+ ']';
				}
		}
		
	// ---------------------------------------------------------------------------------------------------------------
	// register
	
		xjsfl.classes.register('XUL', XUL);

	
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██  ██ ██        ██████              ██              ██ 
//  ██  ██ ██  ██ ██        ██                  ██              ██ 
//  ██  ██ ██  ██ ██        ██     █████ █████ █████ ████ █████ ██ 
//   ████  ██  ██ ██        ██     ██ ██ ██ ██  ██   ██   ██ ██ ██ 
//  ██  ██ ██  ██ ██        ██     ██ ██ ██ ██  ██   ██   ██ ██ ██ 
//  ██  ██ ██  ██ ██        ██     ██ ██ ██ ██  ██   ██   ██ ██ ██ 
//  ██  ██ ██████ ██████    ██████ █████ ██ ██  ████ ██   █████ ██ 
//
// ------------------------------------------------------------------------------------------------------------------------
// XUL Control - OO representation of a dialog control


	// --------------------------------------------------------------------------------
	// Constructor

		/**
		 * An OO wrapper for XMLUI UI elements
		 * @param	type	{String}	The type (tag name) of the control item
		 * @param	value	{Value}		The original value the control contains
		 * @param	xml		{XML}		The XML of the control, that will be added to the UI
		 * @returns		
		 */
		function XULControl(id, type, xul, xml)
		{
			// properties
				this.id			= id;
				this.type		= type;
				
			// priviliged method to get XUL, so it doesn't print when Output.inspect()ing
				this.getXUL = function()
				{
					return xul;
				}
				
			// same for XML
				this.getXML = function()
				{
					return xml;
				}
				
			// flags
				this.enumerable	= ! /^button|flash$/.test(type);
				this.combo		= /^radiogroup|menulist|listbox$/.test(type);
		}
		
	// --------------------------------------------------------------------------------
	// Prototype

		XULControl.prototype = 
		{
			// properties
				id:				'',
				type:			'',
				
			// flags
				enumerable:		true,
				combo:			false,
				
			// accessors
			
				get value()
				{
					// work out if the dialog is open, or closed (existance of settings object implies it's closed)
						var settings	= this.getXUL().settings;
						
					// grab the (String) value for the control
						var value		= settings ? settings[this.id] : fl.xmlui.get(this.id);
						
					// parse to a real value
						switch(this.type)
						{
							case 'checkboxgroup':
								var arr		= [];
								var items	= this.getXML()..checkbox;
								for each(var item in items)
								{
									var id		= item.@id.toString();
									var value	= xjsfl.utils.parseValue(item.@value.toString());
									var state	= settings ? settings[id] : fl.xmlui.get(this.id);;
									if(state === 'true')
									{
										arr.push(value);
									}
								}
								return arr;
							break;
						
							case 'colorchip':
								return value.substr(0,2) == '0x' ? parseInt(value, 16) : value.substr(1);
							break;
						
							case 'popupslider':
								return parseInt(value);
							break;
						
							case 'checkbox':
							case 'textbox':
							case 'targetlist':
								return xjsfl.utils.parseValue(value);
							break;
						
							default:
								value = xjsfl.utils.parseValue(value);
						}
						
					// return
						return value == '' ? null : value;
				},
				
				set value(value)
				{
					if(this.settings == null)
					{
						if(this.type == 'choosefile' && value == '')
						{
							// do nothing
						}
						else
						{
							fl.xmlui.set(this.id, value);
						}
					}
				},
				
				get element()
				{
					return fl.xmlui.getControlItemElement(this.id);
				},
				
			// compound controls only
			
				/**
				 * Get the values of a radiobuttongroup, listbox, or dropdown child items
				 */
				getValues:function()
				{
					switch(this.type)
					{
						case 'radiogroup':
							return this.xml..radio.@value;
						break;
						case 'menulist':
							return this.xml..listitem.@value;
						break;
						case 'listbox':
							return this.xml..menuitem.@value;
						break;
					}
					return [this.value || null];
				},
				
				setSelectedIndex:function(index)
				{
					if(this.combo)
					{
						this.value = this.values[index];
					}
				},
				
			// validation
			
				//TODO Implement proper validation using rules, and the Validation class
				validate:function()
				{
					var value = this.value;
					switch(this.type)
					{
						case 'textbox':
						case 'expression':
						case 'popupslider':
						case 'colorchip':
							return value == null ? 'Field "' +this.id+ '" is required' : null;
						break;
					}
					return null;
				},
				
				toString:function()
				{
					return '[object XULControl id:"'+this.id+'" type:"'+this.type+'" value="' +this.value+ '"]';
				}
				
		}
		
// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██  ██ ██        ██████                    ██   
//  ██  ██ ██  ██ ██        ██                        ██   
//  ██  ██ ██  ██ ██        ██     ██ ██ █████ █████ █████ 
//   ████  ██  ██ ██        █████  ██ ██ ██ ██ ██ ██  ██   
//  ██  ██ ██  ██ ██        ██     ██ ██ █████ ██ ██  ██   
//  ██  ██ ██  ██ ██        ██      ███  ██    ██ ██  ██   
//  ██  ██ ██████ ██████    ██████  ███  █████ ██ ██  ████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// XUL Event

	// --------------------------------------------------------------------------------
	// Constructor

		/**
		 * A XUL Event class to pass parameters to event callbacks
		 * @param	type	{String}
		 * @param	control	{XULControl}
		 * @param	xul		{XUL}
		 * @param	xmlui	{XMLUI}
		 */
		function XULEvent(type, control, xul, xmlui)
		{
			/**
			 * @type {String}
			 */
			this.type		= type;
			/**
			 * @type {XULControl}
			 */
			this.control	= control;
			/**
			 * @type {XUL}
			 */
			this.xul		= xul;
			/**
			 * @type {XMLUI}
			 */
			this.xmlui		= xmlui;
			
			this.toString = function()
			{
				var control		= this.control ? ' control="' +this.control.id+ '"' : '';
				return '[object XULEvent type="' +this.type+ '"' +control+ ' xul="' +this.xul.id+ '"]';
			}
		}


// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code
	
	if( ! xjsfl.loading )
	{
		// initialize
		
			xjsfl.reload(this);
			//clear();
			try{
		
		// --------------------------------------------------------------------------------
		// A basic dialog, with basic validation
		
			if(0)
			{
				var xul = new XUL('Basic dialog');
				xul
					.addTextbox('Prompt')
					.show();
			}
		
		// --------------------------------------------------------------------------------
		// XUL.factory() syntax
		
			if(0)
			{
				XUL.factory()
					.setTitle('XUL.factory()')
					.addTextbox('Prompt')
					.show();
			}
		// --------------------------------------------------------------------------------
		// A basic dialog with an accept and cancel callback
		
			if(0)
			{
				function accept(a, b)
				{
					trace('The product of the values is ' + a * b);
				}
				
				function cancel()
				{
					trace('We will never know the sum of those numbers!')
				}
				
				XUL.factory()
					.setTitle('Callbacks')
					.addPopupslider('Value 1', 'value1', Math.floor(Math.random() * 100))
					.addPopupslider('Value 2', 'value2', Math.floor(Math.random() * 100))
					.show(accept, cancel);
			}
		
		
		// --------------------------------------------------------------------------------
		// Static create method using shorthand declaration
		
			if(0)
			{
				function accept(a, b, c)
				{
					trace([a,b,c]);
				}
				
				XUL.create('One,Two,Three', accept);

			}
		
		// --------------------------------------------------------------------------------
		// Static create method with advanced shorthand declaration
		
			if(0)
			{
				function accept(prompt, values, pick)
				{
					Output.inspect([prompt, values, pick])
				}
				
				XUL.factory('textbox:Prompt=I am  a default prompt,dropdown:Picker={One:1,Two:2,Three:3},title:Advanced shorthand declaration')
					.show(accept);
			}
		
		// --------------------------------------------------------------------------------
		// Checkbox groups (values returned as an array)
		
			if(0)
			{
				var values = XUL.create('checkboxgroup:Items=[Movieclips,Graphics,Buttons,Classes],title:Checkbox Group');
				Output.inspect(values)
			}
			
		// --------------------------------------------------------------------------------
		// Inspect combo controls
		
			if(0)
			{
				
				/**
				 * Click handler for button press
				 * @param	event	{XULEvent}
				 */
				function click(event)
				{
					trace('CLICK: ' + event)
					Output.inspect(event, true, {'function':false, 'xml':false})
					/*
					trace(xul.controls.radio);
					trace(xul.controls.radio.value);
					trace(xul.controls.radio.getXML());
					*/
					//trace(xul.controls.radio.values);
					/*
					var values =
					{
						radio:		xul.controls.radio.values, 
						listbox:	xul.controls.listbox.values, 
						dropdown:	xul.controls.dropdown.values
					}
					Output.inspect(values)
					*/
				}
				
				var xul = XUL.factory()
					.setTitle('Combo control values')
					.addRadiogroup('Radio', null, [1,2,3])
					.addListbox('Listbox', null, [4,5,6])
					.addDropdown('Dropdown', null, [7,8,9])
					.addButton('See values', 'button', null, {command:click});
					
				var settings = xul.show();
				Output.inspect(xul.settings, 'Settings');
				
			}
			
		// --------------------------------------------------------------------------------
		// Automatic parsing of settings to correct datatypes
		
			if(0)
			{
				var options = <text><![CDATA[
					title:This is a HUGE dialog!,
					button:Click me now!,
					checkbox:Delete,
					radiogroup:Pick=[1,2,3,4],
					checkboxgroup:Classes=[movieclip,graphic,button,font,video],
					colorchip:Color=0xABCDEF,
					file:Open file,
					save:Save file,
					flash:Flash=swf/splash.swf,
					label:This is a label,
					listbox:Values={one:1,two:2,three:3,four:4},
					menulist:More Values={one:One,two:Two,three:Three,four:Four},
					popupslider:Slider=[100,0,1000],
					targetlist:Instance,
					textbox:Text=Hello there I am text,
					property:test1,
					property:test2
					]]>
				</text>.toString()
				
				var values = XUL.create(options);
				Output.inspect(values, 'Automatic parsing of settings');
			}
			
		// --------------------------------------------------------------------------------
		// Ranges
		
			if(0)
			{
				function color(r, g, b)
				{
					trace('#' + r.toString(16) + g.toString(16) + b.toString(16))
				}

				XUL.create('numeric:Red=[0,0,255], numeric:Green=[0,0,255], numeric:Blue=[0,0,255], title:Mixer', color)
			}
			
		// --------------------------------------------------------------------------------
		// File
		
			if(0)
			{
				var settings = XUL.create('file:Open file,save:Save file');
				Output.inspect(settings);
			}
			
		// --------------------------------------------------------------------------------
		// Smart parsing of labels as ids
		
			if(0)
			{
				var values = XUL.create('numeric:Size (pixels), numeric:Width (pixels), numeric:Alpha (%),title:Something');
				Output.inspect(values);
			}

		// --------------------------------------------------------------------------------
		// Nested dialogs and capturing the return values
		
			if(0)
			{
				// global settings
					var settings = {};
					
				// event handler to make a new dialog
					function newDialog()
					{
						// create dialog
							var xul = XUL
								.factory('radiogroup:Options=[1,2,3],dropdown:Values=[One,Two,Three],checkbox:State,|,button:New dialog')
								.addEvent('newdialog', 'command', newDialog)
								.setTitle('Dialog ' + (xjsfl.ui.dialogs.length + 1))
								.show();
								
						// assign the values to the global settings object
							settings[xul.title]	= xul.values;
					}
					
				// create the first dialog
					newDialog();
					
				// view the results
					Output.inspect(settings);
			}

		// --------------------------------------------------------------------------------
		// Custom XML
		
			if(0)
			{
				XUL
					.factory()
					.setTitle('Custom XML')
					.setXML(<xml><textbox width="300" value="I am a textbox" /> <button id="button" label="...and I am a mighty button!" width="300" /></xml>)
					.addEvent('button', 'command', function(){alert('But I can still have events assigned :)')})
					.show()
					
			}
		
		// --------------------------------------------------------------------------------
		// Events, callbacks, and OO control of UI elements
		
			if(0)
			{
				// callback
					/**
					 * Event handler
					 * @param	event	{XULEvent}
					 * @returns		
					 */
					function onControlEvent(event)
					{
						// output
							clear();
							
						// inspect parameters
							trace(event);
							
						// if the id is the textbox, update the other textbox
							if(event.control.id == 'textbox1')
							{
								// Note that this is OO! : "event.control.value" NOT "fl.xmlui.set(id, value)"
								event.xul.controls.textbox2.value = event.control.value.split('').reverse().join('');
							}
							
							if(event.control.id == 'button')
							{
								Output.inspect(event.xul.events)
							}
					}
					
				// controls
					var options = <text><![CDATA[
						button:button=Click me!,
						colorchip:Color=0xABCDEF,
						listbox:Listbox={one:1,two:2,three:3,four:4},
						menulist:Menulist={one:1,two:2,three:3,four:4},
						popupslider:Slider=[100,0,1000],
						textbox:Textbox 1=Hello there I am text,
						textbox:Textbox 2,
						]]>
					</text>.toString()
					
				// create
					XUL
						.factory(options)
						.setTitle('Dialog with events')
						.addEvent('button', 'command', onControlEvent)
						.addEvent('color', 'change', onControlEvent)
						.addEvent('listbox', 'change setfocus', onControlEvent)
						.addEvent('menulist', 'change setfocus', onControlEvent)
						.addEvent('popupslider', 'change', onControlEvent)
						.addEvent('textbox1', 'change', onControlEvent)
						.show();
			}
			
		// --------------------------------------------------------------------------------
		// Initialization event
		
			if(0)
			{
				// callback
					function onInitialize(event)
					{
						event.xul.controls.text.value = 'Initialized!';
					}
					
				// create
					XUL
						.factory()
						.setTitle('Dialog with initiaze event')
						.addTextbox('Text', 'text')
						.addEvent('initialize', onInitialize)
						.show();
			}
		

		// catch
			}catch(err){xjsfl.output.debug(err);}
		
	}
		

