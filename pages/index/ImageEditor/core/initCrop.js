import { ToolModeEnum, CropControlEnum } from "../enum/imageEditorModeEnum";

export default class initCrop {
  x = 0;
  y = 0;
  lineWidth = 2;
  lineColor = "white";
  startPoint = {
    x: 0,
    y: 0,
  };
  controlSize = 30;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  hotWidth = 10;
  minWidth = 30;
  minHeight = 30;

  // 4个顶点坐标
  square = [
    [this.x, this.y],
    [this.x + this.w, this.y],
    [this.x + this.w, this.y + this.h],
    [this.x, this.y + this.h],
  ];

  constructor({ ctx, editor }) {
    this.ctx = ctx;
    this.editor = editor;

    this.init();
  }

  init() {
    this.bindHandleTouchstart = this.handleTouchstart.bind(this);
    this.bindHandleTouchmove = this.handleTouchmove.bind(this);
    this.bindHandleTouchend = this.handleTouchend.bind(this);
  }

  startCrop() {
    let dx = this.canvasWidth / 2 - this.imageWidth / 2,
      dy = this.canvasHeight / 2 - this.imageHeight / 2,
      width = this.imageWidth,
      height = this.imageHeight;

    dx = dx < 0 ? 0 : dx;
    dy = dy < 0 ? 0 : dy;
    width = width > this.canvasWidth ? this.canvasWidth : width;
    height = height > this.canvasHeight ? this.canvasHeight : height;

    this.x = dx;
    this.y = dy;

    this.width = width;
    this.height = height;

    this.editor.on("touchstart", this.bindHandleTouchstart);

    this.draw();
  }

  handleTouchstart(evt) {
    if (this.editor.mode !== ToolModeEnum.CROP) {
      return;
    }

    console.log(this.maxPoint, this.y, this.x);

    const touch = evt.touches[0];
    const action = this.isInGraph(touch.pageX, touch.pageY);

    if (action) {
      this.action = action;

      this.startPoint = {
        x: touch.pageX,
        y: touch.pageY,
      };

      this.editor.on("touchmove", this.bindHandleTouchmove);
      this.editor.on("touchend", this.bindHandleTouchend);
    } else {
      this.editor.backgroundImage.handleTouchstart(evt);
      this.getClipSize();
    }
  }

  handleTouchmove(evt) {
    const touch = evt.touches[0];
    let x = touch.pageX;
    let y = touch.pageY;

    x = x < 0 ? 0 : x;
    x = x > this.canvasWidth ? this.canvasWidth : x;

    y = y < 0 ? 0 : y;
    y = y > this.canvasHeight ? this.canvasHeight : y;

    const distanceX = x - this.startPoint.x;
    const distanceY = y - this.startPoint.y;

    let startX, startY, width, height;

    switch (this.action) {
      case CropControlEnum.LEFT_TOP:
        startX = this.x + distanceX;
        startY = this.y + distanceY;
        width = this.width - distanceX;
        height = this.height - distanceY;

        break;
      case CropControlEnum.RIGHT_TOP:
        startY = this.y + distanceY;
        width = this.width + distanceX;
        height = this.height - distanceY;

        break;
      case CropControlEnum.RIGHT_BOTTOM:
        width = this.width + distanceX;
        height = this.height + distanceY;

        break;
      case CropControlEnum.LEFT_BOTTOM:
        startX = this.x + distanceX;
        width = this.width - distanceX;
        height = this.height + distanceY;

        break;
      case CropControlEnum.LEFT:
        startX = this.x + distanceX;
        width = this.width - distanceX;

        break;
      case CropControlEnum.TOP:
        startY = this.y + distanceY;
        height = this.height - distanceY;

        break;
      case CropControlEnum.RIGHT:
        width = this.width + distanceX;
        break;
      case CropControlEnum.BOTTOM:
        height = this.height + distanceY;
        break;

      default:
        break;
    }

    this.startPoint = { x, y };

    if (startX < 0) {
      startX = 0;
      width = this.width + this.x;
    }

    if (startX + this.minWidth > this.x + this.width) {
      startX = this.x + this.width - this.minWidth;
      width = this.minWidth;
    }

    if (startY < 0) {
      startY = 0;
      height = this.height + this.y;
    }

    if (startY + this.minHeight > this.y + this.height) {
      startY = this.y + this.height - this.minHeight;
      height = this.minHeight;
    }

    if (typeof startX === "undefined" && width < this.minWidth) {
      width = this.minWidth;
    }

    if (typeof startY === "undefined" && height < this.minHeight) {
      height = this.minHeight;
    }

    if (startX < this.minPoint.x) {
      startX = this.minPoint.x;
      width = this.width + (this.x - this.minPoint.x);
    }

    if (startY < this.minPoint.y) {
      startY = this.minPoint.y;
      height = this.height + (this.y - this.minPoint.y);
    }

    if (typeof startX === "undefined" && this.x + width > this.maxPoint.x) {
      width = this.maxPoint.x - this.x;
    }

    if (typeof startY === "undefined" && this.y + height > this.maxPoint.y) {
      height = this.maxPoint.y - this.y;
    }

    typeof startX !== "undefined" && (this.x = startX);
    typeof startY !== "undefined" && (this.y = startY);
    typeof width !== "undefined" && (this.width = width);
    typeof height !== "undefined" && (this.height = height);

    this.draw();
  }

  handleTouchend(evt) {
    this.editor.off("touchmove", this.bindHandleTouchmove);
    this.editor.off("touchend", this.bindHandleTouchend);
  }

  /**
   * 判断点击的坐标落在哪个区域
   * @param {*} x 点击的坐标
   * @param {*} y 点击的坐标
   */
  isInGraph(x, y) {
    let result = false;

    // 左上角
    if (
      x >= this.x - this.controlSize / 2 &&
      x <= this.x + this.controlSize / 2 &&
      y >= this.y - this.controlSize / 2 &&
      y <= this.y + this.controlSize / 2
    ) {
      result = CropControlEnum.LEFT_TOP;
    }

    // 右上角
    else if (
      x >= this.x + this.width - this.controlSize &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.controlSize
    ) {
      result = CropControlEnum.RIGHT_TOP;
    }

    // 右下角
    else if (
      x >= this.x + this.width - this.controlSize &&
      x <= this.x + this.width &&
      y >= this.y + this.height - this.controlSize / 2 &&
      y <= this.y + this.height + this.controlSize / 2
    ) {
      result = CropControlEnum.RIGHT_BOTTOM;
    }

    // 左下角
    else if (
      x >= this.x - this.controlSize / 2 &&
      x <= this.x + this.controlSize / 2 &&
      y >= this.y + this.height - this.controlSize / 2 &&
      y <= this.y + this.height + this.controlSize / 2
    ) {
      result = CropControlEnum.LEFT_BOTTOM;
    }

    // 左
    else if (
      x >= this.x - this.hotWidth / 2 &&
      x <= this.x + this.hotWidth &&
      y >= this.y + this.controlSize / 2 &&
      y <= this.y + this.height - this.controlSize / 2
    ) {
      result = CropControlEnum.LEFT;
    }

    // 上
    else if (
      x >= this.x + this.controlSize / 2 &&
      x <= this.x + this.width - this.controlSize / 2 &&
      y > this.y &&
      y < this.y + this.hotWidth
    ) {
      result = CropControlEnum.TOP;
    }

    // 右
    else if (
      x >= this.x + this.width - this.hotWidth &&
      x <= this.x + this.width &&
      y >= this.y + this.controlSize / 2 &&
      y <= this.y + this.height - this.controlSize / 2
    ) {
      result = CropControlEnum.RIGHT;
    }

    // 下
    else if (
      x >= this.x + this.controlSize / 2 &&
      x <= this.x + this.width - this.controlSize / 2 &&
      y >= this.y + this.height - this.hotWidth &&
      y <= this.y + this.height
    ) {
      result = CropControlEnum.BOTTOM;
    }

    return result;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.ctx.setStrokeStyle(this.lineColor);
    this.ctx.setLineWidth(this.lineWidth);

    this.ctx.strokeRect(
      this.x + this.lineWidth / 2,
      this.y + this.lineWidth / 2,
      this.width - this.lineWidth,
      this.height - this.lineWidth
    );

    this.drawLine();
    this.drawHotCorner();

    this.ctx.draw();
  }

  drawLine() {
    const num = 3;

    const itemW = this.width / num;
    const itemH = this.height / num;

    for (let i = 0; i < num; i++) {
      // 竖线
      this.ctx.beginPath();
      this.ctx.setStrokeStyle(this.lineColor);
      this.ctx.setLineWidth(this.lineWidth);
      let x = this.x + itemW * (1 + i);
      let y = this.y + this.height;
      this.ctx.moveTo(x, this.y);
      this.ctx.lineTo(x, y);
      this.ctx.closePath();
      this.ctx.stroke();

      // 横线
      this.ctx.beginPath();
      x = this.x + this.width;
      y = this.y + itemH * (1 + i);
      this.ctx.moveTo(this.x, y);
      this.ctx.lineTo(x, y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  drawHotCorner() {
    this.ctx.beginPath();
    this.ctx.setStrokeStyle(this.lineColor);
    this.ctx.setLineWidth(this.lineWidth * 2);

    // 左上角
    this.ctx.moveTo(this.x + this.controlSize / 2, this.y);
    this.ctx.lineTo(this.x, this.y);
    this.ctx.lineTo(this.x, this.y + this.controlSize / 2);

    // 右上角
    this.ctx.moveTo(this.x + this.width - this.controlSize / 2, this.y);
    this.ctx.lineTo(this.x + this.width, this.y);
    this.ctx.lineTo(this.x + this.width, this.y + this.controlSize / 2);

    // 右下角
    this.ctx.moveTo(
      this.x + this.width,
      this.y + this.height - this.controlSize / 2
    );
    this.ctx.lineTo(this.x + this.width, this.y + this.height);
    this.ctx.lineTo(
      this.x + this.width - this.controlSize / 2,
      this.y + this.height
    );

    // 右上角
    this.ctx.moveTo(this.x, this.y + this.height - this.controlSize / 2);
    this.ctx.lineTo(this.x, this.y + this.height);
    this.ctx.lineTo(this.x + this.controlSize / 2, this.y + this.height);

    this.ctx.stroke();
  }

  get canvasWidth() {
    return this.editor.canvasWidth;
  }

  get canvasHeight() {
    return this.editor.canvasHeight;
  }

  get imageWidth() {
    return this.editor.backgroundImage._getWidth;
  }

  get imageHeight() {
    return this.editor.backgroundImage._getHeight;
  }

  get minPoint() {
    const [imageWidth, imageHeight] =
      this.editor.backgroundImage.getImageSize();
    const zoom = this.editor.getZoom();
    const [offsetX, offsetY] = this.editor.getOffset();

    const x = (this.canvasWidth - Math.abs(imageWidth) * zoom) / 2 + offsetX;

    const y = (this.canvasHeight - Math.abs(imageHeight) * zoom) / 2 + offsetY;

    return { x, y };
  }

  get maxPoint() {
    const [offsetX, offsetY] = this.editor.getOffset();

    const x =
      (this.canvasWidth - this.imageWidth) / 2 + offsetX + this.imageWidth;

    const y =
      (this.canvasHeight - this.imageHeight) / 2 + offsetY + this.imageHeight;

    return { x, y };
  }

  getClipSize() {
    const imageRate = this.width / this.height;
    const canvasRate = this.canvasWidth / this.canvasHeight;
    let [dw, dh, scale] = [];

    const dx = (this.canvasWidth - this.width) / 2 - this.x;
    const dy = (this.canvasHeight - this.height) / 2 - this.y;

    this.x += dx;
    this.y += dy;

    if (imageRate >= canvasRate) {
      dw = this.canvasWidth;
      dh = this.canvasWidth / imageRate;
      this.x = 0;
      this.y = (this.canvasHeight - dh) / 2;
    } else {
      dh = this.canvasHeight;
      dw = this.canvasHeight * imageRate;
      this.y = 0;
      this.x = (this.canvasWidth - dw) / 2;
    }

    scale = dw / this.width;

    this.width = dw;
    this.height = dh;

    const viewportTransform = this.editor.viewportTransform;
    const zoom = this.editor.getZoom();

    viewportTransform[0] *= scale;
    viewportTransform[3] *= scale;

    viewportTransform[4] += dx / zoom;
    viewportTransform[5] += dy / zoom;

    console.log(viewportTransform, scale, "viewportTransform");

    this.editor.render();

    this.draw();

    uni.canvasToTempFilePath({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      canvasId: "canvasTop",
      success(response) {
        console.log(response, "response");
        uni.saveImageToPhotosAlbum({
          filePath: response.tempFilePath,
          success: (response) => {
            console.log(response);
          },
          fail: (response) => {
            console.log(response);
          },
        });
      },
    });
  }
}
