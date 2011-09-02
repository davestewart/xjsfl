package
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.events.Event;
	
	import com.xjsfl.modules.AbstractModule;
	import com.xjsfl.modules.JSFL;
	import com.xjsfl.modules.Loader;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class SampleModule extends AbstractModule
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// Singleton constant
				public static const instance:SampleModule = new SampleModule();
				
			// properties
				public var loader		:Loader;
				
			// assets
				public var settings		:XML;
				public var butterfly	:DisplayObject;
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function SampleModule()
			{
				setup
				(
					'xjsfl.modules.sample', 
					'file:///E|/05%20-%20Commercial%20Projects/xJSFL/3%20-%20development/xJSFL/modules/Sample/', 
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
					
				// use Loader.create to load assets
					loader = Loader.create
					(
						this,
						{
							'settings':		'sample.xml'
						},
						{
							'butterfly':	'butterfly.png'
						},
						start
					);
			}
			
			/**
			 * Manualyl-added method to run when all assets have loaded
			 * @param	loader
			 */
			protected function start(event:Event):void 
			{
				// set named module variables
					(event.target as Loader).populate(this);
					
				// forward event
					dispatchEvent(event);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods

			/**
			 * Public API to JSFL module method
			 */
			public function doSomething():String 
			{
				var result:String = call('test');
				return 'This module was instantiated on: ' + result;
			}
			
	}

}