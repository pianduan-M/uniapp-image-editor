"use strict";
const common_vendor = require("../../../../common/vendor.js");
const pages_index_ImageEditor_enum_imageEditorModeEnum = require("../enum/imageEditorModeEnum.js");
const pages_index_ImageEditor_utils_index = require("../utils/index.js");
class InitBackgroundImage {
  constructor({ src, editor }) {
    this.imageWidth = null;
    this.imageHeight = null;
    this.startPoint = {
      x: 0,
      y: 0
    };
    this.distance = 0;
    this.editor = editor;
    if (src) {
      this.setBackgroundImage(src);
    }
    this.init();
  }
  init() {
    this.bindHandleTouchstart = this.handleTouchstart.bind(this);
    this.bindHandleTouchmove = this.handleTouchmove.bind(this);
    this.bindHandleTouchend = this.handleTouchend.bind(this);
    this.editor.on("touchstart", this.bindHandleTouchstart);
  }
  handleTouchstart(evt) {
    if (this.editor.mode !== pages_index_ImageEditor_enum_imageEditorModeEnum.ToolModeEnum.CROP) {
      return;
    }
    const touches = evt.touches;
    if (touches.length <= 1)
      return;
    this.originScale = {
      x: this.editor.scaleX,
      y: this.editor.scaleY
    };
    this.distance = pages_index_ImageEditor_utils_index.getDistance(touches[0], touches[1]);
    this.editor.on("touchmove", this.bindHandleTouchmove);
    this.editor.on("touchend", this.bindHandleTouchend);
  }
  handleTouchmove(evt) {
    const touches = evt.touches;
    if (touches.length >= 2) {
      const newDistance = pages_index_ImageEditor_utils_index.getDistance(touches[0], touches[1]);
      this.editor;
      const scale = newDistance / this.distance;
      this.distance = newDistance;
      this.editor.setScale(scale, scale);
    }
    this.editor.render();
  }
  handleTouchend(evt) {
    this.editor.off("touchmove", this.bindHandleTouchmove);
    this.editor.off("touchend", this.bindHandleTouchend);
  }
  setBackgroundImage(src) {
    this.src = src;
    common_vendor.index.getImageInfo({
      src,
      success: ({ width, height, path, orientation, type }) => {
        this.imageWidth = width;
        this.imageHeight = height;
        this.editor.render();
      },
      fail: (error) => {
      }
    });
  }
  draw(ctx) {
    if (!this.src || !this.imageWidth || !this.imageHeight)
      return;
    const imageWidth = this.imageWidth;
    const imageHeight = this.imageHeight;
    const canvasWidth = this.editor.canvasWidth;
    const canvasHeight = this.editor.canvasHeight;
    const imageRate = imageWidth / imageHeight;
    const canvasRate = canvasWidth / canvasHeight;
    let [dx, dy, dw, dh] = [];
    if (imageRate >= canvasRate) {
      dw = canvasWidth;
      dh = canvasWidth / imageRate;
    } else {
      dh = canvasHeight;
      dw = canvasHeight * imageRate;
    }
    dx = (canvasWidth - dw) / 2;
    dy = (canvasHeight - dh) / 2;
    const { scaleX, scaleY, translateX, translateY } = this.editor;
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(this.src, dx, dy, dw, dh);
  }
}
exports.InitBackgroundImage = InitBackgroundImage;
