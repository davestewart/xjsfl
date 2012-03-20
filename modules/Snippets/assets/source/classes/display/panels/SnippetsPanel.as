package display.panels
{
	import fl.events.ScrollEvent;
	import flash.display.Sprite;
	import flash.system.System;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.utils.setTimeout;
	
	import com.xjsfl.ui.controls.tree.TreePanel;
	import com.xjsfl.ui.controls.tree.items.TreeFileItem;
	import com.xjsfl.ui.controls.tree.items.TreeFolderItem;
	import com.xjsfl.ui.controls.tree.items.TreeItem;
	import com.xjsfl.ui.controls.tree.events.*;
	import com.xjsfl.ui.controls.rightclickmenu.RightClickMenu;
	import com.xjsfl.ui.controls.rightclickmenu.RightClickMenuEvent;
	import com.xjsfl.ui.controls.search.SearchBox;
	import com.xjsfl.ui.controls.tooltip.TipManager;
	
	import jsfl.SnippetsModule;
	import ui.controls.EditSetButton;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class SnippetsPanel extends Sprite
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables

			// stage instances
				public var searchBox			:SearchBox;
				public var treePanel			:TreePanel;
				public var editSetButton		:EditSetButton;
			
			// treeMenu
				protected var treeMenu			:RightClickMenu;
				protected var treeMenuData		:XML;
		
			// module
				protected var module			:SnippetsModule;
				protected var data				:XML;
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function SnippetsPanel()
			{
				
			}
			
			public function initialize(snippetsModule:SnippetsModule)
			{
				// module
					module = snippetsModule;
					module.addEventListener(Event.COMPLETE, onDataLoaded)
				
				// treeMenu
					treeMenuData = 
						<menu>
							<group name="file">
								<menuitem id="run" event="ITEM_RUN">&Run File</menuitem>
								<menuitem id="edit" event="ITEM_EDIT" separator="true">&Edit File...</menuitem>
								<menuitem id="info" event="ITEM_INFO">Edit File &Info...</menuitem>
								<menuitem id="delete" event="ITEM_DELETE">&Delete File</menuitem>
								<menuitem id="browseFile" event="ITEM_BROWSE" separator="true">&Browse File Location...</menuitem>
								<menuitem id="createCommand" event="ITEM_COMMAND">&Create Command</menuitem>
								<menuitem id="copyPath" event="ITEM_PATH" >Copy &Path</menuitem>
							</group>
							<group name="folder">
								<menuitem id="browseFolder" event="ITEM_BROWSE">&Browse Folder Location...</menuitem>
								<menuitem id="copyPath" event="ITEM_PATH" >Copy &Path</menuitem>
							</group>
							<group name="default">
								<!--
								<menuitem id="newItem" event="NEW_FILE" separator="true">New &File</menuitem>
								<menuitem id="newFolder" event="NEW_FOLDER">New &Folder</menuitem>
								-->
								<menuitem id="reload" event="RELOAD" separator="true">Reload &Tree...</menuitem>
							</group>
						</menu>
						
				// build
					build();
			}
			
			protected function build():void 
			{
				
				//TODO Add a favourites or browse popup treeMenu: load, add, remove, manage
				//TODO Get latest commits: http://github.com/api/v2/json/commits/list/davestewart/xjsfl/master
				// http://develop.github.com/p/commits.html
				
				// ---------------------------------------------------------------------------------------------------------------------
				// stage elements
				
					// preview
						/*
						preview					= new Preview();
						addChild(preview);
						preview.y				= 0;
						*/
						
					// search box
						searchBox				= new SearchBox();
						addChild(searchBox);
						
					// editSet Button
						editSetButton			= new EditSetButton();
						editSetButton.x			= searchBox.width;
						editSetButton.y			= 3;
						editSetButton.addEventListener(MouseEvent.CLICK, onEditSetsClick);
						addChild(editSetButton);
						
					// tree panel
						treePanel				= new TreePanel();
						treePanel.x				= 1;
						treePanel.y				= searchBox.height;
						addChild(treePanel);
						
				
						
				// ---------------------------------------------------------------------------------------------------------------------
				// events & menus
				
					// listeners
						treePanel.addEventListener(TreeEvent.ITEM_RUN, onTreeEvent);
						treePanel.addEventListener(TreeEvent.ITEM_BROWSE, onTreeEvent);
						treePanel.addEventListener(TreeEvent.ITEM_INFO, onTreeEvent);
						treePanel.addEventListener(TreeEvent.ITEM_UPDATE, onTreeEvent);
						treePanel.addEventListener(TreeEvent.ITEM_DELETE, onTreeEvent);
						treePanel.addEventListener(TreeEvent.ITEM_EDIT, onTreeEvent);
						treePanel.addEventListener(TreeEvent.ITEM_COMMAND, onTreeEvent);
						treePanel.addEventListener(TreeEvent.ITEM_PATH, onTreeEvent);
						treePanel.addEventListener(TreeEvent.RELOAD, onTreeEvent);
						treePanel.addEventListener(ScrollEvent.SCROLL, onTreePanelScroll);
				
					// new
						//treePanel.addEventListener(TreeEvent.NEW_ITEM_COMPLETE, onItemCreateComplete);
						
					// items
						treePanel.addEventListener(TreeItemEvent.CLICK, onItemClick);
						
					// tray
						treePanel.addEventListener(TreeItemEvent.SELECT, onItemSelect);
						treePanel.addEventListener(TreeItemEvent.FOLDER_TOGGLE, onFolderToggle);
						
					// filter
						searchBox.addEventListener(Event.CHANGE, onSearchBoxChange);
						treePanel.addEventListener(TreeEvent.CHANGE, onItemsChange);
						
				// ---------------------------------------------------------------------------------------------------------------------
				// other
				
					// tooltips
						TipManager.initialize(this);
						
					// tree menu
						treeMenu				= new RightClickMenu(treePanel.tree, treeMenuData, onTreeMenuItemSelect, onTreeMenuInit);

					// set data on tree
						treePanel.xml			= module.data;
						
					// update panel scroll position
						var position:int		= module.data.@scrollPosition;
						
						// THIS IS A HACK - for some reason the tree won't update straight away - needs looking into
						treePanel.scrollPane.scrollV =  position;
						setTimeout(function ():void 
						{
							treePanel.scrollPane.scrollV =  position;
						}, 50)
			}


			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			public function setSize(width:int, height:int):void
			{
				treePanel.setSize(width - 2, height - treePanel.y - 1);
				searchBox.setSize(width - 1 - 25, searchBox.height);
				editSetButton.x = searchBox.width + 3;
			}
			
			public function invalidate():void 
			{
				setSize(stage.stageWidth, stage.stageHeight);
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Tree
		
			protected function onTreeEvent(event:TreeEvent):void 
			{
				var item:TreeItem = event.item;
				switch(event.type)
				{
					case TreeEvent.ITEM_RUN:
						item.data.func ? module.runFunction(item.data.uri, item.data.func) : module.runFile(item.data.uri);
					break;
					
					case TreeEvent.ITEM_BROWSE:
						if (item is TreeFileItem) module.browseFile(item.data.uri);
						else if (item is TreeFolderItem) module.browseFolder(item.data.uri);
					break;
					
					case TreeEvent.ITEM_INFO:
						trace('Info about item ' + item);
					break;
					
					case TreeEvent.ITEM_UPDATE:
						trace('Update item ' + item);
					break;
					
					case TreeEvent.ITEM_DELETE:
						if (item is TreeFileItem) module.deleteFile(item.data.uri);
						else if (item is TreeFolderItem) module.deleteFolder(item.data.uri);
					break;
					
					case TreeEvent.ITEM_EDIT:
						module.openFile(item.data.uri);
					break;
					
					case TreeEvent.ITEM_PATH:
						System.setClipboard(event.item.data.uri);
					break;
					
					case TreeEvent.ITEM_COMMAND:
						module.createCommand(item.label, item.data.uri);
					break;
					
					case TreeEvent.RELOAD:
						module.rebuildSet();
					break;
				}
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers - Tree
		
			// item
			
				protected function onItemClick(event:TreeItemEvent):void 
				{
					if (event.target is TreeFileItem && event.mouseEvent.ctrlKey)
					{
						treePanel.tree.dispatchEvent(new TreeEvent(TreeEvent.ITEM_EDIT, treePanel.tree.selectedItem));
					}
				}
				
				protected function onItemSelect(event:TreeItemEvent):void 
				{
					var tooltip = treePanel.tree.selectedItem.tooltip;
					if (tooltip)
					{
						//trace(tooltip);
					}
				}
				
			// editSet button
			
				
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers - treeMenu
		
			protected function onTreeMenuInit(event:RightClickMenuEvent)
			{
				var filter:Array;
				if (treePanel.tree.enabled)
				{
					treePanel.tree.selectOverItem();
					filter = treePanel.tree.selectedItem ? ['default', treePanel.tree.selectedItem.type] : ['default'];
					event.target.filterVisible(filter, true)
				}
				else
				{
					event.target.filterVisible(['file', 'folder', 'default'], false)
				}
			}

			protected function onTreeMenuItemSelect(event:RightClickMenuEvent)
			{
				treePanel.tree.dispatchEvent(new TreeEvent(TreeEvent[event.node.@event], treePanel.tree.selectedItem));
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers - Other
		
			// tray
			
				protected function onItemsChange(event:Event):void
				{
					searchBox.results = treePanel.tree.filteredItems.length;
				}
			
			// filter
				
				protected function onSearchBoxChange(event:Event):void
				{
					treePanel.tree.filter = event.target.text;
				}
				
			// edit sets

				protected function onEditSetsClick(event:MouseEvent):void 
				{
					module.manageSets();
				}

			// module data
			
				protected function onDataLoaded(event:Event):void 
				{
					treePanel.xml = module.data;
					invalidate();
				}
				
				protected function onFolderToggle(event:TreeItemEvent):void 
				{
					module.setFolderState(event.target.path, event.target.isOpen);
				}
				
				protected function onTreePanelScroll(event:ScrollEvent):void 
				{
					module.setScrollPosition(event.position);
				}
				


		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Unused
		

			// treePanel
				/*
				protected function onItemCreateComplete(event:TreeEvent):void
				{
					trace('ITEM CREATED: ' + event.item.path)
					
					var item:TreeItem = event.item as TreeItem;
					if (item is TreeFolderItem)
					{
						JSFL.run(snippetsPath, 'makeFolder', [item.path]);
					}
					else if (item is TreeFileItem)
					{
						var date = new Date();
						JSFL.run(snippetsPath, 'makeFile', [item.path, 'alert("This script was created at ' +date+ '");']);
						JSFL.call('openFile', [item.path]);
					}
				}
				
				protected function onItemDelete(event:TreeEvent):void 
				{
					if (treePanel.tree.selectedItem)
					{
						onItemEdit(event);
						if (JSFL.confirm('Are you sure you want to delete this file?'))
						{
							JSFL.trace('DETETE: ' + treePanel.tree.selectedItem.path);
							treePanel.tree.removeItem(treePanel.tree.selectedItem);
						}
					}
				}
				*/
				
	}

}