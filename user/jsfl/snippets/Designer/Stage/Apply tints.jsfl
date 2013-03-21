/**
 * Assign tints to selected objects
 * @icon {iconsURI}design/color/color_wheel.png
 */
(function()
{
	// --------------------------------------------------------------------------------
	// classes
	
		/**
		 * Class to save and restore selected objects' tints
		 * @param	{Element}	element		Any tintable elemnt
		 */
		function ColorMemento(element)
		{
			this.save(element);
		}
		
		ColorMemento.properties = ['colorRedAmount', 'colorGreenAmount', 'colorBlueAmount', 'colorAlphaPercent', 'colorRedPercent', 'colorGreenPercent', 'colorBluePercent', 'colorAlphaAmount'];
		
		ColorMemento.prototype =
		{
			// properties
				element:null,
				data:null,
	
			// methods
				save:function(element)
				{
					this.data			= {}
					this.element		= element;
					this.data.colorMode	= element.colorMode;
					for each(var prop in ColorMemento.properties)
					{
						this.data[prop] = element[prop];
					}
				},
				
				restore:function()
				{
					for each(var prop in ColorMemento.properties)
					{
						this.element[prop] = this.data[prop];
					}
					this.colorMode		= this.data.colorMode;
				},
			
				clear:function()
				{
					for each(var prop in ColorMemento.properties)
					{
						this.element[prop] = prop.indexOf('Percent') > -1 ? 255 : 100;
					}
					this.element.colorMode = 'none';
				}
		}
	
	// --------------------------------------------------------------------------------
	// functions
	
		function intToHex(value)
		{
			return Utils.pad(Math.floor(value).toString(16)).toUpperCase();
		}
	
		/**
		 * Summary
		 * @param	{SymbolInstance}	symbol		Description
		 * @param	{Number}	index		Description
		 * @param	{Array}		elements	Description
		 * @param	{Number}	color		Description
		 * @param	{Number}	variation	Description
		 */
		function tint(symbol, index, elements, percent, alpha)
		{
			// grab and convert color value
				var color					= colors[index % colors.length];
				var rgb						= color.toRGB();
				
			// assign tint
				symbol.colorMode			= 'advanced';
				
				symbol.colorRedAmount		= rgb.r * percent;
				symbol.colorGreenAmount		= rgb.g * percent;
				symbol.colorBlueAmount		= rgb.b * percent;
				
				symbol.colorRedPercent		= (1 - percent) * 100;
				symbol.colorGreenPercent	= (1 - percent) * 100;
				symbol.colorBluePercent		= (1 - percent) * 100;
				
				symbol.colorAlphaPercent	= alpha;
		}
		
		function reset()
		{
			for each(var memento in mementos)
			{
				memento.restore();
			}
			$dom.livePreview = true;
		}
		
		function clearTints()
		{
			for each(var memento in mementos)
			{
				memento.clear();
			}
			$dom.livePreview = true;
		}
		
	// --------------------------------------------------------------------------------
	// handlers
	
		/**
		 * Summary
		 * @param	{XULEvent}	event	Description
		 */
		function onApplyClick(event)
		{
			// control values
				var valueA		= event.xul.controls.colora.value;
				var valueB		= event.xul.controls.colorb.value;
				var steps		= event.xul.controls.steps.value;

				var amount		= event.xul.controls.amount.value;
				var alpha		= event.xul.controls.alpha.value;
				var operation	= event.xul.controls.operation.value;

				var randomize	= event.xul.controls.randomizeorder.value;
				var selected	= event.xul.controls.selectelements.value;

			// base color				
				var colorA		= new Hex(valueA);
				var colorB		= new Hex(valueB);

			// color values
				switch(operation)
				{
					case 'Gradient':
						colors	= colorA.range(colorB, steps, true);
					break;
				
					case 'Wheel':
						colors	= colorA.equal(steps, true);
					break;
				
					case 'Split':
						colors	= colorA.split(true, steps * 75);
					break;
				
					case 'Analogous':
						colors	= colorA.analogous(true);
					break;
				
					case 'Rectangle':
						colors	= colorA.rectangle(30, true);
					break;
				}
				
			// randomise colors
				if(randomize)
				{
					colors.sort( function(){ return (Math.random() * 2) - 1; } );
				}
				
			// select
				if(selected)
				{
					if($selection.length == 0)
					{
						$selection = selection;
					}
				}
				else
				{
					if($selection.length != 0)
					{
						$selection = [];
					}
				}
			 
			 // apply tint
				$(selection).reach(tint, [amount / 100, alpha]);
				$dom.livePreview = true;
		}
		
		/**
		 * Summary
		 * @param	{XULEvent}	event	Description
		 */
		function onRandomiseClick(event)
		{
			// controls
				var colorA		= event.xul.controls.colora;
				var colorB		= event.xul.controls.colorb;

			// values
				colorA.value	= '#' + Utils.pad(intToHex(Math.random() * 255 * 255 * 255));
				colorB.value	= '#' + Utils.pad(intToHex(Math.random() * 255 * 255 * 255));
				
			// update
				onApplyClick(event)
		}
		
		function onResetClick(event)
		{
			reset();
		}
		
		function onClearClick(event)
		{
			clearTints();
		}
		
	// --------------------------------------------------------------------------------
	// code
	
		xjsfl.init(this);
		
		if(selection = UI.selection)
		{
			// variables
				var colors;
				var length		= selection.length;
				var mementos	= [];
				
			// set up mementos so we can reset the elements after
				for each(var element in $selection)
				{
					mementos.push(new ColorMemento(element));
				}
				
			// UI
				var controls =
					<xml>
						color:Color A=FFFF00,
						color:Color B=FF0000,
						slider:Steps=[{length},0,{length}],
						slider:Amount=[100,0,100],
						slider:Alpha=[100,0,100],
						radio:Operation=[Wheel,Gradient,Split,Analogous,Rectangle],
						checkbox:Randomize Order,
						button:Apply,
						button:Randomize Colors,
						button:Reset,
						button:Clear,
						checkbox:Select Elements=true
					</xml>
				
				var xul = XUL
					.factory()
					.setTitle('Apply tints')
					.add(controls)
					.addEvent('apply', 'click', onApplyClick)
					.addEvent('randomizecolors', 'click', onRandomiseClick)
					.addEvent('reset', 'click', onResetClick)
					.addEvent('clear', 'click', onClearClick)
					.show();
					
				if( ! xul.values )
				{
					reset();
					$selection = selection;
				}
		}
	
})()
