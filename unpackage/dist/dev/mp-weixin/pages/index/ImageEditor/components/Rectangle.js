"use strict";
class Rectangle {
  constructor({
    x,
    y,
    color = "transparent",
    lineCap = "square",
    stroke = "black"
  }) {
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
    ctx.beginPath();
    ctx.moveTo(this.minX, this.minY);
    ctx.lineTo(this.maxX, this.minY);
    ctx.lineTo(this.maxX, this.maxY);
    ctx.lineTo(this.minX, this.maxY);
    ctx.lineTo(this.minX, this.minY);
    ctx.setFillStyle(this.color);
    ctx.fill();
    ctx.setLineCap(this.lineCap);
    ctx.setStrokeStyle(this.stroke);
    ctx.setLineWidth(3);
    ctx.stroke();
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
}
exports.Rectangle = Rectangle;
