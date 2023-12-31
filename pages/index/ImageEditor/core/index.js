import EventEmitter from "events";
import { ToolModeEnum } from "../enum/imageEditorModeEnum.js";
import InitPaintRect from "./initPaintRect.js";
import InitBackgroundImage from "./initBackgroundImage.js";
import InitCrop from "./initCrop.js";
import InitPaint from "./initPaint.js";

export class ImageEditor extends EventEmitter {
  // canvas context
  ctx;
  // 用来绘制剪切框，画笔
  ctx2;
  // object list
  objects = [];
  // tool mode
  mode = ToolModeEnum.PAINT;
  // mode = null;
  scale = 1;
  centerPoint = [0, 0];
  viewportTransform = [1, 0, 0, 1, 0, 0];
  angle = Math.PI / 2;

  defaultScale = 5;

  constructor({ getContext, getBottomContext, width, height }) {
    super();
    this.ctx = getContext();
    this.ctx2 = getBottomContext();
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.init();
  }

  init() {
    new InitPaintRect(this);
    this.setCenterPoint([this.canvasWidth / 2, this.canvasHeight / 2]);

    this.backgroundImage = new InitBackgroundImage({
      src: "/static/21695106089_.pic.jpg",
      editor: this,
      cropCtx: this.ctx2,
    });

    this.crop = new InitCrop({ editor: this, ctx: this.ctx2 });

    this.paint = new InitPaint({ editor: this });

    this.render();
  }

  onTouchstart(evt) {
    this.emit("touchstart", evt);
  }

  onTouchmove(evt) {
    this.emit("touchmove", evt);
  }

  onTouchend(evt) {
    this.emit("touchend", evt);
  }

  add(obj) {
    this.objects.push(obj);
  }

  remove(obj) {
    const index = this.objects.findIndex((d) => d === obj);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    const [scaleX, s1, s2, scaleY, offsetX, offsetY] = this.viewportTransform;

    const [centerX, centerY] = this.centerPoint;

    this.ctx.translate(centerX, centerY);
    this.ctx.scale(scaleX * this.defaultScale, scaleY * this.defaultScale);
    this.ctx.rotate(this.angle);
    this.ctx.translate(-centerX, -centerY);

    this.ctx.translate(...this.transform(offsetX, offsetY, this.angle));

    this.backgroundImage.draw(this.ctx);

    this.objects.forEach((obj) => {
      obj.draw(this.ctx);
    });

    this.ctx.draw();
    this.ctx.restore();
  }

  getActiveObject() {
    const existItem = this.objects.find((obj) => obj.isActive);
    return existItem;
  }

  getInsideObj({ x, y }) {
    const len = this.objects.length - 1;
    for (let i = len; i >= 0; i--) {
      const obj = this.objects[i];

      if (obj.isInside(x, y)) {
        this.setActiveObject(obj);
        return obj;
      }
    }
  }

  setActiveObject(obj) {
    this.objects.forEach((d) => d.setActiveState(false));

    this.timer && clearTimeout(this.timer);
    obj.setActiveState(true);
    this.render();

    this.timer = setTimeout(() => {
      obj.setActiveState(false);
      this.render();
    }, 3000);
  }

  setViewportTransform(viewportTransform) {
    this.viewportTransform = viewportTransform;
  }

  setCenterPoint(point) {
    this.centerPoint = point;
  }

  // 根据旋转角度转换坐标
  transform(x, y, angle) {
    angle = angle || this.angle;
    const dx = x * Math.cos(angle) + y * Math.sin(angle);
    const dy = -x * Math.sin(angle) + y * Math.cos(angle);

    return [dx, dy];
  }

  getOffset() {
    const [scaleX, s1, s2, scaleY, offsetX, offsetY] = this.viewportTransform;

    return this.transform(offsetX, offsetY, this.angle);
  }

  getZoom() {
    const [scale] = this.viewportTransform;

    return scale * this.defaultScale;
  }
}
