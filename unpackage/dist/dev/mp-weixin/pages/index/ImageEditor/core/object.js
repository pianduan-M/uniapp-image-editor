"use strict";
const pages_index_ImageEditor_utils_index = require("../utils/index.js");
class BasicObject {
  constructor() {
    this.isActive = false;
    this.scaleX = 1;
    this.scaleY = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.rotate = 0;
    this.startDistance = 0;
    this.moveScale = 0;
  }
  transform() {
    this.ctx.save();
    this.getObjectCenter();
    this.ctx.rotate(this.rotate);
  }
  resetTransform() {
    this.ctx.restore();
  }
  setActiveState(state) {
    this.isActive = !!state;
  }
  getDistance(e) {
    const touches = e.touches;
    return pages_index_ImageEditor_utils_index.getDistance(touches[0], touches[1]);
  }
  getAngle(e) {
    const touches = e.touches;
    return pages_index_ImageEditor_utils_index.getAngle(touches[0], touches[1]);
  }
  setStartDistance(distance) {
    this.startDistance = distance;
  }
  calcScale(distance) {
    const scale = distance / this.startDistance;
    this.moveScale = scale;
  }
  handleTouchend() {
    console.log("handleTouchend");
    this.scaleX += this.moveScale;
    this.scaleY += this.moveScale;
    this.moveScale = 0;
  }
}
exports.BasicObject = BasicObject;
