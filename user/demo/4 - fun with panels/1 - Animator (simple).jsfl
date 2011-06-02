//xjsfl.init(this);

xjsfl.classes.restore('Output', this);

Animator = function (scope) {
	
	this.dom		= fl.getDocumentDOM();
	this.frame		= this.dom.getTimeline().layers[0].frames[0];
	this.elements	= this.frame.elements;
	
	//fl.trace([this, scope, this.dom])
}

Animator.prototype =
{
	dom:		null,
	frame:		null,
	elements:	[],
	
	onEnterFrame:function()
	{
		for (var i = 0; i < this.elements.length; i++)
		{
			this.animateElement(this.elements[i], 15);
			this.dom.livePreview = true;
		}
	},
	
	animateElement:function (element, rotation)
	{
		element.rotation += element.x / 20;
	}
		
}

animator = FLBridge.animator = new Animator(this);