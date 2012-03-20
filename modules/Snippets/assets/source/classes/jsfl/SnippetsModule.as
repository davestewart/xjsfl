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
		// { region: Instantiation
		
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
		// { region: Set management
		
			public function loadSet(name:String):void 
			{
				currentSet		= name;
				var uri:String	= this.uri + 'config/snippets/' + name + '.xml';
				Loader.create(this, {data:uri}, null, onDataLoaded);
			}
	
			public function manageSets():void 
			{
				call('manageSets');
			}

			public function rebuildSet():* 
			{
				call('rebuildSet');
				loadSet(currentSet);
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: File management
		
			/**
			 * 
			 * @param	uri
			 * @return
			 */
			public function runFile(uri:String):*
			{
				return call('runFile', uri);
			}
			
			/**
			 * 
			 * @param	uri
			 * @return
			 */
			public function runFunction(uri:String, name:String):*
			{
				return call('runFunction', uri, name);
			}
			
			/**
			 * 
			 * @param	uri
			 * @return
			 */
			public function openFile(uri:String):*
			{
				return call('openFile', uri);
			}
			
			/**
			 * 
			 * @param	uri
			 * @return
			 */
			public function browseFile(uri:String):*
			{
				return call('browseFile', uri);
			}
			
			/**
			 * 
			 * @param	uri
			 * @return
			 */
			public function browseFolder(uri:String):*
			{
				return call('browseFolder', uri);
			}
			
			/**
			 * 
			 * @param	uri
			 * @return
			 */
			public function deleteFile(uri:String):*
			{
				var result:Boolean = call('deleteFile', uri);
				if (result)
				{
					rebuildSet();
				}
			}
			
			/**
			 * 
			 * @param	uri
			 * @return
			 */
			public function deleteFolder(uri:String):*
			{
				return call('deleteFolder', uri);
			}
			
			/**
			 * 
			 * @param	name
			 * @param	uri
			 * @return
			 */
			public function createCommand(name:String, uri:String):*
			{
				return call('createCommand', name, uri);
			}
			
			/**
			 * 
			 * @param	uri
			 * @return
			 */
			public function createFolder(uri:String):*
			{
				return call('createFolder', uri);
			}
			
			/**
			 * 
			 * @param	uri
			 * @param	contents
			 * @param	desc
			 * @param	icon
			 * @param	version
			 * @param	author
			 * @return
			 */
			public function createFile(uri:String, contents:String, desc:String, icon:String, version:String, author:String):*
			{
				return call('createFile', uri, contents, desc, icon, version, author);
			}
			
			/**
			 * 
			 * @param	uri
			 * @param	state
			 */
			public function setFolderState(uri:String, state:Boolean):Boolean 
			{
				return call('setFolderState', uri, state);
			}
			
			public function setScrollPosition(position:int):void 
			{
				call('setScrollPosition', position);
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
					
				// debug
					//trace(items.toXMLString())
					
				// complete
					dispatchEvent(new Event(Event.COMPLETE));
			}
	}

}