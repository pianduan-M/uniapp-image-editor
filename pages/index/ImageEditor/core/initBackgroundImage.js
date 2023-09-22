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
  lineWidth = 8;

  constructor({ src, editor, cropCtx }) {
    this.editor = editor;
    this.cropCtx = cropCtx;
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

    console.log(this._getMinScale);

    const touches = evt.touches;

    if (touches.length <= 1) {
      this.handleMoveStart(evt);
    } else {
      this.distance = getDistance(touches[0], touches[1]);
      // this.setCenterPoint(touches);
    }

    this.editor.on("touchmove", this.bindHandleTouchmove);
    this.editor.on("touchend", this.bindHandleTouchend);
  }
  setCenterPoint([touch1, touch2]) {
    const _centerX = (touch1.pageX + touch2.pageX) / 2;
    const _centerY = (touch1.pageY + touch2.pageY) / 2;

    const viewportTransform = this.editor.viewportTransform;

    const centerX =
      viewportTransform[4] +
      ((1 - viewportTransform[0]) * (viewportTransform[4] - _centerX)) /
        viewportTransform[0];
    const centerY =
      viewportTransform[5] +
      ((1 - viewportTransform[0]) * (viewportTransform[5] - _centerY)) /
        viewportTransform[0];

    this.editor.setCenterPoint([centerX, centerY]);
  }

  handleTouchmove(evt) {
    const touches = evt.touches;
    if (touches.length >= 2) {
      const newDistance = getDistance(touches[0], touches[1]);

      const scale = newDistance / this.distance;
      this.distance = newDistance;

      const viewportTransform = this.editor.viewportTransform;

      let scaleX = viewportTransform[0] * scale;

      viewportTransform[0] = scaleX;
      viewportTransform[3] = scaleX;

      // this.setCenterPoint(touches);
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

        this.dx = canvasWidth / 2 - dw / 2;
        this.dy = canvasHeight / 2 - dh / 2;

        this.imageWidth = dw;
        this.imageHeight = dh;

        this.handleMoveEnd();

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

    const distanceX = movePoint.x - this.startPoint.x;
    const distanceY = movePoint.y - this.startPoint.y;
    this.startPoint = movePoint;

    const viewportTransform = this.editor.viewportTransform;

    viewportTransform[4] += distanceX / viewportTransform[0];

    viewportTransform[5] += distanceY / viewportTransform[0];

    this.editor.setViewportTransform(viewportTransform);
  }

  /**
   * 计算旋转后的新坐标（相对于画布）
   * @param x
   * @param y
   * @param centerX
   * @param centerY
   * @param degrees
   * @returns {*[]}
   * @private
   */
  _rotatePoint(x, y, centerX, centerY, degrees) {
    let newX =
      (x - centerX) * Math.cos((degrees * Math.PI) / 180) -
      (y - centerY) * Math.sin((degrees * Math.PI) / 180) +
      centerX;
    let newY =
      (x - centerX) * Math.sin((degrees * Math.PI) / 180) +
      (y - centerY) * Math.cos((degrees * Math.PI) / 180) +
      centerY;
    return [newX, newY];
  }

  handleMoveEnd(evt) {
    const viewportTransform = this.editor.viewportTransform;
    const canvasWidth = this.editor.canvasWidth;
    const canvasHeight = this.editor.canvasHeight;

    const offsetX = viewportTransform[4];
    const offsetY = viewportTransform[5];
    let scale = viewportTransform[0];

    scale = scale > 10 ? 10 : scale;
    scale = scale < this._getMinScale ? this._getMinScale : scale;
    viewportTransform[0] = scale;
    viewportTransform[3] = scale;
    this.editor.setViewportTransform(viewportTransform);

    if (this._getWidth > canvasWidth) {
      const maxOffsetX = (this._getWidth - canvasWidth) / 2 / scale;

      if (offsetX > maxOffsetX) {
        viewportTransform[4] = maxOffsetX;
      }

      if (offsetX < -maxOffsetX) {
        viewportTransform[4] = -maxOffsetX;
      }
    } else {
      viewportTransform[4] = 0;
    }

    console.log(
      `offset${offsetY}; height${
        this._getHeight
      };transform ${this.editor.transform(
        ...viewportTransform.slice(4),
        this.editor.angle
      )}`
    );

    if (this._getHeight > canvasHeight) {
      const maxOffsetY = (this._getHeight - canvasHeight) / 2 / scale;

      if (offsetY > maxOffsetY) {
        viewportTransform[5] = maxOffsetY;
      }

      if (offsetY < -maxOffsetY) {
        viewportTransform[5] = -maxOffsetY;
      }
    } else {
      viewportTransform[5] = 0;
    }

    this.editor.setViewportTransform(viewportTransform);

    this.editor.render();
  }

  get _getWidth() {
    const scale = this.editor.viewportTransform[0];
    const [imageWidth] = this.editor.transform(
      this.imageWidth,
      this.imageHeight,
      this.editor.angle
    );
    return Math.abs(imageWidth * scale);
  }

  get _getHeight() {
    const scale = this.editor.viewportTransform[0];
    const [imageWidth, imageHeight] = this.editor.transform(
      this.imageWidth,
      this.imageHeight,
      this.editor.angle
    );
    return Math.abs(imageHeight * scale);
  }

  get _getMinScale() {
    const { canvasWidth, canvasHeight } = this.editor;

    const [dw, dh] = this.editor.transform(
      this.imageWidth,
      this.imageHeight,
      this.editor.angle
    );

    return Math.min(canvasWidth / Math.abs(dw), canvasHeight / Math.abs(dh));
  }
}
