<template>
  <view
    class="content"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
  >
    <canvas canvas-id="canvasTop" id="canvasTop" class="canvas-top"></canvas>
    <canvas
      canvas-id="canvasBottom"
      id="canvasBottom"
      class="canvas-top"
    ></canvas>

    <textarea
      @blur="onBlur"
      v-if="show"
      type="text"
      auto-focus
      class="text-edit"
    ></textarea>
  </view>
</template>

<script>
import { ImageEditor } from "./ImageEditor/core/index";

export default {
  data() {
    return {
      show: false,

      isStart: false,
    };
  },
  onLoad() {},
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
    },
  },
  mounted() {
    const ctx = uni.createCanvasContext("canvasTop", this);
    const ctx2 = uni.createCanvasContext("canvasBottom", this);
    const query = uni.createSelectorQuery().in(this);
    query
      .select("#canvasTop")
      .boundingClientRect((data) => {
        this.editor = new ImageEditor({
          getContext() {
            return ctx;
          },
          getBottomContext() {
            return ctx2;
          },
          ...data,
        });
      })
      .exec();
  },
};
</script>

<style>
.content {
  width: 100vw;
  height: 100vh;
  background-color: black;
}

.canvas-top {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
}

.text-edit {
  position: absolute;
  left: 0;
  top: 20%;
  width: 100vw;
  text-align: center;
  border: 1px solid black;
}
</style>
