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
// Timer - A simple timing class

	// --------------------------------------------------------------------------------
	// Constructor
	
		/**
		 * Timer constructor
		 * @type name {String}	An optinoal name for the new Timer
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
			xjsfl.utils.extend(Timer, timer);

		
	// --------------------------------------------------------------------------------
	// Prototype
	
		Timer.prototype =
		{
			constructor:Timer,
		
			startDate:null,
			
			endDate:null,
			
			running:false,
			
			get time()
			{
				return Timer.format(this.milliseconds);
			},
			
			get milliseconds()
			{
				if(this.endDate && this.startDate)
				{
					var ms = this.endDate.getTime() - this.startDate.getTime();
				}
				return new Date(ms || 0).getTime()
			},
			
			start:function()
			{
				this.running	= true;
				this.startDate	= new Date();
				return this;
			},
			
			stop:function(print)
			{
				if(this.running)
				{
					this.endDate	= new Date();
					this.running	= false;
					if(print)
					{
						fl.trace('Timer "' +this.name+ '" took ' + this.time)
					}
				}
				return this;
			},
			
			toString:function()
			{
				return '[object Timer:' +this.time+ ']';
			}
		}
		
		Timer.toString = function()
		{
			return '[class Timer]';
		}

		
		xjsfl.classes.register('Timer', Timer);
	
		
	// --------------------------------------------------------------------------------
	// Test code
	
		if( ! xjsfl.file.loading)
		{
			// methods
				function test()
				{
					var arr = [];
					for(var i = 0; i < 500000; i++)
					{
						var sin = Math.sin(i);
						arr.push(sin)
					}
				}
				
				function report(timer)
				{
					fl.trace('time:			' + timer.time);
					fl.trace('milliseconds:	' + timer.milliseconds);
					fl.trace('startDate:		' + timer.startDate);
					fl.trace('endDate:		' + timer.endDate);
					fl.trace('\n');
				}
			
			// clear
				fl.outputPanel.clear();
			
			// instance code
				var timer = new Timer('Instance').start();
				test();
				timer.stop(true);
				report(timer)
				
				timer.start();
				test();
				timer.stop(true);
				report(timer)
				
			// static code
				Timer.start('Static');
				test();
				Timer.stop(true);
				report(Timer.instance)
				
				Timer.start('Static');
				test();
				Timer.stop(true);
				report(Timer.instance)
	
		}
