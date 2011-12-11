(function($)
{
	$.fn.reverse = [].reverse; // why isn't this in core?

	var attr = function(name)
	{
		return function() { return $(this).attr(name || ""); };
	};
	
	var num = function(fn)
	{
		return function()
		{
			var x = +fn.apply(this);
			return isNaN(x) ? Number.POSITIVE_INFINITY : x;
		};
	};

	var compare = function(a, b)
	{
		if (a > b) return 1;
		if (a < b) return -1;
		return 0;
	};
	
	var comparer = function(fn, desc)
	{
		var mult = desc ? -1 : 1;
		return function(a, b)
		{
			return mult * compare(fn.apply(a), fn.apply(b));
		}
	};
	
	var or = function(left, right)
	{
		return function() { return left.apply(null, arguments) || right.apply(null, arguments); };
	};
	
	$.fn.orderBy = function()
	{
		var expr = null;
		var args = arguments.length == 1 && $.isArray(arguments[0]) ? arguments[0] : arguments;
	
		for (var i = 0; i < args.length; i++)
		{
			var fn = args[i].key ? args[i].key : args[i];
			fn = typeof fn != "function" ? attr(fn) : fn;
			fn = comparer(args[i].num ? num(fn) : fn, args[i].desc);
			expr = expr ? or(expr, fn) : fn;
		}

		return this.sort(expr ? expr : comparer(function() {return $(this).text();}));
	};
	
	$.fn.shuffle = function()
	{
		return this.orderBy(function() {return Math.random();});
	};

})(jQuery);
