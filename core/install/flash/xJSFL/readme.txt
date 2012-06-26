This folder allows you to configure xJSFL on a per-user setting.

By default, xJSFL looks for files locally in subfolders of the main xJSFL installation folder.

It has a folder "search order" for finding files, which allows users to overide modules to
overide core. The search order is (usually):

 1 - <Flash>/xJSFL/
 2 - <install path>/xJSFL/user/
 3 - <install path>/xJSFL/modules/<module x>/
 4 - <install path>/xJSFL/modules/<module y>/
 5 - <install path>/xJSFL/modules/<module z>/
 6 - <install path>/xJSFL/core/

With the default installation, files are usually found and loaded from user, or core, in the
install path. Because this folder is global to all users, that means all users share the same
settings.

If, however, you want to have custom settings per user, you can simply copy, then modify any
settings folders to this folder.

For example, if you want custom user settings per machine login, you would copy the user config
file from the main xJSFL/user folder to the Flash/xJSFL folder, like so:

	xJSFL/
		user/
			config/
				user.xml
				
	Flash/
		en/
			Configuration/
				xJSFL/
					user/
						config/
							user.xml
				
Then, when xJSFL loads in files, the custom user.xml file will be found first, and the settings
loaded. If not, it will continue looking for them in the shared user folder.

Any questions, get yourself on the forum.

Cheers,
Dave

