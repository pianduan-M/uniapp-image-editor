import { getDistance, getAngle } from "../utils/index";

export class BasicObject {
  isActive = false;
  scaleX = 1;
  scaleY = 1;
  translateX = 0;
  translateY = 0;
  rotate = 0;
  startDistance = 0;
  moveScale = 0;

  constructor() {}

  transform() {
    this.ctx.save();

    const { x, y } = this.getObjectCenter();

    // this.ctx.translate(x, y);
    // this.ctx.scale(this.scaleX + this.moveScale, this.scaleY + this.moveScale);
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
    return getDistance(touches[0], touches[1]);
  }

  getAngle(e) {
    const touches = e.touches;
    return getAngle(touches[0], touches[1]);
  }

  setStartDistance(distance) {
    this.startDistance = distance;
  }

  calcScale(distance) {
    const scale = distance / this.startDistance;
    this.moveScale = scale;
  }

  handleTouchend() {
    console.log('handleTouchend');
    this.scaleX += this.moveScale;
    this.scaleY += this.moveScale;
    this.moveScale = 0;
  }
}
