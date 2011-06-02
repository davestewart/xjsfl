package events 
{
	import flash.events.Event;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TestEvent extends Event
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Constants

			
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TestEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false) 
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
				return formatToString("TestEvent", "type", "bubbles", "cancelable", "eventPhase"); 
			}
		
	}
	
}