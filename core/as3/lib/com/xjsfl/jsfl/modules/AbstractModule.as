package com.xjsfl.jsfl.modules
{
	import com.xjsfl.jsfl.io.JSFLIO;
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import flash.ui.ContextMenu;

	import flash.events.*;
	
	import adobe.utils.MMExecute;
	import com.xjsfl.jsfl.io.JSFL;

	import com.xjsfl.ui.controls.rightclickmenu.RightClickMenu;
	import com.xjsfl.ui.controls.rightclickmenu.RightClickMenuEvent;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class AbstractModule extends EventDispatcher
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// static module store, prevents modules being instantiated twice
				public static var modules		:Array			= [];
				
			// current enabled state of xJSFL
				public var enabled				:Boolean;
		
			// logging	
				public var allowLogging			:Boolean;					// Boolean to allow logging, defaults to true
				
			// xjsfl properties	
				private var _xjsflURI			:String;					// JSFL URI to xJSFL, i.e. "file:///C|/scripting/flash/xJSFL/"
					
			// module properties
				private var _name				:String;					// Name of the module, i.e. "Keyframer" (will use the manifest at runtime, otherwise, the namespace)
				private var _namespace			:String						// JSFL namespace of the module, i.e. "xjsfl.modules.tools.keyframer"
				private var _moduleURI			:String;					// JSFL URI to the module, i.e. "file:///C|/scripting/flash/xJSFL/modules/Tools/Keyframer/"
					
			// root
				protected var _root				:DisplayObjectContainer;	// A reference to the swf root
				protected var _showContextMenu	:Boolean;
				
			// io
				protected var io				:JSFLIO;					// The I/O for the JSFL
				
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 * Empty constructor as setup code is self-contained, and we want subclasses 
			 * to be able to initialize themselves with static instances using a const
			 */
			public function AbstractModule()
			{
				// empty constructor
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Configuration
		
			/**
			 * 
			 * @param	classRef
			 * @param	root
			 * @return
			 */
			public static function create(classRef:Class, root:DisplayObjectContainer = null):AbstractModule 
			{
				var module:AbstractModule = classRef.instance ? classRef.instance : new classRef;
				if (root)
				{
					module.root = root;
				}
				return module;
			}
			
			/**
			 * 
			 * @param	_namespace		The namespace of the module in xjsfl.modules, i.e. keyframer
			 * @param	moduleURI		The full URI to the authoring-time module root folder, i.e. file:///C|/projects/xJSFL/modules/Keyframer
			 * @param	xjsflURI		The full URI to the authoring-time xJSFL root folder, i.e. file:///C|/projects/xJSFL/
			 */
			protected function setup(_namespace:String, moduleURI:String, xjsflURI:String):void
			{
				// check URIs are valid
					if ( ! (/^(file|http):/.test(moduleURI)) )
					{
						throw new ReferenceError('A valid authoring-time moduleURI needs to be passed to setup() to instantiate a module');
					}
				
					if ( ! (/^(file|http):/.test(xjsflURI)) )
					{
						throw new ReferenceError('A valid authoring-time xjsflURI needs to be passed to setup() to instantiate a module');
					}
				
				// setup module
					if ( ! AbstractModule.modules[_namespace] )
					{
						// variables
							this._namespace		= _namespace;
							_moduleURI			= moduleURI.replace(/\/+$/, '/');
							_xjsflURI			= xjsflURI.replace(/\/+$/, '/');
						
						// test that xJSFL is installed
							var state:Boolean	= MMExecute('!!(xjsfl && xjsfl.modules)') === 'true';
							enabled				= JSFL.isPanel ? state : true;
							
						// continue if installed
							if(enabled)
							{
								// Grab correct data when running in a panel
									_xjsflURI			= JSFL.isPanel ? MMExecute('xjsfl.uri') : _xjsflURI;
									_moduleURI			= JSFL.isPanel ? MMExecute('xjsfl && xjsfl.modules ? xjsfl.modules.getManifest("' +_namespace+ '").data.uri : null') : _moduleURI;
									_name				= JSFL.isPanel ? MMExecute('xjsfl && xjsfl.modules ? xjsfl.modules.getManifest("' +_namespace+ '").meta.name : null') : _namespace;
										                
								// add I/O	            
									io					= new JSFLIO(_namespace);
										                
								// properties	        
									this.allowLogging	= true;
									
								// register module so it can't be setup twice
									AbstractModule.modules[_namespace] = this;
									
								// set up externally-callable methods
									ExternalInterface.addCallback('reload', reload);
									
								// initialize
									initialize();
							}
					}
					
				// throw an error if previously-setup
					else
					{
						throw new Error('The module "' +_namespace+ '" has already been set up');
					}
			}
			
			/**
			 * Initialize the panel by calling the xJSFL.init() method
			 */
			protected function initialize():void 
			{
				if(enabled)
				{
					log('Initializing', true);
					MMExecute('xjsfl.init(this, "' + _name + '")');
					MMExecute('xjsfl.modules.load("' + _namespace + '")');
				}
				else
				{
					//TODO set up public methods so that we can activate or deactive the panel from JSFL
				}
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 * Reload the JSFL module code, or the entire xJSFL framework from disk
			 * @param	all
			 */
			public function reload(all:Boolean = false):void
			{
				// log progress
					log('Reloading...');
					
				// load the entire framework
					if (all)
					{
						JSFL.exec('xjsfl.reload()');
					}
					
				// reinitialize the Flash panel
					else
					{
						initialize();
					}
			}

			/**
			 * Call a named method in the namespace of the JSFL module
			 */
			public function call(method:String, ...args:*):*
			{
				var params:Array = [method].concat(args.slice(0, args.length));
				return io.call.apply(this, params);
			}
			
			public function grab(property:String):*
			{
				return io.grab(property);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			/// The name of the module, which is the name of the last folder in the module's path
			public function get name():String { return _name }
			
			/// The JSFL namespace of the module
			public function get ns():String { return _namespace; }
			
			/// The URI of the module on the local filesystem
			public function get uri():String { return _moduleURI; }
			
			/// The xJSFL root URI on the local filesystem
			public function get xjsflURI():String { return _xjsflURI; }
				
			/// The path of the module on the local filesystem
			public function get path():String { return unescape(_moduleURI.replace('file:///', '')).replace('|', ':'); }
			
			/// The root DisplayObjectContainer of the Flash panel
			public function get root():DisplayObjectContainer { return _root; }
			public function set root(value:DisplayObjectContainer):void 
			{
				if (!_root)
				{
					_root = value;
					if (enabled)
					{
						initContextMenu(_root);
					}
					else
					{
						_root.contextMenu = new ContextMenu();
						_root.contextMenu.hideBuiltInItems();
					}
				}
			}
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Context menu

			private function initContextMenu(root:DisplayObjectContainer):void
			{
				var xml:XML = <menu>
							<group name="module">
								<menuitem id="aboutModule" separator="true">About {_name}</menuitem>
								<menuitem id="reloadFramework" separator="true">Reload xJSFL</menuitem>
							</group>
						 </menu>
				new RightClickMenu(root, xml, menuItemSelectHandler)
			}
			
			private function menuItemSelectHandler(event:RightClickMenuEvent):void
			{
				switch(String(event.node.@id))
				{
					case 'reloadModule': reload(); break;
					case 'reloadFramework': reload(true); break;
					case 'aboutModule': about(); break;
				}
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
		
			/**
			 * 
			 */
			protected function about():void 
			{
				JSFL.trace('\nModule: ' +name+ '\n');
				JSFL.trace('  > Namespace:    ' + _namespace);
				JSFL.trace('  > Panel path    ' + (JSFL.isPanel ? grab('panel.path').replace(/\\/g, '/') : '<Unknown at authoring time>'));
				JSFL.trace('  > Module path:  ' + path);
				JSFL.trace('  > Module URI:   ' + uri);
				JSFL.trace('  > xJSFL URI:    ' + xjsflURI);
				JSFL.trace('');
			}

			/**
			 * Logs a message to the listener during development
			 * @param	message
			 */
			protected function log(message:String, newline:Boolean = false):void 
			{
				message = (newline ? '\n' : '') + '> ' + _name + ': ' + message;
				allowLogging ? JSFL.trace(message) : trace(message);
			}
			
			/**
			 * Returns a string representation of the module
			 * @return
			 */
			override public function toString():String
			{
				return '[object Module name="' +_name+ '" namespace="' +ns+ '" path="' +path+ '"]';
			}
			
	}

}
