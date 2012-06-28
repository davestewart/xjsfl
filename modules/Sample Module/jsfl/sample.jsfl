/**
 * Sample Module
 * @type {Module}
 */
Sample =
{

	// ------------------------------------------------------------------------------------------------
	// constructor,

		init:function()
		{
			// load the default config object
				this.config		= this.loadConfig();
			
			// debug
				this.log('created!');
				
			// set a value, using a library function
				this.date		= getDate();
		},

	// ------------------------------------------------------------------------------------------------
	// properties

		/**
		 * This property holds a Config instance, which is a wrapper class around some XML
		 * You can use the 
		 * @type {Config}
		 */
		config:null,

		/**
		 * This property is an arbitrary value, to demonstrate how you can add values to your own Modules
		 * @type {Date}
		 */
		date:null,


	// ------------------------------------------------------------------------------------------------
	// public functions from Flash Panel

		/**
		 * This method is called from the Flash panel, and returns a value
		 * @returns		{Date}				A Date object
		 */
		test:function()
		{
			// trace confirmation to Output panel
				this.log('test() was called at ' +getDate()+ '! Now returning a value to the panel...');

			// return a value
				return this.date;
		},
		
		/**
		 * This method calls a function in the Flash panel that has been registered with ExternalInterface
		 * @returns		{Object}				Whatever value is returned by the function
		 * @see									http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/external/ExternalInterface.html#addCallback()
		 */
		callPanel:function()
		{
			this.log('calling panel\'s "externalFunction()" function...');
			var result = this.call('externalFunction', Math.random());
			this.log('result: ' + result);
			return result;
		}

	// ------------------------------------------------------------------------------------------------
	// private functions


}

// ------------------------------------------------------------------------------------------------
// create module

	Sample = xjsfl.modules.create('Sample', Sample, this);
