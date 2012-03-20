package com.xjsfl.ui.controls.tree.items
{
	import com.xjsfl.ui.controls.tooltip.ITooltippable;
	import com.xjsfl.ui.controls.tooltip.Tooltip;
	import com.xjsfl.ui.controls.tree.icons.TreeFileItemIcon;
	import com.xjsfl.utils.StringUtils;
	import flash.display.Sprite;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.ColorTransform;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.ui.Keyboard;
	
	import com.xjsfl.ui.controls.Control;
	import com.xjsfl.ui.controls.tree.events.TreeItemEvent;
	
	
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TreeItem extends Control implements ITooltippable
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// static variables
				public static const FOLDER	:String			= 'folder';
				public static const FILE	:String			= 'file';
		
			// stage instances
				public var tf				:TextField;
				public var icon				:Sprite;
				public var foreground		:Sprite
				public var background		:Sprite

			// common properties
				protected var _type			:String;
				protected var _data			:Object;
				protected var _level		:int;
				protected var _label		:String;
				protected var _path			:String;
				protected var _index		:int;
				protected var _parentItem	:TreeItem;
				
			// stage properties
				protected var _selected		:Boolean;
				protected var _filtered		:Boolean;
				protected var _editMode		:Boolean;
				protected var _selectable	:Boolean;
				
			// private properties
				protected var _sortPath		:String;
				
			// colors
				protected var txHighlight	:ColorTransform		= new ColorTransform(1.025, 1.025, 1.025);
				protected var txNone		:ColorTransform		= new ColorTransform();
				
			
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TreeItem(data:Object)
			{
				// super
					super();
					
				// data (the data setter sets all properties)
					this.data	= data;
					
				// elements
					foreground	= new Sprite();
					background	= new Sprite();
					icon		= new Sprite();
					addChild(background);
					addChild(foreground);
					foreground.addChild(icon);
					
				// draw
					drawBackground();
				
				// interaction
					addEventListener(MouseEvent.CLICK, onClick);
					addEventListener(MouseEvent.MOUSE_OVER, onRollOver);
					addEventListener(MouseEvent.MOUSE_OUT, onRollOut);
			}
			
			override protected function initialize():void
			{
				// textfield
					tf						= foreground.addChild(new TextField()) as TextField;
					tf.restrict				= "A-Z a-z 0-9 \\-+(),&"
					tf.selectable			= true;
					tf.backgroundColor		= 0xFFFFFF;
					tf.text					= _label;
					tf.x					= 40;
					tf.y					= 1;
					initializeText(tf);
					
				// icon
					icon.x					= 21
					
				// interaction
					doubleClickEnabled		= true;
					tf.mouseEnabled			= false;
					icon.mouseEnabled		= false;
					foreground.mouseEnabled	= false;
					background.mouseEnabled	= false;
					addEventListener(MouseEvent.DOUBLE_CLICK, onDoubleClick);
			}
			
			public function destroy():void
			{
				removeEventListener(MouseEvent.CLICK, onClick);
				removeEventListener(MouseEvent.ROLL_OVER, onRollOver);
				removeEventListener(MouseEvent.ROLL_OUT, onRollOut);
				removeEventListener(MouseEvent.DOUBLE_CLICK, onDoubleClick);
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function draw():void
			{
				super.draw();
				foreground.x = _filtered ? 0 : level * 20;
				drawBackground();
				if (stage)
				{
					//TODO This needs to be set from the containing tree / scrollpane
					// If stageWidth is used, the horizontal parent scrollbar will always be too wide, because of the vertical scri
					background.width = _width;// , parent.width, stage.stageWidth);
				}
			}
			
			public function select():void
			{
				selected = true;
			}
			
			public function edit():void
			{
				editMode = true;
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			// common properties
				public function get type():String { return _type; }
				
				public function get level():int { return _level; }
				public function set level(value:int):void { _level = value; }
				
				public function get path():String { return _path; }
				//public function set path(path:String):void { _path = path; }
				
				public function get label():String { return _label; }
				public function set label(value:String):void
				{
					// update label
						_label = value;
						
					// update path
						_path = _path.replace(/(.*?)([^\/]+)(\/?)$/g, '$1' +value+ '$3')
						
					// update sortPath
						updateSortPath();
				}
				
			// data
				public function get data():Object { return _data };
				public function set data(data:Object):void
				{
					// data
						_data	= data;
						
					// properties
						_path	= data.path || '';
						_label	= _path.replace(/\/$/, '').split('/').pop();
						
					// level
						_level	= data.path.split('/').length - 1;
						if (this is TreeFolderItem)
						{
							_level --;
						}
						
					// sort path
						updateSortPath()
				}
				
			// interaction
				public function get selected():Boolean { return _selected; }
				public function set selected(value:Boolean):void
				{
					_selected = value;
					invalidate();
					if (value)
					{
						dispatchEvent(new TreeItemEvent(TreeItemEvent.SELECT));
					}
				}
				
				public function get filtered():Boolean { return _filtered; }
				public function set filtered(value:Boolean):void
				{
					_filtered = value;
				}
				
			// size
				override public function get width():Number
				{
					return foreground ? foreground.getRect(this).right : 0;
				}
				override public function set width(width:Number):void
				{
					_width = width;
					background.width = width;
				}
				
			// layout
				public function get index():int
				{
					return parent ? parent.getChildIndex(this) : -1;
				}
				
				public function get parentItem():TreeItem { return _parentItem; }
				public function set parentItem(item:TreeItem):void
				{
					_parentItem = item;
				}
				
			/// editing
				public function get editMode():Boolean { return _editMode; }
				public function set editMode(state:Boolean)
				{
					// properties
						stage.focus			= tf;
						_editMode			= state;
						
					// text properties
						tf.border			= state;
						tf.background		= state;
						tf.selectable		= state;
						tf.type				= state ? TextFieldType.INPUT : TextFieldType.DYNAMIC;
						tf.setSelection(0, state ? tf.length : 0);
						tf.width			+= 10;
						
					// selectable
						//selectable			= state;
						
					// listeners
						state ? tf.stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp) : tf.stage.removeEventListener(KeyboardEvent.KEY_UP, onKeyUp);
						state ? tf.stage.addEventListener(MouseEvent.MOUSE_UP, onMouseUp) : tf.stage.removeEventListener(MouseEvent.MOUSE_UP, onMouseUp);
						
					// event
						if (state)
						{
							dispatchEvent(new TreeItemEvent(TreeItemEvent.LABEL_EDIT));
						}
				}
				
				public function get selectable():Boolean { return _selectable; }
				public function set selectable(state:Boolean):void
				{
					_selectable		= state;
					mouseEnabled	= state;
					mouseChildren	= state;
				}
				
				public function get sortPath():String { return _sortPath; }
				
				public function get tooltip():String
				{
					return data.tooltip;
				}
				
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			/**
			 * Checks that a label has no illegal characters in it
			 * @return
			 */
			protected function checkLabel():Boolean
			{
				var state:Boolean =  StringUtils.trim(tf.text).length > 0 && tf.text.match(/[\/\\:*?"<>|]/ig) != null;
				return state;
			}
		
			/**
			 * Draws the item background
			 */
			protected function drawBackground():void
			{
				// colors
					var colHighlight		:int		= 0xF3F3F3;
					var colBackground		:int		= 0xE6E6E6;
					var colLowlight			:int		= 0xDDDDDD;
					
				// tree
					if (this.level == 0)
					{
						colBackground = 0xDDDDDD;
					}
					
				// selected
					if (_selected)
					{
						colHighlight	= 0xE6E6E6;
						colBackground	= 0xCCCCCC;
						colLowlight		= 0xDDDDDD;
					}
					
				// draw
					background.graphics.clear();
					background.graphics.beginFill(colHighlight);
					background.graphics.drawRect(0, 0, 100, 1);
					background.graphics.beginFill(colBackground);
					background.graphics.drawRect(0, 1, 100, 17);
					background.graphics.beginFill(colLowlight);
					background.graphics.drawRect(0, 18, 100, 1);
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onRollOver(event:MouseEvent):void
			{
				background.transform.colorTransform = txHighlight;
				if (event.currentTarget == this)
				{
					dispatchEvent(new TreeItemEvent(TreeItemEvent.ROLL_OVER, event));
				}
			}
			
			protected function onRollOut(event:MouseEvent):void
			{
				background.transform.colorTransform = txNone;
				if (event.currentTarget == this)
				{
					dispatchEvent(new TreeItemEvent(TreeItemEvent.ROLL_OUT, event));
				}
			}
			
			protected function onClick(event:MouseEvent):void
			{
				selected = true;
				dispatchEvent(new TreeItemEvent(TreeItemEvent.CLICK, event));
			}
			
			protected function onDoubleClick(event:MouseEvent):void
			{
				dispatchEvent(new TreeItemEvent(TreeItemEvent.DOUBLE_CLICK, event));
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Edit handlers
		
			protected function onKeyUp(event:KeyboardEvent):void
			{
				switch (event.keyCode)
				{
					case Keyboard.ESCAPE:
						onEditComplete(false);
					break;
					case Keyboard.ENTER:
					case Keyboard.TAB:
						onEditComplete(true);
					break;
				}
			}
		
			protected function onMouseUp(event:MouseEvent):void
			{
				if (event.target != tf)
				{
					onEditComplete(true)
				}
			}
			
			protected function onEditComplete(state:Boolean):void
			{
				editMode	= false;
				tf.text		= tf.text.replace(/(^\s+|\s+$)/g, '');
				_label		= tf.text;
				_path		= _path.replace(/([^\/]+)(.jsfl|\/)$/img, _label + "$2");
				if (state && checkLabel())
				{
					dispatchEvent(new TreeItemEvent(TreeItemEvent.LABEL_EDIT_COMPLETE));
				}
				else
				{
					dispatchEvent(new TreeItemEvent(TreeItemEvent.LABEL_EDIT_CANCEL));
				}
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			/**
			 * SortPath is an internal variable by which to sort the tree items so that folders always
			 * sort before files. This is done by prepending a * to all folder segments in the item's path
			 * 
			 * Files are additionally prepended with a 4-digit index (0001) so that they remain unsorted
			 * within their individual folders
			 */
			protected function updateSortPath():void
			{
				if (this is TreeFileItem)
				{
					_sortPath = _path
						.replace(/([^\/]+\/?)$/g, StringUtils.pad(data.index, 4) + '_$1')
						.replace(/([^\/]+?\/)/g, '*$1');
				}
				else
				{
					_sortPath = _path
						.replace(/([^\/]+?\/)/g, '*$1');
				}
			}
		
	}

}