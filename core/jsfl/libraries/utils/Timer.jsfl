// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██
//    ██
//    ██   ██ ████████ █████ ████
//    ██   ██ ██ ██ ██ ██ ██ ██
//    ██   ██ ██ ██ ██ █████ ██
//    ██   ██ ██ ██ ██ ██    ██
//    ██   ██ ██ ██ ██ █████ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Timer

	/**
	 * Timer
	 * @overview	A simple timing class
	 * @instance	timer
	 */

	xjsfl.init(this, ['Utils']);
		
	// --------------------------------------------------------------------------------
	// Constructor

		/**
		 * Timer constructor
		 * @param	{String}	name		An optional name for the new Timer
		 */
		function Timer(name)
		{
			this.name		= name || 'Timer';
			this.startDate	= new Date();
			this.endDate	= new Date();
		}

	// --------------------------------------------------------------------------------
	// Static properties

		// object
			var timer =
			{
				/**
				 * @type {Timer}
				 * @ignore
				 */
				instance:{},

				get time()
				{
					return Timer.instance.time;
				},

				get milliseconds()
				{
					return Timer.instance.milliseconds;
				},

				start:function(name)
				{
					Timer.instance = new Timer(name || 'Default').start();
				},

				stop:function()
				{
					Timer.instance.stop(true);
				},

				format:function(ms, precision)
				{
					// variables
						var format
						var times =
						{
							millisecond:1,
							second:		1000,
							minute:		1000*60,
							hour:		1000*60*60,
							day:		1000*60*60*24,
							week:		1000*60*60*24*7,
							month:		1000*60*60*24*30,
							year:		1000*60*60*24*365
						};

					// format time to English
						if(ms < times.second)		format = ms + ' milliseconds'
						else if(ms < times.minute)	format = (ms / times.second).toPrecision(3) + ' seconds'
						else if(ms < times.hour)	format = (ms / times.minute).toPrecision(3) + ' minutes'
						else if(ms < times.day)		format = (ms / times.hour).toPrecision(3) + ' hours'
						else if(ms < times.week)	format = (ms / times.day).toPrecision(3) + ' days'
						else if(ms < times.month)	format = (ms / times.week).toPrecision(3) + ' weeks'
						else if(ms < times.year)	format = (ms / times.month).toPrecision(3) + ' months'
						else						format = (ms / times.year).toPrecision(3) + ' years'

					// return
						return format;
				}

			};

		// add static methods to Timer class
			Utils.extend(Timer, timer);
			delete timer;


	// --------------------------------------------------------------------------------
	// Prototype

		Timer.prototype =
		{
			// --------------------------------------------------------------------------------
			// # Properties - Some properties
			
				constructor:Timer,
	
				running:false,
	
				startDate:null,
	
				endDate:null,
	
				/**
				 * @type {String}	The time, as a formatted string, the timer has been running for
				 */
				get time()
				{
					return Timer.format(this.milliseconds);
				},
	
				/**
				 * @type {Number}	The number of milliseconds the timer has been running for
				 */
				get milliseconds()
				{
					if(this.endDate && this.startDate)
					{
						var ms = this.endDate.getTime() - this.startDate.getTime();
					}
					return new Date(ms || 0).getTime()
				},
	
			// --------------------------------------------------------------------------------
			// # Methods - Some methods
				
				/**
				 * Start the timer
				 * @returns	{Timer}				Itself
				 *
				 * @example						var timer1 = new Timer();
				 *								timer1.start();
				 *
				 * @example						var timer2 = new Timer();
				 *								timer2.start();
				 */
				start:function()
				{
					this.running	= true;
					this.startDate	= new Date();
					return this;
				},
	
				/**
				 * Stop the timer
				 * @param	{Boolean}	print	Optionally print the results of the timer
				 * @returns	{Timer}				Itself
				 */
				stop:function(print)
				{
					if(this.running)
					{
						this.endDate	= new Date();
						this.running	= false;
						if(print)
						{
							fl.trace('Task "' +this.name+ '" took ' + this.time)
						}
					}
					return this;
				},
	
				/**
				 * Standard toString method
				 * @returns	{String}			A String representation of the object
				 */
				toString:function()
				{
					return '[object Timer time="' +this.time+ '"]';
				}
		}

	// --------------------------------------------------------------------------------
	// Static methods

		Timer.toString = function()
		{
			return '[class Timer]';
		}


	// --------------------------------------------------------------------------------
	// register

		xjsfl.classes.register('Timer', Timer);
