/**
 * Lists all defined variables
 * @icon {iconsURI}Feedback/action/action_help.png
 */
(function()
{
	var values = XUL
		.factory('title:Show variables...,dropdown:From={Top-level only:1,2 levels down:2,3 levels down:3,4 levels down:4,5 levels down:5,6 levels down:6}')
		.show()
		.values;
		
	Output.inspect(this, true, values.from);
	
})()
