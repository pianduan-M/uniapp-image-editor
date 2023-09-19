import { ToolModeEnum } from "../enum/imageEditorModeEnum";
import { getDistance, getAngle } from "../utils/index";


export default class InitBackgroundImage {
  imageWidth = null;
  imageHeight = null;

  constructor({ src, editor }) {
    this.editor = editor;
    if (src) {
      this.setBackgroundImage(src);
    }
    this.init;
  }

  init() {
    this.bindHandleTouchstart = this.handleTouchstart.bind(this);
    this.bindHandleTouchmove = this.handleTouchmove.bind(this);
    this.bindHandleTouchend = this.handleTouchend.bind(this);

    this.editor.on("touchstart", this.bindHandleTouchstart);
  }
  handleTouchstart(evt) {
    if (this.editor.mode !== ToolModeEnum.CROP) {
      return;
    }

    const touches = evt.touches;
    if (touches.length <= 1) return;


  }
  handleTouchmove(evt) {}
  handleTouchend(evt) {}

  setBackgroundImage(src) {
    this.src = src;
    uni.getImageInfo({
      src,
      success: ({ width, height, path, orientation, type }) => {
        this.imageWidth = width;
        this.imageHeight = height;
        this.editor.render();
      },
      fail: (error) => {},
    });
  }

  draw(ctx) {
    if (!this.src || !this.imageWidth || !this.imageHeight) return;
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

    // ctx.restore();d
    // ctx.save();
    // ctx.rect(dx, dy, dw, dh);
    // ctx.clip();

    const { scaleX, scaleY, translateX, translateY } = this.editor;
    console.log(scaleX, scaleY, translateX, translateY);
    ctx.setTransform(
      this.editor.scaleX,
      0,
      0,
      this.editor.scaleY,
      this.editor.translateX,
      this.editor.translateY
    );

    ctx.drawImage(this.src, dx, dy, dw, dh);
  }
}
