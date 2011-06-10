if(XML)
{
   fl.runScript(fl.scriptURI.replace(/[^\/]+$/, '') + 'core/jsfl/install/install.jsfl');
}
else
{
	alert('Eeek! Installation not possible :(\n\nxJSFL requires E4X, available in Flash CS3 or newer to run');
}