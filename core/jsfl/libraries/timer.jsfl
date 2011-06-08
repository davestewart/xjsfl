
// --------------------------------------------------------------------------------
// timer constructor

	/**
	 * @type {timer}
	 */
	function Timer(name)
	{
		this.name		= name || 'Timer';
		this.startDate	= new Date();
		this.endDate	= new Date();
	}
	
// --------------------------------------------------------------------------------
// Timer static methods

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
				Timer.instance = new Timer(name);
			},
			
			stop:function(print)
			{
				Timer.instance.stop(print);
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
		
	// extend Timer class
		(function(){
			for(var i in timer)
			{
				Timer[i] = timer[i];
			}
			
		})()
	
// --------------------------------------------------------------------------------
// Timer instance methods

	Timer.prototype =
	{
		startDate:null,
		
		endDate:null,
		
		get time()
		{
			return Timer.format(this.milliseconds);
		},
		
		get milliseconds()
		{
			var ms = this.endDate.getTime() - this.startDate.getTime();
			return new Date(ms).getTime()
		},
		
		start:function()
		{
			this.startDate = new Date();
			return this;
		},
		
		stop:function(print)
		{
			this.endDate = new Date();
			if(print)
			{
				fl.trace('Timer "' +this.name+ '" took ' + this.time)
			}
			return this;
		},
		
		toString:function()
		{
			return '[object Timer:' +this.time+ ']';
		}
	}
	
	xjsfl.classes.register('Timer', Timer);

	
// --------------------------------------------------------------------------------
// Timer test code

	if(false)
	{
		// instance code
			var timer = new Timer('Dave').start();;
			
			var arr = [];
			for(var i = 0; i < 1000000; i++)
			{
				var sin = Math.sin(i);
				arr.push(sin)
			}
			
			timer.stop(true);
			
			fl.trace(timer.time);
			fl.trace(timer.milliseconds);
			fl.trace(timer.startDate);
			fl.trace(timer.endDate);
			
		// static code
			Timer.start();;
			
			var arr = [];
			for(var i = 0; i < 1000000; i++)
			{
				var sin = Math.sin(i);
				arr.push(sin)
			}
			
			Timer.stop(true);
			
			fl.trace(Timer.instance.time);
			fl.trace(Timer.instance.milliseconds);
			fl.trace(Timer.instance.startDate);
			fl.trace(Timer.instance.endDate);
	}
