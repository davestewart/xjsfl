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
		 * @param	props	
		 * @param	accept	
		 * @param	cancel	
		 * @returns		
		 */
		function XUL(title)
		{
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
						this.controls	= [];
						this.settings	= {};
						this.events		= {};
						this.rules		= {};
						this.widths		= {left:80, right:150}, 
						this.error		= null;
						//TODO implement right widths, and ensure appropriate elements flex to fill
						
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
		 * @param	props	{String}	
		 * @param	props	{Function}	
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
				if(xul.xml && props && props != null && typeof props != 'undefined')
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
			return null;
		}
		
		/**
		 * Static convenience method to create and show interface in one call
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
				var xul = XUL.factory(props)
				
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
					xml:		null,
					built:		false,
					
				// properties
					controls:	[],
					settings:	{},
					events:		{},
					rules:		{},
					widths:		{left:100, right:200},
					
				// template
					content:	'',
					separator:	'</rows></grid><separator /><grid><columns><column flex="1" /><column flex="2" /></columns><rows>',
					
				// last error message
					error:		null,
					
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
								var value = control.getValue(this.settings);
								values[id] = value;
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
							id					= id || label.toLowerCase().replace(/[^a-z0-9]/g, '');
							if(xml.label.length())
							{
								xml.label.@value = label ? label + ':' : '';
							}
							
						// check id is not already defined
							if(this.controls[id])
							{
								throw new Error('XUL: Cannot add <' +type+ '> control - duplicate id "' +id+ '"');
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
							this.controls[id] = new Control(id, type, attributes ? attributes.value : '', xml);
							this.addXML(xml, false, true);
							
						// debug
							//trace(xml)
							
						// return
							return this;
					},
					
					_addChildren:function(parent, values, id)
					{
						// child element
							var list			= parent.*;
							var itemTemplate	= list[0].copy();

						// delete old list items
							while(list.length())
							{
								delete list[0];
							}
							
						// add new items
							var i = 0;
							for each(var value in values)
							{
								var item		= itemTemplate.copy();
								item.@value		= value.value;
								item.@label		= value.label;
								if(id)
								{
									item.@id	= id + '[' + i + ']';
								}
								list[i++]		= item;
							}
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
								checkbox:		'create',
								radio:			'create',
								colorchip:		'create change',
								expression:		'create change',
								flash:			'create',
								listbox:		'create change setfocus',
								menulist:		'create change setfocus',
								popupslider:	'create',
								targetlist:		'create',
								textbox:		'create change',
								property:		''
							};
							
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
									
								// assign handler
									for each(var event in events)
									{
										node.@['on' + event] = "xjsfl.ui.current.handleEvent('" +event+ "', '" +id+ "')";
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
							var types	= 'button,checkbox,colorchip,listbox,menulist,popupslider,targetlist,textbox'.split(',');
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
												throw new Error('XUL: Cannot add <' +type+ '> control - duplicate id "' +id+ '"');
											}
											
										// store then clear value, otherwise it will always re-appear when the textbox is reshown
											this.settings[id]	= value.toString();
											control.@value		= '';
											
										// add control
											this.controls[id]	= new Control(id, type, value, controlXML);
										
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
							id					= id || label;
						
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
					 * Add a Pextbox control to the UI
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
							xml.@width			= this.widths.left + this.widths.right;
							
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
							
						// Parse XML for new controls, and if found, add event handlers, and add to Control array for validation
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
					 * @param	id			{String}	The id of the element to register the callback for
					 * @param	type		{String}	The type of callback. Values can be create, change, setfocus, command
					 * @param	callback	{Function}	The callback to call. Format must be function(xmlui, xul, object, value, type, id){ ... }
					 * @returns		
					 */
					addEvent:function(id, type, callback)
					{
						// add event
							if(this.events[type] == null)
							{
								this.events[type] = {};
							}
							this.events[type][id] = callback;
							
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
											
													case 'widths':
														//this.setWidths(parseInt(label));
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
					this.content = xml;
					return this;
				},
			
				setTitle:function(title)
				{
					if(this.xml)
					{
						this.xml.@title = ' ' + title;
					}
					return this;
				},
				
				setWidths:function(left, right)
				{
					if(right == null)
					{
						this.widths.right = left;
					}
					else
					{
						this.widths = {left:left, right:right};
					}
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
							throw new Error('XUL saveAs uri must end with ".xml"');
						}
						
					// make URI
						uri = xjsfl.utils.makeURI(uri);
						this.uri = uri;
						
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
							// initialized
								case 'initialized':
								case 'prevalidation':
								case 'postvalidation':
									if(this.events[type])
									{
										var callback = this.events[type];
										if(typeof callback == 'function')
										{
											callback(fl.xmlui, this);
										}
									}
								break;
							
							// set default / restore last value
								case 'create':
									if(this.settings)
									{
										var value = this.settings[id];
										if(value !== undefined)
										{
											fl.xmlui.set(id, value);
										}
									}
								//break;
							
							// change, command, setfocus
								case 'change':
								case 'command':
								case 'setfocus':
									if(this.events[type] && this.events[type][id])
									{
										var callback = this.events[type][id];
										if(typeof callback == 'function')
										{
											//TODO Fix problem of colors disappearing when these commands are outside of this if() & check if adding callbacks screws it up too
											object	= fl.xmlui.getControlItemElement(id);
											value	= fl.xmlui.get(id);
											callback(fl.xmlui, this, object, value, id, type)
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
					if(xjsfl.dom)
					{
						// --------------------------------------------------------------------------------
						// settings
	
							var uri		= this.uri || xjsfl.utils.makeURI('core/ui/dialog.xml');
							
						// --------------------------------------------------------------------------------
						// build panel for the first time
	
							// build panel
								if(this.built == false)
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
											label.@width = this.widths.left;
										}
			
									// replace separators
										var str		= this.xml.toXMLString().replace(/<row template="separator"\/>/g, this.separator);
										this.xml	= new XML(str);
										
									// debug
										//trace(this.xml.toXMLString())
								
									// flag as built
										this.built = true;
								}
								
							// update checkboxes, as they can't seem to be updated via JSFL (prove me wrong, someone!)
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
								
							// save XML to dialog.xml
								new File(uri, this.xml, true);
								

						// --------------------------------------------------------------------------------
						// show panel
	
							// register with xjsfl.ui
								xjsfl.ui.add(this);
	
							// show panel
								this.settings	= dom.xmlPanel(uri);
								
								//Output.inspect(this.settings)
								
						// --------------------------------------------------------------------------------
						// process result
						
							// get control values and convert to array for callbacks
								if(accept || cancel)
								{
									var args = xjsfl.utils.getValues(this.values);
								}
	
							// test for validation
								if(this.settings.dismiss == 'accept')
								{
									// validate
									
										// reset error
											this.error = null;
											
										// loop over controls and request validation
											for each(var control in this.controls)
											{
												var error = control.validate(this.settings);
												if(error != null)
												{
													this.error = error;
													break;
												}
											}
											
									// didn't validate - alert error and show again
										if(this.error)
										{
											alert(this.error)
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
								
							// unregister from from xjsfl ui
								xjsfl.ui.remove();
					}
						
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
				 * Returns the String representation of the Template
				 * @returns		
				 * @author	Dave Stewart	
				 */
				toString:function()
				{
					return '[object XUL]';
				}
		}
		
		
	// ------------------------------------------------------------------------------------------------
	// Supporting classes
	
		/**
		 * Control class to hold information about instantiated control elements
		 * @param	type	{String}	The type (tag name) of the control item
		 * @param	value	{Value}		The original value the control contains
		 * @param	xml		{XML}		The XML of the control, that will be added to the UI
		 * @returns		
		 */
		function Control(id, type, value, xml)
		{
			// properties
				this.id			= id;
				this.type		= type;
				this.value		= value;
				
			// flags
				this.enumerable	= ! /^button|flash$/.test(type);
		}
		
		Control.prototype = 
		{
			// properties
				id:				'',
				type:			'',
				value:			'',
				xml:			null,
				
			// flags
				enumerable:		true,
				
			// getters / setters
				getValue:function(settings)
				{
					// grab the current (String) value for the control
						var value = settings[this.id];
						
					// parse to a real value
						switch(this.type)
						{
							case 'checkboxgroup':
								var arr		= [];
								var items	= this.xml..checkbox;
								for each(var item in items)
								{
									var id		= item.@id.toString();
									var value	= xjsfl.utils.parseValue(item.@value.toString());
									if(settings[id] == 'true')
									{
										arr.push(value)
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
				
				//TODO Implement proper validation using rules, and the Validation class
				validate:function(settings)
				{
					var value = this.getValue(settings);
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
					return '[object Control id:"'+this.id+'" type:"'+this.type+'"]';
				}
				
		}
		
	// ---------------------------------------------------------------------------------------------------------------
	// register
	
		xjsfl.classes.register('XUL', XUL);
		

// ---------------------------------------------------------------------------------------------------------------
// test code
	
	
	if( ! xjsfl.loading )
	{
		// initialize
		
			xjsfl.init(this)
			clear();
			
			function callback(xmlui, xul, element, value, id, type){Output.inspect({id:id, type:type, value:value}, 'Callback')}
			
			/*
			var xul = XUL.factory();//'button:export=Export,button:import=Import,xml:<hbox><spacer /><button /><checkbox /></hbox>');
			xul
				//.addButton('Import', null, null, {command:callback})
				//.addButton('Export', null, null, {command:callback})
				//.addButton('Test', null, null, {command:callback})
				//.addXML('<spacer /><textbox id="text" width="300" value="This is some text" />')
				//.addTextbox('Temp', 'text', {value:'Test', multiline:true})
				.addXML('<spacer /><textbox id="text" width="300" value="This is some text" />')
				.addTextbox('Temp', 'temp', {value:'Test', multiline:true})
				
				//.addEvent('text', 'change', callback)
				//.addEvent('text', 'create', callback)
				//.addEvent('temp', 'change', callback)
				
				.show()
				*/

		
		// callback functions
		
			function test(x, y, z)
			{
				trace(x * y * z)
			}
			
			function color(r, g, b)
			{
				trace('#' + r.toString(16) + g.toString(16) + b.toString(16))
			}
			
			function fail()
			{
				alert('Oh dear!')
			}
			
			function check()
			{
				alert('Hello!')
				return true;
			}
			
			function accept(settings)
			{
				//Output.inspect(xjsfl.utils.getArguments(arguments), 'Accept')
			}
			
			xjsfl.reload();
			
			/*
			var results = XUL()
				.add({name:'String', age:'Number', options:[null,1,2,3,4,5], params:{name:'Dave'}})
				.addTextfield('name', {required:true, label:'Enter your name', prompt:'Name', oncreate:check})
				.show(test, fail)
				.settings
				*/
				
			//var results = XUL.create({name:'String', age:'Number', options:[null,1,2,3,4,5], params:{name:'Dave'}})
			
		// demo function
		
			function demo()
			{
				//var results = XUL.create('One,Two,Three', test);
				//var settings = XUL.create('listbox:Names=[1,2,3,4],xcolorchip:Color,button:Hello,Some Value');
				//var settings = XUL.create('My Name=Dave,|popupslider:Age=0,colorchip:Color,checkbox:Delete,checkbox:Amend,title:This is a dialog,width:100');
				
				/*
				var ui = XUL.factory()
							.addButton('button', null, null, null, {command:function(ui, object, value, id, type){ui.set('y', '0xFF0000'); ui.setControlItemElement('list', {label:'dave', value:'asas'})}})
							.addTextbox('X', null, null, null, {change:function(ui, object, value, id, type){ui.set('y', value)}})
							.addPopupslider('Y')
							.addListbox('list')
							.setTitle('Some dialog')
							.show(test)
				*/
				
				
				//var settings = XUL.create('Name,|,checkboxgroup:Items=[Movieclips,Graphics,Buttons,Classes], menulist:Y=[1,2,3,4],title:Some dialog', test);
				
				var text = <text><![CDATA[
					button:Click me now!,
					checkbox:Delete,
					checkboxgroup:Classes=[movieclip,graphic,button,font,video],
					radiogroup:Pick=[1,2,3,4],
					colorchip:Color=0xABCDEF,
					expressionExpression=3 + 4,
					flash:Splash=swf/splash.swf,
					label:This is a label,
					listbox:Values={one:1,two:2,three:3,four:4},
					menulist:More Values={one:1,two:2,three:3,four:4},
					popupslider:Slider=[100,0,1000],
					targetlist:Instance,
					textbox:Text=Hello there I am text,
					property:test1,
					property:test2,
					]]>
				</text>
				
				//var str = "button:Click me now!,checkbox:Delete,checkboxgroup:Indices=[1,2,3,4],colorchip:Color=0xFF0000,expression:Expression=3 + 4,flash:Instance,label:This is a label,listbox:Values={one:1,two:2,three:3,four:4},menulist:More Values={one:1,two:2,three:3,four:4},popupslider:Slider=45,targetlist:Pick an item,textbox:Text=Hello there I am text";
				
				/*
				var xul = XUL
					.factory(text.toString())
					.addEvent('name', 'change', function(xmlui, xul, control, value, id, type){ alert(value)})
					.setTitle('This is a custom dialog')
					.saveAs('user/ui/test.xml')
					.show();
					*/
				
				var values = XUL.create('numeric:Size (%), numeric:Width (%), numeric:Alpha (%),title:Something');
				Output.inspect(values);
				
				//XUL.create('numeric:Red=[0,0,255], numeric:Green=[0,0,255], numeric:Blue=[0,0,255], title:Mixer', color)
				
				//var settings = XUL.create('color:Color 1=0xFF0000, color:Color 2=#00FF00, color:Color 3=0000FF, title:Mixer', color)
				
				//Output.inspect(window.xul ? window.xul.values : window.settings)
				
				/*
				if(xul)
				{
					Output.inspect(xul.values);
					//trace(results);
				}
				*/
			}
			
			
			
			// test
			
			xjsfl.utils.test(demo);
				
			//Output.inspect(results);
			
			//xjsfl.classes.register('XUL', XUL);

	}


