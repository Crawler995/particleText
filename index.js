const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const w = document.documentElement.clientWidth;
const h = document.documentElement.clientHeight;

const particleNum = 70;
let afterClickFrames = 0;
let afterClick = false;
let deltaX = new Array(particleNum);
let deltaY = new Array(particleNum);
let startX = new Array(particleNum);
let startY = new Array(particleNum);

randNum = (min, max) => {
  return Math.random() * (max - min) + min;
}

initCanvasSize = () => {
  canvas.width = w;
  canvas.height = h;
}

drawBg = () => {
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  const bgColor = ['#fad0c4', '#ff9a9e'];
  grd.addColorStop(0, bgColor[0]);
  grd.addColorStop(1, bgColor[1]);

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
}

createParticle = () => {
  let particles = [];
  for(let i = 0; i < particleNum; i++) {
    let particle = new Particle(
      randNum(10, w-10),
      randNum(10, h-10),
      randNum(2, 6),
      randNum(-0.7, 0.7),
      randNum(-0.7, 0.7),
      0,
      0,
      'rgba(255, 255, 255,' + randNum(0.3, 0.8) + ')',
      'free'
    );

    particles.push(particle);
  }

  return particles;
}

animate = (particles) => {
  drawBg();
  for(let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].movePerFrame();
  }

  if(afterClick) {
    for(let i = 0; i < particles.length; i++) {
      particles[i].easeOutMoveTo(deltaX[i], deltaY[i], startX[i], startY[i], afterClickFrames/120);
    }
    afterClickFrames++;
  }
  if(afterClickFrames > 120) {
    afterClick = false;
    afterClickFrames = 0;
  }

  canvas.onclick = () => {
    afterClick = true;
    for(let i = 0; i < particles.length; i++) {
      deltaX[i] = 400 - particles[i].posX;
      deltaY[i] = 400 - particles[i].posY;
      startX[i] = particles[i].posX;
      startY[i] = particles[i].posY;
    }
  }

  window.requestAnimationFrame(() => {
    animate(particles);
  });
}

window.onload = () => {
  initCanvasSize();
  let particles = createParticle();
  animate(particles);
}