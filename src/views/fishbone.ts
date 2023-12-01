import { fabric } from 'fabric';
import headImg from './imgs/head.svg?url';
import tailImg from './imgs/tail.svg?url';

type FlowType = {
  text: string;
  requirements: Array<{
    text: string;
  }>;
};

export default class Fishbone {
  private canvas: fabric.Canvas;
  private basePosition: { left: number; top: number };
  private mainSize = { width: 0, height: 10 };

  private interactionOptions = {
    hoverCursor: 'pointer',
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockSkewingX: true,
    lockSkewingY: true,
    lockScalingFlip: true,
    selectable: false,
  };

  constructor(
    private element: string | HTMLCanvasElement,
    private flowItems: Array<FlowType>,
    private options: fabric.ICanvasOptions & {
      primaryBgColor: string;
    },
  ) {
    this.init();
  }

  private init() {
    this.mainSize.width = 144 + this.flowItems.length * 110;
    this.canvas = new fabric.Canvas(this.element, { defaultCursor: 'grab', ...this.options });
    this.basePosition = {
      left: (this.options.width - this.mainSize.width - 156) / 2 + 36,
      top: this.options.height / 2 + 5,
    };
    this.dragAndZoom();
  }

  private dragAndZoom() {
    this.canvas.on('mouse:wheel', opt => {
      const delta = opt.e.deltaY;
      let zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();

      // 设置画布边界
      // const vpt = this.canvas.viewportTransform;
      // if (zoom < 400 / 1000) {
      //   vpt[4] = 200 - (1000 * zoom) / 2;
      //   vpt[5] = 200 - (1000 * zoom) / 2;
      // } else {
      //   if (vpt[4] >= 0) {
      //     vpt[4] = 0;
      //   } else if (vpt[4] < this.canvas.getWidth() - 1000 * zoom) {
      //     vpt[4] = this.canvas.getWidth() - 1000 * zoom;
      //   }
      //   if (vpt[5] >= 0) {
      //     vpt[5] = 0;
      //   } else if (vpt[5] < this.canvas.getHeight() - 1000 * zoom) {
      //     vpt[5] = this.canvas.getHeight() - 1000 * zoom;
      //   }
      // }
    });

    this.canvas.on('mouse:down', function (opt) {
      const evt = opt.e;
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
    });
    this.canvas.on('mouse:move', function (opt) {
      if (this.isDragging) {
        const e = opt.e;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    this.canvas.on('mouse:up', function () {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    });
  }

  dispose() {
    this.canvas.dispose();
  }

  redraw(
    options: fabric.ICanvasOptions & {
      primaryBgColor: string;
    },
  ) {
    this.canvas.dispose();
    this.options = { ...this.options, ...options };
    this.init();
    this.draw();
  }

  draw() {
    this.drawMain();
    this.drawFlows();
  }

  private drawMain() {
    const fishbone = new fabric.Rect({
      ...this.basePosition,
      ...this.mainSize,
      fill: this.options.primaryBgColor,
      ...this.interactionOptions,
      hoverCursor: 'grab',
    });

    this.canvas.add(fishbone);

    fabric.loadSVGFromURL(headImg, (objects, options) => {
      const svgData = fabric.util.groupSVGElements(objects, options);
      svgData.left = this.basePosition.left + this.mainSize.width - 1;
      svgData.top = this.basePosition.top - 57;

      svgData.setOptions({ ...this.interactionOptions, hoverCursor: 'grab' });

      this.canvas.add(svgData);
    });

    fabric.loadSVGFromURL(tailImg, (objects, options) => {
      const svgData = fabric.util.groupSVGElements(objects, options);
      svgData.left = this.basePosition.left - 34;
      svgData.top = this.basePosition.top - 46;

      svgData.setOptions({ ...this.interactionOptions, hoverCursor: 'grab' });

      this.canvas.add(svgData);
    });
  }

  private drawFlows() {
    const position = {
      left: this.basePosition.left + this.mainSize.width - 50,
      top: this.basePosition.top + 5,
    };

    this.flowItems.forEach((item, i) => {
      const isUp = i % 2 === 0;

      this.drawFlowNode(isUp, position, item);
      this.drawFlowText(isUp, position, item);
      this.drawFlowRequirements(isUp, position, item);

      position.left -= 110;
    });
  }

  private drawFlowNode(isUp: boolean, position: { left: number; top: number }, item: FlowType) {
    const flowNode = new fabric.Circle({
      left: position.left - 15,
      top: position.top - 10,
      radius: 10,
      stroke: this.options.primaryBgColor,
      fill: '#fff',
      ...this.interactionOptions,
      hoverCursor: 'grab',
    });

    const requirementLine = new fabric.Rect({
      left: position.left + 2,
      top: position.top,
      width: 3,
      height: 120 + item.requirements.length * 43,
      fill: this.options.primaryBgColor,
      angle: 135,
      ...this.interactionOptions,
      hoverCursor: 'grab',
    });

    if (!isUp) {
      requirementLine.setOptions({
        left: position.left,
        top: position.top - 1,
        angle: 45,
      });
    }

    this.canvas.add(requirementLine);
    this.canvas.add(flowNode);
  }

  private drawFlowText(isUp: boolean, position: { left: number; top: number }, item: FlowType) {
    const flowText = new fabric.Text(item.text, {
      top: position.top - 14 - 10 - 30,
      fontSize: 14,
      fill: '#fff',
      ...this.interactionOptions,
    });

    const containerPosition = {
      left: position.left - 46 - (flowText.width + 32) / 2,
      top: position.top - 32 - 30,
    };

    const flowTextContainer = new fabric.Rect({
      ...containerPosition,
      width: flowText.width + 32,
      height: 32,
      fill: this.options.primaryBgColor,
      rx: 16,
      ry: 16,
      ...this.interactionOptions,
    });

    flowText.left = position.left - 46 - flowText.width / 2;

    if (!isUp) {
      flowText.setOptions({ top: position.top + 38 });
      flowTextContainer.setOptions({ top: position.top + 30 });
    }

    flowText.on('mousedown', () => {
      console.log('lsakdjlaksdjfl');
    });
    flowTextContainer.on('mousedown', () => {
      console.log('alskdjslakdfl=======');
    });

    this.canvas.add(flowTextContainer, flowText);
  }

  private drawFlowRequirements(isUp: boolean, position: { left: number; top: number }, flowItem: FlowType) {
    const basePosition = {
      left: position.left - 10 - 50,
      top: position.top - 10 - 50,
    };

    flowItem.requirements.forEach((item, i) => {
      const circle = new fabric.Circle({
        ...basePosition,
        left: basePosition.left - 30 * (i + 1),
        top: basePosition.top - 30 * (i + 1),
        radius: 5,
        // TODO 根据状态判断颜色
        fill: 'red',
        ...this.interactionOptions,
      });

      if (!isUp) {
        circle.top = position.top + 51 + 30 * (i + 1);
      }

      this.drawRequirement({ left: circle.left, top: circle.top }, item);

      this.canvas.add(circle);
    });
  }

  private drawRequirement(position: { left: number; top: number }, item: FlowType['requirements'][number]) {
    const ellipsisText = this.calcEllipsis(item.text);
    const text = new fabric.Text(ellipsisText, {
      ...position,
      top: position.top - 5,
      fontSize: 16,
      ...this.interactionOptions,
    });

    text.left = text.left - 8 - text.width;

    this.canvas.add(text);
  }

  private calcEllipsis(text: string) {
    const maxWidth = 110;
    const ctx = this.canvas.getContext();
    ctx.font = '16px';

    let tmpText = text;
    let width = ctx.measureText(tmpText).width;
    const ellipsisText = width > maxWidth ? '...' : '';

    while (width > maxWidth) {
      tmpText = tmpText.slice(0, tmpText.length - 2);
      width = ctx.measureText(`${tmpText}...`).width;
    }

    return `${tmpText}${ellipsisText}`;
  }
}
