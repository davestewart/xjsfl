(function(scope)
{
	// set up environment
		var dom			= fl.getDocumentDOM();
		var frame		= dom.getTimeline().layers[0].frames[0];
		var elements	= frame.elements;
		
	// main animation function
		this.onEnterFrame = function()
		{
			for (var i = 0; i < elements.length; i++)
			{
				animateElement(elements[i], 15);
				dom.livePreview = true;
			}
		}
		
	// utility function
		function animateElement(element, rotation)
		{
			element.rotation += element.x / 20;
			element.scaleX = element.y / 200;
			element.scaleY = element.y / 200;
		}
	
		
	// set this element as the new animator
		FLBridge.animator = this;
	
})(this);
