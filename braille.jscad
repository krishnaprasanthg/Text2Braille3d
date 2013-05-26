var parameters;
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
	var dimensions = [parameters.form_distance/2, parameters.line_height/2, parameters.plate_thickness/2];
	var offset = [parameters.form_distance/2, -parameters.line_height/2, parameters.plate_thickness/2];
	
	return CSG.cube({ center: offset, radius: dimensions });
}

function dot(x, y)
{
	var x_pos = (parameters.form_distance - parameters.dot_distance) / 2 + (x-1) * parameters.dot_distance;
	var y_pos = -(parameters.line_height - parameters.dot_distance*2) / 2 - (y-1) * parameters.dot_distance;
	
	var dot;
	
	if (parameters.dot_shape == 'sphere')
	{
		dot = CSG.sphere({ center: [0, 0, 0], radius: 1, resolution: parameters.resolution });
		var sub = CSG.cube({ center: [0, 0, 0], radius: [1.25, 1.25, 1] }).translate([0, 0, -1.05]);
		dot = dot.subtract(sub);
	}
	else if (parameters.dot_shape == 'cylinder')
	{
		dot = CSG.cylinder({ start: [0, 0, -0.05], end: [0, 0, 1], radius: 1, resolution: parameters.resolution });
	}
	else
	{
		throw new Error("Unknown dot shape '" + parameters.dot_shape + "'");
	}
	
	dot = dot.scale([parameters.dot_diameter/2, parameters.dot_diameter/2, parameters.dot_height]);
	dot = dot.translate([x_pos, y_pos, parameters.plate_thickness]);
	
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
		
		if (lineWidth > parameters.max_forms_width)
		{
			numLines++;
			lineWidth %= parameters.max_forms_width;
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
		
		var position = [parameters.form_distance * (lineWidth-1), parameters.line_height * -(numLines-1), 0];
		var theCharacter = characterByCode(charCode).translate(position);
		
		result = result.union(theCharacter);
	}
	
	result = result.translate([parameters.plate_margin, -parameters.plate_margin, 0]);
	
	var marginFactor = [(parameters.plate_margin*2)/parameters.form_distance, (parameters.plate_margin*2)/parameters.line_height];
	result = result.union(form_base().scale([textWidth + marginFactor[0], numLines + marginFactor[1], 1]));
	
	var dimensions = [textWidth*parameters.form_distance+parameters.plate_margin*2, numLines*parameters.line_height+parameters.plate_margin*2];
	result = result.translate([-dimensions[0]/2, dimensions[1]/2, 0]);
	
	return result;
}



function getParameterDefinitions()
{
	return [
	{ name: 'text', caption: 'Text', type: 'text', default: 'Hello World' },
	
	{ name: 'dot_shape', caption: 'Dot shape', type: 'choice', values: ['sphere', 'cylinder'], captions: ['Hemisphere', 'Cylinder'], default: 'sphere' },
	{ name: 'dot_distance', caption: 'Dot distance:', type: 'float', default: 2.5 },
	{ name: 'dot_diameter', caption: 'Dot diameter:', type: 'float', default: 1.5 },
	{ name: 'dot_height', caption: 'Dot height:', type: 'float', default: 0.8 },

	{ name: 'form_distance', caption: 'Form distance:', type: 'float', default: 6.0 },
	{ name: 'line_height', caption: 'Line height:', type: 'float', default: 10.0 },

	{ name: 'max_forms_width', caption: 'Max. forms per line:', type: 'int', default: 6 },
	{ name: 'plate_thickness', caption: 'Plate thickness:', type: 'float', default: 0.4 },
	{ name: 'plate_margin', caption: 'Plate margin:', type: 'float', default: 5.0 },

	{ name: 'resolution', caption: 'Resolution', type: 'int', default: 20 }
	
	];
}

function main(params)
{
	log("start");
	
	parameters = params;
	
	log("generating: " + parameters.text);
	
	var result = generate(parameters.text);	
	
	log("finish");
	
	return result;
}
