package com.xjsfl.jsfl.modules 
{
	import flash.net.SharedObject;
	import com.xjsfl.utils.Output;
	
	/**
	 * A Model who's storage mechanism is the Shared Object
	 * The allows the model to synchronously store and reteive up to 
	 * 100K of data between sessions. The data cannot be moved from 
	 * machine to machine
	 * @author Dave Stewart
	 */
	public dynamic class Settings
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// properties
				protected var _name			:String
				protected var _so			:SharedObject;
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 * A SettingsModel has a 1:1 relationship with a Shared object, and is used to 
			 * store up to 100K of persistent data between sessions. Useful for saving small
			 * amounts of data that doesn't need to be transferrable, i.e. user interface
			 * settings, and so on
			 * @param	A string defining the unique name of the SharedObject
			 * @param	An optional 
			 */
			public function Settings(name:String, data:* = null) 
			{
				// properties
					this._name	= name;
					this._so	= SharedObject.getLocal(name.replace(/\W/g, '_'));
					
				// initialize with data
					if (data)
					{
						load(data);
					}
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			public function load(data:*):void 
			{
				for (var i:String in data)
				{
					this[i] = data[i];
				}
			}
		
			public function save():Boolean
			{
				for (var i:String in this)
				{
					_so.data[i] = this[i];
				}
				_so.flush();
				return true;
			}
			
			/**
			 * Returns a hierarchical representation of the model
			 * @return
			 */
			public function toString():String  
			{
				var obj:Object = { };
				for (var i:String in this)
				{
					obj[i] = this[i];
				}
				return Output.debug(obj);
			}

	}

}