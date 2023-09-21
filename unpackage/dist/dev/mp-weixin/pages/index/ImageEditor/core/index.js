"use strict";
const common_vendor = require("../../../../common/vendor.js");
const pages_index_ImageEditor_enum_imageEditorModeEnum = require("../enum/imageEditorModeEnum.js");
const pages_index_ImageEditor_core_initPaintRect = require("./initPaintRect.js");
const pages_index_ImageEditor_core_initBackgroundImage = require("./initBackgroundImage.js");
class ImageEditor extends common_vendor.eventsExports {
  constructor({ getContext, width, height }) {
    super();
    // object list
    this.objects = [];
    // tool mode
    this.mode = pages_index_ImageEditor_enum_imageEditorModeEnum.ToolModeEnum.CROP;
    // mode = null;
    this.translateX = 0;
    this.translateY = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.ctx = getContext();
    this.init();
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
  init() {
    new pages_index_ImageEditor_core_initPaintRect.InitPaintRect(this);
    this.backgroundImage = new pages_index_ImageEditor_core_initBackgroundImage.InitBackgroundImage({
      src: "/static/21695106089_.pic.jpg",
      editor: this
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
    }, 3e3);
  }
  setScale(scaleX, scaleY, centerX, centerY) {
    centerX = centerX || this.canvasWidth / 2;
    centerY = centerY || this.canvasHeight / 2;
    scaleX = scaleX < 0.3 ? 0.3 : scaleX;
    scaleX = scaleX > 10 ? 10 : scaleX;
    scaleY = scaleY < 0.3 ? 0.3 : scaleY;
    scaleY = scaleY > 10 ? 10 : scaleY;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.translateX = centerX * (1 - this.scaleX);
    this.translateY = centerY * (1 - this.scaleY);
  }
}
exports.ImageEditor = ImageEditor;
