package com.xjsfl.text.fonts 
{
	import flash.text.Font;
	
	/**
	 * Reference Sans font, used in the Flash CS4 authoring interface
	 * @author Dave Stewart
	 */
	
	[Embed(source='../../../../../assets/fonts/REFSAN.TTF', fontName='MS Reference Sans Serif', unicodeRange='U+0020-U+007E')]  
	public class ReferenceSans extends Font
	{
		
		public static const instance:Font = new ReferenceSans();
		
		public static const name:String = 'MS Reference Sans Serif';
		
		// nothing here!
		// the metatag above does it all :)
	}

}