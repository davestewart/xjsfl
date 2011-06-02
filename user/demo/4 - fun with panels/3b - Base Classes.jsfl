// ----------------------------------------------------------------------------------------------------
// base class

	function XStageElement()
	{
		// --------------------------------------------------------------------------------------------
		// properties
		
			this.dom				= fl.getDocumentDOM();
			this.dom.livePreview	= true;
			this.element			= null;
			this.item				= null;
	
		// --------------------------------------------------------------------------------------------
		// methods
	
			this.getFromLibrary = function(path)
			{
				var index = this.dom.library.findItemIndex(path);
				return this.dom.library.items[index]; 
			}
			
			this.setDocument = function(document, x, y)
			{
				x				= x || 0;
				y				= y || 0;
				document		= document || this.dom;
				document.addItem({x:x, y:y}, this.item);
				this.element	= this.dom.selection[0];
			}
	}


// ----------------------------------------------------------------------------------------------------
// class

	function XElement(seed, document, x, y)
	{
		
		// --------------------------------------------------------------------------------------------
		// methods

			
			
		// --------------------------------------------------------------------------------------------
		// constructor

			if(typeof seed == 'string')
			{
				this.item = this.getFromLibrary(seed);
				this.setDocument(document, x, y);
			}
			else
			{
				this.element = seed;
			}
			
	}
	
// ----------------------------------------------------------------------------------------------------
// proptotype

	// object
		XElement.prototype = new XStageElement;
	
	// read only properties
		XElement.prototype.__defineGetter__('depth', function (){ return this.element.depth } );
		XElement.prototype.__defineGetter__('elementType', function (){ return this.element.elementType } );
		XElement.prototype.__defineGetter__('layer', function (){ return this.element.layer } );
	
	// other
		XElement.prototype.__defineSetter__('locked', function (value){ this.element.locked = value } );
		XElement.prototype.__defineGetter__('locked', function (){ return this.element.locked } );
	
		XElement.prototype.__defineSetter__('name', function (value){ this.element.name = value } );
		XElement.prototype.__defineGetter__('name', function (){ return this.element.name } );
	
		XElement.prototype.__defineSetter__('selected', function (value){ this.element.selected = value } );
		XElement.prototype.__defineGetter__('selected', function (){ return this.element.selected } );
	
		XElement.prototype.__defineSetter__('matrix', function (value){ this.element.matrix = value } );
		XElement.prototype.__defineGetter__('matrix', function (){ return this.element.matrix } );
	
	
	// transform	
		XElement.prototype.__defineSetter__('height', function (value){ this.element.height = value } );
		XElement.prototype.__defineGetter__('height', function (){ return this.element.height } );
	
		XElement.prototype.__defineSetter__('left', function (value){ this.element.left = value } );
		XElement.prototype.__defineGetter__('left', function (){ return this.element.left } );
	
		XElement.prototype.__defineSetter__('rotation', function (value){ this.element.rotation = value } );
		XElement.prototype.__defineGetter__('rotation', function (){ return this.element.rotation } );
	
		XElement.prototype.__defineSetter__('scaleX', function (value){ this.element.scaleX = value } );
		XElement.prototype.__defineGetter__('scaleX', function (){ return this.element.scaleX || 1 } );
	
		XElement.prototype.__defineSetter__('scaleY', function (value){ this.element.scaleY = value } );
		XElement.prototype.__defineGetter__('scaleY', function (){ return this.element.scaleY || 1 } );
	
		XElement.prototype.__defineSetter__('skewX', function (value){ this.element.skewX = value } );
		XElement.prototype.__defineGetter__('skewX', function (){ return this.element.skewX } );
	
		XElement.prototype.__defineSetter__('skewY', function (value){ this.element.skewY = value } );
		XElement.prototype.__defineGetter__('skewY', function (){ return this.element.skewY } );
	
		XElement.prototype.__defineSetter__('top', function (value){ this.element.top = value } );
		XElement.prototype.__defineGetter__('top', function (){ return this.element.top } );
	
		XElement.prototype.__defineSetter__('transformX', function (value){ this.element.transformX = value } );
		XElement.prototype.__defineGetter__('transformX', function (){ return this.element.transformX } );
	
		XElement.prototype.__defineSetter__('transformY', function (value){ this.element.transformY = value } );
		XElement.prototype.__defineGetter__('transformY', function (){ return this.element.transformY } );
	
		XElement.prototype.__defineSetter__('width', function (value){ this.element.width = value } );
		XElement.prototype.__defineGetter__('width', function (){ return this.element.width } );
	
		XElement.prototype.__defineSetter__('x', function (value){ this.element.x = value } );
		XElement.prototype.__defineGetter__('x', function (){ return this.element.x } );
	
		XElement.prototype.__defineSetter__('y', function (value){ this.element.y = value } );
		XElement.prototype.__defineGetter__('y', function (){ return this.element.y } );
	
		

xjsfl.classes.register('XElement', XElement);


