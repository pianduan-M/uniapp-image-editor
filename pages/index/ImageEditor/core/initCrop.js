import { ToolModeEnum } from "../enum/imageEditorModeEnum";

export default class initCrop {
  x = 0;
  y = 0;
  lineWidth = 10;
  lineColor = "white";
  startPoint = {
    x: 0,
    y: 0,
  };
  controlSize = 30;

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

    this.init()
  }

  init() {
    this.bindHandleTouchstart = this.handleTouchstart.bind(this);
    this.bindHandleTouchmove = this.handleTouchmove.bind(this);
    this.bindHandleTouchend = this.handleTouchend.bind(this);

    this.editor.on("touchstart", this.bindHandleTouchstart);
  }

  handleTouchstart(evt) {
    if (this.editor.mode !== ToolModeEnum.CROP) {
      return;
    }

    const touch = evt.touches[0];

    this.isInGraph(touch.pageX, touch.pageY);

    this.editor.on("touchmove", this.bindHandleTouchmove);
    this.editor.on("touchend", this.bindHandleTouchend);
  }

  handleTouchmove(evt) {}

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
      x > this.dx &&
      x < this.dx + this.controlSize &&
      y > this.dy &&
      y < this.dy + this.controlSize
    ) {
      result = "leftTop";
    }

    // 右上角
    if (
      x > this.imageWidth - this.controlSize &&
      x < this.imageWidth &&
      y > this.dy &&
      y < this.dy + this.controlSize
    ) {
      result = "rightTop";
    }

    // 右下角

    if (
      x > this.imageWidth - this.controlSize &&
      x < this.imageWidth &&
      y > this.dy - this.controlSize &&
      y < this.imageHeight
    ) {
      result = "rightBottom";
    }

    // 左下角

    if (
      x > this.dx &&
      x < this.dx + this.controlSize &&
      y > this.dy - this.controlSize &&
      y < this.imageHeight
    ) {
      result = "leftBottom";
    }

    console.log(result);
  }

  draw() {
    const dx = this.canvasWidth / 2 - this.imageWidth / 2;
    const dy = this.canvasHeight / 2 - this.imageHeight / 2;

    this.dx = dx;
    this.dy = dy;

    this.ctx.setStrokeStyle(this.lineColor);
    this.ctx.setLineWidth(this.lineWidth);

    this.ctx.strokeRect(
      dx + this.lineWidth / 2,
      dy + this.lineWidth / 2,
      this.imageWidth - this.lineWidth,
      this.imageHeight - this.lineWidth
    );
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
}
