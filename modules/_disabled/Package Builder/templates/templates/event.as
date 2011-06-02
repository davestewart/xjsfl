package {package} 
{
	{imports}
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class {className} {extends}
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Constants

			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function {className}(type:String, bubbles:Boolean=false, cancelable:Boolean=false) 
			{ 
				super(type, bubbles, cancelable);
				
			} 
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			public override function clone():Event 
			{ 
				return new NewEvent(type, bubbles, cancelable);
			} 
			
			public override function toString():String 
			{ 
				return formatToString("{className}", "type", "bubbles", "cancelable", "eventPhase"); 
			}
		
	}
	
}