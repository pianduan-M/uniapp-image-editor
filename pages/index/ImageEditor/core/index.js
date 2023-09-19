import EventEmitter from "events";
import { ToolModeEnum } from "../enum/imageEditorModeEnum.js";
import InitPaintRect from "./initPaintRect.js";
import InitBackgroundImage from "./initBackgroundImage.js";

export class ImageEditor extends EventEmitter {
  // canvas context
  ctx;
  // object list
  objects = [];
  // tool mode
  // mode = ToolModeEnum.RECT;
  mode = null;
  translateX = 0
  translateY = 0;
  scaleX = 1
  scaleY = 1;

  constructor({ getContext, width, height }) {
    super();
    this.ctx = getContext();
    this.init();
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  init() {
    new InitPaintRect(this);

    this.backgroundImage = new InitBackgroundImage({
      src: "/static/21695106089_.pic.jpg",
      editor: this,
    });

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

    this.backgroundImage.draw(this.ctx);

    this.objects.forEach((obj) => {
      obj.draw(this.ctx);
    });

    this.ctx.draw();
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

  setScale(scaleX, scaleY) {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.translateX = this.canvasWidth / 2 * (1 - this.scaleX);
    this.translateY = this.canvasHeight / 2 * (1 - this.scaleY);

   
  }
}
