function circlePath(center, radius, resolution)
{
	points = new Array(resolution);
	for (var i=0; i<resolution; i++)
	{
		var t = i/resolution;
		var angle = Math.PI * 2 * t;
		var x = radius * Math.cos(angle) + center[0];
		var y = radius * Math.sin(angle) + center[1];
		
		points[i] = [x,y,0];
	}
	
	return CSG.Polygon.createFromPoints(points);
}

function rotateZ_extrude(obj2d, resolution)
{
	return obj2d.solidFromSlices({
		numslices: resolution,
		loop : true,
		callback: function(t, slice) {
			return this.rotateZ(360/resolution*slice);
		}
	});
}


function main()
{
	var resolution = 50; // increase to get smoother corners (will get slow!)
  
	var dot = CSG.sphere({ center: [0, 0, 0], radius: 1, resolution: resolution });
	var sub = CSG.cylinder({ start: [0, 0, -1.05], end: [0, 0, 0], radius: 1.5, resolution: resolution });
//	var sub = CSG.cube({ center: [0, 0, -0.5], radius: [2, 2, 0.5] });//.translate([0, 0, -1.05]);
	dot = dot.union(sub).translate([0, 0, 1]).scale([1, 1, 0.5]);
	
	var circle = circlePath([0, 0,], 0.5, resolution).rotateX(90).translate([1.5,0,0]);
	var extr = rotateZ_extrude(circle, resolution).translate([0, 0, 0.5]);
  
	var result = dot.subtract(extr);
	return result;
}