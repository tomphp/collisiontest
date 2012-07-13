function Polygon()
{
	this.points = new Array();
	this.normals = new Array();
	this.color = '#000';
	this.transform = new Matrix();
	
	this.minkowskiPoints = new Array();

	/**
	 * Add a point to the polygon
	 *
	 * @param int x
	 * @param int y
	 */
	this.addPoint = function(x, y)
	{
		this.points.push(new Vector(x, y));
	}
	
	this.calculateNormals = function()
	{
		var numPoints = this.points.length;
		
		this.normals = new Array();
		
		for (var i=0; i<numPoints; i++)
		{
			var v = this.points[i].copy();
			v.subtract(this.points[(i+1)%numPoints]);
			this.normals[i] = v.perpendicular();
		}
	}
	
	this.copy = function()
	{
		var p = new Polygon();
		// Method to copy an array
		for (i in this.points)
			p.points.push(this.points[i].copy());
		for (i in this.normals)
			p.normals.push(this.normals[i].copy());
		p.color = this.color;
		p.minkowskiPoints = this.minkowskiPoints;
		p.bump = this.bump;
		p.bumpPoint = this.bumpPoint;
		return p;
	}
	
	this.transformBy = function(matrix)
	{
		var poly = this.copy();
		for (i in poly.points)
			poly.points[i].transform(matrix);
			
		var rotate = this.transform.copy();
		rotate.setPosition(0, 0);
		
		for (i in poly.normals)
			poly.normals[i].transform(rotate);
			
		return poly;
	}
	
	this.getTransformed = function()
	{
		var poly = this.copy();
		for (i in poly.points)
			poly.points[i].transform(this.transform);
			
		var rotate = this.transform.copy();
		rotate.setPosition(0, 0);
		
		for (i in poly.normals)
			poly.normals[i].transform(rotate);
			
		return poly;
	}

	this.getSupportVertices = function(direction)
	{
		var support = new Array();

		var v = this.transform.rotateIntoSpaceOf(direction); // <- this is gonna be the bitch
		
		var closest = -1;
		var secondClosest = -1;
		var closestD = -999999;
		var secondClosestD = -999999;
		
		for (var i=0; i<this.points.length; i++)
		{
			var d = v.dot(this.points[i]);
			
			if (d > closestD)
			{
				closestD = d;
				closest = i;
				
				secondClosest = -1;
				secondClosestD = -999999;
			}
			else if (d == closestD)
			{
				secondClosest = i;
				secondClosestD = d;
			}
		}
		
		support.push(new SupportVertex(this.points[closest].getTransformed(this.transform), closest));
		if (secondClosest!=-1) {
			support.push(new SupportVertex(this.points[closest].getTransformed(this.transform), closest));
		}
		
		return support;
	}

	this.minkowski = function(polyB)
	{
		var ma = this.transform;
		var polyA = this.copy();
		polyA.transform = ma;
		
		var polyAT = polyA.getTransformed();
		
		var mb = polyB.transform;
		var polyB = polyB.copy();
		polyB.transform = mb;
		
		var polyBT = polyB.getTransformed();
		
		var p0;
		var p1;
		var n0;
		var n1;
		var leastPenetratingDistance = -999999;
		var leastPositiveDistance = 999999;
		
		this.minkowskiPoints = new Array();
		
		var numPoints = polyAT.points.length;
		var origin = new Vector(0, 0);
		var point;
		var faceDist;
		var distance;
		
		for (var i=0; i<numPoints; i++)
		{
			var wsN = polyAT.normals[i]; // World space normal
			
			var wsV0 = polyAT.points[i]; // One end of the edge
			var wsV1 = polyAT.points[(i+1)%numPoints]; // The other end
			
			var s = polyB.getSupportVertices(wsN.negative());
			
			for (var j=0; j<s.length; j++)
			{
				var mfp0 = s[j].vertex.copy().subtract(wsV0);
				var mfp1 = s[j].vertex.copy().subtract(wsV1);
				
				faceDist = mfp0.dot(wsN);
				
				point = this.projectPointOnEdge(origin, mfp0, mfp1);
				
				if (faceDist >= 0)
					distance = point.length();
				else
					distance = -point.length();
				// track negative
				if ( distance>leastPenetratingDistance )
				{
					p0 = point;
					n0 = wsN;
					leastPenetratingDistance = distance;
				}
				// track positive
				if ( distance > 0 && distance<leastPositiveDistance )
				{
					p1 = point;
					n1 = point.copy().normalize();
					leastPositiveDistance = distance;
				}
				
				this.minkowskiPoints.push(new Array(mfp0, mfp1, point));
			}
		}
		
		numPoints = polyBT.points.length;
		
		for (var i=0; i<numPoints; i++)
		{
			var wsN = polyBT.normals[i]; // World space normal
			
			var wsV0 = polyBT.points[i]; // One end of the edge
			var wsV1 = polyBT.points[(i+1)%numPoints]; // The other end
			
			var s = polyA.getSupportVertices(wsN.negative());
			
			for (var j=0; j<s.length; j++)
			{
				var mfp0 = wsV0.copy().subtract(s[j].vertex);
				var mfp1 = wsV1.copy().subtract(s[j].vertex);
				
				// Why minus, I guess to do with the perspective of the object
				faceDist = -mfp0.dot(wsN);
				
				point = this.projectPointOnEdge(origin, mfp0, mfp1);
				
				
				// NEED TO FULL UNDERSTAND THIS SHIT
				if (faceDist >= 0)
					distance = point.length();
				else
					distance = -point.length();
					
				// track negative
				if ( distance>leastPenetratingDistance )
				{
					p0 = point;
					n0 = wsN;
					leastPenetratingDistance = distance;
				}
				// track positive
				if ( distance > 0 && distance<leastPositiveDistance )
				{
					p1 = point;
					n1 = point.copy().normalize();
					leastPositiveDistance = distance;
				}
				// DOWN TO HERE
				
				this.minkowskiPoints.push(new Array(mfp0, mfp1, point));
			}
		}
		
		
		
		if ( leastPenetratingDistance<0 )
		{
			// penetration
			this.bump = leastPenetratingDistance;
			this.bumpPoint = p0;
			//parent.DrawPoint( p0.Add( screenCentre ), 0x0000ff );
			//parent.DrawLine( 0x0000ff, p0.Add( screenCentre ), p0.Add( screenCentre ).Add(n0.MulScalar(40)) );
		}
		else 
		{
			this.bump = leastPenetratingDistance;
			this.bumpPoint = p1;
			// separation
			//parent.DrawPoint( p1.Add( screenCentre ), 0x0000ff );
			//parent.DrawLine( 0x0000ff, p1.Add( screenCentre ), p1.Add( screenCentre ).Add(n1.MulScalar(40)) );
		}
	}
	
	this.projectPointOnEdge = function (p, e0, e1)
	{
		var v = p.copy().subtract(e0);
		var e = e1.copy().subtract(e0);
		
		var t = e.dot(v) / e.dot(e);
		
		//  Clamp(a, min, max) = Math.min( Math.max(a, min), max );
		t = Math.min(Math.max(t, 0), 1);
		
		return e0.copy().add(e.scale(t));
	}
}

function SupportVertex(vertex, index)
{
	this.index = index;
	this.vertex = vertex;
}
