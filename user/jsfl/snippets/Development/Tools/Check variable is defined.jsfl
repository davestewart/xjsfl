/**
 * Allows you to check which variables are defined
 * @icon {iconsURI}Feedback/action/action_help.png
 */

(function()
{
	var name	= prompt("Enter a variable name");
	var value	= eval(name)
	if(value !== undefined)
	{
		Output.inspect(value, name, true);
	}
	
})()
