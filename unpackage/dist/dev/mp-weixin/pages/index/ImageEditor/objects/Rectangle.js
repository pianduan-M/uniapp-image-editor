"use strict";
const pages_index_ImageEditor_core_object = require("../core/object.js");
class Rectangle extends pages_index_ImageEditor_core_object.BasicObject {
  constructor({
    x,
    y,
    color = "transparent",
    lineCap = "square",
    stroke = "black"
  }) {
    super();
    this.color = color;
    this.startX = x;
    this.startY = y;
    this.endX = x;
    this.endY = y;
    this.lineCap = lineCap;
  }
  get minX() {
    return Math.min(this.startX, this.endX);
  }
  get maxX() {
    return Math.max(this.startX, this.endX);
  }
  get minY() {
    return Math.min(this.startY, this.endY);
  }
  get maxY() {
    return Math.max(this.startY, this.endY);
  }
  draw(ctx) {
    !this.ctx && (this.ctx = ctx);
    ctx.beginPath();
    this.transform();
    const minX = this.minX - (this.scaleX - 1) * this.scaleX;
    const minY = this.minY - (this.scaleY - 1) * this.scaleY;
    const maxX = this.maxX + (this.scaleX - 1) * this.maxX;
    const maxY = this.maxY + (this.scaleY - 1) * this.maxY;
    ctx.moveTo(minX, minY);
    ctx.lineTo(maxX, minY);
    ctx.lineTo(maxX, maxY);
    ctx.lineTo(minX, maxY);
    ctx.lineTo(minX, minY);
    ctx.setFillStyle(this.color);
    ctx.fill();
    ctx.setLineCap(this.lineCap);
    ctx.setStrokeStyle(this.stroke);
    ctx.setLineWidth(3);
    ctx.stroke();
    this.resetTransform();
  }
  isInside(x, y) {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }
  setMoveStart(x, y) {
    this.moveStartX = x;
    this.moveStartY = y;
  }
  move(x, y) {
    const diffX = x - this.moveStartX;
    const diffY = y - this.moveStartY;
    this.moveStartX = x;
    this.moveStartY = y;
    this.startX += diffX;
    this.startY += diffY;
    this.endX += diffX;
    this.endY += diffY;
  }
  getObjectCenter() {
    const w = this.maxX - this.minX;
    const h = this.maxY - this.minY;
    return {
      x: this.minX + w / 2,
      y: this.minY + h / 2
    };
  }
}
exports.Rectangle = Rectangle;
