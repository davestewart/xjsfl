package com.xjsfl.ui.utils 
{
	import com.xjsfl.fonts.ReferenceSans;
	import flash.text.Font;
	import flash.text.TextField;
	import flash.text.TextFormat;

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TextUtils
	{
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Variables
		
			// static contants
				public static const instance:TextUtils = new TextUtils();
		
			// stage instances
				
			
			// properties
				protected static var _font:Font
			
			// variables
				
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Instantiation
		
			public function TextUtils() 
			{
				_font = new ReferenceSans();
			}
			
			public function initialize() 
			{
				
			}
			
			public static function get font():Font { return _font; }
		
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Public Methods
		
			/**
			 *
			 * @param	tf
			 * @param	size
			 * @param	color
			 * @param	font
			 * @return
			 */
			public static function initializeText(tf:TextField = null, size:int = 11, color:Number = 0x000000, font:String = 'MS Reference Sans Serif'):TextFormat
			{
				// text format
					var format:TextFormat	= new TextFormat(font, size, color);
					format.align			= TextFormatAlign.LEFT;
					format.color			= color;
					format.size				= size;
					
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
						tf.defaultTextFormat	= format;
						tf.setTextFormat(format);
					}
					
				// return the textformat for us on other textfields
					return format;
			}
			
		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Accessors

			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Protected Methods
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Handlers
		
			

		// ---------------------------------------------------------------------------------------------------------------------
		// { region: Utilities
		
			

	}

}