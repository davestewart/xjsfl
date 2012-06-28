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

	/**
	 * XUL Event 
	 * @overview	A XUL Event class to pass parameters to event callbacks
	 * @instance	event
	 */

	// --------------------------------------------------------------------------------
	// Constructor

		/**
		 * A XUL Event class to pass parameters to event callbacks
		 * @param	{String}		type		The type of event, i.e. 'click', 'change', 'create'
		 * @param	{XULControl}	control		The xJSFL XULControl the event was dispatched by
		 * @param	{XUL}			xul			The xJSFL XUL instance the control belongs to
		 * @param	{XMLUI}			xmlui		The Flash XMLUI instance the control belongs to
		 */
		XULEvent = function(type, control, xul, xmlui)
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

	// ---------------------------------------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('XULEvent', XULEvent);


