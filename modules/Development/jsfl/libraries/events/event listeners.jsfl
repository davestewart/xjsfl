
addXJSFL = function()
{
	fl.trace('> xjsfl: loading xjsfl library');
	fl.runScript('file:///E|/05%20-%20Commercial%20Projects/xJSFL/3%20-%20xJSFL/user/jsfl/lfpug/xjsfl.jsfl');
}

fl.addEventListener("documentNew", addXJSFL)
fl.addEventListener("documentOpened", addXJSFL)

fl.trace('> xjsfl: event listeners run');

//"documentNew", "documentOpened", "documentClosed", "mouseMove", "documentChanged", "layerChanged", and "frameChanged".



