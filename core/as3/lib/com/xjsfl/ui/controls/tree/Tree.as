package com.xjsfl.ui.controls.tree
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Rectangle;
	import flash.ui.Keyboard;
	
	import com.xjsfl.ui.controls.tree.items.TreeItem;
	import com.xjsfl.ui.controls.tree.items.TreeFolderItem;
	import com.xjsfl.ui.controls.tree.items.TreeFileItem;
	import com.xjsfl.ui.controls.tree.events.*;
	
	import com.xjsfl.ui.controls.Control;
	import com.xjsfl.utils.debugging.Output;
	
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Tree extends Control
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var container			:Sprite;
				public var background			:Sprite;
			
			// items
				protected var _items			:Array			= [];
				
			// filtered items
				protected var _filteredItems	:Array			= [];
				protected var _filter			:String			= '';
				
			// selected item
				protected var _selectedIndex	:int			= -1;
				protected var _selectedItem		:TreeItem		= null;
				protected var _overItem			:TreeItem		= null;
			
			// path
				protected var _rootItem			:TreeFolderItem;
				protected var _rootLevel		:int			= 0;
				
			// size
				protected var _lastSize			:Rectangle		= new Rectangle();
				
			// appearance
				protected var _defaultIconIndex	:int			= 1;

			// item properties
				/*
					Properties
					-------------------------------------------------
					all:	level, type, label, path
					folder:	length
					file:	icon, desc
				 */
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instatiation
		
			public function Tree(data:* = null)
			{
				super();
				initialize();
				if (data)
				{
					this.data = data;
				}
			}
			
			override protected function initialize():void
			{
				// super
					super.initialize();
					
				// background
					background = new Sprite();
					background.name = 'bg';
					background.graphics.beginFill(0xFF0000, 0);
					background.graphics.drawRect(0, 0, 100, 100);
					addChild(background);
					
				// container
					container = new Sprite();
					addChild(container);
					
				// item interaction
					container.addEventListener(TreeItemEvent.ROLL_OVER, onItemRollOver);
					container.addEventListener(TreeItemEvent.ROLL_OUT, onItemRollOut);
					container.addEventListener(TreeItemEvent.SELECT, onItemSelect);
					container.addEventListener(TreeItemEvent.DOUBLE_CLICK, onItemDoubleClick);
					
				// folder interaction
					container.addEventListener(TreeItemEvent.FOLDER_TOGGLE, onFolderToggle);
					addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
					
				// background interaction
					background.addEventListener(MouseEvent.CLICK, onSelectNone)
					
					
			}
			
			protected function onAddedToStage(event:Event):void 
			{
				removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
				container.stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 * Redraws all items
			 */
			override public function draw():void
			{
				// variables
					var item		:TreeItem;
					var folderItem	:TreeFolderItem;
					var fileItem	:TreeFileItem;
					
					var y			:int			= 0;
					var level		:int			= 0;
					var drawState	:Boolean		= true;
					
				// draw all items
					for (var i:int = 0; i < _items.length; i++)
					{
						// variable
							item			= _items[i];
							
						// reset item
							item.y			= 0;
							item.filtered	= false
							item.visible	= false;
							
						// skip items which are within a closed folder
							if (!drawState)
							{
								if(item.level > level)
								{
									continue;
								}
								else
								{
									drawState = true;
								}
							}
							
						// folder
							if (item is TreeFolderItem)
							{
								folderItem = item as TreeFolderItem;
								if(folderItem.state == false)
								{
									level = folderItem.level;
									drawState = false;
								}
							}
							
						// position item
							item.y			= y * item.height;
							item.visible	= true;
							item.invalidate();
							y++;
					}
					
				// set container visible
					container.visible = true;
					
				// test for resize
					checkResize(container.width, container.height);
					
				// super
					super.draw();
			}
			
			/**
			 * Sorts and redraws all items
			 */
			public function redraw():void 
			{
				sortItems();
				draw();
			}
			
			/**
			 * Adds an item to the tree by passing in the data necessary to create it
			 * @param	data
			 * @return
			 */
			public function addItem(data:Object):TreeItem 
			{
				// create item
					var item:TreeItem = createItem(data);
					
				// invalidate
					redraw();
					
				// select item
					item.select();

				// return
					return item;
			}
			
			/**
			 * Adds a new item and leaves it in editing mode
			 * @param	data
			 * @return
			 */
			public function newItem(type:String, label:String, path:String = null):TreeItem 
			{
				// create item
					var item:TreeItem = createItem(data);
					
				// select item
					item.select();

				// invalidate
					draw();
					
				// return
					return item;
			}
			
			
			/**
			 * Removes an item from the tree
			 * @param	item
			 */
			public function removeItem(item:TreeItem):void 
			{
				// parent item
					var parent:TreeItem = getItemParent(item);

				// remove item
					container.removeChild(item);
					
				// update _items
					var index:int = findItemIndexBy('path', item.path)
					_items.splice(index, 1);
					
				// select parent
					selectedItem = parent;
					
				// invalidate
					redraw();
			}
			

		
			/**
			 * Returns an item by its index in the (unfiltered) tree
			 * @param	index
			 * @return
			 */
			public function getItemByIndex(index:int):TreeItem
			{
				return _items[index];
			}
			
			/**
			 * Returns the parent item of the supplied item
			 * @param	item
			 * @return
			 */
			public function getItemParent(item:TreeItem):TreeItem 
			{
				// variables
					var index		:int	= item.index;
					var level		:int	= item.level;
					
				// item is the root
					if (index == -1)
					{
						item = rootItem;
					}
					
				// loop through containing children
					else
					{
						do
						{
							index--;
							item = _items[index];
						}
						while (item && item.level >= level);
							
					}
				// return
					return item;
					

			}			/**
			 * Returns the children of the supplied folder as an array
			 * @param	item
			 * @param	all
			 * @return
			 */
			public function getItemChildren(item:TreeItem, all:Boolean = false):Array 
			{
					//trace(item.label)
					
				// variables
					var index		:int	= item.index || 0;
					var level		:int	= item.level;
					var children	:Array	= [];
					var item		:TreeItem;
					
				// loop through containing children
					do
					{
						index++;
						item = _items[index];
						if (all || (item && item.level == (level + 1)))
						{
							children.push(item);
						}
					}
					while (item && item.level > level);
					//children.pop();
					
				// return
					return children;
			}
			
			public function selectOverItem():void 
			{
				selectedItem = _overItem;
			}
			
			/**
			 * Sets the size of the tree, its background and the width of all contained items
			 * @param	width
			 * @param	height
			 */
			override public function setSize(width:Number, height:Number):void 
			{
				// variables
					var i			:int;
					var item		:TreeItem;
					var maxWidth	:Number		= width;
					var itemsHeight	:Number		= 0;
					
				// get the widest item foreground width
					for (i = 0; i < _items.length; i++)
					{
						item		= _items[i];
						itemsHeight	+= item.visible ? item.height : 0;
						if (item.width > maxWidth)
						{
							maxWidth = item.width;
						}
					}
					
				// set super
					super.setSize(maxWidth, height);
					
				// redraw items at widest width
					for (i = 0; i < _items.length; i++)
					{
						item = _items[i];
						item.width = maxWidth;
					}
					
				// background
					background.width = maxWidth;
					background.height = Math.min(itemsHeight, height);
					
				// alert the containing elements
					//dispatchEvent(new Event(Event.RESIZE))
			}
			

			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
		
			// data
				public function get data():XML { return <xml /> };
				public function set data(xml:XML):void
				{
					// reset stuff
						reset();
					
					// data
						var _data:Array = [];
						
					// root item
						var path		= xml.hasOwnProperty('@path') ? xml.@path : '/';
						_rootLevel		= getPathLevel(path) + 1;
						_rootItem		= new TreeFolderItem( { type:'folder', label:'scripts', path:path, __root__:true } );
						
					// convert xml to objects
						for each(var node:XML in xml.item)
						{
							// convert any \ to /
								node.@path					= String(node.@path).replace(/\\/g, '/');
								
							// grab the data
								var data		:Object		= { };
								var attributes	:XMLList	= node.attributes();
								for each(var attribute:XML in attributes)
								{
									data[attribute.name().toString()] = attribute;
								}
								
							// append
								_data.push(data);
						}
							
					// create items
						createItems(_data);
						
					// invalidate
						invalidate()
				}
				
				
				public function get rootItem():TreeItem { return _rootItem; }
				
				public function get selectedItem():TreeItem { return _selectedItem; }
				public function set selectedItem(item:TreeItem):void 
				{
					// deselect previous item
						if (_selectedItem && _selectedItem != item)
						{
							_selectedItem.selected = false;
						}
						
					// select new item
						if (_items.indexOf(item) != -1 && _selectedItem != item)
						{
							// set selected item
								_selectedItem			= item;
								_selectedIndex			= item.index;
								
							// update item
								if (! item.selected)
								{
									item.selected			= true;
								}
						}
					}
				
				public function get selectedIndex():int { return _selectedIndex; }
				public function set selectedIndex(index:int):void 
				{
					if (selectedIndex > -1)
					{
						_selectedItem.selected = false;
					}
					_selectedIndex		= index;
					var item:TreeItem	= _items[index];
					item.selected		= true;
				}
				
				public function get filter():String { return _filter; }
				public function set filter(value:String):void
				{
					// variable
						_filter				= value.replace(/(^\s*|\s*$)/g, '');
						_filteredItems		= [];

					// draw
						if (_filter == '')
						{
							_filteredItems = _items;
							draw();
						}
						else
						{
							// variables
								var y		:int;
								var item	:TreeItem;
								var rx		:RegExp		= new RegExp(_filter, 'i');
							
							// draw all items
								for (var i:int = 0; i < _items.length; i++)
								{
									// variable
										item			= _items[i];
										
									// skip folders and non-matching items
										if (! item.label.match(rx))
										{
											item.y			= 0;
											item.visible	= false;
										}
										else
										{
											item.y			= y * item.height;
											item.filtered	= true;
											item.visible	= true;
											item.invalidate();
											y++;
											_filteredItems.push(item);
										}
								}
								
							// super
								super.draw();
						}
						
					// results
						dispatchEvent(new TreeEvent(TreeEvent.FILTER));
						dispatchEvent(new TreeEvent(TreeEvent.CHANGE));

				}
				
				public function get items():Array { return _items; }
				public function get filteredItems():Array { return _filteredItems; }
				public function get files():Array { return _items.filter(function(e){return e.type == TreeItem.FILE}); }
				public function get folders():Array { return _items.filter(function(e){return e.type == TreeItem.FOLDER}); }
				
				public function get defaultIconIndex():int { return _defaultIconIndex; }
				public function set defaultIconIndex(value:int):void 
				{
					_defaultIconIndex = value;
				}
				
				override public function get enabled():Boolean { return _enabled; }
				override public function set enabled(state:Boolean):void 
				{
					_enabled = state;
					for (var i:int = 0; i < _items.length; i++) 
					{
						var item:TreeItem = _items[i];
						if (!item.editMode)
						{
							item.mouseEnabled = state;
							item.mouseChildren = state;
						}
					}
				}
				
				

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onItemRollOver(event:TreeItemEvent):void 
			{
				_overItem = event.target as TreeItem;
			}
			
			protected function onItemRollOut(event:TreeItemEvent):void 
			{
				_overItem = null;
			}
			
			protected function onItemDoubleClick(event:TreeItemEvent):void
			{
				var item:TreeFileItem = event.target as TreeFileItem;
				dispatchEvent(new TreeEvent(TreeEvent.ITEM_RUN, item));
			}
			
			protected function onFolderToggle(event:TreeItemEvent):void
			{
				var item:TreeFolderItem = event.target as TreeFolderItem;
				draw();
				if (selectedItem && ! selectedItem.visible)
				{
					selectedItem = event.target as TreeItem;
				}
			}
			
			protected function onItemSelect(event:TreeItemEvent):void
			{
				selectedItem = event.target as TreeItem;
			}
			
			protected function onSelectNone(event:MouseEvent):void
			{
				if (event.target == background)
				{
					if (_selectedItem)
					{
						_selectedItem.selected = false;
					}
					_selectedItem = null;
					_selectedIndex = -1;
				}
			}
			
			protected function onKeyDown(event:KeyboardEvent):void 
			{
				switch(event.keyCode)
				{
					case Keyboard.UP:
					case Keyboard.DOWN:
					
						var item:TreeItem = getNextVisibleItem(event.keyCode == Keyboard.UP ? -1 : 1);
						if (item && item.visible)
						{
							selectedItem = item;
						}
						
					break;
					
					case Keyboard.F2:
						// selectedItem.edit();
					break;

				}
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			/**
			 * Creates a single item
			 * @param	data
			 * @return
			 */
			protected function createItem(data:Object, sort:Boolean = true):TreeItem 
			{
				// variable
					var item		:TreeItem;
					var classDef	:Class;
					
				// create item
					classDef		= data.type == TreeItem.FOLDER ? TreeFolderItem : TreeFileItem;
					item			= new classDef(data) as TreeItem;
					
				// item level
					item.level		= getPathLevel(item.path) + (item is TreeFileItem ? 1 : 0);
					
				// add item
					_items.push(item);
					container.addChild(item);
					
				// update items
					if (sort)
					{
						sortItems();
					}
					
				// return item
					return item as TreeItem;
			}
			
			/**
			 * Creates a series of items for the first time
			 * @param	data
			 */
			protected function createItems(data:Array):void 
			{
				// reset items
					_items = [];
				
				// make container invisible before drawing
					container.visible = false;
					
				// clear container
					var item:TreeItem;
					while (container.numChildren > 0) 
					{
						item = container.getChildAt(0) as TreeItem;
						item.destroy();
						container.removeChildAt(0);
					}
					
				// create items
					var folders:Array = [];
					for (var i:int = 0; i < data.length; i++)
					{
						item = createItem(data[i], false);
						if (item is TreeFolderItem)
						{
							folders.push(item);
						}
					}
					
				// sort items
					sortItems();
					
				// update folder lengths
					for each(item in folders)
					{
						updateFolder(item as TreeFolderItem);
					}
					
				// dispatch events
					dispatchEvent(new TreeEvent(TreeEvent.CHANGE));
				
				// invalidate
					invalidate();
			}
			
			/**
			 * Updates a folder item properties when its contents have changed.
			 * @param	item
			 */
			protected function updateFolder(item:TreeFolderItem):void 
			{
				var children:Array = getItemChildren(item);
				item.length = children.length;
			}
			
			/**
			 * Sorts all tree items
			 * Called after a create or delete
			 */
			protected function sortItems():void 
			{
				// sort items array
					_items.sortOn('sortPath', Array.CASEINSENSITIVE);
					
				// update filtered items
					_filteredItems = _items;
					
				// sort container
					for (var i:int = 0; i < _items.length; i++) 
					{
						container.addChild(_items[i]);
					}
					
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			/**
			 * Utility function to reset important variables
			 */
			protected function reset():void 
			{
				_selectedItem	= null;
				_rootItem		= null;
				_rootLevel		= 0;
				_items			= [];
				_filteredItems	= [];
			}
			
			/**
			 * Utility function to get the depth of an item by its path
			 * @param	path
			 * @return
			 */
			protected function getPathLevel(path:String):int
			{
				return path.replace(/\\/g, '/').split('/').length - _rootLevel;
			}
			
			/**
			 * Utility function to get the next visible item
			 * @param	dir
			 * @return
			 */
			protected function getNextVisibleItem(dir:int):TreeItem
			{
				// variables
					var index		:int			= (selectedIndex || 0);
					var item		:TreeItem;
					var nextItem	:TreeItem;

				// loop through items until we find a visible one
					do
					{
						index		+= dir;
						nextItem	= getItemByIndex(index);
						if (nextItem && nextItem.visible)
						{
							item = nextItem;
						}
					}
					while (item == null && nextItem != null)
					
				// check index is within bounds
					//index = index < 0 ? 0 : (index >= _items.length ? _items.length - 1 : index);
					
				// return
					return item;
			}


			/**
			 * Utility method to find an item's index by one of its attributes, such as path
			 * @param	attribute
			 * @param	value
			 * @return
			 */
			protected function findItemIndexBy(attribute:String, value:*):int 
			{
				for (var i:int = 0; i < _items.length; i++) 
				{
					if (_items[i][attribute] == value)
					{
						return i;
						break;
					}
				}
				return -1;
			}
			
			/**
			 * Utility method to copy the properties of one object to another
			 * @param	obj
			 * @return
			 */
			protected function copy(obj:Object):Object 
			{
				var copy:Object = { };
				for (var i in obj)
				{
					copy[i] = obj[i];
				}
				return copy;
			}

	}

}