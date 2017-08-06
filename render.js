var render_scene = 1;
var frame = 0;

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var width = 850;var canvas_height = 850;var height = 650;
canvas.width = width;
canvas.height = canvas_height;

var capture_time = 30;

var capturer = new CCapture( {
	framerate: 60,
	verbose: true,
	format: 'ffmpegserver',
	// extension: ".mp4",
	// codec: "mpeg4",
	name: 'sheets'
} );

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomPoint(x,prevx,i,j,initial_x) {
	prevLimit = getRandomInt(0,3);
	rando = getRandomInt(-prevLimit,prevLimit+1);
	x = x + rando;
	if (x > prevx+prevLimit) {x=prevx+prevLimit;}
	else if (x < prevx-prevLimit) {x=prevx-prevLimit;}
	// limit = height/2;
	// if (x > (initial_x + limit)) {x = initial_x + limit;}
	// else if (x < (initial_x - limit)) {x = initial_x - limit;}
	return x;
}

function getRandomColor(color,id) {
	rando = getRandomInt(-2,3);
	color = color+rando;
	if (id == 0) {max=236;min=52;}
	else if (id == 1) {max=148;min=110;}
	else {max=230;min=173;}
	if (color > max) {color = max;}
	else if (color <= min) {color = min;}
	return color;
}

function showVideoLink(url, size) {
	size = size ? (" [size: " + (size / 1024 / 1024).toFixed(1) + "meg]") : " [unknown size]";
	var a = document.createElement("a");
	a.href = url;
	var filename = url;
	var slashNdx = filename.lastIndexOf("/");
	if (slashNdx >= 0) {
	  filename = filename.substr(slashNdx + 1);
	}
	a.download = filename;
	a.appendChild(document.createTextNode(url + size));
	document.body.appendChild(a);
}

var line_separation = 3;
var pts_per_line, num_lines;
pts_per_line = width/2;
num_lines = Math.floor(height/(line_separation));

//Generate array
var points = [];
var initial_x = 100;
x = initial_x;
for(var i=0; i < num_lines; i++) {
	for (var j=0; j < pts_per_line; j++) {
		index = j + i*pts_per_line;
		points[index] = x + line_separation*i;
	}
}

//Generate color
var r,g,b;
r = (236-52)/2;
g = (148-110)/2;
b = (230-173)/2;

// Generate gradient
var gradient = context.createLinearGradient(0,height,0,0);
gradient.addColorStop(0,"#b87e7a");
gradient.addColorStop(0.05,"#f2a48d");
gradient.addColorStop(0.15,"#fccfa8");
gradient.addColorStop(0.5,"#e3eae3");
gradient.addColorStop(1,"#6ba8c5");

if (render_scene) {
	capturer.start();
}

function render() {
	// clear screen
	r = getRandomColor(r,0);
	g = getRandomColor(g,1);
	b = getRandomColor(b,2);
	getSin = ((Math.sin(((new Date).getTime())/5000))*0.5)+0.5;
	trail = getSin+0.1;
	if (trail > 1) {trail = 1;}
	r=0;g=0;b=0;
    context.fillStyle = "rgba("+r+","+g+","+b+","+1+")";
    //context.fillStyle = gradient;
    context.fillRect(0, 0, width, canvas_height);
    //context.globalCompositeOperation = 'luminosity';
	var x,y;
	for(var i=0; i < num_lines; i++) {
		for (var j=0; j < pts_per_line; j++) {
			index = j + i*pts_per_line;
			x = points[index];
			if (j==0) {prevx = x;prevlinex=x;}
			else {prevx = points[index-1];prevlinex=x;}
			x = getRandomPoint(x,prevx,i,j,initial_x);
			points[index] = x;
			y = j * (width/pts_per_line);
			if (j == 0) {
				context.beginPath();
				r=255;g=255;b=255;
				//context.strokeStyle = "rgba("+(r+50)+","+(g+50)+","+(b+50)+","+1+")";
				context.strokeStyle = gradient;
				//context.lineJoin = "round";
				context.lineWidth = 1;
				context.moveTo(y,x)
			}
			else {
				context.lineTo(y,x)
			}
		}
		context.stroke();
	}
	capturer.capture(canvas);
	frame++;
	if ((frame > (60*capture_time)) && (render_scene)) {
		capturer.stop();
		capturer.save(showVideoLink);
	}
	else {
		requestAnimationFrame(render);
	}
}

requestAnimationFrame(render);
