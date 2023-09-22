if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  var eventsExports = {};
  var events = {
    get exports() {
      return eventsExports;
    },
    set exports(v) {
      eventsExports = v;
    }
  };
  var R = typeof Reflect === "object" ? Reflect : null;
  var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };
  var ReflectOwnKeys;
  if (R && typeof R.ownKeys === "function") {
    ReflectOwnKeys = R.ownKeys;
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target);
    };
  }
  function ProcessEmitWarning(warning) {
    if (console && console.warn)
      formatAppLog("warn", "at node_modules/events/events.js:46", warning);
  }
  var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
    return value !== value;
  };
  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  events.exports = EventEmitter;
  eventsExports.once = once;
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.prototype._events = void 0;
  EventEmitter.prototype._eventsCount = 0;
  EventEmitter.prototype._maxListeners = void 0;
  var defaultMaxListeners = 10;
  function checkListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
  }
  Object.defineProperty(EventEmitter, "defaultMaxListeners", {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
      }
      defaultMaxListeners = arg;
    }
  });
  EventEmitter.init = function() {
    if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || void 0;
  };
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
    }
    this._maxListeners = n;
    return this;
  };
  function _getMaxListeners(that) {
    if (that._maxListeners === void 0)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }
  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
  };
  EventEmitter.prototype.emit = function emit(type) {
    var args = [];
    for (var i = 1; i < arguments.length; i++)
      args.push(arguments[i]);
    var doError = type === "error";
    var events2 = this._events;
    if (events2 !== void 0)
      doError = doError && events2.error === void 0;
    else if (!doError)
      return false;
    if (doError) {
      var er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        throw er;
      }
      var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
      err.context = er;
      throw err;
    }
    var handler = events2[type];
    if (handler === void 0)
      return false;
    if (typeof handler === "function") {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        ReflectApply(listeners[i], this, args);
    }
    return true;
  };
  function _addListener(target, type, listener, prepend) {
    var m;
    var events2;
    var existing;
    checkListener(listener);
    events2 = target._events;
    if (events2 === void 0) {
      events2 = target._events = /* @__PURE__ */ Object.create(null);
      target._eventsCount = 0;
    } else {
      if (events2.newListener !== void 0) {
        target.emit(
          "newListener",
          type,
          listener.listener ? listener.listener : listener
        );
        events2 = target._events;
      }
      existing = events2[type];
    }
    if (existing === void 0) {
      existing = events2[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === "function") {
        existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
      m = _getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }
    return target;
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };
  function onceWrapper() {
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      if (arguments.length === 0)
        return this.listener.call(this.target);
      return this.listener.apply(this.target, arguments);
    }
  }
  function _onceWrap(target, type, listener) {
    var state = { fired: false, wrapFn: void 0, target, type, listener };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
  }
  EventEmitter.prototype.once = function once2(type, listener) {
    checkListener(listener);
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    checkListener(listener);
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events2, position, i, originalListener;
    checkListener(listener);
    events2 = this._events;
    if (events2 === void 0)
      return this;
    list = events2[type];
    if (list === void 0)
      return this;
    if (list === listener || list.listener === listener) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else {
        delete events2[type];
        if (events2.removeListener)
          this.emit("removeListener", type, list.listener || listener);
      }
    } else if (typeof list !== "function") {
      position = -1;
      for (i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }
      if (position < 0)
        return this;
      if (position === 0)
        list.shift();
      else {
        spliceOne(list, position);
      }
      if (list.length === 1)
        events2[type] = list[0];
      if (events2.removeListener !== void 0)
        this.emit("removeListener", type, originalListener || listener);
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events2, i;
    events2 = this._events;
    if (events2 === void 0)
      return this;
    if (events2.removeListener === void 0) {
      if (arguments.length === 0) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      } else if (events2[type] !== void 0) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else
          delete events2[type];
      }
      return this;
    }
    if (arguments.length === 0) {
      var keys = Object.keys(events2);
      var key;
      for (i = 0; i < keys.length; ++i) {
        key = keys[i];
        if (key === "removeListener")
          continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners("removeListener");
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
      return this;
    }
    listeners = events2[type];
    if (typeof listeners === "function") {
      this.removeListener(type, listeners);
    } else if (listeners !== void 0) {
      for (i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(type, listeners[i]);
      }
    }
    return this;
  };
  function _listeners(target, type, unwrap) {
    var events2 = target._events;
    if (events2 === void 0)
      return [];
    var evlistener = events2[type];
    if (evlistener === void 0)
      return [];
    if (typeof evlistener === "function")
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
  }
  EventEmitter.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
  };
  EventEmitter.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
  };
  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === "function") {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };
  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events2 = this._events;
    if (events2 !== void 0) {
      var evlistener = events2[type];
      if (typeof evlistener === "function") {
        return 1;
      } else if (evlistener !== void 0) {
        return evlistener.length;
      }
    }
    return 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };
  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i)
      copy[i] = arr[i];
    return copy;
  }
  function spliceOne(list, index) {
    for (; index + 1 < list.length; index++)
      list[index] = list[index + 1];
    list.pop();
  }
  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }
  function once(emitter, name) {
    return new Promise(function(resolve, reject) {
      function errorListener(err) {
        emitter.removeListener(name, resolver);
        reject(err);
      }
      function resolver() {
        if (typeof emitter.removeListener === "function") {
          emitter.removeListener("error", errorListener);
        }
        resolve([].slice.call(arguments));
      }
      eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
      if (name !== "error") {
        addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
      }
    });
  }
  function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    if (typeof emitter.on === "function") {
      eventTargetAgnosticAddListener(emitter, "error", handler, flags);
    }
  }
  function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === "function") {
      if (flags.once) {
        emitter.once(name, listener);
      } else {
        emitter.on(name, listener);
      }
    } else if (typeof emitter.addEventListener === "function") {
      emitter.addEventListener(name, function wrapListener(arg) {
        if (flags.once) {
          emitter.removeEventListener(name, wrapListener);
        }
        listener(arg);
      });
    } else {
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    }
  }
  const ToolModeEnum = {
    // 自由绘制
    PAINT: "PAINT",
    RECT: "RECT",
    TEXT: "TEXT",
    CROP: "CROP"
  };
  function getDistance(p1, p2) {
    var x = p2.pageX - p1.pageX, y = p2.pageY - p1.pageY;
    return Math.sqrt(x * x + y * y);
  }
  function getAngle(p1, p2) {
    var x = p1.pageX - p2.pageX, y = p1.pageY - p2.pageY;
    return Math.atan2(y, x) * 180 / Math.PI;
  }
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
      formatAppLog("log", "at pages/index/ImageEditor/core/object.js:53", "handleTouchend");
      this.scaleX += this.moveScale;
      this.scaleY += this.moveScale;
      this.moveScale = 0;
    }
  }
  class Rectangle extends BasicObject {
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
  class InitPaintRect {
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
  class InitBackgroundImage {
    constructor({ src, editor, cropCtx }) {
      this.imageWidth = null;
      this.imageHeight = null;
      this.startPoint = {
        x: 0,
        y: 0
      };
      this.distance = 0;
      this.lineWidth = 8;
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
      formatAppLog("log", "at pages/index/ImageEditor/core/initBackgroundImage.js:35", this._getMinScale);
      const touches = evt.touches;
      if (touches.length <= 1) {
        this.handleMoveStart(evt);
      } else {
        this.distance = getDistance(touches[0], touches[1]);
      }
      this.editor.on("touchmove", this.bindHandleTouchmove);
      this.editor.on("touchend", this.bindHandleTouchend);
    }
    setCenterPoint([touch1, touch2]) {
      const _centerX = (touch1.pageX + touch2.pageX) / 2;
      const _centerY = (touch1.pageY + touch2.pageY) / 2;
      const viewportTransform = this.editor.viewportTransform;
      const centerX = viewportTransform[4] + (1 - viewportTransform[0]) * (viewportTransform[4] - _centerX) / viewportTransform[0];
      const centerY = viewportTransform[5] + (1 - viewportTransform[0]) * (viewportTransform[5] - _centerY) / viewportTransform[0];
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
        fail: (error) => {
        }
      });
    }
    draw(ctx) {
      if (!this.src || !this.imageWidth || !this.imageHeight)
        return;
      const imageWidth = this.imageWidth;
      const imageHeight = this.imageHeight;
      ctx.drawImage(this.src, this.dx, this.dy, imageWidth, imageHeight);
    }
    handleMoveStart(evt) {
      const touch = evt.touches[0];
      this.startPoint = {
        x: touch.pageX,
        y: touch.pageY
      };
    }
    handleMove(evt) {
      const touch = evt.touches[0];
      const movePoint = {
        x: touch.pageX,
        y: touch.pageY
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
      let newX = (x - centerX) * Math.cos(degrees * Math.PI / 180) - (y - centerY) * Math.sin(degrees * Math.PI / 180) + centerX;
      let newY = (x - centerX) * Math.sin(degrees * Math.PI / 180) + (y - centerY) * Math.cos(degrees * Math.PI / 180) + centerY;
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
      formatAppLog(
        "log",
        "at pages/index/ImageEditor/core/initBackgroundImage.js:225",
        `offset${offsetY}; height${this._getHeight};transform ${this.editor.transform(
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
  class ImageEditor extends eventsExports {
    constructor({ getContext, getBottomContext, width, height }) {
      super();
      // object list
      this.objects = [];
      // tool mode
      this.mode = ToolModeEnum.CROP;
      // mode = null;
      this.scale = 1;
      this.centerPoint = [0, 0];
      this.viewportTransform = [1, 0, 0, 1, 0, 0];
      this.angle = Math.PI / 2;
      this.ctx = getContext();
      this.ctx2 = getBottomContext();
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.init();
    }
    init() {
      new InitPaintRect(this);
      this.setCenterPoint([this.canvasWidth / 2, this.canvasHeight / 2]);
      this.backgroundImage = new InitBackgroundImage({
        src: "/static/21695106089_.pic.jpg",
        editor: this,
        cropCtx: this.ctx2
      });
      this.render();
    }
    onTouchstart(evt) {
      this.emit("touchstart", evt);
    }
    onTouchmove(evt) {
      this.emit("touchmove", evt);
    }
    onTouchend(evt) {
      this.emit("touchend", evt);
    }
    add(obj) {
      this.objects.push(obj);
    }
    remove(obj) {
      const index = this.objects.findIndex((d) => d === obj);
      if (index > -1) {
        this.objects.splice(index, 1);
      }
    }
    render() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx2.clearRect(0, 0, this.width, this.height);
      this.ctx.save();
      const [scaleX, s1, s2, scaleY, offsetX, offsetY] = this.viewportTransform;
      const [centerX, centerY] = this.centerPoint;
      this.ctx.translate(centerX, centerY);
      this.ctx.scale(scaleX, scaleY);
      this.ctx.rotate(this.angle);
      this.ctx.translate(-centerX, -centerY);
      this.ctx.translate(...this.transform(offsetX, offsetY, this.angle));
      this.backgroundImage.draw(this.ctx);
      this.objects.forEach((obj) => {
        obj.draw(this.ctx);
      });
      this.ctx.draw();
      this.ctx.restore();
      this.ctx2.draw();
    }
    getActiveObject() {
      const existItem = this.objects.find((obj) => obj.isActive);
      return existItem;
    }
    getInsideObj({ x, y }) {
      const len = this.objects.length - 1;
      for (let i = len; i >= 0; i--) {
        const obj = this.objects[i];
        if (obj.isInside(x, y)) {
          this.setActiveObject(obj);
          return obj;
        }
      }
    }
    setActiveObject(obj) {
      this.objects.forEach((d) => d.setActiveState(false));
      this.timer && clearTimeout(this.timer);
      obj.setActiveState(true);
      this.render();
      this.timer = setTimeout(() => {
        obj.setActiveState(false);
        this.render();
      }, 3e3);
    }
    setViewportTransform(viewportTransform) {
      this.viewportTransform = viewportTransform;
    }
    setCenterPoint(point) {
      this.centerPoint = point;
    }
    // 根据旋转角度转换坐标
    transform(x, y, angle) {
      const dx = x * Math.cos(angle) + y * Math.sin(angle);
      const dy = -x * Math.sin(angle) + y * Math.cos(angle);
      return [dx, dy];
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$1 = {
    data() {
      return {
        show: false,
        isStart: false
      };
    },
    onLoad() {
    },
    methods: {
      onBlur(e) {
        formatAppLog("log", "at pages/index/index.vue:39", e, "onBlur");
      },
      onTouchstart(e) {
        this.editor.onTouchstart(e);
      },
      onTouchmove(e) {
        this.editor.onTouchmove(e);
      },
      onTouchend(e) {
        this.editor.onTouchend(e);
      }
    },
    mounted() {
      const ctx = uni.createCanvasContext("canvasTop", this);
      const ctx2 = uni.createCanvasContext("canvasBottom", this);
      const query = uni.createSelectorQuery().in(this);
      query.select("#canvasTop").boundingClientRect((data) => {
        this.editor = new ImageEditor({
          getContext() {
            return ctx;
          },
          getBottomContext() {
            return ctx2;
          },
          ...data
        });
      }).exec();
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "content",
        onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.onTouchstart && $options.onTouchstart(...args)),
        onTouchmove: _cache[2] || (_cache[2] = (...args) => $options.onTouchmove && $options.onTouchmove(...args)),
        onTouchend: _cache[3] || (_cache[3] = (...args) => $options.onTouchend && $options.onTouchend(...args))
      },
      [
        vue.createElementVNode("canvas", {
          "canvas-id": "canvasTop",
          id: "canvasTop",
          class: "canvas-top"
        }),
        vue.createElementVNode("canvas", {
          "canvas-id": "canvasBottom",
          id: "canvasBottom",
          class: "canvas-top"
        }),
        $data.show ? (vue.openBlock(), vue.createElementBlock(
          "textarea",
          {
            key: 0,
            onBlur: _cache[0] || (_cache[0] = (...args) => $options.onBlur && $options.onBlur(...args)),
            type: "text",
            "auto-focus": "",
            class: "text-edit"
          },
          null,
          32
          /* HYDRATE_EVENTS */
        )) : vue.createCommentVNode("v-if", true)
      ],
      32
      /* HYDRATE_EVENTS */
    );
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/Users/painduan/Desktop/code/demo/uniapp-image-editor/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/painduan/Desktop/code/demo/uniapp-image-editor/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
