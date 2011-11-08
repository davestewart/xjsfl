package jsfl
{
	import flash.events.Event;
	import flash.external.ExternalInterface;
	
	import com.xjsfl.jsfl.io.JSFL;
	import com.xjsfl.jsfl.modules.AbstractModule;
	import com.xjsfl.jsfl.modules.Loader;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class SnippetsModule extends AbstractModule
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// Singleton constant
				public static const instance	:SnippetsModule = new SnippetsModule();
				
			// assets
				public var settings				:XML;
				public var data					:XML;
				
			// data
				protected var currentSet		:String;
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function SnippetsModule()
			{
				setup
				(
					'Snippets', 
					'file:///E|/05%20-%20Commercial%20Projects/xJSFL/3%20-%20development/xJSFL/modules/Snippets/',
					'file:///E|/05%20-%20Commercial%20Projects/xJSFL/3%20-%20development/xJSFL/'
				);
			}
			
			/**
			 * Initialize is automatically called right after setup has run
			 */
			override protected function initialize():void 
			{
				// super
					super.initialize();
					
				// external panel update
					ExternalInterface.addCallback('loadSet', loadSet);
					
				// load settings
					Loader.create(this, { settings:'snippets.xml' }, null, onSettingsLoaded);
			}
			
			protected function onSettingsLoaded(event:Event):void 
			{
				// populate
					(event.target as Loader).populate(this);
					
				// load correct data
					var sets		:XMLList	= settings.sets.set;
					var set			:XMLList	= sets.(@name == String(settings.sets.@current));
					loadSet(String(set.@name))
			}
			

			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		
			public function loadSet(name:String):void 
			{
				currentSet		= name;
				var uri:String	= this.uri + 'config/data/' + name + '.xml';
				Loader.create(this, {data:uri}, null, onDataLoaded);
			}
	
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Module methods
		
			/**
			 * 
			 * @param	path
			 * @return
			 */
			public function runFile(path:String):*
			{
				return call('runFile', path);
			}
			
			/**
			 * 
			 * @param	path
			 * @return
			 */
			public function openFile(path:String):*
			{
				return call('openFile', path);
			}
			
			/**
			 * 
			 * @param	path
			 * @return
			 */
			public function browseFile(path:String):*
			{
				return call('browseFile', path);
			}
			
			/**
			 * 
			 * @param	path
			 * @return
			 */
			public function browseFolder(path:String):*
			{
				return call('browseFolder', path);
			}
			
			/**
			 * 
			 * @param	path
			 * @return
			 */
			public function deleteFile(path:String):*
			{
				var result:Boolean = call('deleteFile', path);
				if (result)
				{
					reloadData();
				}
			}
			
			/**
			 * 
			 * @param	path
			 * @return
			 */
			public function deleteFolder(path:String):*
			{
				return call('deleteFolder', path);
			}
			
			/**
			 * 
			 * @param	name
			 * @param	uri
			 * @return
			 */
			public function createCommand(name:String, path:String):*
			{
				return call('createCommand', name, path);
			}
			
			/**
			 * 
			 * @param	path
			 * @return
			 */
			public function makeFolder(path:String):*
			{
				return call('makeFolder', path);
			}
			
			/**
			 * 
			 * @param	path
			 * @param	contents
			 * @param	desc
			 * @param	icon
			 * @param	version
			 * @param	author
			 * @return
			 */
			public function makeFile(path:String, contents:String, desc:String, icon:String, version:String, author:String):*
			{
				return call('makeFile', path, contents, desc, icon, version, author);
			}
			
			public function reloadData():* 
			{
				call('rebuild');
				loadSet(currentSet);
			}
			
			public function manageSets():void 
			{
				call('manageSets');
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Event handlers
		
			protected function onDataLoaded(event:Event):void 
			{
				//populate
					(event.target as Loader).populate(this);
					
				// update icons
				
					// variables
						var items			:XMLList	= data.item;
						var defaultIcon		:String		= settings.icons.icon.(hasOwnProperty('@name') && @name == 'file').@value;
						
					// update icon paths from relative paths to absolute
						for each(var item:XML in items)
						{
							if( ! item.hasOwnProperty('@icon'))
							{
								item.@icon = uri + 'assets/icons/16x16/' + defaultIcon;
							}
						}
					
				// complete
					dispatchEvent(new Event(Event.COMPLETE));
			}
	}

}