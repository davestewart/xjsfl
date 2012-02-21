package display.ui.tree
{
	import com.xjsfl.ui.controls.tree.misc.TreeMenu;
	import flash.events.Event;
	
	import com.xjsfl.jsfl.JSFL;
	import com.xjsfl.ui.containers.ScrollPane;
	import com.xjsfl.ui.controls.Control;
	import com.xjsfl.utils.Output;
	
	import com.xjsfl.ui.controls.tree.Tree;
	import com.xjsfl.ui.controls.tree.misc.TreeTray;
	import com.xjsfl.ui.controls.tree.misc.TreeEvent;
	import com.xjsfl.ui.controls.tree.items.TreeItem;
	import com.xjsfl.ui.controls.tree.items.TreeFolderItem;
	
	/*
		tree:TreePanel
			|
			+- scrollPane:ScrollPane
				|
				+- tree:Tree
				|	|
				|	+- container:Sprite
				|		|
				|		+- item[]:TreeFileItem)
				|			|
				|			+- icon:TreeFileItemIcon
				|
				|		+- item[]:TreeFolderItem
				|			|
				|			+- icon:TreeFolderItemIcon
				|			+- button:TreeFolderItemButton
				|
				+- tray:TreeTray
					|
					+- button[]:buttons
	*/
	

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TreePanel extends Control
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var scrollPane			:ScrollPane;
				public var tree					:Tree;
				public var tray					:TreeTray;
					
			// properties
				protected var menu				:TreeMenu;
					
			// variables
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TreePanel() 
			{
				super();
				initialize();
			}
			
			override protected function initialize():void
			{
				// remove children
					while (numChildren > 0) 
					{
						removeChildAt(0);
					}
					
				// create new items
					scrollPane			= new ScrollPane();
					addChild(scrollPane);
					
					tray				= new TreeTray();
					scrollPane.tray		= tray;
					
					tree				= new Tree();
					scrollPane.source	= tree;
					
				// menu
					menu				= new TreeMenu(this);
					
				// events
					tree.addEventListener(Event.RESIZE, onTreeResize);
					
				// item events
					tree.addEventListener(TreeEvent.ITEM_SELECT, onItemSelect);
					
				// filter events
					tree.addEventListener(TreeEvent.FILTER, onFilter);
					tree.addEventListener(TreeEvent.FILTER_CLEAR, onFilter);
					
				// edit events
					tree.addEventListener(TreeEvent.LABEL_EDIT, onEditLabel);
					tree.addEventListener(TreeEvent.LABEL_EDIT_CANCEL, onEditLabel);
					tree.addEventListener(TreeEvent.LABEL_EDIT_COMPLETE, onEditLabel);
					
				// tray events
					tray.addEventListener(TreeEvent.ACTION_NEW_ITEM, onNewTreeItem);
					tray.addEventListener(TreeEvent.ACTION_NEW_FOLDER, onNewTreeItem);
					tray.addEventListener(TreeEvent.ACTION_PROPERTIES, onDeleteTreeItem);
					tray.addEventListener(TreeEvent.ACTION_DELETE, onDeleteTreeItem);
					
				// menu events
					menu.addEventListener(TreeEvent.MENU_INIT, onMenuInit);
						
					/*
					// menu

						stage.addEventListener(MouseEvent.MOUSE_OVER, onMouseOver)
						stage.addEventListener(MouseEvent.MOUSE_OUT, onMouseOut)

						function onMouseOver(event:MouseEvent)
						{
							menu.setFilter(event.target.name);
						}

						function onMouseOut(event:MouseEvent)
						{
							menu.clearFilter();
						}
						*/

						/*, onMenuItem
						function onMenuItem(event:ContextMenuEvent, id):void
						{
							trace(event.mouseTarget.name, id)
						}
						*/


			}
			
			private function onMenuInit(event:TreeEvent):void 
			{
				trace(tree.selectedIndex)
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function setSize(width:Number, height:Number):void 
			{
				super.setSize(width, height);
				scrollPane.setSize(width, height);
				tree.setSize(scrollPane.scrollarea.width, scrollPane.scrollarea.height);
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			public function set data(data:*):void 
			{
				tree.data = data;
			}
			
			public function set filter(value:String):void
			{
				tree.filter = value;
			}
		
			public function get filteredItems():Array
			{
				return tree.filteredItems;
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			// tree
			
				protected function onTreeResize(event:Event):void 
				{
					scrollPane.invalidate();
				}
				
				protected function onItemSelect(event:TreeEvent):void 
				{
					//trace(tree.selectedItem.parentItem ? tree.selectedItem.parentItem.label : null)
				}
				
				protected function onFilter(event:TreeEvent):void 
				{
					if (tree.filter == '')
					{
						tray.mouseEnabled = true;
						tray.mouseChildren = true;
						tray.alpha = 1;
					}
					else
					{
						tray.mouseEnabled = false;
						tray.mouseChildren = false;
						tray.alpha = 0.5;
					}
				}
								
				protected function onEditLabel(event:TreeEvent):void 
				{
					// variables
						var item		:TreeItem	= event.target as TreeItem
						
					// switch
						switch (event.type) 
						{
							case TreeEvent.LABEL_EDIT:
							
								tray.enabled = false;
								
							break;
							
							case TreeEvent.LABEL_EDIT_COMPLETE:
							
								// variables
									var labelOK		:Boolean	= true;
									var parentItem	:TreeItem	= tree.getItemParent(item);
									var children	:Array		= tree.getItemChildren(parentItem);

								// check label against children
									for each(var child:TreeItem in children)
									{
										if (child != item && child.path == item.path)
										{
											labelOK = false;
											break;
										}
									}
									
								// complete the edit
									if (labelOK)
									{
										// update item path
											item.label = item.tf.text;
											
										// complete
											//trace('edit complete for ' + item.path)
											item.dispatchEvent(new TreeEvent(TreeEvent.ITEM_CREATE));
											tree.redraw();
											tray.enabled = true;
									}
									else
									{
										//trace('Duplicate label!')
										item.edit();
									}
								
							break;
							
							case TreeEvent.LABEL_EDIT_CANCEL:
							
								//trace('edit cancelled for ' + item.path)
								tree.removeItem(item);
								tree.redraw();
								tray.enabled = true;
							
							break;
						}
						
				}
				

			// tray 
			
				protected function onNewTreeItem(event:TreeEvent):void 
				{
					// variables
						var type			:String;
						var label			:String;
						var path			:String;
						var parentItem		:TreeItem;
						var selectedItem	:TreeItem = tree.selectedItem;
						
						
					// get item parent
						if (selectedItem)
						{
							parentItem = selectedItem is TreeFolderItem ? selectedItem : tree.getItemParent(tree.selectedItem);
						}
						else
						{
							parentItem = tree.rootItem;
						}
						
					// item properties
						if (event.type == TreeEvent.ACTION_NEW_FOLDER)
						{
							type	= 'folder'
							label	= 'New Folder'
							path	= parentItem.path + label + '/';
						}
						else if (event.type == TreeEvent.ACTION_NEW_ITEM)
						{
							type	= 'file'
							label	= 'New Snippet'
							path	= parentItem.path + label + '.jsfl';
						}
						
					// create and edit item
						tree.addItem( { type:type, label:label, path:path } ).edit();
				}
				

				protected function onDeleteTreeItem(event:TreeEvent):void 
				{
					var item:TreeItem = tree.selectedItem
					if (item is TreeFolderItem)
					{
						var children = tree.getItemChildren(item);
						if (children > 0)
						{
							//JSFL.
						}
						if (item is TreeFolderItem)
						{
							//trace('Children')
							for each (var child:TreeItem in children) 
							{
								trace(' > ' + child.label);
							}
						}
					}
					else
					{
						
						// child items
						/*
							*/
					}
							
				}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}