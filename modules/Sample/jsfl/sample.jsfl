var Sample =
{

	// ------------------------------------------------------------------------------------------------
	// constructor,

		init:function()
		{
			// set a value, using a library function
				this.date		= getDate();

			// load the default config object
				this.settings	= this.loadConfig();
		},

	// ------------------------------------------------------------------------------------------------
	// properties

		// settings config
			settings:null,

		// arbitrary value
			date:null,


	// ------------------------------------------------------------------------------------------------
	// public functions from Flash Panel

		test:function()
		{
			// trace confirmation to Output panel
				this.log('test() was called at ' +getDate()+ '! Now returning a value to the panel...');

			// return a value
				return this.date;
		}

	// ------------------------------------------------------------------------------------------------
	// private functions


}

// ------------------------------------------------------------------------------------------------
// create module

	Sample = xjsfl.modules.create('Sample', Sample, this);
