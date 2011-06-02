var dom		= fl.getDocumentDOM();
var width	= dom.width;
var height	= dom.height;

function getLibraryItem(path)
{
	var index = dom.library.findItemIndex(path);
	return dom.library.items[index]; 
}

function Ball()
{
	// variables
		var item		= getLibraryItem('ball');
		var dom			= fl.getDocumentDOM();
		
	//properties
		dom.addItem({x:Math.random() * width, y:Math.random() * height}, item);
		this.element	= dom.selection[0];
		this.vx			= 0;
		this.vy			= 0;
		this.mass		= 0;
	
	// assign values
		var ball		= this.element;		
		ball.vx			= Math.random() * 10 - 5;
		ball.vy			= Math.random() * 10 - 5;
		ball.scaleX 	= ball.scaleY = Math.random() * 1.5 + 0.5;
		ball.mass		= ball.scaleY;
}

Ball.prototype = {}

Ball.prototype.__defineSetter__('x', function (value){ this.element.x = value } );
Ball.prototype.__defineSetter__('y', function (value){ this.element.y = value } );

Ball.prototype.__defineGetter__('x', function (){ return this.element.x } );
Ball.prototype.__defineGetter__('y', function (){ return this.element.y } );
		
Ball.prototype.__defineSetter__('vx', function (value){ this.element.setPersistentData('vx', 'double', value) } );
Ball.prototype.__defineSetter__('vy', function (value){ this.element.setPersistentData('vy', 'double', value) } );

Ball.prototype.__defineGetter__('vx', function (){ return this.element.getPersistentData('vx') } );
Ball.prototype.__defineGetter__('vx', function (){ return this.element.getPersistentData('vy') } );

Ball.prototype.__defineSetter__('mass', function (value){ this.element.setPersistentData('mass', 'double', value) } );
Ball.prototype.__defineGetter__('mass', function (){ return this.element.getPersistentData('mass') } );

Ball.prototype.__defineGetter__('width', function (){ return this.element.width } );

