// Rainy Windshield Simulation Engine
const canvas = document.getElementById('rain-glass-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class RainDrop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.speed = Math.random() * 10 + 14;
    this.length = Math.random() * 25 + 12;
    this.opacity = Math.random() * 0.35 + 0.15;
  }

  update() {
    this.y += this.speed;
    this.x += 1.2; // Angle from driving movement
    if (this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(180, 225, 255, ${this.opacity})`;
    ctx.lineWidth = 1.2;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 2, this.y + this.length);
    ctx.stroke();
  }
}

const drops = Array.from({ length: 90 }, () => new RainDrop());

function animateRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drops.forEach(drop => {
    drop.update();
    drop.draw();
  });
  requestAnimationFrame(animateRain);
}
animateRain();

// Driving Speed Dynamics
let currentSpeed = 65;
const speedDisplay = document.getElementById('speed-num');

function setSpeed(targetSpeed) {
  currentSpeed = targetSpeed;
  speedDisplay.textContent = targetSpeed;

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('onclick').match(/\d+/)[0]) === targetSpeed);
  });

  let duration = 0.8;
  if (targetSpeed === 30) duration = 1.5;
  if (targetSpeed === 65) duration = 0.8;
  if (targetSpeed === 90) duration = 0.38;

  document.documentElement.style.setProperty('--speed-duration', `${duration}s`);
}

// Odometer Progress Counter
let odoValue = 4829;
const odoDisplay = document.getElementById('odo-num');

setInterval(() => {
  if (currentSpeed > 0) {
    odoValue += 1;
    odoDisplay.textContent = String(odoValue).padStart(6, '0');
  }
}, 3500);
