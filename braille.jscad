var dot_distance = 2.5;
var dot_diameter = 1.5;
var dot_height = 0.8;

var form_distance = 6;
var line_height = 10;

var plate_height = 0.4;

var resolution = 20;

var characters = {
	" " : [],
	"a" : [[1,1]],
	"d" : [[1,1],[2,1],[2,2]],
	"e" : [[1,1],[2,2]],
	"h" : [[1,1],[1,2],[2,2]],
	"j" : [[2,1],[1,2],[2,2]],
	"l" : [[1,1],[1,2],[1,3]],
	"n" : [[1,1],[2,1],[2,2],[1,3]],
	"o" : [[1,1],[2,2],[1,3]],
	"r" : [[1,1],[1,2],[2,2],[1,3]],
	"w" : [[2,1],[1,2],[2,2],[2,3]]
};


function form_base()
{
	var dimensions = [form_distance/2, line_height/2, plate_height/2];
	return CSG.cube({ center: dimensions, radius: dimensions });
}

function dot(x, y)
{
	var x_pos = (form_distance - dot_distance) / 2 + (x-1) * dot_distance;
	var y_pos = (line_height - dot_distance*2) / 2 + (3-y) * dot_distance;
	
	var dot = CSG.sphere({ center: [0, 0, 0], radius: 1, resolution: resolution });
	var sub = CSG.cube({ center: [0, 0, 0], radius: [1.25, 1.25, 1] }).translate([0, 0, -1.05]);
	dot = dot.subtract(sub);
	dot = dot.scale([dot_diameter/2, dot_diameter/2, dot_height]);
	dot = dot.translate([x_pos, y_pos, plate_height]);
	
	return dot;
}

function character(dots)
{
	var theCharacter = new CSG();//form_base();
	
	OpenJsCad.log(dots + "-" + dots.length);
	
	for (var i=0; i < dots.length; i++)
	{
		theCharacter = theCharacter.union(dot(dots[i][0], dots[i][1]));
	}
	
	return theCharacter;
}


function generate(text)
{
	text = text.toLowerCase();
	
	var result = form_base().scale([text.length, 1, 1]);
	
	for (var c=0; c < text.length; c++)
	{
		OpenJsCad.log(text[c]);
		var actChar = character(characters[text.charAt(c)]);
		result = result.union(actChar.translate([form_distance*c, 0, 0]));
	}
	return result;
}





function getParameterDefinitions()
{
	return [
	{ name: 'text', caption: 'Text:', type: 'text', default: 'Hello World' }
	];
}

function main(params)
{

	if (OpenJsCad.log)
		OpenJsCad.log("start");
	
	OpenJsCad.log("generating: " + params.text);
	
	var result = generate(params.text);
	
	
	if (OpenJsCad.log)
		OpenJsCad.log("finish");
	
	return result;
}
