const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const w = document.documentElement.clientWidth;
const h = document.documentElement.clientHeight;

let particleNum = 0;

// 鼠标点击后累计的帧数
let afterClickFrames = 0;
// 是否在鼠标点击后afterClickParticleMoveFrames帧之内
let afterClick = false;
// 鼠标点击后粒子需要多少帧的时间去运动到指定位置
const afterClickParticleMoveFrames = 90;
// 记录鼠标点击后粒子位置，及粒子位置到目标位置的差值
let deltaX = null;
let deltaY = null;
let startX = null;
let startY = null;
// 记录鼠标点击后粒子半径，及粒子半径到目标半径的差值
let startRadius = null;
let deltaRadius = null;

let startAlpha = null;
let deltaAlpha = null;

let clickTimes = 0;

let words = new Text(
  config.text.content,
  config.text.fontSize,
  config.text.pixelSize
);

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
  const bgColor = config.background.colors;
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
      randNum(0, 0.7),
      0,
      0,
      randNum(0.3, 0.8),
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

  // 当前绘制第几条文本
  let wordIndex = (clickTimes % 2 != 0) ? Math.floor(clickTimes / 2) % words.text.length
                                            : Math.floor((clickTimes-1) / 2) % words.text.length;
  // 鼠标点击后，粒子准备运动
  if(afterClick) {
    // 点击次数为奇数，则粒子聚拢
    // 否则粒子散开，回到原来位置，同时给予粒子合理的初速度，使动画顺滑
    // 在聚拢的过程中半径变为文本像素大小，散开时反之
    if(clickTimes % 2 != 0) {
      for(let i = 0; i < words.textPixelPosArray[wordIndex].length; i++) {
        particles[i].easeOutMoveTo(
          deltaX[i], 
          deltaY[i], 
          startX[i], 
          startY[i], 
          afterClickFrames/afterClickParticleMoveFrames
        );
        particles[i].easeOutRadiusChange(
          deltaRadius[i],
          startRadius[i],
          afterClickFrames/afterClickParticleMoveFrames
        );
        particles[i].easeOutAlphaChange(
          deltaAlpha[i],
          startAlpha[i],
          afterClickFrames/afterClickParticleMoveFrames
        );
      }
      afterClickFrames++;
    } else {
      for(let i = 0; i < words.textPixelPosArray[wordIndex].length; i++) {
        // particles[i].easeInMoveTo(
        //   -deltaX[i], 
        //   -deltaY[i], 
        //   startX[i] + deltaX[i], 
        //   startY[i] + deltaY[i], 
        //   afterClickFrames/afterClickParticleMoveFrames
        // );

        particles[i].easeInMoveTo(
          deltaX[i], 
          deltaY[i], 
          startX[i], 
          startY[i], 
          afterClickFrames/afterClickParticleMoveFrames
        );

        // dirX = particles[i].posX - w / 2
        // dirY = particles[i].posY - h / 4

        // destX = particles[i].posX + dirX
        // destY = particles[i].posY + dirY

        // particles[i].easeInMoveTo(
        //   destX - particles[i].posX, 
        //   destY - particles[i].posY, 
        //   particles[i].posX, 
        //   particles[i].posY, 
        //   afterClickFrames/afterClickParticleMoveFrames
        // );
        particles[i].easeInRadiusChange(
          -deltaRadius[i],
          startRadius[i] + deltaRadius[i],
          afterClickFrames/afterClickParticleMoveFrames
        );
        particles[i].easeInAlphaChange(
          -deltaAlpha[i],
          startAlpha[i] + deltaAlpha[i],
          afterClickFrames/afterClickParticleMoveFrames
        );
        // 给粒子一个顺着散开方向的初速度
        particles[i].velX = (deltaX[i]) / 400;
        particles[i].velY = (deltaY[i]) / 400;
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

    // 点击次数增加，更新wordIndex
    wordIndex = (clickTimes % 2 != 0) ? Math.floor(clickTimes / 2) % words.text.length
                                      : Math.floor((clickTimes-1) / 2) % words.text.length;

    // 奇数次点击时记录粒子位置，及粒子位置到目标位置的差值
    if(clickTimes % 2 != 0) {
      for(let i = 0; i < words.textPixelPosArray[wordIndex].length; i++) {
        offset = 3.0
        deltaX[i] = words.textPixelPosArray[wordIndex][i].x - particles[i].posX + randNum(-offset, offset);
        deltaY[i] = words.textPixelPosArray[wordIndex][i].y - particles[i].posY + randNum(-offset, offset);
        startX[i] = particles[i].posX;
        startY[i] = particles[i].posY;

        base = (words.pixelSize - particles[i].radius) / randNum(2.0, 3.5)
        deltaRadius[i] = base;
        startRadius[i] = particles[i].radius;

        deltaAlpha[i] = 1.0 - particles[i].alpha
        startAlpha[i] = particles[i].alpha
      }
    } else {
      for(let i = 0; i < words.textPixelPosArray[wordIndex].length; i++) {
        offset = 200.0

        dirX = particles[i].posX - w / 2 + randNum(-offset, offset)
        dirY = particles[i].posY - h / 5 + randNum(-offset, offset)
        dis = Math.sqrt(dirX**2 + dirY**2)
        dirX /= dis
        dirY /= dis
        
        factor = randNum(150, 350)
        destX = particles[i].posX + dirX * factor
        destY = particles[i].posY + dirY * factor

        deltaX[i] = destX - particles[i].posX;
        deltaY[i] = destY - particles[i].posY;
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

  words.init();

  // 得到所需粒子数
  particleNum = words.getMostNeedParticleNum() + 40;

  deltaX = new Array(particleNum);
  deltaY = new Array(particleNum);
  startX = new Array(particleNum);
  startY = new Array(particleNum);
  startRadius = new Array(particleNum);
  deltaRadius = new Array(particleNum);
  startAlpha = new Array(particleNum);
  deltaAlpha = new Array(particleNum);

  let particles = createParticle();
  animate(particles);
}
