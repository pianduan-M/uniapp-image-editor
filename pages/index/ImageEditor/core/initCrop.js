import { ToolModeEnum } from "../enum/imageEditorModeEnum";

export default class initCrop {
  x = 0;
  y = 0;

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
  isInGraph(x, y) {}

  draw() {}
}
