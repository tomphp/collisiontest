function Ship()
{
	this.init = function(x, y, rotation, color)
	{
		this.position = new Vector(x, y);
		this.rotation = rotation;
		this.force = new Vector(0, 0);
		
		this.polygon = new Polygon();
		this.polygon.color = color;
		
		this.polygon.addPoint(0, -35);
		
		//this.polygon.addPoint(10, -20);
		this.polygon.addPoint(20, -10);
		this.polygon.addPoint(20, 10);
		this.polygon.addPoint(10, 15);
		
		this.polygon.addPoint(0, 15);
		
		this.polygon.addPoint(-10, 15);
		this.polygon.addPoint(-20, 10);
		this.polygon.addPoint(-20, -10);
		//this.polygon.addPoint(-10, -20);
		
		this.polygon.calculateNormals();
		
		this.aabb = new Box().bounds(this.polygon.points);
		
		this.bullets = new Array();
	}
	
	/*
	this.turnLeft = function()
	{
		this.rotation -= 0.1;
	}
	
	this.turnRight = function()
	{
		this.rotation += 0.1;
	}
	*/
	
	this.fire = function()
	{
		var now = new Date().getTime();
		if ((now - this.lastFired) < 40) return;
		this.lastFired = now;
		this.bullets.push(new Projectile(this.rotation, this.position, 800, 600));
	}
	
	this.update = function(timeScale, moving, turnleft, turnright)
	{
		if (moving){
			var jet = new Vector(0, -0.2);
			jet.scale(timeScale);
			var m = new Matrix();
			m.rotate(this.rotation);
			jet.transform(m);
			
			this.force.add(jet);
		}
		
		if (turnleft) this.rotation -= 0.1 * timeScale;
		if (turnright) this.rotation += 0.1 * timeScale;
		
		if (this.force.length() > 2.5) {
			this.force.normalize();
			this.force.scale(2.5);
		}
		
		// Fix this to work with time scale
		this.force.scale(0.98);
		
		var force = this.force.copy().scale(timeScale);
		
		this.position.add(force);
		
		for (i in this.bullets) this.bullets[i].update(timeScale);
	
		var polygon = this.getTransformedPolygon();		
		this.aabb.bounds(polygon.points);
	}
	
	this.collisionCheck = function(thing)
	{
		if (this.aabb.collision(thing.aabb)) {
			this.collision = true;
		}
		else {
			this.collision = false;
		}
		
		this.polygon.minkowski(thing.polygon);
		if (this.polygon.bump < 0) this.position.add(this.polygon.bumpPoint);
		
		for (i in this.bullets)
		{
			if (this.bullets[i].active) this.bullets[i].collisionCheck(thing);
		}
		
		return this.collision;
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
		
		var color = "#ccc";
		if (this.collision) color = '#f00';
		display.drawBox(this.aabb, color);
		
		for (i in this.bullets) {
			if (this.bullets[i].active)
				this.bullets[i].draw(display);
			else
				this.bullets.splice(i,1);
		}
		
		display.text(10, 40, "Bullets: "+this.bullets.length, "#0c0");
	}
}
