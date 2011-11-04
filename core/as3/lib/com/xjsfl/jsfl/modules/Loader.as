package com.xjsfl.jsfl.modules 
{
	import com.xjsfl.jsfl.io.JSFL;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;

	import com.greensock.*;
	import com.greensock.loading.*;
	import com.greensock.loading.core.*;
	import com.greensock.events.LoaderEvent;
	import com.greensock.loading.display.*;
	
	import com.xjsfl.jsfl.modules.AbstractModule;
	
	/**
	 * Wrapper class for greensock LoaderMax
	 * @author Dave Stewart
	 */
	public class Loader extends EventDispatcher
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// properties
				protected var _module		:AbstractModule;
				protected var _loader		:LoaderMax;
				
			// assets and config hash
				protected var _content		:Object;		// config + assets
				protected var _config		:Object;		// config
				protected var _assets		:Object;		// assets
				
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			/**
			 * Constructor for the xJSFL Loader class
			 * @param	module			
			 * @param	config			
			 * @param	assets			
			 * @param	properties		
			 */
			public function Loader(module:AbstractModule, config:Object = null, assets:Object = null, properties:Object = null)
			{
				// objects
					_content	= { };
					_config		= { };
					_assets		= { };
				
				// variables
					_module		= module;
					_loader		= new LoaderMax( properties );
				 
				// register JSON with LoaderMax
					LoaderMax.registerFileType('json', DataLoader);
					
				// force all loader types to compile
					LoaderMax.activate( [ CSSLoader, DataLoader, ImageLoader, MP3Loader, SWFLoader, VideoLoader, XMLLoader ] );
					
				// load config
					if (config)
					{
						for (var name:String in config)
						{
							addConfig(config[name], { name:name } );
						}
					}
					
				// load assets
					if (assets)
					{
						for (name in assets)
						{
							addAsset(assets[name], { name:name } );
						}
					}
					
				// LoaderMax event handler
					loader.addEventListener(LoaderEvent.COMPLETE, onAllComplete);
					
				// Loader event handler
					if (properties && properties.onAllComplete is Function)
					{
						this.addEventListener(Event.COMPLETE, properties.onAllComplete);
					}
					
				//start loading
					if (loader.numChildren)
					{
						load();
					}
			}
			
			/**
			 * Static helper method to create and return a Loader scoped to the module, with config and assets set to load, finally calling an onComplete handler
			 * @param	module
			 * @param	config
			 * @param	assets
			 * @param	onAllComplete
			 * @return
			 */
			public static function create(module:AbstractModule, config:Object, assets:Object, onAllComplete:Function):Loader
			{
				var loader:Loader = new Loader(module, config, assets, { onAllComplete:onAllComplete });
				return loader;
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		
			/**
			 * Adds a file to the queue of config items to be loaded
			 * @param	filename
			 * @param	properties
			 */
			protected function addAsset(filename:String, properties:Object = null):void
			{
				var item:LoaderCore			= getLoader(filename, properties);
				_assets[properties.name]	= _content[properties.name] = item;
				loader.append(item);
			}
			
			/**
			 * Adds a file to the queue of config items to be loaded
			 * @param	filename
			 * @param	target
			 */
			protected function addConfig(filename:String, properties:Object = null):void
			{
				var item:LoaderCore			= getLoader(filename, properties);
				_config[properties.name]	= _content[properties.name] = item;
				loader.append(item);
			}
			
			/**
			 * Adds a file to the queue of items to be loaded. Config or Asset type is determined by file extension
			 * @param	filename
			 * @param	properties
			 */
			public function add(filename:String, properties:Object = null):void 
			{
				if (/\/config\//.test(filename))
				{
					addConfig(filename, properties);
				}
				else
				{
					addAsset(filename, properties);
				}
			}
			
			/**
			 * Returns a LoaderMax loader of the correct type for the filename extension
			 * @param	filename
			 * @param	properties
			 * @return
			 */
			public function getLoader(filename:String, properties:Object = null):LoaderCore
			{
				// variables
					var uri		:String;
					
				// properties
					properties					= properties || { };
					properties.onComplete		= properties.onComplete || this.onComplete;
					properties.onError			= properties.onError || this.onError
					
				// if an absolute URI is given, just return a loader of the correct type
					if (filename.indexOf('file://') == 0)
					{
						uri = filename;
					}
					
				// config
					else if (/\.xml$/.test(filename))
					{
						uri							= module.xjsflURI + 'user/config/' + filename;
						properties.alternateURL		= module.uri + 'config/' + filename;
					}
					
				// assets
					else
					{
						uri							= module.uri + 'assets/' + filename;
					}
				
				// item
					return LoaderMax.parse(uri, properties);
			}
			
			/**
			 * Loads the queued loaders
			 */
			public function load():void 
			{
				loader.load();
			}
			
			/**
			 * Populates a target object with the Loader's loaded data, matching individual loader names to target properties 
			 * @param	target
			 */
			public function populate(target:Object):void 
			{
				for (var name:String in content)
				{
					if (name && target.hasOwnProperty(name))
					{
						target[name] = content[name];
					}
				}
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			/// 
			public function get module():AbstractModule {  return _module; }
			
			/// 
			public function get loader():LoaderMax { return _loader; }
			
			/// 
			public function get assets():Object { return _assets; }
			
			/// 
			public function get config():Object { return _config; }
			
			/// 
			public function get content():Object { return _content; }
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onComplete(event:LoaderEvent):void
			{
				// grab item
					var item	:LoaderItem	= event.target as LoaderItem;
					
				// update target if supplied
					if (item.name)
					{
						// if the LoaderItem is an XMLLoader (i.e. a config item) then update all placeholder variables in its content
							if (item is XMLLoader)
							{
								// paths
								//TODO Get these from xjsfl.settings.uris
									var uris:Object =
									{
										module:		module.uri,
										xjsfl:		module.xjsflURI,
										user:		module.xjsflURI + 'user/',
										
										moduleURI:	module.uri,
										xjsflURI:	module.xjsflURI,
										userURI:	module.xjsflURI + 'user/'					
									};
									
								// grab xml
									var xml:String = item.content.toXMLString();
									
								// loop over plaeholders and update xml
									for (var name:String in uris)
									{
										xml = xml.replace(new RegExp('{' + name + '}', 'gi'), uris[name]);
									}
									
								// assign the XML
									_content[item.name] = _config[item.name] = new XML(xml);
							}
							
						// otherwise, just assign
							else
							{
								_content[item.name] = _assets[item.name] = item.content;
							}
					}
			}
			
			protected function onAllComplete(event:LoaderEvent):void 
			{
				dispatchEvent(new Event(Event.COMPLETE));
			}
			
			protected function onError(event:LoaderEvent):void
			{
				//trace(event);
			}
	}

}