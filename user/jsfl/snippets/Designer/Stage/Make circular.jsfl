/**
 * Re-arrange elements in a circular formation
 * @icon	{iconsURI}ui/icon/icon_update.png
 */
(function()
{
	
	// --------------------------------------------------------------------------------
	// functions
	
		function makeCircular(element, index, elements, radius, scale, position)
		{
			radius = radius || 100;
		
			var angle = 360 * (index / elements.length);
			var radians = angle * (Math.PI / 180) + Math.PI;
		
			var x = Math.cos(radians) * radius;
			var y = Math.sin(radians) * radius;
		
			if(scale)
			{
				element.rotation = 0;
				element.scaleX = Math.PI * (radius * 2) / element.width / elements.length;
			}
		
			element.x = x;
			element.y = y;
			element.rotation = angle - 90;
			
			if(position)
			{
				element.x += position.x;
				element.y += position.y;
			}
		}
		
		function onClick(event)
		{
			var collection	= $(':selected');
			var position	= new Bounds(collection.elements).center;
			var radius		= this.controls.radius.value;
			var scale		= this.controls.scale.value;
			
			collection.each(makeCircular, [radius, scale, position]);
		}

	// --------------------------------------------------------------------------------
	// code
	
		xjsfl.init(this);
		if(UI.selection)
		{
			XUL
				.factory('title:Make selected elements circular')
				.setColumns([70, 110])
				.addSlider('Radius', 'radius', [100,0, 300])
				.addCheckbox('Scale elements', 'scale')
				.addButton('Apply', 'apply')
				.addEvent('apply', 'click', onClick)
				.show();
		}
	
})()