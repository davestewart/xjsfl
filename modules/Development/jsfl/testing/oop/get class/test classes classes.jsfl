fl.outputPanel.clear();

xjsfl.init(this);

for(var i in xjsfl.classes)
{
	fl.trace([i, xjsfl.classes[i], xjsfl.utils.getClass(xjsfl.classes[i])])
}