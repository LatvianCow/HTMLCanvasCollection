var zimejums = manaPamatne.getContext("2d");
zimejums.clearRect(0, 0, window.innerWidth, window.innerHeight);
resizeCanvas();

manaPamatne.width = window.innerWidth;
manaPamatne.height = window.innerHeight;
var posX = 0;
var posY = 0;
var oldPosX = 0;
var oldPosY = 0;
var angle = 0;
var lifespan = 150; // deafult 100
var size = 2.5; // deafult 2.5
var speedMultiplier = 1; // deafult 1
var turn = 2.5; // deafult 2.5 or -2.5
var colorChangingSpeed = 2; // deafult 1.5
var r = 0; // deafult 0
var g = 0; // deafult 0
var b = 0; // deafult 0

setInterval(anim, 20);

window.addEventListener('resize', resizeCanvas);

    let cursorSpeed = 0;
    let lastMoveTime = performance.now();

    document.addEventListener('mousemove', mouse_position); 
    function mouse_position(e) {
      let currentTime = performance.now();
      let deltaTime = currentTime - lastMoveTime;

      let dist = Math.sqrt((posX - e.clientX) ** 2 + (posY - e.clientY) ** 2);
      cursorSpeed = dist / deltaTime;

      lastMoveTime = currentTime;

      oldPosX = posX;
      oldPosY = posY;
      posX = e.clientX; 
      posY = e.clientY;
      angle = Math.atan2(posY - oldPosY, posX - oldPosX);
}

let particles = [];

function anim() {
  zimejums.clearRect(0, 0, manaPamatne.width, manaPamatne.height);

  if (oldPosX !== posX || oldPosY !== posY) {
    zimejums.beginPath();
    zimejums.fillStyle = "rgb(255, 255, 255)";
    zimejums.arc(posX, posY, size, 0, 2 * Math.PI);
    zimejums.fill();
    var newParticle = {
      x: posX,
      y: posY,
      angle: angle,
      index: particles.length + 1,
      speed: cursorSpeed * speedMultiplier,
      r: 255 + r * 2,
      g: 255 + g * 2,
      b: 255 + b * 2,
      decay: 0
    };
    particles.push(newParticle);
  } else {
    zimejums.beginPath();
    zimejums.fillStyle = "rgb(255, 255, 255)";
    zimejums.arc(posX, posY, size, 0, 2 * Math.PI);
    zimejums.fill();
  }
  
  particles.forEach(function(particle){
      particle.r -= colorChangingSpeed * ((g + b) / lifespan);
      particle.g -= colorChangingSpeed * ((b + r) / lifespan);
      particle.b -= colorChangingSpeed * ((r + g) / lifespan);
      var a = (lifespan + 1 - particle.decay) / lifespan;
      zimejums.beginPath();
      zimejums.fillStyle = `rgba(${particle.r}, ${particle.g}, ${particle.b}, ${a})`;
      zimejums.arc(particle.x + (size * Math.cos(particle.angle) * particle.decay * particle.speed), particle.y + (size * Math.sin(particle.angle) * particle.decay * particle.speed), size * 0.4 + a * size * 0.6, 0, 2 * Math.PI);
      particle.decay++;
      particle.angle += turn/100;
      zimejums.fill();
      if (particle.decay > lifespan) {
particles.splice(particles.indexOf(particle), 1);
      }
  });
  oldPosX = posX;
  oldPosY = posY;
}

function resizeCanvas() {
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight;
  var aspectRatio = manaPamatne.width / manaPamatne.height;
  var windowAspectRatio = canvasWidth / canvasHeight;
  if (aspectRatio > windowAspectRatio) {
    manaPamatne.width = canvasHeight * aspectRatio;
    manaPamatne.height = canvasHeight;
  } else {
    manaPamatne.width = canvasWidth;
    manaPamatne.height = canvasWidth / aspectRatio;
  }
}