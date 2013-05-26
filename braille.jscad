var dot_distance = 2.5;
var dot_diameter = 1.5;
var dot_height = 0.8;

var form_distance = 6;
var line_height = 10;
var max_forms_width = 6;

var plate_height = 0.4;
var plate_margin = 5;

var resolution = 20;

var characters =
{
	" " : 0,
	"a" : 1,
	"b" : 12,
	"c" : 14,
	"d" : 145,
	"e" : 15,
	"f" : 124,
	"g" : 1245,
	"h" : 125,
	"i" : 24,
	"j" : 245,
	"k" : 13,
	"l" : 123,
	"m" : 134,
	"n" : 1345,
	"o" : 135,
	"p" : 1234,
	"q" : 12345,
	"r" : 1235,
	"s" : 234,
	"t" : 2345,
	"u" : 136,
	"v" : 1236,
	"w" : 2456,
	"x" : 1346,
	"y" : 13456,
	"z" : 1356,
	"?" : 26
};

function log(text)
{
	if (OpenJsCad.log)
		OpenJsCad.log(text);
}

function form_base()
{
	var dimensions = [form_distance/2, line_height/2, plate_height/2];
	var offset = [form_distance/2, -line_height/2, plate_height/2];
	
	return CSG.cube({ center: offset, radius: dimensions });
}

function dot(x, y)
{
	var x_pos = (form_distance - dot_distance) / 2 + (x-1) * dot_distance;
	var y_pos = -(line_height - dot_distance*2) / 2 - (y-1) * dot_distance;
	
	var dot = CSG.sphere({ center: [0, 0, 0], radius: 1, resolution: resolution });
	var sub = CSG.cube({ center: [0, 0, 0], radius: [1.25, 1.25, 1] }).translate([0, 0, -1.05]);
	dot = dot.subtract(sub);
	dot = dot.scale([dot_diameter/2, dot_diameter/2, dot_height]);
	dot = dot.translate([x_pos, y_pos, plate_height]);
	
	return dot;
}

function characterByCode(charCode)
{
	var dotArray = new Array();
	
	while (charCode > 0)
	{
		var dotCode = (charCode % 10) - 1;
		charCode = Math.floor(charCode / 10);
		if (dotCode < 0)
			continue;
		
		dotArray.unshift([dotCode < 3 ? 1 : 2, (dotCode % 3) + 1]);
	}
	
	return characterByDots(dotArray);
}

function characterByDots(dots)
{
	var theCharacter = new CSG();//form_base();
	
	for (var i=0; i < dots.length; i++)
	{
		theCharacter = theCharacter.union(dot(dots[i][0], dots[i][1]));
	}
	
	return theCharacter;
}


function generate(text)
{
	var result = new CSG();
	if (text.length == 0)
		return result;
	
	var numLines = 1;
	var textWidth = 0;
	var lineWidth = 0;
	
	//TODO: add $ and lowercase character instead
	text = text.toLowerCase();
	
	for (var c=0; c < text.length; c++)
	{
		var newCharacter = text.charAt(c);
		
		lineWidth++;
		
		if (lineWidth > max_forms_width)
		{
			numLines++;
			lineWidth %= max_forms_width;
		}
		
		log(newCharacter);
		var charCode = characters[newCharacter];
		
		if (typeof charCode == "undefined")
		{
			log("invalid character: " + newCharacter);
			charCode = characters["?"];
		}
		
		if (charCode > 0)
			textWidth = Math.max(textWidth, lineWidth);
		
		var position = [form_distance * (lineWidth-1), line_height * -(numLines-1), 0];
		var theCharacter = characterByCode(charCode).translate(position);
		
		result = result.union(theCharacter);
	}
	
	result = result.translate([plate_margin, -plate_margin, 0]);
	
	var marginFactor = [(plate_margin*2)/form_distance, (plate_margin*2)/line_height];
	result = result.union(form_base().scale([textWidth + marginFactor[0], numLines + marginFactor[1], 1]));
	
	var dimensions = [textWidth*form_distance+plate_margin*2, numLines*line_height+plate_margin*2];
	result = result.translate([-dimensions[0]/2, dimensions[1]/2, 0]);
	
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

	log("start");
	
	log("generating: " + params.text);
	
	var result = generate(params.text);
	
	
	log("finish");
	
	return result;
}
