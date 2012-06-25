// -----------------------------------------------------------------------------------------------------------------------------------------
// Demo code

	/**
	 * filename examples
	 * @snippets	all
	 */

	// initialize
		xjsfl.init(this);
		clear();
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// uris	
		
		var list = new URIList('//core/', true);
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// functions

		/**
		 * Find, filter and update a list
		 */
		function uriStandard()
		{
			var paths = list.getPaths('core/ui');
			inspect(paths)
		}
		
		/**
		 * Find, filter and update another list
		 */
		function uriInteractive()
		{
			
			/**
			 * Find an item in the list
			 * @param	{XULEvent}	event	Description
			 * @private
			 */
			function onShow(event)
			{
				clear();
				
				var path		= event.xul.controls.path.value;
				var pattern		= event.xul.controls.pattern.value;
				var operation	= event.xul.controls.operation.value;
				var asPaths		= event.xul.controls.paths.value;
				
				var find		= operation === 'find';
				var timer		= new Timer().start();
				
				
				if(operation == 'all')
				{
					results = asPaths ? list.getPaths() : list.getURIs();
				}
				else if(operation == 'update')
				{
					results = asPaths ? list.update(path).getPaths() : list.update(path).getURIs();
				}
				else
				{
					if(asPaths)
					{
						var results = list.getPaths(pattern, find);
					}
					else
					{
						var results = list.getURIs(pattern, find);
					}
				}
				
				
				event.xul.controls.time.value		= timer.stop();
				event.xul.controls.results.value	= find ? 1 : results.length;
				inspect(results);	
			}
			
			XUL
				.factory()
				.setTitle('URIList example')
				.addTextbox('Path', 'path', {value:'//core/'})
				.addTextbox('Pattern')
				.addRadiogroup('Operation', 'operation', ['all', 'filter', 'find'])
				.addCheckbox('Show paths', 'paths')
				.addButton('Show')
				.add('Time')
				.add('Results')
				.addEvent('show', 'click', onShow)
				.show();
		}
