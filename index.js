var max = 19,
  xScale = 6,
  zScale = 2.5,
  yScale = 16,
  startFrom = 0,
  dz = 640,

  // I actually want it to be slower then 60fps
  requestAnimationFrame = function(callback) {
      window.setTimeout(callback, 1000 / 24);
  };

function run() {
  var ctx = document.getElementById('scene').getContext('2d'),
    redSpiralShadow = createSpiral({
      foreground: "#660000",
      background: "#330000",
      isLeft: true,
      yLocalScale: 1.01
    }),
    redSpiral = createSpiral({
      foreground: "#ff0000",
      background: "#440000",
      isLeft: true,
      yLocalScale: 1
    }),
    cyanSpiralShadow = createSpiral({
      foreground: "#003300",
      background: "#000000",
      isLeft: false,
      yLocalScale: 1.01
    }),
    cyanSpiral = createSpiral({
      foreground: "#00ffcc",
      background: "#005633",
      isLeft: false,
      yLocalScale: 1
    });

  animationLoop();


  function animationLoop() {
    renderFrame();
    if (startFrom > 1) {
      startFrom = 0;
    } else {
      startFrom += 0.1;
    }

    requestAnimationFrame(animationLoop);
  }

  function renderFrame() {
    ctx.clearRect(0, 0, 480, 640);
    ctx.beginPath();

    xScale *= 0.93;
    forEachStep(redSpiralShadow);
    forEachStep(cyanSpiralShadow);
    xScale /= 0.93;

    forEachStep(redSpiral);
    forEachStep(cyanSpiral);
  }

  function forEachStep(callback) {
    for (var i = -startFrom; i < max + startFrom; i += 0.08) {
      if (i < 0 || i > max) continue;
      callback(i);
    }
  }

  function createSpiral(config) {
    var sign = config.isLeft ? -1 : 1,
      background = config.background,
      foreground = config.foreground,
      yLocalScale = config.yLocalScale || 1;

    if (!config.isLeft) {
      background = foreground;
      foreground = config.background;
    }

    return function(i) {
      var zoff = i * Math.sin(i),
        z = dz / (dz - sign * zoff * zScale),
        x = getX(i, z, sign),
        y = getY(i * yLocalScale, z);

	  var normZ = (sign * zoff);
	  
	  if(normZ > maxz){
		maxz = normZ;
		console.log(maxz);  
	  }
	  if(normZ < minz){
		minz = normZ;
		console.log(minz);  
	  }
	  
	  normZ = (normZ + Math.abs(minz)) / (Math.abs(minz) + maxz);
	  var col = interpColor(foreground, background, normZ);
	  
      switchColor(col);
      ctx.moveTo(x, y);
      ctx.lineTo(getX(i + 0.03, z, sign), getY((i + 0.01) * yLocalScale, z));
    };
  }
  
  var minz = 0;
  var maxz = 0;
  function interpColor(color1, color2, t) {
	  t = Math.min(Math.max(0,t), 1);
	  
	  color1 = color1.substring(1);
	  color2 = color2.substring(1);
	  
	  var r1 = parseInt(color1.substring(0,1), 16);
	  var g1 = parseInt(color1.substring(2,3), 16);
	  var b1 = parseInt(color1.substring(4,5), 16);
	  
	  var r2 = parseInt(color2.substring(0,1), 16);
	  var g2 = parseInt(color2.substring(2,3), 16);
	  var b2 = parseInt(color2.substring(4,5), 16);
	  
	  var rfinal = r1 * t + r2 * (1 - t);
	  var gfinal = g1 * t + g2 * (1 - t);
	  var bfinal = b1 * t + b2 * (1 - t);
	  
	  var newcolor = Math.round(rfinal).toString(16) + Math.round(gfinal).toString(16) + Math.round(bfinal).toString(16);
	  
	  return "#"+newcolor;
  }

  function switchColor(color) {
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.beginPath();
  }

  function getX(i, z, sign) {
    return sign * i * Math.cos(i) * z * xScale + 255;
  }

  function getY(i, z) {
    return i * z * yScale + 50;
  }
}
