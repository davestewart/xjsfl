/**
 * Allows you to check which variables are defined
 * @icon {iconsURI}feedback/action/action_help.png
 */
(function()
{
	var name	= prompt("Enter a variable name / namespace");
	try
	{
		var value	= eval(name);
		if(value != null)
		{
			xjsfl.init(this);
			inspect(value, name, true);
		}
	}
	catch(error)
	{
		fl.trace('Invalid value "' +name+ '"');
	}
	
})()
