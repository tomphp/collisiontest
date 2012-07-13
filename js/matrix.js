function Matrix()
{
	this.init = function()
	{
		this.data = [	[1, 0, 0],
						[0, 1, 0],
						[0, 0, 1] ];
		return this;
	}
	
	this.init();
	
	// Functions to setup the contents of the matrix
				
	this.setTranslate = function(x, y)
	{
		this.init();
		this.data[2][0] = x;
		this.data[2][1] = y;
		return this;
	}
	
	this.setScale = function(x, y)
	{
		this.init();
		this.data[0][0] = x;
		this.data[1][1] = y;
		return this;
	}
	
	this.setRotate = function(r)
	{
		this.init();
		this.data[0][0] =  Math.cos(r);
		this.data[0][1] =  Math.sin(r);
		this.data[1][0] =  -Math.sin(r);
		this.data[1][1] =  Math.cos(r);
		return this;
	}
	
	this.setPosition = function(x, y)
	{
		this.data[2][0] = x;
		this.data[2][1] = y;
		return this;
	}
	
	// Mathematical functions
	
	this.multiply = function(m)
	{
		var temp = new Array();
	
		for (x=0; x<3; ++x) {
			temp[x] = new Array();
			for (y=0; y<3; ++y) {
				sum = 0;
				for (z=0; z<3; ++z)
					sum += this.data[x][z] * m.data[z][y];
				temp[x][y] = sum;
			}
		}
		
		this.data = temp;
		
		return this;
	}
	
	/**
	 * Rotate a vector into the space described by this matrix
	 * 
	 * @param Vector v The vector to be rotated
	 * @return Vector The rotated vector
	 * @todo Understand this maths properly
	 */
	this.rotateIntoSpaceOf = function(v)
	{
		var row0 = new Vector(this.data[0][0], this.data[0][1]);
		var row1 = new Vector(this.data[1][0], this.data[1][1]);
		
		return new Vector(v.dot(row0), v.dot(row1));
	}
	
	// Duplicate the object
	
	this.copy = function()
	{
		var m = new Matrix();

		for (var x=0; x<3; x++)
			for (var y=0; y<3; y++)
				m.data[x][y] = this.data[x][y];
				
		return m;
	}
	
	// Functions to adjust the existing state of the object
	
	this.translate = function(x, y)
	{
		var m = new Matrix();
		m.setTranslate(x, y);
		this.multiply(m);
		return this;
	}
	
	this.scale = function(x, y)
	{
		var m = new Matrix();
		m.setScale(x, y);
		this.multiply(m);
		return this;
	}
	
	this.rotate = function(r)
	{
		var m = new Matrix();
		m.setRotate(r);
		this.multiply(m);
		return this;
	}
	
}