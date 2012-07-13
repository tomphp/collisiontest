function Projectile(angle, position, width, height)
{
	this.position = new Vector(0, -35);
	this.force = new Vector(0, -6);
	this.rotation = angle;
	
	this.active = true;

	this.width = width;
	this.height = height;
	
	var m = new Matrix();
	m.rotate(angle);
	
	this.force.transform(m);
	
	m.translate(position.x, position.y);
	
	this.position.transform(m);
	
	this.polygon = new Polygon();
	this.polygon.color = "#f00";
	this.polygon.addPoint(-5, 5);
	this.polygon.addPoint(0, 0);
	this.polygon.addPoint(5, 5);
	this.polygon.calculateNormals();
	this.polygon.transform = m;
	
	this.getTransformedPolygon = function()
	{
		this.polygon.transform.init()
							  .rotate(this.rotation)
							  .translate(this.position.x, this.position.y);
							  
							  
		var polygon = this.polygon.getTransformed();
		
		return polygon;
	}

	this.update = function(timeScale)
	{
		var force = this.force.copy();
		force.scale(timeScale);
		this.position.add(force);
		
		if (this.position.x < 0 || this.position.y < 0
			|| this.position.x > this.width || this.position.y > this.height)
		{
			this.active = false;
		}
	}
	
	this.collisionCheck = function(thing)
	{
		/*if (this.aabb.collision(thing.aabb)) {
			this.collision = true;
		}
		else {
			this.collision = false;
		}*/
		
		this.polygon.minkowski(thing.polygon);
		if (this.polygon.bump < 0) {
			this.active = false;
			thing.position.x = Math.random() * 800;
			thing.position.y = Math.random() * 600;
		}
		
		//return this.collision;
	}
	
	this.draw = function(display)
	{
		display.drawPolygon(this.getTransformedPolygon());
	}
}
