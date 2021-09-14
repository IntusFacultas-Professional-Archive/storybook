import { mount } from '@vue/test-utils';
import IFCTableCell from '@Components/Table/TableCell/IFCTableCell.vue';
import IFCTableHeader from '@Components/Table/TableHeader/IFCTableHeader.vue';
import ResizeObserver from 'resize-observer-polyfill';

describe('IFCTableCell', () => {
  it('has variant of type: String with default: \'default\'', () => {
    const { variant } = IFCTableCell.mixins[0].props;
    expect(variant.type).toBe(String);
    expect(variant.default).toBe('default');
  });
  it('has fitContent of type: Boolean with default: false', () => {
    const { fitContent } = IFCTableCell.mixins[0].props;
    expect(fitContent.type).toBe(Boolean);
    expect(fitContent.default).toBe(false);
  });
  it('has textAlign of type: String with default: \'left\'', () => {
    const { textAlign } = IFCTableCell.mixins[0].props;
    expect(textAlign.type).toBe(String);
    expect(textAlign.default).toBe('left');
  });
  it('has interactive of type: Boolean with default: false', () => {
    const { interactive } = IFCTableCell.mixins[0].props;
    expect(interactive.type).toBe(Boolean);
    expect(interactive.default).toBe(false);
  });
  it('has pinnable of type: Boolean with default: false', () => {
    const { pinnable } = IFCTableCell.mixins[0].props;
    expect(pinnable.type).toBe(Boolean);
    expect(pinnable.default).toBe(false);
  });
  it('has pinned of type: Boolean with default: false', () => {
    const { pinned } = IFCTableCell.mixins[0].props;
    expect(pinned.type).toBe(Boolean);
    expect(pinned.default).toBe(false);
  });
  it('has left of type: Number with default: 0', () => {
    const { left } = IFCTableCell.mixins[0].props;
    expect(left.type).toBe(Number);
    expect(left.default).toBe(0);
  });
  it('has grid of type: Boolean with default: false', () => {
    const { grid } = IFCTableCell.mixins[0].props;
    expect(grid.type).toBe(Boolean);
    expect(grid.default).toBe(false);
  });
  it('has sizing of type: String with default: \'regular\'', () => {
    const { sizing } = IFCTableCell.mixins[0].props;
    expect(sizing.type).toBe(String);
    expect(sizing.default).toBe('regular');
  });
  it('has resizeable of type: Boolean with default: false', () => {
    const { resizeable } = IFCTableCell.mixins[0].props;
    expect(resizeable.type).toBe(Boolean);
    expect(resizeable.default).toBe(false);
  });
  it('mounts an observer if resizeable is set to true after mount', async () => {
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: false,
      },
    });
    wrapper.vm.setupObserver = jest.fn();
    wrapper.setProps({ resizeable: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.setupObserver).toHaveBeenCalled();
  });
  it('creates a resizeobserver on setupObserver', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: true,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.setupObserver();
    jest.runAllTimers();
    expect(wrapper.vm.observer instanceof ResizeObserver).toBe(true);
  });
  it('has a callback handler for resizeobserver that calls clearStyling', async () => {
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: true,
      },
    });
    wrapper.vm.clearStyling = jest.fn();
    wrapper.vm.handleResize();
    expect(wrapper.vm.clearStyling).toHaveBeenCalled();
  });
  it('clears styling and forces update', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: true,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.vm.clearStyling();
    jest.runAllTimers();
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
  it('debounces clear styling', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: true,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.vm.clearStyling();
    wrapper.vm.clearStyling();
    wrapper.vm.clearStyling();
    wrapper.vm.clearStyling();
    jest.runAllTimers();
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalledTimes(1);
  });
  it('Computes appropriate inline styling for a regular cell', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: true,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedStyle).toStrictEqual({
      'text-align': wrapper.vm.textAlign,
      'min-width': wrapper.vm.minimumCellWidth,
    });
  });
  it('Computes appropriate inline styling for a pinned cell', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: true,
        pinned: true,
        left: 0,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedStyle).toStrictEqual({
      'text-align': wrapper.vm.textAlign,
      'min-width': wrapper.vm.minimumCellWidth,
      left: `${wrapper.vm.left}px`,
    });
  });

  it('mounts an observer if resizeable is set to true', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: true,
      },
    });
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.observer).toBeInstanceOf(ResizeObserver);
  });
  it('does not mount an observer if resizeable is set to false', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: false,
      },
    });
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.observer).toBe(null);
  });
  it('stops observing resize before destroy', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableCell, {
      propsData: {
        resizeable: true,
      },
    });
    jest.advanceTimersByTime(1000);
    wrapper.vm.observer.disconnect = jest.fn();
    wrapper.destroy();
    expect(wrapper.vm.observer.disconnect).toHaveBeenCalled();
  });
});

describe('IFCTableHeader', () => {
  it('mounts an observer if resizeable is set to true', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableHeader, {
      propsData: {
        resizeable: true,
      },
    });
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.observer).toBeInstanceOf(ResizeObserver);
  });
  it(' does not mount an observer if resizeable is set to false', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableHeader, {
      propsData: {
        resizeable: false,
      },
    });
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.observer).toBe(null);
  });
  it('stops observing resize before destroy', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableHeader, {
      propsData: {
        resizeable: true,
      },
    });
    jest.advanceTimersByTime(1000);
    wrapper.vm.observer.disconnect = jest.fn();
    wrapper.destroy();
    expect(wrapper.vm.observer.disconnect).toHaveBeenCalled();
  });
});
