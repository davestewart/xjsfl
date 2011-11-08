// ------------------------------------------------------------------------------------------------------------------------
//
//  ██
//  ██
//  ██     █████ █████ █████ █████ ████
//  ██     ██ ██ ██ ██ ██ ██ ██ ██ ██
//  ██     ██ ██ ██ ██ ██ ██ █████ ██
//  ██     ██ ██ ██ ██ ██ ██ ██    ██
//  ██████ █████ █████ █████ █████ ██
//                  ██    ██
//               █████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Logger - logs data to a text file

	function Logger(uriOrPath, useTimestamp)
	{
		if( ! uriOrPath)
		{
			throw new ReferenceError('Logger Error: URI or path was not supplied');
		}
		uriOrPath = uriOrPath.replace(/(\.txt)?$/, '.txt');
		this.useTimestamp = useTimestamp;
		this.file = new File(uriOrPath, 'Log created on: ' + new Date().toUTCString() + '\n\n');
	}

	Logger.prototype =
	{
		file:null,

		useTimestamp:false,

		get contents()
		{
			return file.contents;
		},

		set contents(value)
		{
			this.file.contents = value;
		},

		log:function(value)
		{
			if(this.useTimestamp)
			{
				value = new Date().toUTCString() + '\t' + value;
			}
			this.file.write(value + '\n', true);
			this.file.save();
		},

		write:function(value)
		{
			this.log(value);
		},

		clear:function()
		{
			this.file.contents = '';
		},

		open:function()
		{
			this.file.open();
		},

		reveal:function()
		{
			this.file.reveal();
		},

		remove:function()
		{
			this.file.remove();
		},

		toString:function()
		{
			return '[object Logger path="' +this.file.path+ '"]';
		}
	}

	xjsfl.classes.register('Logger', Logger);
