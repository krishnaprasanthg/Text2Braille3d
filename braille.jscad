var parameters;
var master_dot = null;
var characters =
{
	"a" : 1,	//⠁
	"b" : 12,	//⠃
	"c" : 14,	//⠉
	"d" : 145,	//⠙
	"e" : 15,	//⠑
	"f" : 124,	//⠋
	"g" : 1245,	//⠛
	"h" : 125,	//⠓
	"i" : 24,	//⠊
	"j" : 245,	//⠚
	"k" : 13,	//⠅
	"l" : 123,	//⠇
	"m" : 134,	//⠍
	"n" : 1345,	//⠝
	"o" : 135,	//⠕
	"p" : 1234,	//⠏
	"q" : 12345,//⠟
	"r" : 1235,	//⠗
	"s" : 234,	//⠎
	"t" : 2345,	//⠞
	"u" : 136,	//⠥
	"v" : 1236,	//⠧
	"w" : 2456,	//⠺
	"x" : 1346,	//⠭
	"y" : 13456,//⠽
	"z" : 1356,	//⠵

	"ä" : 345,	//⠜
	"ö" : 246,	//⠪
	"ü" : 1256,	//⠳
	"ß" : 2346,	//⠮
	
	"st" : 23456,//⠾
	"au" : 16,	//⠡
	"eu" : 126,	//⠣
	"ei" : 146,	//⠩
	"ch" : 1456,//⠹
	"sch": 156,	//⠱
	"äu" : 34,	//⠌
	"ie" : 346,	//⠬
	
	"1" : 1,	//⠁
	"2" : 12,	//⠃
	"3" : 14,	//⠉
	"4" : 145,	//⠙
	"5" : 15,	//⠑
	"6" : 124,	//⠋
	"7" : 1245,	//⠛
	"8" : 125,	//⠓
	"9" : 24,	//⠊
	"0" : 245,	//⠚
	
	"1." : 2,	//⠂
	"2." : 23,	//⠆
	"3." : 25,	//⠒
	"4." : 256,	//⠲
	"5." : 26,	//⠢
	"6." : 235,	//⠖
	"7." : 2356,//⠶
	"8." : 236,	//⠦
	"9." : 35,	//⠔
	"0." : 356,	//⠴
	
	"&" : 12346,//⠯
	"%" : 123456,//⠿
	"[" : 12356,//⠷
	"]" : 23456,//⠾
	"`" : 1246,	//⠫
	"^" : 12456,//⠻
	"#" : 3456,	//⠼
	"$" : 46,	//⠨
	"." : 3,	//⠄
	"," : 2,	//⠂
	":" : 25,	//⠒
	";" : 23,	//⠆
	">" : 45,	//⠘
	"<" : 56,	//⠰
	"»" : 236,	//⠦
	"«" : 356,	//⠴
	"(" : 2356,	//⠶
	")" : 2356,	//⠶
	"=" : 2356,	//⠶
	"-" : 36,	//⠤
	"+" : 235,	//⠖
	"!" : 235,	//⠖
	"*" : 35,	//⠔
	"/" : 256,	//⠲
	"?" : 26,	//⠢
	"'" : 6,	//⠠
	'"' : 4,	//⠈
	"_" : 456,	//⠸
	"~" : 5,	//⠐
	"§" : 346,	//⠬
	" " : 0		//⠀
};

function log(text)
{
	if (OpenJsCad.log)
		OpenJsCad.log(text);
}

function form_base()
{
	var dimensions = [parameters.form_distance/2, parameters.line_height/2, parameters.plate_thickness/2];
	var offset = [parameters.form_distance/2, -parameters.line_height/2, -parameters.plate_thickness/2];
	
	return CSG.cube({ center: offset, radius: dimensions });
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

function ring(radius1, radius2, resolution)
{	
	points = new Array(resolution);
	for (var i=0; i<resolution; i++)
	{
		var t = i/resolution;
		var angle = Math.PI * 2 * t;
		var x = radius1 * Math.cos(angle);
		var z = radius1 * Math.sin(angle);
		points[i] = [x,0,z];
	}
	
	var circle = CSG.Polygon.createFromPoints(points).translate([radius2-radius1,0,0]);
	return rotateZ_extrude(circle, resolution);
}

function sized_dot()
{
	if (master_dot == null)
	{
		var dot;
		if (parameters.dot_shape == 'sphere')
		{
			dot = CSG.sphere({ center: [0, 0, 0], radius: 1, resolution: parameters.resolution });
			var sub = CSG.cube({ center: [0, 0, 0], radius: [1.25, 1.25, 1] }).translate([0, 0, -1.05]);
			dot = dot.subtract(sub);
		}
		else if (parameters.dot_shape == 'cylinder')
		{
			return CSG.cylinder({ start: [0, 0, -0.05], end: [0, 0, 1], radius: 1, resolution: parameters.resolution });
		}
		else if (parameters.dot_shape == 'smooth')
		{
			var dot = CSG.sphere({ center: [0, 0, 1], radius: 1, resolution: parameters.resolution });
			dot = dot.scale([1, 1, 0.5]);
		}
		else
		{
			throw new Error("Unknown dot shape '" + parameters.dot_shape + "'");
			return new CSG();
		}
		
		dot = dot.scale([parameters.dot_diameter/2, parameters.dot_diameter/2, parameters.dot_height]);
		
		//final touch of 'smooth' is best done after scaling
		if (parameters.dot_shape == 'smooth')
		{
			var ringRadius1 = parameters.dot_height / 2;
			var ringRadius2 = parameters.dot_diameter/2 + parameters.dot_height;
			
			var base = CSG.cylinder({ start: [0, 0, -0.05], end: [0, 0, ringRadius1], radius: ringRadius2-ringRadius1, resolution: parameters.resolution });
			var smoother = ring(ringRadius1, ringRadius2, parameters.resolution).translate([0, 0, ringRadius1]);
			dot = dot.union(base).subtract(smoother);
		}
		
		master_dot = dot;
	}
	return CSG.fromObject(master_dot);
}

function dot(x, y)
{
	var x_pos = (parameters.form_distance - parameters.dot_distance) / 2 + (x-1) * parameters.dot_distance;
	var y_pos = -(parameters.line_height - parameters.dot_distance*2) / 2 - (y-1) * parameters.dot_distance;
	
	var dot = sized_dot();
	dot = dot.translate([x_pos, y_pos, 0]);
	
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
	var theCharacter = new Array(dots.length);//form_base();
	
	for (var i=0; i < dots.length; i++)
	{
		theCharacter[i] = dot(dots[i][0], dots[i][1]);
	}
	
	return theCharacter;
}

function generate(text)
{
	if (!parameters.upper)
		text = text.toLowerCase();
	
	log("generating: " + text);
	
	var result = new CSG();
	if (text.length == 0)
		return result;
	
	var numLines = 1;
	var textWidth = 0;
	var lineWidth = 0;
	
	var theCharacters = new Array();
	
	var offset = new CSG.Vector3D(parameters.plate_margin, -parameters.plate_margin, 0);
	
	// var find = /([\p{Lu}])/g;
	// var replace = "$\L$1";
	var find = /([A-ZÄÖÜ])/g;
	var replace = "$$$1";
	text = text.replace(find, replace).toLowerCase();
	
	find = /([\d]+)/g;
	replace = "#$1";
	text = text.replace(find, replace);
	
	log("converting to: " + text);
	
	for (var c=0; c < text.length; c++)
	{
		var newCharacter = text.charAt(c);
		
		lineWidth++;
		
		if (lineWidth > parameters.max_forms_width)
		{
			numLines++;
			lineWidth %= parameters.max_forms_width;
		}
		
		var charCode = characters[newCharacter];
		
		if (typeof charCode == "undefined")
		{
			log("invalid character: " + newCharacter);
			charCode = characters["?"];
		}
		
		if (charCode > 0)
			textWidth = Math.max(textWidth, lineWidth);
		
		var characterDots = characterByCode(charCode)
		var position = offset.plus(new CSG.Vector3D(parameters.form_distance * (lineWidth-1), parameters.line_height * -(numLines-1), 0));
		for (var cp=0; cp < characterDots.length; cp++)
			characterDots[cp] = characterDots[cp].translate([position.x, position.y, position.z]);
		
		theCharacters = theCharacters.concat(characterDots);
		
		log(newCharacter);
	}
	
	var marginFactor = [(parameters.plate_margin*2)/parameters.form_distance, (parameters.plate_margin*2)/parameters.line_height];
	result = form_base().scale([textWidth + marginFactor[0], numLines + marginFactor[1], 1]);
	
	result = result.union(theCharacters);
	
	var dimensions = [textWidth*parameters.form_distance+parameters.plate_margin*2, numLines*parameters.line_height+parameters.plate_margin*2];
	result = result.translate([-dimensions[0]/2, dimensions[1], 0]).rotateX(90);
	
	return result;
}



function getParameterDefinitions()
{
	return [
	{ name: 'text', caption: 'Text', type: 'text', default: 'Hello World' },
	{ name: 'upper', caption: 'Großbuchstaben zulassen', type: 'bool', default: false },
	{ name: 'resolution', caption: 'Auflösung', type: 'int', default: 20 },
	
	{ name: 'dot_shape', caption: 'Punktform', type: 'choice', values: ['sphere', 'cylinder', 'smooth'], captions: ['Hemisphere', 'Cylinder', 'Smooth'], default: 'smooth' },
	{ name: 'dot_distance', caption: 'Punkt-Abstand:', type: 'float', default: 2.5 },
	{ name: 'dot_diameter', caption: 'Punkt-Durchmesser:', type: 'float', default: 1.5 },
	{ name: 'dot_height', caption: 'Punkt-Höhe:', type: 'float', default: 0.8 },

	{ name: 'form_distance', caption: 'Form-Abstand:', type: 'float', default: 6.0 },
	{ name: 'line_height', caption: 'Zeilen-Höhe:', type: 'float', default: 10.0 },

	{ name: 'max_forms_width', caption: 'Max. Formen per Zeile:', type: 'int', default: 6 },
	{ name: 'plate_thickness', caption: 'Platten-Stärke:', type: 'float', default: 0.4 },
	{ name: 'plate_margin', caption: 'Rand:', type: 'float', default: 5.0 },
	
	{ name: 'debug_dot', caption: 'Punkt im Detail', type: 'bool', default: false }
	
	];
}

function main(params)
{
	log("start");
	
	parameters = params;
	
	var result;
	if (parameters.debug_dot)
		result = sized_dot().scale([3, 3, 3]);
	else
		result = generate(parameters.text);
	
	log("finish");
	
	return result;
}
