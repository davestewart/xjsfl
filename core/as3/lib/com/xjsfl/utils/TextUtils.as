package com.xjsfl.utils
{

	/**
	 * ...
	 * @author Dave Stewart
	 */
	public class TextUtils
	{
		public static function generate(minChars:int = 50, maxChars:int = 100, paragraphs:int = 1, html:Boolean = false):String
		{
			// variables
				var lorem:Array = "lorem ipsum dolor sit amet consectetur adipiscing elit donec sagittis velit nec lectus aliquam a blandit magna gravida proin augue ligula aliquam nec congue a dictum et nulla proin mollis feugiat blandit phasellus ullamcorper diam sed nisl tincidunt non scelerisque enim dignissim pellentesque luctus dolor et consectetur dignissim diam metus mollis mi id gravida urna velit at risus pellentesque ultrices sem at mi faucibus mattis praesent orci justo elementum non suscipit ut elementum vel lorem pellentesque sed ante in orci cursus pretium a ut nibh nam leo nisi ultrices id ultrices sit amet faucibus ut eros maecenas lacus mi congue ac semper a viverra vel enim in posuere risus sit amet eros viverra quis eleifend risus adipiscing sed tempus dui eget nulla rutrum posuere nam at orci ac turpis placerat pulvinar ut sit amet lorem sed rhoncus velit vitae nunc consectetur vestibulum quis id risus morbi tincidunt consectetur tincidunt nunc interdum eleifend commodo fusce purus erat vulputate et scelerisque vitae iaculis quis eros pellentesque lobortis eleifend porttitor cras sagittis arcu eu elit tempus a tempor orci adipiscing sed laoreet odio leo in hac habitasse platea dictumst in in augue justo in vestibulum augue mauris felis purus accumsan fermentum dapibus sit amet egestas vitae lectus proin eu malesuada odio pellentesque at sapien ac leo imperdiet fermentum morbi gravida mollis dignissim duis dignissim neque ac nunc blandit nec auctor elit consectetur nulla fringilla sodales sem in sodales maecenas sodales porttitor ligula tincidunt vulputate nulla id tincidunt felis vivamus vel urna at neque pretium auctor sed non leo justo ut suscipit odio maecenas elit est dignissim id tempus vel venenatis ac nisl in scelerisque risus eu felis faucibus convallis donec vestibulum ornare eros vitae varius quam suscipit quis aliquam ac lectus id purus luctus congue nec a risus pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas proin et risus at mauris tincidunt iaculis in id leo nulla sit amet arcu ante phasellus tristique tellus sed nibh commodo eget fringilla velit aliquet fusce sit amet tincidunt felis praesent vel cursus augue vestibulum egestas urna et sem aliquet feugiat aenean ac vehicula nisi etiam et tortor massa sed quam velit elementum sit amet eleifend eu tristique eget ligula nunc imperdiet erat nec augue vehicula rutrum cras quis ligula et sapien luctus aliquet vel et justo curabitur mollis est quis elementum ultricies diam dui ultricies risus ac scelerisque magna risus sed tellus sed erat ipsum tincidunt faucibus interdum quis bibendum eu nulla vestibulum feugiat tincidunt quam nec mollis nullam mauris mauris rutrum non auctor sit amet luctus ut libero phasellus convallis libero vel ante fringilla tincidunt ut blandit tellus vel elit hendrerit fermentum fusce varius ligula in lorem luctus ut aliquet lorem tincidunt proin at nulla ac magna porttitor tristique at quis mi vestibulum sollicitudin augue eu nibh aliquam posuere auctor orci hendrerit nullam ac ligula ut nisi adipiscing mollis nulla consequat viverra lectus praesent mauris odio fermentum ut consectetur eu bibendum nec justo proin ullamcorper nunc nec lacinia tincidunt dolor".split(/\W+/g);
				
			// functions

			
				function replace(a:String):String
				{
					return a.toUpperCase();
				}
				
				
			// generate
				var allText:String = '';
				for (var i:int = 0; i < paragraphs; i++) 
				{
					// parameters
						var text		:String		= '';
						var limit		:int		= minChars + (Math.random() * (maxChars - minChars));
						
					// generate
						while (text.length < limit)
						{
							text += lorem[Math.floor(Math.random() * lorem.length)];
							text += Math.random() > 0.9 ? '. ' : ' ';
						}
						
					// capitalize
						text = text.replace(/(^[a-z]|\.\s*[a-z])/g);//, replace
						
					// tidy up final full-stop
						text = text.replace(/[.\s]+$/, '.')
						
					// html
						if (html)
						{
							text = '<p>' + text + '</p>';
						}
						
					// newline
						if (i < paragraphs - 1)
						{
							text += '\n';
						}
						
					// add to main variable
						allText += text;
				}
				
			// return
				return allText;
		}
		
		

	}

}