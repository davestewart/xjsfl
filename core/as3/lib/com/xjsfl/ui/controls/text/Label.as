package com.xjsfl.ui.controls.text 
{
	import com.xjsfl.geom.Geom;
	import com.xjsfl.ui.controls.Control;
	import flash.text.TextField;
	

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Label extends Control
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				public var tf			:TextField;
			
			// properties
				protected var _text		:String;
				protected var _align	:String;
				
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function Label(text:String = null) 
			{
				tf = new TextField();
				initializeText(tf);
				addChild(tf);
				if (text)
				{
					this.text = text;
				}
			}
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			public function get text():String { return _text; }
			public function set text(text:String):void
			{
				_text		= text;
				tf.text		= text;
			}
			
			public function get align():String { return _align; }
			public function set align(value:String):void 
			{
				_align = value;
				switch (value) 
				{
					case Geom.RIGHT:
						tf.x = -tf.width;
					break;
					
					case Geom.CENTER:
						tf.x = - tf.width / 2;
					break;
					
					case Geom.LEFT:
						tf.x = 0
					break;
				}
			}
			
			override public function get width():Number { return tf.width; }
			
			public function set border(state:Boolean):void 
			{
				tf.border = state;
			}

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			/*
			 	TODO
				
				Editable
					Add editable property.
					Turns tf to input field and adds double-click event handlers.
					Add edit() method
					
				Width
					Add width setter and getter which updates the textfield width, and how it aligns, i.e. the tf.x won't change once the width is set
				
			*/

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}