package com.xjsfl.jsfl.modules 
{
	import adobe.utils.MMExecute;
	import com.xjsfl.jsfl.JSFL;
	import flash.display.DisplayObject;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.MouseEvent;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	import flash.utils.Timer;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class PanelEventManager extends EventDispatcher
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// instance
				public static const instance			:PanelEventManager = new PanelEventManager();
			
			// properties
				protected var _document					:String;
				protected var _timeline					:String;
				
			// variables
				protected var _stage					:Stage;
				protected var _interval					:int				= 250;
				protected var _intervalId				:int				= -1;;
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function EventManager():void 
			{
				if (PanelEventManager.instance)
				{
					throw new Error('PanelEventManager is a Singleton, and should be accessed using PanelEventManager.instance only');
				}
			}
		
			public function initialize(stage:Stage, interval:int = 250):PanelEventManager
			{
				_stage		= stage;
				_interval	= interval;
				return this;
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Events
		
			/**
			 * 
			 * @param	stage		
			 * @param	onEnter		
			 * @param	onLeave		
			 */
			public function addFocusHandler(onEnter:Function, onLeave:Function):PanelEventManager
			{
				// events
					addEventListener(PanelEvent.PANEL_ENTER, onEnter);
					addEventListener(PanelEvent.PANEL_LEAVE, onLeave);
				
				// event listeners
					_stage.addEventListener(Event.MOUSE_LEAVE, onMouseLeave);
					
				// trigger
					onMouseLeave(null);
					
				// return
					return this;
			}
			
			/**
			 * 
			 * @param	onTimelineChange	
			 * @param	interval			
			 */
			public function addTimelineHandler(onChange:Function):PanelEventManager
			{
				addEventListener(PanelEvent.TIMELINE_CHANGED, onChange);
				if (JSFL.isPanel)
				{
					if (_intervalId == -1)
					{
						_intervalId = setInterval(onTimeline, _interval);
					}
				}
				else
				{
					trace('PanelEventmanager: Timeline handler not added in authoring mode');
				}
				return this;
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
		
			public function get document():String { return _document; };
			public function get timeline():String { return _timeline; };
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onMouseLeave(event:Event):void 
			{
				dispatchEvent(new PanelEvent(PanelEvent.PANEL_LEAVE));
				_stage.addEventListener(MouseEvent.MOUSE_MOVE, onPanelEnter);
			}
			
			protected function onPanelEnter(event:MouseEvent):void 
			{
				_stage.removeEventListener(MouseEvent.MOUSE_MOVE, onPanelEnter);
				dispatchEvent(new PanelEvent(PanelEvent.PANEL_ENTER));
			}
			
			protected function onTimeline():void 
			{
				// variables
					var ui		:Object		= JSFL.call('JSFLInterface.getUIState');
					var state	:Boolean	= false;
					
				// states
					if (ui.document != _document)
					{
						_document	= ui.document;
						state		= true;
					}
					if (ui.timeline != _timeline)
					{
						_timeline	= ui.timeline;
						state		= true;
					}
					
				// dispatch if changed
					if (state)
					{
						dispatchEvent(new PanelEvent(PanelEvent.TIMELINE_CHANGED));
					}
			}
			
			

	}

}