(function() {
  var $ = function(id){
    return document.getElementById(id);
  };
  
  var canvas = this.__canvas = new fabric.Canvas('canvas', {
    isDrawingMode: true,
    //allowTouchScrolling: true
    selection:true,
    selectable:true
  });
  
   //Set canvas context size
  canvas.setWidth(1140);
  canvas.setHeight(1095);

  //window.addEventListener('resize', checkWidth(), false);
  window.onresize = function()
  {
    checkWidth();
    //console.log(canvas.getWidth() + ' / ' + canvas.getHeight());
  }
 
  canvas.on('after:render', function(options) {
    // console.log('**');
  });
  
  function checkWidth()
  {
    if(window.innerWidth > 1200) {
      canvas.setWidth(1140);
      canvas.setHeight(1095);
    } else if(window.innerWidth > 992) {
      canvas.setWidth(932);
      canvas.setHeight(869);
    } else if(window.innerWidth > 768) {
      canvas.setWidth(708);
      canvas.setHeight(680);
    } else if(window.innerWidth > 640) {
      canvas.setWidth(580);
      canvas.setHeight(557);
    }
    canvas.renderAll.bind(canvas);
  }
  

  //Add overlay image (relative to HTML file)
  canvas.setOverlayImage('../../common/img/coloring-canvas.png', canvas.renderAll.bind(canvas), {
    width: canvas.width,
    height: canvas.height,
    // Needed to position overlayImage at 0/0
    originX: 'left',
    originY: 'top'
  });

  //Configure colors
  var brown = $('brown');
  var maroon = $('maroon');
  var red = $('red');
  var redOrange = $('redOrange');
  var orange = $('orange');
  var yellow = $('yellow');
  var gold = $('gold');
  var yellowGreen = $('yellowGreen');
  var green = $('green');
  var blueGreen = $('blueGreen');
  var lightBlue = $('lightBlue');
  var blue = $('blue');
  var blueViolet = $('blueViolet');
  var violet = $('violet');
  var pink = $('pink');
  var black = $('black');
  var gray = $('gray');
  var silver = $('silver');
  
  var eraser = $('eraser');
  
  var colors = [
                '#FFFFFF',  //eraser
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
                '#E31899',
                '#111111',
                '#888888',
                '#CCCCCC'
             ];
  
   //Set default color and point size
  canvas.freeDrawingBrush.color = colors[3];
  canvas.freeDrawingBrush.width = '20';
  
  var setPointSizeColor = function()
  {
    //reset all point size colors to white
    var pointSizes = document.getElementsByClassName('point-size');
    for(var i=0; i<pointSizes.length; i++)
    {
      pointSizes[i].style.background = 'none';
    }
    
    //set point size color to currently selected color
    var selectedPointSizes = document.getElementsByClassName('point-size-selected');
    selectedSize = selectedPointSizes[0];
    selectedSize.style.background = canvas.freeDrawingBrush.color;
  }
  setPointSizeColor();
  
  eraser.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[0];
    setPointSizeColor();
  };
  
  brown.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[1];
    setPointSizeColor();
  };
  
  maroon.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[2];
    setPointSizeColor();
  };
  
  red.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[3];
    setPointSizeColor();
  };
  
  redOrange.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[4];
    setPointSizeColor();
  };
  
  orange.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[5];
    setPointSizeColor();
  };
  
  yellow.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[6];
    setPointSizeColor();
  };
  
  gold.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[7];
    setPointSizeColor();
  };
  
  yellowGreen.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[8];
    setPointSizeColor();
  };
  
  green.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[9];
    setPointSizeColor();
  };
  
  blueGreen.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[10];
    setPointSizeColor();
  };
  
  lightBlue.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[11];
    setPointSizeColor();
  };
  
  blue.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[12];
    setPointSizeColor();
  };
  
  blueViolet.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[13];
    setPointSizeColor();
  };
  
  violet.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[14];
    setPointSizeColor();
  };
  
  pink.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[15];
    setPointSizeColor();
  };
  
  black.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[16];
    setPointSizeColor();
  };
  
  gray.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[17];
    setPointSizeColor();
  };
  
  silver.onclick = function()
  {
    canvas.freeDrawingBrush.color = colors[18];
    setPointSizeColor();
  };
  
  //Configure point sizes
  var size1 = $('size1');
  var size2 = $('size2');
  var size3 = $('size3');
  var size4 = $('size4');
  
  size1.onclick = function()
  {
    canvas.freeDrawingBrush.width = '10';
    setPointSizeColor();
  };
  
  size2.onclick = function()
  {
    canvas.freeDrawingBrush.width = '20';
    setPointSizeColor();
  };
  
  size3.onclick = function()
  {
    canvas.freeDrawingBrush.width = '40';
    setPointSizeColor();
  };
  
  size4.onclick = function()
  {
    canvas.freeDrawingBrush.width = '60';
    setPointSizeColor();
  };
  
  
  fabric.Object.prototype.transparentCorners = false;

  var clearEl = $('clear-canvas');
  
  clearEl.onclick = function() { canvas.clear() };



  if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 2;

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 5;
      var patternCanvas = fabric.document.createElement('canvas');
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      });

      var canvasWidth = rect.getBoundingRectWidth();

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      var ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };

    var img = new Image();
    img.src = '../assets/honey_im_subtle.png';

    var texturePatternBrush = new fabric.PatternBrush(canvas);
    texturePatternBrush.source = img;
  }

  
  drawingColorEl.onchange = function() {
    canvas.freeDrawingBrush.color = this.value;
  };
  drawingShadowColorEl.onchange = function() {
    canvas.freeDrawingBrush.shadowColor = this.value;
  };
  drawingLineWidthEl.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
  };
  drawingShadowWidth.onchange = function() {
    canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
  };
  drawingShadowOffset.onchange = function() {
    canvas.freeDrawingBrush.shadowOffsetX =
    canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadowBlur = 0;
  }
})();