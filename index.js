const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const w = document.documentElement.clientWidth;
const h = document.documentElement.clientHeight;

const particleNum = 70;

// 鼠标点击后累计的帧数
let afterClickFrames = 0;
// 是否在鼠标点击后afterClickParticleMoveFrames帧之内
let afterClick = false;
// 鼠标点击后粒子需要多少帧的时间去运动到指定位置
const afterClickParticleMoveFrames = 60;
// 记录鼠标点击后粒子位置，及粒子位置到目标位置的差值
let deltaX = new Array(particleNum);
let deltaY = new Array(particleNum);
let startX = new Array(particleNum);
let startY = new Array(particleNum);

let clickTimes = 0;

// 返回min到max之间的随机数
randNum = (min, max) => {
  return Math.random() * (max - min) + min;
}

initCanvasSize = () => {
  canvas.width = w;
  canvas.height = h;
}

// 绘制渐变背景
drawBg = () => {
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  const bgColor = ['#fad0c4', '#ff9a9e'];
  grd.addColorStop(0, bgColor[0]);
  grd.addColorStop(1, bgColor[1]);

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
}

// 创建随机粒子
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

// 粒子运动与绘制函数
animate = (particles) => {
  drawBg();
  // 鼠标未点击，粒子自由状态
  for(let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].movePerFrame();
  }

  // 鼠标点击后，粒子准备运动
  if(afterClick) {
    // 点击次数为奇数，则粒子聚拢
    // 否则粒子散开，回到原来位置，同时给予粒子合理的初速度，使动画顺滑
    if(clickTimes % 2 != 0) {
      for(let i = 0; i < particles.length; i++) {
        particles[i].easeOutMoveTo(
          deltaX[i], 
          deltaY[i], 
          startX[i], 
          startY[i], 
          afterClickFrames/afterClickParticleMoveFrames
        );
      }
      afterClickFrames++;
    } else {
      for(let i = 0; i < particles.length; i++) {
        particles[i].easeInMoveTo(
          -deltaX[i], 
          -deltaY[i], 
          w/2, 
          h/2, 
          afterClickFrames/afterClickParticleMoveFrames
        );
        // 给粒子一个顺着散开方向的初速度
        particles[i].velX = -deltaX[i] / 500;
        particles[i].velY = -deltaY[i] / 500;
      }
      afterClickFrames++;
    }
  }
  // 粒子已运动到指定位置，点击状态重新初始化
  if(afterClickFrames > afterClickParticleMoveFrames) {
    afterClick = false;
    afterClickFrames = 0;
  }

  canvas.onclick = () => {
    // 在粒子处于不自由运动状态时忽略点击事件
    if(afterClickFrames != 0) {
      return;
    }
    clickTimes++;
    afterClick = true;
    // 奇数次点击时记录粒子位置，及粒子位置到目标位置的差值
    if(clickTimes % 2 != 0) {
      for(let i = 0; i < particles.length; i++) {
        deltaX[i] = w/2 - particles[i].posX;
        deltaY[i] = h/2 - particles[i].posY;
        startX[i] = particles[i].posX;
        startY[i] = particles[i].posY;
      }
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