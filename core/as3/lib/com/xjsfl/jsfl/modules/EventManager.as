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
	public class EventManager extends EventDispatcher
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
			
			// callbacks
				protected static var _onEnter					:Function;
				protected static var _onLeave					:Function;
				protected static var _onPoll					:Function;
				protected static var _onTimeline				:Function;
				
			// properties
				protected static var _stage						:Stage;
				protected static var _document					:String;
				protected static var _timeline					:String;
				
			// intervals
				protected static var _stagePollingInterval		:Number;
				protected static var _timelinePollingInterval	:Number;
				
			// ids
				protected static var _stagePollingId			:int;
				protected static var _timelinePollingId			:int;
			
				
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
		
			public static function get document():String { return _document; };
			public static function get timeline():String { return _timeline; };
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Events
		
			/**
			 * 
			 * @param	stage		
			 * @param	onEnter		
			 * @param	onLeave		
			 */
			public static function setFocusHandler(stage:Stage, onEnter:Function, onLeave:Function)
			{
				// set properties
					_stage			= stage;
					_onEnter		= onEnter;
					_onLeave		= onLeave;
				
				// event listeners
					_stage.addEventListener(Event.MOUSE_LEAVE, onMouseLeave);
					
				// trigger
					onMouseLeave(null);
			}
			
			/**
			 * 
			 * @param	onTimelineChange	
			 * @param	interval			
			 */
			public static function setTimelineHandler(onTimeline:Function, interval:Number = 250)
			{
				_onTimeline					= onTimeline;
				_timelinePollingInterval	= interval;
				_timelinePollingId			= -1;
			}
			
			/**
			 * 
			 * @param	onPoll		
			 * @param	interval	
			 * @param	constant	
			 */
			public static function setPollingHandler(onPoll:Function, interval:Number = 1000, constant:Boolean = false)
			{
				_onPoll					= onPoll;
				_stagePollingInterval	= interval;
				_stagePollingId			= -1;
				
			}
			
			public static function reset()
			{
				if (_stage)
				{
					onMouseMove(null);
					_stage.removeEventListener(Event.MOUSE_LEAVE, onMouseLeave);
				}
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected static function onMouseLeave(event:Event):void 
			{
				_stage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
				_onLeave(new MouseEvent(MouseEvent.MOUSE_MOVE, false, false, _stage.mouseX, _stage.mouseY));
				
				if (event && _onPoll)
				{
					_stagePollingId = setInterval(_onPoll, _stagePollingInterval);
				}
				
				if (event && _onTimeline)
				{
					_stagePollingId = setInterval(onTimeline, _timelinePollingInterval);
				}
			}
			
			protected static function onMouseMove(event:MouseEvent):void 
			{
				_stage.removeEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
				
				_onEnter(event);
				
				if (_stagePollingId > -1)
				{
					clearInterval(_stagePollingId);
					_stagePollingId = -1;
				}
				
				if (_timelinePollingId > -1)
				{
					clearInterval(_timelinePollingId);
					_timelinePollingId = -1;
				}
			}
			
			protected function onTimeline():void 
			{
				var state:Object = JSFL.call('JSFLInterface.getUIState');
				/*
				if (state.document != _document)
				{
					_document = state.document;
					_onDocument();
				}
				*/
				if (state.timeline != _timeline)
				{
					_timeline = state.timeline;
					_onTimeline();
				}
			}
			
			

	}

}