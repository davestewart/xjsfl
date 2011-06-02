fl.outputPanel.clear();

foo =
{
	str:'',
	fn:function()
	{
		this.str += 1;
	}
}

bar =
{
	start:function()
	{
		foo.fn();
	}
}

bar.start();

fl.trace(foo.str)