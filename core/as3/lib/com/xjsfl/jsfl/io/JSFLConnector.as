package com.xjsfl.jsfl.io 
{
	import adobe.utils.MMExecute;
	import flash.net.LocalConnection;
	import flash.events.StatusEvent;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class JSFLConnector 
	{
		
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: variables
		
			// statics
				public static var CLIENT	:String			= 'client';
				public static var PANEL		:String			= 'panel';
		
			// variables
				protected var _id			:String;
				protected var _scope		:Object;
				protected var _active		:Boolean;
				protected var _isPanel		:Boolean;
				
			// connection
				protected var source		:LocalConnection;
				protected var target		:LocalConnection;
				
			// connection names
				protected var sourceName	:String;
				protected var targetName	:String;
				
			// callbacks
				protected var callbacks		:Array;
				
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: instantiation
		
			public function JSFLConnector(id:String, scope:Object)
			{
				// parameters
					_id						= id;
					_scope					= scope;
					
				// properties
					_isPanel				= JSFL.isPanel;
					_active					= true;
					
				// objects
					callbacks				= [];
					
				// variables
					var name1		:String = id + 'Connection1';
					var name2		:String = id + 'Connection2';

				// connection function
					function connect(nameA:String, nameB:String, client:*):void
					{
						// receiver
							target			= new LocalConnection();
							target.client	= client;
							sourceName		= nameA;
							target.connect(nameA);
							
						// sender
							source			= new LocalConnection();
							targetName		= nameB;
							source.addEventListener(StatusEvent.STATUS, onStatus);
					}
					
				// set up the first connection
					try
					{
						connect(name1, name2, this);
					}
					catch(error:Error)
					{
						// set up the second connection, if the first is already set up
							try
							{
								connect(name2, name1, this);
							}
						
						// fail on subsequent connections
							catch(error:Error)
							{
								_active = false;
							}
					}
			}
				
				
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: public methods
		
			/**
			 * 
			 * @param	method
			 * @param	...params
			 * @see		http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/LocalConnection.html#send%28%29
			 */
			public function send(method:String, params:Array = null, callback:Function = null):void
			{
				// retrieve or register callback if supplied
					var callbackId:int = -1;
					if (callback !== null)
					{
						callbackId = callbacks.indexOf(callback);
						if (callbackId == -1)
						{
							callbackId = callbacks.length;
							callbacks.push(callback);
						}
					}
					
				// send
					//trace('Calling:' + method)
					target.send(targetName, 'receieve', method, params, callbackId); 
			}
			
			public function receieve(method:String, params:Array, callbackId:int):void
			{
				trace('Flash received ' +method);
				//MMExecute("fl.trace('JSFL received " +[_scope, method, params.length, params, callbackId]+ "')");
				try
				{
					//MMExecute("fl.trace('Scope " +[_scope[method],params]+ "')");
					var result:* = _scope[method].apply(_scope, params);
					//MMExecute("fl.trace('Command " +method+ " executed" +result+ "')");
					if (callbackId > -1)
					{
						//MMExecute("fl.trace('callbackId: " +result+ "')");
						target.send(targetName, 'onSendComplete', callbackId, result);
					}
				}
				catch (error)
				{
					//MMExecute("fl.trace('"+error+ "')");
				}
				
			}
			
			public function onSendComplete(callbackId:int, result:*):void
			{
				callbacks[callbackId](result);
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: accessors
		
			public function get id():String
			{
				return _id;
			}
			
			public function get type():String
			{
				return _isPanel ? PANEL : CLIENT;
			}
			
			public function get active():Boolean
			{
				return _active;
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: handlers
		
			protected function onStatus(event:StatusEvent):void 
			{
				//trace(event);
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: utilities
		
				
			public function toString():String
			{
				return '[object JSFLConnector id="' +id+ '" type="' +type+ '" active="' +active+ '"]';
			}
	}

}