// Don't make this var, or it won't be visible afterwards.
append_to_command_output_window = function(str) {
    try {
        // First make sure the command output window is visible
        ko.run.output.show(window, false);
        // Second, make sure we're showing the output pane, not the error list pane.
        var deckWidget = document.getElementById("runoutput-deck");
        if (deckWidget.getAttribute("selectedIndex") != 0) {
            ko.run.output.toggleView();
        }
        // Now find out which newline sequence the window uses, and write the
        // text to it.
        var scimoz = document.getElementById("runoutput-scintilla").scimoz;
        var prevLength = scimoz.length;
        var currNL = ["\r\n", "\n", "\r"][scimoz.eOLMode];
        var full_str = str + currNL;
        var full_str_byte_length = ko.stringutils.bytelength(full_str);
        var ro = scimoz.readOnly;
        try {
            scimoz.readOnly = false;
            scimoz.appendText(full_str_byte_length, full_str);
        } finally {
            scimoz.readOnly = ro;
        }
        // Bring the new text into view.
        scimoz.gotoPos(prevLength + 1);
    } catch(ex) {
        alert("problems printing [" + str + "]:" + ex + "\n");
    }
};