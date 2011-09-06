package com.xjsfl.ui.controls
{
	import flash.display.Sprite;
	
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	import com.xjsfl.geom.Geom;
	import com.xjsfl.text.fonts.ReferenceSans;
	import com.xjsfl.ui.Component;
	
	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class Control extends Component
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// stage instances
				
			
			// properties
			
			
			// variables
			
			
			// static variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function Control()
			{
				
			}
			
			override protected function initialize():void
			{
				
			}
			
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			override public function draw():void
			{
				super.draw();
			}
			
			public function constrain(constraint:String):void
			{
				var constrainWidth	:Boolean;
				var constrainHeight	:Boolean;
				switch (constraint)
				{
					case Geom.WIDTH:
						constrainWidth	= true;
					break;
					
					case Geom.HEIGHT:
						constrainHeight	= true;
					break;
					
					case Geom.SIZE:
						constrainWidth	= true;
						constrainHeight	= true;
					break;
				}
				
				if (scaleX != 1 || scaleY != 1)
				{
				}
			}


		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
			
			/**
			 *
			 * @param	tf
			 * @param	size
			 * @param	color
			 * @param	font
			 * @return
			 */
			public function initializeText(tf:TextField = null, size:int = 11, color:Number = 0x000000, font:String = ReferenceSans.name):TextFormat
			{
				// text format
					var fmt:TextFormat		= new TextFormat(font, size, color);
					fmt.align				= TextFormatAlign.LEFT;
					fmt.color				= color;
					fmt.size				= size;
					
				// if a textfield is passed in, update it
					if (tf != null)
					{
						tf.autoSize				= TextFieldAutoSize.LEFT;
						tf.antiAliasType		= AntiAliasType.ADVANCED;
						tf.thickness			= -50;
						tf.sharpness			= 300;
						tf.embedFonts			= true;
						tf.selectable			= false;
						tf.textColor			= color;
						tf.defaultTextFormat	= fmt;
						tf.setTextFormat(fmt);
					}
					
				// return the textformat for us on other textfields
					return fmt;
			}
			

	}

}