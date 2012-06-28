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
// XUL Control

	/**
	 * XULControl
	 * @overview	OO representation of a dialog control
	 * @instance	control
	 */

	xjsfl.init(this, ['Utils', 'XUL']);

	// --------------------------------------------------------------------------------
	// Constructor

		/**
		 * An object-oriented wrapper for XMLUI controls
		 * @param	{String}	id		The id of the control
		 * @param	{String}	type	The type (tag name) of the control item
		 * @param	{XUL}		xul		The parent XUL instance of the control
		 * @param	{XML}		xml		The XML of the control, that will be added to the UI
		 */
		XULControl = function(id, type, xul, xml)
		{
			// --------------------------------------------------------------------------------
			// # Properties
			
				/**
				 * @Type	{String}	The node id attribute of the control
				 * @name	id
				 */
				this.id			= id;

				/**
				 * @type	{String}	The XML node type of the control
				 * @name	type
				 */
				this.type		= type;

			// --------------------------------------------------------------------------------
			// # Getters - so the full xml doesn't it doesn't print when inspect()ing

				/**
				 * Gets the XUL instance the control belongs to
				 * @returns	{XUL}			A XUL instance
				 */
				this.getXUL = function()
				{
					return xul;
				}

				/**
				 * Gets the XML String that originally created the control
				 * @returns	{String}		An XML String
				 */
				this.getXML = function()
				{
					return xml;
				}

			// flags
				/**
				 * @type {Boolean} Whether the control should be enumerated for a value from XUL.values
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
							var value = Utils.parseValue(String(element.@value));
							this.elements[value] = {id:element.@id, label:element.@label, value:value};
						}
				}
		}

	// --------------------------------------------------------------------------------
	// Prototype
	
		//TODO Subclass XULControl with simple and complex types
		//TODO Add ability to query both indices and values of compound controls

		XULControl.prototype =
		{
			// properties
				id:				'',
				type:			'',

			// flags
				enumerable:		true,
				compound:		false,

			// accessors

				get rawValue()
				{
					// work out if the dialog is open, or closed (existance of settings.dismiss implies it's closed)
						var settings	= this.getXUL().settings;
						var open		= settings && settings.dismiss === undefined;

					// grab the (String) value for the control
						var value		= open ? fl.xmlui.get(this.id) : settings[this.id];

					// return
						return value;
				},

				/**
				 * @type {Value} Returns the actual vlue of the control, rather than just the string
				 */
				get value()
				{
					//TODO - see how we can tidy up this settings > open > state chain - it's unweildy!
					
					// work out if the dialog is open, or closed (existance of settings.dismiss implies it's closed)
						var settings	= this.getXUL().settings;
						var open		= settings && settings.dismiss === undefined;

					// raw value
						var value		= this.rawValue;

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
								value = Utils.parseValue(value);
								if(this.type === 'textbox' && typeof value === 'string')
								{
									value = value.replace(/\r\n/g, '\n');
								}
							break;

							case 'choosefile':
								value = value.replace(/unknown:/, '')
							break;

							default:
								value = Utils.parseValue(value);
						}

					// debug
						//inspect(value)

					// return
						return typeof value === 'string' && value === '' ? null : value;
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
				 * @returns	{String}		The error message if invalid, or null if valid
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
							if(String(this.rawValue).trim() == '')
							{
								valid = false;
							}
						break;
					}

					return valid ? null : 'Field "' +this.id+ '" is required';
				},

				/**
				 * A string representation of the control
				 * @returns	{String}		A string representation of the control
				 */
				toString:function()
				{
					return '[object XULControl id="'+this.id+'" type="'+this.type+'" value="' +this.value+ '"]';
				}

		}
		
	// ---------------------------------------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('XULControl', XULControl);


