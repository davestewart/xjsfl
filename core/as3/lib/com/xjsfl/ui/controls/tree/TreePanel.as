package com.xjsfl.ui.controls.tree
{
	import fl.events.ScrollEvent;
	import flash.events.ContextMenuEvent;
	import flash.events.Event;
	
	import com.xjsfl.ui.containers.ScrollPane;
	import com.xjsfl.ui.controls.Control;
	
	import com.xjsfl.utils.debugging.Output;
	
	import com.xjsfl.ui.controls.rightclickmenu.RightClickMenu;
	import com.xjsfl.ui.controls.rightclickmenu.RightClickMenuEvent;
	
	import com.xjsfl.ui.controls.tree.Tree;
	import com.xjsfl.ui.controls.tree.ui.TreeTray;
	import com.xjsfl.ui.controls.tree.events.*;
	import com.xjsfl.ui.controls.tree.items.TreeItem;
	import com.xjsfl.ui.controls.tree.items.TreeFileItem;
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
	 * The TreePanel is a wrapper around the Tree control, placing it in a ScrollPane, 
	 * along with a button tray to execute common commands on the tree
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
					
				// ---------------------------------------------------------------------------------------------------------------------
				// create new items
				
					// elements
						scrollPane			= new ScrollPane();
						scrollPane.addEventListener(ScrollEvent.SCROLL, onScrollPaneScroll); 
						addChild(scrollPane);
						
						tray				= new TreeTray();
						scrollPane.tray		= tray;
						
						tree				= new Tree();
						scrollPane.source	= tree;
						
				// ---------------------------------------------------------------------------------------------------------------------
				// events
				
					// ---------------------------------------------------------------------------------------------------------------------
					// tree events
					
						// events
							tree.addEventListener(Event.RESIZE, onTreeResize);
							
						// filter events
							tree.addEventListener(TreeEvent.FILTER, onFilter);
							
					// ---------------------------------------------------------------------------------------------------------------------
					// item events
					
						// label events
							/*
							*/
							tree.addEventListener(TreeItemEvent.LABEL_EDIT, onItemEditLabel);
							tree.addEventListener(TreeItemEvent.LABEL_EDIT_CANCEL, onItemEditLabel);
							tree.addEventListener(TreeItemEvent.LABEL_EDIT_COMPLETE, onItemEditLabel);
							
					// ---------------------------------------------------------------------------------------------------------------------
					// action events
					
						// tray events
							//tray.addEventListener(TreeEvent.NEW_FILE, onNewTreeItem);
							//tree.addEventListener(TreeEvent.NEW_FILE, onNewTreeItem);
							
							//tray.addEventListener(TreeEvent.NEW_FOLDER, onNewTreeItem);
							//tree.addEventListener(TreeEvent.NEW_FOLDER, onNewTreeItem);
							
							//tray.addEventListener(TreeEvent.ITEM_INFO, onItemInfo);
							//tree.addEventListener(TreeEvent.ITEM_INFO, onItemInfo);
							
							//tray.addEventListener(TreeEvent.ITEM_DELETE, onItemDelete);
							//tree.addEventListener(TreeEvent.ITEM_DELETE, onItemDelete);
							
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function setSize(width:Number, height:Number):void 
			{
				//super.setSize(width, height);
				scrollPane.setSize(width, height);
				tree.setSize(scrollPane.scrollarea.width, scrollPane.scrollarea.height);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors
			
			public function set xml(xml:XML):void
			{
				tree.xml = xml;
				//setSize(width, height);
			}
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
			
			// ---------------------------------------------------------------------------------------------------------------------
			// tree
			
				protected function onTreeResize(event:Event):void 
				{
					scrollPane.invalidate();
				}
				
				protected function onFilter(event:TreeEvent):void 
				{
					tray.enabled = tree.filter == '';
				}
								
			// ---------------------------------------------------------------------------------------------------------------------
			// actions
			
				protected function onItemInfo(event:TreeEvent):void 
				{
					trace('Get info')
				}
				
				protected function onItemUpdate(event:TreeEvent):void 
				{
					trace('Set info')
				}
				
				protected function onNewTreeItem(event:TreeEvent):void 
				{
					trace('Creating new tree item')
					
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
						if (event.type == TreeEvent.NEW_FOLDER)
						{
							type	= 'folder'
							label	= 'New Folder ' + tree.folders.length
							path	= parentItem.path + label + '/';
						}
						else if (event.type == TreeEvent.NEW_FILE)
						{
							type	= 'file'
							label	= 'New Item ' + tree.files.length
							path	= parentItem.path + label + '.jsfl';
						}
						
					// create and edit item
						tree.addItem( { type:type, label:label, path:path } )
						tree.selectedItem.edit();
				}
				
				protected function onItemEditLabel(event:TreeItemEvent):void 
				{
					// variables
						var item		:TreeItem	= event.target as TreeItem
						
					// switch
						switch (event.type) 
						{
							case TreeItemEvent.LABEL_EDIT:
							
								tray.enabled = false;
								tree.enabled = false;
								
							break;
							
							case TreeItemEvent.LABEL_EDIT_COMPLETE:
							
								// variables
									var labelOK		:Boolean	= true;
									var parentItem	:TreeItem	= tree.getItemParent(item);
									var children	:Array		= tree.getItemChildren(parentItem);

								// check label against siblings for duplicate label
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
											tray.enabled = true;
											tree.enabled = true;
											tree.redraw();
											tree.dispatchEvent(new TreeEvent(TreeEvent.NEW_ITEM_COMPLETE, item));
									}
									
								// main tain edit mode
									else
									{
										//trace('Duplicate label!')
										item.edit();
									}
								
							break;
							
							case TreeItemEvent.LABEL_EDIT_CANCEL:
							
								//trace('edit cancelled for ' + item.path)
								tree.removeItem(item);
								tray.enabled = true;
								tree.enabled = true;
								tree.redraw();
							
							break;
						}
						
				}
				

			// tray 
			
				protected function onItemDelete(event:TreeEvent):void 
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
				
				protected function onScrollPaneScroll(event:ScrollEvent):void 
				{
					dispatchEvent(event);
				}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}