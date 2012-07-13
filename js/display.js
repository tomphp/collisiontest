function Display()
{
	this.canvas;
	this.canvasCtx;
	this.buffer = false;
	this.bufferCtx;
	this.transform = new Matrix();

	/**
	 * Set the canvas that this object is to draw to
	 *
	 * @param HTMLCanvasElement canvas
	 */
	this.setCanvas = function(canvas)
	{
		this.canvas = canvas;

		if (!this.buffer)
		{
			this.buffer = document.createElement('canvas');
		}

		this.width = this.canvas.width;
		this.height = this.canvas.height;
		
		this.buffer.width = this.canvas.width;
		this.buffer.height = this.canvas.height;

		this.canvasCtx = this.canvas.getContext('2d');
		this.bufferCtx = this.buffer.getContext('2d');
	}

	/**
	 * Write some text on the canvas
	 *
	 * @param int x The horizontal position to write the text
	 * @param int y The vertical position to write the text
	 * @param string text The text to be written
	 * @param string c The color of the text to be written
	 */
	this.text = function(x, y, text, c)
	{
		this.bufferCtx.font = "8pt Verdana";
		this.bufferCtx.fillStyle = c;
		this.bufferCtx.fillText(text, x, y);
	}

	/**
	 * Draw a line from the start point to the end point.
	 *
	 * @param Vector start
	 * @param Vector end
	 * @param string c The color of the line
	 */
	this.drawLine = function(start, end, c)
	{
		
		start = start.getTransformed(this.transform);
		end = end.getTransformed(this.transform);
		
		this.bufferCtx.strokeStyle = c;
		this.bufferCtx.lineWidth = 1;

		this.bufferCtx.beginPath();
		this.bufferCtx.moveTo(start.x, start.y);
		this.bufferCtx.lineTo(end.x, end.y);
		this.bufferCtx.stroke();
	}
	
	this.drawArrow = function(start, end, c, m)
	{
		if (!m) m = new Matrix();
		
		start = start.copy();
		start.transform(m);
		start.transform(this.transform);
		end = end.copy();
		end.transform(m);
		end.transform(this.transform);
		
		this.bufferCtx.strokeStyle = c;
		this.bufferCtx.lineWidth = 1;

		this.bufferCtx.beginPath();
		this.bufferCtx.moveTo(start.x, start.y);
		this.bufferCtx.lineTo(end.x, end.y);
		
		this.bufferCtx.stroke();
	}
	
	/**
	 * 
	 */
	this.drawPoint = function(p, c)
	{
		p = p.getTransformed(this.transform);

		this.bufferCtx.strokeStyle = c;
		this.bufferCtx.lineWidth = 4;

		this.bufferCtx.beginPath();
		this.bufferCtx.moveTo(p.x, p.y-2);
		this.bufferCtx.lineTo(p.x, p.y+2);
		this.bufferCtx.stroke();
	}

	/**
	 * Draw the given polygon object
	 *
	 * @param polygon Polygon
	 */
	this.drawPolygon = function(polygon)
	{
		var tp = polygon.getTransformed();
		
		if (this.debug)
		{
			if (tp.normals.length)
				for (var n=0; n<tp.normals.length; n++)
				{
					var origin = new Vector(0,0);
					var normal = polygon.normals[n];
					
					var matrix = new Matrix();
					matrix.setTranslate(tp.points[n].x, tp.points[n].y);
					origin.transform(matrix).transform(this.transform);
					normal.transform(matrix).transform(this.transform);
					
					this.bufferCtx.strokeStyle = "#0ff";
					this.bufferCtx.lineWidth = 2;
					this.bufferCtx.beginPath();
					this.bufferCtx.moveTo(origin.x, origin.y);
					this.bufferCtx.lineTo(normal.x, normal.y);
					this.bufferCtx.stroke();
				}
		}
			
		tp = tp.transformBy(this.transform);

		this.bufferCtx.strokeStyle = polygon.color;
		this.bufferCtx.lineWidth = 2;
		this.bufferCtx.beginPath();
		this.bufferCtx.moveTo(tp.points[0].x, tp.points[0].y);
		
		for (var v=0; v<tp.points.length; ++v)
		{
			this.bufferCtx.lineTo(tp.points[v].x, tp.points[v].y);
		}
		
		this.bufferCtx.lineTo(tp.points[0].x, tp.points[0].y);

		this.bufferCtx.stroke();

		if (this.debug)
			if (tp.minkowskiPoints.length)
				for (n in tp.minkowskiPoints)
				{
					this.drawLine(tp.minkowskiPoints[n][0], tp.minkowskiPoints[n][1], "#f00");
					this.drawPoint(tp.minkowskiPoints[n][2], "#00f");
					this.text(10, 60, "Distance: "+tp.bump, "#0cc");
					this.drawPoint(tp.bumpPoint, "#f0f");
					if (tp.bump <0)
						this.text(10, 70, "YOU HIT MY ROCK MOTHERF**KER!", "#f0f");
				}

	}
	
	/**
	 * Draw a box object, probably needs to be redone as it's not optimised and uses
	 * the polygon object.
	 */
	this.drawBox = function(box, color)
	{
		if (!this.debug) return;
		
		var poly = new Polygon();
		poly.color = color;
		poly.addPoint(box.a.x, box.a.y);
		poly.addPoint(box.b.x, box.a.y);
		poly.addPoint(box.b.x, box.b.y);
		poly.addPoint(box.a.x, box.b.y);
		poly.addPoint(box.a.x, box.a.y);
		
		this.drawPolygon(poly);
	}

	/**
	 * Clear the back buffer
	 */
	this.clear = function() {
		this.bufferCtx.clearRect(0, 0, this.buffer.width, this.buffer.height);
	}

	/**
	 * Flip the back buffer to the visible canvas
	 */
	this.render = function()
	{
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.canvasCtx.drawImage(this.buffer, 0, 0);
	}
}
