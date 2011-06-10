

xjsfl.init(this);


var element = dom.selection[0];
element.skewX= 20;


alert(element.vx)



function Test(name)
{
	this.name = name;
}


var test = new Test('Dave');


test.age = 10;
					
alert([test.name, test.age]);