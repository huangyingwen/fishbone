<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import Fishbone from './fishbone';

const items = [
  {
    text: '研发',
    requirements: [
      {
        text: '需求什么需求怎么弄呢不知道怎么弄，先想想',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
    ],
  },
  {
    text: '设计',
    requirements: [
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
    ],
  },
  {
    text: '生产',
    requirements: [
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
    ],
  },
  {
    text: '进出口',
    requirements: [
      {
        text: '',
      },
    ],
  },
  {
    text: '贸易交易',
    requirements: [
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
    ],
  },
  {
    text: '物流',
    requirements: [
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
    ],
  },
  {
    text: '要素保障',
    requirements: [
      {
        text: '需求1',
      },
      {
        text: '需求1',
      },
      {
        text: '需求什么需求怎么弄呢不知道怎么弄，先想想',
      },
    ],
  },
  {
    text: '其他',
    requirements: [
      {
        text: '需求1',
      },
    ],
  },
];

let fishbone: Fishbone;

onMounted(() => {
  fishbone = new Fishbone('c', items, { width: 1200, height: 716, primaryBgColor: '#3570c7' });
  fishbone.draw();
});

const canvasDom = ref<HTMLCanvasElement>();
const canvasWrapDom = ref<HTMLDivElement>();

const fullscreen = ref<boolean>(false);

const handleFullscreenchange = () => {
  fullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  canvasWrapDom.value?.addEventListener('fullscreenchange', handleFullscreenchange);

  window.addEventListener('resize', () => {
    console.log(window.innerWidth, window.innerHeight, '==========================');
    fishbone.redraw({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });
});

onUnmounted(() => {
  canvasWrapDom.value?.removeEventListener('fullscreenchange', handleFullscreenchange);
});

const handleFullScreen = () => {
  if (fullscreen.value) {
    document.exitFullscreen();
  } else {
    canvasWrapDom?.value?.requestFullscreen();
  }
  fullscreen.value = !fullscreen.value;
};
</script>

<template>
  <button @click="handleFullScreen">放大</button>
  <div class="canvasWrap" ref="canvasWrapDom">
    <canvas id="c" ref="canvasDom"></canvas>
  </div>
</template>

<style lang="less" scoped>
.canvasWrap {
  width: 1200px;
  height: 716px;
  background: #f7f9fb;
  border: 1px solid #c0c4cc;
  overflow: hidden;
}
</style>
