dot_distance = 2.5;
dot_diameter = 1.5;
dot_height = 0.8;

form_distance = 6;
line_height = 10;

plate_height = 0.4;

$fn = 20;

module form_base()
{
	cube([form_distance, line_height, plate_height]);
}

module dot(x, y)
{
	x_pos = (form_distance - dot_distance) / 2 + (x-1) * dot_distance;
	y_pos = (line_height - dot_distance*2) / 2 + (3-y) * dot_distance;
	translate([x_pos, y_pos, plate_height])
	scale([dot_diameter/2, dot_diameter/2, dot_height])
	render()
	difference()
	{
//		cylinder(r=1, h=2, center=true);
		sphere(r=1);
		translate([0, 0, -1.05])
		cube([2.5, 2.5, 2], center=true);
	}
}

module full()
{
	union()
	{
		//form_base();
		dot(1,1);
		dot(2,1);
		dot(1,2);
		dot(2,2);
		dot(1,3);
		dot(2,3);
	}
}

module char_a()
{
	union()
	{
		form_base();
		dot(1,1);
	}
}

module char_j()
{
	union()
	{
		form_base();
		dot(2,1);
		dot(1,2);
		dot(2,2);
	}
}

module char_n()
{
	union()
	{
		form_base();
		dot(1,1);
		dot(2,1);
		dot(2,2);
		dot(1,3);
	}
}

render()
union()
{
//	full();
	char_j();
	translate([form_distance, 0, 0])
	char_a();
	translate([form_distance*2, 0, 0])
	char_n();
}