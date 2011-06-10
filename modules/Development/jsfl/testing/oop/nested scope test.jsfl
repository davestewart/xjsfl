

var snippets =
{
	val:'snippets val',
	obj:
	{
		val:'obj val',
		test:function()
		{
			alert(this.val)
		}
	}
}


snippets.obj.test();