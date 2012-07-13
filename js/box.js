function Box()
{
	this.a = new Vector();
	this.b = new Vector();
	
	this.d = new Vector();
	
	this.transform = function(m)
	{
		this.a.transform(m);
		this.b.transform(m);
		
		return this;	
	}
	
	/**
	 * Given a list of Vectors this function sets this box to be the bounding box
	 * @param Array points
	 */
	this.bounds = function(points)
	{
		var min = new Vector();
		var max = new Vector();
		var first = true;
		
		for (i in points) {
			if (first) {
				min.x = points[i].x;
				min.y = points[i].y;
				max.x = points[i].x;
				max.y = points[i].y;
				first = false;
			}
			else {
				if (points[i].x < min.x) min.x = points[i].x;
				if (points[i].y < min.y) min.y = points[i].y;
				if (points[i].x > max.x) max.x = points[i].x;
				if (points[i].y > max.y) max.y = points[i].y;
			}
		}
		
		this.a = min;
		this.b = max;
		
		return this;
	}
	
	this.getHalfExtents = function()
	{
		var xlength = this.b.x - this.a.x;
		var ylength = this.b.y - this.a.y;
		
		var extents = new Vector();
		extents.x = Math.round(xlength / 2);
		extents.y = Math.round(ylength / 2);
		
		return extents;
	}
	
	this.getCenter = function()
	{
		var he = this.getHalfExtents();
		
		var center = this.a.copy();
		center.add(he).round();
		
		return center;
	}
	
	this.collision = function(box)
	{
		var myHe = this.getHalfExtents();
		var myCenter = this.getCenter();
		
		var boxHe = box.getHalfExtents();
		var boxCenter= box.getCenter();
		
		// D = |centreB-centreA| – (halfExtentsA+halfExtentsB)
		var d = boxCenter.subtract(myCenter).abs().subtract(myHe.add(boxHe));
		
		if (d.x < 0 && d.y < 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}
