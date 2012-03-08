package com.xjsfl.jsfl.panels 
{
	import adobe.utils.MMExecute;
	import com.xjsfl.jsfl.io.JSFL;
	
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.net.URLRequest;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class PanelStub extends MovieClip
	{
		
		public function PanelStub() 
		{
			// empty constructor
		}
		
		public function load(_namespace:String, uri:String = ''):void 
		{
			// get the URI
				if (JSFL.isPanel)
				{
					MMExecute('xjsfl.init(this);');
					var manifest:XML =  JSFL.call('xjsfl.modules.getManifest', [_namespace]);
					if (manifest)
					{
						var moduleURI	:String		= manifest.data.uri;
						var panel		:String		= manifest.data.panel;
						uri							= moduleURI + 'ui/' + panel + '.swf';
					}
				}
				else
				{
					if (uri === '')
					{
						trace('PanelStub: module "' +_namespace+ '" will only be loaded when opened as a Flash panel');
					}
					else
					{
						trace('PanelStub: loading development URI "' +uri+ '"');
					}
				}
			
			// load panel
				if (uri != '')
				{
					var loader:flash.display.Loader		= new flash.display.Loader();
					loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onComplete);
					loader.load(new URLRequest(uri));
					addChild(loader);
				}
		}
		
		protected function onComplete(event:Event):void 
		{
			JSFL.trace('Loaded...');
		}

	}

}