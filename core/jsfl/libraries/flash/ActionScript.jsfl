// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██   ██             ██████            ██        ██   
//  ██  ██        ██                  ██                          ██   
//  ██  ██ █████ █████ ██ █████ █████ ██     █████ ████ ██ █████ █████ 
//  ██████ ██     ██   ██ ██ ██ ██ ██ ██████ ██    ██   ██ ██ ██  ██   
//  ██  ██ ██     ██   ██ ██ ██ ██ ██     ██ ██    ██   ██ ██ ██  ██   
//  ██  ██ ██     ██   ██ ██ ██ ██ ██     ██ ██    ██   ██ ██ ██  ██   
//  ██  ██ █████  ████ ██ █████ ██ ██ ██████ █████ ██   ██ █████  ████ 
//                                                         ██          
//                                                         ██          
//
// ------------------------------------------------------------------------------------------------------------------------
// ActionScript

	xjsfl.init(this);
		
	/**
	 * ActionScript
	 * @overview	Provides ActionScript 3 related functionality
	 * @instance	ActionScript
	 */
	ActionScript =
	{
		
		classes:
		{
			'movie clip'		: 'flash.display.MovieClip',
			'sprite'			: 'flash.display.Sprite',
			'button'			: 'flash.display.SimpleButton',
			'bitmap'			: 'flash.display.Bitmap',
			'sound'				: 'flash.media.Sound',
			'video'				: 'flash.media.Video',
			'font'				: 'flash.text.Font',
			'text'				: 'flash.text.TextField',
			'tlfText'			: 'fl.text.TLFTextField',
		},

		/**
		 * Gets the AS3 class of an element or item
		 * @param		{Element}		item		A stage element
		 * @param		{LibraryItem}	item		A library item
		 * @param		{Boolean}		nameOnly	An optional Boolean to return only the Class name
		 * @returns		{String}					The String class of the object
		 */
		getClass:function(element, nameOnly)
		{
			var classPath = '';
			
			if(element instanceof Element)
			{
				// ignore graphic elements
					if(element.symbolType !== 'graphic')
					{
						// element is text
							if(element.textType && element.elementType in ActionScript.classes)
							{
								classPath = ActionScript.classes[element.elementType];
							}
							
						// element is an instance
							if(element.instanceType)
							{
								// variables
									var item		= element.libraryItem;
								
								// exported types
									if(item.linkageExportForAS)
									{
										var itemClass	= item.linkageClassName;
										var baseClass	= ActionScript.getBaseClass(item);
										classPath		= itemClass || baseClass;
									}
									
								// non-exported, including video
									else
									{
										var itemClass	= ActionScript.classes[item.itemType];
										var baseClass	= ActionScript.classes[element.symbolType];
										classPath		= itemClass || baseClass;
									}
								
								// finalize
									if(classPath === ActionScript.classes['movie clip'] && item.timeline.frameCount === 1)
									{
										classPath = ActionScript.classes.sprite;
									}
							}
					}
				
			}
			
			else if(element instanceof LibraryItem)
			{
				classPath = element.linkageClassName || ActionScript.getBaseClass(element);
			}
			
			return nameOnly ? classPath.split('.').pop() : classPath;
		},		
		
		/**
		 * Gets the AS3 base class of an item or element
		 * @param		{LibraryItem}	item		A library item
		 * @param		{Element}		item		A stage element
		 * @param		{Boolean}		nameOnly	An optional Boolean to return only the Class name
		 * @returns		{String}					The String class of the object
		 */
		getBaseClass:function(item, nameOnly)
		{
			var classPath = '';
			
			if(item instanceof Element)
			{
				item = item.libraryItem;
			}
			
			if(item instanceof LibraryItem)
			{
				if(item.linkageExportForAS)
				{
					// custom class
						if(item.linkageBaseClass)
						{
							classPath = item.linkageBaseClass
						}
						
					// native class
						else
						{
							if(item.itemType === 'movie clip')
							{
								classPath = item.timeline.frameCount === 1 ? ActionScript.classes.sprite : ActionScript.classes['movie clip'];
							}
							else
							{
								classPath = ActionScript.classes[item.itemType] || '';
							}
						}
				}

			}
			return nameOnly ? classPath.split('.').pop() : classPath;
		}
	
	}

	xjsfl.classes.register('ActionScript', ActionScript);
		
		
