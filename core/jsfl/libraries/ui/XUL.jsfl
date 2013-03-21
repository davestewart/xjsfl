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
// XUL

	/**
	 * XUL
	 * @overview	OO library for creating and managing XUL dialogs
	 * @instance	xul
	 */

	//xjsfl.halted = false;
	xjsfl.init(this, ['Utils', 'URI', 'File', 'XML', 'String', 'XULControl', 'XULEvent', 'JSFLInterface']);

	// --------------------------------------------------------------------------------
	// constructor

		/**
		 * XUL constructor
		 * @param	{String}	title		The title of the new dialog
		 * @returns	{XUL}					A new XUL instance
		 */
		XUL = function(title)
		{
			//TODO Allow a file: uri to be passed into the constructor

			//TODO Consider making XUL driver-based, so basic controls are constructed using the core, but can be wrapped with additional markup using driver-based methods
			//TODO Alternatively, have an additional XULBuilder class, so code and presentation are kept separate

			//TODO Add functionality for basic arithmetic to be performed inside textboxes

			// public properties
				this.xml		= xjsfl.file.load('xul/dialog.xul', 'template', true);
				this.controls	= {};
				this.settings	= {};
				this.flashData	= null;

			// private properties
				this.events		= {};
				this.rules		= {};
				this.columns	= [100, 180],
				this.error		= null;
				this.id			= -1;

			// load controls
				var xml			= xjsfl.file.load('xul/controls.xul', 'template', true);
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
	// # XUL static methods & properties

		/**
		 * Static convenience method to instantiate and return a new chainable XUL instance
		 * @param	{String}	props		An optional shorthand controls String
		 * @param	{Function}	props		An optional Function
		 * @returns	{XUL}					A XUL class
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
					// props is URI, load XML
						else if(props instanceof URI)
						{
							xul.load(props);
						}

					// props is a string, load XML if is a URI, or use shorthand notation to create controls
						else if(typeof props == 'string')
						{
							if(URI.isURI(props))
							{
								xul.load(props);
							}
							else
							{
								xul.add(props);
							}
						}

					// return
						return xul;
				}

			// return
				return xul;
		}

		/**
		 * Static convenience method to create and show interface in one call, returning any submitted values
		 * @param	{String}	props		A String of shorthand controls
		 * @param	{Function}	props		A Function, the parameters of which will map to dialog controls
		 * @param	{Function}	accept		An optional callback function to be called when the user clicks the OK button
		 * @param	{Function}	cancel		An optional callback function to be called when the user clicks the Cancel button
		 * @param	{Object}	defaults	An optional Object of name:value properties to apply to the dialog
		 * @returns	{Object}				An Object containing the accepted values, or null if the user cancels the dialog
		 */
		XUL.create = function(props, accept, cancel, defaults)
		{
			// build new XUL
				var xul = XUL.factory(props);
				
			// assign defaults
				if(defaults)
				{
					xul.setValues(defaults);
				}

			// show
				if(xul && Utils.getKeys(xul.controls).length > 0)
				{
					xul.show(accept, cancel);
					if(xul.settings && xul.settings.dismiss === 'accept')
					{
						return xul.values;
					}
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
		 * @ignore
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
					columns:	[100, 180],

				// template
					content:	'',
					separator:	'</rows></grid><separator /><grid><columns><column flex="1" /><column flex="2" /></columns><rows>',

				// properties
					title:		'',
					error:		null,

				// flags
					built:		false,
					open:		false,
					accepted:	false,

			// --------------------------------------------------------------------------------
			// # Accessors

					/**
					 * @type {Object} The values of the dialog controls parsed into their correct data types
					 */
					get values()
					{
						// return null if a settings object doesn't exist (the user cancelled)
							if( ! this.settings )
							{
								return null;
							}

						// if not, grab values
							var values = {};
							for(var id in this.controls)
							{
								var control = this.controls[id];
								if(control.enumerable)
								{
									values[id] = control.value;
								}
							}

						// return
							return values;
					},


			// --------------------------------------------------------------------------------
			// methods

				/**
				 * Reset constructor
				 * @ignore
				 */
				constructor:XUL,


			// --------------------------------------------------------------------------------
			// # Control methods

				// misc
					/**
					 * (private) Main add control method
					 * @param	{String}	type		The control type, i.e. button, colorchip, etc
					 * @param	{String}	id			The control id
					 * @param	{String}	label		The control label
					 * @param	{XML}		xml			The original XML of the control, built by the appropriate addControl method
					 * @param	{Object}	attributes	Any additional attributes that should be applied to the control XML
					 * @param	{Object}	validation	Any validation rules that should be applied to the control
					 * @param	{Object}	events		An Object containing event:callback pairs
					 * @param	{Boolean}	user		An optional Boolean specifying to use use XML? //TODO check this
					 * @returns	{XUL}					The XUL dialog
					 */
					_addControl:function(type, id, label, xml, attributes, validation, events, user)
					{
						// element
							var element			= user ? xml : xml[type][0];

						// label
							id					= id || this._makeId(label);

							if(xml.label && xml.label.length())
							{
								xml.label.@value = label ? label + ' : ' : ' ';
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
							
						// width
							if(attributes && attributes.width > this.columns[1])
							{
								this.columns[1] = attributes.width;
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
										var selected		= xml..*.(function(element){return element.@selected && element.@selected == 'true';});
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
					 * @param	{XML}		parent		An XML parent node. Child items are updated by reference
					 * @param	{Array}		values		The values (values, or {label:'',value:''} Objects) of each of the new elements you want to add
					 * @param	{String}	id			The id of the new control
					 * @param	{String}	selected	The value of the selected item
					 * @returns	{XML}					The XML of the new children (altough the original parent is altered by reference anyway)
					 * @ignore
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
										if(Utils.isArray(values))
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
					 * @param	{String}	id			The id of the control
					 * @param	{Object}	validation	Not yet implemented
					 * @returns	{XUL}					The XUL dialog
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
					 * @param	{String}	id			The id of the control
					 * @param	{Object}	events		An Object containing event:callback pairs
					 * @returns	{XUL}					The XUL dialog
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
					 * @param	{XML}		xml			An XML element containing valid XMLUI control elements
					 * @returns	{XMLList}				The child XML control elements
					 */
					_parseUserXML:function(xml)
					{
						// add xml under a temp root node, so we can find any top-level control nodes passed in
							xml = new XML('<temp>' + xml.toXMLString() + '</temp>');

						// loop through control types, and attempt to find and add to controls array
							var types	= 'textbox,popupslider,checkbox,colorchip,choosefile,button,listbox,menulist,radiogroup,targetlist,property'.split(',');
							for each(var type in types)
							{
								var controls = xml.get('..' + type);

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
					 * @param	{String}	str				A string of the format "property:value,type:Label=values,type:Label=values, ..."
					 * @returns	{XUL}						The XUL dialog
					 */
					add:function(str)
					{
						//TODO Add xml:<xml attr="value"> functionality

						// variables
							var controls	= Utils.parseExpression(str);
							var rxControl	= /(\||\w*:)?([^=]*)=?(.*)/
							var rxObj		= /([^:,]+):([^,]+)/;
							
						// parse
							for each(var control in controls)
							{
								// variables
									var matches		= control.match(rxControl);
									var control		= matches[1].trim().replace(':', '');
									var label		= matches[2].trim();
									var value		= matches[3].trim();

								// control
									if(control === '')
									{
										control = 'textbox';
									}
									
								// handle properties
									if(/^(title|columns|width|xml)$/.test(control))
									{
										value = label;
										label = '';
									}

								// compound value
									else if(/^[\[{]/.test(value))
									{
										// variables
											var isObject	= value[0] == '{';
											var values		= value.substring(1, value.length - 1).split(',');

										// loop through the array and convert elements to values / objects
											for(var i = 0; i < values.length; i++)
											{
												if(isObject)
												{
													var matches = values[i].match(rxObj)
													if(matches)
													{
														var lab		= matches[1].trim();
														var val		= matches[2].trim();
														values[i]	= {label:lab, value:val};
													}
												}
												else
												{
													var val		= values[i].trim();
													values[i]	= /^(popupslider|slider|numeric)$/.test(control) ? val : {label:val, value:val};
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

								// debug
									//inspect([control, label, value])

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

											case 'value':
											case 'number':
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
												this.addXML(value);
											break;

											case 'label':
												this.addLabel(label, null);
											break;

											case 'property':
												this.addProperty(value);
											break;

											case 'spacer':
											case '-':
												this.addSpacer();
											break;

											case 'separator':
											case '|':
												this.addSeparator();
											break;

										// properties

											case 'title':
												this.setTitle(value);
											break;

											case 'width':
												this.setWidth(parseInt(value));
											break;

											case 'columns':
												this.setColumns(Utils.parseValue(value));
											break;

									default:
										xjsfl.debug.error('XUL.add(): Undefined control type "' +control+ '"');
									}
									
								// output
									//inspect([matches[0]..trim(), control, label, value], 'Add');
							}
						// return
							return this;
					},

				// --------------------------------------------------------------------------------
				// # Single controls

					/**
					 * Add a Textbox control to the UI
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Array}		values			An optional Array of values [default, min, max]
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes [value, format]
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
					 */
					addColorchip:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.colorchip.copy();

						// values
							attributes = attributes || {};

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
										attributes.value = '#' + Utils.pad(parseInt(value).toString(16).toUpperCase());
									}
									else
									{
										attributes.value = '#' + value;
									}
								}
							}
							//inspect(attributes)

						// add control
							xml					= this._addControl('colorchip', id, label, xml, attributes, validation, events);
							return this;
					},

					/**
					 * Add a Choosefile control to the UI
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
					 */
					addFile:function(label, id, attributes, validation, events)
					{
						// build xml
							var xml				= XUL.templates.choosefile.copy();
							//inspect(attributes, 'Attributes')

						// add control
							xml					= this._addControl('choosefile', id, label, xml, attributes, validation, events);
							return this;
					},

					/**
					 * Add a Expression control to the UI
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
				// # Multiple-value controls

					/**
					 * Add a Listbox control to the UI (listbox does not allow multi-select)
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
					 */
					addCheckboxgroup:function(label, id, values, attributes, validation)
					{
						// build xml
							var xml				= XUL.templates.checkboxgroup.copy();

						// add child items
							var parent			= xml..vbox;
							this._addChildren(parent, values, id || label.toLowerCase());
							
							//TODO Add functionality to pre-check checkboxes by passing in a "checked" Array ( [1,0,1,1] ) in attributes
							// and look at some kind of shorthand alternative to this
							// check also the control values for this. label[name]=name, or label[name]=true/false ?
							
						// add control
							xml					= this._addControl('checkboxgroup', id, label, xml, attributes, validation);
							return this;
					},

					/**
					 * Add a Targetlist control to the UI
					 * @param	{String}	label			A label for the UI item
					 * @param	{String}	id				An optional id, otherwise derived from the label
					 * @param	{Object}	attributes		Optional attributes
					 * @param	{Object}	validation		Optional validation properties
					 * @param	{Object}	events			Optional event callbacks
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{String}	id				A unique id so the value can be retrieved from the settings object
					 * @returns	{XUL}						The XUL dialog
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
					 * @param	{XML}		xml				An XML <row>
					 * @param	{XMLList}	xml				An XMLList of <row>s
					 * @param	{String}	xml				A String of XML
					 * @param	{String}	breakOutOfRows	An optional Boolean to break out of rows, and just add vanilla XML to the dialog
					 * @param	{Boolean}	dontParse		Internal flag to indicate to the function not to process the XML for control info
					 * @returns	{XUL}						The XUL dialog
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
				// # Additional element methods

					/**
					 * Add a separator element to the dialog
					 * @param	{String}	label		An optional labal to add beneath the separator
					 * @returns	{XUL}					The XUL dialog
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
					 * @returns	{XUL}					The XUL dialog
					 */
					addSpacer:function()
					{
						// build xml
							var xml = XUL.templates.spacer.copy();

						// add xml
							this.addXML(xml);

						// return
							return this;
					},

					/**
					 * Add a Label control to the UI
					 * @param	{String}	label		A label for the UI item
					 * @param	{String}	id			An optional id, otherwise derived from the label
					 * @param	{Object}	attributes	Optional attributes
					 * @returns	{XUL}					The XUL dialog
					 */
					addLabel:function(label, id)
					{
						// build xml
							var xml				= XUL.templates.label.copy();
							var sum				= 0; this.columns.forEach( function(e){sum += e} );
							xml.label.@width	= sum;
							xml.label.@value	= label;

						// add xml
							this.addXML(xml);

						// return
							return this;
					},

					/**
					 * Adds a script source to the interface
					 * @param	{Function}script
					 * @returns	{XUL}					The XUL dialog
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
				// # Custom controls

					/**
					 * Add a Flash control to the UI (for the moment, this replaces any existing controls)
					 * @param	{String}	src			Source path to the SWF, (important!) relative to the calling file (defaults to user/)
					 * @param	{Number}	width		The width of the Flash window
					 * @param	{Number}	height		The height of the Flash window
					 * @param	{Object}	data		An optional Object of name:value pairs to be saved to the same folder as the Flash element (use AS3 to retrieve them)
					 * @param	{XML}		data		An optional XML 
					 * @param	{Array}		properties	An optional Array of property names to be created
					 * @returns	{XUL}					The XUL dialog
					 */
					setFlash:function(uriOrPath, width, height, data, properties)
					{
						//TODO add functinality to save a string of variables to a hard-coded location, as you can't pass in query strings, which you then load in manually
						//TODO Can the SWF determine its location using ExternalInterface, or do we need to use a hardcoded URL? Does MMExecute work in a XUL dialog?

						// build xml
							var xml			= XUL.templates.flash.copy();
							
						// src must be a relative path (NOT absolute URI) such as path/to/file.swf or ../file.swf
							var uri			= URI.toURI(uriOrPath, 1);
							var src			= URI.pathTo(xjsfl.uri + 'core/ui/', uri);
							xml..flash.@src	= src;

						// add control and set XML
							xml					= this._addControl('flash', 'flash', null, xml, {width:width, height:height});
							this.setXML(xml);

						// update size
							this.xml.@width		= width;
							this.xml.@height	= height;
							
						// set data
							if(data)
							{
								this.setFlashData(data);
							}

						// properties
							for each(var property in properties)
							{
								this.addProperty(property); // TODO check if we need to first set() the property to have it work
							}

						// return
							return this;
					},
					
					/**
					 * Stores data for any Flash elements as local SharedObject data
					 * @param	{Object}	data		Any object that can be serialized to XML
					 * @returns	{XUL}					The XUL dialog
					 */
					setFlashData:function(data)
					{
						this.flashData = data;
						return this;
					},
					
					/**
					 * Replace the standard XML dialog template
					 * @param	{String}	xml			An XML String containing dialog controls
					 * @returns	{XUL}					The XUL dialog
					 */
					setXML:function(xml)
					{
						// variables
							this.controls	= {};
							this.events		= {};
							this.settings	= {};

						// xml							
							var nodes = new XMLList(xml);
							
						// update content
							delete this.xml..content.*;
							this.xml..content.@id	= 'controls'
							this.content			= this._parseUserXML(nodes);
							
						// add new controls
							return this;
					},


			// --------------------------------------------------------------------------------
			// # Set methods

				/**
				 * Sets the initial values of controls in the dialog
				 * @param	{Object}	values			A hash of control:value values
				 * @param	{XML}		values			An XML node of <name>value</name> elements
				 * @returns	{XUL}						The XUL dialog
				 */
				setValues:function(values)
				{
					if(typeof values == 'xml')
					{
						if(values.length() === 1 && values.*.length() > 0)
						{
							values = values.*;
						}
						for each(var node in values)
						{
							this.setValue(node.name(), String(node.valueOf()));
						}
					}
					else
					{
						for(var id in values)
						{
							this.setValue(id, values[id]);
						}
					}
					return this;
				},

				/**
				 * Sets the initial value of a control in the dialog
				 * @param	{String}	id				The name of the control
				 * @param	{value}		value			The value of the control
				 * @returns	{XUL}						The XUL dialog
				 */
				setValue:function(id, value)
				{
					//TODO Add support for checkbox groups
					//TODO Re-evaluate the logic behind using XMLUI.settings, and think about using XUL.values
					if(this.controls[id])
					{
						this.settings[id] = String(value);
					}
					return this;
				},

				/**
				 * Assign values from a miscellaneous property object
				 * @param	{Object}	props			An object of key:value pairs. Valid keys are: title
				 * @returns	{XUL}						The XUL dialog
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
				 * @param	{String}	str				A comma delimted string of valid button types, e.g. "accept,cancel"
				 * @returns	{XUL}						The XUL dialog
				 */
				setButtons:function(str)
				{
					this.xml.@buttons = str;
					return this;
				},

				/**
				 * Set the widths of the dialog's columns
				 * @param	{Array}		columns			An array of Number pixel widths
				 * @returns	{XUL}						The XUL dialog
				 */
				setColumns:function(columns)
				{
					if(Utils.isArray(columns))
					{
						this.columns = columns;
					}
					return this;
				},
				
				setWidth:function(value)
				{
					trace('XUL.setWidth() not yet implemented');
					return this;
				},

				/**
				 * Set the title of the dialog
				 * @param	{String}	title			A String title
				 * @returns	{XUL}						The XUL dialog
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
			// # Event handling

				/**
				 * Add (or actually, set) a event callback for an id. Global events take only type and callback arguments.
				 * @param	{String}	ids			The id(s) of the element to register the callback for
				 * @param	{String}	types		The type(s) of callback. Values can be create, change, click, setfocus. Separate multiple types with spaces or commas if required
				 * @param	{Function}	callback	The callback to call. Format must be function(event){ ... }
				 * @param	{Object}	scope		An optional scope in which event callbacks should run. Defaults to the current XUL instance
				 * @returns	{XUL}					The XUL dialog
				 */
				addEvent:function(ids, types, callback, scope)
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
								ids		= Utils.toArray(ids);
								types	= Utils.toArray(types);

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
						
					// assign scope
						if(scope)
						{
							this.setEventScope(scope);
						}

					// return
						return this;
				},

				/**
				 * Set the scope in which events will run
				 * @param	{Object}	scope		The object in which you want events to be called in
				 * @returns	{XUL}					The XUL dialog
				 */
				setEventScope:function(scope)
				{
					this.scope = scope;
					return this;
				},

				/**
				 * Handles all events in the XUL dialog
				 * @param	{String}	type		The event type
				 * @param	{String}	id			The control id
				 * @private
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
			// # Loading and showing
			
				/**
				 * Loads a dialog in from an external file
				 * @param	{String}	pathOrURI	A valid path or URI
				 * @param	{URI}		pathOrURI	A URI instance
				 * @returns	{XUL}					The XUL dialog
				 */
				load:function(pathOrURI)
				{
					// get URI
						var xml = xjsfl.file.load(pathOrURI);

					// grab nodes
						if(xml.name() == 'dialog')
						{
							var title = xml.@title;
							if(title.length())
							{
								this.setTitle(title);
							}
						}
						var nodes = xml.*;
						
					// set nodes
						this.setXML(nodes);
						return this;
				},

				/**
				 * Save the dialog in a particular location so custom Flash controls can reference the src attribute properly
				 * @param	{String}	uriOrPath		A valid URI or path of where to save the dialog's XML file
				 * @returns	{XUL}						The XUL dialog
				 */
				saveAs:function(pathOrURI)
				{
					// check file is an XML file
						if(URI.getExtension(pathOrURI) !== 'xul')
						{
							throw new Error('XUL.saveAs(): dialog uri must end with .xul extension');
						}

					// make URI
						this.uri = URI.toURI(pathOrURI, 1);

					// return
						return this;
				},

				/**
				 * Shows the XUL dialog
				 * @param	{Function}	onAccept	An optional function to run when the user presses the dialog OK button
				 * @param	{Function}	onCancel	An optional function to run when the user presses the dialog Cancel button
				 * @returns	{XUL}					The XUL dialog
				 */
				show:function(onAccept, onCancel)
				{
					// --------------------------------------------------------------------------------
					// force a document open if none is

						if( ! $dom )
						{
							//fl.createDocument();
						}
						
						/*
							// can we set the AS3 timeout to longer than 15 seconds so we don't get these errors?
							
							Error: Error #1502: A script has executed for longer than the default timeout period of 15 seconds.
								at com.xjsfl.jsfl.io::JSFL$/trace()
								at Splash()
								
							PublishProfile scriptTimeLimit
								
							fl.showIdleMessage(state)
							
							Lets you disable the warning about a script running too long (pass false). You might want to do
							this when processing batch operations that take a long time to complete. To re-enable the alert,
							issue the command again, this time passing true.
							
							@see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7b87.html
						*/
						

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
							this.accepted	= false;
							this.settings	= xjsfl.ui.show(this);
							this.open		= false;

					// --------------------------------------------------------------------------------
					// process result
					
						// kill quoted strings
						//TODO check if this is Flash or me adding the quotes
							for(var name in this.settings)
							{
								this.settings[name] = this.settings[name].replace(/^"([\s\S]*?)"$/, '$1');
							}
							
						// get control values and convert to array for callbacks
							if(onAccept || onCancel)
							{
								var args = Utils.getValues(this.values);
							}

						// test for validation
							if(this.settings && this.settings.dismiss === 'accept')
							{
								// set accepted
									this.accepted	= true;
									
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
										this.show(onAccept, onCancel);
									}

								// validated - update settings and call accept callback
									else
									{
										if(onAccept)
										{
											onAccept.apply(this, args);
										}
									}
							}

						// cancel
							else
							{
								if(onCancel)
								{
									onCancel.apply(this, args);
								}
							}

						// return
							return this;
				},

				/**
				 * Closes the dialog
				 * @param	{Boolean}	state		An optional Boolean to close and accpet (true) or cancel (unsupplied or false) the dialog
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
							var controls	= this.xml.get('..*.(#controls)');
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
									var event;
									var nodes		= this.xml.get('..' + type);
									var node;

								// for each node
									for each(node in nodes)
									{
										// id
											var id = node.@id;

										// assign handler. Note that the xulid will be assigned and the {xulid} placeholder replaced during xjsfl.ui.show()
											for each(event in events)
											{
												// Note that the window.xjsfl is needed so that the installation dialogs don't error
												node['@on' + event] = "if(window.xjsfl)xjsfl.ui.handleEvent('{xulid}', '" +event+ "', '" +id+ "');";
											}
									}
							}

					// set column widths
						for each(var label in this.xml..row.label)
						{
							label.@width = this.columns[0];
						}
						for each(var control in this.xml..row.*.(function::attribute('class') == 'control'))
						{
							control.@width = this.columns[1];
						}

					// replace separators
						var str		= this.xml.toXMLString().replace(/<row template="separator"\/>/g, this.separator);
						this.xml	= new XML(str);

					// add xulid, so we can test for existance of dialog boxes in future
						this.xml.*	+= new XML('<property id="xulid" value="{xulid}" />');

					// debug
						//trace(this.xml.toXMLString())

					// flag as built
						this.built = true;

					// return
						return this;

				},

			// ----------------------------------------------------------------------------#----
			// # Utilities

				/**
				 * Parses a function source into an info object: {name:name, params:['param1','param2','param3']}
				 * @param	{Function}		fn		A function
				 * @returns	{Object}				An object
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
				 * @returns	{String}				The String representation of the dialog
				 */
				toString:function()
				{
					return '[object XUL id="' +this.id+ '" title="' +(this.xml ? String(this.xml.@title).trim() : '')+ '" controls:' +Utils.getKeys(this.controls).length+ ']';
				}
		}

	// ---------------------------------------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('XUL', XUL);