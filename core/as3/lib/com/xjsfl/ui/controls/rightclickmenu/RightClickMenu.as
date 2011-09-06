package com.xjsfl.ui.controls.rightclickmenu 
{
	import flash.display.InteractiveObject;
	import flash.events.ContextMenuEvent;
	import flash.events.EventDispatcher;
	import flash.ui.ContextMenu;
	import flash.ui.ContextMenuItem;
	import flash.utils.Dictionary;
	
	import com.xjsfl.ui.controls.rightclickmenu.RightClickMenuEvent

	/**
	 * The RightClickMenu class provides a wrapper around the ContextMenu group of classes, allowing you to 
	 * quickly and easily create context menus using XML, and manipulate them using a few simple filtering methods.
	 * 
	 * Upon selecting menuitems, the RightClickMenuEvent returns actual data, rather than just the item target, 
	 * allowing you to decouple menu selections from multiple concrete handler functions.
	 * 
	 * Menu XML should contain at the very least a list of menuitem nodes with a unique id and a caption as the 
	 * XML node text. Separators, and enabled & visible attributes can also be included.
	 * 
	 * <menu>
	 * 		<menuitem id="run">&Run File</menuitem>
	 * 		<menuitem id="edit" enabled="false">&Edit File...</menuitem>
	 * 		<menuitem id="reload" separator="true">Reload &Tree...</menuitem>
	 * </menu>
	 * 
	 * Menu items can also contain any other attributes you may wish to have returned in the menuItemSelect 
	 * handler, for example an "action" attribute:
	 * 
	 * 		<menuitem id="run" action="ITEM_RUN">&Run File</menuitem>
	 * 
	 * In the menuItemSelect handler, you would pick up the value like so:
	 * 
	 * 		event.target.node.@action;
	 * 
	 * You can also group items in order to manipulate them en-mass from the menuItemInit handler, either by 
	 * including a "group" attribute, or by nesting them in a <group name="groupName"> node
	 * 
	 * <menu>
	 * 		<group name="file">
	 * 			<menuitem id="run" action="ITEM_RUN">&Run File</menuitem>
	 * 			<menuitem id="edit" action="ITEM_EDIT" separator="true">&Edit File...</menuitem>
	 * 			<menuitem id="reload" action="RELOAD" separator="true">Reload &Tree...</menuitem>
	 * 		</group>
	 * 		<group name="default">
	 * 			<menuitem id="newItem" action="NEW_ITEM" separator="true">New &File</menuitem>
	 * 			<menuitem id="newFolder" action="NEW_FOLDER">New &Folder</menuitem>
	 * 			<menuitem id="reload" action="RELOAD" separator="true">Reload &Tree...</menuitem>
	 * 		</group>
	 * </menu>
	 * 
	 * When the menuItemInit handler fires, you simply hide or disable groups of menu items like so:
	 * 
	 * 		event.target.setVisible('file');
	 * 
	 * See the setVisible() method for other ways to target groups or individual items.
	 * 
	 * @author Dave Stewart
	 */
	public class RightClickMenu extends EventDispatcher
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				protected var target				:InteractiveObject;
			
			// properties
				protected var menu					:ContextMenu;
				protected var itemsXML				:XML;
				protected var itemsHash				:Dictionary;
			
			// handlers
				protected var menuInitHandler		:Function;
				protected var menuItemSelectHandler	:Function;
				
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			/**
			 * Right-click menu constructor
			 * @param	target					The display object that should receive the right-click menu
			 * @param	itemsXML				The XML of groups and menu items that will create the ContextMenu
			 * @param	menuItemSelectHandler	The handler that is called when a menu item is selected. The listener will recieve a RightClickMenuEvent, the node parameter of which can be queried for related values
			 * @param	menuInitHandler			The handler that is called just after the right-click, but before the menu is displayed. Allows the user to show, hide, enable or disable menu items
			 */
			public function RightClickMenu(target:InteractiveObject, itemsXML:XML, menuItemSelectHandler:Function = null, menuInitHandler:Function = null)
			{
				//TODO Swap init and select handlers
				// variables
					this.target					= target;
					this.itemsXML				= itemsXML;
					this.menuInitHandler		= menuInitHandler;
					this.menuItemSelectHandler	= menuItemSelectHandler;
					
				// initialize
					initialize();
			}
			
			/**
			 * creates the menu and assigns listeners
			 */
			protected function initialize():void
			{
				// variables
					var separator	:Boolean;
					var enabled		:Boolean;
					var visible		:Boolean;
					var menuitem	:ContextMenuItem;
					var menuitems	:Array;
					
				// items
					itemsHash		= new Dictionary;
					
				// menu
					menu			= target.contextMenu || new ContextMenu();
					menu.hideBuiltInItems();
					menu.addEventListener(ContextMenuEvent.MENU_SELECT, onMenuSelect);
					
				// xml variables
					var node		:XML;
					var nodes		:XMLList;
					var group		:XML;
					var groups		:XMLList;
					
				// assign group attribute to individual nodes
					groups = itemsXML.group;
					for each(group in groups)
					{
						nodes = group.menuitem;
						for each(node in nodes)
						{
							node.@group = group.@name;
						}
					}
					
				// nodes
					nodes = itemsXML..menuitem;
					
				// add items
					menuitems = [];
					for each(node in nodes)
					{
						// variables
							separator	= node.@separator == true;
							enabled		= node.@enabled != false;
							visible		= node.@visible != false;
							
						// menu item
							menuitem	= new ContextMenuItem(node.text(), separator, enabled, visible);
							
						// create the handler
							menuitem.addEventListener(ContextMenuEvent.MENU_ITEM_SELECT, onMenuItemSelect);
							
						// update the items hash to compare event.target with and grab related XML
							itemsHash[menuitem] = node;
						
						// add to menu array
							menuitems.push(menuitem);
					}
					
				// add new items on top of any old items
					menu.customItems = menuitems.concat(menu.customItems);
					
				// add menu to target
					target.contextMenu = menu;

				// add event listeners to self
					if (menuInitHandler != null)
					{
						addEventListener(RightClickMenuEvent.MENU_INIT, menuInitHandler);
					}
					if (menuItemSelectHandler != null)
					{
						addEventListener(RightClickMenuEvent.MENU_ITEM_SELECT, menuItemSelectHandler);
					}
			}
			
			/**
			 * Destroys all menu items and their event handlers, and removes the custom menu from the target object
			 */
			public function destroy():void
			{
				if (target)
				{
					// remove menu item listeners
						for(var menuitem:* in itemsHash)
						{
							menuitem.removeEventListener(RightClickMenuEvent.MENU_ITEM_SELECT, onMenuItemSelect);
						}
						itemsHash = null;
						
					// remove menu listeners
						if (menuInitHandler != null)
						{
							removeEventListener(RightClickMenuEvent.MENU_INIT, menuInitHandler);
						}
						if (menuItemSelectHandler != null)
						{
							removeEventListener(RightClickMenuEvent.MENU_ITEM_SELECT, menuItemSelectHandler);
						}
						
					// remove menu
						menu.removeEventListener(ContextMenuEvent.MENU_SELECT, onMenuSelect);
						menu.customItems = [ ];
						menu = null;
						
					// restore original context menu
						target.contextMenu = null;
						target = null;
						
					// reset all other variables
						itemsXML = null;
				}

			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 * Sets a single item visible or hidden
			 * @param	id		A String that matches a an existing node's id
			 * @param	state	A Boolean indicating the item should be visible or hidden
			 */
			public function setVisible(id:String, state:Boolean = true):void
			{
				var menuitem:ContextMenuItem = getMenuItemById(id);
				if (menuitem)
				{
					menuitem.visible = state;
				}
			}

			/**
			 * Sets a single item enabled or disabled
			 * @param	id		A String that matches a an existing node's id
			 * @param	state	A Boolean indicating the item should be enabled or disabled
			 */
			public function setEnabled(id:String, state:Boolean = true):void
			{
				var menuitem:ContextMenuItem = getMenuItemById(id);
				if (menuitem)
				{
					menuitem.enabled = state;
				}
			}
			
			/**
			 * Sets a group of menu items to be visible or hidden
			 * @param	group	A String, Array, or RegExp that matches multiple existing node's group name
			 * @param	state	A Boolean indicating the items should be visible or hidden
			 */
			public function filterVisible(group:*, state:Boolean = true):void
			{
				filter(group, 'group', 'visible', state);
			}

			/**
			 * Sets a group of menu items to be enabled or disabled
			 * @param	group	A String, Array, or RegExp that matches multiple existing node's group name
			 * @param	state	A Boolean indicating the items should be enabled or disabled
			 */
			public function filterEnabled(group:*, state:Boolean = true):void
			{
				filter(group, 'group', 'enabled', state);
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			public function get contextMenu():ContextMenu { return menu; }
			
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			protected function onMenuSelect(event:ContextMenuEvent):void
			{
				dispatchEvent(new RightClickMenuEvent(RightClickMenuEvent.MENU_INIT, itemsXML, event.mouseTarget, event.contextMenuOwner ));
			}
			
			protected function onMenuItemSelect(event:ContextMenuEvent):void
			{
				dispatchEvent(new RightClickMenuEvent(RightClickMenuEvent.MENU_ITEM_SELECT, itemsHash[event.target], event.mouseTarget, event.contextMenuOwner ));
			}
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			protected function getMenuItemById(id:String):ContextMenuItem
			{
				for (var menuitem:* in itemsHash)
				{
					if (itemsHash[menuitem].@id == id)
					{
						return menuitem;
					}
				}
				return null;
			}
			
			protected function filter(value:*, xmlAttr:String, menuitemAttr:String, state:Boolean):void 
			{
				var rx:RegExp = makeRegExp(value);
				for(var menuitem:* in itemsHash)
				{
					var node		:XML		= itemsHash[menuitem];
					var name		:String		= node['@' + xmlAttr].toXMLString();
					menuitem[menuitemAttr]		= state ? rx.test(name) : ! rx.test(name);
				}
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			protected function makeRegExp(value:*):RegExp 
			{
				var rx:RegExp;
				if (value is String)
				{
					rx = new RegExp('^' + value + '$');
				}
				else if (value is Array)
				{
					rx = new RegExp('^(' + value.join('|') + ')$')
				}
				else if (value is RegExp)
				{
					rx = value;
				}
				else
				{
					rx = new RegExp(/.+/);
				}
				return rx;
			}

	}

}