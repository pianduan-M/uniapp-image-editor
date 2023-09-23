import { ToolModeEnum, CropControlEnum } from "../enum/imageEditorModeEnum";

export default class InitPaint {
  lineWidth = 10;
  color = "red";

  constructor({ editor }) {
    this.editor = editor;
    this.ctx = this.editor.ctx2;
    this.init();
  }
  init() {
    this.bindHandleTouchstart = this.handleTouchstart.bind(this);
    this.bindHandleTouchmove = this.handleTouchmove.bind(this);
    this.bindHandleTouchend = this.handleTouchend.bind(this);

    this.editor.on("touchstart", this.bindHandleTouchstart);
  }

  handleTouchstart(evt) {
    if (this.editor.mode !== ToolModeEnum.PAINT) {
      return;
    }

    const touch = evt.touches[0];

    const x = touch.pageX;
    const y = touch.pageY;

    this.startPoint = {
      x,
      y,
    };
    this.startDraw();
    this.draw(x, y);

    this.editor.on("touchmove", this.bindHandleTouchmove);
    this.editor.on("touchend", this.bindHandleTouchend);
  }

  handleTouchmove(evt) {
    const touch = evt.touches[0];
  }

  handleTouchend(evt) {
    this.editor.off("touchmove", this.bindHandleTouchmove);
    this.editor.off("touchend", this.bindHandleTouchend);
  }

  startDraw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.beginPath();
    this.ctx.setStrokeStyle(this.color);
    this.ctx.setLineWidth(this.lineWidth);
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
  }

  draw(x, y) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.draw();
  }

  get canvasWidth() {
    return this.editor.canvasWidth;
  }

  get canvasHeight() {
    return this.editor.canvasHeight;
  }
}
