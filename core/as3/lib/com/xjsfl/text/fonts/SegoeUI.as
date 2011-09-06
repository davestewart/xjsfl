package com.xjsfl.text.fonts 
{
	import flash.text.Font;
	
	/**
	 * Segoe UI font, used in Windows 7
	 * @author Dave Stewart
	 */
	
	[Embed(source='../../../../../assets/fonts/segoeui.ttf', fontName='Segoe UI', unicodeRange='U+0020-U+007E')]  
	public class SegoeUI extends Font
	{
		
		public static const instance:Font = new SegoeUI();
		
		public static const name:String = 'Segoe UI';
		
		[Embed(source='../../../../../assets/fonts/segoeuil.ttf', fontName='Segoe UI Light', unicodeRange='U+0020-U+007E')]  
		public static const Light:Class;
		
		[Embed(source = '../../../../../assets/fonts/segoeui.ttf', fontName = 'Segoe UI Normal', unicodeRange = 'U+0020-U+007E')]  
		public static const Normal:Class;
		
		[Embed(source='../../../../../assets/fonts/segoeuii.ttf', fontName='Segoe UI Italic', unicodeRange='U+0020-U+007E')]  
		public static const Italic:Class;
		
		[Embed(source='../../../../../assets/fonts/seguisb.ttf', fontName='Segoe UI Semi Bold', unicodeRange='U+0020-U+007E')]  
		public static const SemiBold:Class;
		
		[Embed(source='../../../../../assets/fonts/segoeuib.ttf', fontName='Segoe UI Bold', unicodeRange='U+0020-U+007E')]  
		public static const Bold:Class;
		
		[Embed(source='../../../../../assets/fonts/segoeuiz.ttf', fontName='Segoe UI Bold Italic', unicodeRange='U+0020-U+007E')]  
		public static const BoldItalic:Class;
		
	}

}