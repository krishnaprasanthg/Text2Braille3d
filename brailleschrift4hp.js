/* ------------------------------- */
/* Javascript von Alexander Fakoo' */
/* ------------------------------- */

var braillegrossbuchstaben=0;                               /*  <--- =1 wenn Grossbuchstaben automatisch ein $ davor erhalten sollen */
var braillezeichenabstand=5;                                /*  <--- Buchstabenabstand in Pixel (evtl. anpassen) */

/* ~~~~~~~~~~~~~~ der Rest braucht nicht veraendert zu werden ~~~~~~~~~~~~~~~~~ */

var brailleschriftscriptdatei="brailleschrift4hp.js";
var aufrufendedateipfad=location.href.substr(0,location.href.lastIndexOf('/')+1);
for (var i=0; i<document.getElementsByTagName("script").length; i++)
{
	if (document.getElementsByTagName("script")[i].src.indexOf(brailleschriftscriptdatei)>0)
	{
		var grafikpfad4braille=document.getElementsByTagName("script")[i].src.substr(0,document.getElementsByTagName("script")[i].src.lastIndexOf('/')+1);
	}
}
if (grafikpfad4braille.indexOf(aufrufendedateipfad)==0)
	grafikpfad4braille=grafikpfad4braille.substr(aufrufendedateipfad.length);

var braillecode = new Array(); braillecode['a'] = "10"; braillecode['b'] = "30"; braillecode['c'] = "11"; braillecode['d'] = "13";
braillecode['e'] = "12"; braillecode['f'] = "31"; braillecode['g'] = "33"; braillecode['h'] = "32"; braillecode['i'] = "21";
braillecode['j'] = "23"; braillecode['k'] = "50"; braillecode['l'] = "70"; braillecode['m'] = "51"; braillecode['n'] = "53";
braillecode['o'] = "52"; braillecode['p'] = "71"; braillecode['q'] = "73"; braillecode['r'] = "72"; braillecode['s'] = "61";
braillecode['t'] = "63"; braillecode['u'] = "54"; braillecode['v'] = "74"; braillecode['w'] = "27"; braillecode['x'] = "55";
braillecode['y'] = "57"; braillecode['z'] = "56"; braillecode['1'] = "10"; braillecode['2'] = "30"; braillecode['3'] = "11";
braillecode['4'] = "13"; braillecode['5'] = "12"; braillecode['6'] = "31"; braillecode['7'] = "33"; braillecode['8'] = "32";
braillecode['9'] = "21"; braillecode['0'] = "23"; braillecode[' '] = "00"; braillecode[','] = "20"; braillecode['.'] = "40";
braillecode[':'] = "22"; braillecode['-'] = "44"; braillecode[';'] = "60"; braillecode['!'] = "62"; braillecode['+'] = "62";
braillecode['?'] = "24"; braillecode['*'] = "42"; braillecode['/'] = "26"; braillecode['&'] = "75"; braillecode['@'] = "43";
braillecode['_'] = "07"; braillecode['$'] = "05"; braillecode['#'] = "47"; braillecode['%'] = "77"; braillecode['\'']= "04";
braillecode['\"']= "01"; braillecode['('] = "66"; braillecode[')'] = "66"; braillecode['='] = "66"; braillecode['<'] = "06";
braillecode['>'] = "03"; braillecode['['] = "76"; braillecode[']'] = "67"; braillecode['{'] = "64"; braillecode['}'] = "46";
braillecode['\xbb'] = "64"; braillecode['\x60'] = "35"; braillecode['\x5e'] = "37"; braillecode['\xab'] = "46";
braillecode['\xe4'] = "43"; braillecode['\xf6'] = "25"; braillecode['\xfc'] = "36"; braillecode['\xdf'] = "65";
braillecode['\xa7'] = "45"; braillecode['~'] = "02"; braillecode['\xef'] = "45"; /* i umlaut */
braillecode['\xeb'] = "15"; /* e umlaut */ braillecode['\xea'] = "34"; /* e dach   */
braillecode['\xe2'] = "41"; /* a dach   */ braillecode['\xfb'] = "14"; /* u dach   */
braillecode['\xa2'] = "17"; /* cent     */ braillecode['\xa9'] = "16"; /* copy     */
braillecode['\xb0'] = "67"; /* grad     */

var alt_l = new Array(); alt_l[0]='p'; alt_l[1]='p1'; alt_l[2]='p2'; alt_l[3]='p12'; alt_l[4]='p3'; alt_l[5]='p13'; alt_l[6]='p23'; alt_l[7]='p123';
var alt_r = new Array(); alt_r[0]=''; alt_r[1]='4'; alt_r[2]='5'; alt_r[3]='45'; alt_r[4]='6'; alt_r[5]='46'; alt_r[6]='56'; alt_r[7]='456';
var htmltext;
var bild_bt_01=new Image; bild_bt_01.src=grafikpfad4braille+"pixel.gif";
var bild_bt_02=new Image; bild_bt_02.src=grafikpfad4braille+"s-0.gif";
var bild_bt_03=new Image; bild_bt_03.src=grafikpfad4braille+"s-1.gif";
var bild_bt_04=new Image; bild_bt_04.src=grafikpfad4braille+"s-2.gif";
var bild_bt_05=new Image; bild_bt_05.src=grafikpfad4braille+"s-3.gif";
var bild_bt_06=new Image; bild_bt_06.src=grafikpfad4braille+"s-4.gif";
var bild_bt_07=new Image; bild_bt_07.src=grafikpfad4braille+"s-5.gif";
var bild_bt_08=new Image; bild_bt_08.src=grafikpfad4braille+"s-6.gif";
var bild_bt_09=new Image; bild_bt_09.src=grafikpfad4braille+"s-7.gif";

function braillezeichenausgabe(brtext)
{
	htmltext="<small style='white-space:nowrap'>";
	var ausricht="vertical-align:bottom";
	for (var i=0;i<brtext.length;i++)
	{
		var zeichen=brtext.charAt(i);
		var code=braillecode[zeichen];
		if (zeichen=='\xd7')
		{
			htmltext+="<img src='"+grafikpfad4braille+"s-0.gif' alt='&nbsp;' title='' style='"+ausricht+"'>";
		}
		else if (!code)
		{
			alert("Zeichen "+zeichen+" kann nicht dargestellt werden.\n\nAn dieser Stelle erscheint ein Vollzeichen.");
			htmltext+="<img src='"+grafikpfad4braille+"s-7.gif' alt='xx' title='' style='"+ausricht+"'>";
			htmltext+="<img src='"+grafikpfad4braille+"s-7.gif' alt='' title='' style='"+ausricht+"'>";
		}
		else if (zeichen==' ')
		{
			htmltext+="<img src='"+grafikpfad4braille+"s-0.gif' alt='p0' title='' style='"+ausricht+"'>";
			htmltext+="<img src='"+grafikpfad4braille+"s-0.gif' alt='' title='' style='"+ausricht+"'>";
			htmltext+="<\/small><img src='"+grafikpfad4braille+"pixel.gif' width='1' alt=''><small style='white-space:nowrap'>";
		}
		else
		{
			var p_links=braillecode[zeichen].substr(0,1);
			var p_rechts=braillecode[zeichen].substr(1,1);
			htmltext+="<img src='"+grafikpfad4braille+"s-"+p_links+".gif' alt='"+alt_l[p_links]+alt_r[p_rechts]+"' title='' style='"+ausricht+"'>";
			htmltext+="<img src='"+grafikpfad4braille+"s-"+p_rechts+".gif' alt='&nbsp;' title='' style='"+ausricht+"'>";
		}
		htmltext+="<img src='"+grafikpfad4braille+"pixel.gif' width='"+braillezeichenabstand+"' style='"+ausricht+"' alt=''>";
	}
	document.write(htmltext+"<\/small>");
}

function brailleschriftausgabe(inh,art) /* art=0 oder fehlt : normales Braille-Leerzeichen  | art=1 : ohne Leerzeichen, nur halber Abstand */
{
	if (art && art==1) while (inh.indexOf(' ')>=0) inh=inh.replace(' ','\xd7');

	var brtext='';
	var ziff=0;
	for (var i=0;i<inh.length;i++)
	{
		var zeichen=inh.charAt(i);
		if (braillegrossbuchstaben && !ziff && /[A-Z\xc4\xd6\xdc]/.test(zeichen)) brtext+='$'; /* $ fuer Grossbuchstabe */
		zeichen=zeichen.toLowerCase();

		if (/[0-9]/.test(zeichen)&&!ziff)
		{
			brtext+='#';         /* Raute fuer Zahlen */
			ziff=1;
		}
		else if (/[^0-9.,]/.test(zeichen)&&ziff)
		{
			if (/[abcdefghij,;:/?!=\xbb\xab*]/.test(zeichen))  /* einschliesslich herabgesetzte Ziffern */
			brtext+='\'';      /* Appostroph fuer Zahlen-Ende */
			ziff=0;
		}
		else if (zeichen==' ') ziff=0;
		brtext+=zeichen;
	}
	braillezeichenausgabe(brtext);
}

function vollschriftausgabe(inh,art)   /* Vollschrift bitte kontrollieren, eventuell ein '|' fuer Zwangs-Silbentrennung in Text einfuegen */
{
	if (braillegrossbuchstaben)
	{
		while (inh.indexOf('Sch')>=0) inh=inh.replace("Sch","$sch");
		while (inh.indexOf('Ch')>=0) inh=inh.replace("Ch","$ch");
		while (inh.indexOf('St')>=0) inh=inh.replace("St","$st");
		while (inh.indexOf('Ei')>=0) inh=inh.replace("Ei","$ei");
		while (inh.indexOf('Ie')>=0) inh=inh.replace("Ie","$ie");
		while (inh.indexOf('Eu')>=0) inh=inh.replace("Eu","$eu");
		while (inh.indexOf('\xc4u')>=0) inh=inh.replace("\xc4u","$\xe4u");
		while (inh.indexOf('Au')>=0) inh=inh.replace("Au","$au");
	}
	else inh=inh.toLowerCase();
	while (inh.indexOf('sch')>=0) inh=inh.replace("sch","\xa9");
	while (inh.indexOf('ch')>=0) inh=inh.replace("ch","\xa2");
	while (inh.indexOf('st')>=0) inh=inh.replace("st","\xb0");
	while (inh.indexOf('ei')>=0) inh=inh.replace("ei","\xeb");
	while (inh.indexOf('ie')>=0) inh=inh.replace("ie","\xef");
	while (inh.indexOf('eu')>=0) inh=inh.replace("eu","\xea");
	while (inh.indexOf('\xe4u')>=0) inh=inh.replace("\xe4u","\xe2");
	while (inh.indexOf('au')>=0) inh=inh.replace("au","\xfb");
	while (inh.indexOf('|')>=0) inh=inh.replace("|","");

	brailleschriftausgabe(inh,art);
}

/* ~~~~~~~~~~~~~~~~~~~ Ende ~~~~~~~~~~~~~~~~~~~~~ */
