package
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.events.Event;

	import com.xjsfl.jsfl.io.JSFL;
	import com.xjsfl.jsfl.modules.AbstractModule;
	import com.xjsfl.jsfl.modules.Loader;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class SampleModule extends AbstractModule
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables

			// Create a static instance property as the class is accessed for the first time
				public static const instance:SampleModule = new SampleModule();

			// config
				public var settings		:XML;

			// assets
				public var butterfly	:DisplayObject;


		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation

			public function SampleModule()
			{
				setup
				(
					 // the module's JSFL namespace
						'Sample',

					// authoring-time module folder
						'file:///E|/05%20-%20Commercial%20Projects/xJSFL/3%20-%20development/xJSFL/modules/Sample Module/',

					// authoring-time xJSFL folder
						'file:///E|/05%20-%20Commercial%20Projects/xJSFL/3%20-%20development/xJSFL/'
				);
			}

			/**
			 * Initialize function, called immediately after AbstractModule.setup()
			 */
			override protected function initialize():void
			{
				// super
					super.initialize();

				// use Loader.create() to create a Loader and load config and assets
					Loader.create
					(
						// a reference to this module, for URIs, etc
							this,

						// a named list of config files to load
							{
								'settings':		'sample.xml'
							},

						// a named list of assets to load
							{
								'butterfly':	'butterfly.png'
							},

						// a callback function to call when loading is complete
							start
					);
			}

			/**
			 * Manualyl-added method to run when all assets have loaded
			 * @param	loader
			 */
			protected function start(event:Event):void
			{
				// extract named loader variables to module scope
					(event.target as Loader).populate(this);

				// forward the load event to other listeners
					dispatchEvent(event);
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods

			/**
			 * Public API to JSFL module method test()
			 */
			public function test():String
			{
				return 'This module was instantiated on: ' + call('test');
			}

	}

}