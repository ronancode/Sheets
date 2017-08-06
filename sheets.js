// Pseudocode
// Draw set of vertical lines with random offset in y direction for each point
// Draw many frame by frame
// Each line is related to the previous

width = window.innerWidth;
height = window.innerHeight;

canvas = d3.select('body').append('canvas').attr('width',width).attr('height',height);
context = canvas.node().getContext('2d');

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

var line_separation = 5;
var pts_per_line, num_lines;
pts_per_line = width/2;
num_lines = Math.floor(height/(line_separation));

//Generate array
var points = [];
var initial_x = 0;
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

setInterval(function() {
	// clear screen
	r = getRandomColor(r,0);
	g = getRandomColor(g,1);
	b = getRandomColor(b,2);
	getSin = ((Math.sin(((new Date).getTime())/5000))*0.5)+0.5;
	trail = getSin+0.1;
	if (trail > 1) {trail = 1;}
	r=0;g=0;b=0;
    context.fillStyle = "rgba("+r+","+g+","+b+","+trail+")";
    //context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
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
}, 0);