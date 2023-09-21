import { ToolModeEnum } from "../enum/imageEditorModeEnum";
import { getDistance, getAngle } from "../utils/index";

export default class InitBackgroundImage {
  imageWidth = null;
  imageHeight = null;
  startPoint = {
    x: 0,
    y: 0,
  };
  distance = 0;

  constructor({ src, editor }) {
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
    if (this.editor.mode !== ToolModeEnum.CROP) {
      return;
    }

    const touches = evt.touches;

    if (touches.length <= 1) {
      this.handleMoveStart(evt);
    } else {
      this.originScale = {
        x: this.editor.scaleX,
        y: this.editor.scaleY,
      };

      this.distance = getDistance(touches[0], touches[1]);
    }

    this.editor.on("touchmove", this.bindHandleTouchmove);
    this.editor.on("touchend", this.bindHandleTouchend);
  }
  handleTouchmove(evt) {
    const touches = evt.touches;
    if (touches.length >= 2) {
      const newDistance = getDistance(touches[0], touches[1]);

      const scale = newDistance / this.distance - 1;
      this.distance = newDistance;

      const viewportTransform = this.editor.viewportTransform;

      let scaleX = viewportTransform[0] + scale;

      scaleX = scaleX > 10 ? 10 : scaleX;
      scaleX = scaleX < 0.1 ? 0.1 : scaleX;

      viewportTransform[0] = scaleX;
      viewportTransform[3] = scaleX;

      this.editor.setViewportTransform(viewportTransform);
    } else {
      this.handleMove(evt);
    }

    this.editor.render();
  }
  handleTouchend(evt) {
    this.handleMoveEnd();
    this.editor.off("touchmove", this.bindHandleTouchmove);
    this.editor.off("touchend", this.bindHandleTouchend);
  }

  transformPoint(point) {
    const viewportTransform = this.editor.viewportTransform;

    point[0] -= viewportTransform[4];
    point[1] -= viewportTransform[5];
    point[0] /= viewportTransform[0];
    point[1] /= viewportTransform[0];
    return point;
  }

  setBackgroundImage(src) {
    this.src = src;
    uni.getImageInfo({
      src,
      success: ({ width, height, path, orientation, type }) => {
        const canvasWidth = this.editor.canvasWidth;
        const canvasHeight = this.editor.canvasHeight;

        const imageRate = width / height;
        const canvasRate = canvasWidth / canvasHeight;
        let [dx, dy, dw, dh] = [];
        if (imageRate >= canvasRate) {
          dw = canvasWidth;
          dh = canvasWidth / imageRate;
        } else {
          dh = canvasHeight;
          dw = canvasHeight * imageRate;
        }

        this.imageWidth = dw;
        this.imageHeight = dh;
        this.dx = canvasWidth / 2 - dw / 2;
        this.dy = canvasHeight / 2 - dh / 2;

        const viewportTransform = this.editor.viewportTransform;
        viewportTransform[4] -= canvasWidth / 2;
        viewportTransform[5] -= canvasHeight / 2;

        this.editor.setViewportTransform(viewportTransform);

        this.editor.render();
      },
      fail: (error) => {},
    });
  }

  draw(ctx) {
    if (!this.src || !this.imageWidth || !this.imageHeight) return;
    const imageWidth = this.imageWidth;
    const imageHeight = this.imageHeight;

    ctx.drawImage(this.src, this.dx, this.dy, imageWidth, imageHeight);
  }

  handleMoveStart(evt) {
    const touch = evt.touches[0];
    this.startPoint = {
      x: touch.pageX,
      y: touch.pageY,
    };
  }

  handleMove(evt) {
    const touch = evt.touches[0];
    const movePoint = {
      x: touch.pageX,
      y: touch.pageY,
    };

    const x = this.startPoint.x - movePoint.x;
    const y = this.startPoint.y - movePoint.y;
    this.startPoint = movePoint;

    const viewportTransform = this.editor.viewportTransform;

    viewportTransform[4] += -x;

    viewportTransform[5] += -y;

    this.editor.setViewportTransform(viewportTransform);
  }

  handleMoveEnd(evt) {
    const viewportTransform = this.editor.viewportTransform;
    const canvasWidth = this.editor.canvasWidth;
    const canvasHeight = this.editor.canvasHeight;

    const offsetX = viewportTransform[4];
    const offsetY = viewportTransform[5];

    // if (this._getWidth + offsetX < canvasWidth) {
    //   viewportTransform[4] = -(this._getWidth - canvasWidth);
    // }

    // if (offsetX > 0) {
    //   viewportTransform[4] = 0;
    // }

    if (this._getWidth > canvasWidth) {
      console.log("进来了", offsetX, this._offsetX);
      if (offsetX > 0) {
        viewportTransform[4] = 0;
      }

      if (this._getWidth + offsetX < canvasWidth) {
        viewportTransform[4] = -(this._getWidth - canvasWidth);
      }

      // if (offsetX > -this._offsetX) {
      //   viewportTransform[4] = -this._offsetY;
      // }

      // if (offsetX < -(this._getWidth + this._offsetX - canvasWidth)) {
      //   viewportTransform[4] = canvasWidth - this._offsetX - this._getWidth;
      // }
    } else {
      viewportTransform[4] =
        (this._getWidth + this._offsetX - canvasWidth) / 2 + this._getWidth / 2;

      console.log("进来了2", viewportTransform);
    }

    if (this._getHeight > canvasHeight) {
      if (offsetY > -this._offsetY) {
        viewportTransform[5] = -this._offsetY;
      }

      if (offsetY < -(this._getHeight + this._offsetY - canvasHeight)) {
        viewportTransform[5] = canvasHeight - this._offsetY - this._getHeight;
      }
    } else {
      viewportTransform[5] = -(
        (this._getHeight + this._offsetY - canvasHeight) / 2 +
        this._getHeight / 2
      );
    }

    // if (offsetY < -this._offsetY) {
    //   console.log("进来了1");

    //   viewportTransform[5] = -this._offsetY;
    // }
    // if (offsetY + this._offsetY + this._getHeight > canvasHeight) {
    //   console.log("进来了2");

    //   viewportTransform[5] = canvasHeight - this._offsetY - this._getHeight;
    // }
    this.editor.setViewportTransform(viewportTransform);

    this.editor.render();
  }

  get _getWidth() {
    const scale = this.editor.viewportTransform[0];
    return this.imageWidth * scale;
  }

  get _getHeight() {
    const scale = this.editor.viewportTransform[0];

    return this.imageHeight * scale;
  }

  get _offsetX() {
    const scale = this.editor.viewportTransform[0];

    return this.dx * scale;
  }

  get _offsetY() {
    const scale = this.editor.viewportTransform[0];

    return this.dy * scale;
  }
}
