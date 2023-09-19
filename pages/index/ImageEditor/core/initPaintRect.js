import { ToolModeEnum } from "../enum/imageEditorModeEnum";
import Rectangle from "../objects/Rectangle";

export default class InitPaintRect {
  constructor(editor) {
    this.editor = editor;
    this.isMove = false;
    this.activeObject = null;
    this.startDistance = null;
    this.init();
  }

  init() {
    this.bindHandleTouchstart = this.handleTouchstart.bind(this);
    this.bindHandleTouchmove = this.handleTouchmove.bind(this);
    this.bindHandleTouchend = this.handleTouchend.bind(this);

    this.editor.on("touchstart", this.bindHandleTouchstart);
  }

  handleTouchstart(evt) {
    if (this.editor.mode !== ToolModeEnum.RECT) {
      return;
    }
    const touches = evt.touches;
    const event = touches[0];
    const x = event.clientX;
    const y = event.clientY;

    let obj = this.editor.getInsideObj.call(this.editor, { x, y });

    if (obj) {
      this.isMove = true;

      if (touches.length === 1) {
        obj.setMoveStart(x, y);
      } else {
        const distance = obj.getDistance(evt);
        obj.setStartDistance(distance);
      }
    } else {
      this.isMove = false;

      if (evt.touches.length === 1) {
        obj = new Rectangle({ color: "transparent", x, y });
        this.editor.add(obj);
      } else {
        return;
      }
    }

    this.activeObject = obj;

    this.editor.on("touchmove", this.bindHandleTouchmove);
    this.editor.on("touchend", this.bindHandleTouchend);
  }

  handleTouchmove(evt) {
    const touches = evt.touches;
    const event = touches[0];
    const x = event.clientX;
    const y = event.clientY;

    if (this.isMove) {
      if (touches.length === 1) {
        this.activeObject && this.activeObject.move(x, y);
      } else {
        const distance = this.activeObject.getDistance(evt);
        this.activeObject.calcScale(distance);
      }
    } else {
      this.activeObject.endX = x;
      this.activeObject.endY = y;
    }
    this.editor.render();
  }

  handleTouchend() {
    this.editor.off("touchmove", this.bindHandleTouchmove);
    this.editor.off("touchend", this.bindHandleTouchend);
    this.activeObject && this.activeObject.handleTouchend();
    this.activeObject = null;
  }
}
