<template>
  <view
    class="content"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
  >
    <canvas canvas-id="canvasTop" id="canvasTop" class="canvas-top"></canvas>
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
import Rectangle from "./ImageEditor/components/Rectangle";
import IText from "./ImageEditor/components/IText";

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
      if (!this.isStart) return;
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
      // console.log(e);
    },
    onTouchend(e) {
      this.isStart = false;
      // this.rect = null;
    },
  },
  mounted() {
    setTimeout(() => {
      this.show = true;

      const ctx = uni.createCanvasContext("canvasTop", this);

      this.ctx = ctx;

      const testText =
        "jdpoasjdo测试对哦时间佛皮带司机撒泼哦记得富婆阿是觉得泼洒降低撒娇斗破加上破煞识破金佛寺阿姐";
      const text = new IText({ text: testText, y: 100 });
      text.draw(ctx);
      ctx.draw();
    });
  },
};
</script>

<style>
.canvas-top {
  width: 100vw;
  height: 100vh;
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
