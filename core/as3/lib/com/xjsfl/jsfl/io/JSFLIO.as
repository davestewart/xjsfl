package com.xjsfl.jsfl.io 
{
	import flash.events.EventDispatcher;

	/**
	 * An intermediary convenience class to call namespaced methods in JSFL
	 * 
	 * Extend this class to encapsulate related JSFL communication
	 * @author Dave Stewart
	 */
	public class JSFLIO
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// constants
				
			
			// stage instances
				
			
			// properties
				protected var _namespace:String;
				
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function JSFLIO(_namespace:String = ''):void
			{
				this._namespace = _namespace;
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Configuration
		
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public methods
		
			public function call(method:String, ...args:*):*
			{
				return JSFL.call(_namespace + '.' + method, args, _namespace);
			}
			
			public function grab(property:String):*
			{
				return JSFL.grab(_namespace + '.' + property);
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