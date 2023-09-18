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
      formatAppLog("log", "at pages/index/ImageEditor/components/IText.js:23", texts, "texts");
      let startY = this.y;
      texts.map((t) => {
        ctx.fillText(t, this.startX, startY);
        startY += this.fontSize * 1.5;
      });
    }
    formatText(text) {
      const result = [];
      text.split("\n").map((t) => {
        formatAppLog("log", "at pages/index/ImageEditor/components/IText.js:37", this.ctx.measureText(t), "this.ctx.measureText(t)");
        const w = this.startX + this.ctx.measureText(t).width;
        formatAppLog("log", "at pages/index/ImageEditor/components/IText.js:40", w, "w");
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
      formatAppLog("log", "at pages/index/ImageEditor/components/IText.js:70", result, "result");
      return result;
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
        formatAppLog("log", "at pages/index/index.vue:34", e, "onBlur");
      },
      onTouchstart(e) {
        this.isStart = true;
        const event = e.touches[0];
        const x = event.clientX;
        const y = event.clientY;
        if (this.rect && this.rect.isInside(x, y)) {
          this.moveRect = this.rect;
          this.moveRect.setMoveStart(x, y);
        } else {
          this.rect = new Rectangle({ color: "transparent", x, y });
          this.moveRect = null;
        }
      },
      onTouchmove(e) {
        if (!this.isStart)
          return;
        const event = e.touches[0];
        const x = event.clientX;
        const y = event.clientY;
        if (this.moveRect) {
          this.moveRect.move(x, y);
        } else {
          this.rect.endX = x;
          this.rect.endY = y;
        }
        this.rect.draw(this.ctx);
        this.ctx.draw();
      },
      onTouchend(e) {
        this.isStart = false;
      }
    },
    mounted() {
      setTimeout(() => {
        this.show = true;
        const ctx = uni.createCanvasContext("canvasTop", this);
        this.ctx = ctx;
        const testText = "jdpoasjdo测试对哦时间佛皮带司机撒泼哦记得富婆阿是觉得泼洒降低撒娇斗破加上破煞识破金佛寺阿姐";
        const text = new IText({ text: testText, y: 100 });
        text.draw(ctx);
        ctx.draw();
      });
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
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/Users/pianduan/Documents/code/demo/uniapp/pd-image-editor/pages/index/index.vue"]]);
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/pianduan/Documents/code/demo/uniapp/pd-image-editor/App.vue"]]);
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
