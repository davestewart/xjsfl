package com.xjsfl.jsfl.panels 
{
	import adobe.utils.MMExecute;
	import com.xjsfl.jsfl.io.JSFL;
	import com.xjsfl.utils.debugging.Debug;
	
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
				protected var _layers					:String;
				protected var _frames					:String;
				
			// not yet implemented
				protected var _numLayers				:int;
				protected var _numFrames				:int;
				protected var _selection				:Array;
				
			// variables
				protected var _root						:DisplayObject;
				protected var _interval					:int				= 250;
				protected var _intervalId				:int				= -1;
				protected var _suspended				:Boolean			= false;
				
			// previous UI state
				protected var _uiLastState				:Object;
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function PanelEventManager():void 
			{
				_uiLastState = { };
				if ( ! JSFL.isPanel)
				{
					trace('PanelEventManager: stage event handlers not added in authoring mode');
				}
			}
		
			public static function initialize(root:DisplayObject, interval:int = 250):PanelEventManager
			{
				return PanelEventManager
					.instance
					.setRoot(root)
					.setInterval(interval);
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Events
		
				public function setRoot(value:DisplayObject):PanelEventManager 
				{
					// check if root has already been added
						if (_root)
						{
							throw new Error('PanelEventManager has already been initialized');
						}
				
					// set root
						_root = value;
						
					// add stage event listeners
						addStageEventListeners();
						
					// return
						return this;
				}
				
				public function setInterval(milliseconds:int):PanelEventManager 
				{
					if (JSFL.isPanel)
					{
						if (_intervalId < 0)
						{
							clearInterval(_intervalId);
						}
						_intervalId = flash.utils.setInterval(onInterval, milliseconds);
					}
					return this;
				}
			
			public function suspend():PanelEventManager
			{
				_suspended = true;
				return this;
			}
			
			public function resume():PanelEventManager
			{
				_suspended = false;
				return this;
			}
			
			public function addListener(type:String, listener:Function):PanelEventManager 
			{
				switch(type)
				{
					case PanelEvent.DOCUMENT_CHANGED:
					case PanelEvent.TIMELINE_CHANGED:
					case PanelEvent.FRAME_CHANGED:
					case PanelEvent.LAYER_CHANGED:
					case PanelEvent.NUM_FRAMES_CHANGED:
					case PanelEvent.NUM_LAYERS_CHANGED:
					case PanelEvent.SELECTION_CHANGED:
					case PanelEvent.PANEL_ENTER:
					case PanelEvent.PANEL_LEAVE:
						super.addEventListener(type, listener, false, 0, true);
					break;
				}
				return this;
			}
			
			public function removeListener(type:String, listener:Function):PanelEventManager  
			{
				super.removeEventListener(type, listener, false);
				return this;
			}
			
			override public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void 
			{
				addListener(type, listener);
			}
			
			override public function removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void 
			{
				removeListener(type, listener);
			}
			
			public function trigger(eventName:String):void
			{
				switch(eventName)
				{
					case PanelEvent.DOCUMENT_CHANGED:
						dispatchEvent(new PanelEvent(PanelEvent.DOCUMENT_CHANGED));
						dispatchEvent(new PanelEvent(PanelEvent.TIMELINE_CHANGED));
						dispatchEvent(new PanelEvent(PanelEvent.LAYER_CHANGED));
						dispatchEvent(new PanelEvent(PanelEvent.FRAME_CHANGED));
					break;

					case PanelEvent.TIMELINE_CHANGED:
						dispatchEvent(new PanelEvent(PanelEvent.TIMELINE_CHANGED));
						dispatchEvent(new PanelEvent(PanelEvent.LAYER_CHANGED));
						dispatchEvent(new PanelEvent(PanelEvent.FRAME_CHANGED));
					break;

					case PanelEvent.LAYER_CHANGED:
						dispatchEvent(new PanelEvent(PanelEvent.LAYER_CHANGED));
						dispatchEvent(new PanelEvent(PanelEvent.FRAME_CHANGED));
					break;

					case PanelEvent.FRAME_CHANGED:
						dispatchEvent(new PanelEvent(PanelEvent.FRAME_CHANGED));
					break;

					case PanelEvent.NUM_LAYERS_CHANGED:
					case PanelEvent.NUM_FRAMES_CHANGED:
					case PanelEvent.SELECTION_CHANGED:
						dispatchEvent(new PanelEvent(eventName));
					break;
				}
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
		
			public function get document():String { return _document; };
			public function get timeline():String { return _timeline; };
			public function get layers():String { return _layers; }
			public function get frames():String { return _frames; }
			public function get numLayers():int { return _numLayers; }
			public function get numFrames():int { return _numFrames; }
			public function get selection():Array { return _selection; }
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onInterval():void 
			{
				if ( ! _suspended)
				{
					getUIState();
				}
			}
			
			protected function onPanelLeave(event:Event):void 
			{
				dispatchEvent(new PanelEvent(PanelEvent.PANEL_LEAVE));
				_root.stage.addEventListener(MouseEvent.MOUSE_MOVE, onPanelEnter);
			}
			
			protected function onPanelEnter(event:MouseEvent):void 
			{
				_root.stage.removeEventListener(MouseEvent.MOUSE_MOVE, onPanelEnter);
				dispatchEvent(new PanelEvent(PanelEvent.PANEL_ENTER));
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected functions
		
			protected function getUIState():void 
			{
				// variables
					var uiState:Object	= JSFL.grab('UI.state');
					
				// update variables ahead of dispatching events
					_document			= uiState.document;
					_timeline			= uiState.timeline;
					_layers				= uiState.layers;
					_frames				= uiState.frames;
					_numLayers			= uiState.numLayers;
					_numFrames			= uiState.numFrames;
					_selection			= uiState.selection;

				// interval
					dispatchEvent(new PanelEvent(PanelEvent.INTERVAL));
					
				// UI states
					if (uiState.document != _uiLastState.document)
					{
						trigger(PanelEvent.DOCUMENT_CHANGED);
					}
					
					else if (uiState.timeline != _uiLastState.timeline)
					{
						trigger(PanelEvent.TIMELINE_CHANGED);
					}
					
					else if (uiState.layers != _uiLastState.layers)
					{
						trigger(PanelEvent.LAYER_CHANGED);
					}
					
					else if (uiState.frames != _uiLastState.frames)
					{
						trigger(PanelEvent.FRAME_CHANGED);
					}
					
				// additional UI states
					if (uiState.numLayers != _uiLastState.numLayers)
					{
						trigger(PanelEvent.NUM_LAYERS_CHANGED);
					}
					
					if (uiState.numFrames != _uiLastState.numFrames)
					{
						trigger(PanelEvent.NUM_FRAMES_CHANGED);
					}
					
					if (uiState.selection != _uiLastState.selection)
					{
						trigger(PanelEvent.SELECTION_CHANGED);
					}
					
				// update last ui state
					_uiLastState		= uiState;
			}

		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			/**
			 * 
			 * @param	stage		
			 * @param	onEnter		
			 * @param	onLeave		
			 */
			protected function addStageEventListeners()
			{
				// check stage (in case panel is loaded into another panel)
					if (_root.stage)
					{
						_root.stage.addEventListener(Event.MOUSE_LEAVE, onPanelLeave);
						if (_root.stage.mouseX > 0 
							&& _root.stage.mouseX <  _root.stage.width
							&& _root.stage.mouseY > 0
							&& _root.stage.mouseY <  _root.stage.height
							)
						{
							onPanelLeave(null);
						}
						else
						{
							onPanelEnter(null);
						}
					}
					
				// defer adding listener until panel is added to stage
					else
					{
						_root.addEventListener(Event.ADDED_TO_STAGE, addStageEventListeners);
					}
					
				// return
					return this;
			}
			
		}
}
