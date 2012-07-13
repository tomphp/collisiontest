/*
// Include classes
$.getScript("vector.js");
$.getScript("matrix.js");
$.getScript("polygon.js");
$.getScript("display.js");
*/

function Engine(canvas)
{
	// GAME SPECIFIC FUNCTIONS : To be moved to subclass;
	this.gameInit = function()
	{
		// Transform everything witten to the world
		var centerx = Math.round(this.display.width / 2);
		var centery = Math.round(this.display.height / 2);
		this.display.transform.translate(centerx, centery);
		
		this.display.debug = true;
		
		this.ship = new Ship();
		this.ship.init(50, 100, 0.6*Math.PI, "#c90");
		
		this.lastFrame = this.lastUpdate;
		
		this.rock = new Array();
		for (var r = 0; r < 1; r++)
		{
			this.rock[r] = new Rock();
			this.rock[r].init(Math.floor(Math.random() * 400), Math.floor(Math.random() * 300), 0, "#a09");
		}
	}
	
	this.gameUpdate = function(timeScale)
	{
		this.display.text(10, 30, "Time Scale: "+timeScale, "#000");
	
		if (this.key[68]) {
			if (!this.dkeystate)
				this.display.debug = !this.display.debug;
			this.dkeystate = true;
		}
		else
		{
			this.dkeystate = false;
		}
		
		if (this.key[90]) this.display.transform.scale(0.99, 0.99);
		if (this.key[88]) this.display.transform.scale(1.01, 1.01);
	
	
		
		//if (this.key[37]) this.ship.turnLeft();
		//if (this.key[39]) this.ship.turnRight();
		if (this.key[32]) this.ship.fire();
		this.ship.update(timeScale, this.key[38], this.key[37], this.key[39]);

		var collided = false;
		for (var r in this.rock) {
			this.rock[r].update();
			if (!collided)
				collided = this.ship.collisionCheck(this.rock[r]);
		}
	}
	
	this.gameFrame = function()
	{
		var time = new Date().getTime();
		var frameRate = Math.round(1000 / (time - this.lastFrame));
		this.lastFrame = time;
		
		this.display.text(10, 10, "Frame rate: "+frameRate+" fps", "#fc0");
		
		this.display.drawPoint(new Vector(0, 0), "#090");
		
		var keys = "";
		for (i in this.key)
			if (this.key[i]) keys = keys+"Key: "+i+"="+this.key[i]+"  ";
		this.display.text(10, 20, keys, "#088");
		
		this.ship.draw(this.display);
		for (var r in this.rock) this.rock[r].draw(this.display);
	}
	
	// Real object methods
	
	this.init = function(canvas)
	{
		this.display = new Display();
		this.display.setCanvas(canvas);
		
		this.key = new Array();
		
		this.lastUpdate = new Date().getTime();
		
		this.gameInit();
	}
	
	this.init(canvas);

	this.update = function()
	{
		var time = new Date().getTime();
		var timeScale = (time - this.lastUpdate) / 12;
		this.lastUpdate = time;
		
		this.gameUpdate(timeScale);
	}
	
	this.frame = function(engine)
	{
		this.display.clear();
		this.gameFrame();
		this.display.render();
	}
	
	this.keydown = function(event)
	{
		this.key[event.keyCode] = true;
		event.preventDefault();
	}
	
	this.keyup = function(event)
	{
		this.key[event.keyCode] = false;
		event.preventDefault();
	}

	this.run = function()
	{
		var me = this;
		
		setInterval(function() { me.frame(me); }, 15);
		
		window.addEventListener("keydown", function(event) { me.keydown(event); }, false);
		window.addEventListener("keyup", function(event) { me.keyup(event); }, false);
		
		setInterval(function() { me.update(); }, 1);
	}

}
