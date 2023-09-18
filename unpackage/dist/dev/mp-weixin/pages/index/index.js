"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_index_ImageEditor_components_Rectangle = require("./ImageEditor/components/Rectangle.js");
const pages_index_ImageEditor_components_IText = require("./ImageEditor/components/IText.js");
const _sfc_main = {
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
      console.log(e, "onBlur");
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
        this.rect = new pages_index_ImageEditor_components_Rectangle.Rectangle({ color: "transparent", x, y });
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
      const ctx = common_vendor.index.createCanvasContext("canvasTop", this);
      this.ctx = ctx;
      const testText = "jdpoasjdo测试对哦时间佛皮带司机撒泼哦记得富婆阿是觉得泼洒降低撒娇斗破加上破煞识破金佛寺阿姐";
      const text = new pages_index_ImageEditor_components_IText.IText({ text: testText, y: 100 });
      text.draw(ctx);
      ctx.draw();
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.show
  }, $data.show ? {
    b: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args))
  } : {}, {
    c: common_vendor.o((...args) => $options.onTouchstart && $options.onTouchstart(...args)),
    d: common_vendor.o((...args) => $options.onTouchmove && $options.onTouchmove(...args)),
    e: common_vendor.o((...args) => $options.onTouchend && $options.onTouchend(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/pianduan/Documents/code/demo/uniapp/pd-image-editor/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
