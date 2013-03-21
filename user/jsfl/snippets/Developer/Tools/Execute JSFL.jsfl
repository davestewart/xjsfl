/**
 * Executes some arbitrary JSFL
 * @icon {iconsURI}actions/lightning/lightning.png
 */

(function()
{
	xjsfl.init(this);
	
	function onAccept(jsfl)
	{
		try
		{
			trace( eval(jsfl) );
		}
		catch(error)
		{
			trace(error);
		}
	}
	
	XUL
		.factory()
		.setTitle('Execute JSFL')
		.setColumns([50, 400])
		.addTextbox('JSFL', 'jsfl', {multiline:true, width:400})
		.show(onAccept)
	
})()
