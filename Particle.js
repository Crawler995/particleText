/*
 * 粒子属性：坐标，半径，速度（两个分量），加速度，颜色
 * 粒子方法：碰撞检测，运动（逐帧自由运动，ease-out/in插值运动），半径插值变化，绘制
*/
class Particle {
  constructor(posX, posY, radius, velX, velY, accelerationX, accelerationY, alpha, type) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius;
    // 速度，加速度单位为px/f, px/f²（f为帧）
    this.velX = velX;
    this.velY = velY;
    this.accelerationX = accelerationX;
    this.accelerationY = accelerationY;
    this.alpha = alpha;
    this.type = type;
  }

  // 碰撞检测
  outOfHorizontalBorder() {
    const h = document.documentElement.clientHeight;
    return this.posY < this.radius || this.posY > h - this.radius;
  }

  outOfVerticalBorder() {
    const w = document.documentElement.clientWidth;
    return this.posX < this.radius || this.posX > w - this.radius;
  }

  // 逐帧自由运动
  movePerFrame() { 
    if(this.type === 'free') {
      this.posX += this.velX;
      this.posY += this.velY;
      this.velX += this.accelerationX;
      this.velY += this.accelerationY;
      if(this.posY > h) {
        this.posY = -this.radius;
      } else if (this.posY < -this.radius) {
        this.velY = -this.velY;
      }

      if(this.outOfVerticalBorder()) {
        this.velX = -this.velX;
      }
    }
  }

  // ease-out插值运动
  easeOutMoveTo(dX, dY, sX, sY, t) {
    this.type = 'unfree';
    this.posX = dX * ((t - 1)*(t - 1)*(t - 1) + 1) + sX;
    this.posY = dY * ((t - 1)*(t - 1)*(t - 1) + 1) + sY;
  }

  // ease-in插值运动
  easeInMoveTo(dX, dY, sX, sY, t) {
    this.type = 'free';
    this.posX = dX * t * t * t + sX;
    this.posY = dY * t * t * t + sY;
  }

  easeOutRadiusChange(dr, sr, t) {
    this.radius = dr * ((t - 1)*(t - 1)*(t - 1) + 1) + sr;
  }

  easeInRadiusChange(dr, sr, t) {
    this.radius = dr * t * t * t + sr;
  }

  easeOutAlphaChange(dr, sr, t) {
    this.alpha = dr * ((t - 1)*(t - 1)*(t - 1) + 1) + sr;
  }

  easeInAlphaChange(dr, sr, t) {
    this.alpha = dr * t * t * t + sr;
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha}`;
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI*2, true);
    ctx.fill();
  }
}