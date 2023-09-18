"use strict";
class IText {
  constructor({ text, x = 0, y = 0, color, fontSize = 14 }) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.fontSize = fontSize;
    this.maxWidth = 300;
  }
  get startX() {
    return this.x;
  }
  draw(ctx) {
    this.ctx = ctx;
    ctx.beginPath();
    ctx.setFontSize(this.fontSize);
    const texts = this.formatText(this.text);
    console.log(texts, "texts");
    let startY = this.y;
    texts.map((t) => {
      ctx.fillText(t, this.startX, startY);
      startY += this.fontSize * 1.5;
    });
  }
  formatText(text) {
    const result = [];
    text.split("\n").map((t) => {
      console.log(this.ctx.measureText(t), "this.ctx.measureText(t)");
      const w = this.startX + this.ctx.measureText(t).width;
      console.log(w, "w");
      if (w > this.maxWidth) {
        result.push(this.splitText(t));
      } else {
        result.push(t);
      }
    });
    return result.flat();
  }
  splitText(text) {
    const len = text.length;
    const result = [];
    let str = "";
    for (let i = 0; i < len; i++) {
      str += text[i];
      const w = this.startX + this.ctx.measureText(str).width;
      if (w > this.maxWidth) {
        result.push(str.slice(0, str.length - 1));
        str = text[i];
      }
    }
    if (str) {
      result.push(str);
    }
    console.log(result, "result");
    return result;
  }
}
exports.IText = IText;
