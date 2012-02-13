property the_path : "{path}"
set the_folder to (POSIX file the_path) as alias
tell application "Finder"
	reveal the_folder
	activate
end tell
