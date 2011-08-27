package xjsfl
{
	import com.xjsfl.external.jsfl.IModule;
	import com.xjsfl.external.jsfl.JSFL;
	import com.xjsfl.external.jsfl.AbstractModule;
	import com.xjsfl.utils.Debug;
	import flash.display.DisplayObjectContainer;
	import xjsfl.Constants;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Module extends AbstractModule implements IModule
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// Singleton constant
				public static const instance:Module = new Module();
				
			// properties
				
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function Module()
			{
				setup('Sample', 'xjsfl.modules.sample', Constants.XJSFL_URI);
			}
			
			override protected function initialize():void 
			{
				log('Initialized')
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Configuration
		

		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods

			public function test():void 
			{
				var date = call('test');
				JSFL.alert('The return result is:' + date);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
	}

}