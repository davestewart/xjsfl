/**
 * Prompts the user for a template script, then loads it into the current frame
 * @icon {iconsURI}Filesystem/file/file_code_red.png
 */

var dom			= fl.getDocumentDOM();
var timeline	= dom.getTimeline();
var frames		= timeline.getSelectedFrames();

alert(dom)

if(timeline)
{
	if(frames.length == 0)
	{
		frames = [0, 0, 1];
	}
	var uri			= fl.browseForFileURL("open", "Select a template ActionScript file");
	if(uri != undefined)
	{
		var file		= new File(uri);
		var frame		= timeline.layers[frames[0]].frames[frames[1]]
	
		var script		= file.exists ? file.contents : '// file "' +file.path+ '" not found!';
	
		frame.actionScript = script.replace(/^\s+/g, '') + '\n\n' + frame.actionScript;
		
		timeline.setSelectedLayers(frames[0])
		timeline.setSelectedFrames(frames)
	}
}
else
{
	alert('This script needs to be run on a document timeline')
}
