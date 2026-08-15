// --- 1. YOUTUBE PLAYLIST PLAYER ENGINE ---
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    playerVars: {
      listType: 'playlist',
      list: 'PLrybp9_6KzLHBaG5So5v-zyEc63HJSk9E' // Your YouTube Playlist ID
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log("Night Drive Playlist Engine Ready!");
}

const playBtn = document.getElementById('play-btn');
const titleEl = document.getElementById('track-title');
const artistEl = document.getElementById('track-artist');

playBtn.addEventListener('click', () => {
  if (!player) return;
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    playBtn.innerText = '▶';
  } else {
    player.playVideo();
    playBtn.innerText = '⏸';
  }
});

document.getElementById('prev-btn').addEventListener('click', () => {
  if (player && typeof player.previousVideo === 'function') player.previousVideo();
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (player && typeof player.nextVideo === 'function') player.nextVideo();
});

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    const videoData = player.getVideoData();
    if (videoData) {
      titleEl.innerText = videoData.title || "Cruising Solo";
      artistEl.innerText = videoData.author || "Night Drive";
    }
    playBtn.innerText = '⏸';
  } else if (event.data === YT.PlayerState.PAUSED) {
    playBtn.innerText = '▶';
  }
}

// --- 2. RAIN GLASS OVERLAY ENGINE ---
const canvas = document.getElementById('rain-glass-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

class RainDrop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.len = Math.random() * 18 + 8;
    this.speed = Math.random() * 8 + 4;
    this.radius = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.4 + 0.2;
  }

  update() {
    this.y += this.speed;
    if (this.y > height) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.len);
    ctx.strokeStyle = `rgba(180, 220, 255, ${this.opacity})`;
    ctx.lineWidth = this.radius;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x, this.y + this.len, this.radius + 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 240, 255, ${this.opacity + 0.2})`;
    ctx.fill();
  }
}

const drops = Array.from({ length: 120 }, () => new RainDrop());

function animateRainGlass() {
  ctx.clearRect(0, 0, width, height);
  drops.forEach(drop => {
    drop.update();
    drop.draw();
  });
  requestAnimationFrame(animateRainGlass);
}
animateRainGlass();

// --- 3. SPEEDOMETER & ODOMETER LOGIC ---
let currentSpeed = 65;
let targetSpeed = 65;
let odometer = 4829.4;

const speedNumEl = document.getElementById('speed-num');
const odoNumEl = document.getElementById('odo-num');

function setSpeed(newSpeed) {
  targetSpeed = newSpeed;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
    if (
      (newSpeed === 30 && btn.innerText.includes('CITY')) ||
      (newSpeed === 65 && btn.innerText.includes('CRUISE')) ||
      (newSpeed === 90 && btn.innerText.includes('HIGHWAY'))
    ) {
      btn.classList.add('active');
    }
  });
}

setInterval(() => {
  if (currentSpeed < targetSpeed) currentSpeed++;
  else if (currentSpeed > targetSpeed) currentSpeed--;

  speedNumEl.innerText = Math.round(currentSpeed);

  odometer += (currentSpeed / 36000);
  odoNumEl.innerText = Math.floor(odometer).toString().padStart(6, '0');
}, 100);
