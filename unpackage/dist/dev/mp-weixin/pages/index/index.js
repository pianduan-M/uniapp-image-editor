"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_index_ImageEditor_core_index = require("./ImageEditor/core/index.js");
require("./ImageEditor/enum/imageEditorModeEnum.js");
require("./ImageEditor/core/initPaintRect.js");
require("./ImageEditor/objects/Rectangle.js");
require("./ImageEditor/core/object.js");
require("./ImageEditor/utils/index.js");
require("./ImageEditor/core/initBackgroundImage.js");
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
    const ctx = common_vendor.index.createCanvasContext("canvasTop", this);
    const query = common_vendor.index.createSelectorQuery().in(this);
    query.select("#canvasTop").boundingClientRect((data) => {
      this.editor = new pages_index_ImageEditor_core_index.ImageEditor({
        getContext() {
          return ctx;
        },
        ...data
      });
    }).exec();
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/painduan/Desktop/code/demo/uniapp-image-editor/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
