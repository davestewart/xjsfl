package com.xjsfl.jsfl.modules
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	import flash.external.ExternalInterface;

	import flash.events.*;
	
	import adobe.utils.MMExecute;
	import com.xjsfl.jsfl.JSFL;

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
		
			// module properties
				private var _name				:String;					// Name of the module, i.e. "Keyframer" (derived from the module URI)
				private var _moduleURI			:String;					// JSFL URI to the module, i.e. "file:///C|/scripting/flash/xJSFL/modules/Tools/Keyframer/"
				private var _namespace			:String						// JSFL namespace of the module, i.e. "xjsfl.modules.tools.keyframer"
					
			// xjsfl properties	
				private var _xjsflURI			:String;					// JSFL URI to xJSFL, i.e. "file:///C|/scripting/flash/xJSFL/"
					
			// logging	
				public var allowLogging			:Boolean;					// Boolean to allow logging, defaults to true
				
			// root
				protected var _root				:DisplayObjectContainer;	// A reference to the swf root
				protected var _showContextMenu	:Boolean
				
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 * 
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
			 * @param	name			The full name of the panel that will show in the Flash UI
			 * @param	moduleURI		The full URI to the authoring-time module root folder, i.e. file:///C|/projects/xJSFL/modules/Keyframer
			 * @param	xjsflURI		The full URI to the authoring-time xJSFL root folder, i.e. file:///C|/projects/xJSFL/
			 */
			protected function setup(_namespace:String, name:String, moduleURI:String, xjsflURI:String):void
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
							_name				= name;
							_moduleURI			= moduleURI.replace(/\/+$/, '/');
							_xjsflURI			= xjsflURI.replace(/\/+$/, '/');
							
						// properties
							this.allowLogging	= true;
							
						// Grab correct URIs when running in a panel
							_xjsflURI			= JSFL.isPanel ? MMExecute('xjsfl.uri') : _xjsflURI;
							_moduleURI			= JSFL.isPanel ? MMExecute(fqns + '.uri') : _moduleURI;
						
						// register module so it can't be setup twice
							AbstractModule.modules[_namespace] = this;
							
						// set up externally-callable methods
							ExternalInterface.addCallback('reload', reload);
							
						// initialize
							initialize();
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
				log('Initializing');
				MMExecute('xjsfl.init(this, "' + _name + '")');
				MMExecute('xjsfl.modules.reload("' + _namespace + '")');
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
				if ( ! _namespace )
				{
					throw new Error('Error in AbstractModule: namespace is null; remember to call setup() first!');
				}
				return JSFL.call(fqns + '.' + method, args, fqns);
			}
			
			public function grab(property:String):*
			{
				return JSFL.grab(fqns + '.' + property);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			/// The name of the module, which is the name of the last folder in the module's path
			public function get name():String { return _name }
			
			/// The JSFL namespace of the module
			public function get ns():String { return _namespace; }
			
			/// The fully-qualifyed JSFL namespace of the module
			public function get fqns():String { return 'xjsfl.modules.' + this._namespace; }
			
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
					initContextMenu(_root);
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
				JSFL.trace('  > Namespace:    ' + fqns);
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
			protected function log(message:String):void 
			{
				message = '> ' + _name + ': ' + message;
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
