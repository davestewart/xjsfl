// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██                      ██████              ██          ██
//  ██  ██                      ██  ██              ██          ██
//  ██  ██ █████ █████ ████     ██  ██ █████ █████ █████ █████ █████ ████ █████ █████
//  ██  ██ ██    ██ ██ ██       █████  ██ ██ ██ ██  ██   ██     ██   ██      ██ ██ ██
//  ██  ██ █████ █████ ██       ██  ██ ██ ██ ██ ██  ██   █████  ██   ██   █████ ██ ██
//  ██  ██    ██ ██    ██       ██  ██ ██ ██ ██ ██  ██      ██  ██   ██   ██ ██ ██ ██
//  ██████ █████ █████ ██       ██████ █████ █████  ████ █████  ████ ██   █████ █████
//                                                                              ██
//                                                                              ██
//
// ------------------------------------------------------------------------------------------------------------------------
// User Bootstrap - run user code here

	try
	{
		// register any user paths
			//xjsfl.settings.folders.add('temp', 'c:/temp/')

		// load user libraries
			xjsfl.output.log('loading user libraries...', true);
			xjsfl.classes.load('/jsfl/libraries/*.jsfl');

		// add user code
			// something...

	}
	catch(error)
	{
		xjsfl.output.log('error running user bootstrap');
		fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');
		fl.runScript(xjsfl.uri + 'core/jsfl/libraries/output.jsfl');
		xjsfl.output.log(xjsfl.debug.error(error), false, false);
	}
