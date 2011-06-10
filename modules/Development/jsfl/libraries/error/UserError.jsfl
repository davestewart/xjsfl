

UserError = function(message)
{
	prototype(message);
}

UserError.prototype = new Error


try
{
	throw new UserError('Ooops!')
}
catch(err)
{
	fl.trace(err)
}


