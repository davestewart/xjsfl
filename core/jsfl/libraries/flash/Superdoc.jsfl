// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                           ██
//  ██                               ██
//  ██     ██ ██ █████ █████ ████ █████ █████ █████
//  ██████ ██ ██ ██ ██ ██ ██ ██   ██ ██ ██ ██ ██
//      ██ ██ ██ ██ ██ █████ ██   ██ ██ ██ ██ ██
//      ██ ██ ██ ██ ██ ██    ██   ██ ██ ██ ██ ██
//  ██████ █████ █████ █████ ██   █████ █████ █████
//               ██
//               ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Superdoc

	/**
	 * Superdoc
	 * @overview	Provides logical routing to the expansive Document class' methods
	 * @instance	Superdoc
	 */

	Superdoc =
	{

		// --------------------------------------------------------------------------------
		// # appearance
	
			appearance:
			{
	
				// --------------------------------------------------------------------------------
				// # fill
		
					fill:
					{
						/**
						 * Changes the fill color of the selection to the specified color. For information on changing the fill color in the Tools panel and Property inspector, see document.setCustomFill().
						 * @param	{Fill} color The color of the fill, in one of the following formats:
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dd5.html
						 */
						color:function(color)
						{
							document.setFillColor(color);
						},
						/**
						 * Sets the fill object of the selected shape
						 * @param	{String} objectToFill A string that specifies the location of the fill object
						 * @returns	{Fill}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e0d.html
						 */
						set toolbar(fill)
						{
							document.setCustomFill(fill);
						},
						get toolbar(){ return document.getCustomFill('toolbar'); },
						/**
						 * Retrieves the fill object of the Tools panel and Property inspector.
						 * @returns	{Fill}	A string that specifies the location of the fill object
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e0d.html
						 */
						set selection(fill)
						{
							document.setCustomFill(fill);
						},
						get selection(){ return document.getCustomFill('selection'); },
						/**
						 * Swaps the Stroke and Fill colors.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cb2.html
						 */
						swapWithStroke:function()
						{
							document.swapStrokeAndFill();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # stroke
		
					stroke:
					{
						/**
						 * Changes the stroke color of the selection to the specified color. For information on changing the stroke in the Tools panel and Property inspector, see document.setCustomStroke().
						 * @param	{Stroke} color The color of the stroke, in one of the following formats:
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dc7.html
						 */
						set color(color)
						{
							document.setStrokeColor(color);
						},
						/**
						 * Returns the stroke object of the selected shape or, if specified, of the Tools panel and Property inspector.
						 * @param	{String} locationOfStroke A string that specifies the location of the stroke object. The following values are valid:
						 * @returns	{Stroke}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e0c.html
						 */
						set custom(stroke)
						{
							document.setCustomStroke(stroke);
						},
						get selection(){ return document.getCustomStroke('selection'); },
						/**
						 * Changes the stroke size of the selection to the specified size. For information on changing the stroke in the Tools panel and Property inspector, see document.setCustomStroke().
						 * @param	{Number} size A floating-point value from 0.25 to 10 that specifies the stroke size. The method ignores precision greater than two decimal places.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dc6.html
						 */
						get toolbar(){ return document.getCustomStroke('toolbar'); },
						/**
						 * Changes the stroke size of the selection to the specified size. For information on changing the stroke in the Tools panel and Property inspector, see document.setCustomStroke().
						 * @param	{Number} size A floating-point value from 0.25 to 10 that specifies the stroke size. The method ignores precision greater than two decimal places.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dc6.html
						 */
						set size(size)
						{
							document.setStrokeSize(size);
						},
						/**
						 * Changes the stroke style of the selection to the specified style. For information on changing the stroke in the Tools panel and Property inspector, see document.setCustomStroke().
						 * @param	{String} strokeType A string that specifies the stroke style for the current selection. Acceptable values are "hairline", "solid","dashed", "dotted", "ragged", "stipple", and "hatched".
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dc5.html
						 */
						set style(strokeType)
						{
							document.setStrokeStyle(strokeType);
						},
						/**
						 * Sets the color, width, and style of the selected stroke. For information on changing the stroke in the Tools panel and Property inspector, see document.setCustomStroke().
						 * @param	{Stroke} color The color of the stroke, in one of the following formats:
						 * @param	{Number} size A floating-point value that specifies the new stroke size for the selection.
						 * @param	{String} strokeType A string that specifies the new type of stroke for the selection. Acceptable values are "hairline", "solid", "dashed", "dotted", "ragged", "stipple", and "hatched".
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dc8.html
						 */
						set:function(color, size, strokeType)
						{
							document.setStroke(color, size, strokeType);
						},
						/**
						 * Swaps the Stroke and Fill colors.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cb2.html
						 */
						swapWithFill:function()
						{
							document.swapStrokeAndFill();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # properties
		
					properties:
					{
						/**
						 * An integer that specifies the width of the document (Stage) in pixels.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7d3d.html
						 */
						get width(){ return document.width; },
						set width(value)
						{
							document.width = value;
						},
						/**
						 * An integer that specifies the height of the document (Stage) in pixels.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e53.html
						 */
						get height(){ return document.height; },
						set height(value)
						{
							document.height = value;
						},
						/**
						 *
						 * @see
						 */
						set size(value)
						{
							document.width	= value[0];
							document.height = value[1];
						},
						get size(){ return [document.width, document.height]; },
						/**
						 * A float value that specifies the number of frames displayed per second when the SWF file plays; the default is 12. Setting this property is the same as setting the default frame rate in the Document Properties dialog box (Modify &gt; Document) in the FLA file.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e54.html
						 */
						get frameRate(){ return document.frameRate; },
						set frameRate(value)
						{
							document.frameRate = value;
						},
						/**
						 * The color of the background, in one of the following formats:
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e5a.html
						 */
						get backgroundColor(){ return document.backgroundColor; },
						set backgroundColor(value)
						{
							document.backgroundColor = value;
						},
						/**
						 * Read-only property; a unique integer (assigned automatically) that identifies a document during a Flash session. Use this property in conjunction with fl.findDocumentDOM() to specify a particular document for an action.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fcd.html
						 */
						get id(){ return document.id; },
						set id(value)
						{
							document.id = value;
						}
					},
		
				// --------------------------------------------------------------------------------
				// # view
		
					view:
					{
						/**
						 * A Boolean value that specifies whether Live Preview is enabled. If set to true, components appear on the Stage as they will appear in the published Flash content, including their approximate size. If set to false, components appear only as outlines. The default value is true.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e4f.html
						 */
						get livePreview(){ return document.livePreview; },
						set livePreview(value)
						{
							document.livePreview = value;
						},
						/**
						 * Read-only property; a Matrix object. The viewMatrix is used to transform from object space to document space when the document is in edit mode. The mouse location, as a tool receives it, is relative to the object that is currently being edited. See Matrix object.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cb6.html
						 */
						get matrix(){ return document.viewMatrix; },
						set matrix(value)
						{
							document.viewMatrix = value;
						},
						/**
						 * Specifies the vanishing point for viewing 3D objects.
						 * @param	{Object} point A point that specifies the x and y coordinates of the location at which to set the vanishing point for viewing 3D objects.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS98947551-DB0B-4342-A8A0-F12DA9359735.html
						 */
						set vanishingPoint(point)
						{
							document.setStageVanishingPoint(point);
						},
						/**
						 * Specifies the perspective angle for viewing 3D objects.
						 * @param	{Fl} angle A floating point value between 0.0 and 179.0.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WSB992D8DA-2CC2-4320-BF2B-39992B47A849.html
						 */
						set viewAngle(angle)
						{
							document.setStageViewAngle(angle);
						},
						/**
						 * Specifies the zoom percent of the Stage at authoring time. A value of 1 equals 100 percent zoom, 8 equals 800 percent, .5 equals 50 percent, and so on.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7c6f.html
						 */
						get zoom(){ return document.zoomFactor; },
						set zoom(value)
						{
							document.zoomFactor = value;
						}
					}
			},
	
		// --------------------------------------------------------------------------------
		// # containers
	
			containers:
			{
	
				// --------------------------------------------------------------------------------
				// # timeline
		
					timeline:
					{
						/**
						 * Read-only property; an array of Timeline objects (see Timeline object).
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7f90.html
						 */
						get all(){ return document.timelines; },
						/**
						 * An integer that specifies the index of the active timeline. You can set the active timeline by changing the value of this property; the effect is almost equivalent to calling document.editScene(). The only difference is that you don’t get an error message if the index of the timeline is not valid; the property is simply not set, which causes silent failure.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e58.html
						 */
						get current(){ return document.currentTimeline; },
						set current(value)
						{
							document.currentTimeline = value;
						},
						/**
						 * Switches the authoring tool into the editing mode specified by the parameter. If no parameter is specified, the method defaults to symbol-editing mode, which has the same result as right-clicking the symbol to invoke the context menu and selecting Edit.
						 * @param	{String} editMode A string that specifies the editing mode. Acceptable values are "inPlace" or "newWindow". If no parameter is specified, the default is symbol-editing mode. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e14.html
						 */
						edit:function(editMode)
						{
							document.enterEditMode(editMode);
						},
						/**
						 * Exits from symbol-editing mode and returns focus to the next level up from the editing mode. For example, if you are editing a symbol inside another symbol, this method takes you up a level from the symbol you are editing, into the parent symbol.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e13.html
						 */
						exit:function()
						{
							document.exitEditMode();
						},
						/**
						 * Retrieves the current Timeline object in the document. The current timeline can be the current scene, the current symbol being edited, or the current screen.
						 * @returns	{Timeline}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e02.html
						 */
						get:function()
						{
							return document.getTimeline();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # scene
		
					scene:
					{
						/**
						 * Adds a new scene (Timeline object) as the next scene after the currently selected scene and makes the new scene the currently selected scene. If the specified scene name already exists, the scene is not added and the method returns an error.
						 * @param	name {} Specifies the name of the scene. If you do not specify a name, a new scene name is generated.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e3f.html
						 */
						add:function(name)
						{
							return document.addNewScene(name);
						},
						/**
						 * Deletes the current scene (Timeline object) and, if the deleted scene was not the last one, sets the next scene as the current Timeline object. If the deleted scene was the last one, it sets the first object as the current Timeline object. If only one Timeline object (scene) exists, it returns the value false.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e24.html
						 */
						remove:function()
						{
							return document.deleteScene();
						},
						/**
						 * Makes a copy of the currently selected scene, giving the new scene a unique name and making it the current scene.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e19.html
						 */
						duplicate:function()
						{
							return document.duplicateScene();
						},
						/**
						 * Makes the specified scene the currently selected scene for editing.
						 * @param	{Number} index A zero-based integer that specifies which scene to edit.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e17.html
						 */
						edit:function(index)
						{
							document.editScene(index);
						},
						/**
						 * Renames the currently selected scene in the Scenes panel. The new name for the selected scene must be unique.
						 * @param	{String} name A string that specifies the new name of the scene.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7ded.html
						 */
						rename:function(name)
						{
							return document.renameScene(name);
						},
						/**
						 * Moves the specified scene before another specified scene.
						 * @param	{Number} sceneToMove An integer that specifies which scene to move, with 0 (zero) being the first scene.
						 * @param	{Number} sceneToPutItBefore An integer that specifies the scene before which you want to move the scene specified by sceneToMove. Specify 0 (zero) for the first scene. For example, if you specify 1 for sceneToMove and 0 for sceneToPutItBefore, the second scene is placed before the first scene. Specify -1 to move the scene to the end.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dec.html
						 */
						reorder:function(sceneToMove, sceneToPutItBefore)
						{
							document.reorderScene(sceneToMove, sceneToPutItBefore);
						}
					},
		
				// --------------------------------------------------------------------------------
				// # screens
		
					screens:
					{
						/**
						 * Use before using the document.screenOutline property. If this method returns the value true, you can safely access document.screenOutline; Flash displays an error if you access document.screenOutline in a document without screens.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e3b.html
						 */
						get allow(){ return document.allowScreens(); },
						/**
						 * Read-only property; the current ScreenOutline object for the document. Before accessing the object for the first time, make sure to use document.allowScreens() to determine whether the property exists.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e4b.html
						 */
						get outline()
						{
							if( ! document.canTestScene() )
							{
								return document.screenOutline;
							}
						}
					},
		
				// --------------------------------------------------------------------------------
				// # panel
		
					panel:
					{
						/**
						 * Read-only property; the library object for a document.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7f95.html
						 */
						get library(){ return document.library; },
						/**
						 * Posts an XMLUI dialog box. See fl.xmlui.
						 * @param	{String} fileURI A string, expressed as a file:/// URI, that specifies the path to the XML file defining the controls in the panel. The full path is required.
						 * @returns	{Object}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7ca9.html
						 */
						xml:function(fileURI)
						{
							return document.xmlPanel(fileURI);
						}
					}
			},
	
		// --------------------------------------------------------------------------------
		// # data
	
			data:
			{
				/**
				 * Stores specified data with a document. Data is written to the FLA file and is available to JavaScript when the file reopens.
				 * @param	{String} name A string that specifies the name of the data to add.
				 * @param	{String} type A string that defines the type of data to add. Acceptable values are "integer", "integerArray", "double", "doubleArray", "string", and "byteArray".
				 * @param	{value} data The value to add. Valid types depend on the type parameter.
				 * @returns	{}
				 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e47.html
				 */
				set:function(name, type, data)
				{
					document.addDataToDocument(name, type, data);
				},
				/**
				 * Retrieves the value of the specified data. The type returned depends on the type of data that was stored.
				 * @param	{String} name A string that specifies the name of the data to return.
				 * @returns	{}
				 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e0b.html
				 */
				get:function(name)
				{
					document.getDataFromDocument(name);
				},
				/**
				 * Returns a string containing the XML metadata associated with the document, or an empty string if there is no metadata.
				 * @returns	{String}
				 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e07.html
				 */
				set meta(strMetadata)
				{
					document.setMetadata(strMetadata);
				},
				get meta(){ return document.getMetadata(); }
			},
	
		// --------------------------------------------------------------------------------
		// # elements
	
			elements:
			{
	
				// --------------------------------------------------------------------------------
				// # accessibility
		
					accessibility:
					{
						/**
						 * A Boolean value that is equivalent to the Auto Label check box in the Accessibility panel. You can use this property to tell Flash to automatically label objects on the Stage with the text associated with them.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e5b.html
						 */
						get autoLabel(){ return document.autoLabel; },
						set autoLabel(value)
						{
							document.autoLabel = value;
						},
						/**
						 * A string that is equivalent to the Description field in the Accessibility panel. The description is read by the screen reader.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e57.html
						 */
						get description(){ return document.description; },
						set description(value)
						{
							document.description = value;
						},
						/**
						 * A Boolean value that specifies whether the children of the specified object are accessible. This is equivalent to the inverse logic of the Make Child Objects Accessible setting in the Accessibility panel. That is, if forceSimple is true, it is the same as the Make Child Object Accessible option being unchecked. If forceSimple is false, it is the same as the Make Child Object Accessible option being checked.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e55.html
						 */
						get forceSimple(){ return document.forceSimple; },
						set forceSimple(value)
						{
							document.forceSimple = value;
						},
						/**
						 * A string that is equivalent to the Name field in the Accessibility panel. Screen readers identify objects by reading the name aloud.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e60.html
						 */
						get name(){ return document.accName; },
						set name(value)
						{
							document.accName = value;
						},
						/**
						 * A Boolean value that specifies whether the object is accessible. This is equivalent to the inverse logic of the Make Movie Accessible setting in the Accessibility panel. That is, if document.silent is true, it is the same as the Make Movie Accessible option being unchecked. If it is false, it is the same as the Make Movie Accessible option being checked.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e48.html
						 */
						get silent(){ return document.silent; },
						set silent(value)
						{
							document.silent = value;
						}
					},
		
				// --------------------------------------------------------------------------------
				// # add
		
					add:
					{
						/**
						 * Adds an item from any open document or library to the specified Document object.
						 * @param	{Object} position A point that specifies the x and y coordinates of the location at which to add the item. It uses the center of a symbol or the upper left corner of a bitmap or video.
						 * @param	{Item} item An Item object that specifies the item to add and the library from which to add it (see Item object).
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e44.html
						 */
						item:function(position, item)
						{
							return document.addItem(position, item);
						},
						/**
						 * Adds a new path between two points. The method uses the document’s current stroke attributes and adds the path on the current frame and current layer. This method works in the same way as clicking on the line tool and drawing a line.
						 * @param	{Number} startpoint A pair of floating-point numbers that specify the x and y coordinates where the line starts.
						 * @param	{Number} endpoint A pair of floating-point numbers that specify the x and y coordinates where the line ends.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e43.html
						 */
						line:function(startPoint, endpoint)
						{
							document.addNewLine(startPoint, endpoint);
						},
						/**
						 * Adds a new Oval object in the specified bounding rectangle. This method performs the same operation as the Oval tool. The method uses the document’s current default stroke and fill attributes and adds the oval on the current frame and layer. If both bSuppressFill and bSuppressStroke are set to true, the method has no effect.
						 * @param	{Rectangle} boundingRectangle A rectangle that specifies the bounds of the oval to be added. For information on the format of boundingRectangle, see document.addNewRectangle().
						 * @param	{Boolean} bSuppressFill A Boolean value that, if set to true, causes the method to create the shape without a fill. The default value is false. This parameter is optional.
						 * @param	{Boolean} bSuppressStroke A Boolean value that, if set to true, causes the method to create the shape without a stroke. The default value is false. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e42.html
						 */
						oval:function(boundingRectangle, bSuppressFill, bSuppressStroke)
						{
							document.addNewOval(boundingRectangle, bSuppressFill, bSuppressStroke);
						},
						/**
						 * Adds a new oval primitive fitting into the specified bounds. This method performs the same operation as the Oval Primitive tool. The oval primitive uses the document's current default stroke and fill attributes and is added on the current frame and layer. If both bSuppressFill and bSuppressStroke are set to true, the method has no effect.
						 * @param	{Rectangle} boundingRectangle A rectangle that specifies the bounds within which the new oval primitive is added. For information on the format of boundingRectangle, see document.addNewRectangle().
						 * @param	{Boolean} bSuppressFill A Boolean value that, if set to true, causes the method to create the oval without a fill. The default value is false. This parameter is optional.
						 * @param	{Boolean} bSuppressStroke A Boolean value that, if set to true, causes the method to create the oval without a stroke. The default value is false. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WSCF572308-4FC6-4809-BF4F-1145EC7EEA37.html
						 */
						primitiveOval:function(boundingRectangle, bSpupressFill, bSuppressStroke)
						{
							document.addNewPrimitiveOval(boundingRectangle, bSpupressFill, bSuppressStroke);
						},
						/**
						 * Adds a new rectangle primitive fitting into the specified bounds. This method performs the same operation as the Rectangle Primitive tool. The rectangle primitive uses the document's current default stroke and fill attributes and is added on the current frame and layer. If both bSuppressFill and bSuppressStroke are set to true, the method has no effect.
						 * @param	{Rectangle} rect A rectangle that specifies the bounds within which the new rectangle primitive is added. For information on the format of boundingRectangle, see document.addNewRectangle().
						 * @param	{Number}  roundness An integer between 0 and 999 that represents the number of points used to specify how much the corners should be rounded.
						 * @param	{Boolean} bSuppressFill A Boolean value that, if set to true, causes the method to create the rectangle without a fill. The default value is false. This parameter is optional.
						 * @param	{Boolean} bSuppressStroke A Boolean value that, if set to true, causes the method to create the rectangle without a stroke. The default value is false. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS89493EAA-1C9F-471d-A011-14511DA42162.html
						 */
						primitiveRectangle:function(boundingRectangle, roundness, bSuppressFill, bSuppressStroke)
						{
							document.addNewPrimitiveRectangle(boundingRectangle, roundness, bSuppressFill, bSuppressStroke);
						},
						/**
						 * Adds a new rectangle or rounded rectangle, fitting it into the specified bounds. This method performs the same operation as the Rectangle tool. The method uses the document’s current default stroke and fill attributes and adds the rectangle on the current frame and layer. If both bSuppressFill and bSuppressStroke are set to true, the method has no effect.
						 * @param	{Rectangle} boundingRectangle A rectangle that specifies the bounds within which the new rectangle is added, in the format {left:value1,top:value2,right:value3,bottom:value4}. The left and top values specify the location of the upper left corner (e.g., left:0,top:0 represents the upper left corner of the Stage) and the right and bottom values specify the location of the lower-right corner. Therefore, the width of the rectangle is the difference in value between left and right, and the height of the rectangle is the difference in value between top and bottom. In other words, the rectangle bounds do not all correspond to the values shown in the Property inspector. The left and top values correspond to the X and Y values in the Property inspector, respectively. However, the right and bottom values don’t correspond to the W and H values in the Property inspector. For example, consider a rectangle with the following bounds: {left:10,top:10,right:50,bottom:100} This rectangle would display the following values in the Property inspector: X = 10, Y = 10, W = 40, H = 90
						 * @param	{Number} roundness An integer value from 0 to 999 that specifies the roundness to use for the corners. The value is specified as number of points. The greater the value, the greater the roundness.
						 * @param	{Boolean} bSuppressFill A Boolean value that, if set to true, causes the method to create the shape without a fill. The default value is false. This parameter is optional.
						 * @param	{Boolean} bSuppressStroke A Boolean value that, if set to true, causes the method to create the rectangle without a stroke. The default value is false. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e40.html
						 */
						rectangle:function(boundingRectangle, roundness, bSuppressFill, bSuppressStroke)
						{
							document.addNewRectangle(boundingRectangle, roundness, bSuppressFill, bSuppressStroke);
						},
						/**
						 * Inserts a new text field and optionally places text into the field. If you omit the text parameter, you can call document.setTextString() to populate the text field.
						 * @param	{Text} boundingRectangle Specifies the size and location of the text field. For information on the format of boundingRectangle, see document.addNewRectangle().
						 * @param	{String} text An optional string that specifies the text to place in the field. If you omit this parameter, the selection in the Tools panel switches to the Text tool. Therefore, if you don’t want the selected tool to change, pass a value for text.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fa4.html
						 */
						text:function(boundingRectangle, text)
						{
							document.addNewText(boundingRectangle, text);
						}
					},
		
				// --------------------------------------------------------------------------------
				// # filter
		
					filter:
					{
						/**
						 * Applies a filter to the selected objects and places the filter at the end of the Filters list.
						 * @param	{String} filterName A string specifying the filter to be added to the Filters list and enabled for the selected object(s). Acceptable values are "adjustColorFilter", "bevelFilter", "blurFilter", "dropShadowFilter", "glowFilter", "gradientBevelFilter", and "gradientGlowFilter".
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e45.html
						 */
						add:function(filterName)
						{
							document.addFilter(filterName);
						},
						/**
						 * Removes the specified filter from the Filters list of the selected object(s).
						 * @param	{Number} filterIndex An integer specifying the zero-based index of the filter to remove from the selected object(s).
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7def.html
						 */
						remove:function(filterIndex)
						{
							document.removeFilter(filterIndex);
						},
						/**
						 * Sets a specified filter property for the currently selected objects (assuming that the object supports the specified filter).
						 * @param	{String} property A string specifying the property to be set. Acceptable values are "blurX", "blurY", "quality", angle", "distance", "strength", "knockout", "inner", "bevelType", "color", "shadowColor", and "highlightColor".
						 * @param	{Number} filterIndex An integer specifying the zero-based index of the filter in the Filters list.
						 * @param	{Number} value A number or string specifying the value to be set for the specified filter property. Acceptable values depend on the property and the filter being set.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dd4.html
						 */
						setProperty:function(property, filterIndex, value)
						{
							document.setFilterProperty(property, filterIndex, value);
						},
						/**
						 * Changes the index of the filter in the Filters list. Any filters above or below newIndex are shifted up or down accordingly. For example, using the filters shown below, if you issue the command fl.getDocumentDOM().changeFilterOrder(3, 0), the filters are rearranged as follows:
						 * @param	{Number} oldIndex An integer that represents the current zero-based index position of the filter you want to reposition in the Filters list.
						 * @param	{Number} newIndex An integer that represents the new index position of the filter in the list.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e2e.html
						 */
						changeOrder:function(oldIndex, newIndex)
						{
							document.changeFilterOrder(oldIndex, newIndex);
						},
						/**
						 * Enables the specified filter for the selected object(s).
						 * @param	{Number} filterIndex An integer specifying the zero-based index of the filter in the Filters list to enable.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e15.html
						 */
						enable:function(filterIndex)
						{
							document.enableFilter(filterIndex);
						},
						/**
						 * Disables the specified filter in the Filters list.
						 * @param	{Number} filterIndex An integer representing the zero-based index of the filter in the Filters list.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e20.html
						 */
						disable:function(filterIndex)
						{
							document.disableFilter(filterIndex);
						},
						/**
						 * Disables all filters except the one at the specified position in the Filters list.
						 * @param	{Number} enabledFilterIndex An integer representing the zero-based index of the filter that should remain enabled after other filters are disabled.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e1f.html
						 */
						disableOther:function(enabledFilterIndex)
						{
							document.disableOtherFilters(enabledFilterIndex);
						}
					},
		
				// --------------------------------------------------------------------------------
				// # filters
		
					filters:
					{
						/**
						 * Applies filters to the selected objects. Use this method after calling document.getFilters() and making any desired changes to the filters.
						 * @param	{Array} filterArray The array of filters currently specified.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dd3.html
						 */
						set:function(filterArray)
						{
							document.setFilters(filterArray);
						},
						/**
						 * Returns an array that contains the list of filters applied to the currently selected object(s). If multiple objects are selected and they don’t have identical filters, this method returns the list of filters applied to the first selected object.
						 * @returns	{Array}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e08.html
						 */
						get:function()
						{
							return document.getFilters();
						},
						/**
						 * Removes all filters from the selected object(s).
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7df2.html
						 */
						remove:function()
						{
							document.removeAllFilters();
						},
						/**
						 * Disables all filters on the selected objects.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e21.html
						 */
						disable:function()
						{
							document.disableAllFilters();
						},
						/**
						 * Enables all the filters on the Filters list for the selected object(s).
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e16.html
						 */
						enable:function()
						{
							document.enableAllFilters();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # properties
		
					properties:
					{
						/**
						 * Sets the opacity of the instance.
						 * @param	{Number} opacity An integer between 0 (transparent) and 100 (completely saturated) that adjusts the transparency of the instance.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dd2.html
						 */
						set alpha(opacity)
						{
							document.setInstanceAlpha(opacity);
						},
						/**
						 *
						 * @returns	{String}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e0e.html
						 */
						set blendMode(mode)
						{
							document.setBlendMode(mode);
						},
						get blendMode(){ return document.getBlendMode(); },
						/**
						 * Sets the brightness for the instance.
						 * @param	{Number} brightness An integer that specifies brightness as a value from -100 (black) to 100 (white).
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dd1.html
						 */
						set brightness(brightness)
						{
							document.setInstanceBrightness(brightness);
						},
						/**
						 * Gets the specified Element property for the current selection. For a list of acceptable values, see the Property summary table for the Element object.
						 * @param	{String}  propertyName A string that specifies the name of the Element property for which to retrieve the value.
						 * @returns	{value}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e0a.html
						 */
						set property(property, value)
						{
							document.setElementProperty(property, value);
						},
						get property(propertyName){ return document.getElementProperty(propertyName); },
						/**
						 * Resets the transformation matrix. This method is equivalent to selecting Modify &gt; Transform &gt; Remove Transform.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7de9.html
						 */
						resetTransform:function()
						{
							document.resetTransformation();
						},
						/**
						 * Sets the tint for the instance.
						 * @param	color {} The color of the tint, in one of the following formats:
						 * @param	{Number} strength An integer between 0 and 100 that specifies the opacity of the tint.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dd0.html
						 */
						set tint(color, strength)
						{
							document.setInstanceTint(color, strength);
						},
						/**
						 * Unlocks all locked elements on the currently selected frame.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7caa.html
						 */
						unlock:function()
						{
							document.unlockAllElements();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # text
		
					text:
					{
						/**
						 * Gets a specific TextAttrs property of the selected Text objects. Selected objects that are not text fields are ignored. For a list of property names and expected values, see the Property summary table for the TextAttrs object. See also document.setElementTextAttr().
						 * @param	{String} attrName A string that specifies the name of the TextAttrs property to be returned. For a list of property names and expected values, see the Property summary table for the TextAttrs object.
						 * @param	{Number} startIndex An integer that specifies the index of first character, with 0 (zero) specifying the first position. This parameter is optional.
						 * @param	{Number} endIndex An integer that specifies the index of last character. This parameter is optional.
						 * @returns	{Text}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e09.html
						 */
						setAttributes:function(attrName, attrValue, startIndex, endIndex)
						{
							document.setElementTextAttr(attrName, attrValue, startIndex, endIndex);
						},
						getAttributes:function(){ return document.getElementTextAttr(attrName, startIndex, endIndex); },
						/**
						 * Changes the bounding rectangle for the selected text item to the specified size. This method causes the text to reflow inside the new rectangle; the text item is not scaled or transformed. The values passed in boundingRectangle are used as follows:
						 * @param	{Rectangle} boundingRectangle A rectangle that specifies the new size within which the text item should flow. For information on the format of boundingRectangle, see document.addNewRectangle().
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dc4.html
						 */
						set rectangle(boundingRectangle)
						{
							document.setTextRectangle(boundingRectangle);
						},
						/**
						 * Sets the text selection of the currently selected text field to the values specified by the startIndex and endIndex values. Text editing is activated, if it isn’t already.
						 * @param	{Number} startIndex An integer that specifies the position of the first character to select. The first character position is 0 (zero).
						 * @param	{Number} endIndex An integer that specifies the end position of the selection up to, but not including, endIndex. The first character position is 0 (zero).
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dc3.html
						 */
						setSelection:function(startIndex, endIndex)
						{
							document.setTextSelection(startIndex, endIndex);
						},
						/**
						 * Gets the currently selected text. If the optional parameters are not passed, the current text selection is used. If text is not currently opened for editing, the whole text string is returned. If only startIndex is passed, the string starting at that index and ending at the end of the field is returned. If startIndex and endIndex are passed, the string starting from startIndex up to, but not including, endIndex is returned.
						 * @param	{Number} startIndex An integer that is an index of first character to get. This parameter is optional.
						 * @param	{Number} endIndex An integer that is an index of last character to get. This parameter is optional.
						 * @returns	{String}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e03.html
						 */
						setString:function(text, startIndex, endIndex)
						{
							document.setTextString(text, startIndex, endIndex);
						},
						getString:function(){ return document.getTextString(startIndex, endIndex); }
					}
			},
	
		// --------------------------------------------------------------------------------
		// # file
	
			file:
			{
	
				// --------------------------------------------------------------------------------
				// # properties
		
					properties:
					{
						/**
						 * Read-only property; a string that represents the name of a document (FLA file).
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7f97.html
						 */
						get name(){ return document.name; },
						set name(value)
						{
							document.name = value;
						},
						/**
						 * Read-only property; a string that represents the path of the document in a platform-specific format. If the document has never been saved, this property is undefined.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e4d.html
						 */
						get path(){ return document.path; },
						set path(value)
						{
							document.path = value;
						},
						/**
						 * Read-only property; a string that represents the path of the document, expressed as a file:/// URI. If the document has never been saved, this property is undefined.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS9931616E-E7F0-41de-A90D-50B9342C8D04.html
						 */
						get uri(){ return document.pathURI; },
						set uri(value)
						{
							document.pathURI = value;
						}
					},
		
				// --------------------------------------------------------------------------------
				// # operations
		
					operations:
					{
						/**
						 * Closes the specified document.
						 * @param	{Boolean} bPromptToSaveChanges A Boolean value that, when set to true, causes the method to prompt the user with a dialog box if there are unsaved changes in the document. If bPromptToSaveChanges is set to false, the user is not prompted to save any changed documents. The default value is true. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e2a.html
						 */
						close:function(bPromptToSaveChanges)
						{
							document.close(bPromptToSaveChanges);
						},
						/**
						 * Reverts the specified document to its previously saved version. This method is equivalent to selecting File &gt; Revert.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e35.html
						 */
						revert:function()
						{
							document.revert();
						},
						/**
						 * If the file can be reverted, displays a dialog box to let the user confirm that the file should be reverted. If the user confirms, this method reverts the file to the version stored on the Version Cue server and logs any errors to the Output panel.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fca.html
						 */
						revertToLastVersion:function()
						{
							return document.revertToLastVersion();
						},
						/**
						 * Saves the document in its default location. This method is equivalent to selecting File &gt; Save.
						 * @param	{Parameter} bOkToSaveAs An optional parameter that, if true or omitted, and the file was never saved, opens the Save As dialog box. If false and the file was never saved, the file is not saved.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7de5.html
						 */
						save:function(bOkToSaveAs)
						{
							return document.save(bOkToSaveAs);
						},
						/**
						 * Saves and compacts the file. This method is equivalent to selecting File &gt; Save and Compact.
						 * @param	{Parameter} bOkToSaveAs An optional parameter that, if true or omitted and the file was never saved, opens the Save As dialog box. If false and the file was never saved, the file is not saved. The default value is true.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7de4.html
						 */
						saveAndCompact:function(bOkToSaveAs)
						{
							return document.saveAndCompact(bOkToSaveAs);
						},
						/**
						 * If the file can be saved to the Version Cue server, displays a dialog box to let the user enter version comments, saves a version of the specified document to the server, and logs any errors to the Output panel.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fc9.html
						 */
						saveAVersion:function()
						{
							return document.saveAVersion();
						},
						/**
						 * Synchronizes the specified document with the most current version on the Version Cue server, and logs any errors to the Output panel.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fc4.html
						 */
						synchronizeWithHeadVersion:function()
						{
							return document.synchronizeWithHeadVersion();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # imports
		
					imports:
					{
						/**
						 * Imports a file into a document. This method performs the same operation as the Import To Library or Import To Stage menu command. To import a publish profile, use document.importPublishProfile().
						 * @param	{String} fileURI A string, expressed as a file:/// URI, that specifies the path of the file to import.
						 * @param	{Boolean} importToLibrary A Boolean value that specifies whether to import the file only into the document’s library (true) or to also place a copy on the Stage (false). The default value is false.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dfd.html
						 */
						file:function(fileURI, importToLibrary)
						{
							document.importFile(fileURI, importToLibrary);
						},
						/**
						 * Imports a SWF file into the document. This method performs the same operation as using the Import menu command to specify a SWF file. In Flash 8 and later, you can also use document.importFile() to import a SWF file (as well as other types of files).
						 * @param	{String} fileURI A string, expressed as a file:/// URI, that specifies the file for the SWF file to import.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dfc.html
						 */
						swf:function(fileURI)
						{
							document.importSWF(fileURI);
						}
					},
		
				// --------------------------------------------------------------------------------
				// # exports
		
					exports:
					{
						/**
						 * Exports the document as one or more PNG files. If fileURI is specified and the file already exists, it is overwritten without warning.
						 * @param	{String} fileURI A string, expressed as a file:/// URI, that specifies the filename for the exported file. If fileURI is an empty string or is not specified, Flash displays the Export Movie dialog box.
						 * @param	{Boolean} bCurrentPNGSettings A Boolean value that specifies whether to use the current PNG publish settings (true) or to display the Export PNG dialog box (false). This parameter is optional. The default value is false.
						 * @param	{Boolean} bCurrentFrame A Boolean value that specifies whether to export only the current frame (true) or to export all frames, with each frame as a separate PNG file (false). This parameter is optional. The default value is false.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e12.html
						 */
						png:function(fileURI, bCurrentPNGSettings, bCurrentFrame)
						{
							return document.exportPNG(fileURI, bCurrentPNGSettings, bCurrentFrame);
						},
						/**
						 * Exports the document in the Flash SWF format.
						 * @param	{String} fileURI A string, expressed as a file:/// URI, that specifies the name of the exported file. If fileURI is empty or not specified, Flash displays the Export Movie dialog box. This parameter is optional.
						 * @param	{Boolean} bCurrentSettings A Boolean value that, when set to true, causes Flash to use current SWF publish settings. Otherwise, Flash displays the Export Flash Player dialog box. The default is false. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e10.html
						 */
						swf:function(fileURI, bCurrentSettings)
						{
							document.exportSWF(fileURI, bCurrentSettings);
						}
					},
		
				// --------------------------------------------------------------------------------
				// # can
		
					can:
					{
						/**
						 * Determines whether you can use the document.revert() or fl.revertDocument() method successfully.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e36.html
						 */
						revert:function()
						{
							return document.canRevert();
						},
						/**
						 * Determines whether a version of the specified document can be saved to the Version Cue server.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fd1.html
						 */
						saveAVersion:function()
						{
							return document.canSaveAVersion();
						},
						/**
						 * Determines whether you can use the document.testMovie() method successfully.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e32.html
						 */
						testMovie:function()
						{
							return document.canTestMovie();
						},
						/**
						 * Determines whether you can use the document.testScene() method successfully.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e30.html
						 */
						testScene:function()
						{
							return document.canTestScene();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # test
		
					test:
					{
						/**
						 * Executes a Test Movie operation on the document.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e31.html
						 */
						movie:function()
						{
							document.testMovie();
						},
						/**
						 * Executes a Test Scene operation on the current scene of the document.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e2f.html
						 */
						scene:function()
						{
							document.testScene();
						}
					},
					/**
					 * Publishes the document according to the active publish settings (File &gt; Publish Settings). This method is equivalent to selecting File &gt; Publish.
					 * @returns	{}
					 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7df4.html
					 */
					publish:function()
					{
						document.publish();
					}
			},
	
		// --------------------------------------------------------------------------------
		// # operations
	
			operations:
			{
	
				// --------------------------------------------------------------------------------
				// # clipboard
		
					clipboard:
					{
						/**
						 * Copies the current selection from the document to the Clipboard.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e2d.html
						 */
						copy:function()
						{
							document.clipCopy();
						},
						/**
						 * Cuts the current selection from the document and writes it to the Clipboard.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e2c.html
						 */
						cut:function()
						{
							document.clipCut();
						},
						/**
						 * Pastes the contents of the Clipboard into the document.
						 * @param	{Boolean} bInPlace A Boolean value that, when set to true, causes the method to perform a paste-in-place operation. The default value is false, which causes the method to perform a paste operation to the center of the document. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e2b.html
						 */
						paste:function(bInPlace)
						{
							document.clipPaste(bInPlace);
						}
					},
		
				// --------------------------------------------------------------------------------
				// # mouse
		
					mouse:
					{
						/**
						 * Performs a mouse click from the Selection tool.
						 * @param	{Number} position A pair of floating-point values that specify the x and y coordinates of the click in pixels.
						 * @param	{Boolean} bToggleSel A Boolean value that specifies the state of the Shift key: true for pressed; false for not pressed.
						 * @param	{Boolean} bShiftSel A Boolean value that specifies the state of the application preference Shift select: true for on; false for off.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7df9.html
						 */
						click:function(position, bToggleSel, bShiftSel)
						{
							document.mouseClick(position, bToggleSel, bShiftSel);
						},
						/**
						 * Performs a double mouse click from the Selection tool.
						 * @param	{Number} position A pair of floating-point values that specify the x and y coordinates of the click in pixels.
						 * @param	{Boolean} bAltdown A Boolean value that records whether the Alt key is down at the time of the event: true for pressed; false for not pressed.
						 * @param	{Boolean} bShiftDown A Boolean value that records whether the Shift key was down when the event occurred: true for pressed; false for not pressed.
						 * @param	{Boolean} bShiftSelect A Boolean value that indicates the state of the application preference Shift select: true for on; false for off.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7df8.html
						 */
						dblClk:function(position, bAltDown, bShiftDown, bShiftSelect)
						{
							document.mouseDblClk(position, bAltDown, bShiftDown, bShiftSelect);
						}
					},
		
				// --------------------------------------------------------------------------------
				// # tools
		
					tools:
					{
						/**
						 * Sets all values in the Property inspector to default Oval object settings. If any Oval objects are selected, their properties are reset to default values as well.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fcc.html
						 */
						resetOval:function()
						{
							document.resetOvalObject();
						},
						/**
						 * Sets all values in the Property inspector to default Rectangle object settings. If any Rectangle objects are selected, their properties are reset to default values as well.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fcb.html
						 */
						resetRectangle:function()
						{
							document.resetRectangleObject();
						},
						/**
						 * Specifies a value for a specified property of primitive Oval objects.
						 * @param	{String} propertyName A string that specifies the property to be set. For acceptable values, see the Property summary table for the Oval object.
						 * @param	{value} value The value to be assigned to the property. Acceptable values vary depending on the property you specify in propertyName.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fc7.html
						 */
						setOvalProperty:function(propertyName, value)
						{
							document.setOvalObjectProperty(propertyName, value);
						},
						/**
						 * Specifies a value for a specified property of primitive Rectangle objects.
						 * @param	{String} propertyName A string that specifies the property to be set. For acceptable values, see the Property summary table for the Rectangle object.
						 * @param	{value} value The value to be assigned to the property. Acceptable values vary depending on the property you specify in propertyName.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fc5.html
						 */
						setRectangleProperty:function(propertyName, value)
						{
							document.setRectangleObjectProperty(propertyName, value);
						}
					}
			},
	
		// --------------------------------------------------------------------------------
		// # selection
	
			selection:
			{
				// --------------------------------------------------------------------------------
				// # get / set
		
					/**
					 * An array of the selected objects in the document. If nothing is selected, returns an array of length zero. If no document is open, returns null.
					 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7f91.html
					 */
					get elements(){ return document.selection; },
					set elements(value)
					{
						document.selection = value;
					},
		
				// --------------------------------------------------------------------------------
				// # arrange
		
					arrange:
					{
						/**
						 * Aligns the selection.
						 * @param	{String} alignmode A string that specifies how to align the selection. Acceptable values are "left", "right", "top", "bottom", "vertical center", and "horizontal center".
						 * @param	{Boolean} bUseDocumentBounds A Boolean value that, if set to true, causes the method to align to the bounds of the document. Otherwise, the method uses the bounds of the selected objects. The default is false. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e3c.html
						 */
						align:function(alignmode, bUseDocumentBounds)
						{
							document.align(alignmode, bUseDocumentBounds);
						},
						/**
						 * Arranges the selection on the Stage. This method applies only to non-shape objects.
						 * @param	{value} arrangeMode Specifies the direction in which to move the selection. Acceptable values are "back", "backward", "forward", and "front". It provides the same capabilities as these options provide on the Modify &gt; Arrange menu.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e39.html
						 */
						arrange:function(arrangeMode)
						{
							document.arrange(arrangeMode);
						},
						/**
						 * Distributes the selection.
						 * @param	{String} distributemode A string that specifies where to distribute the selected objects. Acceptable values are "left edge", "horizontal center", "right edge", "top edge", "vertical center", and "bottom edge".
						 * @param	{Boolean} bUseDocumentBounds A Boolean value that, when set to true, distributes the selected objects using the bounds of the document. Otherwise, the method uses the bounds of the selected objects. The default is false.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e1e.html
						 */
						distribute:function(distributemode, bUseDocumentBounds)
						{
							document.distribute(distributemode, bUseDocumentBounds);
						},
						/**
						 * Makes the size of the selected objects the same.
						 * @param	{Boolean} bWidth A Boolean value that, when set to true, causes the method to make the widths of the selected items the same.
						 * @param	{Boolean} bHeight A Boolean value that, when set to true, causes the method to make the heights of the selected items the same.
						 * @param	{Boolean} bUseDocumentBounds A Boolean value that, when set to true, causes the method to match the size of the objects to the bounds of the document. Otherwise, the method uses the bounds of the largest object. The default is false. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dfa.html
						 */
						match:function(bWidth, bHeight, bUseDocumentBounds)
						{
							document.match(bWidth, bHeight, bUseDocumentBounds);
						},
						/**
						 * Spaces the objects in the selection evenly.
						 * @param	{String} direction A string that specifies the direction in which to space the objects in the selection. Acceptable values are "horizontal" or "vertical".
						 * @param	{Boolean} bUseDocumentBounds A Boolean value that, when set to true, spaces the objects to the document bounds. Otherwise, the method uses the bounds of the selected objects. The default is false. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7ddb.html
						 */
						space:function(direction, bUseDocumentBounds)
						{
							document.space(direction, bUseDocumentBounds);
						},
						/**
						 * Identical to retrieving the value of the To Stage button in the Align panel. Gets the preference that can be used for document.align(), document.distribute(), document.match(), and document.space() methods on the document.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e0f.html
						 */
						set toDocument(bToStage)
						{
							document.setAlignToDocument(bToStage);
						},
						get toDocument(){ return document.getAlignToDocument(); }
					},
					/**
					 * Stores specified data with the selected object(s). Data is written to the FLA file and is available to JavaScript when the file reopens. Only symbols and bitmaps support persistent data.
					 * @param	{String} name A string that specifies the name of the persistent data.
					 * @param	{value} type Defines the type of data. Acceptable values are "integer", "integerArray", "double", "doubleArray", "string", and "byteArray".
					 * @param	{value} data The value to add. Valid types depend on the type parameter.
					 * @returns	{}
					 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e46.html
					 */
					set data(name, type, data)
					{
						document.addDataToSelection(name, type, data);
					},
		
				// --------------------------------------------------------------------------------
				// # edit
		
					edit:
					{
						/**
						 * Performs a break-apart operation on the current selection.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e38.html
						 */
						breakApart:function()
						{
							document.breakApart();
						},
						/**
						 * Indicates whether the Edit Symbols menu and functionality are enabled. This is not related to whether the selection can be edited. This method should not be used to test whether fl.getDocumentDOM().enterEditMode() is allowed.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e37.html
						 */
						canEditSymbol:function()
						{
							return document.canEditSymbol();
						},
						/**
						 * Converts lines to fills on the selected objects.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e29.html
						 */
						convertLinesToFills:function()
						{
							document.convertLinesToFills();
						},
						/**
						 * Converts the selected Stage item(s) to a new symbol. For information on defining linkage and shared asset properties for a symbol, see Item object.
						 * @param	{String} type A string that specifies the type of symbol to create. Acceptable values are "movie clip", "button", and "graphic".
						 * @param	{String} name A string that specifies the name for the new symbol, which must be unique. You can submit an empty string to have this method create a unique symbol name for you.
						 * @param	registration point {Object} Specifies the point that represents the 0,0 location for the symbol. Acceptable values are: "top left", "top center", "top right", "center left", "center", "center right", "bottom left", "bottom center", and "bottom right".
						 * @returns	{Object}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e28.html
						 */
						convertToSymbol:function(type, name, registrationPoint)
						{
							return document.convertToSymbol(type, name, registrationPoint);
						},
						/**
						 * Deletes the current selection on the Stage. Displays an error message if there is no selection.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e22.html
						 */
						remove:function()
						{
							document.deleteSelection();
						},
						/**
						 * Performs a distribute-to-layers operation on the current selection—equivalent to selecting Distribute to Layers. This method displays an error if there is no selection.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e1d.html
						 */
						distributeToLayers:function()
						{
							document.distributeToLayers();
						},
						/**
						 * Duplicates the selection on the Stage.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e18.html
						 */
						duplicate:function()
						{
							document.duplicateSelection();
						},
						/**
						 * Switches the authoring tool into the editing mode specified by the parameter. If no parameter is specified, the method defaults to symbol-editing mode, which has the same result as right-clicking the symbol to invoke the context menu and selecting Edit.
						 * @param	{Boolean} newWindow A boolean that specifies to edit the symbol in a new window, versus in place
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e14.html
						 */
						enter:function(newWindow)
						{
							fl.getDocumentDOM().enterEditMode(newWindow ? 'newWindow' : 'inPlace');
						},
						/**
						 * Exits from symbol-editing mode and returns focus to the next level up from the editing mode. For example, if you are editing a symbol inside another symbol, this method takes you up a level from the symbol you are editing, into the parent symbol.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e13.html
						 */
						exit:function()
						{
							fl.getDocumentDOM().exitEditMode();
						},
						/**
						 * Converts the current selection to a group.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dff.html
						 */
						group:function()
						{
							document.group();
						},
						/**
						 * Swaps the current selection with the specified one. The selection must contain a graphic, button, movie clip, video, or bitmap. This method displays an error message if no object is selected or the given object could not be found.
						 * @param	{String} name A string that specifies the name of the library item to use.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cb3.html
						 */
						swapElement:function(name)
						{
							document.swapElement(name);
						},
						/**
						 * Performs a trace bitmap on the current selection. This method is equivalent to selecting Modify &gt; Bitmap &gt; Trace Bitmap.
						 * @param	{Number} threshold An integer that controls the number of colors in your traced bitmap. Acceptable values are integers between 0 and 500.
						 * @param	{Number} minimumArea An integer that specifies the radius measured in pixels. Acceptable values are integers between 1 and 1000.
						 * @param	{String} curveFit A string that specifies how smoothly outlines are drawn. Acceptable values are "pixels", "very tight", "tight", "normal", "smooth", and "very smooth".
						 * @param	{String} cornerThreshold A string that is similar to curveFit, but it pertains to the corners of the bitmap image. Acceptable values are "many corners", "normal", and "few corners".
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cae.html
						 */
						traceBitmap:function(threshold, minimumArea, curveFit, cornerThreshold)
						{
							document.traceBitmap(threshold, minimumArea, curveFit, cornerThreshold);
						},
						/**
						 * Ungroups the current selection.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7d3e.html
						 */
						unGroup:function()
						{
							document.unGroup();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # select
		
					select:
					{
						/**
						 * Selects all items on the Stage. This method is equivalent to pressing Control+A (Windows) or Command+A (Macintosh) or selecting Edit &gt; Select All.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7de1.html
						 */
						all:function()
						{
							document.selectAll();
						},
						/**
						 * Deselects any selected items.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7de0.html
						 */
						none:function()
						{
							document.selectNone();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # transform
		
					transform:
					{
						/**
						 * Moves and resizes the selection in a single operation.
						 * @param	{Rectangle} boundingRectangle A rectangle that specifies the new location and size of the selection. For information on the format of boundingRectangle, see document.addNewRectangle().
						 * @param	{Boolean} bContactSensitiveSelection A Boolean value that specifies whether the Contact Sensitive selection mode is enabled (true) or disabled (false) during object selection. The default value is false.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dca.html
						 */
						set bounds(boundingRectangle, bContactSensitiveSelection)
						{
							document.setSelectionBounds(boundingRectangle, bContactSensitiveSelection);
						},
						/**
						 * Gets the location of the transformation point of the current selection. You can use the transformation point for commutations such as rotate and skew.
						 * @returns	{Object}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e00.html
						 */
						set center(transformationPoint)
						{
							document.setTransformationPoint(transformationPoint);
						},
						get center(){ return document.getTransformationPoint(); },
						/**
						 * Moves selected objects by a specified distance.
						 * @param	{Number} distanceToMove A pair of floating-point values that specify the x and y coordinate values by which the method moves the selection. For example, passing ({x:1,y:2}) specifies a location one pixel to the right and two pixels down from the current location.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7df6.html
						 */
						moveBy:function(distanceToMove)
						{
							document.moveSelectionBy(distanceToMove);
						},
						/**
						 * Gets the bounding rectangle of the current selection. If a selection is non-rectangular, the smallest rectangle encompassing the entire selection is returned. The rectangle is based on the document space or, when in edit mode, the registration point (also origin point or zero point) of the symbol being edited.
						 * @returns	{Rectangle}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e04.html
						 */
						set rect(rect, bReplaceCurrentSelection, bContactSensitiveSelection)
						{
							document.setSelectionRect(rect, bReplaceCurrentSelection, bContactSensitiveSelection);
						},
						get rect(){ return document.getSelectionRect(); },
						/**
						 * Rotates the selection by a specified number of degrees. The effect is the same as using the Free Transform tool to rotate the object.
						 * @param	{Number} angle A floating-point value that specifies the angle of the rotation.
						 * @param	{String} rotationPoint A string that specifies which side of the bounding box to rotate. Acceptable values are "top right", "top left", "bottom right", "bottom left", "top center", "right center", "bottom center", and "left center". If unspecified, the method uses the transformation point. This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7de6.html
						 */
						rotate:function(angle, rotationPoint)
						{
							document.rotateSelection(angle, rotationPoint);
						},
						/**
						 * Scales the selection by a specified amount. This method is equivalent to using the Free Transform tool to scale the object.
						 * @param	{Number} xScale A floating-point value that specifies the amount of x by which to scale.
						 * @param	{Number} yScale A floating-point value that specifies the amount of y by which to scale.
						 * @param	{String} whichCorner A string value that specifies the edge about which the transformation occurs. If omitted, scaling occurs about the transformation point. Acceptable values are: "bottom left", "bottom right", "top right", "top left", "top center", "right center", "bottom center", and "left center". This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7de2.html
						 */
						scale:function(xScale, yScale, whichCorner)
						{
							document.scaleSelection(xScale, yScale, whichCorner);
						},
						/**
						 * Skews the selection by a specified amount. The effect is the same as using the Free Transform tool to skew the object.
						 * @param	{Number} xSkew A floating-point number that specifies the amount of x by which to skew, measured in degrees.
						 * @param	{Number} ySkew A floating-point number that specifies the amount of y by which to skew, measured in degrees.
						 * @param	{String} whichEdge A string that specifies the edge where the transformation occurs; if omitted, skew occurs at the transformation point. Acceptable values are "top center", "right center", "bottom center", and "left center". This parameter is optional.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dc0.html
						 */
						skew:function(xSkew, ySkew, whichEdge)
						{
							document.skewSelection(xSkew, ySkew, whichEdge);
						},
						/**
						 * Performs a general transformation on the current selection by applying the matrix specified in the arguments. For more information, see the element.matrix property.
						 * @param	{Number} a A floating-point number that specifies the (0,0) element of the transformation matrix.
						 * @param	{Number} b A floating-point number that specifies the (0,1) element of the transformation matrix.
						 * @param	{Number} c A floating-point number that specifies the (1,0) element of the transformation matrix.
						 * @param	{Number} d A floating-point number that specifies the (1,1) element of the transformation matrix.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cad.html
						 */
						transform:function(a, b, c, d)
						{
							document.transformSelection(a, b, c, d);
						}
					},
		
				// --------------------------------------------------------------------------------
				// # transform3D
		
					transform3D:
					{
						/**
						 * Method: applies a 3D rotation to the selection. This method is available only for movie clips.
						 * @param	{Object} xyzCoordinate An XYZ coordinate point that specifies the axes for 3D rotation.
						 * @param	{Boolean} bGlobalTransform A Boolean value that specifies whether the transformation mode should be global (true) or local (false).
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS0866D18E-C028-4ec1-B351-59F12BAB2743.html
						 */
						rotate:function(xyzCoordinate, bGlobalTransform)
						{
							document.rotate3DSelection(xyzCoordinate, bGlobalTransform);
						},
						/**
						 * Method: sets the XYZ position around which the selection is translated or rotated. This method is available only for movie clips.
						 * @param	{Object} xyzCoordinate An XYZ coordinate that specifies the center point for 3D rotation or translation.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS19655B33-1D64-40f7-AE53-E089C37C0F83.html
						 */
						translateCenter:function(xyzCoordinate)
						{
							document.translate3DCenter(xyzCoordinate);
						},
						/**
						 * Method: applies a 3D translation to the selection. This method is available only for movie clips.
						 * @param	xyzCoordinate {} An XYZ coordinate that specifies the axes for 3D translation.
						 * @param	{Boolean} bGlobalTransform A Boolean value that specifies whether the transformation mode should be global (true) or local (false).
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS7EAC74FE-B200-4f4d-9C6B-46858F05897E.html
						 */
						translate:function(xyzCoordinate, bGlobalTransform)
						{
							document.translate3DSelection(xyzCoordinate, bGlobalTransform);
						}
					}
			},
	
		// --------------------------------------------------------------------------------
		// # settings
	
			settings:
			{
	
				// --------------------------------------------------------------------------------
				// # as3
		
					as3:
					{
						/**
						 * A Boolean value that describes whether the instances placed on the Stage are automatically added to user-defined timeline classes. The default value is true.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fd7.html
						 */
						get autoDeclare(){ return document.as3AutoDeclare; },
						set autoDeclare(value)
						{
							document.as3AutoDeclare = value;
						},
						/**
						 * A string that describes the ActionScript 3.0 “dialect” being used in the specified document. The default value is "AS3". If you wish to allow prototype classes, as permitted in earlier ECMAScript specifications, set this value to "ES".
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fd6.html
						 */
						get dialect(){ return document.as3Dialect; },
						set dialect(value)
						{
							document.as3Dialect = value;
						},
						/**
						 * A string that specifies the top-level ActionScript 3.0 class associated with the document. If the document isn’t configured to use ActionScript 3.0, this property is ignored.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fd0.html
						 */
						get docClass(){ return document.docClass; },
						set docClass(value)
						{
							document.docClass = value;
						},
						/**
						 * An integer that specifies in which frame to export ActionScript 3.0 classes. By default, classes are exported in Frame 1.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fd5.html
						 */
						get exportFrame(){ return document.as3ExportFrame; },
						set exportFrame(value)
						{
							document.as3ExportFrame = value;
						},
						/**
						 * A string that contains a list of items in the document’s ActionScript 3.0 External library path, which specifies the location of SWC files used as runtime shared libraries. Items in the string are delimited by semi-colons. In the authoring tool, the items are specified by choosing File &gt; Publish Settings and then choosing ActionScript 3.0 Script Settings on the Flash tab.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WSFE6C8B4D-A287-4f77-A002-38516C28C318.html
						 */
						get externalLibraryPath(){ return document.externalLibraryPath; },
						set externalLibraryPath(value)
						{
							document.externalLibraryPath = value;
						},
						/**
						 * A string that contains a list of items in the document’s ActionScript 3.0 Library path, which specifies the location of SWC files or folders containing SWC files. Items in the string are delimited by semi-colons. In the authoring tool, the items are specified by choosing File &gt; Publish Settings and then choosing ActionScript 3.0 Script Settings on the Flash tab.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WSA93A3E72-B9A1-44a5-9C99-08D88DB7BF0C.html
						 */
						get libraryPath(){ return document.libraryPath; },
						set libraryPath(value)
						{
							document.libraryPath = value;
						},
						/**
						 * A string that contains a list of items in the document’s ActionScript 3.0 Source path, which specifies the location of ActionScript class files. Items in the string are delimited by semi-colons. In the authoring tool, the items are specified by choosing File &gt; Publish Settings and then choosing ActionScript 3.0 Script Settings on the Flash tab.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5A00B146-30BC-4841-A27F-325968E8084B.html
						 */
						get sourcePath(){ return document.sourcePath; },
						set sourcePath(value)
						{
							document.sourcePath = value;
						},
						/**
						 * A Boolean value that specifies whether the ActionScript 3.0 compiler should compile with the Strict Mode option turned on (true) or off (false). Strict Mode causes warnings to be reported as errors, which means that compilation will not succeed if those errors exist. The default value is true.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fd4.html
						 */
						get strictMode(){ return document.as3StrictMode; },
						set strictMode(value)
						{
							document.as3StrictMode = value;
						},
						/**
						 * An integer that specifies which version of ActionScript is being used in the specified document. Acceptable values are 1, 2, and 3.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fd2.html
						 */
						get version(){ return document.asVersion; },
						set version(value)
						{
							document.asVersion = value;
						},
						/**
						 * A Boolean value that specifies whether the ActionScript 3.0 compiler should compile with the Warnings Mode option turned on (true) or off (false). Warnings Mode causes extra warnings to be reported that are useful for discovering incompatibilities when updating ActionScript 2.0 code to ActionScript 3.0. The default value is true.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fd3.html
						 */
						get warningsMode(){ return document.as3WarningsMode; },
						set warningsMode(value)
						{
							document.as3WarningsMode = value;
						}
					},
					/**
					 * Returns the mobile XML settings for the document.
					 * @returns	{String}
					 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fcf.html
					 */
					set mobile(xmlString)
					{
						document.setMobileSettings(xmlString);
					},
					get mobile(){ return document.getMobileSettings(); },
					/**
					 * Returns a string that represents the targeted player version for the specified document. For a list of values that this method can return, see document.setPlayerVersion().
					 * @returns	{String}
					 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7fce.html
					 */
					set playerVersion(version)
					{
						document.setPlayerVersion(version);
					},
					get playerVersion(){ return document.getPlayerVersion(); },
		
				// --------------------------------------------------------------------------------
				// # publishProfile
		
					publishProfile:
					{
						/**
						 * A string that specifies the name of the active publish profile for the specified document.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e59.html
						 */
						get current(){ return document.currentPublishProfile; },
						set current(value)
						{
							document.currentPublishProfile = value;
						},
						/**
						 * Read-only property; an array of the publish profile names for the document.
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e4c.html
						 */
						get all(){ return document.publishProfiles; },
						set all(value)
						{
							document.publishProfiles = value;
						},
						/**
						 * Adds a new publish profile and makes it the current one.
						 * @param	{Parameter} profileName The unique name of the new profile. If you do not specify a name, a default name is provided. This parameter is optional.
						 * @returns	{Number}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e41.html
						 */
						add:function(profileName)
						{
							return document.addNewPublishProfile(profileName);
						},
						/**
						 * Deletes the currently active profile, if there is more than one. There must be at least one profile left.
						 * @returns	{Number}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e25.html
						 */
						remove:function()
						{
							return document.deletePublishProfile();
						},
						/**
						 * Renames the current profile.
						 * @param	{Parameter} profileNewName An optional parameter that specifies the new name for the profile. The new name must be unique. If the name is not specified, a default name is provided.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dee.html
						 */
						rename:function(profileNewName)
						{
							return document.renamePublishProfile(profileNewName);
						},
						/**
						 * Duplicates the currently active profile and gives the duplicate version focus.
						 * @param	{String} profileName A string that specifies the unique name of the duplicated profile. If you do not specify a name, the method uses the default name. This parameter is optional.
						 * @returns	{Number}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e1a.html
						 */
						duplicate:function(profileName)
						{
							return document.duplicatePublishProfile(profileName);
						},
						/**
						 * Imports a profile from a file.
						 * @param	{String} fileURI A string, expressed as a file:/// URI, that specifies the path of the XML file defining the profile to import.
						 * @returns	{Number}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dfe.html
						 */
						importProfile:function(fileURI)
						{
							return document.importPublishProfile(fileURI);
						},
						/**
						 * Method: imports an XML string that represents a publish profile and sets it as the current profile. To generate an XML string to import, use document.exportPublishProfileString() before using this method.
						 * @param	{String} xmlString A string that contains the XML data to be imported as the current profile.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WSB3F3672A-EB9D-4087-9485-657EFFF8FA72.html
						 */
						importString:function(xmlString)
						{
							return document.importPublishProfileString(xmlString);
						},
						/**
						 * Exports the currently active profile to an XML file.
						 * @param	{String} fileURI A string, expressed as a file:/// URI, that specifies the path of the XML file to which the profile is exported.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e11.html
						 */
						exportProfile:function(fileURI)
						{
							document.exportPublishProfile(fileURI);
						},
						/**
						 * Method: returns a string that specifies, in XML format, the specified profile. If you don’t pass a value for profileName, the current profile is exported.
						 * @param	{String} profileName A string that specifies the name of the profile to export to an XML string. This parameter is optional.
						 * @returns	{String}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS014AAEC0-0522-4832-99CD-72FCF71AA794.html
						 */
						exportString:function(profileName)
						{
							return document.exportPublishProfileString(profileName);
						}
					}
			},
	
		// --------------------------------------------------------------------------------
		// # shapes
	
			shapes:
			{
	
				// --------------------------------------------------------------------------------
				// # outlines
		
					outlines:
					{
						/**
						 * If the selection contains at least one path with at least one Bézier point selected, moves all selected Bézier points on all selected paths by the specified amount.
						 * @param	{Number} delta A pair of floating-point values that specify the x and y coordinates in pixels by which the selected Bézier points are moved. For example, passing ({x:1,y:2}) specifies a location that is to the right by one pixel and down by two pixels from the current location.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7df7.html
						 */
						moveSelectedPointsBy:function(delta)
						{
							document.moveSelectedBezierPointsBy(delta);
						},
						/**
						 * Optimizes smoothing for the current selection, allowing multiple passes, if specified, for optimal smoothing. This method is equivalent to selecting Modify &gt; Shape &gt; Optimize.
						 * @param	{Number} smoothing An integer in the range from 0 to 100, with 0 specifying no smoothing and 100 specifying maximum smoothing.
						 * @param	{Boolean} bUseMultiplePasses A Boolean value that, when set to true, indicates that the method should use multiple passes, which is slower but produces a better result. This parameter has the same effect as clicking the Use Multiple Passes button in the Optimize Curves dialog box.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7df5.html
						 */
						optimize:function(smoothing, bUseMultiplePasses)
						{
							document.optimizeCurves(smoothing, bUseMultiplePasses);
						},
						/**
						 * Smooths the curve of each selected fill outline or curved line. This method performs the same action as the Smooth button in the Tools panel.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dbf.html
						 */
						smooth:function()
						{
							document.smoothSelection();
						},
						/**
						 * Straightens the currently selected strokes. This method is equivalent to using the Straighten button in the Tools panel.
						 * @returns	{}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cb4.html
						 */
						straighten:function()
						{
							document.straightenSelection();
						}
					},
		
				// --------------------------------------------------------------------------------
				// # operations
		
					operations:
					{
						/**
						 * Uses the top selected drawing object to crop all selected drawing objects underneath it. This method returns false if there are no drawing objects selected or if any of the selected items are not drawing objects.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e27.html
						 */
						crop:function()
						{
							return document.crop();
						},
						/**
						 * Deletes the envelope (bounding box that contains one or more objects) from the selected objects.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e26.html
						 */
						deleteEnvelope:function()
						{
							return document.deleteEnvelope();
						},
						/**
						 * Creates an intersection drawing object from all selected drawing objects. This method returns false if there are no drawing objects selected, or if any of the selected items are not drawing objects.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dfb.html
						 */
						intersect:function()
						{
							return document.intersect();
						},
						/**
						 * Uses the top selected drawing object to punch through all selected drawing objects underneath it. This method returns false if there are no drawing objects selected or if any of the selected items are not drawing objects.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7df3.html
						 */
						punch:function()
						{
							return document.punch();
						},
						/**
						 * Combines all selected shapes into a drawing object.
						 * @returns	{Boolean}
						 * @see http://help.adobe.com/en_US/Flash/10.0_ExtendingFlash/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7d97.html
						 */
						union:function()
						{
							return document.union();
						}
					}
			},
	
			toString:function()
			{
				return '[class Superdoc]';
			}

	}

	xjsfl.classes.register('Superdoc', Superdoc);
