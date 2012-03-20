// -----------------------------------------------------------------------------------------------------------------------------------------
// Test code

	/**
	 * XUL
	 * @snippets	all
	 */
	
	// initialize
	
		xjsfl.init(this);
		clear();
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// XUL Creation

		/**
		 * A basic dialog, with basic validation
		 */
		function xulBasic()
		{
			var xul = new XUL('Basic dialog');
			xul
				.addTextbox('Prompt')
				.show();
		}
	
		/**
		 * XUL.factory() syntax
		 */
		function xulFactory()
		{
			XUL.factory()
				.setTitle('XUL.factory()')
				.addTextbox('Prompt')
				.show();
		}
		/**
		 * A basic dialog with an accept and cancel callback
		 */
		function xulCallback()
		{
			function accept(a, b)
			{
				trace('The product of the values is ' + a * b);
			}
			
			function cancel()
			{
				trace('We will never know the sum of those numbers!')
			}
			
			XUL.factory()
				.setTitle('Callbacks')
				.addSlider('Value 1', 'value1', Math.floor(Math.random() * 100))
				.addSlider('Value 2', 'value2', Math.floor(Math.random() * 100))
				.show(accept, cancel);
		}
	
	
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// XUL Shorthand

		/**
		 * Static create method using shorthand declaration
		 */
		function xulCreate()
		{
			function accept(a, b, c)
			{
				trace([a,b,c]);
			}
			
			XUL.create('One,Two,Three', accept);

		}
	
		/**
		 * Various shorthand examples
		 */
		function xulShorthand()
		{
			var declarations = <xml>
				<![CDATA[
					Name=Dave
					checkbox:Do something
					radiogroup:Options=[1,2,3,4]
					dropdown:Options={one:1,two:2,three:3,four:4}
					Value 1,Value 2,Value 3
					numeric:Size (pixels), numeric:Width (pixels), numeric:Alpha (%),title:Adjust object size
				]]>
			</xml>
			var expressions = declarations.toString().split(/[\r\n]+/);
			for each(var expression in expressions)
			{
				XUL.create(expression);
			}

		}
	
		/**
		 * Static create method with advanced shorthand declaration
		 */
		function xulShorthandAdvanced()
		{
			function accept(prompt, values, pick)
			{
				Output.inspect([prompt, values, pick])
			}
			
			XUL.factory('textbox:Prompt=I am  a default prompt,dropdown:Picker={One:1,Two:2,Three:3},title:Advanced shorthand declaration')
				.show(accept);
		}
	
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// XUL Controls

		/**
		 * Checkbox groups (values returned as an array)
		 */
		function xulCheckboxes()
		{
			var values = XUL.create('checkboxgroup:Items=[Movieclips,Graphics,Buttons,Classes],title:Checkbox Group');
			Output.inspect(values)
		}
		
		/**
		 * Inspect compound controls
		 */
		function xulCompound()
		{
			
			/**
			 * Click handler for button press
			 * @param	event	{XULEvent}
			 * @private
			 */
			function click(event)
			{
				trace('CLICK: ' + event)
				Output.inspect(event.xul.controls, 4, true, {'function':false, 'xml':false})
				/*
				trace(xul.controls.radio);
				trace(xul.controls.radio.value);
				trace(xul.controls.radio.getXML());
				*/
				//trace(xul.controls.radio.values);
				/*
				var values =
				{
					radio:		xul.controls.radio.values, 
					listbox:	xul.controls.listbox.values, 
					dropdown:	xul.controls.dropdown.values
				}
				Output.inspect(values)
				*/
			}
			
			var xul = XUL.factory()
				.setTitle('Compound control values')
				.addRadiogroup('Radio', null, [1,2,3])
				.addListbox('Listbox', null, [4,5,6])
				.addDropdown('Dropdown', null, [7,8,9])
				.addButton('See values', 'button', null, {click:click});
				
			var settings = xul.show();
			Output.inspect(xul.settings, 'Settings');
			
		}
		
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// XUL Features

		/**
		 * Automatic parsing of settings to correct datatypes
		 */
		function xulParsing()
		{
			var options = <text><![CDATA[
				title:This is a HUGE dialog!,
				button:Click me now!,
				checkbox:Delete,
				radiogroup:Pick=[1,2,3,4],
				checkboxgroup:Classes=[movieclip,graphic,button,font,video],
				colorchip:Color=0xABCDEF,
				file:Open file,
				save:Save file,
				label:This is a label,
				listbox:Values={one:1,two:2,three:3,four:4},
				menulist:More Values={one:One,two:Two,three:Three,four:Four},
				popupslider:Slider=[100,0,1000],
				targetlist:Instance,
				textbox:Text=Hello there I am text,
				property:test1,
				property:test2
				]]>
			</text>.toString()
			
			var values = XUL.create(options);
			Output.inspect(values, 'Automatic parsing of settings');
		}
		
		/**
		 * Ranges
		 */
		function xulRanges()
		{
			function color(r, g, b)
			{
				trace('#' + r.toString(16) + g.toString(16) + b.toString(16))
			}

			XUL.create('numeric:Red=[0,0,255], numeric:Green=[0,0,255], numeric:Blue=[0,0,255], title:Mixer', color)
		}
		
		/**
		 * File
		 */
		function xulFile()
		{
			var settings = XUL.create('file:Open file,save:Save file');
			Output.inspect(settings);
		}
		
		/**
		 * Smart parsing of labels as ids
		 */
		function xulLabels()
		{
			var values = XUL.create('numeric:Size (pixels), numeric:Width (pixels), numeric:Alpha (%),title:Something');
			Output.inspect(values);
		}

		/**
		 * Nested dialogs and capturing the return values
		 */
		function xulNested()
		{
			// global settings
				var settings = {};
				
			// event handler to make a new dialog
				function newDialog()
				{
					// create dialog
						var xul = XUL
							.factory('radiogroup:Options=[1,2,3],dropdown:Values=[One,Two,Three],checkbox:State,|,button:New dialog')
							.addEvent('newdialog', 'click', newDialog)
							.setTitle('Dialog ' + (xjsfl.ui.dialogs.length + 1))
							.show();
							
					// assign the values to the global settings object
						settings[xul.title]	= xul.values;
				}
				
			// create the first dialog
				newDialog();
				
			// view the results
				Output.inspect(settings);
		}

		/**
		 * Custom XML
		 */
		function xulCustomXML()
		{
			XUL
				.factory()
				.setTitle('Custom XML')
				.setXML(<xml><textbox width="300" value="I am a textbox" /> <button id="button" label="...and I am a mighty button!" width="300" /></xml>)
				.addEvent('button', 'click', function(){alert('But I can still have events assigned :)')})
				.show()
				
		}
	
		/**
		 * load XML source
		 */
		function xulLoadXML()
		{
			XUL
				.factory()
				.load('//core/ui/install.xul')
				//.setValues({name:'Dave', email:'dave@xjsfl.com'})
				.setValues(new Config('user').get('personal'))
				.show()
		}
		
		/**
		 * Set values
		 */
		function xulSetValues()
		{
			XUL
				.factory()
				.setTitle('Set Values')
				.add('name,email')
				.setValues({name:'Dave', email:'dave@xjsfl.com'})
				.show()
		}
	
		function xulSetValuesFromXML()
		{
			
		}
		
	// -----------------------------------------------------------------------------------------------------------------------------------------
	// XUL Events

		/**
		 * Events, callbacks, and OO control of UI elements
		 */
		function xulEvents()
		{
			// callback
				/**
				 * Event handler
				 * @param	event	{XULEvent}
				 * @private
				 */
				function onControlEvent(event)
				{
					// output
						clear();
						
					// inspect parameters
						trace(event);
						
					// if the id is the textbox, update the other textbox
						if(event.control.id == 'textbox1')
						{
							// Note that this is OO! : "event.control.value" NOT "fl.xmlui.set(id, value)"
							event.xul.controls.textbox2.value = event.control.value.split('').reverse().join('');
						}
						
						if(event.control.id == 'button')
						{
							Output.inspect(event.xul.events)
						}
				}
				
			// controls
				var options = <text><![CDATA[
					button:button=Click me!,
					colorchip:Color=0xABCDEF,
					listbox:Listbox={one:1,two:2,three:3,four:4},
					menulist:Menulist={one:1,two:2,three:3,four:4},
					popupslider:Slider=[100,0,1000],
					textbox:Textbox 1=Hello there I am text,
					textbox:Textbox 2,
					]]>
				</text>.toString()
				
			// create
				XUL
					.factory(options)
					.setTitle('Dialog with events')
					.addEvent('button', 'click', onControlEvent)
					.addEvent('listbox menulist', 'change setfocus', onControlEvent)
					.addEvent('color popupslider textbox1', 'change', onControlEvent)
					.show();
		}
		
		/**
		 * Initialization event
		 */
		function xulInitialized()
		{
			// callback
				function onInitialize(event)
				{
					event.xul.controls.text.value = 'Initialized!';
				}
				
			// create
				XUL
					.factory()
					.setTitle('Dialog with initilize event')
					.addTextbox('Text', 'text')
					.addEvent('initialize', onInitialize)
					.show();
		}
	
