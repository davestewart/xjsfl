/**
 * Allows you to check which variables are defined
 * @icon {iconsURI}Feedback/action/action_help.png
 */

var varName = prompt("Enter a variable name");
if(varName != undefined)
{
	//fl.trace(varName + ':' + window[varName])
	Output.inspect(window[varName]);
}
