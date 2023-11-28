<script setup lang="ts">
import { fabric } from 'fabric';
import { onMounted } from 'vue';

const items = [
  {
    text: '',
    requirement: {
      text: '',
    },
  },
  {
    text: '',
    requirement: {
      text: '',
    },
  },
  {
    text: '',
    requirement: {
      text: '',
    },
  },
  {
    text: '',
    requirement: {
      text: '',
    },
  },
  {
    text: '',
    requirement: {
      text: '',
    },
  },
  {
    text: '',
    requirement: {
      text: '',
    },
  },
  {
    text: '',
    requirement: {
      text: '',
    },
  },
  {
    text: '',
    requirement: {
      text: '',
    },
  },
  {
    text: '',
    requirement: {
      text: '',
    },
  },
];

onMounted(() => {
  const bgColor = '#3570c7';
  const canvas = new fabric.Canvas('c', { width: 1024, height: 500 });

  const rect = new fabric.Rect({
    top: 245,
    left: 40,
    width: 1024,
    height: 10,
    fill: bgColor,
  });

  canvas.add(rect);

  const flows = [
    '其他阿阇梨咖啡机啦阿阇梨的看法姜辣素的阿萨德法律框架阿阇梨考点附近',
    '要素保障',
    '物流',
    '贸易交易',
    '进出口',
    '生产',
    '设计',
    '研发',
  ];

  let left = 60 + 124;

  for (const [i, flowText] of flows.entries()) {
    const circle1 = new fabric.Circle({
      top: 245 - 5,
      left,
      radius: 10,
      stroke: bgColor,
      fill: '#fff',
    });

    let rect1 = new fabric.Rect({
      top: 245 + 10 + 3,
      left: left + 7,
      width: 3,
      height: 100,
      fill: bgColor,
      angle: 45,
    });

    const maxWidth = 158;

    const ctx = canvas.getContext();
    ctx.font = '16px';

    console.log(ctx.measureText('什...'), '==============')

    let tmpText = flowText;
    let width = ctx.measureText(tmpText).width;
    let el = '';

    while (width > maxWidth) {
      el = '...';
      tmpText = tmpText.slice(0, tmpText.length - 3);
      width = ctx.measureText(`${tmpText}...`).width;
    }
    tmpText = `${tmpText}${el}`;

    let text1 = new fabric.Text(tmpText, {
      top: 245 + 10 + 3 + 25 + 8,
      left: left + 7 + 16,
      fontSize: 14,
      fill: '#fff',
    });

    let textRect1 = new fabric.Rect({
      top: 245 + 10 + 3 + 25,
      left: left + 7,
      width: text1.width + 32,
      height: 32,
      fill: bgColor,
      rx: 16,
      ry: 16,
    });

    if (i % 2 !== 0) {
      rect1 = new fabric.Rect({
        top: 245 - 5,
        left: left + 10,
        width: 3,
        height: 100,
        fill: bgColor,
        angle: 135,
        backgroundColor: bgColor,
      });

      textRect1 = new fabric.Rect({
        top: 245 - 5 - 25 - 10 - 21,
        left: left + 10,
        width: text1.width + 32,
        height: 32,
        fill: bgColor,
        rx: 16,
        ry: 16,
      });

      text1 = new fabric.Text(flowText, {
        top: 245 - 5 - 25 - 10 + 8 - 21,
        left: left + 10 + 16,
        fontSize: 14,
        fill: '#fff',
        lineHeight: 22,
      });
    }

    text1.left = text1.left - 40 - (text1.width + 32) / 2;
    textRect1.left = textRect1.left - 40 - (text1.width + 32) / 2;
    canvas.add(rect1);
    canvas.add(textRect1);
    canvas.add(text1);
    canvas.add(circle1);

    left += 100;
  }

  const triangle = new fabric.Triangle({
    top: 245 - Math.sin((50 * Math.PI) / 180) * 100 - 15,
    left: 60 + Math.cos((50 * Math.PI) / 180) * 100 + 20,
    width: 10,
    height: 15,
    angle: 50,
    fill: bgColor,
  });

  canvas.add(triangle);

  console.log(245 - Math.sin((50 * Math.PI) / 180) * 100 + Math.sin((50 * Math.PI) / 180) * 15);
});
</script>

<template>
  <canvas id="c"></canvas>
</template>

<style lang="less" scoped>
#c {
  box-sizing: border-box;
  border: 1px solid #ccc;
}
</style>
