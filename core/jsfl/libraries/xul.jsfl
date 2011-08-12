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
		 * @param	title	{String}	The title of the new dialog
		 * @returns			{XUL}		A new XUL instance
		 */
		function XUL(title)
		{
			//TODO Allow a file: uri to be passed into the constructor
			
			//TODO Consider making XUL driver-based, so basic controls are constructed using the core, but can be wrapped with additional markup using driver-based methods
			//TODO Alternatively, have an additional XULBuilder class, so code and presentation are kept separate
			
			//TODO Add functionality for basic arithmetic to be performed inside textboxes
			
			// public properties
				this.xml		= xjsfl.file.load('template', 'xul/dialog.xml');
				this.controls	= {};
				this.settings	= {};
				
			// private properties
				this.events		= {};
				this.rules		= {};
				this.columns	= [80, 150], 
				this.error		= null;
				this.id			= -1;
				
			// load controls
				var xml			= xjsfl.file.load('template', 'xul/controls.xml');
				for each(var node in xml.grid.rows.*)
				{
					XUL.templates[node.@template.toString()] = node.copy();
				}
				
				//TODO columns flex properly, and ensure appropriate elements flex to fill
				
			// set title if provided
				this.setTitle(title || 'xJSFL');
				
			// return
				return this;
		
		}
		
		
	// ------------------------------------------------------------------------------------------------
	// XUL static methods & properties
	
		/**
		 * Static convenience method to instantiate and return a new chainable XUL instance
		 * @param	props	{String}	An optional shorthand controls String
		 * @param	props	{Function}	An optional Function
		 * @returns			{XUL}		A XUL class
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
								//cancel = accept;
								//accept = props;
								
							// parse and assign controls
								props = XUL.prototype._parseFunction(props);
								for each(var prop in props.params)
								{
									xul.addTextbox(prop);
								}
								
							// title
								xul.setTitle('Dialog for "' + props.name + '"');
						}
						
					// props is XML, use set XML
						else if(typeof props == 'xml')
						{
							xul.setXML(props);
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
		 * @param	props	{String}		A String of shorthand controls
		 * @param	props	{Function}		A Function, the parameters of which will map to dialog controls
		 * @param	accept	{Function}		An optional callback function to be called when the user clicks the OK button
		 * @param	cancel	{Function}		An optional callback function to be called when the user clicks the Cancel button
		 * @returns			{Object}		An Object containing the accepted values, or null if the user cancels the dialog
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
					 * @type {Object} The values of the dialog controls parsed into their correct data types
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
						values.accept = this.settings && this.settings.dismiss == 'accept';
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
					 * @param	type		{String}	The control type, i.e. button, colorchip, etc
					 * @param	id			{String}	The control id
					 * @param	label		{String}	The control label
					 * @param	xml			{XML}		The original XML of the control, built by the appropriate addControl method
					 * @param	attributes	{Object}	Any additional attributes that should be applied to the control XML
					 * @param	validation	{Object}	Any validation rules that should be applied to the control
					 * @param	events		{Object}	An Object containing event:callback pairs
					 * @param	user		{Boolean}	An optional Boolean containing event:callback pairs
					 * @returns				{XUL}		The XUL dialog
					 */
					_addControl:function(type, id, label, xml, attributes, validation, events, user)
					{
						// element
							var element			= user ? xml : xml[type][0];

						// label
							id					= id || this._makeId(label);

							if(xml.label && xml.label.length())
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
								for(var attr in attributes)
								{
									if(/^(value|checked)$/.test(attr))
									{
										// need to add / set values using JavaScript (rather than in XML) or else the field will always show initial values when being re-shown
										this.settings[id] = attributes[attr];
									}
									else
									{
										element['@' + attr] = attributes[attr];
									}
								}
							}
							
						// combo / selected
							
						// special cases

							// target list
								switch(type)
								{
									case 'targetlist':
										var property = xml['property'][0];
										property.@id = id;
									break;
								
									case 'radiogroup':
									case 'menulist':
									case 'listbox':
										var selected		= xml.find(function(element){return element.@selected && element.@selected == 'true';}, true);
										this.settings[id]	= selected.@value;
										//trace('>>' + selected.toXMLString())
									break;
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

						// set control
							this.controls[id] = new XULControl(id, type, this, xml);
							if(user !== true)
							{
								this.addXML(xml, false, true);
							}
							
						// debug
							//trace(xml)
							
							
						// return
							return xml;
					},
					
					/**
					 * Updates supplied XML with new child items parent
					 * @param	parent		{XML}		An XML parent node. Child items are updated by reference
					 * @param	values		{Array}		The values (values, or {label:'',value:''} Objects) of each of the new elements you want to add
					 * @param	id			{String}	The id of the new control
					 * @param	selected	{String}	The value of the selected item
					 * @returns				{XML}		The XML of the new children (altough the original parent is altered by reference anyway)
					 */
					_addChildren:function(parent, values, id, selected)
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
							var subId;
							for(var name in values)
							{
								// TODO: possibly add in check to skip prototype values in for loop
								
								// variables
									var value			= values[name];
									var item 			= itemTemplate.copy();
									
								// create item
									if(value.label) // value is an object {label:'Label', value:'some value'}
									{
										item.@value		= value.value;
										item.@label		= value.label;
										subId			= value.value;
									}
									else
									{
										if(xjsfl.utils.isArray(values))
										{
											item.@value		= value;
											item.@label		= value;
											subId			= value;
										}
										else
										{
											item.@value		= value;
											item.@label		= name;
											subId			= value;
										}
									}
									
								// item id
									if(id)
									{
										item.@id		= id + '[' + subId + ']';
									}
									
								// selected
									if((selected === undefined && i === 0) || value == selected)
									{
										item.@selected = true;
									}
									else
									{
										delete item.@selected;
									}
									
								// add
									items[i++]			= item;
							}
							
						// return parent
							return parent;
					},
					
					/**
					 * Add validation to an individual control (not yet implemented)
					 * @param	id			{String}	The id of the control
					 * @param	validation	
					 * @returns				{XUL}		The XUL dialog
					 */
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
						return this;
					},
					
					/**
					 * Add events to an individual control
					 * @param	id			{String}	The id of the control
					 * @param	events		{Object}	An Object containing event:callback pairs
					 * @returns				{XUL}		The XUL dialog
					 */
					_addEvents:function(id, events)
					{
						for(var name in events)
						{
							this.addEvent(id, name, events[name]);
						}
						return this;
					},
					
					/**
					 * Parse user-supplied XML so that XULControls are created
					 * @param	xml	{XML}		An XML element containing valid XMLUI control elements
					 * @returns		{XMLList}	The child XML control elements
					 */
					_parseUserXML:function(xml)
					{
						// add xml under a temp root node, so we can find any top-level control nodes passed in
							xml = new XML('<temp>' + xml.toXMLString() + '</temp>');
							
						// loop through control types, and attempt to find and add to controls array
							var types	= 'textbox,popupslider,checkbox,colorchip,choosefile,button,listbox,menulist,radiogroup,targetlist,property'.split(',');
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
											
										// add control
											this._addControl(type, id, null, control, {value:value}, null, null, true);
									}
								}
							}
							
						// xml
							return xml.children();
					},
					
					_makeId:function(id)
					{
						return id.split(/[^\d\w ]/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
					},
					
				// --------------------------------------------------------------------------------
				// shorthand addition of controls
				
					/**
					 * Add control using shorthand notation
					 * @param	str		{String}	A string of the format "type:Label=values,type:Label=values, ..."
					 * @returns			{XUL}		The XUL dialog
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
														this.addCheckbox(label, null, {checked:value});
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
														this.addFile(label, null);
													break;
	
													case 'savefile':
													case 'save':
														this.addFile(label, null, {value:'', type:'save'});
													break;
	
													case 'flash':
														this.setFlash(label, control, value);
													break;
	
													case 'numeric':
													case 'slider':
													case 'popupslider':
														this.addSlider(label, null, value);
													break;
	
													case 'targetlist':
														this.addTargetlist(label, null, {value:value});
													break;
	
													case 'text':
													case 'textbox':
													case 'textfield':
														this.addTextbox(label, null, {value:value});
													break;
												
													case 'textarea':
														this.addTextbox(label, null, {value:value, multiline:true});
													break;
												
												// compound controls
												
													case 'checkboxgroup':
													case 'checkboxes':
														this.addCheckboxgroup(label, null, value);
													break;
	
													case 'radiogroup':
													case 'radios':
													case 'radio':
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
												xjsfl.output.debug('XUL.add(): Undefined control type "' +control+ '"');
											}
									}
									
								// output
									//Output.inspect([xjsfl.utils.trim(matches[0]), control, label, value], 'Add');
									
									
							}
							
						// return
							return this;
					},
				
				// --------------------------------------------------------------------------------
				// single controls
				
					/**
					 * Add a Textbox control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addTextbox:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.textbox.copy();
						
						// add control
							xml					= this._addControl('textbox', id, label, xml, attributes, validation, events);
							return this;
					},
					
					/**
					 * Add a Popupslider control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	values		{Array}		An optional Array of values [default, min, max]
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addSlider:function(label, id, values, attributes, validation, events)
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
							xml					= this._addControl('popupslider', id, label, xml, attributes, validation, events);
							return this;
					},

					/**
					 * Add a Checkbox control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addCheckbox:function(label, id, attributes, validation)
					{
						// build xml
							var xml				= XUL.templates.checkbox.copy();
							xml.checkbox.@label = label;
							id					= id || this._makeId(label);
							label				= '';
						
						// add control
							xml					= this._addControl('checkbox', id, label, xml, attributes, validation);
							return this;
					},

					/**
					 * Add a Colorchip control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes [value, format]
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addColorchip:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.colorchip.copy();
							
						// values
							var value = attributes.value;
							if(value)
							{
								value = String(attributes.value);
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
									if(!isNaN(parseInt(attributes.value)))
									{
										attributes.value = '#' + xjsfl.utils.pad(parseInt(value).toString(16).toUpperCase());
									}
									else
									{
										attributes.value = '#' + value;
									}
								}
							}
							//Output.inspect(attributes)
						
						// add control
							xml					= this._addControl('colorchip', id, label, xml, attributes, validation, events);
							return this;
					},

					/**
					 * Add a Choosefile control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addFile:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.choosefile.copy();
							//Output.inspect(attributes, 'Attributes')
							
						// add control
							xml					= this._addControl('choosefile', id, label, xml, attributes, validation, events);
							return this;
					},

					/**
					 * Add a Expression control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addExpression:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.expression.copy();
							//trace('ADD EXPRESSION:' + attributes.value);
						
						// add control
							xml					= this._addControl('expression', id, label, xml, attributes, validation, events);
							return this;
					},
					
					/**
					 * Add a Button control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addButton:function(label, id, attributes, events)
					{
						// build xml
							var xml				= XUL.templates.button.copy();
							attributes			= attributes || {};
							attributes.label	= label;
							id					= id || this._makeId(label);
						
						// add control
							xml					= this._addControl('button', id, '', xml, attributes, null, events);
							return this;
					},


				// --------------------------------------------------------------------------------
				// multiple-value controls
				
					/**
					 * Add a Listbox control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addListbox:function(label, id, values, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.listbox.copy();
							
						// add child items
							var parent			= xml..listbox;
							this._addChildren(parent, values);
							
						// add control
							xml					= this._addControl('listbox', id, label, xml, attributes, validation, events);
							return this;
					},

					/**
					 * Add a Menulist control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addDropdown:function(label, id, values, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.menulist.copy();
							var parent			= xml..menupop;
						
						// add child items
							this._addChildren(parent, values);
							
						// add control
							xml					= this._addControl('menulist', id, label, xml, attributes, validation, events);
							return this;
					},
					
					/**
					 * Add a RadioGroup to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addRadiogroup:function(label, id, values, attributes)
					{
						// build xml
							var xml				= XUL.templates.radiogroup.copy();
							
						// add child items
							var parent			= xml..radiogroup;
							this._addChildren(parent, values, id, attributes ? attributes.selected : null);
						
						// add control
							xml					= this._addControl('radiogroup', id, label, xml, attributes);
							return this;
					},
					
					/**
					 * Add a CheckboxGroup to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addCheckboxgroup:function(label, id, values, attributes, validation)
					{
						// build xml
							var xml				= XUL.templates.checkboxgroup.copy();
						
						// add child items
							var parent			= xml..vbox;
							this._addChildren(parent, values, id || label.toLowerCase());
							
						// add control
							xml					= this._addControl('checkboxgroup', id, label, xml, attributes, validation);
							return this;
					},

					/**
					 * Add a Targetlist control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	attributes	{Object}	Optional attributes
					 * @param	validation	{Object}	Optional validation properties
					 * @param	events		{Object}	Optional event callbacks
					 * @returns				{XUL}		The XUL dialog
					 */
					addTargetlist:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.targetlist.copy();
						
						// add control
							xml					= this._addControl('targetlist', id, label, xml, attributes, validation, events);
							return this;
					},
					
					/**
					 * Add an invisible property control to the UI
					 * @param	id		{String}	A unique id so the value can be retrieved from the settings object
					 * @returns			{XUL}		The XUL dialog
					 */
					addProperty:function(id)
					{
						// build xml
							var xml		= XUL.templates.property.copy();
							xml.@id		= id;
							
						// add xml
							//this.addXML(xml);
							xml					= this._addControl('property', id, id, xml);
							return this;
							
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
					 * @returns					{XUL}		The XUL dialog
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
					
				// --------------------------------------------------------------------------------
				// other elemnts methods
				
					/**
					 * Add a separator element to the dialog
					 * @param	label		{String}	An optional labal to add beneath the separator
					 * @returns				{XUL}		The XUL dialog
					 */
					addSeparator:function(label)
					{
						//FIX Work out why separators don't make it into the final XUL.
						// Is this because the non-controls are being added to a separate XML buffer? Compare to _addControl()
						
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
				
					/**
					 * Add a spacer element to the dialog
					 * @returns		{XUL}		The XUL dialog
					 */
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
					 * @returns				{XUL}		The XUL dialog
					 */
					addLabel:function(label, id)
					{
						// build xml
							var xml				= XUL.templates.label.copy();
							var sum				= 0; this.columns.forEach( function(e){sum += e} );
							xml.@width			= sum;
							xml.@value			= label;
							
						// add xml
							this.addXML(xml);
							
						// return
							return this;
					},

					/**
					 * Adds a script source to the interface
					 * @param	script	{Function}
					 * @returns			{XUL}		The XUL dialog
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
					

				// --------------------------------------------------------------------------------
				// custom controls
				
					/**
					 * Add a Flash control to the UI
					 * @param	label		{String}	A label for the UI item
					 * @param	id			{String}	An optional id, otherwise derived from the label
					 * @param	source		{String}	Source path to the SWF, relative to the XML saved location
					 * @param	properties	{Array}		An array of property names to be created
					 * @param	attributes	{Object}	Optional attributes
					 * @returns				{XUL}		The XUL dialog
					 */
					setFlash:function(src, width, height, properties)
					{
						// build xml
							var xml			= XUL.templates.flash.copy();
							var uri			= xjsfl.file.makeURI(src);
							xml..flash.@src	= src;
							
						// add control and set XML
							xml					= this._addControl('flash', 'flash', null, xml, {width:width, height:height});
							this.setXML(xml);
							
						// properties
							for each(var property in properties)
							{
								this.addProperty(property);
							}
							
						// update size
							this.xml.@width		= width;
							this.xml.@height	= height;
							
						// return
							return this;
					},

					/**
					 * Replace the standard XML dialog template
					 * @param	xml		{String}	An XML String containing dialog controls
					 * @returns			{XUL}		The XUL dialog
					 */
					setXML:function(xml)
					{
						this.controls	= {};
						this.events		= {};
						this.settings	= {};
						delete this.xml..content.*
						this.xml..content.@id	= 'controls'
						this.content			= this._parseUserXML(new XMLList(xml));
						return this;
					},


			// --------------------------------------------------------------------------------
			// Set methods
			
				/**
				 * Sets the initial values of controls in the dialog
				 * @param	values	{Object}	A hash of control:value values
				 * @returns			{XUL}		The XUL dialog
				 */
				setValues:function(values)
				{
					//TODO Add support for checkbox groups
					//TODO Re-evaluate the logic behind using XMLUI.settings, and think about using XUL.values
					for(var id in values)
					{
						var control = this.controls[id];
						if(control)
						{
							this.settings[id] = String(values[id]);
						}
					}
					return this;
				},
				
				/**
				 * Assign values from a miscellaneous property object
				 * @param	props	{Object}	An object of key:value pairs. Valid keys are: title
				 * @returns			{XUL}		The XUL dialog
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
				 * Set the default buttons of the XMLUI dialog
				 * @param	str		{String}	A comma delimted string of valid button types, e.g. "accept,cancel"
				 * @returns			{XUL}		The XUL dialog
				 */
				setButtons:function(str)
				{
					this.xml.@buttons = str;
					return this;
				},
				
				/**
				 * Set the widths of the dialog's columns
				 * @param	columns	{Array}		An array of Number pixel widths
				 * @returns			{XUL}		The XUL dialog
				 */
				setColumns:function(columns)
				{
					this.columns = columns;
					return this;
				},
				
				/**
				 * Set the title of the dialog
				 * @param	title	{String}	A String title
				 * @returns			{XUL}		The XUL dialog
				 */
				setTitle:function(title)
				{
					if(this.xml)
					{
						this.xml.@title		= ' ' + title;
						this.title			= title;
					}
					return this;
				},
				
				
			// --------------------------------------------------------------------------------
			// event handling
			
					/**
					 * Add (or actually, set) a event callback for an id
					 * @param	ids			{String}	The id(s) of the element to register the callback for
					 * @param	types		{String}	The type(s) of callback. Values can be create, change, click, setfocus. Separate multiple types with spaces or commas if required
					 * @param	callback	{Function}	The callback to call. Format must be function(event){ ... }
					 * @returns				{XUL}		The XUL dialog
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
								// update "click" events to "command" events
									types	= types.replace(/click/g, 'command');
								
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
					
				/**
				 * Set the scope in which events will run
				 * @param	scope	{Object}	The object in which you want events to be called in
				 * @returns			{XUL}		The XUL dialog
				 */
				setEventScope:function(scope)
				{
					this.scope = scope;
					return this;
				},
				
				/**
				 * Handles all events in the XUL dialog
				 * @param	type	{String}	The event type
				 * @param	id		{String}	The control id
				 */
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
									
									// set all values
										for each(var control in this.controls)
										{
											control.update(this.settings);
										}
									
								case 'prevalidate':
								case 'postvalidate':
									if(this.events[type])
									{
										var callback = this.events[type];
										if(typeof callback == 'function')
										{
											var event = new XULEvent(type, null, this, fl.xmlui);
											callback.apply(this.scope || this, [event]);
										}
									}
								break;
							
							// create
								case 'create':

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
												var value	= fl.xmlui.get(id);
												
											// dispatch event
												//callback(control, this, fl.xmlui, type) // control, xul, xmlui, type
												callback.apply(this.scope || this, [event]);
										}
									}
								break;
						}
						
					// debug
						//trace('Event:' + [fl.xmlui, this, object, value, id, type])
					
				},
				
			// --------------------------------------------------------------------------------
			// show
			
				/**
				 * Save the dialog in a particular location so custom Flash controls can reference the src attribute properly
				 * @param	uri		{String}	A valid URI of where to save the dialog's XML file
				 * @returns			{XUL}		The XUL dialog
				 */
				saveAs:function(uri)
				{
					// check file is an XML file
						if( ! /\/[^\/]+\.xml/.test(uri))
						{
							throw new Error('XUL.saveAs(): dialog uri must end with an .xml extension');
						}
						
					// make URI
						uri			= xjsfl.file.makeURI(uri);
						this.uri	= uri;
						
					// return
						return this;
				},
				
				/**
				 * Shows the XUL dialog
				 * @param	accept	{Function}	An optional function to run when the user presses the dialog OK button
				 * @param	cancel	{Function}	An optional function to run when the user presses the dialog Cancel button	
				 * @returns			{XUL}		the XUL dialog
				 */
				show:function(accept, cancel)
				{
					if(xjsfl.get.dom('A document (.fla file) needs to be open before a dialog can be shown.'))
					{
						// --------------------------------------------------------------------------------
						// build and show panel
						
							// build XML
								if(this.built == false)
								{
									this._build();
								}
								
							// clear settings
								delete this.settings.dismiss;
								
							// show panel
								this.open		= true;
								this.settings	= xjsfl.ui.show(this);
								this.open		= false;
								
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
									
										// prevalidate event
											this.handleEvent('prevalidate');
									
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
											
										// postvalidate event
											this.handleEvent('postvalidate');
									
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
				 * Closes the dialog
				 * @param	state	{Boolean}	An optional Boolean to close and accpet (true) or cancel (unsupplied or false) the dialog
				 * @returns		
				 */
				close:function(state)
				{
					state ? fl.xmlui.accept() : fl.xmlui.cancel();
				},
				
				/**
				 * Builds the XML for the XMLUI dialog
				 * @returns		
				 */
				_build:function()
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
						
					// add handlers to controls
						// events
							var types =
							{
								button:			'create command',
								checkbox:		'create',
								radiogroup:		'create',
								//choosefile:		'create',
								colorchip:		'create change',
								//expression:		'create change',
								flash:			'create',
								listbox:		'create change setfocus',
								menulist:		'create change setfocus',
								popupslider:	'create',
								targetlist:		'create',
								textbox:		'create change',
								property:		'create'
							};

						// loop over types
							for(var type in types)
							{
								// variables
									var events		= types[type].split(/ /g);
									var nodes		= this.xml.find(type, true);
									
								// for each node
									for each(var node in nodes)
									{
										// id
											var id = node.@id;
											
										// assign handler. Note that the xulid will be assigned and the {xulid} placeholder replaced during xjsfl.ui.show()
											for each(var event in events)
											{
												node.@['on' + event] = "xjsfl.ui.handleEvent('{xulid}', '" +event+ "', '" +id+ "')";
											}
									}
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
				 * @param	fn	{Function}		A function
				 * @returns		{Object}		An object
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
				 * @returns		{String}	The String representation of the dialog
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
		 * An object-oriented wrapper for XMLUI controls
		 * @param	id		{String}	The id of the control
		 * @param	type	{String}	The type (tag name) of the control item
		 * @param	xul		{XUL}		The parent XUL instance of the control
		 * @param	xml		{XML}		The XML of the control, that will be added to the UI
		 */
		function XULControl(id, type, xul, xml)
		{
			// properties
				
				/**
				 * @Type {String}	The node id attribute of the control
				 */
				this.id			= id;
				
				/**
				 * @type {String}	The XML node type of the control
				 */
				this.type		= type;

			// getter functions, so the full xml doesn't it doesn't print when Output.inspect()ing
			
				/**
				 * Gets the XUL instance the control belongs to
				 * @returns		{XUL}		A XUL instance
				 */
				this.getXUL = function()
				{
					return xul;
				}
				
				/**
				 * Gets the XML String that originally created the control
				 * @returns		{String}	An XML String
				 */
				this.getXML = function()
				{
					return xml;
				}
				
			// flags
				/**
				 * @type {Boolean} Whether the control shoudl be enumerated for a value from XUL.values
				 */
				this.enumerable	= ! /^button|flash$/.test(type);
				
				/**
				 * @type {Boolean} Whether the control is a combination type like dropdown, list, or such like
				 */
				this.compound		= /^radiogroup|checkboxgroup|menulist|listbox$/.test(type);
				
			// if compound control, set child elements
				if(this.compound)
				{
					// grab XML child nodes
						var elements;
						switch(type)
						{
							case 'radiogroup':
								elements = xml..radio;
							break;
							case 'checkboxgroup':
								elements = xml..checkbox;
							break;
							case 'menulist':
								elements = xml..menuitem;
							break;
							case 'listbox':
								elements = xml..listitem;
							break;
						}
						
					// assign elements
						this.elements = {};
						for each(var element in elements)
						{
							var value = xjsfl.utils.parseValue(String(element.@value));
							this.elements[value] = {id:element.@id, label:element.@label, value:value};
						}
				}
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
				compound:		false,
				
			// accessors
			
				/**
				 * @type {Value} Returns the actual vlue of the control, rather than just the string
				 */
				get value()
				{
					// work out if the dialog is open, or closed (existance of settings.dismiss implies it's closed)
						var settings	= this.getXUL().settings;
						var open		= settings.dismiss === undefined;
						
					// grab the (String) value for the control
						var value		= open ? fl.xmlui.get(this.id) : settings[this.id];
						
						//alert(this.type)
						
					// parse to a real value
						switch(this.type)
						{
							case 'checkboxgroup':
								value = [];
								for each(var element in this.elements)
								{
									var id		= element.id;
									var state	= open ? fl.xmlui.get(id) : settings[id];
									if(state === 'true')
									{
										value.push(element.value);
									}
								}
							break;
						
							case 'colorchip':
								value = value.substr(0,2) == '0x' ? parseInt(value, 16) : value.substr(1);
							break;
						
							case 'popupslider':
								value = parseInt(value);
								value = isNaN(value) ? null : value;
							break;
						
							case 'checkbox':
							case 'textbox':
							case 'targetlist':
								value = xjsfl.utils.parseValue(value);
							break;
						
							case 'choosefile':
								value = value.replace(/unknown:/, '')
							break;
						
							default:
								value = xjsfl.utils.parseValue(value);
						}

					// debug						
						//Output.inspect(value)
						
					// return
						return value === '' ? null : value;
				},
				
				set value(value)
				{
					// debug
						//trace('Setting ' + this.id + ':' + value);
					
					// set values per element type
						switch(this.type)
						{
							case 'checkboxgroup':
								for each(var element in this.elements)
								{
									var arr		= value.filter(function(e, i){return String(element.value) == String(e)});
									var state	= arr.length == 1;
									fl.xmlui.set(element.id, state);
								}
							break;
						
							case 'choosefile':
								// do nothing
							break;
						
							default:
								fl.xmlui.set(this.id, value);
						}
				},
				
				/**
				 * @type {Boolean} Set the visible state of the control
				 */
				set visible(state)
				{
					fl.xmlui.setVisible(this.id, state);
				},
				
				/**
				 * @type {Boolean} Get the visible state of the control
				 */
				get visible()
				{
					return fl.xmlui.getVisible(this.id);
				},
				
				/**
				 * @type {Boolean} Set the enabled state of the control
				 */
				set enabled(state)
				{
					fl.xmlui.setEnabled(this.id, state);
				},
				
				/**
				 * @type {Boolean} Get the enabled state of the control
				 */
				get enabled()
				{
					return fl.xmlui.getEnabled(this.id);
				},
				
			// compound controls only
			
				/**
				 * @type {Array} An array of child elements (dropdown & menulist only)
				 */
				elements:null,
			
				/**
				 * @type {Array} Get the values of a radiobuttongroup, listbox, or dropdown child items
				 */
				get values()
				{
					var values = [];
					for each(var element in this.elements)
					{
						values.push(element.value);
					}
					return values;
				},
				
				/**
				 * 
				 * @type {Array} Sets the child items of a listbox or dropdown. The value should be an array of primitive values, or an Array of Objects of the format {'label':value}
				 */
				set values(values)
				{
					if(/^menulist|listbox$/.test(this.type))
					{
						var elements = [];
						for (var i = 0; i < values.length; i++)
						{
							var value = values[i];
							if(typeof value === 'object')
							{
								for(var label in value)
								{
									elements.push({label:label, value:value[label]});
								}
							}
							else
							{
								elements.push({label:value, value:value});
							}
						}
						fl.xmlui.setControlItemElements(this.id, elements);
						this.elements		= elements;
						this.selectedIndex	= 0;
					}
				},
				
				/**
				 * @type {Number} Sets the selected index of the control
				 */
				set selectedIndex(index)
				{
					if(this.compound)
					{
						this.value = this.values[index];
					}
				},
				
				/**
				 * @type {Number} Gets the selected index of the control
				 */
				get selectedIndex()
				{
					if(this.compound)
					{
						return this.values.indexOf(this.value);
					}
					return -1;
				},
				
			// validation
			
				update:function(settings)
				{
					// debug
						//trace(this.id)
					
					// grab the (String) value for the control
						var value	= settings[this.id];
						
					// update controls
						switch(this.type)
						{
							case 'checkboxgroup':
								for each(var element in this.elements)
								{
									var id		= element.id;
									var state	= settings[id];
									fl.xmlui.set(id, state);
								}
							break;
						
							case 'checkbox':
								fl.xmlui.set(this.id, value || false);
							break;
							
							case 'choosefile':
							case 'checkbox':
							case 'colorchip':
							case 'popupslider':
							case 'textbox':
							case 'targetlist':
							default:
								fl.xmlui.set(this.id, value || '');
						}
				},
			
				/**
				 * Validates the control's value and returns an error message if invalid
				 * @returns		{String}	The error message if invalid, or null if valid
				 */
				validate:function()
				{
					//TODO Implement proper validation using rules, and the Validation class
					var valid = true;
					switch(this.type)
					{
						case 'popupslider':
							if(this.value === null)
							{
								valid = false;
							}
						break;
							
						case 'textbox':	
						case 'expression':
						case 'colorchip':
							if(this.value == null)
							{
								valid = false;
							}
						break;
					}
					
					return valid ? null : 'Field "' +this.id+ '" is required';
				},
				
				/**
				 * A string representation of the control
				 * @returns		{String}	A string representation of the control
				 */
				toString:function()
				{
					return '[object XULControl id="'+this.id+'" type="'+this.type+'" value="' +this.value+ '"]';
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
		 * @param	type	{String}		The type of event, i.e. 'click', 'change', 'create'
		 * @param	control	{XULControl}	The xJSFL XULControl the event was dispatched by
		 * @param	xul		{XUL}			The xJSFL XUL instance the control belongs to
		 * @param	xmlui	{XMLUI}			The Flash XMLUI instance the control belongs to
		 */
		function XULEvent(type, control, xul, xmlui)
		{
			/**
			 * @type {String}		The type of event, i.e. 'click', 'change', 'create'
			 */
			this.type		= type;
			
			/**
			 * @type {XULControl}	The xJSFL XULControl the event was dispatched by
			 */
			this.control	= control;
			
			/**
			 * @type {XUL}			The xJSFL XUL instance the control belongs to
			 */
			this.xul		= xul;
			
			/**
			 * @type {XMLUI}		The Flash XMLUI instance the control belongs to
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
					.addSlider('Value 1', 'value1', Math.floor(Math.random() * 100))
					.addSlider('Value 2', 'value2', Math.floor(Math.random() * 100))
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
		// Various shorthand examples
		
			if(0)
			{
				var declarations = <xml>
					<![CDATA[
						Name=Dave
						checkbox:Do something
						radiogroup:Options=[1,2,3,4]
						dropdown:Options={one:1,two:2,three:3,four:4}
						Value 1,Value 2,Value 3
						numeric:Size (pixels), numeric:Width (pixels), numeric:Alpha (%),title:Adjust object size
					]]>
				</xml>
				var expressions = declarations.toString().split(/[\r\n]+/);
				for each(var expression in expressions)
				{
					XUL.create(expression);
				}

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
		// Inspect compound controls
		
			if(0)
			{
				
				/**
				 * Click handler for button press
				 * @param	event	{XULEvent}
				 */
				function click(event)
				{
					trace('CLICK: ' + event)
					Output.inspect(event.xul.controls, 4, true, {'function':false, 'xml':false})
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
					.setTitle('Compound control values')
					.addRadiogroup('Radio', null, [1,2,3])
					.addListbox('Listbox', null, [4,5,6])
					.addDropdown('Dropdown', null, [7,8,9])
					.addButton('See values', 'button', null, {click:click});
					
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
								.addEvent('newdialog', 'click', newDialog)
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
					.addEvent('button', 'click', function(){alert('But I can still have events assigned :)')})
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
						.addEvent('button', 'click', onControlEvent)
						.addEvent('listbox menulist', 'change setfocus', onControlEvent)
						.addEvent('color popupslider textbox1', 'change', onControlEvent)
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
						.setTitle('Dialog with initilize event')
						.addTextbox('Text', 'text')
						.addEvent('initialize', onInitialize)
						.show();
			}
		

		// catch
			}catch(err){xjsfl.output.debug(err);}
		
	}
		

