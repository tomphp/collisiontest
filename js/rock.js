function Rock()
{
	this.init = function(x, y, rotation, color)
	{
		this.position = new Vector(x, y);
		this.rotation = rotation;
		this.force = new Vector(0, 0);
		
		this.polygon = new Polygon();
		this.polygon.color = color;
		
		var eighth = Math.PI / 4;
		
		var m = new Matrix();
		
		var v = new Vector(30, 0);
		
		for (var i=0; i<8; i++)
		{
			this.polygon.addPoint(v.x, v.y);
			v.x = Math.random() * 5 + 20;
			v.y = 0;
			m.rotate(eighth);
			v.transform(m);
		}
		/*
		this.polygon.addPoint(0, -35);
		
		this.polygon.addPoint(20, -30);
		this.polygon.addPoint(26, -10);
		this.polygon.addPoint(20, 10);
		this.polygon.addPoint(10, 15);
		
		this.polygon.addPoint(10, 19);
		
		this.polygon.addPoint(-10, 15);
		this.polygon.addPoint(-20, 10);
		this.polygon.addPoint(-30, -10);
		this.polygon.addPoint(-13, -23);
		*/
		this.polygon.calculateNormals();
		
		this.aabb = new Box().bounds(this.polygon.points);
		
		this.bullets = new Array();
	}
	
	this.update = function()
	{		
		//this.position.add(force);
		this.rotation += 0.005;
		var polygon = this.getTransformedPolygon();
		this.aabb.bounds(polygon.points);
	}
	
	this.getTransformedPolygon = function()
	{
		this.polygon.transform.init()
							  .rotate(this.rotation)
							  .translate(this.position.x, this.position.y);
							  
							  
		var polygon = this.polygon.getTransformed();
		
		return polygon;
	}
	
	this.draw = function(display)
	{
		var polygon = this.getTransformedPolygon();
		
		display.drawPolygon(polygon);
		
		display.drawBox(this.aabb, "#ccc");
	}
}
