/**
 * Lists all defined variables
 * @icon {iconsURI}Feedback/action/action_help.png
 */

(function()
{
	for(var i in window)
	{
		fl.trace(i + ':' + window[i])
	}
})();

//Output.inspect(this)