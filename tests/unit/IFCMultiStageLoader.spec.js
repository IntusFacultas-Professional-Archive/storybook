import { IFCMultiStageLoader } from '@Components/MultiStageLoader/IFCMultiStageLoader.vue';
import { mount } from '@vue/test-utils';

describe('IFCMultiStageLoader', () => {
  it('has prop defaultColors of type Number with default value being an array of colors', () => {
    const { defaultColors } = IFCMultiStageLoader.props;
    expect(defaultColors.type).toBe(Array);
    defaultColors.default().forEach((color) => expect(color.match(/(#[A-F0-9]{6})|(#[A-F0-9]{3})/g)).toBeDefined());
  });
  it('validates defaultColors', () => {
    const { validator } = IFCMultiStageLoader.props.defaultColors;
    expect(validator(['asdf'])).toBe(false);
    expect(validator([1])).toBe(false);
    expect(validator(['#123', 'asdf'])).toBe(false);
    expect(validator(['#123', '#121212'])).toBe(true);
  });
  it('has prop dimensions of type Array with default value 300', () => {
    const { dimensions } = IFCMultiStageLoader.props;
    expect(dimensions.type).toBe(Number);
    expect(dimensions.default).toBe(300);
  });
  it('has prop lineWidth of type Number with default value 25', () => {
    const { lineWidth } = IFCMultiStageLoader.props;
    expect(lineWidth.type).toBe(Number);
    expect(lineWidth.default).toBe(25);
  });
  it('has prop stages of type Array that is required', () => {
    const { stages } = IFCMultiStageLoader.props;
    expect(stages.type).toBe(Array);
    expect(stages.required).toBe(true);
  });
  it('validates stages', () => {
    const { validator } = IFCMultiStageLoader.props.stages;
    expect(validator([])).toBe(true);
    expect(validator([{

    }])).toBe(false);
    expect(validator([{
      title: 1,
    }])).toBe(false);
    expect(validator([{
      title: 'String',
    }])).toBe(false);
    expect(validator([{
      title: 'String',
      complete: 1,
    }])).toBe(false);
    expect(validator([{
      title: 'String',
      complete: false,
    }])).toBe(true);
    expect(validator([{
      title: 'String',
      complete: false,
      color: 1,
    }])).toBe(false);
    expect(validator([{
      title: 'String',
      complete: false,
      color: 'asdf',
    }])).toBe(false);
    expect(validator([{
      title: 'String',
      complete: false,
      color: '#123',
    }])).toBe(true);
    expect(validator([{
      title: 'String',
      complete: false,
      color: '#abc',
    }])).toBe(true);
    expect(validator([{
      title: 'String',
      complete: false,
      color: '#abcabc',
    }])).toBe(true);
    expect(validator([{
      title: 'String',
      complete: false,
      color: '#abcaBc',
    }])).toBe(true);
  });

  it('provides a sane fake canvas before mounting', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
    });
    wrapper.vm.$refs.canvas = undefined;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.canvas).toBeDefined();
    expect(typeof wrapper.vm.canvas === 'object').toBe(true);
    const fakeCanvasContext = wrapper.vm.canvas.getContext();
    expect(typeof fakeCanvasContext.beginPath).toEqual('function');
    expect(typeof fakeCanvasContext.arc).toEqual('function');
    expect(typeof fakeCanvasContext.stroke).toEqual('function');
    expect(typeof fakeCanvasContext.clearRect).toEqual('function');
  });
  it('fetches the canvas after mounting', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.canvas).toBeDefined();
    expect(wrapper.vm.canvas instanceof HTMLElement).toBe(true);
  });
  it('retrieves the 2d canvas context', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
    });
    wrapper.vm.canvas.getContext = jest.fn();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    // eslint-disable-next-line
    wrapper.vm.canvasContext;
    expect(wrapper.vm.canvas.getContext).toHaveBeenCalledWith('2d');
  });
  it('returns a sane canvas alternative as its created', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
    });
    expect(wrapper.vm.canvas).toBeDefined();
    expect(typeof wrapper.vm.canvas === 'object').toBe(true);
  });
  it('calculates the radius for the circle', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
    });
    expect(typeof wrapper.vm.radius === 'number').toBe(true);
    expect(wrapper.vm.radius).toEqual(wrapper.vm.dimensions / 2 - wrapper.vm.padding);
  });
  it('defines starting angles', async () => {
    global.requestAnimationFrame = jest.fn();
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentAngles).toStrictEqual([
      0,
      Math.PI,
    ]);
    expect(wrapper.vm.originalAngles).toStrictEqual([
      0,
      Math.PI,
    ]);
    expect(wrapper.vm.maxAngles).toStrictEqual([
      Math.PI,
      Math.PI * 2,
    ]);
  });
  it('divides the circle correctly based on the number of stages', async () => {
    global.requestAnimationFrame = jest.fn();
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
          {
            title: 'Stage 1',
            complete: false,
          },
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentAngles).toStrictEqual([
      0,
      (Math.PI * 2) / 3,
      (Math.PI * 4) / 3,
    ]);
    expect(wrapper.vm.originalAngles).toStrictEqual([
      0,
      (Math.PI * 2) / 3,
      (Math.PI * 4) / 3,
    ]);
    expect(wrapper.vm.maxAngles).toStrictEqual([
      (Math.PI * 2) / 3,
      (Math.PI * 4) / 3,
      (Math.PI * 2),
    ]);
  });
  it('draws each frame of the animation', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
          {
            title: 'Stage 1',
            complete: false,
          },
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
      computed: {
        canvasContext: () => ({
          clearRect: jest.fn(),
        }),
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    wrapper.vm.draw = jest.fn();
    wrapper.vm.animate();
    expect(wrapper.vm.draw).toHaveBeenCalled();
    expect(wrapper.vm.canvasContext.clearRect).toHaveBeenCalled();
  });
  it('draws all completed stages, but waits on the next non-complete stage until the previous is done animating',
    async () => {
      const wrapper = mount(IFCMultiStageLoader, {
        propsData: {
          stages: [
            {
              title: 'Stage 1',
              complete: true,
              color: '#f1f1f1',
            },
            {
              title: 'Stage 1',
              complete: false,
              color: '#f2f2f2',
            },
            {
              title: 'Stage 1',
              complete: false,
              color: '#f3f3f3',
            },
          ],
        },
        computed: {
          canvasContext: () => ({
            clearRect: jest.fn(),
          }),
        },
      });
      wrapper.vm.drawStage = jest.fn();
      wrapper.vm.draw();
      expect(wrapper.vm.drawStage).toHaveBeenNthCalledWith(1, {
        title: 'Stage 1',
        complete: true,
        color: '#f1f1f1',
      }, 0);
      expect(wrapper.vm.textColor).toBe('#f1f1f1');
    });
  it('draws all completed stages, plus next non-complete stage once the previous is done animating',
    async () => {
      const wrapper = mount(IFCMultiStageLoader, {
        propsData: {
          stages: [
            {
              title: 'Stage 1',
              complete: true,
              color: '#f1f1f1',
            },
            {
              title: 'Stage 1',
              complete: false,
            },
            {
              title: 'Stage 1',
              complete: false,
              color: '#f3f3f3',
            },
          ],
        },
        computed: {
          canvasContext: () => ({
            clearRect: jest.fn(),
          }),
        },
      });
      wrapper.vm.drawStage = jest.fn();
      /**
       * Array destructuring here would be annoying and unnecessary
       */
      /* eslint-disable-next-line */
      wrapper.vm.currentAngles[0] = wrapper.vm.maxAngles[0];
      wrapper.vm.draw();
      expect(wrapper.vm.drawStage).toHaveBeenNthCalledWith(1, {
        title: 'Stage 1',
        complete: true,
        color: '#f1f1f1',
      }, 0);
      expect(wrapper.vm.drawStage).toHaveBeenNthCalledWith(2, {
        title: 'Stage 1',
        complete: false,
      }, 1);
      expect(wrapper.vm.textColor).toBe(wrapper.vm.defaultColors[1]);
    });
  it('draws all completed stages', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: true,
            color: '#f1f1f1',
          },
          {
            title: 'Stage 1',
            complete: true,
          },
        ],
      },
      computed: {
        canvasContext: () => ({
          clearRect: jest.fn(),
        }),
      },
    });
    wrapper.vm.drawStage = jest.fn();
    /**
       * Array destructuring here would be annoying and unnecessary
       */
    /* eslint-disable-next-line */
      wrapper.vm.currentAngles[0] = wrapper.vm.maxAngles[0];
    wrapper.vm.draw();
    expect(wrapper.vm.drawStage).toHaveBeenNthCalledWith(1, {
      title: 'Stage 1',
      complete: true,
      color: '#f1f1f1',
    }, 0);
    expect(wrapper.vm.drawStage).toHaveBeenNthCalledWith(2, {
      title: 'Stage 1',
      complete: true,
    }, 1);
    expect(wrapper.vm.textColor).toBe(wrapper.vm.defaultColors[1]);
  });
  it('draws an appropriate arc for a stage', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
            color: '#f1f1f1',
          },
        ],
      },
      computed: {
        canvasContext: () => ({
          clearRect: jest.fn(),
          beginPath: jest.fn(),
          arc: jest.fn(),
          stroke: jest.fn(),
        }),
      },
    });
    wrapper.vm.drawStage(wrapper.vm.stages[0], 0);
    expect(wrapper.vm.canvasContext.beginPath).toHaveBeenCalled();
    expect(wrapper.vm.canvasContext.arc).toHaveBeenCalledWith(
      wrapper.vm.dimensions / 2,
      wrapper.vm.dimensions / 2,
      wrapper.vm.radius,
      wrapper.vm.originalAngles[0],
      wrapper.vm.originalAngles[0] + Math.PI / 180,
      false,
    );
  });
  it('draws an appropriate arc for a stage without a color', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
          },
        ],
      },
      computed: {
        canvasContext: () => ({
          clearRect: jest.fn(),
          beginPath: jest.fn(),
          arc: jest.fn(),
          stroke: jest.fn(),
        }),
      },
    });
    wrapper.vm.drawStage(wrapper.vm.stages[0], 0);
    expect(wrapper.vm.canvasContext.beginPath).toHaveBeenCalled();
    expect(wrapper.vm.canvasContext.arc).toHaveBeenCalledWith(
      wrapper.vm.dimensions / 2,
      wrapper.vm.dimensions / 2,
      wrapper.vm.radius,
      wrapper.vm.originalAngles[0],
      wrapper.vm.originalAngles[0] + Math.PI / 180,
      false,
    );
    expect(wrapper.vm.canvasContext.strokeStyle).toBe(wrapper.vm.defaultColors[0]);
  });
  it('draws an appropriate arc for a stage when the arc would exceed its end state while uncompleted', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: false,
            color: '#f1f1f1',
          },
        ],
      },
      computed: {
        canvasContext: () => ({
          clearRect: jest.fn(),
          beginPath: jest.fn(),
          arc: jest.fn(),
          stroke: jest.fn(),
        }),
      },
    });
    wrapper.vm.currentAngles[0] = wrapper.vm.maxAngles[0] - Math.PI / 360;
    wrapper.vm.drawStage(wrapper.vm.stages[0], 0);
    expect(wrapper.vm.canvasContext.beginPath).toHaveBeenCalled();
    expect(wrapper.vm.canvasContext.arc).toHaveBeenCalledWith(
      wrapper.vm.dimensions / 2,
      wrapper.vm.dimensions / 2,
      wrapper.vm.radius,
      wrapper.vm.originalAngles[0],
      wrapper.vm.maxAngles[0] - (Math.PI / 180) * 20,
      false,
    );
  });
  it('draws an appropriate arc for a stage when the arc would exceed its end state while completed', async () => {
    const wrapper = mount(IFCMultiStageLoader, {
      propsData: {
        stages: [
          {
            title: 'Stage 1',
            complete: true,
            color: '#f1f1f1',
          },
        ],
      },
      computed: {
        canvasContext: () => ({
          clearRect: jest.fn(),
          beginPath: jest.fn(),
          arc: jest.fn(),
          stroke: jest.fn(),
        }),
      },
    });
    wrapper.vm.currentAngles[0] = wrapper.vm.maxAngles[0] - Math.PI / 360;
    wrapper.vm.drawStage(wrapper.vm.stages[0], 0);
    expect(wrapper.vm.canvasContext.beginPath).toHaveBeenCalled();
    expect(wrapper.vm.canvasContext.arc).toHaveBeenCalledWith(
      wrapper.vm.dimensions / 2,
      wrapper.vm.dimensions / 2,
      wrapper.vm.radius,
      wrapper.vm.originalAngles[0],
      wrapper.vm.maxAngles[0],
      false,
    );
  });
});
