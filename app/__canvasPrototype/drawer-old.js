//Identify the canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var tmp_ctx = canvas.getContext('2d');

//Dynamically set the canvas width and height by detecting the canvas container's width and height
var canvasContainer = document.getElementById('canvasContainer');
var canvasContainer_style = getComputedStyle(canvasContainer);
canvas.width = parseInt(canvasContainer_style.getPropertyValue('width'));
canvas.height = parseInt(canvasContainer_style.getPropertyValue('height'));

//Create a temporary canvas to help with smoothing lines
var tmp_canvas = document.createElement('canvas');

//Add temp canvas to canvas container
canvasContainer.appendChild(tmp_canvas);

//Detect mouse position
var mouse = {x: 0, y: 0};
var last_mouse = {x: 0, y: 0};
	
// Pencil Points
var ppts = [];

canvas.addEventListener('mousemove', function(e) {
  /*
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
  */
  
  /*
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
  */
  
  mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
}, false);

/* Draw on canvas */
//Default settings
ctx.lineWidth = 25;
ctx.strokeStyle = "#CC0000";

//Point size
var setPointSize = function(size)
{
	pointSize = size;
	ctx.lineWidth = pointSize;
}
setPointSize();

//Stroke color
var colors = [
                '#FFFFFF',
                '#410D01',
                '#800000',
                '#CA0101',
                '#FF4500',
                '#FF9900',
                '#FFDE00',
                '#E0BD00',
                '#64C101',
                '#009300',
                '#008080',
                '#009DE7',
                '#0048BF',
                '#282d95',
                '#7D26CD',
                '#e31899',
                '#111111',
                '#888888',
                '#CCCCCC'
             ];

var setColor = function(id)
{
	strokeColor = colors[id];
	ctx.strokeStyle = strokeColor;
}
setColor();

//Set line properties
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

//Identify the coloring image
//var img = document.querySelector('#coloringPhoto');
//ctx.drawImage(img,0,0);
 
//Listen when mouse is pressed down  
canvas.addEventListener('mousedown', function(e) {
    //Start drawing the path
	ctx.beginPath();
	
	//Start drawing at mouse position
    ctx.moveTo(mouse.x, mouse.y);
 
 	//Listen when mouse is moving
    canvas.addEventListener('mousemove', drawIt, false);
}, false);
 
//Listen when mouse is released 
canvas.addEventListener('mouseup', function() {
	//Stop drawing
    canvas.removeEventListener('mousemove', drawIt, false);
}, false);

//Continue drawing
var drawIt = function()
{
	//Move path to new mouse position
    ctx.lineTo(mouse.x, mouse.y);
	
	//Draw path
    ctx.stroke();
};

//Clear canvas
var clearCanvas = function()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}