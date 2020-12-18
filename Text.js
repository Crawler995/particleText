/*
 * 文本属性：内容，字体大小，分割后像素大小，文字像素矩阵，文字像素坐标
*/
class Text {
  constructor(text, fontSize, pixelSize) {
    this.text = text;
    this.fontSize = fontSize;
    this.pixelSize = pixelSize;
    this.textPixelMatrix = [];
    this.textPixelPosArray = [];
  }

  // 画出文本，获得文本像素信息，及文本像素点坐标
  init() {
    for(let i = 0; i < this.text.length; i++) {
      this.drawText(i);
      this.getTextPixelMatrix();
      this.getPixelPosArray(i);
    }
  }

  drawText(index) {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.font = '' + this.fontSize + 'px Arial';
    ctx.textBaseline = 'hanging';
    ctx.textAlign = 'center';
    ctx.fillText(this.text[index], w/2, h/2 - this.fontSize);
  }

  getTextPixelMatrix() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    const curTextPixelData = ctx.getImageData(0, 0, w, h).data;
    const pixelNumX = Math.floor(w / this.pixelSize);
    const pixelNumY = Math.floor(h / this.pixelSize);

    ctx.clearRect(0, 0, w, h);

    let curTextPixelMatrix = [];

    for(let i = 0; i < pixelNumY; i++) {
      let curRowTextPixelMatrix = [];
      for(let j = 0; j < pixelNumX; j++) {
        let blackPixelNum = 0;
        for(let r = 0; r < this.pixelSize; r++) {
          for(let c = 0; c < this.pixelSize; c++) {
            const x = j * this.pixelSize + c;
            const y = i * this.pixelSize + r;

            const index = (y * w + x) * 4;
            const red = curTextPixelData[index];

            blackPixelNum += (red === 0 ? 1 : 0);
          }
        }
        curRowTextPixelMatrix.push(blackPixelNum > parseInt(this.pixelSize * this.pixelSize / 4));
      }
      curTextPixelMatrix.push(curRowTextPixelMatrix);
    }
    this.textPixelMatrix.push(curTextPixelMatrix);
  }

  getPixelPos(i, j) {
    const tx = j * this.pixelSize + this.pixelSize / 2;
    const ty = i * this.pixelSize + this.pixelSize / 2;

    return {x:tx, y:ty};
  }

  getPixelPosArray(index) {
    let curTextPixelPosArray = [];
    for(let i = 0; i < this.textPixelMatrix[index].length; i++) {
      for(let j = 0; j < this.textPixelMatrix[index][0].length; j++) {
        if(this.textPixelMatrix[index][i][j]) {
          curTextPixelPosArray.push(this.getPixelPos(i, j));
        }
      }
    }

    this.textPixelPosArray.push(curTextPixelPosArray);
  }

  getMostNeedParticleNum() {
    let res = 0;
    for(let i = 0; i < this.textPixelPosArray.length; i++) {
      const tmp = this.textPixelPosArray[i].length;
      res = (tmp > res) ? tmp : res;
    }
    return res;
  }
}