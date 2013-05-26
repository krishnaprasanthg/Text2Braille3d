function form_base(dimensions)
{
	return CSG.cube({ center: dimensions, radius: dimensions });
}


function generate(text)
{
	var dot_distance = 2.5;
	var dot_diameter = 1.5;
	var dot_height = 0.8;
	
	var form_distance = 6;
	var line_height = 10;
	
	var plate_height = 0.4;
	
	var result = new CSG();
	
	var base = form_base([form_distance, line_height, plate_height]);
	
	result = result.union(base);
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
	
	
	var result = generate("blabla");
	
	
	if (OpenJsCad.log)
		OpenJsCad.log("finish");
	
	return result;
}
