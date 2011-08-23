/**
 * Copy the currently-selected font's name to the clipboard
 * @icon {iconsURI}Design/font/Font.png
 */
(function()
{
	var fontName = "'" + fl.getPrefString("TextFontPanel", "Platform Font Name") + "'";
	trace(fontName)
	fl.clipCopyString(fontName);
})()
