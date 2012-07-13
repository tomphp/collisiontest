function Vector(inx, iny)
{
	this.x = inx;
	this.y = iny;
	
	this.copy = function()
	{
		return new Vector(this.x, this.y);
	}
	
	this.transform = function(matrix)
	{
		var x = (this.x * matrix.data[0][0] + this.y * matrix.data[1][0] + matrix.data[2][0]);
		var y = (this.x * matrix.data[0][1] + this.y * matrix.data[1][1] + matrix.data[2][1]);
		
		this.x = x;
		this.y = y;
		
		return this;
	}
	
	this.getTransformed = function(matrix)
	{
		var t = this.copy();
		return t.transform(matrix);
	}
	
	this.add = function(v)
	{
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	
	this.subtract = function(v)
	{
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	this.abs = function()
	{
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		return this;
	}
	
	this.round = function()
	{
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}
	
	this.scale = function(amount)
	{
		this.x *= amount;
		this.y *= amount;
		return this;
	}
	
	/**
	 * Calculate the magnitude of the vector.
	 * @return float
	 */
	this.length = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	
	this.normalize = function()
	{
		var length = this.length();
		if (length != 0)
		{
			this.x = this.x/length;
			this.y = this.y/length;
		}
	}
	
	this.dot = function(v)
	{
		return (this.x * v.x) + (this.y * v.y);
	}
	
	this.getAngle = function(v)
	{
		return Math.acos(this.dot(v));
	}

	this.project = function(axis)
	{
		var v = this.copy();
		var a = axis.copy();
		var d = v.dot(axis) / a.dot(axis);

		var axis = axis.copy();

		return axis.scale(d);
	}

	this.negative = function()
	{
		return new Vector(-this.x, -this.y);
	}

	this.perpendicular = function()
	{
		return new Vector(-this.y, this.x);
	}
	
	this.fromAngle = function(angle)
	{
		this.x = Math.cos(angle);
		this.y = Math.sin(angle);
	}
}
