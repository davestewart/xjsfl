if(/\/xJSFL\/install\.jsfl$/.test(fl.scriptURI))
{
	fl.runScript(fl.scriptURI.replace(/[^\/]+$/, 'core/install/install.jsfl'));
}
else
{
	alert("The xJSFL installation folder must be named 'xJSFL'\n\nPlease rename and start again");
}