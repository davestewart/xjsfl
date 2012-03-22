/**
 * Select items in the items in the library according to criteria you set
 * @icon {iconsURI}Design/select/select.png
 */
(function(){

	// setup
		xjsfl.init(this);
		
	// callback
		function accept(type)
		{
			items.attr('symbolType', type);
		}

	// grab items
		var items = $$(':selected');

	// if items, do it!
		//var settings = XUL.create('dropdown:Type=[movie clip, graphic,button],title:Change selected item types', accept)

})()